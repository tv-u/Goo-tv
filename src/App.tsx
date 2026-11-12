import React, { useState, useEffect, useCallback } from 'react';
import { WatchlistProvider } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MediaRow } from './components/MediaRow';
import { ExploreView } from './components/ExploreView';
import { PlayerModal } from './components/PlayerModal';
import { DetailModal } from './components/DetailModal';
import { TrailerModal } from './components/TrailerModal';
import { DownloadModal } from './components/DownloadModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { ServersListModal } from './components/ServersListModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PolicyModal, PolicyPageType } from './components/PolicyModal';
import { RunningSupportNotice } from './components/RunningSupportNotice';
import { AdsterraAdBanner, AdsterraNativeContainer } from './components/AdsterraAdBanner';
import { applySeo } from './seo/seo';
import { 
  fetchTrending, 
  fetchNowPlayingMovies, 
  fetchBollywood, 
  fetchPopularTV, 
  fetchTopRatedMovies, 
  fetchAnime,
  VERIFIED_SEED_ITEMS,
  fetchMediaDetails
} from './services/tmdb';
import { MediaItem } from './types/movie';
import { Flame, Sparkles, Clapperboard, Tv, Star, Globe2, ShieldCheck, Server, Film, Heart } from 'lucide-react';
import { toggleMute, getMuted, playGelPop, playGlassPing } from './utils/gelSound';

