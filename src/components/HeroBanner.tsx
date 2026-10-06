import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Volume2, VolumeX, Sparkles, ExternalLink, Download } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { getBackdropUrl, getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface HeroBannerProps {
  items: MediaItem[];
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
  onOpenDownload?: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onPlayMedia,
  onOpenDetails,
  onPlayTrailer,
  onOpenDownload,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Auto rotate every 8 seconds if user doesn't interact
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 6));
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-[65vh] min-h-[500px] bg-[#12131c] animate-pulse flex items-center justify-center">
        <div className="text-gray-500 flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-spin text-red-500" />
          <span>Loading Blockbusters...</span>
        </div>
      </div>
    );
  }

  const current = items[currentIndex] || items[0];
  const title = current.title || current.name || 'Featured Movie';
  const year = (current.release_date || current.first_air_date || '').slice(0, 4);
  const rating = current.vote_average ? current.vote_average.toFixed(1) : '8.5';
  const isBookmarked = isInWatchlist(current.id);

  return (
    <div className="relative w-full h-[75vh] min-h-[550px] max-h-[850px] overflow-hidden bg-black select-none">
      {/* Background Backdrop Image with Gradient Masks */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={getBackdropUrl(current.backdrop_path || current.poster_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out brightness-90"
        />
        {/* Cinema Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0b0c10]/90 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* VIP Spotlight Tag & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-red-600/90 text-white shadow-lg shadow-red-600/40">
              <Sparkles className="w-3.5 h-3.5" />
              SPOTLIGHT #{(currentIndex + 1)}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
              4K ULTRA HD
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {rating} TMDB
            </span>
            {year && (
              <span className="px-2 py-0.5 text-xs text-gray-300 font-semibold bg-black/40 rounded">
                {year}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              98% Match
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-sm sm:text-base text-gray-200 line-clamp-3 sm:line-clamp-4 leading-relaxed font-medium drop-shadow-md max-w-xl">
            {current.overview || 'Stream this critically acclaimed title right now in ultra crisp HD with instant multi-server playback.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayMedia(current)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/40 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Watch Now</span>
            </button>

            {/* Direct Clean Popup Window Button */}
            <a
              href={current.media_type === 'tv'
                ? `https://multiembed.mov/?video_id=${current.id}&tmdb=1&s=1&e=1`
                : `https://multiembed.mov/?video_id=${current.id}&tmdb=1`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Clean Popup Window</span>
            </a>

            <button
              onClick={() => onOpenDownload ? onOpenDownload(current) : onPlayMedia(current)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 4K</span>
            </button>

            <button
              onClick={() => onPlayTrailer(current)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Trailer</span>
            </button>

            <button
              onClick={() => {
                if (isBookmarked) {
                  removeFromWatchlist(current.id);
                } else {
                  addToWatchlist(current);
                }
              }}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-3 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-red-600/30 border-red-500 text-red-400'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {isBookmarked ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onOpenDetails(current)}
              title="More Info"
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Carousel Selector (Bottom Right) */}
        <div className="hidden md:flex absolute bottom-12 right-8 items-center gap-2.5 z-20 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          {items.slice(0, 5).map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 transform cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-red-500 scale-105 shadow-lg shadow-red-500/50'
                    : 'opacity-50 hover:opacity-100 hover:scale-100'
                }`}
              >
                <img
                  src={getImageUrl(item.poster_path, 'w300')}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white">
                  #{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
