import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, BrainCircuit, Sparkles, Scale, Lightbulb } from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const AssistantPanel: React.FC = () => {
  const { activeCase, sendAssistantMessage, assistantLoading } = useInvestigation();
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCase?.assistantMessages, assistantLoading]);

  if (!activeCase) {
    return (
      <aside className="w-80 h-full bg-noir-900/40 p-6 flex flex-col items-center justify-center text-center text-noir-500 border-r border-noir-800">
        <BrainCircuit className="w-8 h-8 mb-2 stroke-[1.5]" />
        <p className="text-xs">المساعد التكتيكي غير نشط</p>
      </aside>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || assistantLoading) return;
    const q = query;
    setQuery('');
    await sendAssistantMessage(q);
  };

  const isSaudi = activeCase.legalSystem === 'saudi';

  return (
    <aside className="w-80 h-full bg-noir-900/95 border-r border-noir-800/80 flex flex-col justify-between overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 bg-noir-850 border-b border-noir-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-noir-100">المستشار التكتيكي</h3>
            <p className="text-[10px] font-mono text-noir-400">
              {isSaudi ? 'النظام الجنائي السعودي' : 'US Criminal Protocol'}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
          مستقل
        </span>
      </div>

      {/* Assistant Quick Strategies */}
      <div className="p-3 bg-noir-950/60 border-b border-noir-800/80 text-[11px] text-noir-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold uppercase">
          <Lightbulb className="w-3 h-3" />
          <span>استفسارات سريعة مقترحة:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => sendAssistantMessage('هل هناك أي تناقض في حجة غياب المشتبه بهم حتى الآن؟')}
            className="px-2 py-1 bg-noir-850 hover:bg-noir-800 border border-noir-700/60 rounded text-[10px] text-noir-300 transition-colors"
          >
            تحليل التناقضات
          </button>
          <button
            type="button"
            onClick={() =>
              sendAssistantMessage(
                isSaudi
                  ? 'ما هي الإجراءات النظامية لطلب تفتيش إضافي وفق نظام الإجراءات الجزائية؟'
                  : 'Does our current evidence meet the Fourth Amendment standard?'
              )
            }
            className="px-2 py-1 bg-noir-850 hover:bg-noir-800 border border-noir-700/60 rounded text-[10px] text-noir-300 transition-colors"
          >
            الموقف القانوني
          </button>
        </div>
      </div>

      {/* Assistant Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {activeCase.assistantMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} text-xs leading-relaxed`}
            >
              <div className="mb-1 flex items-center gap-1 text-[10px] font-mono text-noir-500">
                {isUser ? <span>سؤالك للمستشار</span> : <span>المستشار القانوني</span>}
                <span>• {msg.timestamp}</span>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isUser
                    ? 'bg-noir-800 border-noir-700 text-noir-100 rounded-tl-none'
                    : 'bg-noir-950 border-noir-800/90 text-noir-300 rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}

        {assistantLoading && (
          <div className="p-3 bg-noir-950 border border-noir-800 rounded-xl flex items-center gap-2 text-[11px] text-noir-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>جارٍ فحص الوقائع واستنباط الثغرات...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Assistant Query Input */}
      <form onSubmit={handleSend} className="p-3 bg-noir-850 border-t border-noir-800 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={assistantLoading}
          placeholder="استشر المساعد في الأدلة أو القانون..."
          className="flex-1 px-3 py-2 bg-noir-950 border border-noir-700 rounded-lg text-xs text-noir-100 placeholder-noir-500 focus:border-amber-500/80"
        />
        <button
          type="submit"
          disabled={assistantLoading || !query.trim()}
          className="p-2 bg-amber-400 hover:bg-amber-300 text-noir-950 rounded-lg disabled:opacity-40 transition-colors"
          title="إرسال للمستشار"
        >
          <Send className="w-3.5 h-3.5 -rotate-90" />
        </button>
      </form>
    </aside>
  );
};
