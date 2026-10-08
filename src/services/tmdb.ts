import { MediaItem, MediaDetails, Season } from '../types/movie';

const TMDB_API_KEY = '5bf61a62fd4647aa7debed7d6f2db079';
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
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
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
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
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
export const fetchBollywood = async (page = 1, type: 'movie' | 'tv' = 'movie'): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${type}`, {
    page,
    with_original_language: 'hi',
    sort_by: 'popularity.desc',
    'vote_count.gte': '10',
  });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: type })),
  };
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
    results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
  };
};

// 6. Korean Dramas & Cinema
export const fetchKDrama = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/discover/tv', {
    page,
    with_original_language: 'ko',
    sort_by: 'popularity.desc',
  });
  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
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

// 9. Search
export const searchMulti = async (query: string, page = 1): Promise<PaginatedResult<MediaItem>> => {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  const data = await tmdbFetch<PaginatedResult<MediaItem>>('/search/multi', {
    query: encodeURIComponent(query),
    page,
    include_adult: 'false',
  });
  return {
    ...data,
    results: data.results
      .filter((item) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path))
      .map((item) => ({
        ...item,
        media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      })),
  };
};


// Smart natural-language search.
// Uses TMDB's real metadata and keeps normal title search as fallback.
export const searchSmartMedia = async (
  rawQuery: string,
  page = 1
): Promise<PaginatedResult<MediaItem>> => {
  const original = rawQuery.trim();

  if (!original) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const normalized = original
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const koreanIntent =
    /\bk[\s-]?drama\b/.test(normalized) ||
    /\bkorean\b/.test(normalized) ||
    /\bkorea\b/.test(normalized);

  const hindiIntent =
    /\bhindi\b/.test(normalized) ||
    /\bhindi[\s-]+dubbed\b/.test(normalized) ||
    /\bhindi[\s-]+dub\b/.test(normalized) ||
    /\bhindi[\s-]+audio\b/.test(normalized);

  const animeIntent = /\banime\b/.test(normalized);

  const cleanedQuery = normalized
    .replace(/\bk[\s-]?drama\b/g, ' ')
    .replace(/\bkorean\b/g, ' ')
    .replace(/\bkorea\b/g, ' ')
    .replace(/\bhindi[\s-]+dubbed\b/g, ' ')
    .replace(/\bhindi[\s-]+dub\b/g, ' ')
    .replace(/\bhindi[\s-]+audio\b/g, ' ')
    .replace(/\bhindi\b/g, ' ')
    .replace(/\banime\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Example:
  // "KDrama" / "Korean drama" / "Korean series"
  if (koreanIntent && !cleanedQuery) {
    return fetchKDrama(page);
  }

  // Example:
  // "KDrama Squid Game"
  // "Korean drama Squid Game"
  if (koreanIntent && cleanedQuery) {
    const result = await searchMulti(cleanedQuery, page);

    const korean = result.results.filter(
      (item) =>
        item.media_type === 'tv' &&
        item.original_language === 'ko'
    );

    const rest = result.results.filter(
      (item) =>
        !(
          item.media_type === 'tv' &&
          item.original_language === 'ko'
        )
    );

    return {
      ...result,
      results: [...korean, ...rest],
    };
  }

  // Example:
  // "anime Naruto"
  if (animeIntent && cleanedQuery) {
    const result = await searchMulti(cleanedQuery, page);

    const anime = result.results.filter(
      (item) =>
        item.original_language === 'ja' ||
        item.original_language === 'zh'
    );

    const rest = result.results.filter(
      (item) =>
        item.original_language !== 'ja' &&
        item.original_language !== 'zh'
    );

    return {
      ...result,
      results: [...anime, ...rest],
    };
  }

  // Hindi intent:
  // prioritize Hindi-origin content.
  // This does NOT falsely claim that TMDB verifies Hindi dubbing/audio.
  if (hindiIntent) {
    const query = cleanedQuery || original;
    const result = await searchMulti(query, page);

    const hindi = result.results.filter(
      (item) => item.original_language === 'hi'
    );

    const rest = result.results.filter(
      (item) => item.original_language !== 'hi'
    );

    return {
      ...result,
      results: [...hindi, ...rest],
    };
  }

  // Normal exact/general search.
  return searchMulti(original, page);
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
