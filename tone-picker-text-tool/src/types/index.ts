export interface TonePosition {
  x: number; // -1 (formal) to 1 (casual)
  y: number; // -1 (professional) to 1 (friendly)
}

export interface TextRevision {
  id: string;
  text: string;
  tone: TonePosition;
  timestamp: number;
}

export interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}
