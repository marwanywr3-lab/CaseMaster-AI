import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { InterrogationPanel } from './components/InterrogationPanel';
import { AssistantPanel } from './components/AssistantPanel';
import { DossierAndNotesPanel } from './components/DossierAndNotesPanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { NewCaseModal } from './components/NewCaseModal';
import { VerdictModal } from './components/VerdictModal';
import { useInvestigation } from './context/InvestigationContext';
import { AlertOctagon, X } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { error, clearError } = useInvestigation();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isVerdictModalOpen, setIsVerdictModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-noir-950 text-noir-100 font-sans">
      {/* Global Toast Alert for Engine Errors */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-bounce">
          <div className="p-3 bg-red-950/90 border border-red-500/50 rounded-xl shadow-alert-glow flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-red-900/60 rounded text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Sidebar - Case Navigation and Settings */}
      <Sidebar
        onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* 2. Three-Column Investigation Architecture */}
      <div className="flex-1 flex h-full overflow-hidden">
        {/* Right Column: Tactical Legal AI Assistant */}
        <AssistantPanel />

        {/* Center Column: Primary Interrogation & Crime Scene Investigation */}
        <InterrogationPanel onOpenVerdictModal={() => setIsVerdictModalOpen(true)} />

        {/* Left Column: Dossier, Evidence Log & Investigator's Notepad */}
        <DossierAndNotesPanel />
      </div>

      {/* Modals & Dialogs */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onOpenApiKeyModal={() => {
          setIsNewCaseModalOpen(false);
          setIsApiKeyModalOpen(true);
        }}
      />

      <VerdictModal
        isOpen={isVerdictModalOpen}
        onClose={() => setIsVerdictModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
