import React from 'react';
import { Play, Star, Plus, Check, ExternalLink, Download } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { openCleanPopupWindow } from '../utils/playerUrl';
import { playGelPop } from '../utils/gelSound';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onDetails?: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  aspectRatio?: 'poster' | 'backdrop';
  theme?: 'pastel' | 'dark';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPlay,
  onDetails,
  onDownload,
  aspectRatio = 'poster',
  theme = 'pastel',
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
  const isBookmarked = isInWatchlist(item.id);
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

  const posterImg = aspectRatio === 'poster' 
    ? getImageUrl(item.poster_path, 'w500')
    : getImageUrl(item.backdrop_path || item.poster_path, 'w780');

  const handleCardClick = () => {
    playGelPop(520, 'sine');
    onPlay(item);
  };

  const handleOpenPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    playGelPop(660, 'triangle');
    openCleanPopupWindow(item);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playGelPop(480, 'sine');
    if (isBookmarked) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playGelPop(720, 'sine');
    if (onDownload) {
      onDownload(item);
    } else {
      const dlUrl = `https://multiembed.mov/direct-download?id=${item.id}&quality=1080p`;
      window.open(dlUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 transition-all duration-300 ease-out select-none flex flex-col justify-between">
      
      {/* 3D Liquid Glassmorphic Squircle Poster Frame */}
      <div 
        onClick={handleCardClick}
        className={`relative w-full aspect-[2/3] rounded-[22px] overflow-hidden cursor-pointer ${
          theme === 'pastel'
            ? 'gel-card-squircle bg-white/40'
            : 'gel-card-squircle-dark bg-[#18151f]'
        }`}
      >
        <img
          src={posterImg}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Specular Liquid Glass Refraction Sheen */}
        <div className="gel-sheen opacity-75 group-hover:opacity-95 transition-opacity" />
        <div className="gel-crescent opacity-60" />

        {/* Ambient Darkened Gradient at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges (Rating + 4K HDR Gel Capsules) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full gel-badge text-[#2e1c24] backdrop-blur-md shadow-sm">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            {rating}
          </span>

          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full gel-pink text-white shadow-md">
            4K HDR
          </span>
        </div>

        {/* Center 3D Skeuomorphic Pink Gel Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
          <div className="w-13 h-13 rounded-full gel-pink text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-2xl">
            <div className="gel-sheen" />
            <Play className="w-5 h-5 fill-white ml-0.5 drop-shadow" />
          </div>
        </div>

        {/* Action Overlay Bottom */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          {/* Bookmark Gel Capsule */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isBookmarked
                ? 'gel-pink text-white'
                : 'gel-white text-stone-800'
            }`}
          >
            {isBookmarked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Clean Popup Window Capsule */}
          <button
            type="button"
            onClick={handleOpenPopup}
            title="Open in Clean 4K Pop-Up Window"
            className="px-2 py-1 rounded-full gel-cream text-stone-900 text-[9px] font-black flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3 h-3 text-rose-600" />
            <span>POPUP</span>
          </button>

          {/* Direct Download Capsule */}
          <button
            type="button"
            onClick={handleDownloadClick}
            title="Download Movie (1080p/4K)"
            className="w-7 h-7 rounded-full gel-white text-stone-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-stone-800 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Meta Title & Action Under Card */}
      <div className="mt-2.5 px-1">
        <h3 
          onClick={handleCardClick}
          className="text-xs sm:text-sm font-extrabold truncate cursor-pointer transition-colors text-inherit hover:text-rose-500"
          title={title}
        >
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-1 text-[11px] opacity-75 font-semibold">
          <span>{year || '2025'} • {mediaType === 'movie' ? 'Movie' : 'TV Series'}</span>
          
          <button
            type="button"
            onClick={handleCardClick}
            className="text-[9px] font-black px-2 py-0.5 rounded-full gel-pink text-white hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            WATCH
          </button>
        </div>
      </div>
    </div>
  );
};
