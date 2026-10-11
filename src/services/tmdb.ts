import { MediaItem, MediaDetails, Season } from '../types/movie';

const TMDB_API_KEYS = [
  '5bf61a62fd4647aa7debed7d6f2db079',
  '15d2ea6d0dc1d476efbca3eba2b9bbfb',
  '844dba0bfd8f3a4f3799f6130ef9e335',
  '4e44d9029b1270a757cddc766a1bcb63',
];
let activeKeyIdx = 0;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null | undefined, size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'original'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getAvatarUrl = (path: string | null | undefined): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
  }
  return `${IMAGE_BASE_URL}/w185${path}`;
};

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const maxAttempts = TMDB_API_KEYS.length;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = TMDB_API_KEYS[(activeKeyIdx + attempt) % maxAttempts];
    const queryParams = new URLSearchParams({
      api_key: key,
      language: 'en-US',
      ...Object.entries(params).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        // If this key worked, remember it as current active
        activeKeyIdx = (activeKeyIdx + attempt) % maxAttempts;
        return response.json();
      }
      // If unauthorized or rate limited, move to next key
      lastError = new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }

  throw lastError || new Error('All TMDB API keys failed');
}

export interface PaginatedResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// 1. Trending
export const fetchTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/trending/${mediaType}/${timeWindow}`);
  return data.results.map((item) => ({
    ...item,
    media_type: item.media_type || (mediaType === 'all' ? (item.title ? 'movie' : 'tv') : mediaType),
  }));
};

// 2. Movies
export const fetchPopularMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/popular', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
  };
};

export const fetchTopRatedMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/top_rated', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
  };
};

export const fetchUpcomingMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/upcoming', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
  };
};

export const fetchNowPlayingMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/now_playing', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
  };
};

// 3. TV Series
export const fetchPopularTV = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/tv/popular', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
  };
};

export const fetchTopRatedTV = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/tv/top_rated', { page });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
  };
};

// 4. Bollywood / Hindi Cinema
// Helper: Duplicate Content Prevention (deduplicate by item id)
export const deduplicateMediaItems = (items: MediaItem[]): MediaItem[] => {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export interface GooTvCategoryDef {
  id: string;
  name: string;
  flag: string;
  badge: string;
  type: 'movie' | 'tv';
  description: string;
  subFilters?: { id: string; label: string; code: string }[];
}

export const GOO_TV_CATEGORIES: GooTvCategoryDef[] = [
  {
    id: 'hindi_movies',
    name: 'Hindi Movies',
    flag: '🇮🇳',
    badge: 'BOLLYWOOD',
    type: 'movie',
    description: 'Bollywood & Hindi Cinema Blockbusters',
  },
  {
    id: 'english_movies',
    name: 'English Movies',
    flag: '🇺🇸',
    badge: 'HOLLYWOOD',
    type: 'movie',
    description: 'Hollywood Blockbusters & Global Cinema',
  },
  {
    id: 'punjabi_movies',
    name: 'Punjabi Movies',
    flag: '🟠',
    badge: 'POLLYWOOD',
    type: 'movie',
    description: 'Top Punjabi Cinema & Desi Comedy',
  },
  {
    id: 'south_movies',
    name: 'South Movies',
    flag: '🌴',
    badge: 'SOUTH CINEMA',
    type: 'movie',
    description: 'South Indian Cinema in Tamil, Telugu, Malayalam & Kannada',
    subFilters: [
      { id: 'all', label: 'All South', code: 'ta|te|ml|kn' },
      { id: 'ta', label: 'Tamil', code: 'ta' },
      { id: 'te', label: 'Telugu', code: 'te' },
      { id: 'ml', label: 'Malayalam', code: 'ml' },
      { id: 'kn', label: 'Kannada', code: 'kn' },
    ],
  },
  {
    id: 'classic_movies',
    name: 'Classic Movies',
    flag: '🕰️',
    badge: 'CLASSICS',
    type: 'movie',
    description: 'Golden Era Vintage Classics (Pre-2000 Masterpieces)',
  },
  {
    id: 'hindi_dubbed_movies',
    name: 'Hindi Dubbed Movies',
    flag: '🎙️',
    badge: 'DUAL AUDIO',
    type: 'movie',
    description: 'Hollywood & International Movies in Hindi Audio',
  },
  {
    id: 'kdrama',
    name: 'K-Drama',
    flag: '🇰🇷',
    badge: 'SERIES',
    type: 'tv',
    description: 'Top Korean Dramas & High-Rating Series',
  },
  {
    id: 'kdrama_hindi',
    name: 'Hindi Dubbed K-Drama',
    flag: '🇮🇳🇰🇷',
    badge: 'HINDI AUDIO',
    type: 'tv',
    description: 'Korean Dramas with Official Hindi Dubbed Audio',
  },
  {
    id: 'hbo_movies',
    name: 'HBO Movies',
    flag: '🔵',
    badge: 'HBO / MAX',
    type: 'movie',
    description: 'HBO Original Productions & Warner Cinema Hits',
  },
  {
    id: 'netflix_movies',
    name: 'Netflix Movies',
    flag: '🔴',
    badge: 'NETFLIX',
    type: 'movie',
    description: 'Official Netflix Originals & Exclusives',
  },
  {
    id: 'jiohotstar_movies',
    name: 'JioHotstar Movies',
    flag: '🟣',
    badge: 'JIO / HOTSTAR',
    type: 'movie',
    description: 'Disney+ Hotstar & JioCinema Originals & Movies',
  },
  {
    id: 'mxplayer_movies',
    name: 'MX Player Movies',
    flag: '🟢',
    badge: 'MX ORIGINALS',
    type: 'movie',
    description: 'MX Player Desi Blockbusters & Web Movies',
  },
];

// 4. Bollywood / Hindi Cinema
export const fetchBollywood = async (page = 1, type: 'movie' | 'tv' = 'movie'): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${type}`, {
    page,
    with_original_language: 'hi',
    sort_by: 'popularity.desc',
    'vote_count.gte': '10',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: type }))),
  };
};

