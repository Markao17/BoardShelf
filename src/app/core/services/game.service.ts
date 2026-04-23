// src/app/core/services/game.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { db } from '../firebase.config';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _games = signal<Game[]>([]);
  readonly games = this._games.asReadonly();
  readonly totalGames = computed(() => this._games().length);

  private gamesCollection = collection(db, 'games');

  constructor() {
    this.listenToGames();
  }

  private listenToGames() {
    // Order by addedAt
    const q = query(this.gamesCollection, orderBy('addedAt', 'desc'));

    // onSnapshot creates a real-time "tunnel"
    onSnapshot(q, (snapshot) => {
      const updatedGames = snapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id, // The ID now comes from Firestore
            addedAt: doc.data()['addedAt']?.toDate(), // Convert Timestamp from Firebase to Date JS
          }) as Game,
      );

      this._games.set(updatedGames);
    });
  }
  // ── CRUD operations ─────────────────────────────────────────────────────

  async addGame(game: Omit<Game, 'id' | 'addedAt'>): Promise<void> {
    await addDoc(this.gamesCollection, {
      ...game,
      addedAt: new Date(),
    });
  }

  getAllGames(): Game[] {
    return this._games();
  }

  getGameById(id: string): Game | undefined {
    return this._games().find((game) => game.id === id);
  }

  async updateGame(id: string, changes: Partial<Game>): Promise<void> {
    const gameDoc = doc(db, 'games', id);
    await updateDoc(gameDoc, { ...changes });
  }

  async deleteGame(id: string): Promise<void> {
    const gameDoc = doc(db, 'games', id);
    await deleteDoc(gameDoc);
  }
}
