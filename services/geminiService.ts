import { GoogleGenAI } from "@google/genai";
import { BeautySettings } from "../types";

// Always use a new instance to ensure we use the latest API key if it changes from a user dialog
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateExpressionImage = async (
  referenceImages: { base64: string; mimeType: string }[],
  expressionPrompt: string,
  stylePrompt: string = '',
  enhance: boolean = false,
  beauty: BeautySettings
): Promise<string> => {
  const ai = getAIClient();
  
  const enhancementInstruction = enhance 
    ? "Enhance the overall image quality, make it sharper, improve lighting, and make it look like a high-end studio photograph."
    : "Maintain a realistic photo quality.";

  let beautyInstruction = "";
  if (beauty.smoothSkin) beautyInstruction += " Apply professional skin smoothing to make the skin look flawless and soft.";
  if (beauty.whiteSkin) beautyInstruction += " Naturally brighten and whiten the skin tone for a radiant look.";
  if (beauty.removeBlemishes) beautyInstruction += " Remove all skin blemishes, freckles, spots, and acne marks.";
  if (beauty.noBeard) beautyInstruction += " Ensure the face is perfectly clean-shaven with no mustache, beard, or stubble.";

  const imageParts = referenceImages.map(img => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        ...imageParts,
        {
          text: `You are an elite YouTube thumbnail designer.
          
          TASK: Create a new version of the person shown in the reference images.
          
          IDENTITY: Use the provided images to strictly maintain the person's facial features and identity. 
          EXPRESSION: ${expressionPrompt}.
          CLOTHING/STYLE: ${stylePrompt || 'Keep the same clothing as the original'}.
          ENHANCEMENT: ${enhancementInstruction}
          BEAUTY/RETOUCHING: ${beautyInstruction}
          
          The final result must look realistic, cinematic, and perfectly optimized for a high-performing YouTube thumbnail. Background should remain consistent but can be aesthetically improved.`
        },
      ],
    },
  });

  // Iterating through parts as per guidelines to find the image data
  const candidates = response.candidates;
  if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error('ไม่พบรูปภาพในผลลัพธ์ของ AI');
};