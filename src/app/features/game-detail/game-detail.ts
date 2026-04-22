import { Component, input, computed, inject } from '@angular/core';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-detail',
  imports: [],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss',
})
export class GameDetail {
  private gameService = inject(GameService);
  id = input.required<string>();

  game = computed(() => this.gameService.getGameById(this.id()));
}
