import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { Cloudinary } from '../../core/services/cloudinary';
import { Router } from '@angular/router';
import { BggSearchResult } from '../../core/models/bgg-search-result.model';
import { BggService } from '../../core/services/bgg.service';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-game',
  imports: [ReactiveFormsModule],
  templateUrl: './add-game.html',
  styleUrl: './add-game.scss',
})
export class AddGame implements OnInit {
  private gameService = inject(GameService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cloudinaryService = inject(Cloudinary);
  private bggService = inject(BggService);

  searchResults = signal<BggSearchResult[]>([]);
  isSearching = signal(false);
  searchError = signal<string | null>(null);

  searchControl = new FormControl('');

  submitted = signal(false);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);

  selectGame(result: BggSearchResult) {
    this.gameForm.patchValue({
      bggId: result.bggId,
      name: result.name,
    });
    this.searchControl.setValue('');
    this.searchResults.set([]);
    this.isSearching.set(false);
    this.searchError.set(null);
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query?.trim()) {
            this.searchResults.set([]);
            this.searchError.set(null);
            return of([]);
          }
          this.isSearching.set(true);
          this.searchError.set(null);
          return this.bggService.search(query).pipe(
            catchError((err: unknown) => {
              const message = err instanceof Error ? err.message : 'Search failed.';
              this.searchError.set(message);
              console.error('[BGG search] failed:', err);
              return of([] as BggSearchResult[]);
            }),
          );
        }),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.isSearching.set(false);
      });
  }

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
    bggId: [''], //filled if coming from the API
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
