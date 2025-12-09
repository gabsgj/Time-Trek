

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- RATE LIMITING QUEUE SYSTEM ---
interface QueueItem {
  prompt: string;
  aspectRatio: string;
  resolve: (value: string | null) => void;
}

const requestQueue: QueueItem[] = [];
let isProcessing = false;
let currentDelay = 4000; // Start with 4 seconds (conservative for 15 RPM)
const MAX_DELAY = 10000; // Max wait 10s if we get 429s

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;

  const item = requestQueue.shift();
  if (!item) {
    isProcessing = false;
    return;
  }

  try {
    const result = await executeGeneration(item.prompt, item.aspectRatio);
    item.resolve(result);
    // Success? Reduce delay slightly to optimize speed, down to min 2s
    currentDelay = Math.max(2000, currentDelay - 500);
  } catch (error: any) {
    console.warn("Queue processing error:", error);
    item.resolve(null);
    // Error? Increase delay
    currentDelay = Math.min(MAX_DELAY, currentDelay + 2000);
  }

  // Cooldown before processing next item
  setTimeout(() => {
    isProcessing = false;
    processQueue();
  }, currentDelay);
};

// Internal function that actually calls the API
const executeGeneration = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    if (!ai) return null;
    
    // Map ratio strings to Gemini config if needed, or prompt tuning
    // Note: 'gemini-2.5-flash-image' uses aspect ratio in config
    
    const fullPrompt = `Photorealistic, cinematic, award-winning photography of: ${prompt}. Highly detailed, dramatic lighting, 8k resolution. Ensure subject is centered and fully visible.`;

    try {
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

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error: any) {
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            console.warn("API Quota Hit. Backing off...");
            throw new Error("429"); // Throw to trigger backoff logic in queue
        }
        console.error("Gemini Gen Error:", error);
        return null;
    }
};

// Public facing function adds to queue instead of calling directly
export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string | null> => {
  return new Promise((resolve) => {
    requestQueue.push({ prompt, aspectRatio, resolve });
    processQueue();
  });
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