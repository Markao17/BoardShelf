import { Component, inject } from '@angular/core';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-library',
  imports: [],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {
  private gameService = inject(GameService);

  // Automatically react when the list changes
  games = this.gameService.games;
  total = this.gameService.totalGames;

  deleteGame(id: string) {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.deleteGame(id);
    }
  }
}
