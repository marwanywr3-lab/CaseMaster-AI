import React, { useState } from 'react';
import { 
  Gavel, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Award, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

interface VerdictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerdictModal: React.FC<VerdictModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, closeCaseWithVerdict } = useInvestigation();

  const [accused, setAccused] = useState('');
  const [motive, setMotive] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !activeCase) return null;

  const handleSubmitVerdict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accused.trim() || !motive.trim()) return;

    setSubmitting(true);
    await closeCaseWithVerdict(accused, motive, evidence);
    setSubmitting(false);
  };

  const isClosed = activeCase.isClosed;
  const report = activeCase.verdictReport;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-noir-900 border border-noir-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-noir-850 border-b border-noir-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-noir-100">
                {isClosed ? 'تقرير المحكمة والحل الحقيقي للقضية' : 'إيداع لائحة الاتهام وإغلاق ملف التحقيق'}
              </h3>
              <p className="text-xs text-noir-400">
                {isClosed ? 'تم كشف التشفير وإظهار الحقيقة الكاملة' : 'لن تتمكن من استجواب المشتبه بهم بعد تقديم هذا القرار'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-noir-400 hover:text-noir-200 hover:bg-noir-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isClosed && report ? (
            /* Results View */
            <div className="space-y-6">
              {/* Verdict Score Card */}
              <div
                className={`p-5 rounded-xl border flex items-center gap-4 ${
                  report.score >= 60
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                {report.score >= 60 ? (
                  <CheckCircle className="w-10 h-10 flex-shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="w-10 h-10 flex-shrink-0 text-rose-400" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold">
                      {report.score >= 60 ? 'تم إثبات الإدانة بنجاح' : 'فشلت القضية أمام المحكمة'}
                    </h4>
                    <span className="text-sm font-mono font-black px-2 py-0.5 rounded bg-noir-950/60 border border-current">
                      الدرجة: {report.score} / 100
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{report.feedback}</p>
                </div>
              </div>

              {/* True Revealed Solution (Decrypted) */}
              <div className="p-5 bg-noir-950 border border-noir-700 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>الحل الجنائي الحقيقي (تم فك التشفير عبر AES-256):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg">
                    <span className="text-noir-500 block mb-0.5">الجاني الحقيقي:</span>
                    <span className="font-bold text-noir-100">{report.revealedSolution.culprit}</span>
                  </div>
                  <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg">
                    <span className="text-noir-500 block mb-0.5">أداة الجريمة / الأسلوب:</span>
                    <span className="font-bold text-noir-100">{report.revealedSolution.murderWeaponOrMethod}</span>
                  </div>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg text-xs">
                  <span className="text-noir-500 block mb-0.5">الدافع الحقيقي:</span>
                  <span className="text-noir-200">{report.revealedSolution.motive}</span>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg text-xs">
                  <span className="text-noir-500 block mb-0.5">الدليل القاطع الميداني:</span>
                  <span className="text-amber-300 font-medium">{report.revealedSolution.smokingGunEvidence}</span>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg text-xs">
                  <span className="text-noir-500 block mb-0.5">تسلسل الأحداث الواقعي:</span>
                  <p className="text-noir-300 leading-relaxed">{report.revealedSolution.summaryOfEvents}</p>
                </div>

                <div className="p-3 bg-noir-900 border border-noir-800 rounded-lg text-xs">
                  <span className="text-noir-500 block mb-0.5">التكييف القانوني / المادة المنتهكة:</span>
                  <span className="font-mono text-noir-300">{report.revealedSolution.legalStatuteViolated}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Submission Form View */
            <form id="verdict-form" onSubmit={handleSubmitVerdict} className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-300">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                  تحذير إجرائي: تقديم لائحة الاتهام سيغلق باب الاستجواب نهائياً وسيقوم المحرك بفك تشفير حل القضية ومقارنة مذكرتك مع الحقيقة الجنائية المثبتة.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-noir-300 mb-1.5">
                  اسم المتهم الرئيسي (الجاني)
                </label>
                <select
                  value={accused}
                  onChange={(e) => setAccused(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 rounded-lg text-xs text-noir-100 focus:border-amber-500"
                >
                  <option value="">-- اختر المتهم من قائمة المشتبه بهم --</option>
                  {activeCase.suspects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-noir-300 mb-1.5">
                  الدافع الجنائي المكتشف
                </label>
                <textarea
                  rows={3}
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  placeholder="اشرح الدافع وراء ارتكاب الجريمة (انتقام، تستر مالي، خلاف عائلي...)"
                  required
                  className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 rounded-lg text-xs text-noir-100 placeholder-noir-600 focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-noir-300 mb-1.5">
                  الدليل القاطع الذي يدين المتهم دون شك معقول
                </label>
                <textarea
                  rows={3}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="ما هو الدليل الذي يكسر حجة غيابه أو يربطه مباشرة بمسرح الجريمة؟"
                  required
                  className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 rounded-lg text-xs text-noir-100 placeholder-noir-600 focus:border-amber-500 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-noir-850 border-t border-noir-700/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-noir-400 hover:text-noir-200 bg-noir-800 border border-noir-700 rounded-lg transition-colors"
          >
            {isClosed ? 'إغلاق التقرير' : 'الرجوع للتحقيق'}
          </button>

          {!isClosed && (
            <button
              type="submit"
              form="verdict-form"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-noir-950 bg-red-400 hover:bg-red-300 rounded-lg shadow-alert-glow flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Gavel className="w-4 h-4" />
              {submitting ? 'جارٍ إيداع اللائحة وفك التشفير...' : 'تقديم الاتهام وإغلاق القضية'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
