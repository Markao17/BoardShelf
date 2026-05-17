// Game model
export interface Game {
  id: string;
  name: string;
  imageUrl?: string;
  yearPublished?: number;
  minPlayers: number;
  maxPlayers: number;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  avgDurationMinutes: number;
  categories: string[]; // Strategy, Family, Party...
  mechanics?: string[];
  mode: 'pvp' | 'coop' | 'both';
  averageWeight?: number;
  complexity: 1 | 2 | 3 | 4 | 5;
  bggId?: string; // filled if coming from the API
  notes?: string; // your personal notes
  addedAt: Date;
}
