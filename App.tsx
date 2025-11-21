
import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './constants';
import { GeneratedImage, AspectRatio } from './types';
import CategorySelector from './components/CategorySelector';
import ImageUploader from './components/ImageUploader';
import ActivityPanel from './components/ActivityPanel';
import ResultGallery from './components/ResultGallery';
import { generateBabyImages } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(SCENARIOS[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [faceIdLock, setFaceIdLock] = useState(true);
  
  // New State for Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  // Helper to get current scenario object
  const currentScenario = SCENARIOS.find(s => s.id === selectedCategoryId) || SCENARIOS[0];

  const handleGenerate = async (prompt: string) => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedImages([]); // Clear previous

    try {
      const base64Images = await generateBabyImages(
        uploadedImage, 
        prompt, 
        faceIdLock, 
        null, // No target image
        false, // No target face lock
        aspectRatio
      );
      
      const newImages: GeneratedImage[] = base64Images.map((url, idx) => ({
        id: Date.now().toString() + idx,
        url
      }));

      setGeneratedImages(newImages);
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Đã có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pb-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="py-6 flex flex-col items-center justify-center text-center">
         <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2">
            BabyMagic Studio AI
         </h1>
         <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-slate-300">
              App được tạo ra bởi Nghị Marketing
            </p>
            <p className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              Làm app theo yêu cầu liên hệ zalo: 081 969 2828
            </p>
         </div>
      </div>

      {/* Category Selector */}
      <CategorySelector 
          scenarios={SCENARIOS} 
          selectedId={selectedCategoryId} 
          onSelect={setSelectedCategoryId} 
      />
      
      {/* Main Grid Layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* Left Column: Uploads (3 cols) */}
        <div className="lg:col-span-3 h-full flex flex-col gap-2">
          <div className="flex-1 min-h-0">
            <ImageUploader 
              title="1. TẢI ẢNH BÉ"
              stepNumber={1}
              selectedImage={uploadedImage} 
              onImageUpload={setUploadedImage}
              faceIdLock={faceIdLock}
              setFaceIdLock={setFaceIdLock}
              showFaceLock={true}
            />
          </div>
        </div>

        {/* Middle Column: Activity Selection (4 cols) */}
        <div className="lg:col-span-4 h-full bg-[#151e32] rounded-xl border border-slate-700 p-6 shadow-xl">
          <ActivityPanel 
            scenario={currentScenario} 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            canGenerate={!!uploadedImage}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />
        </div>

        {/* Right Column: Results (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <ResultGallery 
            images={generatedImages} 
            isGenerating={isGenerating}
            aspectRatio={aspectRatio}
          />
        </div>

      </div>
    </div>
  );
};

export default App;
