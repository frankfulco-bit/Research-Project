export enum Step {
  CONSENT = 'CONSENT',
  DEMOGRAPHICS = 'DEMOGRAPHICS',
  PRE_TEST = 'PRE_TEST',
  BRAND_SELECTION = 'BRAND_SELECTION',
  INTERVENTION_INTRO = 'INTERVENTION_INTRO',
  INTERVENTION_CHAT = 'INTERVENTION_CHAT',
  POST_TEST = 'POST_TEST',
  RESULTS = 'RESULTS',
}

export enum SSESCategory {
  PERFORMANCE = 'Performance',
  SOCIAL = 'Social',
  APPEARANCE = 'Appearance',
}

export interface UserData {
  firstName: string;
  age: string;
  gender: string;
  ethnicity: string;
  trustedBrands: string[];
}

export interface Question {
  id: string;
  text: string;
  category: SSESCategory | 'PANAS_POS' | 'PANAS_NEG' | 'PURCHASE_INTENTION';
  reverseScore?: boolean;
}

export interface SurveyResponse {
  [questionId: string]: number;
}

export interface Scores {
  sses: {
    [key in SSESCategory]: number; // Mean score 1-5
  };
  panas: {
    positive: number;
    negative: number;
  };
  purchaseIntention?: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isNudge?: boolean;
}