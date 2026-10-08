import { CaseDifficulty, LegalSystem, CaseLength, Language } from '../types';

export const buildCaseGenerationPrompt = (
  difficulty: CaseDifficulty,
  legalSystem: LegalSystem,
  length: CaseLength,
  language: Language
): string => {
  const isArabic = language === 'ar';

  return `
You are the Master Forensic Architecture Engine.
Your task is to design a high-fidelity, intellectually challenging criminal investigation mystery under the ${legalSystem.toUpperCase()} legal jurisdiction.

Parameters:
- Jurisdiction: ${legalSystem === 'saudi' ? 'Saudi Arabian Criminal Procedure & Sharia Evidence Framework (نظام الإجراءات الجزائية السعودي وقواعد الإثبات الجنائي)' : 'United States Criminal Law, Constitutional Rights, Fourth/Fifth Amendments, Beyond a Reasonable Doubt standard'}
- Difficulty Tier: ${difficulty.toUpperCase()}
  * easy: Direct clues, simple alibi to break.
  * medium: Two strong suspects, requires cross-referencing timeline.
  * hard: Hidden motives, red herrings, subtle technical contradictions.
  * extreme: False testimonies, intricate procedural roadblocks, expert forensic discrepancy.
  * state_level: Multi-layered conspiracy, white-collar/espionage/high-stakes homicide, institutional cover-ups.
- Depth/Length: ${length.toUpperCase()}
- Language Output: ${isArabic ? 'Arabic (اللغة العربية الفصحى الرصينة بأسلوب التقارير الجنائية)' : 'English (Noir Technical Investigative Prose)'}

CRITICAL ARCHITECTURAL DIRECTIVE:
You must output a strictly valid JSON object ONLY. Do NOT wrap in markdown \`\`\`json or add conversational remarks.

The JSON schema must match:
{
  "dossier": {
    "title": "string (عنوان القضية المشوق)",
    "incidentType": "string (نوع الجريمة، مثل: قتل عمد، احتيال وتسميم، اختلاس مقترن باعتداء)",
    "victim": {
      "name": "string",
      "age": number,
      "occupation": "string",
      "status": "string (مقتول، في غيبوبة، مفقود)"
    },
    "location": "string (مسرح الجريمة بتفصيل واقعي)",
    "timeOfIncident": "string",
    "initialOverview": "string (تقرير مسرح الجريمة الأولي للشرطة)",
    "initialSuspects": [
      {
        "id": "s1",
        "name": "string",
        "role": "string",
        "relationship": "string",
        "alibi": "string",
        "initialSuspicion": "string"
      }
    ],
    "initialEvidence": [
      {
        "id": "e1",
        "title": "string",
        "description": "string",
        "discoveredAt": "string",
        "significance": "circumstantial | supporting | critical"
      }
    ]
  },
  "secretSolution": {
    "culprit": "string (اسم الجاني الحقيقي بالضبط)",
    "motive": "string (الدافع الحقيقي المقنع)",
    "murderWeaponOrMethod": "string (الأداة أو الطريقة الجنائية)",
    "smokingGunEvidence": "string (الدليل القاطع الذي يدينه دون شك معقول)",
    "summaryOfEvents": "string (تسلسل الأحداث الحقيقي لما وقع خلف الكواليس)",
    "legalStatuteViolated": "string (المادة القانونية أو التوصيف الجرمي وفق النظام المحدد)"
  },
  "firstNarrativeMessage": "string (الرسالة الافتتاحية للمحقق لبدء المعاينة واستدعاء المشتبه بهم)"
}
`;
};

export const buildInterrogationTurnPrompt = (
  legalSystem: LegalSystem,
  language: Language,
  currentDossierSummary: string,
  secretSolutionReference: string,
  chatHistoryText: string,
  userInvestigatorAction: string
): string => {
  return `
You are the Game Master & Interrogation Simulator for an ongoing criminal investigation.

LEGAL CONTEXT: ${legalSystem === 'saudi' ? 'نظام الإجراءات الجزائية السعودي (حقوق المتهم، بطلان الإجراءات، شروط المعاينة والاستجواب)' : 'US Law (Miranda warnings, procedural evidence admissibility, cross-examination)'}.
LANGUAGE: ${language === 'ar' ? 'العربية' : 'English'}.

DOSSIER CURRENT STATE:
${currentDossierSummary}

GROUND TRUTH (DO NOT REVEAL DIRECTLY UNDER ANY CIRCUMSTANCES):
${secretSolutionReference}

PREVIOUS TRANSCRIPT:
${chatHistoryText}

INVESTIGATOR'S ACTION / QUESTION:
"${userInvestigatorAction}"

RULES:
1. Act realistically as the summoned suspect, witness, medical examiner, or narrator describing the crime scene inspection.
2. If the investigator presses a suspect with solid contradictions, have them become evasive, defensive, or slip up subtly. Never confess fully on the first question.
3. If the investigator conducts forensics or investigates a specific physical corner, you may unlock a new evidence item if logically present.
4. Keep the secret solution strictly hidden until the definitive proof is confronted.

Respond strictly in valid JSON format ONLY:
{
  "reply": "string (النص المباشر للاستجواب أو الوصف الجنائي)",
  "speakerName": "string or null (اسم المتحدث أو المحلل الجنائي)",
  "speakerType": "engine | witness | suspect | forensics",
  "newEvidenceUnlocked": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "discoveredAt": "string",
      "significance": "circumstantial | supporting | critical"
    }
  ]
}
Note: "newEvidenceUnlocked" should be an empty array [] unless the investigator's specific query discovered something concrete.
`;
};

export const buildAssistantAdvisorPrompt = (
  legalSystem: LegalSystem,
  language: Language,
  dossierSummary: string,
  interrogationTranscript: string,
  userQuestion: string
): string => {
  return `
You are the "Senior Detective Tactical Advisor & Legal Strategist".
You assist the lead detective sitting in the observation room.

JURISDICTION: ${legalSystem === 'saudi' ? 'النظام القانوني السعودي (نظام الإجراءات الجزائية، نظام الإثبات)' : 'US Criminal Procedural Law'}.
LANGUAGE: ${language === 'ar' ? 'العربية' : 'English'}.

CURRENT DOSSIER & DISCOVERED EVIDENCE:
${dossierSummary}

CENTRAL INTERROGATION LOG:
${interrogationTranscript}

DETECTIVE'S QUERY TO YOU:
"${userQuestion}"

MANDATORY RULES:
1. DO NOT SPOIL THE CULPRIT OR THE SOLUTION. You do not definitively know the killer yourself, but you have sharp investigative acumen.
2. Focus on:
   - Behavioral contradictions in suspects' statements.
   - Timeline gaps.
   - Legal procedure requirements (e.g. admissibility of evidence, chain of custody, rights of the accused).
   - Tactical angles for the next interrogation turn.
3. Keep answers razor-sharp, analytical, professional, and tactical. Never use generic platitudes.
`;
};
