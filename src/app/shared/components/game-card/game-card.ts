import { Component, input, output } from '@angular/core';
import { Game } from '../../../core/models/game.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
})
export class GameCard {
  game = input.required<Game>();

  deleteRequest = output<string>(); // emite o id

  deleteGame(id: string) {
    if (confirm('Are you sure?')) {
      this.deleteRequest.emit(id);
    }
  }
}
