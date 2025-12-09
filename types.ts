export type EraId = 'precambrian' | 'paleozoic' | 'mesozoic' | 'cenozoic' | 'iceage';

export interface Era {
  id: EraId;
  name: string;
  timeRange: string;
  description: string;
  color: string; // Tailwind class base (e.g. 'emerald')
  bgImage: string;
  icon: string;
}

export type DietType = 'herbivore' | 'carnivore' | 'omnivore' | 'piscivore' | 'insectivore';

export interface Creature {
  id: string;
  name: string;
  pronunciation: string;
  eraId: EraId;
  period: string; // e.g., "Late Jurassic"
  region: string;
  diet: DietType;
  size: {
    length: number; // meters
    weight: number; // kg
    comparison: string; // "As long as a school bus"
  };
  dangerLevel: number; // 1-10 (1 = Harmless, 10 = Deadly)
  attributes: {
    intelligence: number; // 1-10
    speed: number; // 1-10
    defense: number; // 1-10
  };
  habitat: 'land' | 'sea' | 'sky' | 'swamp';
  description: string;
  funFacts: string[];
  imageUrl: string;
  silhouetteUrl: string; // For size comparison
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}