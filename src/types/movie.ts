export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  media_type?: 'movie' | 'tv';
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  imdb_id?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
  episodes?: Episode[];
}

export interface MediaDetails extends MediaItem {
  credits?: {
    cast: CastMember[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: VideoTrailer[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  seasons?: Season[];
  external_ids?: {
    imdb_id?: string;
  };
}

export interface StreamingServer {
  id: string;
  name: string;
  badge: string;
  category: 'primary' | 'storage' | 'fast';
  speed: string;
  quality: string;
  adsRating: 'Low' | 'Medium' | 'Safe';
  getMovieUrl: (tmdbId: number | string, imdbId?: string) => string;
  getTvUrl: (tmdbId: number | string, season: number, episode: number, imdbId?: string) => string;
  description: string;
}

export interface WatchHistoryItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  season?: number;
  episode?: number;
  serverId?: string;
  timestamp: number;
}
