import React from 'react';
import { Home, Film, Tv, Compass, Bookmark, Server } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenWatchlist: () => void;
  onOpenServers: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenWatchlist,
  onOpenServers,
}) => {
  const { watchlist, history } = useWatchlist();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => onSelectTab('home') },
    { id: 'movies', label: 'Movies', icon: Film, action: () => onSelectTab('movies') },
    { id: 'tv', label: 'Series', icon: Tv, action: () => onSelectTab('tv') },
    { id: 'bollywood', label: 'Hindi', icon: Compass, action: () => onSelectTab('bollywood') },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0c0d14]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-red-500 font-extrabold scale-105'
                  : 'text-gray-400 hover:text-white font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-500 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Watchlist with Live Badge */}
        <button
          onClick={onOpenWatchlist}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
          aria-label="Open Watchlist"
        >
          <div className="relative">
            <Bookmark className="w-5 h-5 stroke-[1.8]" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0c0d14]">
                {watchlist.length > 9 ? '9+' : watchlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Saved</span>
        </button>

        {/* 20 Servers Status Button */}
        <button
          onClick={onOpenServers}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
          aria-label="Open Servers"
        >
          <div className="relative">
            <Server className="w-5 h-5 stroke-[1.8] text-emerald-400" />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight text-emerald-400 font-bold">Servers</span>
        </button>
      </div>
    </nav>
  );
};
