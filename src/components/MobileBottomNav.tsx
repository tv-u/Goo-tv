import React from 'react';
import { Home, Film, Tv, Layers, Bookmark } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { playGelPop } from '../utils/gelSound';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenWatchlist: () => void;
  onOpenServers?: () => void;
  theme?: 'pastel' | 'dark';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenWatchlist,
  theme = 'pastel',
}) => {
  const { watchlist } = useWatchlist();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => onSelectTab('home') },
    { id: 'hindi_movies', label: '12 Channels', icon: Layers, action: () => onSelectTab('hindi_movies') },
    { id: 'movies', label: 'Movies', icon: Film, action: () => onSelectTab('movies') },
    { id: 'tv', label: 'Series', icon: Tv, action: () => onSelectTab('tv') },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-3 left-4 right-4 z-40 md:hidden"
    >
      {/* 3D Liquid Glassmorphic Floating Capsule */}
      <div className={`rounded-full px-2 py-1.5 shadow-2xl ${
        theme === 'pastel' ? 'liquid-glass-plate' : 'liquid-glass-plate-dark'
      }`}>
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playGelPop(520, 'sine');
                  item.action();
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'gel-pink text-white shadow-md scale-105'
                    : 'text-stone-700 hover:text-stone-950 font-semibold'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span className="text-[9px] mt-0.5 font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* Watchlist with Live Badge */}
          <button
            onClick={() => {
              playGelPop(540, 'sine');
              onOpenWatchlist();
            }}
            className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-stone-700 hover:text-stone-950 transition-all cursor-pointer font-semibold"
            aria-label="Watchlist"
          >
            <div className="relative">
              <Bookmark className="w-4.5 h-4.5 stroke-[2]" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full gel-pink text-white text-[8px] font-black flex items-center justify-center shadow">
                  {watchlist.length}
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5 font-bold tracking-tight">Saved</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
