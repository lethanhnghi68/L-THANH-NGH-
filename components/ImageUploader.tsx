
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  selectedImage: string | null;
  onImageUpload: (base64: string | null) => void;
  faceIdLock?: boolean;
  setFaceIdLock?: (val: boolean) => void;
  title?: string;
  stepNumber?: number;
  showFaceLock?: boolean;
}

interface CropState {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

const ASPECT_RATIOS = [
  { label: 'Tự do', value: null },
  { label: 'Vuông (1:1)', value: 1 },
  { label: 'Dọc (3:4)', value: 3 / 4 },
  { label: 'Dọc (9:16)', value: 9 / 16 },
  { label: 'Ngang (4:3)', value: 4 / 3 },
  { label: 'Rộng (16:9)', value: 16 / 9 },
];

const ImageUploader: React.FC<Props> = ({ 
  selectedImage, 
  onImageUpload, 
  faceIdLock, 
  setFaceIdLock,
  title = "Tải Ảnh Bé",
  stepNumber = 1,
  showFaceLock = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the cropping flow
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // Cropper internal state
  const [crop, setCrop] = useState<CropState>({ x: 10, y: 10, width: 80, height: 80 });
  const [aspect, setAspect] = useState<number | null>(null); // null means Free
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ 
    startX: number; 
    startY: number; 
    startCrop: CropState; 
    type: 'move' | 'nw' | 'ne' | 'sw' | 'se' 
  } | null>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setRawImage(result);
        setIsCropping(true);
        // Reset crop to default center
        setCrop({ x: 10, y: 10, width: 80, height: 80 });
        setAspect(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Initialize default crop when image loads in editor
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImgDimensions({ width, height, naturalWidth, naturalHeight });
    
    // Set initial crop to center 80%
    setCrop({ x: 10, y: 10, width: 80, height: 80 });
  };

  // --- Cropping Logic ---

  const getClientPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as React.MouseEvent | MouseEvent).clientX, y: (e as React.MouseEvent | MouseEvent).clientY };
  };

  const handleMouseDown = (type: 'move' | 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getClientPos(e);
    draggingRef.current = {
      startX: x,
      startY: y,
      startCrop: { ...crop },
      type
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove as any, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!draggingRef.current || !cropContainerRef.current) return;
    e.preventDefault();

    const { startX, startY, startCrop, type } = draggingRef.current;
    const { x: clientX, y: clientY } = getClientPos(e);
    
    const containerRect = cropContainerRef.current.getBoundingClientRect();
    const deltaXPct = ((clientX - startX) / containerRect.width) * 100;
    const deltaYPct = ((clientY - startY) / containerRect.height) * 100;

    let newCrop = { ...startCrop };

    if (type === 'move') {
      newCrop.x = Math.min(Math.max(startCrop.x + deltaXPct, 0), 100 - startCrop.width);
      newCrop.y = Math.min(Math.max(startCrop.y + deltaYPct, 0), 100 - startCrop.height);
    } else {
      // Resizing logic
      if (type.includes('e')) newCrop.width = Math.min(Math.max(startCrop.width + deltaXPct, 5), 100 - startCrop.x);
      if (type.includes('s')) newCrop.height = Math.min(Math.max(startCrop.height + deltaYPct, 5), 100 - startCrop.y);
      if (type.includes('w')) {
        const maxDelta = startCrop.width - 5;
        const validDelta = Math.min(deltaXPct, maxDelta);
        newCrop.x = Math.min(Math.max(startCrop.x + validDelta, 0), startCrop.x + startCrop.width - 5);
        newCrop.width = startCrop.width - validDelta;
      }
      if (type.includes('n')) {
        const maxDelta = startCrop.height - 5;
        const validDelta = Math.min(deltaYPct, maxDelta);
        newCrop.y = Math.min(Math.max(startCrop.y + validDelta, 0), startCrop.y + startCrop.height - 5);
        newCrop.height = startCrop.height - validDelta;
      }

      // Aspect Ratio Enforcement
      if (aspect) {
        const currentAspect = (newCrop.width * containerRect.width) / (newCrop.height * containerRect.height);
        
        if (type === 'se' || type === 'sw' || type === 'ne' || type === 'nw') {
             // Simple aspect fix: Adjust height based on width to keep it simple
             const newHeightPx = (newCrop.width / 100 * containerRect.width) / aspect;
             const newHeightPct = (newHeightPx / containerRect.height) * 100;
             
             if (newCrop.y + newHeightPct <= 100) {
                newCrop.height = newHeightPct;
             } else {
                // If height overflows, clamp height and adjust width
                newCrop.height = 100 - newCrop.y;
                const newWidthPx = (newCrop.height / 100 * containerRect.height) * aspect;
                newCrop.width = (newWidthPx / containerRect.width) * 100;
             }
        }
      }
    }

    setCrop(newCrop);
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleMouseMove as any);
    window.removeEventListener('touchend', handleMouseUp);
  };

  const handleAspectChange = (newAspect: number | null) => {
    setAspect(newAspect);
    if (newAspect && cropContainerRef.current) {
        // Immediately resize crop box to fit new aspect ratio centered
        const rect = cropContainerRef.current.getBoundingClientRect();
        const currentCenter = {
            x: crop.x + crop.width / 2,
            y: crop.y + crop.height / 2
        };

        let newW = 50; // Start with 50% width
        let newH_px = (newW / 100 * rect.width) / newAspect;
        let newH = (newH_px / rect.height) * 100;

        // Fit to bounds
        if (newH > 80) {
            newH = 80;
            const newW_px = (newH / 100 * rect.height) * newAspect;
            newW = (newW_px / rect.width) * 100;
        }

        setCrop({
            x: Math.max(0, Math.min(100 - newW, currentCenter.x - newW / 2)),
            y: Math.max(0, Math.min(100 - newH, currentCenter.y - newH / 2)),
            width: newW,
            height: newH
        });
    }
  };

  const handleConfirmCrop = () => {
    if (!rawImage) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
        // Calculate actual pixel coordinates
        const pixelX = (crop.x / 100) * img.naturalWidth;
        const pixelY = (crop.y / 100) * img.naturalHeight;
        const pixelW = (crop.width / 100) * img.naturalWidth;
        const pixelH = (crop.height / 100) * img.naturalHeight;

        canvas.width = pixelW;
        canvas.height = pixelH;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(
                img, 
                pixelX, pixelY, pixelW, pixelH, 
                0, 0, pixelW, pixelH
            );
            
            // High quality JPEG
            const base64 = canvas.toDataURL('image/jpeg', 0.95);
            onImageUpload(base64);
            setIsCropping(false);
            setRawImage(null); // Clear raw image to save memory
        }
    };
    img.src = rawImage;
  };

  return (
    <>
    <div className="bg-[#151e32] rounded-lg border border-slate-700 p-2 flex flex-col h-full shadow-lg">
      <div className="flex items-center mb-1.5 px-1">
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 text-white shadow-sm ${stepNumber === 2 ? 'bg-green-600' : 'bg-blue-600'}`}>{stepNumber}</div>
        <h2 className="font-bold text-xs text-slate-200 uppercase tracking-wider truncate">{title}</h2>
      </div>

      <div 
        className="flex-grow relative bg-slate-900/50 rounded-lg border border-dashed border-slate-600/80 hover:border-slate-400 transition-all duration-200 flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={() => !selectedImage && fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <div className="relative w-full h-full group flex items-center justify-center p-4">
              <img 
                src={selectedImage} 
                alt="Uploaded" 
                className="max-w-full max-h-full object-contain shadow-sm rounded-sm" 
              />
              
              {/* Remove Button (Top Right) */}
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onImageUpload(null);
                }}
                className="absolute top-1 right-1 bg-slate-800/80 hover:bg-red-600 text-white p-1 rounded-full shadow-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Xóa ảnh"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                 <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setRawImage(selectedImage);
                        setIsCropping(true);
                    }} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                 >
                    Sửa
                 </button>
                 <button
                    onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                    }} 
                    className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                 >
                    Thay
                 </button>
              </div>
          </div>
        ) : (
          <div className="text-center p-3">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-1 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Chạm để tải ảnh</p>
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

      {/* Face ID Lock Toggle - Only show if enabled */}
      {showFaceLock && faceIdLock !== undefined && setFaceIdLock && (
          <div className="mt-2 bg-blue-900/20 border border-blue-500/20 rounded p-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-0.5 rounded-sm shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-100 uppercase leading-tight">Face ID Lock</p>
              </div>
            </div>
            
            <button 
                onClick={() => setFaceIdLock(!faceIdLock)}
                className={`w-7 h-3.5 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${faceIdLock ? 'bg-blue-500' : 'bg-slate-600'}`}
            >
                <div className={`bg-white w-2.5 h-2.5 rounded-full shadow-md transform duration-300 ease-in-out ${faceIdLock ? 'translate-x-3.5' : ''}`}></div>
            </button>
          </div>
      )}
    </div>

    {/* --- CROP OVERLAY MODAL --- */}
    {isCropping && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-2xl flex flex-col h-[90vh] bg-transparent">
                
                {/* Image Editing Area */}
                <div className="flex-grow relative flex items-center justify-center bg-black overflow-hidden rounded-t-lg">
                    <div className="relative select-none" ref={cropContainerRef}>
                        <img 
                            src={rawImage} 
                            onLoad={onImageLoad}
                            alt="Crop Source" 
                            className="max-w-full max-h-[60vh] object-contain pointer-events-none opacity-60"
                            draggable={false}
                        />
                        
                        {/* Full clarity image inside crop box */}
                        <div 
                            className="absolute overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move"
                            style={{
                                left: `${crop.x}%`,
                                top: `${crop.y}%`,
                                width: `${crop.width}%`,
                                height: `${crop.height}%`,
                                touchAction: 'none'
                            }}
                            onMouseDown={(e) => handleMouseDown('move', e)}
                            onTouchStart={(e) => handleMouseDown('move', e)}
                        >
                             <div className="w-full h-full border-2 border-red-500/80 relative box-border">
                                {/* Grid Lines (Rule of Thirds) */}
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                    <div className="border-r border-b border-white/30"></div>
                                    <div className="border-r border-b border-white/30"></div>
                                    <div className="border-b border-white/30"></div>
                                    <div className="border-r border-b border-white/30"></div>
                                    <div className="border-r border-b border-white/30"></div>
                                    <div className="border-b border-white/30"></div>
                                    <div className="border-r border-white/30"></div>
                                    <div className="border-r border-white/30"></div>
                                    <div></div>
                                </div>

                                {/* Resize Handles */}
                                <div 
                                    className="absolute top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize z-10"
                                    onMouseDown={(e) => handleMouseDown('nw', e)}
                                    onTouchStart={(e) => handleMouseDown('nw', e)}
                                >
                                    <div className="w-3 h-3 bg-white border-2 border-red-500 rounded-full absolute bottom-0 right-0"></div>
                                </div>
                                <div 
                                    className="absolute top-0 right-0 w-6 h-6 translate-x-1/2 -translate-y-1/2 cursor-ne-resize z-10"
                                    onMouseDown={(e) => handleMouseDown('ne', e)}
                                    onTouchStart={(e) => handleMouseDown('ne', e)}
                                >
                                    <div className="w-3 h-3 bg-white border-2 border-red-500 rounded-full absolute bottom-0 left-0"></div>
                                </div>
                                <div 
                                    className="absolute bottom-0 left-0 w-6 h-6 -translate-x-1/2 translate-y-1/2 cursor-sw-resize z-10"
                                    onMouseDown={(e) => handleMouseDown('sw', e)}
                                    onTouchStart={(e) => handleMouseDown('sw', e)}
                                >
                                    <div className="w-3 h-3 bg-white border-2 border-red-500 rounded-full absolute top-0 right-0"></div>
                                </div>
                                <div 
                                    className="absolute bottom-0 right-0 w-6 h-6 translate-x-1/2 translate-y-1/2 cursor-se-resize z-10"
                                    onMouseDown={(e) => handleMouseDown('se', e)}
                                    onTouchStart={(e) => handleMouseDown('se', e)}
                                >
                                    <div className="w-3 h-3 bg-white border-2 border-red-500 rounded-full absolute top-0 left-0"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="bg-white rounded-b-xl p-4 shadow-2xl">
                    <div className="mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">CHỌN TỶ LỆ KHUNG HÌNH:</p>
                        <div className="flex flex-wrap gap-2">
                            {ASPECT_RATIOS.map((ratio) => (
                                <button
                                    key={ratio.label}
                                    onClick={() => handleAspectChange(ratio.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                        (aspect === ratio.value) || (aspect === null && ratio.value === null && aspect !== undefined) 
                                        ? 'bg-rose-500 text-white border-rose-600' 
                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tip Box */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 mb-4">
                        <div className="text-yellow-600 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-4.5 4.5 4.5 0 00-9 0 6.01 6.01 0 001.5 4.5M12 12a2.25 2.25 0 012.25-2.25m-4.5 0h.008v.008H9.75V9.75zm0 0a2.25 2.25 0 012.25 2.25m-4.5 0a2.25 2.25 0 002.25 2.25m0 0h.008v.008H9.75v-.008z" />
                            </svg>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold">Mẹo:</span> Kéo thả để chọn vùng mặt. Sử dụng tỷ lệ "Tự do" nếu muốn cắt tùy ý.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setIsCropping(false);
                                setRawImage(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Hủy Bỏ
                        </button>
                        <button 
                            onClick={handleConfirmCrop}
                            className="flex-1 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg transition-all transform active:scale-95"
                        >
                            Xác Nhận Cắt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default ImageUploader;
