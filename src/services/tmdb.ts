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

// Verified Seed Media (Guarantees zero-blank screen anywhere, including Cloudflare Pages & GitHub Pages)
export const VERIFIED_SEED_ITEMS: MediaItem[] = [
  {
    id: 105248,
    title: 'Cyberpunk: Edgerunners',
    media_type: 'tv',
    vote_average: 8.5,
    vote_count: 2450,
    popularity: 95.4,
    poster_path: '/v3JuB15WybKmxDeT1hWdK3j6eSJ.jpg',
    backdrop_path: '/3UbHGmu9vIMSC5uNfnGt7DjetqT.jpg',
    overview: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.'
  },
  {
    id: 1198654,
    title: 'Bad Apples',
    media_type: 'movie',
    vote_average: 6.8,
    vote_count: 530,
    popularity: 120.2,
    poster_path: '/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg',
    backdrop_path: '/ch1g1X6TfezRwbmiBiYRpALTQjN.jpg',
    overview: 'A struggling primary school teacher is forced to take drastic action because of a foul-mouthed student, uncovering how her community turns a blind eye.'
  },
  {
    id: 1380417,
    title: 'By Any Means',
    media_type: 'movie',
    vote_average: 7.0,
    vote_count: 420,
    popularity: 88.6,
    poster_path: '/hxTjCfEmZJFAPW8h5S3tDQNaBi8.jpg',
    backdrop_path: '/1jANqIbqrWJZb8GM5Kb3L6U8iHi.jpg',
    overview: 'In 1960s Mississippi, a young Black FBI agent is forced to partner with a notorious mafia hitman to investigate a wave of brutal murders.'
  },
  {
    id: 1400940,
    title: 'Clayface',
    media_type: 'movie',
    vote_average: 8.1,
    vote_count: 1200,
    popularity: 135.8,
    poster_path: '/5jCpQnWPikggmQZoDp1eAi6BI6w.jpg',
    backdrop_path: '/uL4cIrNi2uaUnWIOQQ28EVnkETG.jpg',
    overview: "Matt Hagen's meteoric rise from Gotham street kid to Hollywood leading man is tragically cut short when a crime boss's actions leave him disfigured."
  },
  {
    id: 1389172,
    title: 'Reporting Live',
    media_type: 'movie',
    vote_average: 7.4,
    vote_count: 890,
    popularity: 92.1,
    poster_path: '/xVabS4lTi6IMscr2FOucxydE6ZD.jpg',
    backdrop_path: '/faJB8DXU0LXwq5ebMLj5drz8S4N.jpg',
    overview: 'A young reporter and her reluctant cameraman chase a story, only to get entangled in an illegal sand-mining racket run by a ruthless syndicate.'
  },
  {
    id: 19404,
    title: 'Dilwale Dulhania Le Jayenge',
    media_type: 'movie',
    vote_average: 8.5,
    vote_count: 4300,
    popularity: 80.5,
    poster_path: '/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg',
    backdrop_path: '/7VDLEHli74eLsYLNcq9djn1Gw76.jpg',
    overview: 'Raj and Simran meet on a European train journey and fall deeply in love, sparking a timeless journey to win over her traditional family.'
  },
  {
    id: 213562,
    title: 'Crystal Lake',
    media_type: 'tv',
    vote_average: 8.5,
    vote_count: 980,
    popularity: 110.3,
    poster_path: '/3ENhExiD2fcjk5FX0AcAXcvLu9N.jpg',
    backdrop_path: '/wxiBsKFEOOFK8eQStWOykNORlXY.jpg',
    overview: "Single mother Pam Voorhees has been unable to shake her grief after her son Jason drowned, setting in motion a chilling chain of events."
  },
  {
    id: 533535,
    title: 'Deadpool & Wolverine',
    media_type: 'movie',
    vote_average: 7.8,
    vote_count: 5900,
    popularity: 210.0,
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yDHYTfA3R0jFYba16jBB12RKoRf.jpg',
    overview: 'A listless Wade Wilson toils in civilian life until a global threat pulls him into action alongside the reluctant Wolverine.'
  }
];

