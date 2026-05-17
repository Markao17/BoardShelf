import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { Game } from '../../core/models/game.model';
import { Cloudinary } from '../../core/services/cloudinary';
import { Router } from '@angular/router';
import { BggSearchResult } from '../../core/models/bgg-search-result.model';
import { BggService } from '../../core/services/bgg.service';
import { BggThingDetails } from '../../core/models/bgg-thing-details.model';
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
  searchPage = signal(1);
  isSearching = signal(false);
  searchError = signal<string | null>(null);
  isLoadingThing = signal(false);
  thingLoadError = signal<string | null>(null);
  selectedBggDetails = signal<BggThingDetails | null>(null);
  readonly searchPageSize = 10;

  searchTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.searchResults().length / this.searchPageSize)),
  );
  paginatedSearchResults = computed(() => {
    const startIndex = (this.searchPage() - 1) * this.searchPageSize;
    return this.searchResults().slice(startIndex, startIndex + this.searchPageSize);
  });
  searchResultStart = computed(() => {
    if (this.searchResults().length === 0) return 0;
    return (this.searchPage() - 1) * this.searchPageSize + 1;
  });
  searchResultEnd = computed(() =>
    Math.min(this.searchPage() * this.searchPageSize, this.searchResults().length),
  );

  searchControl = new FormControl('');

  submitted = signal(false);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);

  selectGame(result: BggSearchResult) {
    this.searchControl.setValue('');
    this.searchResults.set([]);
    this.searchPage.set(1);
    this.searchError.set(null);
    this.thingLoadError.set(null);
    this.isLoadingThing.set(true);

    this.bggService.getThing(result.bggId).subscribe({
      next: (details) => {
        this.isLoadingThing.set(false);
        this.selectedBggDetails.set(details);

        this.gameForm.patchValue({
          bggId: details.bggId,
          name: details.name,
          imageUrl: details.imageUrl,
          minPlayers: details.minPlayers,
          maxPlayers: details.maxPlayers,
          avgDurationMinutes: details.avgDurationMinutes,
          categories:
            details.categories.length > 0
              ? details.categories.join(', ')
              : details.mechanics.slice(0, 3).join(', ') || 'General',
          mode: details.mode,
          complexity: details.complexity,
        });
      },
      error: (err: unknown) => {
        this.isLoadingThing.set(false);
        this.selectedBggDetails.set(null);
        const message = err instanceof Error ? err.message : 'Failed to load game from BGG.';
        this.thingLoadError.set(message);
        this.gameForm.patchValue({
          bggId: result.bggId,
          name: result.name,
        });
      },
    });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query?.trim()) {
            this.searchResults.set([]);
            this.searchPage.set(1);
            this.selectedBggDetails.set(null);
            this.searchError.set(null);
            return of([]);
          }
          this.isSearching.set(true);
          this.searchPage.set(1);
          this.selectedBggDetails.set(null);
          this.searchError.set(null);
          return this.bggService.search(query).pipe(
            catchError((err: unknown) => {
              const message = err instanceof Error ? err.message : 'Search failed.';
              this.searchError.set(message);
              return of([] as BggSearchResult[]);
            }),
          );
        }),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.searchPage.set(1);
        this.isSearching.set(false);
      });
  }

  changeSearchPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), this.searchTotalPages());
    this.searchPage.set(nextPage);
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
      const bggDetails = this.selectedBggDetails();
      const categories = raw.categories
        ? raw.categories.split(',').map((c: string) => c.trim())
        : [];
      const payload: Omit<Game, 'id' | 'addedAt'> = {
        name: raw.name!,
        imageUrl: raw.imageUrl || undefined,
        yearPublished: bggDetails?.yearPublished ?? undefined,
        minPlayers: raw.minPlayers!,
        maxPlayers: raw.maxPlayers!,
        minDurationMinutes: bggDetails?.minDurationMinutes ?? undefined,
        maxDurationMinutes: bggDetails?.maxDurationMinutes ?? undefined,
        avgDurationMinutes: raw.avgDurationMinutes!,
        categories,
        mechanics: bggDetails?.mechanics.length ? bggDetails.mechanics : undefined,
        mode: raw.mode as Game['mode'],
        averageWeight: bggDetails?.averageWeight ?? undefined,
        complexity: raw.complexity as Game['complexity'],
        notes: raw.notes || undefined,
        bggId: raw.bggId || undefined,
      };
      this.gameService.addGame(payload);
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
