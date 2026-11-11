import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Sparkles, ExternalLink, Download } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { getBackdropUrl, getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { openCleanPopupWindow } from '../utils/playerUrl';
import { playGelPop, playGlassPing } from '../utils/gelSound';

interface HeroBannerProps {
  items: MediaItem[];
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
  onOpenDownload?: (item: MediaItem) => void;
  theme?: 'pastel' | 'dark';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onPlayMedia,
  onOpenDetails,
  onPlayTrailer,
  onOpenDownload,
  theme = 'pastel',
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
      <div className="w-full h-[65vh] min-h-[480px] rounded-3xl mx-auto my-4 max-w-7xl liquid-glass-plate flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-stone-700 font-bold">
          <Sparkles className="w-5 h-5 animate-spin text-rose-500" />
          <span>Buffering 3D Liquid Blockbusters...</span>
        </div>
      </div>
    );
  }

  const current = items[currentIndex] || items[0];
  const title = current.title || current.name || 'Featured Movie';
  const year = (current.release_date || current.first_air_date || '').slice(0, 4);
  const rating = current.vote_average ? current.vote_average.toFixed(1) : '8.5';
  const isBookmarked = isInWatchlist(current.id);

  const handleWatchNow = () => {
    playGelPop(520, 'sine');
    onPlayMedia(current);
  };

  const handleOpenPopup = () => {
    playGlassPing();
    openCleanPopupWindow(current);
  };

  const handleDownload = () => {
    playGelPop(680, 'sine');
    if (onOpenDownload) {
      onOpenDownload(current);
    } else {
      window.open(`https://multiembed.mov/direct-download?id=${current.id}&quality=1080p`, '_blank');
    }
  };

  const handleTrailer = () => {
    playGelPop(580, 'triangle');
    onPlayTrailer(current);
  };

  const handleToggleWatchlist = () => {
    playGelPop(480, 'sine');
    if (isBookmarked) {
      removeFromWatchlist(current.id);
    } else {
      addToWatchlist(current);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto my-3 sm:my-6 px-3 sm:px-6">
      {/* 3D Liquid Glassmorphic Main Billboard Frame */}
      <div className={`relative w-full h-[70vh] min-h-[520px] max-h-[760px] rounded-[32px] sm:rounded-[40px] overflow-hidden select-none shadow-2xl transition-all ${
        theme === 'pastel'
          ? 'liquid-glass-plate border-2 border-white/90'
          : 'liquid-glass-plate-dark border border-white/20'
      }`}>
        
        {/* Background Backdrop Image */}
        <div className="absolute inset-0">
          <img
            key={current.id}
            src={getBackdropUrl(current.backdrop_path || current.poster_path, 'original')}
            alt={title}
            className="w-full h-full object-cover object-center transform scale-102 transition-all duration-1000 ease-out brightness-95"
          />

          {/* Liquid Glass Refraction Sheen Overlay */}
          <div className="gel-sheen opacity-60 pointer-events-none" />

          {/* Gradients for text contrast */}
          <div className={`absolute inset-0 ${
            theme === 'pastel'
              ? 'bg-gradient-to-r from-[#fff5f7]/95 via-[#fff5f7]/65 to-transparent w-full md:w-3/4'
              : 'bg-gradient-to-r from-[#0d0910]/95 via-[#0d0910]/70 to-transparent w-full md:w-3/4'
          }`} />
          <div className={`absolute inset-0 ${
            theme === 'pastel'
              ? 'bg-gradient-to-t from-[#fff5f7] via-[#fff5f7]/30 to-transparent'
              : 'bg-gradient-to-t from-[#0d0910] via-[#0d0910]/40 to-transparent'
          }`} />
        </div>

        {/* Hero Content Panel */}
        <div className="relative h-full px-5 sm:px-10 lg:px-12 flex flex-col justify-end pb-10 sm:pb-14 z-10 max-w-2xl space-y-4">
          
          {/* 3D Badges Suite */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase gel-pink text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              SPOTLIGHT #{(currentIndex + 1)}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-black gel-badge text-[#2e1c24] backdrop-blur-md shadow-sm">
              4K ULTRA HD
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-black gel-cream text-stone-900 flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {rating} TMDB
            </span>

            {year && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-black/40 text-white backdrop-blur-sm">
                {year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] drop-shadow-sm ${
            theme === 'pastel' ? 'text-[#2e1c24]' : 'text-white'
          }`}>
            {title}
          </h1>

          {/* Overview Synopsis */}
          <p className={`text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-4 leading-relaxed font-semibold max-w-xl ${
            theme === 'pastel' ? 'text-[#58414b]' : 'text-stone-300'
          }`}>
            {current.overview || 'Stream this blockbuster title now in ultra-high definition with 20 unblocked streaming engines.'}
          </p>

          {/* 3D Skeuomorphic Gel Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            
            {/* Primary Watch Now Button (3D Pink Gel Capsule) */}
            <button
              onClick={handleWatchNow}
              className="flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full gel-pink text-white font-black text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="gel-sheen" />
              <Play className="w-5 h-5 fill-white stroke-[2]" />
              <span>Watch Now</span>
            </button>

            {/* Direct Clean Popup Window (3D Cream Gel Capsule) */}
            <button
              type="button"
              onClick={handleOpenPopup}
              title="Open in Clean Popup Window with Full Controls"
              className="flex items-center gap-2 px-5 py-3 sm:py-3.5 rounded-full gel-cream text-stone-900 font-black text-sm sm:text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="gel-sheen" />
              <ExternalLink className="w-4 h-4 text-rose-600 stroke-[2.5]" />
              <span className="hidden sm:inline">Clean Popup</span>
              <span className="sm:hidden">Popup</span>
            </button>

            {/* Direct Download (3D White Glass Capsule) */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4.5 py-3 sm:py-3.5 rounded-full gel-white text-stone-900 font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline">Download</span>
            </button>

            {/* Trailer (3D Glass Capsule) */}
            <button
              onClick={handleTrailer}
              className="flex items-center gap-1.5 px-4 py-3 sm:py-3.5 rounded-full gel-badge text-[#2e1c24] font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trailer</span>
            </button>

            {/* Bookmark (3D Squircle Gel) */}
            <button
              onClick={handleToggleWatchlist}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-3 sm:p-3.5 rounded-full transition-all cursor-pointer shadow-md hover:scale-105 active:scale-90 ${
                isBookmarked ? 'gel-pink text-white' : 'gel-cream text-stone-900'
              }`}
            >
              {isBookmarked ? <Check className="w-5 h-5 stroke-[3]" /> : <Plus className="w-5 h-5 stroke-[3]" />}
            </button>

            {/* Details (3D Squircle Gel) */}
            <button
              onClick={() => {
                playGelPop(500, 'sine');
                onOpenDetails(current);
              }}
              title="Movie Details & Cast"
              className="p-3 sm:p-3.5 rounded-full gel-white text-stone-900 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-90"
            >
              <Info className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Carousel (Bottom Right 3D Capsules) */}
        <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-2.5 z-20 p-2 rounded-[24px] liquid-glass-plate">
          {items.slice(0, 5).map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playGelPop(600 + idx * 40, 'sine');
                  setCurrentIndex(idx);
                }}
                className={`relative w-15 h-22 rounded-[16px] overflow-hidden transition-all duration-300 transform cursor-pointer ${
                  isSelected
                    ? 'ring-3 ring-rose-500 scale-108 shadow-xl shadow-rose-500/40'
                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                <img
                  src={getImageUrl(item.poster_path || item.backdrop_path, 'w300')}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                <div className="gel-sheen" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
