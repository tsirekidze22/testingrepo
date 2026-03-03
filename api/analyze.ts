import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

interface CorrectionResult {
  originalText: string;
  correctedText: string;
  explanation?: string;
  isCorrect: boolean;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (text.length > 10000) {
    return res.status(400).json({ error: 'Text is too long (max 10000 characters)' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  console.log('GEMINI_API_KEY retrieved successfully (length:', apiKey.length, ', prefix:', apiKey.slice(0, 4) + '***)');

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
    You are a professional Georgian linguist and editor. 
    Analyze the input Georgian text for spelling, grammatical, and punctuation errors.
    
    Instructions:
    1. Identify typos, incorrect verb conjugations, case ending errors, and punctuation mistakes.
    2. Output the corrected version of the text.
    3. Highlight the changes by wrapping corrected words or phrases in brackets and bold text: **[შესწორებული სიტყვა]**.
    4. Maintain the original tone and meaning.
    5. If there are no mistakes, return the text exactly as is and set isCorrect to true.
    6. Provide a very brief explanation in Georgian about what was corrected.
  `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: {
              type: Type.STRING,
              description: 'The full text with corrected parts in **[word]** format.',
            },
            explanation: {
              type: Type.STRING,
              description: 'A summary of the changes made.',
            },
            isCorrect: {
              type: Type.BOOLEAN,
              description: 'True if the original text was already perfect.',
            },
          },
          required: ['correctedText', 'isCorrect'],
        },
      },
    });

    const result = JSON.parse(response.text.trim());
    
    const correctionResult: CorrectionResult = {
      originalText: text,
      correctedText: result.correctedText,
      explanation: result.explanation,
      isCorrect: result.isCorrect,
    };

    return res.status(200).json(correctionResult);
  } catch (error: any) {
    console.error('Gemini API Error message:', error?.message);
    console.error('Gemini API Error status:', error?.status ?? error?.code);
    console.error('Gemini API Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({
      error: 'ტექსტის დამუშავება ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.'
    });
  }
}
