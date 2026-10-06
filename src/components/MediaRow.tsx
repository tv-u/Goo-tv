import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { MediaItem } from '../types/movie';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  icon?: LucideIcon;
  badge?: string;
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onViewAll?: () => void;
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
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
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
    <div className="relative my-8 sm:my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {title}
            {badge && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-red-400 border border-white/10">
                {badge}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors mr-2 cursor-pointer"
            >
              Explore All →
            </button>
          )}

          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Horizontal Scroller */}
      <div
        ref={rowRef}
        className="flex items-start gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onPlay={onPlayMedia}
            onDetails={onOpenDetails}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};
