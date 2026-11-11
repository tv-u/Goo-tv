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
  Globe2,
  ChevronDown,
  Layers,
  Volume2,
  VolumeX,
  Palette
} from 'lucide-react';
import { MediaItem } from '../types/movie';
import { advancedSearchMedia, getImageUrl, GOO_TV_CATEGORIES } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { STREAMING_SERVERS } from '../services/servers';
import { playGelPop, playGlassPing } from '../utils/gelSound';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onSelectMedia: (item: MediaItem) => void;
  onOpenWatchlist: () => void;
  onOpenHistory: () => void;
  onOpenServersList: () => void;
  onSearchSubmit?: (query: string) => void;
  theme?: 'pastel' | 'dark';
  onToggleTheme?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onSelectMedia,
  onOpenWatchlist,
  onOpenHistory,
  onOpenServersList,
  onSearchSubmit,
  theme = 'pastel',
  onToggleTheme,
  isMuted = false,
  onToggleMute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [detectedIntent, setDetectedIntent] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { watchlist, history, preferredServer } = useWatchlist();
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const currentServerObj = STREAMING_SERVERS.find((s) => s.id === preferredServer) || STREAMING_SERVERS[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setShowCategoriesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced real-time Advanced Semantic search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setDetectedIntent('');
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await advancedSearchMedia(searchQuery, 1);
        setSearchResults((data.results || []).slice(0, 8));
        setDetectedIntent(data.detectedIntent || 'Smart Results');
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTriggerFullSearch = (q = searchQuery) => {
    const term = q.trim();
    if (!term) return;
    playGelPop(600, 'sine');
    setShowSearchDropdown(false);
    if (onSearchSubmit) {
      onSearchSubmit(term);
    } else {
      onSelectTab('search');
    }
  };

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
          ? 'py-2 px-3 sm:px-6'
          : 'py-3.5 px-3 sm:px-6'
      }`}
    >
      {/* Floating 3D Liquid Glassmorphic Navigation Bar */}
      <div className={`max-w-7xl mx-auto rounded-[28px] sm:rounded-full px-4 sm:px-6 py-2.5 transition-all ${
        theme === 'pastel'
          ? 'liquid-glass-plate'
          : 'liquid-glass-plate-dark'
      }`}>
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo (3D Pink Gel Squircle) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                playGelPop(520, 'sine');
                onSelectTab('home');
              }}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl gel-pink flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                <div className="gel-sheen" />
                <Film className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-xl tracking-tight ${theme === 'pastel' ? 'text-[#2e1c24]' : 'text-white'}`}>
                    GOO <span className="text-rose-600">TV</span>
                  </span>
                  <span className="gel-pink text-[9px] font-black text-white px-2 py-0.5 rounded-full shadow-sm">
                    3D VIP
                  </span>
                </div>
                <p className="text-[10px] font-bold opacity-60 -mt-0.5 hidden sm:block">
                  20 Live Servers • 4K HDR
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      playGelPop(500, 'sine');
                      onSelectTab(link.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'gel-pink text-white shadow-md'
                        : theme === 'pastel'
                          ? 'text-stone-800 hover:gel-cream'
                          : 'text-stone-200 hover:gel-obsidian'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {/* 🎬 12 Channels Dropdown */}
              <div ref={categoriesRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    playGelPop(480, 'sine');
                    setShowCategoriesDropdown(!showCategoriesDropdown);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    showCategoriesDropdown || GOO_TV_CATEGORIES.some((c) => c.id === currentTab)
                      ? 'gel-pink text-white shadow-md'
                      : theme === 'pastel'
                        ? 'gel-cream text-stone-900 shadow-sm'
                        : 'gel-obsidian text-stone-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Channels</span>
                  <span className="bg-white/30 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    12
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoriesDropdown && (
                  <div className={`absolute top-full mt-3 left-0 w-80 rounded-[24px] shadow-2xl p-2.5 z-50 grid grid-cols-1 gap-1 max-h-[460px] overflow-y-auto scrollbar-none animate-fadeIn ${
                    theme === 'pastel' ? 'liquid-glass-plate' : 'liquid-glass-plate-dark'
                  }`}>
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider opacity-60 flex items-center justify-between border-b border-black/5">
                      <span>GOO TV Channels</span>
                      <span className="text-rose-500 font-bold">12 Catalogs</span>
                    </div>
                    {GOO_TV_CATEGORIES.map((cat) => {
                      const isCatActive = currentTab === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            playGelPop(560, 'sine');
                            onSelectTab(cat.id);
                            setShowCategoriesDropdown(false);
                            window.location.hash = `#category-${cat.id}`;
                          }}
                          className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                            isCatActive
                              ? 'gel-pink text-white shadow-md'
                              : 'hover:bg-white/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{cat.flag}</span>
                            <span>{cat.name}</span>
                          </div>
                          {cat.badge && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-white/40">
                              {cat.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Search + Server Status + Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Search Bar (3D Glass Inset Capsule) */}
            <div ref={searchRef} className="relative w-36 sm:w-60 md:w-72">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTriggerFullSearch();
                }}
                className="relative"
              >
                <button
                  type="submit"
                  title="Search movies & series"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-500 hover:text-rose-600 cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
                <input
                  type="text"
                  placeholder="Search 4K movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                  className={`w-full rounded-full pl-9 pr-8 py-1.5 text-xs sm:text-sm font-semibold placeholder:opacity-60 focus:outline-none transition-all shadow-inner ${
                    theme === 'pastel'
                      ? 'bg-white/60 text-[#2e1c24] border border-white/80 focus:bg-white'
                      : 'bg-black/40 text-white border border-white/10 focus:bg-black/60'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && (
                <div className={`absolute top-full mt-3 w-76 sm:w-88 right-0 rounded-[24px] shadow-2xl overflow-hidden z-50 p-2 ${
                  theme === 'pastel' ? 'liquid-glass-plate' : 'liquid-glass-plate-dark'
                }`}>
                  <div className="p-2 border-b border-black/5 flex items-center justify-between text-[11px] font-bold opacity-75">
                    <span className="truncate max-w-[200px]">
                      {isSearching ? 'Analyzing...' : detectedIntent || `Found ${searchResults.length} results`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTriggerFullSearch()}
                      className="text-rose-600 hover:underline font-black cursor-pointer"
                    >
                      Explore →
                    </button>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-black/5">
                    {searchResults.map((item) => {
                      const title = item.title || item.name || 'Untitled';
                      const year = (item.release_date || item.first_air_date || '').slice(0, 4);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            playGelPop(540, 'sine');
                            onSelectMedia(item);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-white/40 rounded-xl transition-colors cursor-pointer group"
                        >
                          <img
                            src={getImageUrl(item.poster_path, 'w300')}
                            alt={title}
                            className="w-9 h-13 object-cover rounded-xl flex-shrink-0 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black truncate group-hover:text-rose-600 transition-colors">{title}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] opacity-70 font-semibold">
                              <span className="uppercase px-1.5 py-0.2 rounded-full gel-badge">
                                {item.media_type || (item.title ? 'Movie' : 'TV')}
                              </span>
                              {year && <span>{year}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Server Selector Button (3D Cream Gel Capsule) */}
            <button
              onClick={() => {
                playGelPop(500, 'sine');
                onOpenServersList();
              }}
              title="20 Streaming Servers"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full gel-cream text-stone-900 text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="gel-sheen" />
              <Server className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">{currentServerObj.name.split(' ')[0]}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Watchlist Button (3D Gel Capsule with Badge) */}
            <button
              onClick={() => {
                playGelPop(520, 'sine');
                onOpenWatchlist();
              }}
              title="My Watchlist"
              className="relative p-2 rounded-full gel-cream text-stone-900 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="gel-sheen" />
              <Bookmark className="w-4 h-4 stroke-[2.5]" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full gel-pink text-white text-[9px] font-black flex items-center justify-center shadow">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* Theme Toggle (🌸 Pastel Pink Gel vs ✨ Obsidian Dark Glass) */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  playGlassPing();
                  onToggleTheme();
                }}
                title={theme === 'pastel' ? 'Switch to Dark Obsidian Glass' : 'Switch to Pastel Pink Gel'}
                className="p-2 rounded-full gel-white text-stone-900 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Palette className="w-4 h-4 text-rose-600 stroke-[2.5]" />
              </button>
            )}

            {/* Audio Feedback Toggle */}
            {onToggleMute && (
              <button
                onClick={() => {
                  playGelPop(600, 'triangle');
                  onToggleMute();
                }}
                title={isMuted ? 'Unmute 3D Gel Clicks' : 'Mute 3D Gel Clicks'}
                className="hidden sm:flex p-2 rounded-full gel-white text-stone-900 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 opacity-50" /> : <Volume2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full gel-cream text-stone-900 shadow-md cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-black/10 grid grid-cols-2 gap-2 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    playGelPop(500, 'sine');
                    onSelectTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-black transition-all ${
                    isActive ? 'gel-pink text-white shadow-md' : 'gel-cream text-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
