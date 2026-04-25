import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { Cloudinary } from '../../core/services/cloudinary';
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
  private cloudinaryService = inject(Cloudinary);

  submitted = signal(false);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);

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

  async handleImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.isUploading.set(true);
    this.uploadError.set(null);

    try {
      const url = await this.cloudinaryService.uploadImage(file);
      this.gameForm.patchValue({ imageUrl: url });
    } catch (error) {
      this.uploadError.set(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      this.isUploading.set(false);
    }
  }
}
