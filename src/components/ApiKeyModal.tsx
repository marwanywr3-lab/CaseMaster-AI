import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ExternalLink, Check, Cpu, X } from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, modelName, setModelName } = useInvestigation();
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(modelName || 'gemini-2.5-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey.trim());
    setModelName(tempModel.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-noir-900 border border-noir-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-noir-850 border-b border-noir-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-noir-100">إعدادات محرك الذكاء الاصطناعي (Gemini API)</h3>
              <p className="text-xs text-noir-400">يُخزن المفتاح محلياً في متصفحك ولا يُرسل لأي خادم وسيط</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-noir-400 hover:text-noir-200 hover:bg-noir-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-noir-300 mb-1.5 font-semibold">
              مفتاح Google Gemini API Key
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              required
              className="w-full px-4 py-2.5 bg-noir-950 border border-noir-700 rounded-lg text-sm text-noir-100 placeholder-noir-600 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-noir-300 mb-1.5 font-semibold flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              إصدار النموذج المعتمد (Model Engine)
            </label>
            <input
              type="text"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              placeholder="gemini-2.5-flash"
              required
              className="w-full px-4 py-2 bg-noir-950 border border-noir-700 rounded-lg text-xs text-noir-200 font-mono focus:border-amber-500/80"
            />
            <p className="text-[11px] text-noir-500 mt-1">
              النموذج الافتراضي والموصى به للتحقيقات السريعة والمعقدة: <span className="font-mono text-noir-400">gemini-2.5-flash</span>
            </p>
          </div>

          {/* Guide Section */}
          <div className="p-4 bg-noir-950/60 border border-noir-800 rounded-xl space-y-2.5 text-xs text-noir-300">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>كيفية استخراج المفتاح مجاناً من Google AI Studio:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-noir-400 leading-relaxed pr-1">
              <li>سجّل الدخول إلى منصة <strong className="text-noir-200">Google AI Studio</strong> بحسابك في Google.</li>
              <li>انقر على زر <strong className="text-noir-200">Get API key</strong> في القائمة العلوية أو الجانبية.</li>
              <li>اختر <strong className="text-noir-200">Create API key</strong> وانسخ المفتاح المُولد.</li>
              <li>الصق المفتاح في الخانة أعلاه واضغط حفظ لتبدأ قيادة التحقيقات الجنائية.</li>
            </ol>
            <div className="pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 text-xs transition-colors"
              >
                فتح صفحة المفاتيح في Google AI Studio مباشرة
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-noir-400 hover:text-noir-200 bg-noir-800 hover:bg-noir-750 border border-noir-700 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-noir-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-evidence-glow flex items-center gap-2 transition-transform active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  تم الحفظ بنجاح
                </>
              ) : (
                'حفظ المفتاح وتفعيل المحرك'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
