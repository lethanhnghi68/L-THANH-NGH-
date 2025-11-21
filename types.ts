
export interface Scenario {
  id: string;
  label: string;
  icon?: string;
  prompts: PromptOption[];
}

export interface PromptOption {
  id: string;
  label: string; // Display text
  description: string; // Engineering prompt
}

export interface GeneratedImage {
  id: string;
  url: string;
}

export enum AppState {
  IDLE,
  GENERATING,
  SUCCESS,
  ERROR
}

export type AspectRatio = '1:1' | '3:4' | '9:16' | '4:3' | '16:9';
