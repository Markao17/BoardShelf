// src/app/core/services/game.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // ── Private state ──────────────────────────────────────────────────────
  // Signal with the list of games — loads from LocalStorage on startup
  private _games = signal<Game[]>(this.loadFromStorage());

  // ── Public state (read-only) ─────────────────────────────────────────────
  // Components can access these, but cannot change them directly
  readonly games = this._games.asReadonly();

  readonly totalGames = computed(() => this._games().length);

  // ── CRUD operations ─────────────────────────────────────────────────────

  addGame(game: Omit<Game, 'id' | 'addedAt'>): void {
    const newGame: Game = {
      ...game,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    };

    this._games.update((games) => [...games, newGame]);
    this.saveToStorage();
  }

  getAllGames(): Game[] {
    return this._games();
  }

  getGameById(id: string): Game | undefined {
    return this._games().find((game) => game.id === id);
  }

  updateGame(id: string, changes: Partial<Game>): void {
    this._games.update((games) =>
      games.map((game) => (game.id === id ? { ...game, ...changes } : game)),
    );
    this.saveToStorage();
  }

  deleteGame(id: string): void {
    this._games.update((games) => games.filter((game) => game.id !== id));
    this.saveToStorage();
  }

  // ── LocalStorage ────────────────────────────────────────────────────────

  private saveToStorage(): void {
    localStorage.setItem('boardshelf_games', JSON.stringify(this._games()));
  }

  private loadFromStorage(): Game[] {
    const stored = localStorage.getItem('boardshelf_games');
    if (!stored) return [];

    // Convert the string of addedAt back to Date
    return JSON.parse(stored).map((game: Game) => ({
      ...game,
      addedAt: new Date(game.addedAt),
    }));
  }
}
