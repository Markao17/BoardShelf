// Game model
export interface Game {
  id: string;
  name: string;
  imageUrl?: string;
  minPlayers: number;
  maxPlayers: number;
  avgDurationMinutes: number;
  categories: string[]; // Strategy, Family, Party...
  mode: 'pvp' | 'coop' | 'both';
  complexity: 1 | 2 | 3 | 4 | 5;
  bggId?: string; // filled if coming from the API
  notes?: string; // your personal notes
  addedAt: Date;
}
