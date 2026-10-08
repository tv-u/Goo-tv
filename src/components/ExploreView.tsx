import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RotateCw,
  Film,
  Tv,
  ChevronDown,
  Sparkles,
  ArrowUp,
  ChevronRight,
  Filter,
  RefreshCcw,
  SlidersHorizontal
} from 'lucide-react';
import { MediaItem } from '../types/movie';
import {
  discoverMedia,
  fetchBollywood,
  fetchAnime,
  fetchTopRatedMovies,
  MOVIE_GENRES,
  TV_GENRES
} from '../services/tmdb';
import { MediaCard } from './MediaCard';
import { AdsterraAdBanner } from './AdsterraAdBanner';

interface ExploreViewProps {
  initialType?: 'movie' | 'tv' | 'bollywood' | 'anime' | 'top_rated';
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialType = 'movie',
  onPlayMedia,
  onOpenDetails,
  onDownload,
}) => {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>(
    initialType === 'tv' || initialType === 'anime' ? 'tv' : 'movie'
  );
  const [categoryPreset, setCategoryPreset] = useState<string>(initialType);
  const [genre, setGenre] = useState<string>('all');
  const [year, setYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [minRating, setMinRating] = useState<number>(0);
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(500); // Unlimited pages
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [autoInfiniteScroll, setAutoInfiniteScroll] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Sync when initialType prop changes from navbar
  useEffect(() => {
    setCategoryPreset(initialType);
    if (initialType === 'tv' || initialType === 'anime') {
      setMediaType('tv');
    } else {
      setMediaType('movie');
    }
    setGenre('all');
    setYear('');
    setPage(1);
  }, [initialType]);

  const loadData = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let result;
      if (categoryPreset === 'bollywood') {
        result = await fetchBollywood(pageNum, mediaType);
      } else if (categoryPreset === 'anime') {
        result = await fetchAnime(pageNum);
      } else if (categoryPreset === 'top_rated') {
        result = await fetchTopRatedMovies(pageNum);
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

      setTotalPages(Math.max(1, result.total_pages || 1));
      setItems((prev) => {
        if (!append) return result.results;

        const seen = new Set(
          prev.map((item) => `${item.media_type}:${item.id}`)
        );

        const incoming = result.results.filter((item) => {
          const key = `${item.media_type}:${item.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return [...prev, ...incoming];
      });
    } catch (err) {
      console.error('Failed to discover media', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryPreset, mediaType, genre, year, sortBy, minRating]);

  useEffect(() => {
    setPage(1);
    loadData(1, false);
  }, [loadData]);

  // Handle Load More (Unlimited)
  const handleLoadMore = useCallback(() => {
    if (page < totalPages && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, true);
    }
  }, [page, totalPages, loadingMore, loading, loadData]);

  // Infinite Scroll Observer for Unlimited Automatic Loading
  useEffect(() => {
    if (!autoInfiniteScroll) return;

    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingMore && !loading && items.length > 0) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [autoInfiniteScroll, handleLoadMore, loadingMore, loading, items.length]);

  // Track scroll position for "Back to Top"
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

  const currentGenres = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  const getPageTitle = () => {
    switch (categoryPreset) {
      case 'bollywood':
        return 'Bollywood & Hindi Cinema';
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
        <span>Home</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span>Catalog</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-red-400 font-bold">{getPageTitle()}</span>
      </nav>

      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse unlimited titles with instant 20-server auto-sync streaming
          </p>
        </div>

        {/* Media Type Switcher (Movie vs TV) */}
        {categoryPreset !== 'anime' && (
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => {
                setMediaType('movie');
                setCategoryPreset('movie');
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
                setCategoryPreset('tv');
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
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2015', '2010', '2000'].map((y) => (
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
              <option value="vote_average.desc" className="bg-[#131522] text-white">Highest Rated</option>
              <option value="primary_release_date.desc" className="bg-[#131522] text-white">Recently Released</option>
              <option value="revenue.desc" className="bg-[#131522] text-white">Top Box Office</option>
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
          Loaded {items.length} titles (Page {page} of {totalPages})
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

      {/* Sponsored VIP Accelerator Banner in Catalog */}
      <AdsterraAdBanner format="native_bar" className="mb-6" />

      {/* Grid of Movies/Shows or Skeleton */}
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
          <h3 className="text-base font-bold text-white">No titles match your filter criteria</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your genre, release year, or rating filters to discover more cinema titles.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Reset Filters
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

          {/* Unlimited Load More Button & Spinner */}
          {page < totalPages && (
            <div className="mt-8 text-center pb-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30 flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
                <span>{loadingMore ? 'Fetching Next 20 Titles...' : `⚡ Load More Unlimited (Page ${page + 1})`}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll back to top"
          className="fixed bottom-20 md:bottom-6 right-6 z-40 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-600/50 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
