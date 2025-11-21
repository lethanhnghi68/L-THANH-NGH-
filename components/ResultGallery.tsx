
import React, { useState } from 'react';
import { GeneratedImage, AspectRatio } from '../types';

interface Props {
  images: GeneratedImage[];
  isGenerating: boolean;
  aspectRatio: AspectRatio;
}

const ResultGallery: React.FC<Props> = ({ images, isGenerating, aspectRatio }) => {
  const [previewData, setPreviewData] = useState<{ url: string; index: number } | null>(null);
  
  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `baby-magic-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach((img, idx) => handleDownload(img.url, idx));
  };

  // Force square aspect ratio for grid items to maintain consistent layout
  // regardless of the selected output ratio.
  const ratioClass = 'aspect-square';

  return (
    <div className="bg-[#151e32] rounded-xl border border-slate-700 p-4 flex flex-col h-full">
       <div className="flex items-center justify-center mb-4">
        <h2 className="font-bold text-sm text-cyan-400 uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Kết Quả</h2>
      </div>

      <div className="flex-grow grid grid-cols-2 gap-3 auto-rows-fr overflow-y-auto custom-scrollbar">
        {isGenerating ? (
            // Skeletons
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`bg-slate-800 rounded-lg animate-pulse flex items-center justify-center ${ratioClass}`}>
                    <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            ))
        ) : images.length > 0 ? (
            images.map((img, idx) => (
                <div 
                    key={img.id} 
                    className={`relative group rounded-lg overflow-hidden ${ratioClass} border border-slate-600 hover:border-cyan-400 transition-all cursor-pointer`}
                    onClick={() => setPreviewData({ url: img.url, index: idx })}
                >
                    <img src={img.url} alt={`Result ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(img.url, idx);
                            }}
                            className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                            title="Tải về"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l4.5-4.5m-4.5 4.5l-4.5-4.5M12 3v9" />
                            </svg>
                         </button>
                         <button 
                            className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                             title="Xem trước (Preview)"
                             onClick={(e) => {
                                e.stopPropagation();
                                setPreviewData({ url: img.url, index: idx });
                             }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                         </button>
                    </div>
                </div>
            ))
        ) : (
            // Empty State
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center ${ratioClass} opacity-50`}>
                    <div className="text-slate-600 text-xs">Trống</div>
                </div>
            ))
        )}
      </div>

        {images.length > 0 && (
            <button 
                onClick={handleDownloadAll}
                className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-sm shadow-lg transition-all active:scale-95 uppercase"
            >
                Tải Tất Cả Về Máy
            </button>
        )}

        {/* PREVIEW MODAL */}
        {previewData && (
            <div 
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setPreviewData(null)}
            >
                <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                     {/* Top Bar Actions */}
                     <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
                        <button 
                            onClick={() => handleDownload(previewData.url, previewData.index)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-transform active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l4.5-4.5m-4.5 4.5l-4.5-4.5M12 3v9" />
                            </svg>
                            Tải ảnh này
                        </button>
                        
                        <button 
                            className="text-white/70 hover:text-white p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
                            onClick={() => setPreviewData(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                     </div>

                     <img 
                        src={previewData.url} 
                        alt="Full Preview" 
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                     />
                     
                     <div className="mt-4 text-slate-400 text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        Nhấn nút Tải về ở góc phải để lưu ảnh
                     </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ResultGallery;
