import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { 
  SYSTEM_INSTRUCTION_TEMPLATE, 
  APPEARANCE_NUDGES, 
  SOCIAL_NUDGES, 
  PERFORMANCE_NUDGES 
} from "../constants";
import { SSESCategory } from "../types";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing");
      throw new Error("API Key missing");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = async (name: string, brand: string, lowestSubscale: string) => {
  const client = getAI();
  
  // Select the correct bank based on subscale
  let nudgeBank: string[] = [];
  switch (lowestSubscale) {
    case SSESCategory.SOCIAL:
      nudgeBank = SOCIAL_NUDGES;
      break;
    case SSESCategory.PERFORMANCE:
      nudgeBank = PERFORMANCE_NUDGES;
      break;
    case SSESCategory.APPEARANCE:
    default:
      nudgeBank = APPEARANCE_NUDGES;
      break;
  }

  // Format the bank for the prompt
  const nudgeBankString = nudgeBank
    .map((nudge, index) => `${index + 1}. "${nudge}"`)
    .join('\n');

  const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
    .replace('{{NAME}}', name)
    .replace('{{NAME}}', name) // Second instance
    .replace('{{BRAND}}', brand)
    .replace('{{BRAND}}', brand)
    .replace('{{SUBSCALE}}', lowestSubscale)
    .replace('{{NUDGE_BANK}}', nudgeBankString);

  chatSession = client.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      candidateCount: 1,
    }
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I'm having trouble connecting right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered a temporary error. Let's continue in a moment.";
  }
};