import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { MediaCard } from './MediaCard';
import { playGelPop } from '../utils/gelSound';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  icon?: LucideIcon;
  badge?: string;
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onViewAll?: () => void;
  theme?: 'pastel' | 'dark';
}

export const MediaRow: React.FC<MediaRowProps> = ({
  title,
  items,
  icon: Icon,
  badge,
  onPlayMedia,
  onOpenDetails,
  onDownload,
  onViewAll,
  theme = 'pastel',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    playGelPop(direction === 'left' ? 440 : 540, 'sine');
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative my-7 sm:my-9 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/row">
      {/* 3D Glass Row Header Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-2 rounded-2xl flex items-center justify-center shadow-md ${
              theme === 'pastel' ? 'gel-cream text-rose-600' : 'gel-obsidian text-rose-400'
            }`}>
              <div className="gel-sheen" />
              <Icon className="w-4 h-4 stroke-[2.5]" />
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2.5">
            <span>{title}</span>
            {badge && (
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full gel-pink text-white shadow-md">
                {badge}
              </span>
            )}
          </h2>
        </div>

        {/* 3D Skeuomorphic Navigation Controls */}
        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={() => {
                playGelPop(600, 'sine');
                onViewAll();
              }}
              className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors mr-2 cursor-pointer flex items-center gap-1"
            >
              <span>Explore All</span>
              <span>→</span>
            </button>
          )}

          {/* Left Arrow Button (3D Gel Squircle) */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-8.5 h-8.5 rounded-full gel-cream text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-90"
          >
            <div className="gel-sheen" />
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button (3D Gel Squircle) */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-8.5 h-8.5 rounded-full gel-cream text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-90"
          >
            <div className="gel-sheen" />
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Row Horizontal Scroller with 3D Squircle Cards */}
      <div
        ref={rowRef}
        className="flex items-start gap-3.5 sm:gap-4.5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onPlay={onPlayMedia}
            onDetails={onOpenDetails}
            onDownload={onDownload}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
