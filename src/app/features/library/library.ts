import { Component, inject } from '@angular/core';
import { GameService } from '../../core/services/game.service';
import { GameCard } from '../../shared/components/game-card/game-card';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-library',
  imports: [GameCard, Sidebar],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {
  private gameService = inject(GameService);

  // Automatically react when the list changes
  games = this.gameService.games;
  total = this.gameService.totalGames;

  deleteGame(id: string) {
    this.gameService.deleteGame(id);
  }
}
