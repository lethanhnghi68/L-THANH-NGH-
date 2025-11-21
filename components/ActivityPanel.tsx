
import React, { useState, useEffect } from 'react';
import { PromptOption, Scenario, AspectRatio } from '../types';

interface Props {
  scenario: Scenario;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  canGenerate: boolean;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
}

const RATIO_OPTIONS: { label: string; value: AspectRatio; iconClass: string }[] = [
  { 
    label: 'Vuông (1:1)', 
    value: '1:1',
    iconClass: 'w-4 h-4 border-2 border-current rounded-sm' 
  },
  { 
    label: 'Dọc (3:4)', 
    value: '3:4',
    iconClass: 'w-3 h-4 border-2 border-current rounded-sm'
  },
  { 
    label: 'Dọc (9:16)', 
    value: '9:16',
    iconClass: 'w-3 h-5 border-2 border-current rounded-sm'
  },
  { 
    label: 'Ngang (16:9)', 
    value: '16:9',
    iconClass: 'w-5 h-3 border-2 border-current rounded-sm'
  }
];

const ActivityPanel: React.FC<Props> = ({ 
  scenario, 
  onGenerate, 
  isGenerating, 
  canGenerate,
  aspectRatio,
  setAspectRatio
}) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [finalText, setFinalText] = useState('');

  useEffect(() => {
    // Reset selection when scenario changes
    setSelectedPromptId(null);
    setCustomInput('');
    setFinalText('');
  }, [scenario.id]);

  const handleSelect = (prompt: PromptOption) => {
    setSelectedPromptId(prompt.id);
    setCustomInput(''); // Clear custom if selecting preset
    setFinalText(prompt.description);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    setSelectedPromptId(null); // Deselect preset
    // For custom, we just use the input + generic engineering
    setFinalText(e.target.value); 
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-purple-600 text-xs font-bold px-2 py-1 rounded mr-2">2</div>
          <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Chọn Hoạt Động & Bối Cảnh</h2>
        </div>
        <span className="text-xs text-slate-500 italic">Chọn một kịch bản bên dưới</span>
      </div>

      {/* Scrollable list of prompts */}
      <div className="flex-grow overflow-y-auto pr-2 space-y-2 mb-4 custom-scrollbar">
        {scenario.prompts.map((prompt) => (
          <div
            key={prompt.id}
            onClick={() => handleSelect(prompt)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 text-sm font-medium ${
              selectedPromptId === prompt.id
                ? 'bg-slate-800 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'bg-[#151e32] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {prompt.label}
          </div>
        ))}
        
        {/* Custom Input */}
        <div className={`relative rounded-lg border transition-all duration-200 ${
            customInput.length > 0 
            ? 'bg-slate-800 border-purple-500' 
            : 'bg-[#151e32] border-slate-700'
        }`}>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                value={customInput}
                onChange={handleCustomChange}
                placeholder="Khác (Viết theo ý bạn...)"
                className="w-full bg-transparent p-4 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
        </div>
      </div>

      {/* Preview of selection text */}
      <div className="bg-[#0f1523] border border-slate-700 rounded-lg p-3 mb-4 h-16 overflow-hidden flex items-center">
        <div className="w-full">
            <p className="text-[10px] text-slate-500 mb-0.5">Nội dung đã chọn:</p>
            <p className="text-sm text-slate-300 line-clamp-1 font-medium">
                {selectedPromptId 
                    ? scenario.prompts.find(p => p.id === selectedPromptId)?.label 
                    : customInput || "Chưa chọn nội dung..."}
            </p>
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Tùy Chỉnh Khung Hình:</p>
        <div className="grid grid-cols-4 gap-2">
          {RATIO_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setAspectRatio(option.value)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all duration-200 ${
                aspectRatio === option.value
                  ? 'bg-slate-700 border-cyan-400 text-cyan-400 shadow-sm'
                  : 'bg-[#151e32] border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <div className={`mb-1 ${option.iconClass}`}></div>
              <span className="text-[10px] font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => finalText && onGenerate(finalText)}
        disabled={!canGenerate || isGenerating || !finalText}
        className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider text-white shadow-lg transition-all transform active:scale-95 ${
            !canGenerate || !finalText
            ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
            : isGenerating
            ? 'bg-slate-700 cursor-wait'
            : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-purple-500/30'
        }`}
      >
        {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang khởi tạo...
            </span>
        ) : (
            "Tạo Bộ Ảnh Ngay"
        )}
      </button>
    </div>
  );
};

export default ActivityPanel;
