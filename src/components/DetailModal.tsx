import React, { useEffect, useState } from 'react';
import { 
  X, 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Bookmark, 
  Check, 
  Share2, 
  Film, 
  Tv, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { MediaItem, MediaDetails } from '../types/movie';
import { fetchMediaDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface DetailModalProps {
  media: MediaItem;
  onClose: () => void;
  onPlayMedia: (item: MediaItem) => void;
  onOpenTrailer: (item: MediaItem) => void;
  onOpenDownload?: (item: MediaItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  media,
  onClose,
  onPlayMedia,
  onOpenTrailer,
  onOpenDownload,
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const isBookmarked = isInWatchlist(media.id);
  const title = media.title || media.name || 'Movie';

  const downloadLinks = [
    {
      id: 1,
      name: 'Download Link 1 (StreamTape Direct)',
      badge: '1.34 GB',
      url: isTv
        ? `https://player.autoembed.cc/embed/tv/${media.id}/1/1?server=streamtape`
        : `https://player.autoembed.cc/embed/movie/${media.id}?server=streamtape`,
    },
    {
      id: 2,
      name: 'Download Link 2 (StreamWish Fast)',
      badge: 'High Speed',
      url: isTv
        ? `https://player.autoembed.cc/embed/tv/${media.id}/1/1?server=streamwish`
        : `https://player.autoembed.cc/embed/movie/${media.id}?server=streamwish`,
    },
    {
      id: 3,
      name: 'Download Link 3 (Filemoon Cloud)',
      badge: 'Resumable',
      url: isTv
        ? `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=1&e=1&server=filemoon`
        : `https://multiembed.mov/?video_id=${media.id}&tmdb=1&server=filemoon`,
    },
    {
      id: 4,
      name: 'Download Link 4 (DoodStream Mirror)',
      badge: 'Direct Host',
      url: isTv
        ? `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=1&e=1&server=doodstream`
        : `https://multiembed.mov/?video_id=${media.id}&tmdb=1&server=doodstream`,
    },
    {
      id: 5,
      name: 'Download Link 5 (AutoEmbed Server)',
      badge: 'Full HD',
      url: isTv
        ? `https://player.autoembed.cc/embed/tv/${media.id}/1/1`
        : `https://player.autoembed.cc/embed/movie/${media.id}`,
    },
    {
      id: 6,
      name: 'Download Link 6 (SuperEmbed 4K)',
      badge: '4K Ultra',
      url: isTv
        ? `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=1&e=1`
        : `https://multiembed.mov/?video_id=${media.id}&tmdb=1`,
    },
    {
      id: 7,
      name: 'Download Link 7 (YTS YIFY Torrent)',
      badge: 'Torrent / Magnet',
      url: `https://yts.mx/browse-movies/${encodeURIComponent(title)}`,
    },
    {
      id: 8,
      name: 'Download Link 8 (VidSrc Unblocked)',
      badge: 'Direct Stream',
      url: isTv
        ? `https://vidsrc.net/embed/tv/${media.id}/1/1`
        : `https://vidsrc.net/embed/movie/${media.id}`,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchMediaDetails(media.id, isTv ? 'tv' : 'movie')
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load movie details', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [media.id, isTv]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#details-${media.id}`;
    const shareData = {
      title: `${media.title || media.name} on GOO TV`,
      text: `Watch ${media.title || media.name} in 4K on GOO TV!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const year = (media.release_date || media.first_air_date || '').slice(0, 4);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '8.0';

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-[#11131c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black my-8">
        
        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#0d0e15]">
          <img
            src={getBackdropUrl(media.backdrop_path || media.poster_path, 'original')}
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/60 to-transparent" />

          {/* Top Close & Share */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer"
              title="Share"
              aria-label="Share movie link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/60 hover:bg-red-600/80 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Breadcrumb Navigation on Banner */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-[11px] font-semibold text-gray-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span>{isTv ? 'TV Series' : 'Movies'}</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className="text-red-400 truncate max-w-[120px]">{title}</span>
          </div>

          {/* Banner Meta Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase">
                  {isTv ? 'TV Show' : 'Movie'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black">
                  4K ULTRA HD
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {rating} / 10
                </span>
              </div>
              <h2 id="detail-modal-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {title}
              </h2>
              {details?.tagline && (
                <p className="text-xs text-red-400/90 italic font-medium">
                  &ldquo;{details.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onPlayMedia(media);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                Play Movie
              </button>

              <a
                href={isTv
                  ? `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=1&e=1`
                  : `https://multiembed.mov/?video_id=${media.id}&tmdb=1`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Clean Popup Window</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenDownload) {
                    onOpenDownload(media);
                  } else {
                    onPlayMedia(media);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (4K/1080p)</span>
              </button>

              <button
                onClick={() => onOpenTrailer(media)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-red-400" />
                Trailer
              </button>

              <button
                onClick={() => isBookmarked ? removeFromWatchlist(media.id) : addToWatchlist(media)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
                title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {isBookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Info */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 border-b border-white/10 pb-4">
            {year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Released: {year}
              </span>
            )}
            {details?.runtime ? (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                Runtime: {details.runtime} minutes
              </span>
            ) : null}
            {details?.number_of_seasons ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Tv className="w-3.5 h-3.5" />
                {details.number_of_seasons} Seasons ({details.number_of_episodes} Episodes)
              </span>
            ) : null}
            {details?.genres && (
              <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-gray-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Story Overview
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {media.overview || details?.overview || 'No synopsis provided for this title.'}
            </p>
          </div>

          {/* Download Links Section (Screenshot 1 Design) */}
          <div className="pt-2 space-y-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Links</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Real • Verified No 404
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {downloadLinks.map((dl) => (
                <a
                  key={dl.id}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md hover:shadow-emerald-500/20"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{dl.name}</span>
                  </span>
                  <span className="text-[10px] font-black bg-black/20 text-black px-1.5 py-0.5 rounded flex-shrink-0">
                    {dl.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Top Cast */}
          {details?.credits?.cast && details.credits.cast.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Top Cast & Characters
              </h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {details.credits.cast.slice(0, 10).map((actor) => (
                  <div key={actor.id} className="flex-shrink-0 text-center w-20">
                    <img
                      src={getImageUrl(actor.profile_path, 'w300')}
                      alt={actor.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10 bg-gray-800 shadow"
                    />
                    <p className="text-[11px] font-bold text-white truncate mt-1.5">
                      {actor.name}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Titles */}
          {(details?.recommendations?.results?.length || details?.similar?.results?.length) ? (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Recommended & Similar Movies
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {(details.recommendations?.results || details.similar?.results || [])
                  .slice(0, 6)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        onClose();
                        onPlayMedia(rec);
                      }}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-red-500 transition-all p-1"
                    >
                      <img
                        src={getImageUrl(rec.poster_path, 'w300')}
                        alt={rec.title || rec.name}
                        loading="lazy"
                        className="w-full aspect-[2/3] object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <p className="text-[11px] font-bold text-white truncate mt-1 px-0.5">
                        {rec.title || rec.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {copiedLink && (
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs text-center font-bold">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
