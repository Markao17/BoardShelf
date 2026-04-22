import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  title = input.required<string>();

  protected readonly navigation = [
    {
      label: 'Library',
      icon: '/images/icons/library',
      link: '/library',
    },
    {
      label: 'Add Game',
      icon: '/images/icons/add-game',
      link: '/add-game',
    },
    {
      label: 'Game Picker',
      icon: '/images/icons/game-picker',
      link: '/game-picker',
    },
    {
      label: 'Settings',
      icon: '/images/icons/settings',
      link: '/account',
    },
  ];
}
