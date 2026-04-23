// src/app/core/services/auth.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { auth } from '../firebase.config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  // User state is a Signal
  currentUser = signal<User | null>(null);

  constructor() {
    // Detect if the user entered or exited
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      if (!user) {
        this.router.navigate(['/']); // Redirect if not logged in
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      this.router.navigate(['/library']);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/']);
  }
}
