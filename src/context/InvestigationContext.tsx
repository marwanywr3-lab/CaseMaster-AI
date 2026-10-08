import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CaseDossier,
  CaseDifficulty,
  LegalSystem,
  CaseLength,
  Language,
  ChatMessage,
  AssistantMessage,
  DecryptedSolution,
} from '../types';
import {
  createInvestigationCase,
  encryptSolution,
  decryptSolution,
  executeInterrogationTurn,
  queryTacticalAssistant,
} from '../services/gemini';

interface InvestigationContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  modelName: string;
  setModelName: (model: string) => void;
  cases: CaseDossier[];
  activeCase: CaseDossier | null;
  setActiveCaseId: (id: string) => void;
  createNewCase: (
    difficulty: CaseDifficulty,
    legalSystem: LegalSystem,
    length: CaseLength,
    language: Language
  ) => Promise<void>;
  sendInterrogationMessage: (actionText: string) => Promise<void>;
  sendAssistantMessage: (questionText: string) => Promise<void>;
  updateNotepad: (content: string) => void;
  closeCaseWithVerdict: (accused: string, motive: string, evidence: string) => Promise<void>;
  deleteCase: (id: string) => void;
  isLoading: boolean;
  assistantLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const STORAGE_KEY_CASES = 'forensic_engine_cases_v1';
