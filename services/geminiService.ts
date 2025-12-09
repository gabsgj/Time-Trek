import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' = '1:1'): Promise<string | null> => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return null;
  }

  try {
    const fullPrompt = `Photorealistic, cinematic, award-winning photography of: ${prompt}. Highly detailed, dramatic lighting, 8k resolution. Ensure subject is centered and fully visible within the frame.`;
    
    // Using gemini-2.5-flash-image for generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;

  } catch (error: any) {
    // Gracefully handle Quota Exceeded
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
        console.warn("Gemini API Quota Exceeded (429). Switch to billing/paid plan or wait. Showing fallback assets.");
    } else {
        console.error("Gemini Image Gen Error:", error);
    }
    return null;
  }
}

export const generateCreatureStory = async (creatureName: string): Promise<string> => {
    if (!ai) return "Data log unreachable. Offline mode active.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a very short (2 sentences) fascinating fact about ${creatureName} that sounds like a secret log entry.`
        });
        return response.text || "No data found.";
    } catch (e) {
        return "Log retrieval failed. (System Offline)";
    }
}