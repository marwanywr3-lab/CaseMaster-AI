import React from 'react';
import { 
  FolderPlus, 
  KeyRound, 
  FolderLock, 
  Trash2, 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  FileSearch 
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { CaseDifficulty } from '../types';

interface SidebarProps {
  onOpenNewCaseModal: () => void;
  onOpenApiKeyModal: () => void;
}

const difficultyBadgeColors: Record<CaseDifficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  hard: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  extreme: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  state_level: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const difficultyLabels: Record<CaseDifficulty, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
  extreme: 'صعب جداً',
  state_level: 'مستوى دولة',
};

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenNewCaseModal,
  onOpenApiKeyModal,
}) => {
  const { cases, activeCase, setActiveCaseId, deleteCase, apiKey } = useInvestigation();

  return (
    <aside className="w-80 h-full bg-noir-900 border-l border-noir-700/60 flex flex-col justify-between select-none">
      {/* Upper Area: Brand and Case Launcher */}
      <div className="p-4 flex flex-col gap-4 border-b border-noir-700/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-noir-100">محرك التحقيق الجنائي</h1>
              <p className="text-[11px] font-mono text-noir-400">ARCHITECT ENGINE v2.5</p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewCaseModal}
          className="w-full py-2.5 px-3.5 bg-amber-400 hover:bg-amber-300 text-noir-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-evidence-glow transition-all active:scale-[0.98]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>فتح قضية جديدة</span>
        </button>
      </div>

      {/* Center Area: Case History Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono uppercase text-noir-500 tracking-wider">
          <span>سجل القضايا المفتوحة ({cases.length})</span>
        </div>

        {cases.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-noir-800 rounded-xl">
            <FileSearch className="w-8 h-8 text-noir-600 mx-auto mb-2.5" />
            <p className="text-xs text-noir-400 font-semibold mb-1">لا توجد قضايا نشطة</p>
            <p className="text-[11px] text-noir-600">اضغط "فتح قضية جديدة" لبدء توليد مسرح جريمة تفاعلي.</p>
          </div>
        ) : (
          cases.map((c) => {
            const isActive = activeCase?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-noir-800 border-amber-500/40 shadow-evidence-glow'
                    : 'bg-noir-950/60 border-noir-800/80 hover:border-noir-700 hover:bg-noir-850/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-noir-200 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('هل أنت متأكد من حذف هذه القضية بالكامل من السجلات؟')) {
                        deleteCase(c.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-noir-500 hover:text-red-400 hover:bg-noir-700/60 rounded transition-all"
                    title="حذف القضية"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-noir-400 line-clamp-1 mb-2">
                  الضحية: {c.victim.name} | {c.incidentType}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className={`px-2 py-0.5 rounded-md border font-medium ${difficultyBadgeColors[c.difficulty]}`}>
                    {difficultyLabels[c.difficulty]}
                  </span>
                  <span className="px-2 py-0.5 rounded-md border border-noir-700 bg-noir-850 text-noir-300">
                    {c.legalSystem === 'saudi' ? 'النظام السعودي' : 'US Law'}
                  </span>
                  {c.isClosed ? (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      مغلقة
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400/80 border border-amber-500/20 flex items-center gap-1 font-mono">
                      <FolderLock className="w-3 h-3" />
                      قيد التحقيق
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Area: API Key Manager Button and Security Badge */}
      <div className="p-4 border-t border-noir-700/60 bg-noir-850/40 space-y-2">
        <button
          onClick={onOpenApiKeyModal}
          className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-between transition-colors ${
            apiKey
              ? 'bg-noir-900 border-noir-700 text-noir-300 hover:bg-noir-800 hover:text-noir-100'
              : 'bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>مفتاح Gemini API</span>
          </div>
          {apiKey ? (
            <span className="text-[10px] font-mono text-emerald-400">متصل</span>
          ) : (
            <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              مطلوب
            </span>
          )}
        </button>

        <div className="text-[10px] font-mono text-noir-500 text-center">
          LOCAL STORAGE & CRYPTO SANDBOX
        </div>
      </div>
    </aside>
  );
};