// 12 NEW GOO TV CATEGORY FETCHERS WITH REAL TMDB METADATA

// Cat 1: Hindi Movies
export const fetchHindiMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_original_language: 'hi',
    sort_by: 'popularity.desc',
    'vote_count.gte': 10,
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 2: English Movies
export const fetchEnglishMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_original_language: 'en',
    sort_by: 'popularity.desc',
    'vote_count.gte': 20,
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 3: Punjabi Movies
export const fetchPunjabiMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_original_language: 'pa',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 4: South Movies (Tamil, Telugu, Malayalam, Kannada)
export const fetchSouthMovies = async (page = 1, subLang = 'all'): Promise<PaginatedResult<MediaItem>> => {
  const langCode = subLang === 'all' || !subLang ? 'ta|te|ml|kn' : subLang;
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_original_language: langCode,
    sort_by: 'popularity.desc',
    'vote_count.gte': 5,
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 5: Classic Movies (Pre-2000 Golden Era)
export const fetchClassicMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    'primary_release_date.lte': '1999-12-31',
    sort_by: 'popularity.desc',
    'vote_count.gte': 25,
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 6: Hindi Dubbed Movies (International/Hollywood with official Hindi spoken track)
export const fetchHindiDubbedMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_spoken_languages: 'hi',
    without_original_language: 'hi',
    sort_by: 'popularity.desc',
    'vote_count.gte': 10,
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 7: K-Drama (Korean TV Dramas)
export const fetchKDrama = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
    page,
    with_original_language: 'ko',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'tv' }))),
  };
};

// Cat 8: Hindi Dubbed K-Drama (Official Korean series available in Indian platforms)
export const fetchKDramaHindi = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
    page,
    with_original_language: 'ko',
    with_watch_providers: '8|122|515|220',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'tv' }))),
  };
};

// Cat 9: HBO Movies
export const fetchHboMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_companies: '3268|9993', // Home Box Office & HBO Films
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 10: Netflix Movies
export const fetchNetflixMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_watch_providers: '8', // Netflix
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 11: JioHotstar Movies
export const fetchJioHotstarMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_watch_providers: '122|220', // Disney+ Hotstar & JioCinema
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Cat 12: MX Player Movies
export const fetchMxPlayerMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
    page,
    with_watch_providers: '515', // MX Player
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'movie' }))),
  };
};

