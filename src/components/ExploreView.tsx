import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RotateCw, 
  Film, 
  Tv, 
  ChevronDown, 
  Sparkles, 
  ChevronRight, 
  RefreshCcw, 
  Search, 
  X, 
  Compass, 
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { MediaItem } from '../types/movie';
import { 
  discoverMedia, 
  fetchBollywood, 
  fetchAnime, 
  fetchTopRatedMovies, 
  advancedSearchMedia,
  fetchGooTvCategory,
  GOO_TV_CATEGORIES,
  GooTvCategoryDef,
  deduplicateMediaItems,
  MOVIE_GENRES, 
  TV_GENRES 
} from '../services/tmdb';
import { MediaCard } from './MediaCard';
import { AdsterraAdBanner } from './AdsterraAdBanner';

interface ExploreViewProps {
  initialType?: string;
  initialCategory?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialType = 'movie',
  initialCategory,
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  onPlayMedia,
  onOpenDetails,
  onDownload,
  onCategorySelect,
}) => {
  // Determine starting category from URL hash, props, or defaults
  const getStartingCategory = (): string => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#category-')) {
      const parts = window.location.hash.replace('#category-', '').split('-');
      return parts[0] || 'hindi_movies';
    }
    if (initialCategory) return initialCategory;
    if (initialType === 'bollywood') return 'hindi_movies';
    if (initialType === 'movies') return 'english_movies';
    if (initialType === 'punjabi') return 'punjabi_movies';
    if (initialType === 'south') return 'south_movies';
    if (initialType === 'classic') return 'classic_movies';
    if (initialType === 'hindi_dubbed') return 'hindi_dubbed_movies';
    if (initialType === 'kdrama') return 'kdrama';
    if (initialType === 'kdrama_hindi') return 'kdrama_hindi';
    if (initialType === 'hbo') return 'hbo_movies';
    if (initialType === 'netflix') return 'netflix_movies';
    if (initialType === 'jiohotstar') return 'jiohotstar_movies';
    if (initialType === 'mxplayer') return 'mxplayer_movies';
    if (initialType === 'anime') return 'anime';
    if (initialType === 'tv') return 'tv';
    if (initialType === 'top_rated') return 'top_rated';
    return 'hindi_movies';
  };

  const getStartingSouthSubFilter = (): string => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#category-south_movies-')) {
      return window.location.hash.replace('#category-south_movies-', '') || 'all';
    }
    return 'all';
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(getStartingCategory());
  const [southSubFilter, setSouthSubFilter] = useState<string>(getStartingSouthSubFilter());
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>(
    selectedCategory === 'kdrama' || selectedCategory === 'kdrama_hindi' || selectedCategory === 'tv' || selectedCategory === 'anime' 
      ? 'tv' 
      : 'movie'
  );
  const [currentSearch, setCurrentSearch] = useState<string>(searchQuery);
  const [detectedIntent, setDetectedIntent] = useState<string>('');
  const [genre, setGenre] = useState<string>('all');
  const [year, setYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [minRating, setMinRating] = useState<number>(0);
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [autoInfiniteScroll, setAutoInfiniteScroll] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Sync hash changes (Browser Back / Forward / Direct Link)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#category-')) {
        const withoutPrefix = hash.replace('#category-', '');
        if (withoutPrefix.startsWith('south_movies-')) {
          setSelectedCategory('south_movies');
          setSouthSubFilter(withoutPrefix.replace('south_movies-', ''));
        } else {
          setSelectedCategory(withoutPrefix);
        }
        setCurrentSearch('');
      } else if (hash.startsWith('#search-')) {
        const q = decodeURIComponent(hash.replace('#search-', ''));
        if (q) setCurrentSearch(q);
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Sync when search query or initialType prop changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentSearch(searchQuery);
      setPage(1);
    }
  }, [searchQuery]);

  // Main Data Loading Pipeline (Category -> Real TMDB metadata query -> Dedupe -> Pagination)
  const loadData = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let result;

      if (currentSearch.trim()) {
        // Advanced semantic search with never-blank guarantee
        const searchRes = await advancedSearchMedia(
          currentSearch.trim(), 
          pageNum, 
          mediaType === 'movie' ? 'movie' : 'tv'
        );
        result = searchRes;
        setDetectedIntent(searchRes.detectedIntent || 'Smart Results');
      } else {
        // 12 NEW GOO TV CATEGORIES & Legacy Modes with Real Metadata Filtering
        const matchedCategory = GOO_TV_CATEGORIES.find((c) => c.id === selectedCategory);

        if (matchedCategory) {
          result = await fetchGooTvCategory(selectedCategory, pageNum, southSubFilter);
        } else if (selectedCategory === 'anime') {
          result = await fetchAnime(pageNum);
        } else if (selectedCategory === 'top_rated') {
          result = await fetchTopRatedMovies(pageNum);
        } else if (selectedCategory === 'tv') {
          result = await discoverMedia({
            mediaType: 'tv',
            page: pageNum,
            genre: genre === 'all' ? undefined : genre,
            year: year || undefined,
            sortBy,
            minRating: minRating > 0 ? minRating : undefined,
          });
        } else {
          result = await discoverMedia({
            mediaType,
            page: pageNum,
            genre: genre === 'all' ? undefined : genre,
            year: year || undefined,
            sortBy,
            minRating: minRating > 0 ? minRating : undefined,
          });
        }
      }

      const rawResults = result.results || [];
      const upstreamTotalPages = result.total_pages || 1;

      setTotalPages(upstreamTotalPages);
      setItems((prev) => {
        const combined = append ? [...prev, ...rawResults] : rawResults;
        return deduplicateMediaItems(combined);
      });
    } catch (err) {
      console.error('Failed to discover media for category', selectedCategory, err);
      if (!append) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentSearch, selectedCategory, southSubFilter, mediaType, genre, year, sortBy, minRating]);

  // Trigger data load on filter/category changes
  useEffect(() => {
    setPage(1);
    loadData(1, false);
  }, [loadData]);

  // Handle Category Switching (with URL Hash persistence)
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentSearch('');
    setPage(1);
    
    // Auto-align media type
    if (catId === 'kdrama' || catId === 'kdrama_hindi' || catId === 'tv') {
      setMediaType('tv');
    } else {
      setMediaType('movie');
    }

    // Persist in URL hash
    const newHash = catId === 'south_movies' && southSubFilter !== 'all' 
      ? `#category-south_movies-${southSubFilter}` 
      : `#category-${catId}`;
    window.location.hash = newHash;

    if (onCategorySelect) onCategorySelect(catId);
    if (onClearSearch) onClearSearch();
  };

  // Handle South Movies Sub-filter Switching
  const handleSelectSouthSub = (subId: string) => {
    setSouthSubFilter(subId);
    setPage(1);
    const newHash = subId === 'all' ? '#category-south_movies' : `#category-south_movies-${subId}`;
    window.location.hash = newHash;
  };

  // Handle Load More (Real upstream pagination; stops when page >= totalPages)
  const handleLoadMore = useCallback(() => {
    if (page < totalPages && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, true);
    }
  }, [page, totalPages, loadingMore, loading, loadData]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!autoInfiniteScroll) return;

    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingMore && !loading && items.length > 0 && page < totalPages) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [autoInfiniteScroll, handleLoadMore, loadingMore, loading, items.length, page, totalPages]);

  // Scroll to Top Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setGenre('all');
    setYear('');
    setSortBy('popularity.desc');
    setMinRating(0);
    setQualityFilter('all');
    setPage(1);
  };

  // Search Presets
  const searchPresets = [
    'KDrama Hindi Dubbed',
    'Anime Hindi Dubbed',
    'Bollywood 2026',
    'South Indian Dubbed',
    'Action Movies 2026',
    'Hollywood Hindi Dubbed',
    'Romantic K-Drama',
    'Marvel Cinematic Universe',
  ];

  const handleApplyKeyword = (kw: string) => {
    setCurrentSearch(kw);
    setPage(1);
    window.location.hash = `#search-${encodeURIComponent(kw)}`;
    if (onSearchChange) onSearchChange(kw);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSearch.trim()) {
      setPage(1);
      window.location.hash = `#search-${encodeURIComponent(currentSearch.trim())}`;
      if (onSearchChange) onSearchChange(currentSearch.trim());
      loadData(1, false);
    }
  };

  const currentGenres = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  const currentCatDef = GOO_TV_CATEGORIES.find((c) => c.id === selectedCategory);

  const getPageTitle = () => {
    if (currentSearch.trim()) {
      return `Search: "${currentSearch}"`;
    }
    if (currentCatDef) {
      if (selectedCategory === 'south_movies' && southSubFilter !== 'all') {
        const sub = currentCatDef.subFilters?.find((s) => s.id === southSubFilter);
        return `${currentCatDef.name} — ${sub?.label || southSubFilter.toUpperCase()}`;
      }
      return currentCatDef.name;
    }
    switch (selectedCategory) {
      case 'anime':
        return 'Anime & Japanese Animation';
      case 'top_rated':
        return 'IMDb Top Rated Masterpieces';
      case 'tv':
        return 'TV Series & Shows';
      default:
        return 'Unlimited Movies Catalog';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">
      
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <span>GOO TV</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span>Categories</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-red-400 font-bold">{getPageTitle()}</span>
      </nav>

      {/* 🎬 12 NEW GOO TV CATEGORIES RESPONSIVE NAVIGATOR */}
      <div className="mb-6 bg-[#0e1019] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>GOO TV Categories</span>
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                  12 CHANNELS
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Real TMDB metadata • Zero fake titles • Instant auto-server playback
              </p>
            </div>
          </div>

          <span className="text-[11px] text-gray-400 font-medium">
            Active: <span className="text-white font-bold">{getPageTitle()}</span>
          </span>
        </div>

        {/* Category Carousel / Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {GOO_TV_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id && !currentSearch.trim();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 border border-red-400 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                }`}
                title={cat.description}
              >
                <span className="text-sm">{cat.flag}</span>
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold ml-0.5 ${
                    isActive ? 'bg-black/40 text-amber-300' : 'bg-white/10 text-gray-400'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* South Movies Sub-Filters (Tamil, Telugu, Malayalam, Kannada) */}
        {selectedCategory === 'south_movies' && !currentSearch.trim() && (
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs animate-fadeIn">
            <span className="text-amber-400 font-bold text-[11px] flex-shrink-0 flex items-center gap-1">
              <span>🌴 South Languages:</span>
            </span>
            {[
              { id: 'all', label: 'All South Indian' },
              { id: 'ta', label: 'Tamil (Kollywood)' },
              { id: 'te', label: 'Telugu (Tollywood)' },
              { id: 'ml', label: 'Malayalam (Mollywood)' },
              { id: 'kn', label: 'Kannada (Sandalwood)' },
            ].map((sub) => {
              const isSubActive = southSubFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSouthSub(sub.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 ${
                    isSubActive
                      ? 'bg-amber-500 text-black shadow-md font-black'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Search & Keyword Command Bar */}
      <div className="bg-[#10121b] border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search across all categories (e.g. 'kdrama hindki dubbed', 'avengers hindi', 'action 2026')..."
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/10 focus:ring-1 focus:ring-red-500 transition-all"
            />
            {currentSearch && (
              <button
                type="button"
                onClick={() => {
                  setCurrentSearch('');
                  if (onClearSearch) onClearSearch();
                  window.location.hash = `#category-${selectedCategory}`;
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Keyword Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-bold text-[11px] flex-shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-red-500" />
            Trending Tags:
          </span>
          {searchPresets.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleApplyKeyword(kw)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                currentSearch.toLowerCase() === kw.toLowerCase()
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Detected Intent & Status Bar */}
        {detectedIntent && (
          <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white">Smart Match:</span>
              <span className="text-amber-400 font-medium">{detectedIntent}</span>
            </div>
            <span className="text-gray-400 hidden sm:inline">Never Blank Guarantee • Upstream TMDB Sync</span>
          </div>
        )}
      </div>

      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{getPageTitle()}</span>
              {currentCatDef && <span className="text-2xl">{currentCatDef.flag}</span>}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {currentSearch.trim()
              ? `Showing smart continuous results for "${currentSearch}" across 20 servers`
              : currentCatDef?.description || 'Browse unlimited titles with instant 20-server auto-sync streaming'}
          </p>
        </div>

        {/* Media Type Switcher (Movie vs TV) */}
        {!['kdrama', 'kdrama_hindi', 'anime'].includes(selectedCategory) && (
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => {
                setMediaType('movie');
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mediaType === 'movie'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Movies
            </button>
            <button
              onClick={() => {
                setMediaType('tv');
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mediaType === 'tv'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              TV Shows
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters Toolbar */}
      <div className="my-6 bg-[#131522] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* Genre Selector */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Genre
          </label>
          <div className="relative">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
            >
              <option value="all" className="bg-[#131522] text-white">All Genres</option>
              {currentGenres.map((g) => (
                <option key={g.id} value={g.id} className="bg-[#131522] text-white">
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Release Year */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Release Year
          </label>
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#131522] text-white">All Years</option>
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2015', '2010', '2000', '1995', '1990'].map((y) => (
                <option key={y} value={y} className="bg-[#131522] text-white">
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Quality Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Quality
          </label>
          <div className="relative">
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
            >
              <option value="all" className="bg-[#131522] text-white">All Qualities</option>
              <option value="4k" className="bg-[#131522] text-white">4K Ultra HD (HDR)</option>
              <option value="1080p" className="bg-[#131522] text-white">1080p Full HD</option>
              <option value="720p" className="bg-[#131522] text-white">720p HD</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Sort Order
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
            >
              <option value="popularity.desc" className="bg-[#131522] text-white">Most Popular</option>
              <option value="vote_average.desc" className="bg-[#131522] text-white">Top Rated</option>
              <option value="primary_release_date.desc" className="bg-[#131522] text-white">Latest Releases</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Min Score Rating */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Minimum Rating
          </label>
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none"
            >
              <option value={0} className="bg-[#131522] text-white">Any Rating</option>
              <option value={8} className="bg-[#131522] text-white">⭐ 8.0+ Masterpieces</option>
              <option value={7} className="bg-[#131522] text-white">⭐ 7.0+ High Quality</option>
              <option value={6} className="bg-[#131522] text-white">⭐ 6.0+ Good Watch</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats & Auto-Load Toggle */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1">
        <span className="flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          Loaded {items.length} titles (Upstream Page {page} of {totalPages})
        </span>

        <div className="flex items-center gap-2">
          {(genre !== 'all' || year !== '' || minRating > 0 || qualityFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCcw className="w-3 h-3 text-red-400" />
              Reset Filters
            </button>
          )}

          <button
            onClick={() => setAutoInfiniteScroll(!autoInfiniteScroll)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              autoInfiniteScroll
                ? 'bg-red-600/20 border-red-500/40 text-red-400'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            <span>Auto-Scroll: {autoInfiniteScroll ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Sponsored VIP Banner in Catalog */}
      <AdsterraAdBanner format="native_bar" className="mb-6" />

      {/* Grid of Movies/Shows or Empty/Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-8">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse flex flex-col justify-end p-3 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-white/5 border border-white/10 rounded-2xl p-8 my-6">
          <Film className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No matching titles found in TMDB metadata for {getPageTitle()}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Zero fake content generated. TMDB currently has no indexed items for this specific filter set. Try selecting another category or resetting filters.
          </p>
          <button
            onClick={() => handleSelectCategory('hindi_movies')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Explore Hindi Movies</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex justify-center">
                <MediaCard
                  item={item}
                  onPlay={onPlayMedia}
                  onDetails={onOpenDetails}
                  onDownload={onDownload}
                />
              </div>
            ))}
          </div>

          {/* Sentinel Element for IntersectionObserver */}
          <div ref={bottomSentinelRef} className="h-10 w-full" />

          {/* Load More Button & Real Pagination Boundary */}
          {page < totalPages ? (
            <div className="mt-8 text-center pb-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30 flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
                <span>{loadingMore ? 'Fetching Next 20 Titles...' : `⚡ Load More (Page ${page + 1} of ${totalPages})`}</span>
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center pb-12 text-gray-500 text-xs">
              <p className="font-semibold">✓ You have reached the end of this catalog ({items.length} titles from TMDB).</p>
            </div>
          )}
        </>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-6 z-40 p-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-2xl transition-all cursor-pointer animate-bounce"
          title="Back to Top"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
