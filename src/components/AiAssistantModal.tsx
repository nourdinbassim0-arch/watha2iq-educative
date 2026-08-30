import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Send, 
  Lightbulb, 
  Layers, 
  BookOpen, 
  Compass, 
  RefreshCw 
} from 'lucide-react';
import { DocumentData } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentData;
  onApplyAiSuggestions: (suggestions: any) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  documentData,
  onApplyAiSuggestions,
}) => {
  const [topic, setTopic] = useState(documentData.lessonTitle || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  if (!isOpen) return null;

  const isFr = documentData.language === 'fr';

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pedagogy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: documentData.documentType,
          level: documentData.level,
          grade: documentData.grade,
          subject: isFr ? documentData.subjectNameFr : documentData.subjectNameAr,
          language: documentData.language,
          topic: topic || documentData.lessonTitle,
          prompt: customPrompt,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setGeneratedResult(json.data);
      }
    } catch (err) {
      console.error('Error fetching AI generation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyAiSuggestions(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#065F46] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                المساعد الديداكتيكي والتربوي الذكي
              </h3>
              <p className="text-xs text-[#D1FAE5]">
                توليد الكفايات والأهداف ومراحل الدرس وفق المنهاج المغربي المنقح
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">المادة والمستوى الحالي: </span>
              <span>{documentData.subjectNameAr} ({documentData.grade}) • {documentData.unitOrModule}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5">
              موضوع الدرس / المحور الديداكتيكي:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: التناسبية والسرعة المتوسطة..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#065F46]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5">
              توجيهات أو إرشادات إضافية (اختياري):
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="مثال: التركيز على الوضعيات المشكلة الدالة وبيداغوجيا الفوارق..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] focus:ring-2 focus:ring-[#065F46]"
            />
          </div>

          {/* Action Generate Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري صياغة المحتوى الديداكتيكي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                <span>توليد المقترح البيداغوجي الآن</span>
              </>
            )}
          </button>

          {/* Generated Preview Results */}
          {generatedResult && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-4">
              <h4 className="font-bold text-xs text-[#065F46] flex items-center gap-1.5 border-b border-[#E5E7EB] pb-2">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>المقترح البيداغوجي المولد بنجاح:</span>
              </h4>

              {generatedResult.specificObjectives && (
                <div>
                  <span className="font-bold text-xs text-[#374151] block mb-1">الأهداف التعلمية المقترحة:</span>
                  <ul className="text-xs text-[#4B5563] list-disc list-inside space-y-1">
                    {generatedResult.specificObjectives.map((obj: string, idx: number) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedResult.lessonStages && (
                <div>
                  <span className="font-bold text-xs text-[#374151] block mb-1">مراحل الدرس الموزعة:</span>
                  <div className="space-y-1.5 text-xs text-[#4B5563]">
                    {generatedResult.lessonStages.map((stg: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                        <span className="font-bold text-[#065F46]">{stg.stageName} ({stg.duration}): </span>
                        <span>{stg.teacherActivities}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#4B5563] hover:bg-[#E5E7EB] text-xs font-bold transition-colors"
          >
            إلغاء
          </button>

          {generatedResult && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 border border-[#044735]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تطبيق المقترح على الوثيقة الحالية</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
