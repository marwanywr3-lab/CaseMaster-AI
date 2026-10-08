import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  UserCheck, 
  ShieldAlert, 
  Microscope, 
  Gavel, 
  Sparkles, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle 
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

interface InterrogationPanelProps {
  onOpenVerdictModal: () => void;
}

export const InterrogationPanel: React.FC<InterrogationPanelProps> = ({ onOpenVerdictModal }) => {
  const { activeCase, sendInterrogationMessage, isLoading } = useInvestigation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCase?.messages, isLoading]);

  if (!activeCase) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-noir-950">
        <div className="p-4 bg-noir-900 border border-noir-800 rounded-2xl mb-4 text-noir-500">
          <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-base font-bold text-noir-200 mb-1">لم يتم تحديد أو فتح أي قضية بعد</h2>
        <p className="text-xs text-noir-500 max-w-sm">
          اختر قضية من الشريط الجانبي أو افتح قضية جديدة لبدء المعاينة واستدعاء المشتبه بهم.
        </p>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || activeCase.isClosed) return;
    const msg = inputText;
    setInputText('');
    await sendInterrogationMessage(msg);
  };

  const getSenderBadge = (sender: string, characterName?: string) => {
    switch (sender) {
      case 'user':
        return (
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
            <User className="w-3.5 h-3.5" />
            <span>المحقق (أنت)</span>
          </div>
        );
      case 'suspect':
        return (
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>مشتبه به: {characterName || 'مجهول'}</span>
          </div>
        );
      case 'witness':
        return (
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>شاهد: {characterName || 'مجهول'}</span>
          </div>
        );
      case 'forensics':
        return (
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <Microscope className="w-3.5 h-3.5" />
            <span>المختبر الجنائي: {characterName || 'الأدلة الجنائية'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>غرفة التحقيق ومسرح الجريمة</span>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-noir-950 border-x border-noir-800/80 overflow-hidden relative">
      {/* Investigation Top Banner */}
      <header className="px-5 py-3.5 bg-noir-900 border-b border-noir-800 flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="classified-stamp">سري للغاية</span>
            <h2 className="text-sm font-bold text-noir-100">{activeCase.title}</h2>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-noir-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {activeCase.location}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              {activeCase.timeOfIncident}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenVerdictModal}
          className={`btn-dossier ${
            activeCase.isClosed ? 'btn-dossier-neutral' : 'btn-dossier-danger'
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>{activeCase.isClosed ? 'عرض تقرير الحكم' : 'تقديم لائحة الاتهام'}</span>
        </button>
      </header>

      {/* Interrogation Transcript */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeCase.messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="mb-1 px-1 flex items-center gap-2">
                {getSenderBadge(m.sender, m.characterName)}
                <span className="text-[10px] font-mono text-noir-500">{m.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                  isUser
                    ? 'bg-amber-500/10 border-amber-500/30 text-noir-100 rounded-tl-sm'
                    : 'bg-noir-900 border-noir-800 text-noir-200 rounded-tr-sm shadow-noir-card'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>

                {/* Evidence Unlock Tag in Message */}
                {m.metadata?.unlockedEvidence && m.metadata.unlockedEvidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-noir-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      تم تحريز دليل مادي جديد:
                    </span>
                    {m.metadata.unlockedEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2 bg-noir-950/80 border border-amber-500/30 rounded-lg text-[11px] text-noir-200"
                      >
                        <strong className="text-amber-300">{ev.title}: </strong>
                        {ev.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-noir-500 text-xs font-mono p-3 bg-noir-900/50 rounded-xl border border-noir-800/60 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>جارٍ استدعاء الشاهد / فحص الأدلة الجنائية عبر Gemini Flash...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Closed Case Notice */}
      {activeCase.isClosed && (
        <div className="p-3 bg-noir-900 border-t border-noir-800 flex items-center justify-center gap-2 text-xs text-noir-400 font-mono">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>تم إغلاق ملف التحقيق لهذه القضية وإحالتها للمحكمة المختصة.</span>
        </div>
      )}

      {/* Input Form Bar */}
      {!activeCase.isClosed && (
        <form onSubmit={handleSend} className="p-4 bg-noir-900/95 border-t border-noir-800 flex gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="وجّه سؤالاً لمشتبه به، اطلب تقرير الطب الشرعي، أو فتش زاوية في المسرح..."
            className="flex-1 px-4 py-2.5 bg-noir-950 border border-noir-700/80 rounded-xl text-xs text-noir-100 placeholder-noir-500 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-noir-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-evidence-glow active:scale-95"
          >
            <Send className="w-4 h-4 -rotate-90" />
            <span>تنفيذ</span>
          </button>
        </form>
      )}
    </main>
  );
};
