import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Library } from './features/library/library';
import { GamePicker } from './features/game-picker/game-picker';
import { GameDetail } from './features/game-detail/game-detail';
import { AddGame } from './features/add-game/add-game';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'library', component: Library },
  { path: 'game-picker', component: GamePicker },
  { path: 'game/:id', component: GameDetail },
  { path: 'add-game', component: AddGame },
];