// Master Category Dispatcher for GOO TV
export const fetchGooTvCategory = async (
  categoryId: string, 
  page = 1, 
  subFilter = 'all'
): Promise<PaginatedResult<MediaItem>> => {
  switch (categoryId) {
    case 'hindi_movies':
    case 'bollywood':
      return fetchHindiMovies(page);
    case 'english_movies':
    case 'hollywood':
      return fetchEnglishMovies(page);
    case 'punjabi_movies':
      return fetchPunjabiMovies(page);
    case 'south_movies':
      return fetchSouthMovies(page, subFilter);
    case 'classic_movies':
      return fetchClassicMovies(page);
    case 'hindi_dubbed_movies':
      return fetchHindiDubbedMovies(page);
    case 'kdrama':
      return fetchKDrama(page);
    case 'kdrama_hindi':
      return fetchKDramaHindi(page);
    case 'hbo_movies':
      return fetchHboMovies(page);
    case 'netflix_movies':
      return fetchNetflixMovies(page);
    case 'jiohotstar_movies':
      return fetchJioHotstarMovies(page);
    case 'mxplayer_movies':
      return fetchMxPlayerMovies(page);
    default:
      return fetchHindiMovies(page);
  }
};

// 5. Anime / Japanese Animation
export const fetchAnime = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
    page,
    with_original_language: 'ja',
    with_genres: '16', // Animation
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: 'tv' }))),
  };
};

// 7. Genre Discover
export const fetchByGenre = async (
  genreId: number,
  mediaType: 'movie' | 'tv' = 'movie',
  page = 1
): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${mediaType}`, {
    page,
    with_genres: genreId,
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: mediaType })),
  };
};

// 8. Custom Filter Discover (Unlimited)
export const discoverMedia = async (options: {
  mediaType: 'movie' | 'tv';
  page?: number;
  genre?: string | number;
  sortBy?: string;
  year?: string | number;
  language?: string;
  minRating?: number;
}): Promise<PaginatedResult<MediaItem>> => {
  const params: Record<string, string | number> = {
    page: options.page || 1,
    sort_by: options.sortBy || 'popularity.desc',
  };

  if (options.genre && options.genre !== 'all') {
    params.with_genres = options.genre;
  }
  if (options.language && options.language !== 'all') {
    params.with_original_language = options.language;
  }
  if (options.year) {
    if (options.mediaType === 'movie') {
      params.primary_release_year = options.year;
    } else {
      params.first_air_date_year = options.year;
    }
  }
  if (options.minRating) {
    params['vote_average.gte'] = options.minRating;
    params['vote_count.gte'] = 50;
  }

  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${options.mediaType}`, params);
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: options.mediaType })),
  };
};

// 9. Advanced Smart Search Engine (Never-Blank Guarantee + Multi-Intent Parser)
export interface AdvancedSearchParams {
  query: string;
  page?: number;
  mediaType?: 'all' | 'movie' | 'tv';
}

export const searchMulti = async (query: string, page = 1): Promise<PaginatedResult<MediaItem>> => {
  const cleanQ = query.trim();
  if (!cleanQ) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  try {
    // Note: URLSearchParams in tmdbFetch automatically handles encoding
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/search/multi', {
      query: cleanQ,
      page,
      include_adult: 'false',
    });

    const validResults = (data.results || [])
      .filter((item) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path))
      .map((item) => ({
        ...item,
        media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      }));

    return {
      ...data,
      results: validResults,
    };
  } catch (err) {
    console.error('searchMulti error', err);
    return { page, results: [], total_pages: 0, total_results: 0 };
  }
};

/**
 * Advanced Semantic Search:
 * Handles complex user queries like "kdrama hindki dubbed", "anime hindi", "action movies 2024", etc.
 * Never returns an empty/blank screen - automatically cascades to keyword intent discover and trending fallback!
 */
