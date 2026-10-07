import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Star, 
  Globe2, 
  Compass, 
  Play, 
  Server, 
  Zap, 
  History,
  RotateCw,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { MediaItem } from './types/movie';
import { 
  fetchTrending, 
  fetchNowPlayingMovies, 
  fetchPopularMovies, 
  fetchPopularTV, 
  fetchBollywood, 
  fetchAnime, 
  fetchByGenre, 
  fetchTopRatedMovies,
  fetchMediaDetails,
  getImageUrl
} from './services/tmdb';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MediaRow } from './components/MediaRow';
import { PlayerModal } from './components/PlayerModal';
import { TrailerModal } from './components/TrailerModal';
import { DetailModal } from './components/DetailModal';
import { DownloadModal } from './components/DownloadModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { ServersListModal } from './components/ServersListModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ExploreView } from './components/ExploreView';
import { PolicyModal, PolicyPageType } from './components/PolicyModal';
import { AdsterraAdBanner } from './components/AdsterraAdBanner';
import { STREAMING_SERVERS } from './services/servers';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [detailMedia, setDetailMedia] = useState<MediaItem | null>(null);
  const [trailerMedia, setTrailerMedia] = useState<MediaItem | null>(null);
  const [downloadMedia, setDownloadMedia] = useState<MediaItem | null>(null);
  const [policyPage, setPolicyPage] = useState<PolicyPageType | null>(null);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [watchlistInitialTab, setWatchlistInitialTab] = useState<'watchlist' | 'history'>('watchlist');
  const [showServersModal, setShowServersModal] = useState<boolean>(false);
  const [trendingWindow, setTrendingWindow] = useState<'day' | 'week'>('day');
  const [themeMode, setThemeMode] = useState<'cinema' | 'oled'>('cinema');

  // Home Screen Row Data
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [bollywoodHits, setBollywoodHits] = useState<MediaItem[]>([]);
  const [animeHits, setAnimeHits] = useState<MediaItem[]>([]);
  const [actionMovies, setActionMovies] = useState<MediaItem[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [loadingHome, setLoadingHome] = useState<boolean>(true);

  const { preferredServer, history } = useWatchlist();

  // Load home data once
  useEffect(() => {
    let isMounted = true;
    setLoadingHome(true);

    Promise.allSettled([
      fetchTrending('all', trendingWindow),
      fetchNowPlayingMovies(1),
      fetchPopularMovies(1),
      fetchPopularTV(1),
      fetchBollywood(1, 'movie'),
      fetchAnime(1),
      fetchByGenre(28, 'movie', 1), // Action
      fetchByGenre(878, 'movie', 1), // Sci-Fi
      fetchTopRatedMovies(1),
    ]).then((results) => {
      if (!isMounted) return;

      if (results[0].status === 'fulfilled') setTrending(results[0].value);
      if (results[1].status === 'fulfilled') setNowPlaying(results[1].value.results);
      if (results[2].status === 'fulfilled') setPopularMovies(results[2].value.results);
      if (results[3].status === 'fulfilled') setPopularTV(results[3].value.results);
      if (results[4].status === 'fulfilled') setBollywoodHits(results[4].value.results);
      if (results[5].status === 'fulfilled') setAnimeHits(results[5].value.results);
      if (results[6].status === 'fulfilled') setActionMovies(results[6].value.results);
      if (results[7].status === 'fulfilled') setSciFiMovies(results[7].value.results);
      if (results[8].status === 'fulfilled') setTopRated(results[8].value.results);

      setLoadingHome(false);
    });

    return () => {
      isMounted = false;
    };
  }, [trendingWindow]);

  // URL Hash / Deep-Link Support (#play-movie-123, #details-123)
  const activeMediaIdRef = useRef<number | null>(null);
  useEffect(() => {
    activeMediaIdRef.current = activeMedia?.id ?? null;
  }, [activeMedia?.id]);

  const detailMediaIdRef = useRef<number | null>(null);
  useEffect(() => {
    detailMediaIdRef.current = detailMedia?.id ?? null;
  }, [detailMedia?.id]);

  // Dynamic SEO & Individual Movie Page Metadata Generation
  useEffect(() => {
    const currentMedia = activeMedia || detailMedia;
    if (currentMedia) {
      const title = currentMedia.title || currentMedia.name || 'Movie';
      const year = (currentMedia.release_date || currentMedia.first_air_date || '').slice(0, 4);
      const isTv = currentMedia.media_type === 'tv' || (!currentMedia.title && !!currentMedia.name);
      const seoTitle = `Watch ${title} (${year || '2026'}) Full ${isTv ? 'Series' : 'Movie'} Free 4K HD | CineSphere VIP`;
      const seoDesc = `Stream ${title} (${year || '2026'}) online free with 20+ active fallback servers, Hindi dubbed dual audio, and direct high-speed downloads in 4K Ultra HD and 1080p BluRay.`;

      document.title = seoTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', seoDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', seoTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', seoDesc);

      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && currentMedia.backdrop_path) {
        ogImg.setAttribute('content', getImageUrl(currentMedia.backdrop_path, 'w1280'));
      }
    } else {
      document.title = 'CineSphere VIP - World Class Movie & TV Streaming | GOO TV';
      const defaultDesc = 'Stream unlimited movies and TV series with 20+ active streaming servers, TMDB live sync, seasons & episodes selector, and 4K cinema player.';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'CineSphere VIP - World Class Movie & TV Streaming | GOO TV');
    }
  }, [activeMedia, detailMedia]);

  // Handle URL Hash, Deep-Link, and Search Query Routing
  useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);

      // Check query params (?movie=123, ?tv=123, ?p=...)
      const queryMovieId = urlParams.get('movie') || urlParams.get('id');
      const queryTvId = urlParams.get('tv');
      const queryWatchId = urlParams.get('watch');

      if (queryMovieId && Number(queryMovieId) !== activeMediaIdRef.current) {
        fetchMediaDetails(Number(queryMovieId), 'movie').then((item) => {
          setActiveMedia(item);
        }).catch(console.error);
        return;
      }

      if (queryTvId && Number(queryTvId) !== activeMediaIdRef.current) {
        fetchMediaDetails(Number(queryTvId), 'tv').then((item) => {
          setActiveMedia(item);
        }).catch(console.error);
        return;
      }

      if (queryWatchId && Number(queryWatchId) !== activeMediaIdRef.current) {
        fetchMediaDetails(Number(queryWatchId), 'movie').then((item) => {
          setActiveMedia(item);
        }).catch(console.error);
        return;
      }

      // Check policy hash links (#about, #terms, #privacy, #dmca)
      if (hash === '#about' || hash === '#terms' || hash === '#privacy' || hash === '#dmca') {
        setPolicyPage(hash.replace('#', '') as PolicyPageType);
        return;
      }

      if (!hash) return;

      if (hash.startsWith('#play-')) {
        const parts = hash.replace('#play-', '').split('-');
        const mediaType = (parts[0] === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';
        const id = Number(parts[1]);
        if (id && id !== activeMediaIdRef.current) {
          fetchMediaDetails(id, mediaType).then((item) => {
            setActiveMedia(item);
          }).catch(console.error);
        }
      } else if (hash.startsWith('#details-')) {
        const id = Number(hash.replace('#details-', ''));
        if (id && id !== detailMediaIdRef.current) {
          fetchMediaDetails(id, 'movie').then((item) => {
            setDetailMedia(item);
          }).catch(console.error);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, []);

  // Update hash when active media changes
  const handlePlayMedia = (item: MediaItem) => {
    setActiveMedia(item);
    window.location.hash = `#play-${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}`;
  };

  const handleClosePlayer = () => {
    setActiveMedia(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleOpenDetails = (item: MediaItem) => {
    setDetailMedia(item);
    window.location.hash = `#details-${item.id}`;
  };

  const handleCloseDetails = () => {
    setDetailMedia(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleOpenTrailer = (item: MediaItem) => {
    setTrailerMedia(item);
  };

  const handleOpenDownload = (item: MediaItem) => {
    setDownloadMedia(item);
  };

  const currentServer = STREAMING_SERVERS.find((s) => s.id === preferredServer) || STREAMING_SERVERS[0];

  return (
    <div className={`min-h-screen ${themeMode === 'oled' ? 'bg-[#000000]' : 'bg-[#0b0c10]'} text-[#f3f4f6] selection:bg-red-600 selection:text-white flex flex-col font-sans transition-colors duration-300 pb-16 md:pb-0`}>
      
      {/* Global Responsive Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectMedia={handlePlayMedia}
        onOpenWatchlist={() => {
          setWatchlistInitialTab('watchlist');
          setShowWatchlist(true);
        }}
        onOpenHistory={() => {
          setWatchlistInitialTab('history');
          setShowWatchlist(true);
        }}
        onOpenServersList={() => setShowServersModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' ? (
          <div>
            {/* Cinematic Featured Billboard Hero with 4K Download Option */}
            <HeroBanner
              items={trending.length > 0 ? trending : popularMovies}
              onPlayMedia={handlePlayMedia}
              onOpenDetails={handleOpenDetails}
              onPlayTrailer={handleOpenTrailer}
              onOpenDownload={handleOpenDownload}
            />

            {/* CONTINUE WATCHING / RECENTLY VIEWED RAIL */}
            {history.length > 0 && (
              <div className="relative my-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <History className="w-4 h-4" />
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Continue Watching</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {history.length} Titles
                      </span>
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setWatchlistInitialTab('history');
                      setShowWatchlist(true);
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    View All History <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
                  {history.slice(0, 10).map((h) => {
                    const item: MediaItem = {
                      id: h.id,
                      title: h.mediaType === 'movie' ? h.title : undefined,
                      name: h.mediaType === 'tv' ? h.title : undefined,
                      media_type: h.mediaType,
                      poster_path: h.posterPath,
                      backdrop_path: h.backdropPath,
                      overview: '',
                      vote_average: h.voteAverage,
                      vote_count: 0,
                      popularity: 0,
                    };

                    return (
                      <div
                        key={`${h.id}-${h.timestamp}`}
                        onClick={() => handlePlayMedia(item)}
                        className="group relative flex-shrink-0 w-52 rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-red-500 transition-all cursor-pointer p-2 flex gap-2.5 items-center"
                      >
                        <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                          <img
                            src={getImageUrl(h.posterPath, 'w300')}
                            alt={h.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                            {h.title}
                          </h4>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-red-600 text-white inline-block mt-1">
                            {h.mediaType === 'tv' && h.season ? `S${h.season}:E${h.episode}` : 'Resume Movie'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">
                            {new Date(h.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SPONSORED ADSTERRA SMART VIP AD BANNER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdsterraAdBanner />
            </div>

            {/* TRENDING SECTION WITH TIME-WINDOW TOGGLE */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Trending Right Now
                  </h2>
                </div>

                {/* Day vs Week Switcher */}
                <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setTrendingWindow('day')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      trendingWindow === 'day' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTrendingWindow('week')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      trendingWindow === 'week' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    This Week
                  </button>
                </div>
              </div>
            </div>

            {/* Media Rows with Download options */}
            <div className="space-y-4">
              {loadingHome ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                  {Array.from({ length: 3 }).map((_, rIdx) => (
                    <div key={rIdx} className="space-y-3">
                      <div className="h-6 w-48 bg-white/5 rounded-lg animate-pulse"></div>
                      <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 6 }).map((_, cIdx) => (
                          <div key={cIdx} className="w-44 aspect-[2/3] bg-white/5 rounded-xl animate-pulse flex-shrink-0"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <MediaRow
                title="Trending Hits"
                badge={trendingWindow === 'day' ? 'TODAY 24H' : 'TOP THIS WEEK'}
                icon={Flame}
                items={trending}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('movies')}
              />

              <MediaRow
                title="In Theaters & Fresh Releases"
                badge="PREMIERE"
                icon={Film}
                items={nowPlaying}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('movies')}
              />

              <MediaRow
                title="Bollywood & Hindi Blockbusters"
                badge="HINDI 4K"
                icon={Compass}
                items={bollywoodHits}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('bollywood')}
              />

              <MediaRow
                title="Binge-Worthy TV Series"
                badge="FULL SEASONS"
                icon={Tv}
                items={popularTV}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('tv')}
              />

              {/* Mid-Feed High-Converting Sponsored VIP Banner */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <AdsterraAdBanner format="native_bar" />
              </div>

              <MediaRow
                title="Popular Hollywood Cinema"
                badge="VIP SERVERS"
                icon={Play}
                items={popularMovies}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('movies')}
              />

              <MediaRow
                title="Anime & Japanese Animation"
                badge="SUB & DUB"
                icon={Globe2}
                items={animeHits}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('anime')}
              />

              <MediaRow
                title="High-Octane Action & Thrillers"
                badge="EXPLOSIVE"
                icon={Flame}
                items={actionMovies}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('movies')}
              />

              <MediaRow
                title="Sci-Fi & Cyberpunk Universes"
                badge="IMAX 4K"
                icon={Sparkles}
                items={sciFiMovies}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('movies')}
              />

              <MediaRow
                title="IMDb Top 250 Masterpieces"
                badge="ALL-TIME LEGENDS"
                icon={Star}
                items={topRated}
                onPlayMedia={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onDownload={handleOpenDownload}
                onViewAll={() => setCurrentTab('top_rated')}
              />
            </div>
          </div>
        ) : (
          /* Exploration / Unlimited Filter Catalog View with Download */
          <ExploreView
            initialType={
              currentTab === 'movies'
                ? 'movie'
                : currentTab === 'tv'
                ? 'tv'
                : currentTab === 'bollywood'
                ? 'bollywood'
                : currentTab === 'anime'
                ? 'anime'
                : 'top_rated'
            }
            onPlayMedia={handlePlayMedia}
            onOpenDetails={handleOpenDetails}
            onDownload={handleOpenDownload}
          />
        )}
      </main>

      {/* Modern Cinema Footer */}
      <footer className="bg-[#07080b] border-t border-white/10 pt-12 pb-10 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/40">
                  <Film className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  GOO <span className="text-red-600">TV</span>
                </span>
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded">
                  VIP
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-md">
                World-class cinema streaming application featuring 20 active fallback servers, TMDB live sync metadata, full TV seasons & episodes, and high-speed direct downloads in 4K, 1080p, 720p.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setThemeMode(themeMode === 'cinema' ? 'oled' : 'cinema')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Toggle Dark Cinema Theme"
              >
                {themeMode === 'cinema' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-yellow-300" />}
                <span>{themeMode === 'cinema' ? 'OLED Midnight' : 'Cinema Dark'}</span>
              </button>

              <button
                onClick={() => setShowServersModal(true)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Server className="w-4 h-4 text-emerald-400" />
                <span>20 Servers Configured</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-2.5">
                Top Primary Embeds
              </h5>
              <ul className="space-y-1.5 text-[11px] text-gray-400">
                <li>1. SuperEmbed (Zero-Sandbox 4K)</li>
                <li>2. AutoEmbed CC (Smart Stream)</li>
                <li>3. Embed.su (VIP High-Speed)</li>
                <li>4. VidSrc Net (Unblocked Engine)</li>
                <li>5. SmashyStream (Multi-Host)</li>
                <li>6. 2Embed Global (Classic)</li>
                <li>7. VidSrc XYZ (Direct Stream)</li>
                <li>8. MoviesAPI / Noni.to</li>
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-2.5">
                Direct Download Mirrors
              </h5>
              <ul className="space-y-1.5 text-[11px] text-gray-400">
                <li>• 4K Ultra HD (HDR 2160p)</li>
                <li>• 1080p Full HD (BluRay Dual Audio)</li>
                <li>• 720p HD (Fast WebRip)</li>
                <li>• 480p Mobile Data Saver</li>
                <li>• SuperDL High-Speed CDN</li>
                <li>• Filemoon Cloud Resumable</li>
                <li>• StreamWish Direct MP4</li>
                <li>• YTS Magnet / Torrent Support</li>
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-2.5">
                Browse Genres
              </h5>
              <ul className="space-y-1.5 text-[11px] text-gray-400">
                <li>Action & Adventure</li>
                <li>Bollywood & Hindi Cinema</li>
                <li>Japanese Anime & Animation</li>
                <li>Sci-Fi & Cyberpunk</li>
                <li>Crime & Mystery</li>
                <li>Comedy & Romance</li>
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-2.5">
                Legal & Governance
              </h5>
              <ul className="space-y-2 text-[11px] text-gray-400">
                <li>
                  <button onClick={() => setPolicyPage('about')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                    • About GOO TV Platform
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyPage('terms')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                    • Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyPage('privacy')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                    • Security & Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyPage('dmca')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                    • DMCA Copyright Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>© {new Date().getFullYear()} GOO TV. Powered by The Movie Database (TMDB) API.</p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button onClick={() => setPolicyPage('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button>
              <button onClick={() => setPolicyPage('terms')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
              <button onClick={() => setPolicyPage('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy & Security</button>
              <button onClick={() => setPolicyPage('dmca')} className="hover:text-white transition-colors cursor-pointer">DMCA Disclaimer</button>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWatchlist={() => {
          setWatchlistInitialTab('watchlist');
          setShowWatchlist(true);
        }}
        onOpenServers={() => setShowServersModal(true)}
      />

      {/* ACTIVE 20-SERVER MASTER STREAMING PLAYER MODAL */}
      {activeMedia && (
        <PlayerModal
          media={activeMedia}
          onClose={handleClosePlayer}
          onSelectMedia={(item) => handlePlayMedia(item)}
          onOpenDownload={handleOpenDownload}
        />
      )}

      {/* MOVIE & SERIES DETAIL MODAL */}
      {detailMedia && (
        <DetailModal
          media={detailMedia}
          onClose={handleCloseDetails}
          onPlayMedia={(item) => {
            handleCloseDetails();
            handlePlayMedia(item);
          }}
          onOpenTrailer={handleOpenTrailer}
          onOpenDownload={handleOpenDownload}
        />
      )}

      {/* MULTI-QUALITY 4K/1080P/720P/480P DOWNLOAD MODAL */}
      {downloadMedia && (
        <DownloadModal
          media={downloadMedia}
          onClose={() => setDownloadMedia(null)}
        />
      )}

      {/* YOUTUBE TRAILER MODAL */}
      {trailerMedia && (
        <TrailerModal
          media={trailerMedia}
          onClose={() => setTrailerMedia(null)}
          onWatchMovie={(item) => {
            setTrailerMedia(null);
            handlePlayMedia(item);
          }}
        />
      )}

      {/* WATCHLIST & HISTORY SLIDEOUT DRAWER */}
      {showWatchlist && (
        <WatchlistDrawer
          initialTab={watchlistInitialTab}
          onClose={() => setShowWatchlist(false)}
          onPlayMedia={(item) => {
            setShowWatchlist(false);
            handlePlayMedia(item);
          }}
        />
      )}

      {/* 20 SERVERS STATUS & BENCHMARK MODAL */}
      {showServersModal && (
        <ServersListModal
          onClose={() => setShowServersModal(false)}
        />
      )}

      {/* LEGAL & POLICY MODAL (ABOUT US, TERMS, PRIVACY, DMCA) */}
      {policyPage && (
        <PolicyModal
          page={policyPage}
          onClose={() => setPolicyPage(null)}
          onSelectPage={(p) => setPolicyPage(p)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WatchlistProvider>
      <MainApp />
    </WatchlistProvider>
  );
}
