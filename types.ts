
export interface CorrectionResult {
  originalText: string;
  correctedText: string;
  explanation?: string;
  isCorrect: boolean;
}

export interface HistoryItem extends CorrectionResult {
  id: string;
  timestamp: number;
}
