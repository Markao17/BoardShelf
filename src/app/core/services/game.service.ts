// src/app/core/services/game.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
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
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private authService = inject(AuthService);
  private _games = signal<Game[]>([]);
  readonly games = this._games.asReadonly();
  readonly totalGames = computed(() => this._games().length);

  private unsubscribe?: () => void; // Para desligar o rádio quando o user sai
  private gamesCollection = collection(db, 'games');

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.startListening(user.uid);
      } else {
        this.stopListening?.();
      }
    });
  }

  private startListening(uid: string) {
    // Sub-collection path: users -> user ID -> games
    const gamesRef = collection(db, 'users', uid, 'games');
    // Order by addedAt
    const q = query(gamesRef, orderBy('addedAt', 'desc'));

    // onSnapshot creates a real-time "tunnel"
    this.unsubscribe = onSnapshot(q, (snapshot) => {
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

  private stopListening() {
    if (this.unsubscribe) this.unsubscribe();
    this._games.set([]);
  }
  // ── CRUD operations ─────────────────────────────────────────────────────

  async addGame(game: Omit<Game, 'id' | 'addedAt'>): Promise<void> {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    const gamesRef = collection(db, 'users', uid, 'games');
    await addDoc(gamesRef, {
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
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    const gamesRef = collection(db, 'users', uid, 'games');
    const gameDoc = doc(gamesRef, id);
    await updateDoc(gameDoc, { ...changes });
  }

  async deleteGame(id: string): Promise<void> {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    const gamesRef = collection(db, 'users', uid, 'games');
    const gameDoc = doc(gamesRef, id);
    await deleteDoc(gameDoc);
  }
}
