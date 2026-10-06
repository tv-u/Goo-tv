import React from 'react';
import { Play, Star, Plus, Check, Info, ExternalLink, Download } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onDetails?: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  aspectRatio?: 'poster' | 'backdrop';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPlay,
  onDetails,
  onDownload,
  aspectRatio = 'poster',
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const isBookmarked = isInWatchlist(item.id);
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

  const posterImg = aspectRatio === 'poster' 
    ? getImageUrl(item.poster_path, 'w500')
    : getImageUrl(item.backdrop_path || item.poster_path, 'w780');

  // Direct clean popup streaming URL (Zero sandbox, 100% unrestricted playback)
  const popupStreamUrl = mediaType === 'tv'
    ? `https://multiembed.mov/?video_id=${item.id}&tmdb=1&s=1&e=1`
    : `https://multiembed.mov/?video_id=${item.id}&tmdb=1`;

  const handleOpenPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    const width = Math.min(window.screen.width * 0.9, 1280);
    const height = Math.min(window.screen.height * 0.85, 720);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      popupStreamUrl,
      'GooTVCleanPopup',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=no`
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(popupStreamUrl, '_blank', 'noopener,noreferrer');
    } else {
      popup.focus();
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(item);
    } else {
      const dlUrl = `https://multiembed.mov/direct-download?id=${item.id}&quality=1080p`;
      window.open(dlUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 transition-all duration-300 ease-out select-none flex flex-col justify-between">
      
      {/* Poster Container */}
      <div 
        onClick={() => onPlay(item)}
        className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#181a24] shadow-md group-hover:shadow-2xl group-hover:shadow-red-950/40 border border-white/5 group-hover:border-red-500/50 transition-all duration-300 cursor-pointer transform group-hover:-translate-y-1"
      >
        <img
          src={posterImg}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges (Rating + Quality) */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
          {rating ? (
            <span className="flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30 shadow">
              <Star className="w-3 h-3 fill-amber-400" />
              {rating}
            </span>
          ) : (
            <span className="uppercase text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-gray-200 border border-white/10">
              {mediaType === 'movie' ? 'Movie' : 'Series'}
            </span>
          )}

          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-600/90 text-white shadow">
            4K HDR
          </span>
        </div>

        {/* Center Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/60 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Action Overlay Bottom */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isBookmarked) {
                  removeFromWatchlist(item.id);
                } else {
                  addToWatchlist(item);
                }
              }}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-1.5 rounded-lg backdrop-blur-md border text-xs transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-black/60 border-white/20 text-white hover:bg-red-600 hover:border-red-600'
              }`}
            >
              {isBookmarked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            {/* Direct Clean Popup Window button */}
            <a
              href={popupStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenPopup}
              title="Open in Clean Popup Window (Zero Sandbox)"
              className="p-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/50 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Download Button in Overlay */}
            <button
              type="button"
              onClick={handleDownloadClick}
              title="Download 4K / 1080p / 720p"
              className="p-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 border border-blue-400/50 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {onDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDetails(item);
              }}
              title="Details & Episodes"
              className="p-1.5 rounded-lg bg-black/60 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="mt-2.5 px-0.5">
        <h3 
          onClick={() => onPlay(item)}
          className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate cursor-pointer"
        >
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            {year && <span>{year}</span>}
            <span>•</span>
            <span className="text-gray-300 uppercase text-[10px] font-semibold">
              {mediaType === 'movie' ? 'Movie' : 'TV'}
            </span>
          </span>

          <div className="flex items-center gap-1">
            {/* Direct Download Button */}
            <button
              onClick={handleDownloadClick}
              title="Download (4K, 1080p, 720p)"
              className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 transition-all cursor-pointer flex items-center gap-0.5"
            >
              <Download className="w-2.5 h-2.5" />
              <span>DL</span>
            </button>

            {/* Direct Clean Popup Window Link */}
            <a
              href={popupStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenPopup}
              title="Play in Clean Popup Window (100% Unblocked)"
              className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-0.5"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span>POPUP</span>
            </a>

            {/* In-Modal Watch Button */}
            <button
              onClick={() => onPlay(item)}
              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all cursor-pointer"
            >
              WATCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
