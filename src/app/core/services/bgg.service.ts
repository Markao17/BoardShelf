import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BggSearchResult } from '../models/bgg-search-result.model';

@Injectable({ providedIn: 'root' })
export class BggService {
  // Cache do CSV — only loads once during the session
  private games$: Observable<BggSearchResult[]> | null = null;

  search(query: string): Observable<BggSearchResult[]> {
    if (!query.trim()) return of([]);

    return this.loadGames().pipe(
      map((games) =>
        games.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10),
      ),
    );
  }

  private loadGames(): Observable<BggSearchResult[]> {
    if (this.games$) return this.games$;

    this.games$ = from(
      fetch('/assets/data/bgg-games.csv')
        .then((res) => res.text())
        .then((csv) => this.parseCsv(csv)),
    ).pipe(shareReplay(1));

    return this.games$;
  }

  private parseCsv(csv: string): BggSearchResult[] {
    const lines = csv.split('\n');
    const dataLines = lines.slice(1); //Remove the header line

    return dataLines
      .filter((line) => line.trim()) // Remove empty lines
      .map((line) => {
        const [id, name, yearPublished, rank] = line.split(',');
        return {
          bggId: id,
          name,
          yearPublished: yearPublished ? parseInt(yearPublished) : null,
          rank: rank ? parseInt(rank) : null,
        };
      })
      .filter((game) => game.name.trim()); // Remove games with no name
  }
}
