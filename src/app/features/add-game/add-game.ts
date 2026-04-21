import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-add-game',
  imports: [ReactiveFormsModule],
  templateUrl: './add-game.html',
  styleUrl: './add-game.scss',
})
export class AddGame {
  private gameService = inject(GameService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  submitted = signal(false);

  gameForm = this.fb.group({
    name: ['', Validators.required],
    imageUrl: [''],
    minPlayers: [2, Validators.required],
    maxPlayers: [4, Validators.required],
    avgDurationMinutes: [30, Validators.required],
    categories: ['', Validators.required],
    mode: ['pvp', Validators.required],
    complexity: [3, Validators.required],
    notes: [''],
  });

  handleSubmit() {
    if (this.gameForm.valid) {
      const raw = this.gameForm.getRawValue();
      this.gameService.addGame({
        ...(raw as any),
        categories: raw.categories ? raw.categories.split(',').map((c: string) => c.trim()) : [],
      });
      this.submitted.set(true);
      setTimeout(() => {
        this.router.navigate(['/library']);
      }, 2000);
    }
  }
}
