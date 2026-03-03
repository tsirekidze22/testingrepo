import { CorrectionResult } from "../types";

export const processGeorgianText = async (text: string): Promise<CorrectionResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'ტექსტის დამუშავება ვერ მოხერხდა.');
    }

    const result: CorrectionResult = await response.json();
    return result;
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.message || "ტექსტის დამუშავება ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.");
  }
};
