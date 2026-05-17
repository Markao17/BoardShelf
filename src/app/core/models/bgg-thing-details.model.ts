/**
 * Flattened fields parsed from BGG XML API 2 `GET /xmlapi2/thing`.
 *
 * Under the hood BGG returns one `<items>` root with an `<item type="boardgame|…" id="…">`
 * per id. Important child nodes (all lowercase in XML):
 *
 * - `<name type="primary" value="…"/>` — display title
 * - `<yearpublished value="YYYY"/>`
 * - `<minplayers value="N"/>`, `<maxplayers value="N"/>`
 * - `<minplaytime value="minutes"/>`, `<maxplaytime value="…"/>`, `<playingtime value="…"/>`
 *   (`playingtime` is the “official” length when present)
 * - `<image>https://…</image>`, `<thumbnail>https://…</thumbnail>` (text content, URLs)
 * - `<link type="boardgamecategory" id="…" value="Strategy"/>` — category names in `value`
 * - `<link type="boardgamemechanic" id="…" value="…"/>` — mechanic names
 * - `<statistics><ratings>…` — with `stats=1`, includes `<averageweight value="1–5"/>`
 *   (community “weight”; we round into your 1–5 complexity)
 *
 * Wiki: https://boardgamegeek.com/wiki/page/BGG_XML_API2 (Thing items)
 */
export interface BggThingDetails {
  bggId: string;
  name: string;
  yearPublished: number | null;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  minDurationMinutes: number | null;
  maxDurationMinutes: number | null;
  avgDurationMinutes: number;
  categories: string[];
  mechanics: string[];
  averageWeight: number | null;
  complexity: 1 | 2 | 3 | 4 | 5;
  mode: 'pvp' | 'coop' | 'both';
}
