import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Search,
  Bookmark,
  History,
  Menu,
  X,
  Server,
  Star,
  Tv,
  Clapperboard,
  Sparkles,
  Flame,
  Globe2
} from 'lucide-react';
import { MediaItem } from '../types/movie';
import { searchSmartMedia, getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { STREAMING_SERVERS } from '../services/servers';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onSelectMedia: (item: MediaItem) => void;
  onOpenWatchlist: () => void;
  onOpenHistory: () => void;
  onOpenServersList: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onSelectMedia,
  onOpenWatchlist,
  onOpenHistory,
  onOpenServersList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { watchlist, history, preferredServer } = useWatchlist();
  const searchRef = useRef<HTMLDivElement>(null);

  const currentServerObj = STREAMING_SERVERS.find((s) => s.id === preferredServer) || STREAMING_SERVERS[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced real-time TMDB search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchSmartMedia(searchQuery, 1);
        setSearchResults(data.results.slice(0, 7));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'movies', label: 'Movies', icon: Clapperboard },
    { id: 'tv', label: 'TV Series', icon: Tv },
    { id: 'bollywood', label: 'Bollywood', icon: Flame },
    { id: 'anime', label: 'Anime', icon: Globe2 },
    { id: 'top_rated', label: 'Top Rated', icon: Star },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/80 py-2.5'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/30 group-hover:shadow-red-600/60 transition-all">
                <div className="w-full h-full bg-[#0d0e15] rounded-[10px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                    GOO <span className="text-red-600">TV</span>
                  </span>
                  <span className="bg-gradient-to-r from-amber-500 to-red-500 text-[10px] font-black text-black px-1.5 py-0.5 rounded shadow">
                    VIP
                  </span>
                </div>
                <p className="text-[10px] font-medium text-gray-400 -mt-1 hidden sm:block">
                  20 Real Live Servers • 4K HDR
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onSelectTab(link.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-red-600/20 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search + Server Status + Controls */}
          <div className="flex items-center gap-3">

            {/* Live Search Bar */}
            <div ref={searchRef} className="relative w-44 sm:w-64 md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search movies, KDrama, Hindi dubbed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/10 focus:ring-1 focus:ring-red-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full mt-2 w-72 sm:w-80 right-0 sm:left-0 sm:right-auto bg-[#13151f] border border-white/10 rounded-2xl shadow-2xl shadow-black overflow-hidden z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{isSearching ? 'Searching TMDB...' : `Found ${searchResults.length} results`}</span>
                    <span className="text-red-400 font-semibold">Live Real-time</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {searchResults.length === 0 && !isSearching ? (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No movies or shows found for &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      searchResults.map((item) => {
                        const title = item.title || item.name || 'Untitled';
                        const year = (item.release_date || item.first_air_date || '').slice(0, 4);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              onSelectMedia(item);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2.5 hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <img
                              src={getImageUrl(item.poster_path, 'w300')}
                              alt={title}
                              className="w-10 h-14 object-cover rounded-md flex-shrink-0 bg-gray-800"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">{title}</p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                                <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                                  {item.media_type || (item.title ? 'Movie' : 'TV')}
                                </span>
                                {year && <span>{year}</span>}
                                <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Server Status Switcher Button */}
            <button
              onClick={onOpenServersList}
              title="Select Active Streaming Server"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-emerald-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Server className="w-3.5 h-3.5" />
              <span className="hidden md:inline truncate max-w-[100px]">{currentServerObj.name.split(' ')[0]}</span>
              <span className="bg-emerald-500/20 text-[10px] px-1 py-0.2 rounded font-bold">20 Online</span>
            </button>

            {/* Watchlist Quick Button */}
            <button
              onClick={onOpenWatchlist}
              title="Your Watchlist"
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {watchlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* History Quick Button */}
            <button
              onClick={onOpenHistory}
              title="Recent Watch History"
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                onOpenServersList();
                setMobileMenuOpen(false);
              }}
              className="col-span-2 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>20 Streaming Servers Configured</span>
              </div>
              <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">ACTIVE</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
