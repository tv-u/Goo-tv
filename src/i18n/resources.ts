const english = {
  translation: {
    app: {
      name: 'GOO TV',
      tagline: 'Watch Movies & TV Shows Online',
    },
    nav: {
      home: 'Home',
      movies: 'Movies',
      tv: 'TV Shows',
      explore: 'Explore',
      search: 'Search',
      watchlist: 'Watchlist',
      settings: 'Settings',
    },
    common: {
      search: 'Search',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      language: 'Language',
      theme: 'Theme',
      quality: 'Quality',
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      all: 'All',
      movie: 'Movie',
      tv: 'TV Show',
      year: 'Year',
      rating: 'Rating',
      genre: 'Genre',
    },
    seo: {
      title: 'GOO TV — Watch Movies & TV Shows Online',
      description:
        'Discover movies and TV shows with search, genres, ratings, multiple qualities and a smooth cinema experience.',
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      playback: 'Playback',
      language: 'Language',
      theme: 'Theme',
      cinema: 'Cinema Dark',
      oled: 'OLED Midnight',
      autosync: 'Auto Sync Servers',
    },
  },
};

export const resources = {
  en: english,
};

export function getResources() {
  return resources;
}
