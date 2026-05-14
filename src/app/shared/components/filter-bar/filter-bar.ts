import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { RouterLink } from '@angular/router';

type ComplexityLevel = 1 | 2 | 3 | 4 | 5;
type ComplexityValue = '1' | '2' | '3' | '4' | '5';

@Component({
  selector: 'app-filter-bar',
  imports: [RouterLink],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  private gameService = inject(GameService);
  private elementRef = inject(ElementRef<HTMLElement>);

  currentPlayers = this.gameService.players;
  currentMode = this.gameService.mode;
  currentMaxDuration = this.gameService.maxDuration;
  currentComplexity = this.gameService.complexity;
  availableCategories = this.gameService.availableCategories;
  selectedCategories = this.gameService.categories;
  filteredGames = this.gameService.filteredGames;
  filteredTotal = computed(() => this.gameService.filteredGames().length);
  hasActiveFilters = this.gameService.hasActiveFilters;

  readonly complexityLevels: ComplexityLevel[] = [1, 2, 3, 4, 5];

  readonly canPickRandom = computed(() => this.filteredGames().length > 0);

  randomGameLink = computed<string | null>(() => {
    const games = this.filteredGames();
    if (games.length === 0) return null;
    return `/game/${games[Math.floor(Math.random() * games.length)].id}`;
  });

  isCategoriesOpen = signal(false);

  readonly categoriesLabel = computed(() => {
    const selected = this.selectedCategories();
    if (selected.length === 0) return 'All categories';
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  });

  updatePlayers(value: number | null): void {
    this.gameService.players.set(value);
  }

  updateMode(value: 'pvp' | 'coop' | 'both' | null): void {
    this.gameService.mode.set(value);
  }

  updateMaxDuration(value: number | null): void {
    this.gameService.maxDuration.set(value);
  }

  setComplexity(level: ComplexityLevel): void {
    const next = String(level) as ComplexityValue;
    const current = this.gameService.complexity();
    this.gameService.complexity.set(current === next ? null : next);
  }

  resetFilters(): void {
    this.gameService.players.set(null);
    this.gameService.mode.set(null);
    this.gameService.maxDuration.set(null);
    this.gameService.complexity.set(null);
    this.gameService.categories.set([]);
  }

  isComplexityActive(level: ComplexityLevel): boolean {
    const value = this.currentComplexity();
    return value !== null && +value >= level;
  }

  toggleCategoriesDropdown(): void {
    this.isCategoriesOpen.update((open) => !open);
  }

  toggleCategory(category: string, checked: boolean): void {
    const current = this.selectedCategories();
    if (checked) {
      if (!current.includes(category)) {
        this.gameService.categories.set([...current, category]);
      }
      return;
    }
    this.gameService.categories.set(current.filter((c) => c !== category));
  }

  clearCategories(): void {
    this.gameService.categories.set([]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isCategoriesOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.isCategoriesOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isCategoriesOpen()) this.isCategoriesOpen.set(false);
  }
}
