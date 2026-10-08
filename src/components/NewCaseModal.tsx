import React, { useState } from 'react';
import { FolderPlus, Scale, Gauge, FileText, Globe2, Loader2, X } from 'lucide-react';
import { CaseDifficulty, LegalSystem, CaseLength, Language } from '../types';
import { useInvestigation } from '../context/InvestigationContext';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onOpenApiKeyModal,
}) => {
  const { createNewCase, apiKey, isLoading } = useInvestigation();

  const [difficulty, setDifficulty] = useState<CaseDifficulty>('medium');
  const [legalSystem, setLegalSystem] = useState<LegalSystem>('saudi');
  const [length, setLength] = useState<CaseLength>('medium');
  const [language, setLanguage] = useState<Language>('ar');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      onOpenApiKeyModal();
      return;
    }
    await createNewCase(difficulty, legalSystem, length, language);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-noir-900 border border-noir-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-noir-850 border-b border-noir-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-noir-100">فتح ملف تحقيق جنائي جديد</h3>
              <p className="text-xs text-noir-400">توليد مسرح جريمة وأدلة ومشتبه بهم بنمط سينمائي وقانوني دقيق</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-noir-400 hover:text-noir-200 hover:bg-noir-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Difficulty Tier */}
          <div>
            <label className="text-xs font-semibold text-noir-300 flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              مستوى الصعوبة الاستنتاجية
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'easy', label: 'سهل' },
                { id: 'medium', label: 'متوسط' },
                { id: 'hard', label: 'صعب' },
                { id: 'extreme', label: 'صعب جداً' },
                { id: 'state_level', label: 'مستوى دولة' },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setDifficulty(tier.id as CaseDifficulty)}
                  className={`py-2 px-1 text-center text-xs font-semibold rounded-lg border transition-all ${
                    difficulty === tier.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-evidence-glow'
                      : 'bg-noir-950 border-noir-800 text-noir-400 hover:border-noir-700'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legal Framework */}
          <div>
            <label className="text-xs font-semibold text-noir-300 flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-amber-400" />
              النظام القانوني وقواعد الإثبات
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setLegalSystem('saudi')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  legalSystem === 'saudi'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-noir-950 border-noir-800 text-noir-400 hover:border-noir-700'
                }`}
              >
                <div className="text-sm font-bold text-noir-100 mb-1">النظام السعودي</div>
                <div className="text-[11px] leading-relaxed text-noir-400">
                  نظام الإجراءات الجزائية، قواعد الإثبات الجنائي الشرعي، وبطلان القبض والتفتيش المخالف للأنظمة.
                </div>
              </div>

              <div
                onClick={() => setLegalSystem('american')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  legalSystem === 'american'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-noir-950 border-noir-800 text-noir-400 hover:border-noir-700'
                }`}
              >
                <div className="text-sm font-bold text-noir-100 mb-1">القانون الأمريكي (US)</div>
                <div className="text-[11px] leading-relaxed text-noir-400">
                  التعديل الرابع والخامس، تحذيرات ميرندا، معيار الشك المعقول، واستبعاد الأدلة المعيبة إجرائياً.
                </div>
              </div>
            </div>
          </div>

          {/* Length & Language Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-noir-300 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-amber-400" />
                عمق وتشعب القضية
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as CaseLength)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-800 rounded-lg text-xs text-noir-200 focus:border-amber-500"
              >
                <option value="short">قصير (مسرح جريمة مباشر وحل سريع)</option>
                <option value="medium">متوسط (أدلة متقاطعة وتناقضات)</option>
                <option value="long">طويل (شبهات متشعبة وتمويه جنائي)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-noir-300 flex items-center gap-2 mb-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                لغة المحاكاة والتقارير
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-800 rounded-lg text-xs text-noir-200 focus:border-amber-500"
              >
                <option value="ar">اللغة العربية (الفصحى الجنائية)</option>
                <option value="en">English (Detective Noir)</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-noir-400 hover:text-noir-200 bg-noir-800 border border-noir-700 rounded-lg transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-xs font-bold text-noir-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-evidence-glow flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-noir-950" />
                  جارٍ إنشاء وقائع الجريمة وتشفير الحل...
                </>
              ) : (
                'بدء التحقيق وتوليد القضية'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
