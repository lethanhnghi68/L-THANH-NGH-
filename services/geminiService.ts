
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBabyImages = async (
  imageBase64: string,
  promptDescription: string,
  faceIdLock: boolean,
  targetImageBase64?: string | null,
  targetFaceIdLock: boolean = true,
  aspectRatio: AspectRatio = '1:1'
): Promise<string[]> => {
  const client = getClient();
  
  // Clean base64 string if needed (remove data:image/...;base64, prefix)
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Prepare parts array
  const parts: any[] = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64
      }
    }
  ];

  let basePrompt = "";

  if (targetImageBase64) {
      const cleanTargetBase64 = targetImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      parts.push({
          inlineData: {
              mimeType: 'image/jpeg',
              data: cleanTargetBase64
          }
      });

      // Face Swap / Merge Mode (Target Image is the Template)
      basePrompt = `Context: ${promptDescription}. 
      INSTRUCTION: The first image is the source face (Child). The second image is the target person/template. 
      Replace the face of the person in the second image with the face of the child from the first image. 
      Blend the skin tones, lighting, and head angle seamlessly to look natural. 
      Maintain the expression and identity of the child.`;
      
      if (targetFaceIdLock) {
        basePrompt += " CRITICAL REQUIREMENT: Preserve the exact pose, background, lighting, costume, and body structure of the SECOND image. Do not alter the environment or body type of the second image. Only blend the face.";
      } else {
        basePrompt += " Use the second image as a strong visual reference for the character and costume, but you are free to adapt the lighting, background, or artistic style to match the prompt description.";
      }
      basePrompt += " High quality, photorealistic, 8k resolution.";

  } else {
      // Single image prompt
      basePrompt = `${promptDescription}. `;
      
      if (faceIdLock) {
        basePrompt += " CRITICAL REQUIREMENT: Preserve the exact facial features, identity, and expression of the child in the input image. The output must look exactly like the same child, just in a different costume/environment. Blend the face naturally.";
      } else {
        basePrompt += " Ensure the character in the image resembles the child in the input image in terms of age, ethnicity, and general facial structure, but prioritize fitting the artistic style.";
      }

      basePrompt += " High quality, photorealistic, 8k resolution.";
  }

  // Define 4 distinct style variations to ensure the images look different
  const styleVariations = [
    "Variation 1: Natural lighting, balanced composition, realistic texture.",
    "Variation 2: Cinematic lighting, dramatic depth of field, emotional atmosphere.",
    "Variation 3: Soft dreamy glow, pastel color palette, magical ambiance.",
    "Variation 4: Vibrant and vivid colors, sharp contrast, dynamic lighting."
  ];

  try {
    // Helper function to generate a single variation
    const generateVariation = async (styleSuffix: string) => {
      const response: GenerateContentResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash-image', // Using the efficient image model
        contents: {
          parts: [
            ...parts,
            {
              text: basePrompt + " " + styleSuffix
            }
          ]
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio
            }
        }
      });

      // Extract image from response
      const partsResponse = response.candidates?.[0]?.content?.parts;
      if (partsResponse) {
        for (const part of partsResponse) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    };

    // Run 4 generations in parallel with different style prompts
    const results = await Promise.all([
      generateVariation(styleVariations[0]), 
      generateVariation(styleVariations[1]),
      generateVariation(styleVariations[2]), 
      generateVariation(styleVariations[3])
    ]);
    
    // Filter out nulls
    return results.filter((img): img is string => img !== null);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
