import React, { useRef } from 'react';

interface Props {
  targetImage: string | null;
  onTargetUpload: (base64: string) => void;
  onSwap: () => void;
  isGenerating: boolean;
  canSwap: boolean;
}

const FaceSwapPanel: React.FC<Props> = ({ targetImage, onTargetUpload, onSwap, isGenerating, canSwap }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onTargetUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-green-600 text-xs font-bold px-2 py-1 rounded mr-2">2</div>
          <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Chọn Ảnh Nền / Nhân Vật</h2>
        </div>
        <span className="text-xs text-slate-500 italic">Tải lên ảnh mẫu để ghép mặt bé vào</span>
      </div>

      {/* Upload Area */}
      <div 
        className="flex-grow relative bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 hover:border-green-500/50 transition-colors flex items-center justify-center overflow-hidden cursor-pointer group mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        {targetImage ? (
          <div className="relative w-full h-full">
              <img src={targetImage} alt="Target Template" className="w-full h-full object-contain" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="bg-slate-800/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                    Thay ảnh khác
                 </span>
              </div>
          </div>
        ) : (
          <div className="text-center p-6">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
             </div>
             <p className="text-sm text-slate-300 font-bold">Tải lên ảnh mẫu</p>
             <p className="text-xs text-slate-500 mt-2">Ảnh siêu nhân, công chúa, hoặc cảnh đẹp bất kỳ...</p>
          </div>
        )}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
        />
      </div>

      {/* Tip */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-4">
         <p className="text-xs text-slate-400 text-center">
            Mẹo: Chọn ảnh có khuôn mặt rõ ràng để AI nhận diện và ghép tốt nhất.
         </p>
      </div>

      {/* Swap Button */}
      <button
        onClick={onSwap}
        disabled={!canSwap || isGenerating}
        className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider text-white shadow-lg transition-all transform active:scale-95 ${
            !canSwap
            ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
            : isGenerating
            ? 'bg-slate-700 cursor-wait'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30'
        }`}
      >
        {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý ghép mặt...
            </span>
        ) : (
            "Thực Hiện Ghép Ảnh"
        )}
      </button>
    </div>
  );
};

export default FaceSwapPanel;