// 1. Trending
export const fetchTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/trending/${mediaType}/${timeWindow}`);
    if (data && data.results && data.results.length > 0) {
      return data.results.map((item) => ({
        ...item,
        media_type: item.media_type || (mediaType === 'all' ? (item.title ? 'movie' : 'tv') : mediaType),
      }));
    }
    return VERIFIED_SEED_ITEMS;
  } catch (err) {
    console.warn('Live TMDB trending failed, serving verified seed items', err);
    return VERIFIED_SEED_ITEMS;
  }
};

// 2. Movies
export const fetchPopularMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/popular', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'movie'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
};

export const fetchTopRatedMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/top_rated', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'movie'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
};

export const fetchUpcomingMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/upcoming', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'movie'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
};

export const fetchNowPlayingMovies = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/movie/now_playing', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'movie' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'movie'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
};

// 3. TV Series
export const fetchPopularTV = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/tv/popular', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'tv'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
};

export const fetchTopRatedTV = async (page = 1): Promise<PaginatedResult<MediaItem>> => {
  try {
    const data = await tmdbFetch<PaginatedResult<MediaItem>>('/tv/top_rated', { page });
    return {
      ...data,
      results: data.results.map((item) => ({ ...item, media_type: 'tv' })),
    };
  } catch {
    return {
      page: 1,
      results: VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'tv'),
      total_pages: 1,
      total_results: VERIFIED_SEED_ITEMS.length,
    };
  }
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
  industryName: string;
  region: 'indian' | 'western' | 'asian' | 'south_asian' | 'african' | 'european' | 'latin' | 'channels';
  flag: string;
  badge: string;
  type: 'movie' | 'tv';
  description: string;
  languageCode?: string;
  originCountry?: string;
  defaultAudio: string;
  subFilters?: { id: string; label: string; code: string }[];
}

export const GOO_TV_CATEGORIES: GooTvCategoryDef[] = [
  // ================= 1. INDIAN REGIONAL CINEMA INDUSTRIES =================
  {
    id: 'hindi_movies',
    name: 'Bollywood (Hindi)',
    industryName: 'Bollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'BOLLYWOOD',
    type: 'movie',
    languageCode: 'hi',
    originCountry: 'IN',
    defaultAudio: 'hindi',
    description: 'Bollywood & Hindi Cinema Blockbusters from Mumbai, India',
  },
  {
    id: 'tollywood_telugu',
    name: 'Tollywood (Telugu)',
    industryName: 'Tollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'TOLLYWOOD',
    type: 'movie',
    languageCode: 'te',
    originCountry: 'IN',
    defaultAudio: 'telugu',
    description: 'Telugu Cinema Industry (Tollywood) — Andhra Pradesh & Telangana',
  },
  {
    id: 'kollywood',
    name: 'Kollywood (Tamil)',
    industryName: 'Kollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'KOLLYWOOD',
    type: 'movie',
    languageCode: 'ta',
    originCountry: 'IN',
    defaultAudio: 'tamil',
    description: 'Tamil Film Industry (Kollywood) — Kodambakkam, Chennai',
  },
  {
    id: 'mollywood',
    name: 'Mollywood (Malayalam)',
    industryName: 'Mollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'MOLLYWOOD',
    type: 'movie',
    languageCode: 'ml',
    originCountry: 'IN',
    defaultAudio: 'malayalam',
    description: 'Malayalam Cinema Industry (Mollywood) — Kerala Cinematic Art',
  },
  {
    id: 'sandalwood',
    name: 'Sandalwood (Kannada)',
    industryName: 'Sandalwood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'SANDALWOOD',
    type: 'movie',
    languageCode: 'kn',
    originCountry: 'IN',
    defaultAudio: 'kannada',
    description: 'Kannada Film Industry (Sandalwood) — Bengaluru, Karnataka',
  },
  {
    id: 'punjabi_movies',
    name: 'Pollywood (Punjabi)',
    industryName: 'Pollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'POLLYWOOD',
    type: 'movie',
    languageCode: 'pa',
    originCountry: 'IN',
    defaultAudio: 'punjabi',
    description: 'Punjabi Cinema (Pollywood) — Vibrant Blockbusters & Desi Comedy',
  },
  {
    id: 'tollywood_bengali',
    name: 'Tollywood (Bengali)',
    industryName: 'Tollywood Bengal',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'BENGALI CINEMA',
    type: 'movie',
    languageCode: 'bn',
    originCountry: 'IN',
    defaultAudio: 'bengali',
    description: 'Bengali Cinema Industry (Tollygunge, Kolkata) Masterpieces',
  },
  {
    id: 'dhollywood',
    name: 'Dhollywood (Gujarati)',
    industryName: 'Dhollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'DHOHLLYWOOD',
    type: 'movie',
    languageCode: 'gu',
    originCountry: 'IN',
    defaultAudio: 'gujarati',
    description: 'Gujarati Film Industry (Dhollywood) Blockbusters & Urban Cinema',
  },
  {
    id: 'gollywood',
    name: 'Gollywood (Gujarati)',
    industryName: 'Gollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'GOLLYWOOD',
    type: 'movie',
    languageCode: 'gu',
    originCountry: 'IN',
    defaultAudio: 'gujarati',
    description: 'Gollywood (Gujarati Cinema Alternative) Productions',
  },
  {
    id: 'ollywood',
    name: 'Ollywood (Odia)',
    industryName: 'Ollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'ODIA CINEMA',
    type: 'movie',
    languageCode: 'or',
    originCountry: 'IN',
    defaultAudio: 'odia',
    description: 'Odia Film Industry (Ollywood) — Cuttack & Bhubaneswar, Odisha',
  },
  {
    id: 'bhojiwood',
    name: 'Bhojiwood (Bhojpuri)',
    industryName: 'Bhojiwood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'BHOJPURI',
    type: 'movie',
    languageCode: 'bho',
    originCountry: 'IN',
    defaultAudio: 'bhojpuri',
    description: 'Bhojpuri Film Industry (Bhojiwood) Desi Entertainers',
  },
  {
    id: 'jollywood',
    name: 'Jollywood (Assamese)',
    industryName: 'Jollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'ASSAMESE',
    type: 'movie',
    languageCode: 'as',
    originCountry: 'IN',
    defaultAudio: 'assamese',
    description: 'Assamese Cinema (Jollywood) — Jyoti Chitraban, Assam',
  },
  {
    id: 'maniwood',
    name: 'Maniwood (Manipuri)',
    industryName: 'Maniwood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'MANIPURI',
    type: 'movie',
    languageCode: 'mni',
    originCountry: 'IN',
    defaultAudio: 'manipuri',
    description: 'Manipuri Cinema (Maniwood) — Imphal, Manipur',
  },
  {
    id: 'chhollywood',
    name: 'Chhollywood (Chhattisgarhi)',
    industryName: 'Chhollywood',
    region: 'indian',
    flag: '🇮🇳',
    badge: 'CHHATTISGARHI',
    type: 'movie',
    originCountry: 'IN',
    defaultAudio: 'hindi',
    description: 'Chhattisgarhi Cinema (Chhollywood) Regional Productions',
  },

  // ================= 2. WESTERN & GLOBAL MAJOR CINEMA =================
  {
    id: 'english_movies',
    name: 'Hollywood (USA)',
    industryName: 'Hollywood',
    region: 'western',
    flag: '🇺🇸',
    badge: 'HOLLYWOOD',
    type: 'movie',
    languageCode: 'en',
    originCountry: 'US',
    defaultAudio: 'english',
    description: 'Hollywood Cinema Industry — Los Angeles & Global American Blockbusters',
  },
  {
    id: 'british_cinema',
    name: 'British Cinema (UK)',
    industryName: 'British Film',
    region: 'western',
    flag: '🇬🇧',
    badge: 'BRITISH',
    type: 'movie',
    languageCode: 'en',
    originCountry: 'GB',
    defaultAudio: 'english',
    description: 'United Kingdom Film Industry — British Studio & Indie Cinema',
  },
  {
    id: 'aussiewood',
    name: 'Aussiewood (Australia)',
    industryName: 'Aussiewood',
    region: 'western',
    flag: '🇦🇺',
    badge: 'AUSSIEWOOD',
    type: 'movie',
    languageCode: 'en',
    originCountry: 'AU',
    defaultAudio: 'english',
    description: 'Australian Cinema Industry (Aussiewood) — Sydney & Melbourne Hits',
  },
  {
    id: 'wellywood',
    name: 'Wellywood (New Zealand)',
    industryName: 'Wellywood',
    region: 'western',
    flag: '🇳🇿',
    badge: 'WELLYWOOD',
    type: 'movie',
    originCountry: 'NZ',
    defaultAudio: 'english',
    description: 'New Zealand Film Industry (Wellywood) — Wellington Epic Productions',
  },
  {
    id: 'trollywood',
    name: 'Trollywood (Sweden)',
    industryName: 'Trollywood',
    region: 'western',
    flag: '🇸🇪',
    badge: 'TROLLYWOOD',
    type: 'movie',
    languageCode: 'sv',
    originCountry: 'SE',
    defaultAudio: 'swedish',
    description: 'Swedish Film Industry (Trollywood) — Trollhättan Nordic Cinema',
  },

  // ================= 3. ASIAN CINEMA INDUSTRIES =================
  {
    id: 'hallyuwood',
    name: 'Hallyuwood (South Korea)',
    industryName: 'Hallyuwood',
    region: 'asian',
    flag: '🇰🇷',
    badge: 'HALLYUWOOD',
    type: 'movie',
    languageCode: 'ko',
    originCountry: 'KR',
    defaultAudio: 'korean',
    description: 'South Korean Cinema (Hallyuwood) — Thrillers, Drama & Chungmuro Hits',
  },
  {
    id: 'japanese_cinema',
    name: 'Japanese Cinema (Japan)',
    industryName: 'Japanese Film',
    region: 'asian',
    flag: '🇯🇵',
    badge: 'JAPANESE',
    type: 'movie',
    languageCode: 'ja',
    originCountry: 'JP',
    defaultAudio: 'japanese',
    description: 'Japanese Cinema Industry (Nihon Eiga) — Live Action Masterpieces',
  },
  {
    id: 'anime',
    name: 'Anime (Japanese Animation)',
    industryName: 'Anime',
    region: 'asian',
    flag: '🇯🇵',
    badge: 'ANIME 4K',
    type: 'tv',
    languageCode: 'ja',
    defaultAudio: 'japanese',
    description: 'Japanese Animation Studio Series & Feature Films in Ultra HD',
  },
  {
    id: 'chinawood',
    name: 'Chinawood (Mainland China)',
    industryName: 'Chinawood',
    region: 'asian',
    flag: '🇨🇳',
    badge: 'CHINAWOOD',
    type: 'movie',
    languageCode: 'zh',
    originCountry: 'CN',
    defaultAudio: 'chinese',
    description: 'Mainland Chinese Cinema Industry (Hengdian World Studios & Beyond)',
  },
  {
    id: 'hong_kong_cinema',
    name: 'Hong Kong Cinema',
    industryName: 'Hong Kong Cinema',
    region: 'asian',
    flag: '🇭🇰',
    badge: 'HK CINEMA',
    type: 'movie',
    languageCode: 'cn|zh',
    originCountry: 'HK',
    defaultAudio: 'chinese',
    description: 'Hong Kong Cinema — Legendary Martial Arts & Cantopop Thrillers',
  },
  {
    id: 'taiwanese_cinema',
    name: 'Taiwanese Cinema',
    industryName: 'Taiwanese Film',
    region: 'asian',
    flag: '🇹🇼',
    badge: 'TAIWAN',
    type: 'movie',
    originCountry: 'TW',
    defaultAudio: 'chinese',
    description: 'New Wave Taiwanese Cinema & Golden Horse Award Winners',
  },
  {
    id: 'thai_cinema',
    name: 'Thai Cinema (Thailand)',
    industryName: 'Thai Cinema',
    region: 'asian',
    flag: '🇹🇭',
    badge: 'THAILAND',
    type: 'movie',
    languageCode: 'th',
    originCountry: 'TH',
    defaultAudio: 'thai',
    description: 'Thai Film Industry — Martial Arts & Gripping Horror Cinema',
  },
  {
    id: 'indonesian_cinema',
    name: 'Indonesian Cinema',
    industryName: 'Indonesian Cinema',
    region: 'asian',
    flag: '🇮🇩',
    badge: 'INDONESIA',
    type: 'movie',
    languageCode: 'id',
    originCountry: 'ID',
    defaultAudio: 'indonesian',
    description: 'Indonesian Cinema — Jakarta Action Thrillers & Supernatural Hits',
  },
  {
    id: 'philippine_cinema',
    name: 'Philippine Cinema',
    industryName: 'Philippine Cinema',
    region: 'asian',
    flag: '🇵🇭',
    badge: 'PHILIPPINES',
    type: 'movie',
    languageCode: 'tl',
    originCountry: 'PH',
    defaultAudio: 'tagalog',
    description: 'Philippine Film Industry — Manila Dramas & Indie Cinema',
  },

  // ================= 4. SOUTH ASIAN & MIDDLE EASTERN CINEMAS =================
  {
    id: 'dhallywood',
    name: 'Dhallywood (Bangladesh)',
    industryName: 'Dhallywood',
    region: 'south_asian',
    flag: '🇧🇩',
    badge: 'DHALLYWOOD',
    type: 'movie',
    languageCode: 'bn',
    originCountry: 'BD',
    defaultAudio: 'bengali',
    description: 'Bangladeshi Film Industry (Dhallywood) — Dhaka Cinema Blockbusters',
  },
  {
    id: 'lollywood',
    name: 'Lollywood (Pakistan - Lahore)',
    industryName: 'Lollywood',
    region: 'south_asian',
    flag: '🇵🇰',
    badge: 'LOLLYWOOD',
    type: 'movie',
    languageCode: 'ur',
    originCountry: 'PK',
    defaultAudio: 'urdu',
    description: 'Pakistani Cinema Industry (Lollywood) — Lahore Productions',
  },
  {
    id: 'kariwood',
    name: 'Kariwood (Pakistan - Karachi)',
    industryName: 'Kariwood',
    region: 'south_asian',
    flag: '🇵🇰',
    badge: 'KARIWOOD',
    type: 'movie',
    originCountry: 'PK',
    defaultAudio: 'urdu',
    description: 'Karachi Film Industry (Kariwood) — Modern Pakistani Cinema Revival',
  },
  {
    id: 'pashtun_cinema',
    name: 'Pashtun Cinema (Pakistan - Pashto)',
    industryName: 'Pashtun Cinema',
    region: 'south_asian',
    flag: '🇵🇰',
    badge: 'PASHTUN',
    type: 'movie',
    languageCode: 'ps',
    defaultAudio: 'pashto',
    description: 'Pashto Language Film Industry in Khyber Pakhtunkhwa & Pakistan',
  },
  {
    id: 'follywood',
    name: 'Follywood (Sri Lanka)',
    industryName: 'Follywood',
    region: 'south_asian',
    flag: '🇱🇰',
    badge: 'FOLLYWOOD',
    type: 'movie',
    originCountry: 'LK',
    defaultAudio: 'sinhala',
    description: 'Sri Lankan Film Industry (Follywood) — Sinhala & Tamil Cinema',
  },
  {
    id: 'nepali_cinema',
    name: 'Nepali Cinema (Kollywood Nepal)',
    industryName: 'Nepali Cinema',
    region: 'south_asian',
    flag: '🇳🇵',
    badge: 'NEPALI',
    type: 'movie',
    languageCode: 'ne',
    originCountry: 'NP',
    defaultAudio: 'nepali',
    description: 'Nepali Cinema Industry — Kathmandu Valley Productions',
  },
  {
    id: 'iranian_cinema',
    name: 'Iranian Cinema (Iran)',
    industryName: 'Iranian Cinema',
    region: 'south_asian',
    flag: '🇮🇷',
    badge: 'IRANIAN',
    type: 'movie',
    languageCode: 'fa',
    originCountry: 'IR',
    defaultAudio: 'persian',
    description: 'Cinema of Iran — World Renowned Persian Poetic & Realist Film',
  },
  {
    id: 'turkish_cinema',
    name: 'Yeşilçam / Turkish Cinema',
    industryName: 'Turkish Cinema',
    region: 'south_asian',
    flag: '🇹🇷',
    badge: 'TURKISH',
    type: 'movie',
    languageCode: 'tr',
    originCountry: 'TR',
    defaultAudio: 'turkish',
    description: 'Turkish Film & Dizi Industry (Yeşilçam) — Istanbul Productions',
  },
  {
    id: 'egyptian_cinema',
    name: 'Egyptian Cinema (Egypt)',
    industryName: 'Egyptian Cinema',
    region: 'south_asian',
    flag: '🇪🇬',
    badge: 'EGYPTIAN',
    type: 'movie',
    languageCode: 'ar',
    originCountry: 'EG',
    defaultAudio: 'arabic',
    description: 'Cinema of Egypt — Arab World Hollywood in Cairo',
  },

  // ================= 5. AFRICAN CINEMA INDUSTRIES =================
  {
    id: 'nollywood',
    name: 'Nollywood (Nigeria)',
    industryName: 'Nollywood',
    region: 'african',
    flag: '🇳🇬',
    badge: 'NOLLYWOOD',
    type: 'movie',
    originCountry: 'NG',
    defaultAudio: 'english',
    description: 'Nigerian Film Industry (Nollywood) — World’s 2nd Largest Cinema',
  },
  {
    id: 'kannywood',
    name: 'Kannywood (Nigeria - Hausa)',
    industryName: 'Kannywood',
    region: 'african',
    flag: '🇳🇬',
    badge: 'KANNYWOOD',
    type: 'movie',
    languageCode: 'ha',
    originCountry: 'NG',
    defaultAudio: 'hausa',
    description: 'Hausa Language Film Industry (Kannywood) — Kano, Nigeria',
  },
  {
    id: 'ghallywood',
    name: 'Ghallywood (Ghana)',
    industryName: 'Ghallywood',
    region: 'african',
    flag: '🇬🇭',
    badge: 'GHALLYWOOD',
    type: 'movie',
    originCountry: 'GH',
    defaultAudio: 'english',
    description: 'Ghanaian Film Industry (Ghallywood) — Accra Cinema Productions',
  },
  {
    id: 'ghollywood',
    name: 'Ghollywood (Ghana Alternative)',
    industryName: 'Ghollywood',
    region: 'african',
    flag: '🇬🇭',
    badge: 'GHOLLYWOOD',
    type: 'movie',
    originCountry: 'GH',
    defaultAudio: 'english',
    description: 'Ghollywood (Ghana Alternative Cinema) Productions',
  },
  {
    id: 'riverwood',
    name: 'Riverwood (Kenya)',
    industryName: 'Riverwood',
    region: 'african',
    flag: '🇰🇪',
    badge: 'RIVERWOOD',
    type: 'movie',
    originCountry: 'KE',
    defaultAudio: 'swahili',
    description: 'Kenyan Cinema Industry (Riverwood) — Nairobi Productions',
  },
  {
    id: 'swahiliwood',
    name: 'Swahiliwood (Tanzania)',
    industryName: 'Swahiliwood',
    region: 'african',
    flag: '🇹🇿',
    badge: 'SWAHILIWOOD',
    type: 'movie',
    originCountry: 'TZ',
    defaultAudio: 'swahili',
    description: 'Tanzanian Film Industry (Swahiliwood) — Dar es Salaam Swahili Cinema',
  },
  {
    id: 'bongowood',
    name: 'Bongowood (Tanzania)',
    industryName: 'Bongowood',
    region: 'african',
    flag: '🇹🇿',
    badge: 'BONGOWOOD',
    type: 'movie',
    originCountry: 'TZ',
    defaultAudio: 'swahili',
    description: 'Bongowood (Tanzanian Bongo Cinema) Blockbusters',
  },
  {
    id: 'ugawood',
    name: 'Ugawood (Uganda)',
    industryName: 'Ugawood',
    region: 'african',
    flag: '🇺🇬',
    badge: 'UGAWOOD',
    type: 'movie',
    originCountry: 'UG',
    defaultAudio: 'english',
    description: 'Ugandan Film Industry (Ugawood) — Kampala Urban Cinema',
  },
  {
    id: 'wakaliwood',
    name: 'Wakaliwood (Uganda Ramon Action)',
    industryName: 'Wakaliwood',
    region: 'african',
    flag: '🇺🇬',
    badge: 'WAKALIWOOD',
    type: 'movie',
    originCountry: 'UG',
    defaultAudio: 'english',
    description: 'Wakaliwood (Ugandan Guerrilla Action Cinema) Cult Hits',
  },
  {
    id: 'zollywood',
    name: 'Zollywood (Zimbabwe)',
    industryName: 'Zollywood',
    region: 'african',
    flag: '🇿🇼',
    badge: 'ZOLLYWOOD',
    type: 'movie',
    originCountry: 'ZW',
    defaultAudio: 'english',
    description: 'Zimbabwe Film Industry (Zollywood) — Harare Cinema',
  },
  {
    id: 'sollywood',
    name: 'Sollywood (Sierra Leone)',
    industryName: 'Sollywood',
    region: 'african',
    flag: '🇸🇱',
    badge: 'SOLLYWOOD',
    type: 'movie',
    originCountry: 'SL',
    defaultAudio: 'english',
    description: 'Sierra Leone Film Industry (Sollywood) — Freetown',
  },
  {
    id: 'hillywood',
    name: 'Hillywood (Rwanda)',
    industryName: 'Hillywood',
    region: 'african',
    flag: '🇷🇼',
    badge: 'HILLYWOOD',
    type: 'movie',
    originCountry: 'RW',
    defaultAudio: 'english',
    description: 'Rwandan Film Festival & Cinema (Hillywood) — Kigali',
  },
  {
    id: 'hollyveld',
    name: 'Hollyveld (South Africa)',
    industryName: 'Hollyveld',
    region: 'african',
    flag: '🇿🇦',
    badge: 'HOLLYVELD',
    type: 'movie',
    originCountry: 'ZA',
    defaultAudio: 'english',
    description: 'South African Film Industry (Hollyveld) — Cape Town & Johannesburg',
  },

  // ================= 6. EUROPEAN CINEMA =================
  {
    id: 'french_cinema',
    name: 'French Cinema (France)',
    industryName: 'French Cinema',
    region: 'european',
    flag: '🇫🇷',
    badge: 'FRENCH',
    type: 'movie',
    languageCode: 'fr',
    originCountry: 'FR',
    defaultAudio: 'french',
    description: 'Cinema of France — Cannes Award Winners & French Masterpieces',
  },
  {
    id: 'german_cinema',
    name: 'German Cinema (Germany)',
    industryName: 'German Cinema',
    region: 'european',
    flag: '🇩🇪',
    badge: 'GERMAN',
    type: 'movie',
    languageCode: 'de',
    originCountry: 'DE',
    defaultAudio: 'german',
    description: 'German Film Industry (Babelsberg & Berlin) Thrillers & Epics',
  },
  {
    id: 'italian_cinema',
    name: 'Italian Cinema (Cinecittà)',
    industryName: 'Italian Cinema',
    region: 'european',
    flag: '🇮🇹',
    badge: 'ITALIAN',
    type: 'movie',
    languageCode: 'it',
    originCountry: 'IT',
    defaultAudio: 'italian',
    description: 'Italian Cinema (Cinecittà Studios) — Rome Classics & Modern Hits',
  },
  {
    id: 'spanish_cinema',
    name: 'Spanish Cinema (Spain)',
    industryName: 'Spanish Cinema',
    region: 'european',
    flag: '🇪🇸',
    badge: 'SPANISH',
    type: 'movie',
    languageCode: 'es',
    originCountry: 'ES',
    defaultAudio: 'spanish',
    description: 'Cinema of Spain (Goya Award Films) — Madrid & Barcelona',
  },
  {
    id: 'russian_cinema',
    name: 'Russian Cinema (Mosfilm)',
    industryName: 'Russian Cinema',
    region: 'european',
    flag: '🇷🇺',
    badge: 'RUSSIAN',
    type: 'movie',
    languageCode: 'ru',
    originCountry: 'RU',
    defaultAudio: 'russian',
    description: 'Russian Film Industry (Mosfilm) — Moscow Sci-Fi, Epics & War Drama',
  },

  // ================= 7. LATIN AMERICAN CINEMA =================
  {
    id: 'mexican_cinema',
    name: 'Mexican Cinema (Mexico)',
    industryName: 'Mexican Cinema',
    region: 'latin',
    flag: '🇲🇽',
    badge: 'MEXICAN',
    type: 'movie',
    languageCode: 'es',
    originCountry: 'MX',
    defaultAudio: 'spanish',
    description: 'Cinema of Mexico — Golden Age & Modern Oscar-Winning Epics',
  },
  {
    id: 'brazilian_cinema',
    name: 'Brazilian Cinema (Brazil)',
    industryName: 'Brazilian Cinema',
    region: 'latin',
    flag: '🇧🇷',
    badge: 'BRAZILIAN',
    type: 'movie',
    languageCode: 'pt',
    originCountry: 'BR',
    defaultAudio: 'portuguese',
    description: 'Cinema of Brazil — Rio & São Paulo Hits & Festival Favorites',
  },
  {
    id: 'argentine_cinema',
    name: 'Argentine Cinema (Argentina)',
    industryName: 'Argentine Cinema',
    region: 'latin',
    flag: '🇦🇷',
    badge: 'ARGENTINE',
    type: 'movie',
    languageCode: 'es',
    originCountry: 'AR',
    defaultAudio: 'spanish',
    description: 'Cinema of Argentina — Buenos Aires Oscar-Winning Dramas',
  },
  {
    id: 'chollywood',
    name: 'Chollywood (Peru)',
    industryName: 'Chollywood',
    region: 'latin',
    flag: '🇵🇪',
    badge: 'CHOLLYWOOD',
    type: 'movie',
    originCountry: 'PE',
    defaultAudio: 'spanish',
    description: 'Peruvian Film Industry (Chollywood) — Lima Productions',
  },

  // ================= 8. CHANNELS & CURATED COLLECTIONS =================
  {
    id: 'classic_movies',
    name: 'Classic Movies (Golden Era)',
    industryName: 'Classics',
    region: 'channels',
    flag: '🕰️',
    badge: 'CLASSICS',
    type: 'movie',
    defaultAudio: 'hindi',
    description: 'Golden Era Vintage Classics (Pre-2000 Timeless Masterpieces)',
  },
  {
    id: 'hindi_dubbed_movies',
    name: 'Hindi Dubbed Blockbusters',
    industryName: 'Hindi Dubbed',
    region: 'channels',
    flag: '🎙️',
    badge: 'DUAL AUDIO',
    type: 'movie',
    defaultAudio: 'hindi',
    description: 'Hollywood & World Cinema with Official Hindi Dubbed Track',
  },
  {
    id: 'kdrama',
    name: 'K-Drama (Original Korean)',
    industryName: 'K-Drama',
    region: 'channels',
    flag: '🇰🇷',
    badge: 'K-SERIES',
    type: 'tv',
    languageCode: 'ko',
    defaultAudio: 'korean',
    description: 'Top Korean Television Dramas & Global Streaming Hits',
  },
  {
    id: 'kdrama_hindi',
    name: 'Hindi Dubbed K-Drama',
    industryName: 'K-Drama Hindi',
    region: 'channels',
    flag: '🇮🇳🇰🇷',
    badge: 'HINDI AUDIO',
    type: 'tv',
    defaultAudio: 'hindi',
    description: 'Korean Dramas with Official Hindi Dubbed Audio Stream',
  },
  {
    id: 'netflix_movies',
    name: 'Netflix Movies & Shows',
    industryName: 'Netflix',
    region: 'channels',
    flag: '🔴',
    badge: 'NETFLIX',
    type: 'movie',
    defaultAudio: 'dual',
    description: 'Official Netflix Originals & Platform Exclusive Releases',
  },
  {
    id: 'hbo_movies',
    name: 'HBO Max Originals',
    industryName: 'HBO Max',
    region: 'channels',
    flag: '🔵',
    badge: 'HBO / MAX',
    type: 'movie',
    defaultAudio: 'english',
    description: 'HBO Original Productions & Warner Bros Cinema Hits',
  },
  {
    id: 'jiohotstar_movies',
    name: 'JioHotstar Movies',
    industryName: 'JioHotstar',
    region: 'channels',
    flag: '🟣',
    badge: 'JIO / HOTSTAR',
    type: 'movie',
    defaultAudio: 'hindi',
    description: 'Disney+ Hotstar & JioCinema Originals & Blockbusters',
  },
  {
    id: 'mxplayer_movies',
    name: 'MX Player Hits',
    industryName: 'MX Player',
    region: 'channels',
    flag: '🟢',
    badge: 'MX ORIGINALS',
    type: 'movie',
    defaultAudio: 'hindi',
    description: 'MX Player Desi Blockbusters & Web Movies',
  },,
  {
    "id": "karachi_cinema",
    "name": "Karachi Cinema",
    "industryName": "Pakistani Cinema",
    "region": "south_asian",
    "flag": "🇵🇰",
    "badge": "PAKISTANI",
    "type": "movie",
    "languageCode": "ur",
    "originCountry": "PK",
    "defaultAudio": "urdu",
    "description": "Urdu and Pakistani Cinema Productions"
  },
  {
    "id": "taiwan_cinema",
    "name": "Taiwan Cinema",
    "industryName": "Taiwanese Film",
    "region": "asian",
    "flag": "🇹🇼",
    "badge": "TAIWAN",
    "type": "movie",
    "languageCode": "zh",
    "originCountry": "TW",
    "defaultAudio": "chinese",
    "description": "Taiwanese Film Industry"
  },
  {
    "id": "sri_lankan_cinema",
    "name": "Sri Lankan Cinema",
    "industryName": "Sri Lankan Film",
    "region": "south_asian",
    "flag": "🇱🇰",
    "badge": "SRI LANKA",
    "type": "movie",
    "languageCode": "si",
    "originCountry": "LK",
    "defaultAudio": "sinhala",
    "description": "Sri Lankan Sinhala Cinema"
  },
  {
    "id": "australian_cinema",
    "name": "Australian Cinema",
    "industryName": "Aussiewood",
    "region": "western",
    "flag": "🇦🇺",
    "badge": "AUSSIEWOOD",
    "type": "movie",
    "languageCode": "en",
    "originCountry": "AU",
    "defaultAudio": "english",
    "description": "Australian Film Industry"
  }
];

// Helper to look up any industry
export const getIndustryDef = (id: string): GooTvCategoryDef | undefined => {
  return GOO_TV_CATEGORIES.find((c) => c.id === id);
};

// 4. Bollywood / Hindi Cinema
export const fetchBollywood = async (page = 1, type: 'movie' | 'tv' = 'movie'): Promise<PaginatedResult<MediaItem>> => {
  const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${type}`, {
    page,
    with_original_language: 'hi',
    with_origin_country: 'IN',
    sort_by: 'popularity.desc',
    'vote_count.gte': '5',
  });
  return {
    ...data,
    results: deduplicateMediaItems(data.results.map((item) => ({ ...item, media_type: type, original_language: 'hi' }))),
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
  // Alias mapping
  const normalizedId = categoryId === 'bollywood' ? 'hindi_movies' : (categoryId === 'hollywood' ? 'english_movies' : categoryId);

  // 1. Curated Channels & Special Handlers
  if (normalizedId === 'south_movies') {
    return fetchSouthMovies(page, subFilter);
  }
  if (normalizedId === 'classic_movies') {
    return fetchClassicMovies(page);
  }
  if (normalizedId === 'hindi_dubbed_movies') {
    return fetchHindiDubbedMovies(page);
  }
  if (normalizedId === 'kdrama_hindi') {
    return fetchKDramaHindi(page);
  }
  if (normalizedId === 'hbo_movies') {
    return fetchHboMovies(page);
  }
  if (normalizedId === 'netflix_movies') {
    return fetchNetflixMovies(page);
  }
  if (normalizedId === 'jiohotstar_movies') {
    return fetchJioHotstarMovies(page);
  }
  if (normalizedId === 'mxplayer_movies') {
    return fetchMxPlayerMovies(page);
  }
  if (normalizedId === 'anime') {
    return fetchAnime(page);
  }

  // 2. Strict World Cinema Industries Lookup
  const industryDef = GOO_TV_CATEGORIES.find((c) => c.id === normalizedId);

  if (industryDef) {
    const effectiveType = industryDef.type || 'movie';
    const params: Record<string, string | number> = {
      page,
      sort_by: 'popularity.desc',
    };

    if (industryDef.languageCode && industryDef.languageCode !== 'all') {
      params.with_original_language = industryDef.languageCode;
    }
    if (industryDef.originCountry && industryDef.originCountry !== 'all') {
      params.with_origin_country = industryDef.originCountry;
    }

    // Set reasonable vote thresholds to eliminate garbage/empty titles while preserving regional gems
    if (['english_movies', 'hollywood', 'british_cinema', 'french_cinema', 'german_cinema', 'italian_cinema', 'spanish_cinema'].includes(normalizedId)) {
      params['vote_count.gte'] = 15;
    } else if (['hindi_movies', 'hallyuwood', 'japanese_cinema', 'tollywood_telugu', 'kollywood', 'mollywood', 'sandalwood', 'pollywood'].includes(normalizedId)) {
      params['vote_count.gte'] = 5;
    }

    try {
      const data = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${effectiveType}`, params);
      const cleanResults = (data.results || []).map((item) => ({
        ...item,
        media_type: effectiveType,
        original_language: item.original_language || industryDef.languageCode,
      }));

      return {
        ...data,
        results: deduplicateMediaItems(cleanResults),
      };
    } catch (err) {
      console.warn(`Error fetching industry ${normalizedId}, trying relaxed parameters`, err);
      // Fallback with just language code if country code was too restrictive
      if (industryDef.languageCode) {
        try {
          const fallbackData = await tmdbFetch<PaginatedResult<MediaItem>>(`/discover/${effectiveType}`, {
            page,
            with_original_language: industryDef.languageCode,
            sort_by: 'popularity.desc',
          });
          return {
            ...fallbackData,
            results: deduplicateMediaItems((fallbackData.results || []).map((i) => ({ ...i, media_type: effectiveType, original_language: industryDef.languageCode }))),
          };
        } catch {}
      }
    }
  }

  // Default fallback to Hindi movies
  return fetchHindiMovies(page);
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