export default function App() {
  const [theme, setTheme] = useState<'pastel' | 'dark'>('pastel');
  const [isMuted, setIsMuted] = useState<boolean>(() => getMuted());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Policy Modal
  const [policyPage, setPolicyPage] = useState<PolicyPageType | null>(null);

  // Data Rails
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS);
  const [nowPlayingItems, setNowPlayingItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS.slice(0, 5));
  const [bollywoodItems, setBollywoodItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS.filter(m => m.id === 1389172 || m.id === 19404 || m.id === 1400940));
  const [tvItems, setTvItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS.filter(m => m.media_type === 'tv'));
  const [topRatedItems, setTopRatedItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS);
  const [animeItems, setAnimeItems] = useState<MediaItem[]>(VERIFIED_SEED_ITEMS.filter(m => m.id === 105248));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active Modals
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [detailMedia, setDetailMedia] = useState<MediaItem | null>(null);
  const [trailerMedia, setTrailerMedia] = useState<MediaItem | null>(null);
  const [downloadMedia, setDownloadMedia] = useState<MediaItem | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isServersListOpen, setIsServersListOpen] = useState<boolean>(false);

  // Load Home Screen Blockbusters with Guaranteed Multi-Key Fallback
  useEffect(() => {
    let isMounted = true;
    const loadCinemaData = async () => {
      try {
        const [trendingRes, nowPlayingRes, bollywoodRes, tvRes, topRatedRes, animeRes] = await Promise.allSettled([
          fetchTrending('all', 'day'),
          fetchNowPlayingMovies(1),
          fetchBollywood(1),
          fetchPopularTV(1),
          fetchTopRatedMovies(1),
          fetchAnime(1),
        ]);

        if (!isMounted) return;

        if (trendingRes.status === 'fulfilled' && trendingRes.value.length > 0) {
          setTrendingItems(trendingRes.value);
        }
        if (nowPlayingRes.status === 'fulfilled' && nowPlayingRes.value.results.length > 0) {
          setNowPlayingItems(nowPlayingRes.value.results);
        }
        if (bollywoodRes.status === 'fulfilled' && bollywoodRes.value.results.length > 0) {
          setBollywoodItems(bollywoodRes.value.results);
        }
        if (tvRes.status === 'fulfilled' && tvRes.value.results.length > 0) {
          setTvItems(tvRes.value.results);
        }
        if (topRatedRes.status === 'fulfilled' && topRatedRes.value.results.length > 0) {
          setTopRatedItems(topRatedRes.value.results);
        }
        if (animeRes.status === 'fulfilled' && animeRes.value.results.length > 0) {
          setAnimeItems(animeRes.value.results);
        }
      } catch (err) {
        console.warn('Network issue encountered, using verified seed blockbusters', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCinemaData();
    return () => { isMounted = false; };
  }, []);

  // Listen to Hash Navigation (#play-movie-ID, #category-ID, #details-ID)
  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#play-movie-') || hash.startsWith('#play-tv-')) {
        const isTv = hash.startsWith('#play-tv-');
        const id = hash.replace(isTv ? '#play-tv-' : '#play-movie-', '');
        try {
          const item = await fetchMediaDetails(id, isTv ? 'tv' : 'movie');
          setActiveMedia(item);
        } catch {}
      } else if (hash.startsWith('#details-')) {
        const id = hash.replace('#details-', '');
        try {
          const item = await fetchMediaDetails(id, 'movie');
          setDetailMedia(item);
        } catch {}
      } else if (hash.startsWith('#category-')) {
        const cat = hash.replace('#category-', '');
        setCurrentTab(cat);
      } else if (hash === '#about') {
        setPolicyPage('about');
      } else if (hash === '#terms') {
        setPolicyPage('terms');
      } else if (hash === '#privacy' || hash === '#security') {
        setPolicyPage('privacy');
      } else if (hash === '#dmca' || hash === '#disclaimer') {
        setPolicyPage('dmca');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Dynamic Worldwide SEO Synchronization
  useEffect(() => {
    if (activeMedia) {
      const year = (activeMedia.release_date || activeMedia.first_air_date || '').slice(0, 4);
      const title = activeMedia.title || activeMedia.name || 'Movie';
      const isTv = activeMedia.media_type === 'tv' || (!activeMedia.title && !!activeMedia.name);
      applySeo({
        title: `Watch ${title} (${year || '2026'}) Online Free in 4K HDR | GOO TV`,
        description: `Stream ${title} (${year || '2026'}) online free with 20 unblocked live servers, Hindi dubbed, multi-audio dual audio tracks, full 4K HDR, and direct download on GOO TV.`,
        year,
        path: `#play-${isTv ? 'tv' : 'movie'}-${activeMedia.id}`,
        isTv,
        image: activeMedia.poster_path ? `https://image.tmdb.org/t/p/w500${activeMedia.poster_path}` : undefined,
        rating: activeMedia.vote_average ? activeMedia.vote_average.toFixed(1) : '8.6',
      });
    } else if (detailMedia) {
      const year = (detailMedia.release_date || detailMedia.first_air_date || '').slice(0, 4);
      const title = detailMedia.title || detailMedia.name || 'Movie';
      const isTv = detailMedia.media_type === 'tv' || (!detailMedia.title && !!detailMedia.name);
      applySeo({
        title: `${title} (${year || '2026'}) Cast, Storyline, Rating & Free Stream | GOO TV`,
        description: `Read storyline, IMDb rating, cast information, trailer, and watch ${title} online in 4K HDR on GOO TV.`,
        year,
        path: `#details-${detailMedia.id}`,
        isTv,
        image: detailMedia.poster_path ? `https://image.tmdb.org/t/p/w500${detailMedia.poster_path}` : undefined,
        rating: detailMedia.vote_average ? detailMedia.vote_average.toFixed(1) : '8.5',
      });
    } else if (searchQuery) {
      applySeo({
        title: `Search results for "${searchQuery}" — Watch Movies & Series Online | GOO TV`,
        description: `Browse 4K movie and web series streaming results for "${searchQuery}" with 20 live servers on GOO TV.`,
        path: `#search?q=${encodeURIComponent(searchQuery)}`,
      });
    } else {
      const catTitle = currentTab === 'home' ? 'Watch Movies & TV Series Online Free in 4K HDR' : `${currentTab.toUpperCase().replace('_', ' ')} Movies & Series`;
      applySeo({
        title: `GOO TV — ${catTitle} | 20 Live Servers`,
        description: `Watch unlimited 4K movies and TV series online with 20 live servers, multi-language audio dubs, and zero buffering playback.`,
        category: currentTab,
        path: currentTab === 'home' ? '/' : `#${currentTab}`,
      });
    }
  }, [activeMedia, detailMedia, searchQuery, currentTab]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'pastel' ? 'dark' : 'pastel'));
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <WatchlistProvider>
      <div className={`min-h-screen relative flex flex-col transition-colors duration-500 overflow-x-hidden ${
        theme === 'pastel'
          ? 'bg-[#fdf5f2] text-[#2e1c24] selection:bg-rose-300 selection:text-stone-900'
          : 'bg-[#06080b] text-[#f8fafc] selection:bg-emerald-400 selection:text-black'
      }`}>
        
        {/* Soft Dreamy Ambient Cherry Blossom Bokeh Background for Pastel Aesthetic */}
        {theme === 'pastel' && (
          <>
            <div 
              className="fixed inset-0 -z-20 bg-cover bg-center pointer-events-none opacity-45 scale-102"
              style={{ backgroundImage: `url('/cherry_blossom_ambient.jpg')` }}
            />
            <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-pink-100/80 via-rose-50/50 to-amber-50/60 backdrop-blur-[24px] pointer-events-none" />
            <div className="fixed top-20 left-1/4 w-80 h-80 rounded-full bg-pink-300/25 blur-3xl -z-10 pointer-events-none animate-pulse" />
            <div className="fixed bottom-24 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl -z-10 pointer-events-none" />
          </>
        )}

        {/* Emerald Green, Golden Yellow & Obsidian Black Cinema Atmosphere */}
        {theme === 'dark' && (
          <>
            <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#05070a] via-[#070b09] to-[#0e0c06] pointer-events-none" />
            <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl -z-10 pointer-events-none animate-pulse" />
            <div className="fixed bottom-20 right-1/4 w-96 h-96 rounded-full bg-amber-500/12 blur-3xl -z-10 pointer-events-none" />
            <div className="fixed top-1/2 right-1/3 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl -z-10 pointer-events-none" />
          </>
        )}

        {/* 3D Liquid Glass Top Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onSelectMedia={(item) => setActiveMedia(item)}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenServersList={() => setIsServersListOpen(true)}
          onSearchSubmit={handleSearchSubmit}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full pt-20 sm:pt-24 pb-20 md:pb-12">
          {currentTab === 'home' ? (
            <div className="animate-fadeIn">
              
              {/* Grand 3D Liquid Glass Hero Billboard */}
              <HeroBanner
                items={trendingItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onPlayTrailer={(item) => setTrailerMedia(item)}
                onOpenDownload={(item) => setDownloadMedia(item)}
                theme={theme}
              />

              {/* Adsterra Native Sponsored Recommendation (Non-intrusive 3D Glass Container) */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
                <div className={`p-4 rounded-[28px] shadow-xl flex flex-col items-center justify-center min-h-[90px] ${
                  theme === 'pastel' ? 'liquid-glass-plate' : 'liquid-glass-plate-dark'
                }`}>
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-black/5 text-[10px] font-black uppercase tracking-wider opacity-70">
                    <span className="flex items-center gap-1.5 text-rose-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>SPONSORED 4K RECOMMENDATION</span>
                    </span>
                    <span className="gel-badge text-[9px] px-2 py-0.5 rounded-full font-bold">
                      ADSTERRA VIP
                    </span>
                  </div>
                  <div id="container-a4e46263cbd8519b40b7d5e084f699d2" className="w-full flex justify-center" />
                </div>
              </div>

              {/* 3D Glass Movie Rails */}
              <MediaRow
                title="Trending Hits"
                badge="TRENDING"
                icon={Flame}
                items={trendingItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('movies')}
                theme={theme}
              />

              <MediaRow
                title="In Theaters & Fresh Releases"
                badge="NEW 4K"
                icon={Clapperboard}
                items={nowPlayingItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('movies')}
                theme={theme}
              />

              <MediaRow
                title="Bollywood & Hindi Blockbusters"
                badge="HINDI DUAL"
                icon={Sparkles}
                items={bollywoodItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('hindi_movies')}
                theme={theme}
              />

              {/* Adsterra High-Speed Accelerator Card */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
                <AdsterraAdBanner format="download_sponsor" />
              </div>

              <MediaRow
                title="Popular TV Series"
                badge="SERIES"
                icon={Tv}
                items={tvItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('tv')}
                theme={theme}
              />

              <MediaRow
                title="Top Rated Cinema"
                badge="IMDb 8+"
                icon={Star}
                items={topRatedItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('top_rated')}
                theme={theme}
              />

              <MediaRow
                title="Anime & Animation"
                badge="ANIME HQ"
                icon={Globe2}
                items={animeItems}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onViewAll={() => handleSelectTab('anime')}
                theme={theme}
              />
            </div>
          ) : (
            /* Explore / Channels / Search View */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
              <ExploreView
                initialType={currentTab === 'tv' ? 'tv' : 'movie'}
                initialCategory={currentTab}
                searchQuery={searchQuery}
                onPlayMedia={(item) => setActiveMedia(item)}
                onOpenDetails={(item) => setDetailMedia(item)}
                onDownload={(item) => setDownloadMedia(item)}
                onCategorySelect={(cat) => setCurrentTab(cat)}
              />
            </div>
          )}
        </main>

        {/* 3D Liquid Glass Footer with 24/7 Running Support Notice */}
        <footer className={`border-t transition-colors py-8 px-4 sm:px-8 mt-auto ${
          theme === 'pastel'
            ? 'border-white/80 bg-white/40 backdrop-blur-xl text-stone-800'
            : 'border-white/10 bg-[#0d0912]/80 backdrop-blur-xl text-stone-400'
        }`}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* 3D Liquid Glass Marquee Notice Running in Hindi & English */}
            <RunningSupportNotice theme={theme} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl gel-pink flex items-center justify-center text-white shadow-md">
                <div className="gel-sheen" />
                <Film className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight">
                  GOO <span className="text-rose-600">TV</span> VIP
                </span>
                <p className="text-[11px] opacity-70 font-semibold">
                  3D Liquid Glassmorphism & Skeuomorphic Gel Cinema Engine
                </p>
              </div>
            </div>

            {/* Policy Navigation Links (About, Terms, Security, Disclaimer) */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
              <button
                onClick={() => {
                  setPolicyPage('about');
                  window.location.hash = '#about';
                }}
                className="hover:text-rose-500 transition-colors cursor-pointer"
              >
                About Us
              </button>
              <span className="opacity-30">•</span>
              <button
                onClick={() => {
                  setPolicyPage('terms');
                  window.location.hash = '#terms';
                }}
                className="hover:text-rose-500 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span className="opacity-30">•</span>
              <button
                onClick={() => {
                  setPolicyPage('privacy');
                  window.location.hash = '#security';
                }}
                className="hover:text-rose-500 transition-colors cursor-pointer"
              >
                Security & Privacy
              </button>
              <span className="opacity-30">•</span>
              <button
                onClick={() => {
                  setPolicyPage('dmca');
                  window.location.hash = '#disclaimer';
                }}
                className="hover:text-rose-500 transition-colors cursor-pointer"
              >
                Disclaimer & DMCA
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
              <span className="gel-badge px-3 py-1 rounded-full flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-500" />
                <span>20 Live Servers Active</span>
              </span>
              <span className="gel-badge px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Zero Buffering CDN</span>
              </span>
              <button
                onClick={handleToggleTheme}
                className="gel-emerald-gold px-3.5 py-1.5 rounded-full text-black font-black text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <div className="gel-sheen" />
                <span>{theme === 'pastel' ? '🟢 Emerald & Gold Cinema' : '🌸 Pastel Pink Gel'}</span>
              </button>
            </div>

            <p className="text-xs opacity-60 text-center md:text-right font-medium">
              © {new Date().getFullYear()} GOO TV. Support: <span className="text-rose-500 font-bold">Help.wowmovies@gmail.com</span> (24-48h).
            </p>
          </div>
          </div>
        </footer>

        {/* Mobile Bottom Floating Navigation Bar */}
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
          theme={theme}
        />

        {/* 🎬 3D Liquid Glass Video Streaming Player Modal */}
        {activeMedia && (
          <PlayerModal
            media={activeMedia}
            onClose={() => setActiveMedia(null)}
            onSelectMedia={(item) => setActiveMedia(item)}
            onOpenDownload={(item) => setDownloadMedia(item)}
          />
        )}

        {/* 📖 Movie Details Modal */}
        {detailMedia && (
          <DetailModal
            media={detailMedia}
            onClose={() => setDetailMedia(null)}
            onPlayMedia={(item) => {
              setDetailMedia(null);
              setActiveMedia(item);
            }}
            onOpenTrailer={(item) => {
              setDetailMedia(null);
              setTrailerMedia(item);
            }}
            onOpenDownload={(item) => {
              setDetailMedia(null);
              setDownloadMedia(item);
            }}
          />
        )}

        {/* 🎞️ Official Trailer Modal */}
        {trailerMedia && (
          <TrailerModal
            media={trailerMedia}
            onClose={() => setTrailerMedia(null)}
            onWatchMovie={(item) => {
              setTrailerMedia(null);
              setActiveMedia(item);
            }}
          />
        )}

        {/* 📥 Direct 4K Download Modal */}
        {downloadMedia && (
          <DownloadModal
            media={downloadMedia}
            onClose={() => setDownloadMedia(null)}
          />
        )}

        {/* 🔖 Watchlist & Watch History Drawer */}
        {isWatchlistOpen && (
          <WatchlistDrawer
            initialTab="watchlist"
            onClose={() => setIsWatchlistOpen(false)}
            onPlayMedia={(item) => {
              setIsWatchlistOpen(false);
              setActiveMedia(item);
            }}
          />
        )}

        {/* 📜 Watch History Drawer */}
        {isHistoryOpen && (
          <WatchlistDrawer
            initialTab="history"
            onClose={() => setIsHistoryOpen(false)}
            onPlayMedia={(item) => {
              setIsHistoryOpen(false);
              setActiveMedia(item);
            }}
          />
        )}

        {/* 🖥️ 20+ Streaming Servers Modal */}
        {isServersListOpen && (
          <ServersListModal
            onClose={() => setIsServersListOpen(false)}
          />
        )}

        {/* 📜 Policy Pages Modal (About Us, Terms, Security, Disclaimer) */}
        {policyPage && (
          <PolicyModal
            page={policyPage}
            onClose={() => {
              setPolicyPage(null);
              if (window.location.hash.startsWith('#about') || 
                  window.location.hash.startsWith('#terms') || 
                  window.location.hash.startsWith('#security') || 
                  window.location.hash.startsWith('#privacy') || 
                  window.location.hash.startsWith('#disclaimer') || 
                  window.location.hash.startsWith('#dmca')) {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
            onSelectPage={(p) => setPolicyPage(p)}
            theme={theme}
          />
        )}
      </div>
    </WatchlistProvider>
  );
}
