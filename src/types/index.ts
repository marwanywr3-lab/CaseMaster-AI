export type CaseDifficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'state_level';

export type LegalSystem = 'saudi' | 'american';

export type CaseLength = 'short' | 'medium' | 'long';

export type Language = 'ar' | 'en';

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  discoveredAt: string;
  significance: 'critical' | 'supporting' | 'circumstantial';
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  relationship: string;
  alibi: string;
  initialSuspicion: string;
}

export interface EncryptedSolution {
  ciphertext: string;
  iv: string;
}

export interface DecryptedSolution {
  culprit: string;
  motive: string;
  murderWeaponOrMethod: string;
  smokingGunEvidence: string;
  summaryOfEvents: string;
  legalStatuteViolated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'engine' | 'witness' | 'suspect' | 'forensics';
  characterName?: string;
  content: string;
  timestamp: string;
  metadata?: {
    unlockedEvidence?: EvidenceItem[];
    location?: string;
  };
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CaseDossier {
  id: string;
  title: string;
  incidentType: string;
  difficulty: CaseDifficulty;
  legalSystem: LegalSystem;
  length: CaseLength;
  language: Language;
  victim: {
    name: string;
    age: number;
    occupation: string;
    status: string;
  };
  location: string;
  timeOfIncident: string;
  initialOverview: string;
  suspects: Suspect[];
  evidenceLog: EvidenceItem[];
  encryptedSolution: EncryptedSolution;
  messages: ChatMessage[];
  assistantMessages: AssistantMessage[];
  notepadContent: string;
  createdAt: string;
  isClosed: boolean;
  verdictReport?: {
    submittedAccused: string;
    submittedMotive: string;
    submittedEvidence: string;
    score: number;
    feedback: string;
    revealedSolution: DecryptedSolution;
  };
}

export interface EngineInitResponse {
  dossier: {
    title: string;
    incidentType: string;
    victim: {
      name: string;
      age: number;
      occupation: string;
      status: string;
    };
    location: string;
    timeOfIncident: string;
    initialOverview: string;
    initialSuspects: Suspect[];
    initialEvidence: EvidenceItem[];
  };
  secretSolution: DecryptedSolution;
  firstNarrativeMessage: string;
}

export interface EngineTurnResponse {
  reply: string;
  speakerName?: string;
  speakerType: 'engine' | 'witness' | 'suspect' | 'forensics';
  newEvidenceUnlocked?: EvidenceItem[];
}
