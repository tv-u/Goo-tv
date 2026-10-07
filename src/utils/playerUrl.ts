import { MediaItem } from '../types/movie';

export interface PlayerUrlOptions {
  season?: number;
  episode?: number;
  serverId?: string;
  audio?: 'hindi' | 'english' | 'dual';
  quality?: '4k' | '1080p' | '720p' | '480p';
}

/**
 * Returns the URL for opening the Clean Cinema Player in a pop-up window or standalone mode.
 * Uses both query params and hash for maximum compatibility across GitHub Pages and custom domains.
 */
export const getCleanPlayerUrl = (media: MediaItem, options: PlayerUrlOptions = {}): string => {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const mediaType = isTv ? 'tv' : 'movie';
  const season = options.season || 1;
  const episode = options.episode || 1;
  const server = options.serverId || 'autoembed';
  const audio = options.audio || 'hindi';
  const quality = options.quality || '1080p';

  const origin = window.location.origin;
  const pathname = window.location.pathname;

  const url = new URL(`${origin}${pathname}`);
  url.searchParams.set('clean_player', '1');
  url.searchParams.set('type', mediaType);
  url.searchParams.set('id', String(media.id));
  if (isTv) {
    url.searchParams.set('s', String(season));
    url.searchParams.set('e', String(episode));
  }
  url.searchParams.set('server', server);
  url.searchParams.set('audio', audio);
  url.searchParams.set('quality', quality);

  // Fallback hash for static hosts like GitHub Pages SPA routing
  url.hash = `clean-player-${mediaType}-${media.id}-${season}-${episode}`;

  return url.toString();
};

/**
 * Opens the Clean Cinema Player in a dedicated, high-performance pop-up window
 * with all VIP playback controls (Skip, Stop/Start, 4K Quality, Hindi Dual Audio, Fullscreen).
 */
export const openCleanPopupWindow = (media: MediaItem, options: PlayerUrlOptions = {}): void => {
  const cleanUrl = getCleanPlayerUrl(media, options);

  // Compute optimum pop-up window dimensions
  const screenW = window.screen.availWidth || window.screen.width || 1280;
  const screenH = window.screen.availHeight || window.screen.height || 720;

  const width = Math.min(screenW * 0.94, 1360);
  const height = Math.min(screenH * 0.92, 820);
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
    'scrollbars=yes',
  ].join(',');

  const popup = window.open(cleanUrl, `GooTVCinema_${media.id}`, windowFeatures);

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
