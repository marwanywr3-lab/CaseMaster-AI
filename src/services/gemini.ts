import { GoogleGenAI } from '@google/genai';
import {
  CaseDifficulty,
  LegalSystem,
  CaseLength,
  Language,
  EngineInitResponse,
  EngineTurnResponse,
  DecryptedSolution,
  EncryptedSolution,
} from '../types';
import {
  buildCaseGenerationPrompt,
  buildInterrogationTurnPrompt,
  buildAssistantAdvisorPrompt,
} from './prompts';

const DEFAULT_MODEL = 'gemini-2.5-flash';

// --- مساعدات التشفير وفك التشفير عبر Web Crypto API (AES-GCM) ---
const getCryptoKey = async (secretPass: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretPass),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('forensic-investigation-salt-2026'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptSolution = async (
  solution: DecryptedSolution,
  caseId: string
): Promise<EncryptedSolution> => {
  const enc = new TextEncoder();
  const key = await getCryptoKey(caseId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = enc.encode(JSON.stringify(solution));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );

  return {
    ciphertext: Array.from(new Uint8Array(encryptedBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
  };
};

export const decryptSolution = async (
  encrypted: EncryptedSolution,
  caseId: string
): Promise<DecryptedSolution> => {
  const key = await getCryptoKey(caseId);
  const ivArray = new Uint8Array(
    encrypted.iv.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );
  const dataArray = new Uint8Array(
    encrypted.ciphertext.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivArray },
    key,
    dataArray
  );

  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decryptedBuffer)) as DecryptedSolution;
};

// --- مهندس الاتصال بـ Google Gemini ---
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  }
  return cleaned.trim();
};

export const createInvestigationCase = async (
  apiKey: string,
  difficulty: CaseDifficulty,
  legalSystem: LegalSystem,
  length: CaseLength,
  language: Language,
  modelName: string = DEFAULT_MODEL
): Promise<EngineInitResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildCaseGenerationPrompt(difficulty, legalSystem, length, language);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '';
    const parsed = JSON.parse(cleanJsonResponse(outputText));
    return parsed as EngineInitResponse;
  } catch (error: any) {
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
      throw new Error('مفتاح Gemini API غير صالح أو غير مصرح له. يرجى التحقق من المفتاح في الإعدادات.');
    }
    if (error?.status === 429) {
      throw new Error('تم تجاوز حد الاستخدام المتاح لمفتاح API حالياً. يُرجى المحاولة بعد قليل.');
    }
    throw new Error(error?.message || 'فشل في توليد وقائع القضية عبر محرك الذكاء الاصطناعي.');
  }
};

export const executeInterrogationTurn = async (
  apiKey: string,
  legalSystem: LegalSystem,
  language: Language,
  dossierSummary: string,
  secretSolutionBrief: string,
  chatHistory: string,
  userAction: string,
  modelName: string = DEFAULT_MODEL
): Promise<EngineTurnResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildInterrogationTurnPrompt(
      legalSystem,
      language,
      dossierSummary,
      secretSolutionBrief,
      chatHistory,
      userAction
    );

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(cleanJsonResponse(response.text || ''));
    return parsed as EngineTurnResponse;
  } catch (error: any) {
    throw new Error(error?.message || 'تعذر الحصول على إجابة في جلسة الاستجواب.');
  }
};

export const queryTacticalAssistant = async (
  apiKey: string,
  legalSystem: LegalSystem,
  language: Language,
  dossierSummary: string,
  chatHistory: string,
  userQuestion: string,
  modelName: string = DEFAULT_MODEL
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildAssistantAdvisorPrompt(
      legalSystem,
      language,
      dossierSummary,
      chatHistory,
      userQuestion
    );

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || 'لم يتمكن المستشار الجنائي من إتمام التحليل.';
  } catch (error: any) {
    throw new Error(error?.message || 'تعذر التواصل مع المساعد الجنائي التكتيكي.');
  }
};