const STORAGE_KEY_API_KEY = 'forensic_engine_gemini_api_key';
const STORAGE_KEY_MODEL = 'forensic_engine_model_name';

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  });

  const [modelName, setModelNameState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-2.5-flash';
  });

  const [cases, setCases] = useState<CaseDossier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CASES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    return cases.length > 0 ? cases[0].id : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
  }, [cases]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEY_API_KEY, key);
  };

  const setModelName = (model: string) => {
    setModelNameState(model);
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  };

  const activeCase = cases.find((c) => c.id === activeCaseId) || null;

  const createNewCase = async (
    difficulty: CaseDifficulty,
    legalSystem: LegalSystem,
    length: CaseLength,
    language: Language
  ) => {
    if (!apiKey) {
      setError('يرجى حفظ مفتاح Gemini API أولاً للمتابعة.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await createInvestigationCase(
        apiKey,
        difficulty,
        legalSystem,
        length,
        language,
        modelName
      );

      const newCaseId = 'case_' + Date.now();
      const encryptedSolution = await encryptSolution(generated.secretSolution, newCaseId);

      const firstMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        sender: 'engine',
        content: generated.firstNarrativeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newDossier: CaseDossier = {
        id: newCaseId,
        title: generated.dossier.title,
        incidentType: generated.dossier.incidentType,
        difficulty,
        legalSystem,
        length,
        language,
        victim: generated.dossier.victim,
        location: generated.dossier.location,
        timeOfIncident: generated.dossier.timeOfIncident,
        initialOverview: generated.dossier.initialOverview,
        suspects: generated.dossier.initialSuspects || [],
        evidenceLog: generated.dossier.initialEvidence || [],
        encryptedSolution,
        messages: [firstMsg],
        assistantMessages: [
          {
            id: 'asst_init',
            sender: 'assistant',
            content:
              language === 'ar'
                ? 'مرحباً بك أيها المحقق. أنا مستشارك التكتيكي والقانوني. راجع مسرح الجريمة، وسأكون معك لتحليل الثغرات والتناقضات وفق النظام القانوني المحدد.'
                : 'Welcome, Detective. I am your strategic and procedural advisor. Proceed with your inquiries, and I will highlight discrepancies without revealing the outcome.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        notepadContent: '',
        createdAt: new Date().toISOString(),
        isClosed: false,
      };

      setCases((prev) => [newDossier, ...prev]);
      setActiveCaseId(newCaseId);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء القضية.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendInterrogationMessage = async (actionText: string) => {
    if (!activeCase || !apiKey || activeCase.isClosed) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      content: actionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeCase.messages, userMsg];

    setCases((prev) =>
      prev.map((c) => (c.id === activeCase.id ? { ...c, messages: updatedMessages } : c))
    );

    setIsLoading(true);
    setError(null);

    try {
      const decryptedSecret = await decryptSolution(activeCase.encryptedSolution, activeCase.id);
      const secretBrief = `CULPRIT: ${decryptedSecret.culprit} | WEAPON: ${decryptedSecret.murderWeaponOrMethod} | SMOKING GUN: ${decryptedSecret.smokingGunEvidence}`;

      const dossierSummary = `
TITLE: ${activeCase.title}
VICTIM: ${activeCase.victim.name} (${activeCase.victim.occupation})
LOCATION: ${activeCase.location}
SUSPECTS: ${activeCase.suspects.map((s) => `${s.name} (${s.role})`).join(', ')}
KNOWN EVIDENCE: ${activeCase.evidenceLog.map((e) => e.title).join(', ')}
      `.trim();

      const chatHistory = updatedMessages
        .slice(-8)
        .map((m) => `${m.sender}: ${m.content}`)
        .join('\n');

      const turn = await executeInterrogationTurn(
        apiKey,
        activeCase.legalSystem,
        activeCase.language,
        dossierSummary,
        secretBrief,
        chatHistory,
        actionText,
        modelName
      );

      const engineMsg: ChatMessage = {
        id: 'eng_' + Date.now(),
        sender: turn.speakerType || 'engine',
        characterName: turn.speakerName || undefined,
        content: turn.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          unlockedEvidence: turn.newEvidenceUnlocked,
        },
      };

      const finalMessages = [...updatedMessages, engineMsg];
      let updatedEvidence = [...activeCase.evidenceLog];

      if (turn.newEvidenceUnlocked && turn.newEvidenceUnlocked.length > 0) {
        for (const item of turn.newEvidenceUnlocked) {
          if (!updatedEvidence.some((e) => e.title === item.title)) {
            updatedEvidence.push(item);
          }
        }
      }

      setCases((prev) =>
        prev.map((c) =>
          c.id === activeCase.id
            ? { ...c, messages: finalMessages, evidenceLog: updatedEvidence }
            : c
        )
      );
    } catch (err: any) {
      setError(err.message || 'فشل الاستجواب، تحقق من الاتصال.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendAssistantMessage = async (questionText: string) => {
    if (!activeCase || !apiKey) return;

    const userAsstMsg: AssistantMessage = {
      id: 'uasst_' + Date.now(),
      sender: 'user',
      content: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentList = [...activeCase.assistantMessages, userAsstMsg];

    setCases((prev) =>
      prev.map((c) => (c.id === activeCase.id ? { ...c, assistantMessages: currentList } : c))
    );

    setAssistantLoading(true);

    try {
      const dossierSummary = `
CASE: ${activeCase.title}
VICTIM: ${activeCase.victim.name}
EVIDENCE DISCOVERED: ${activeCase.evidenceLog.map((e) => `${e.title}:${e.description}`).join(' | ')}
SUSPECTS: ${activeCase.suspects.map((s) => `${s.name}: alibi (${s.alibi})`).join(' | ')}
      `.trim();

      const chatHistory = activeCase.messages
        .slice(-10)
        .map((m) => `${m.characterName || m.sender}: ${m.content}`)
        .join('\n');

      const responseText = await queryTacticalAssistant(
        apiKey,
        activeCase.legalSystem,
        activeCase.language,
        dossierSummary,
        chatHistory,
        questionText,
        modelName
      );

      const advisorMsg: AssistantMessage = {
        id: 'asst_reply_' + Date.now(),
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCases((prev) =>
        prev.map((c) =>
          c.id === activeCase.id
            ? { ...c, assistantMessages: [...currentList, advisorMsg] }
            : c
        )
      );
    } catch (err: any) {
      setError(err.message || 'تعذر الحصول على مشورة المساعد.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const updateNotepad = (content: string) => {
    if (!activeCase) return;
    setCases((prev) =>
      prev.map((c) => (c.id === activeCase.id ? { ...c, notepadContent: content } : c))
    );
  };

  const closeCaseWithVerdict = async (
    accused: string,
    motive: string,
    evidence: string
  ) => {
    if (!activeCase) return;

    try {
      const solution: DecryptedSolution = await decryptSolution(
        activeCase.encryptedSolution,
        activeCase.id
      );

      const culpritMatch =
        solution.culprit.toLowerCase().includes(accused.toLowerCase()) ||
        accused.toLowerCase().includes(solution.culprit.toLowerCase());

      let score = culpritMatch ? 60 : 15;
      if (
        culpritMatch &&
        (motive.length > 10 || solution.motive.toLowerCase().includes(motive.toLowerCase()))
      ) {
        score += 20;
      }
      if (evidence.length > 5) {
        score += 20;
      }

      const feedback = culpritMatch
        ? `تهانينا أيها المحقق! اتجه اتهامك نحو الجاني الحقيقي (${solution.culprit}). لقد تم إثبات إدانته قانونياً بناءً على الدليل الحاسم.`
        : `للأسف! لقد وجهت الاتهام للشخص الخطأ. الجاني الفعلي كان (${solution.culprit}). تم إسقاط التهم في المحكمة لعدم كفاية الأدلة.`;

      setCases((prev) =>
        prev.map((c) =>
          c.id === activeCase.id
            ? {
                ...c,
                isClosed: true,
                verdictReport: {
                  submittedAccused: accused,
                  submittedMotive: motive,
                  submittedEvidence: evidence,
                  score,
                  feedback,
                  revealedSolution: solution,
                },
              }
            : c
        )
      );
    } catch (err: any) {
      setError('فشل في فك تشفير حل القضية وإصدار الحكم.');
    }
  };

  const deleteCase = (id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (activeCaseId === id) {
      const remaining = cases.filter((c) => c.id !== id);
      setActiveCaseId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const clearError = () => setError(null);

  return (
    <InvestigationContext.Provider
      value={{
        apiKey,
        setApiKey,
        modelName,
        setModelName,
        cases,
        activeCase,
        setActiveCaseId,
        createNewCase,
        sendInterrogationMessage,
        sendAssistantMessage,
        updateNotepad,
        closeCaseWithVerdict,
        deleteCase,
        isLoading,
        assistantLoading,
        error,
        clearError,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
