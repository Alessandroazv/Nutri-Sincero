import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NUTRI_SINCERO_SYSTEM_PROMPT } from '../constants';
import { GoalType } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Analyzes a food label image using Gemini.
 * @param base64Image The base64 string of the image (without the data:image/... prefix)
 * @param goal The user's nutritional goal
 * @param mimeType The mime type of the image
 */
export const analyzeFoodLabel = async (
  base64Image: string,
  goal: GoalType,
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    const userPrompt = `Analise esta embalagem/rótulo. Meu objetivo principal é: ${goal}. Seja o Nutri Sincero.`;

    // Using gemini-3-flash-preview as it supports multimodal inputs effectively and is fast
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: userPrompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      },
      config: {
        systemInstruction: NUTRI_SINCERO_SYSTEM_PROMPT,
        temperature: 0.7, // Balance between creativity and strict adherence to protocol
      }
    });

    return response.text || "Erro: Não consegui gerar uma análise. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao consultar o Nutri Sincero. Verifique sua conexão ou a imagem.");
  }
};
