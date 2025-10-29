export interface UserProfile {
  name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  landSize: string;
  mainCrops: string[];
  language: string;
  useDemoData: boolean;
}

export interface DiagnosisResult {
  disease: string;
  scientific: string;
  confidence: number;
  status: 'high' | 'medium' | 'low';
  advice: string[];
  alternatives?: { disease: string; confidence: number }[];
  timestamp: string;
  image?: string;
}

export interface MarketPrice {
  crop: string;
  market: string;
  unit: string;
  today: number;
  yesterday: number;
  trend: number;
  last7: number[];
  timestamp: string;
}

export interface Scheme {
  id: string;
  title: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  apply: string;
  contact: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'image';
  data?: DiagnosisResult | MarketPrice | Scheme;
}

export interface HistoryItem {
  id: string;
  query: string;
  type: 'diagnosis' | 'market' | 'scheme' | 'chat';
  timestamp: string;
  preview: string;
  data?: any;
}