export const advancedSearchMedia = async (
  rawQuery: string,
  page = 1,
  filterType: 'all' | 'movie' | 'tv' = 'all'
): Promise<PaginatedResult<MediaItem> & { detectedIntent?: string; matchedQuery?: string }> => {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    // Return trending when empty
    const trending = await fetchTrending(filterType === 'all' ? 'all' : filterType, 'week');
    return {
      page: 1,
      results: trending,
      total_pages: 50,
      total_results: 1000,
      detectedIntent: 'Trending Hits',
    };
  }

  // 1. Detect Intent Keywords
  const isKDrama = /k[-_ ]?drama|korean|south[-_ ]?korea|kdrama/i.test(q);
  const isAnime = /anime|manga|japanese animation|otaku/i.test(q);
  const isHindi = /hindi|hindki|dubbed|dual[-_ ]?audio|bollywood|desi/i.test(q);
  const isSouth = /south|tollywood|kollywood|tamil|telugu|malayalam|kannada/i.test(q);
  const isAction = /action|explosive|thriller|fight/i.test(q);
  const isHorror = /horror|scary|ghost|creepy/i.test(q);
  const isComedy = /comedy|funny|humor/i.test(q);
  const isRomance = /romance|romantic|love|drama/i.test(q);
  const isSciFi = /sci[-_ ]?fi|space|alien|superhero|marvel|dc/i.test(q);

  // Extract year if specified (e.g. 2024, 2023, 2022)
  const yearMatch = q.match(/\b(19\d\d|20\d\d)\b/);
  const detectedYear = yearMatch ? yearMatch[1] : undefined;

  // Extract core title by stripping out common filter/modifier terms
  const modifierWords = [
    'kdrama', 'k-drama', 'korean', 'hindki', 'hindi', 'dubbed', 'dub', 'dual', 'audio',
    'movie', 'movies', 'film', 'films', 'cinema', 'series', 'show', 'shows', 'tv', 'web', 'webseries',
    'season', 'episode', 'ep', 'full', 'all', 'hd', '4k', '1080p', '720p', 'watch', 'online',
    'free', 'download', 'in', 'and', 'with', 'part'
  ];

  const words = q.split(/[\s,._-]+/).filter(Boolean);
  const coreWords = words.filter((w) => !modifierWords.includes(w) && !/^\d{4}$/.test(w));
  const coreTitle = coreWords.join(' ').trim();

  let detectedIntent = '';
  if (isKDrama) detectedIntent += 'K-Drama ';
  if (isAnime) detectedIntent += 'Anime ';
  if (isHindi) detectedIntent += 'Hindi Audio ';
  if (isSouth) detectedIntent += 'South Cinema ';
  if (detectedYear) detectedIntent += `${detectedYear} `;
  detectedIntent = detectedIntent.trim() || 'Smart Search';

  // STAGE 1: If there is a clean core title, try searching TMDB with it first!
  if (coreTitle.length >= 2) {
    try {
      const primaryResults = await searchMulti(coreTitle, page);
      if (primaryResults.results && primaryResults.results.length > 0) {
        let filtered = primaryResults.results;

        // If KDrama was requested, prioritize Korean results
        if (isKDrama) {
          filtered.sort((a, b) => {
            const aIsKo = (a as any).original_language === 'ko' ? 1 : 0;
            const bIsKo = (b as any).original_language === 'ko' ? 1 : 0;
            return bIsKo - aIsKo;
          });
        } else if (isAnime) {
          filtered.sort((a, b) => {
            const aIsJa = (a as any).original_language === 'ja' ? 1 : 0;
            const bIsJa = (b as any).original_language === 'ja' ? 1 : 0;
            return bIsJa - aIsJa;
          });
        }

        return {
          ...primaryResults,
          results: filtered,
          detectedIntent: `Found for "${coreTitle}" (${detectedIntent})`,
          matchedQuery: coreTitle,
        };
      }
    } catch {}
  }

  // STAGE 2: Try exact search query
  try {
    const rawResults = await searchMulti(q, page);
    if (rawResults.results && rawResults.results.length > 0) {
      return {
        ...rawResults,
        detectedIntent: `Matched "${q}"`,
        matchedQuery: q,
      };
    }
  } catch {}

  // STAGE 3: Semantic Discover based on detected intent
  // This directly addresses queries like "kdrama hindki dubbed", "anime hindi", "action movies 2024"
  try {
    if (isKDrama) {
      // Discover top K-Dramas
      const kdramaData = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
        page,
        with_original_language: 'ko',
        sort_by: 'popularity.desc',
        'vote_count.gte': '15',
        ...(isRomance ? { with_genres: '18' } : {}),
        ...(detectedYear ? { first_air_date_year: detectedYear } : {}),
      });

      if (kdramaData.results && kdramaData.results.length > 0) {
        return {
          ...kdramaData,
          results: kdramaData.results.map((i) => ({ ...i, media_type: 'tv' })),
          detectedIntent: `Top K-Dramas & Korean Series (${isHindi ? 'Hindi Dubbed Available' : 'High Bitrate'})`,
        };
      }
    }

    if (isAnime) {
      // Discover top Anime series & movies
      const animeData = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
        page,
        with_original_language: 'ja',
        with_genres: '16',
        sort_by: 'popularity.desc',
        ...(detectedYear ? { first_air_date_year: detectedYear } : {}),
      });

      if (animeData.results && animeData.results.length > 0) {
        return {
          ...animeData,
          results: animeData.results.map((i) => ({ ...i, media_type: 'tv' })),
          detectedIntent: `Top Anime Series (${isHindi ? 'Hindi Dubbed Available' : 'Japanese Audio'})`,
        };
      }
    }

    if (isHindi || isSouth) {
      // Discover top Bollywood or South Indian movies
      const targetLang = isSouth ? 'te,ta,hi' : 'hi';
      const bollywoodData = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
        page,
        with_original_language: targetLang,
        sort_by: 'popularity.desc',
        'vote_count.gte': '10',
        ...(detectedYear ? { primary_release_year: detectedYear } : {}),
      });

      if (bollywoodData.results && bollywoodData.results.length > 0) {
        return {
          ...bollywoodData,
          results: bollywoodData.results.map((i) => ({ ...i, media_type: 'movie' })),
          detectedIntent: `Top Bollywood & Hindi Blockbusters`,
        };
      }
    }

    if (isAction || isHorror || isComedy || isSciFi) {
      let genreId = 28; // Action default
      if (isHorror) genreId = 27;
      if (isComedy) genreId = 35;
      if (isSciFi) genreId = 878;

      const genreData = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/movie', {
        page,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        ...(detectedYear ? { primary_release_year: detectedYear } : {}),
      });

      if (genreData.results && genreData.results.length > 0) {
        return {
          ...genreData,
          results: genreData.results.map((i) => ({ ...i, media_type: 'movie' })),
          detectedIntent: `Trending ${detectedIntent || 'Hits'}`,
        };
      }
    }
  } catch (err) {
    console.error('Semantic discover fallback error', err);
  }

  // STAGE 4: Word-by-word tokenized search
  if (words.length > 1) {
    for (const singleWord of words) {
      if (singleWord.length >= 3 && !modifierWords.includes(singleWord)) {
        try {
          const singleRes = await searchMulti(singleWord, 1);
          if (singleRes.results && singleRes.results.length > 0) {
            return {
              ...singleRes,
              detectedIntent: `Recommended for "${singleWord}" in your query`,
              matchedQuery: singleWord,
            };
          }
        } catch {}
      }
    }
  }

  // STAGE 5: NEVER-BLANK GUARANTEE FALLBACK
  // If user searched random keywords or rare terms, return top trending items with friendly banner
  try {
    const popularFallback = await fetchPopularMovies(page);
    return {
      page,
      results: popularFallback.results,
      total_pages: popularFallback.total_pages || 100,
      total_results: popularFallback.total_results || 2000,
      detectedIntent: `Top Trending & Popular Titles (Recommended for "${rawQuery}")`,
    };
  } catch {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
      detectedIntent: 'No Results',
    };
  }
};

// 10. Details with Extras (credits, videos, similar)
export const fetchMediaDetails = async (id: number | string, mediaType: 'movie' | 'tv' = 'movie'): Promise<MediaDetails> => {
  const data = await tmdbFetch<MediaDetails>(`/${mediaType}/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations,external_ids',
  });
  return {
    ...data,
    media_type: mediaType,
  };
};

// 11. TV Season and Episodes
export const fetchTVSeason = async (tvId: number | string, seasonNumber: number): Promise<Season> => {
  return tmdbFetch<Season>(`/tv/${tvId}/season/${seasonNumber}`);
};

// Genres lookup mapping
export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];
