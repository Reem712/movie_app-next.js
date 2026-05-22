export const API = {
  DUMMYJSON_BASE:    'https://dummyjson.com',
  OPEN_LIBRARY_BASE: 'https://openlibrary.org',
  COVER_BASE:        'https://covers.openlibrary.org/b/id',
  SEARCH:            '/search.json',
  WORKS:             '/works',
  AUTH_LOGIN:        '/auth/login',
  DEFAULT_LIMIT:     12,
  SEARCH_LIMIT:      20,
  COVER_SIZES: {
    small:  'S',
    medium: 'M',
    large:  'L',
  },
} as const;

export const HOME_QUERIES = {
  trending:    'subject=fiction&sort=rating',
  newReleases: 'subject=literature&sort=new',
  popular:     'subject=classics&sort=readinglog',
} as const;
