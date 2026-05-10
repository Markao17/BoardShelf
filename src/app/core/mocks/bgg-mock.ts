/**
 * Dummy shapes for BoardGameGeek XML API 2 — search endpoint.
 * Real response is XML (`/xmlapi2/search?query=…&type=boardgame`);
 * your `BggService` will parse it into something like this.
 *
 * Not related to the app `Game` model — map these fields when importing a title.
 */

/** One `<item>` from search results after normalization (not raw XML). */
/** Placeholder payload for UI/tests until `BggService.search()` calls the API. */
export const BGG_MOCK_RESULTS = [
  {
    id: '54001',
    type: 'boardgame',
    name: 'Harbor Eight Shipping Co.',
    yearPublished: '2018',
  },
  {
    id: '54002',
    type: 'boardgame',
    name: 'Moonbase Lunch Break',
    yearPublished: '2021',
  },
  {
    id: '54003',
    type: 'boardgame',
    name: 'Quiet Corners: Village Almanac',
    yearPublished: '2016',
  },
  {
    id: '54004',
    type: 'boardgame',
    name: 'Ribbon Relay (Card Edition)',
    yearPublished: '2024',
  },
  {
    id: '54005',
    type: 'boardgame',
    name: 'Forgotten Shelf Inventory',
    yearPublished: '1999',
  },
  {
    id: '54006',
    type: 'boardgame',
    name: 'Catan',
    yearPublished: '1995',
    imageUrl: 'https://devir.pt/catan',
  },
  {
    id: '54007',
    type: 'boardgame',
    name: 'Carcassonne',
    yearPublished: '2000',
    imageUrl: 'https://devir.pt/carcassonne',
  },
];
