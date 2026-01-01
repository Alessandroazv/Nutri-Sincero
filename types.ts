export enum GoalType {
  WEIGHT_LOSS = 'Emagrecimento',
  MUSCLE_GAIN = 'Ganho de Massa Muscular',
  GENERAL_HEALTH = 'Saúde Geral'
}

export interface AnalysisResponse {
  text: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}