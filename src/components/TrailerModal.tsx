import React, { useEffect, useState } from 'react';
import { X, Play, AlertCircle, Film } from 'lucide-react';
import { MediaItem, VideoTrailer } from '../types/movie';
import { fetchMediaDetails } from '../services/tmdb';

interface TrailerModalProps {
  media: MediaItem;
  onClose: () => void;
  onWatchMovie: (item: MediaItem) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  media,
  onClose,
  onWatchMovie,
}) => {
  const [trailer, setTrailer] = useState<VideoTrailer | null>(null);
  const [loading, setLoading] = useState(true);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const mediaType = media.media_type || (media.title ? 'movie' : 'tv');
    fetchMediaDetails(media.id, mediaType)
      .then((data) => {
        if (!isMounted) return;
        const videos = data.videos?.results || [];
        // Look for official trailer first, then teaser, then clip
        const official = videos.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
        ) || videos.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        ) || videos[0];

        setTrailer(official || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load trailer', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [media]);

  const title = media.title || media.name || 'Official Trailer';

  // Strict YouTube Key Validation (YouTube keys are 11 chars containing letters, numbers, -, _)
  const isValidYouTubeKey = (key?: string): boolean => {
    if (!key) return false;
    return /^[a-zA-Z0-9_-]{11}$/.test(key);
  };

  const hasValidTrailer = trailer && isValidYouTubeKey(trailer.key);
  const trailerEmbedUrl = hasValidTrailer
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#12141f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-red-500" />
            <h3 id="trailer-title" className="text-sm sm:text-base font-extrabold text-white truncate max-w-lg">
              {title} - Official Trailer
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {loading ? (
            <div className="text-center text-sm text-gray-400 animate-pulse flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
              <span>Finding official HD trailer...</span>
            </div>
          ) : hasValidTrailer && trailerEmbedUrl ? (
            <iframe
              src={trailerEmbedUrl}
              title={`${title} Trailer`}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-gray-300">
                No verified YouTube trailer found for this title.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onWatchMovie(media);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                Watch Movie Directly on VIP Servers
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0e1017] border-t border-white/10 text-xs">
          <span className="text-gray-400">Validated YouTube Stream • 1080p HD</span>
          <button
            onClick={() => {
              onClose();
              onWatchMovie(media);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Full Movie Now
          </button>
        </div>
      </div>
    </div>
  );
};
