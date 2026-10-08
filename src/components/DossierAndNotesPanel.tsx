import React, { useState } from 'react';
import { 
  FileEdit, 
  Archive, 
  UserX, 
  Users, 
  Sparkles, 
  FileCheck, 
  Info, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const DossierAndNotesPanel: React.FC = () => {
  const { activeCase, updateNotepad } = useInvestigation();
  const [activeTab, setActiveTab] = useState<'evidence' | 'suspects' | 'overview'>('evidence');
  const [savedTick, setSavedTick] = useState(false);

  if (!activeCase) {
    return (
      <aside className="w-80 h-full bg-noir-900/40 p-6 flex flex-col items-center justify-center text-center text-noir-500 border-l border-noir-800">
        <Archive className="w-8 h-8 mb-2 stroke-[1.5]" />
        <p className="text-xs">ملف القضية غير متاح</p>
      </aside>
    );
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNotepad(e.target.value);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 800);
  };

  const getSignificanceBadge = (significance: string) => {
    switch (significance) {
      case 'critical':
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/15 text-red-300 border border-red-500/30 font-mono">قاطع</span>;
      case 'supporting':
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">داعم</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-700/40 text-zinc-300 border border-zinc-600/30 font-mono">ظرفي</span>;
    }
  };

  return (
    <aside className="w-84 h-full bg-noir-900/95 border-l border-noir-800/80 flex flex-col justify-between overflow-hidden">
      {/* Upper Half: Investigator's Free Notepad */}
      <div className="h-1/2 flex flex-col border-b border-noir-800/80 bg-noir-950/40">
        <div className="p-3 bg-noir-850 border-b border-noir-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-noir-100">دفتر ملاحظات المحقق</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-noir-500">
            {savedTick ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                محفوظ
              </span>
            ) : (
              <span>حفظ تلقائي</span>
            )}
          </div>
        </div>

        <textarea
          value={activeCase.notepadContent || ''}
          onChange={handleNotesChange}
          placeholder="دوّن استنتاجاتك، الفجوات الزمنية، وتحليلاتك لردود المتهمين هنا..."
          className="flex-1 w-full p-3.5 bg-transparent text-xs text-noir-200 placeholder-noir-600 resize-none font-sans leading-relaxed focus:bg-noir-950/60"
        />
      </div>

      {/* Lower Half: Case Dossier & Evidence Log */}
      <div className="h-1/2 flex flex-col bg-noir-900/90 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-noir-800 bg-noir-850 text-xs">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-2.5 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'evidence'
                ? 'border-amber-400 text-amber-300 bg-noir-900/60'
                : 'border-transparent text-noir-400 hover:text-noir-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الأدلة ({activeCase.evidenceLog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('suspects')}
            className={`flex-1 py-2.5 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'suspects'
                ? 'border-amber-400 text-amber-300 bg-noir-900/60'
                : 'border-transparent text-noir-400 hover:text-noir-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>المشتبه بهم ({activeCase.suspects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 bg-noir-900/60'
                : 'border-transparent text-noir-400 hover:text-noir-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>التقرير</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {activeTab === 'evidence' && (
            <div className="space-y-2">
              {activeCase.evidenceLog.length === 0 ? (
                <p className="text-[11px] text-noir-500 text-center py-6">لم يتم تحريز أدلة جديدة بعد.</p>
              ) : (
                activeCase.evidenceLog.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 bg-noir-950/80 border border-noir-800 rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{ev.title}</span>
                      {getSignificanceBadge(ev.significance)}
                    </div>
                    <p className="text-[11px] text-noir-300 leading-relaxed">{ev.description}</p>
                    <div className="text-[10px] font-mono text-noir-500 pt-0.5">
                      موقع العثور: {ev.discoveredAt}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="space-y-2">
              {activeCase.suspects.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 bg-noir-950/80 border border-noir-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-noir-100">{s.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-noir-800 text-noir-300 rounded font-medium">
                      {s.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-noir-400">
                    <strong className="text-noir-300">صلته: </strong>{s.relationship}
                  </div>
                  <div className="text-[11px] text-noir-400 bg-noir-900 p-1.5 rounded border border-noir-850">
                    <strong className="text-amber-400/90">حجة الغياب: </strong>{s.alibi}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-2.5 bg-noir-950/80 border border-noir-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                  <UserX className="w-3.5 h-3.5" />
                  بيانات الضحية
                </span>
                <div className="text-noir-100 font-bold">{activeCase.victim.name} ({activeCase.victim.age} عاماً)</div>
                <div className="text-noir-400 text-[11px]">{activeCase.victim.occupation} - الحالة: {activeCase.victim.status}</div>
              </div>

              <div className="p-2.5 bg-noir-950/80 border border-noir-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  معاينة مسرح الجريمة الأولية
                </span>
                <p className="text-noir-300 text-[11px] leading-relaxed">{activeCase.initialOverview}</p>
              </div>

              <div className="p-2.5 bg-noir-950/80 border border-noir-800 rounded-xl text-[11px] space-y-1 font-mono text-noir-400">
                <div>النظام القانوني: {activeCase.legalSystem === 'saudi' ? 'الإجراءات الجزائية السعودي' : 'US Law Framework'}</div>
                <div>تاريخ فتح الملف: {new Date(activeCase.createdAt).toLocaleDateString('ar-SA')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
