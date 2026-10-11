import { MediaItem } from '../types/movie';
import { STREAMING_SERVERS } from '../services/servers';

export interface PlayerUrlOptions {
  season?: number;
  episode?: number;
  serverId?: string;
  audio?: 'hindi' | 'english' | 'dual';
  quality?: '4k' | '1080p' | '720p' | '480p';
}

/**
 * Returns the direct stream URL for opening in a clean popup player or tab.
 * Uses verified streaming engine (multiembed or active server) matching Goo TV clean popup trick.
 */
export const getCleanPlayerUrl = (media: MediaItem, options: PlayerUrlOptions = {}): string => {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const season = options.season || 1;
  const episode = options.episode || 1;

  if (options.serverId) {
    const srv = STREAMING_SERVERS.find((s) => s.id === options.serverId);
    if (srv) {
      return isTv ? srv.getTvUrl(media.id, season, episode) : srv.getMovieUrl(media.id);
    }
  }

  // Primary direct stream engine (Zero sandbox issue, unblocked 1080p/4K)
  return isTv
    ? `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=${season}&e=${episode}`
    : `https://multiembed.mov/?video_id=${media.id}&tmdb=1`;
};

/**
 * Opens the Clean Cinema Player in a dedicated, high-performance pop-up window.
 * This completely avoids all iframe sandbox restrictions and plays smoothly everywhere.
 */
export const openCleanPopupWindow = (media: MediaItem, options: PlayerUrlOptions = {}): void => {
  const cleanUrl = getCleanPlayerUrl(media, options);

  const screenW = window.screen.availWidth || window.screen.width || 1280;
  const screenH = window.screen.availHeight || window.screen.height || 720;

  const width = Math.min(screenW * 0.92, 1280);
  const height = Math.min(screenH * 0.88, 720);
  const left = Math.max(0, (screenW - width) / 2);
  const top = Math.max(0, (screenH - height) / 2);

  const windowFeatures = [
    `width=${Math.round(width)}`,
    `height=${Math.round(height)}`,
    `left=${Math.round(left)}`,
    `top=${Math.round(top)}`,
    'status=no',
    'menubar=no',
    'toolbar=no',
    'location=no',
    'resizable=yes',
    'scrollbars=no',
  ].join(',');

  const popup = window.open(cleanUrl, 'GooTVCinemaPlayer', windowFeatures);

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // If pop-up blocker triggered, open safely in new tab
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  } else {
    try {
      popup.focus();
    } catch {
      // Ignored if cross-context focus blocked
    }
  }
};

