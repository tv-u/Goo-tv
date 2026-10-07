import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Zap, 
  RefreshCw, 
  Sparkles, 
  Download, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Film, 
  Tv, 
  Share2, 
  ShieldCheck, 
  Sliders, 
  Radio, 
  HelpCircle,
  Clock,
  Gauge
} from 'lucide-react';
import { MediaItem, Season } from '../types/movie';
import { STREAMING_SERVERS } from '../services/servers';
import { fetchMediaDetails, fetchTVSeason, getImageUrl } from '../services/tmdb';
import { AdsterraAdBanner } from './AdsterraAdBanner';

interface CleanCinemaPlayerWindowProps {
  media: MediaItem;
  initialSeason?: number;
  initialEpisode?: number;
  initialServerId?: string;
  initialAudio?: 'hindi' | 'english' | 'dual';
  initialQuality?: '4k' | '1080p' | '720p' | '480p';
  onClose?: () => void;
  onOpenDownload?: (media: MediaItem) => void;
}

export const CleanCinemaPlayerWindow: React.FC<CleanCinemaPlayerWindowProps> = ({
  media,
  initialSeason = 1,
  initialEpisode = 1,
  initialServerId = 'autoembed',
  initialAudio = 'hindi',
  initialQuality = '1080p',
  onClose,
  onOpenDownload,
}) => {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const title = media.title || media.name || 'Movie';
  const year = (media.release_date || media.first_air_date || '').slice(0, 4);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '8.2';

  // Player State
  const [activeServerId, setActiveServerId] = useState<string>(initialServerId);
  const [currentSeason, setCurrentSeason] = useState<number>(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState<number>(initialEpisode);
  const [selectedQuality, setSelectedQuality] = useState<'4k' | '1080p' | '720p' | '480p'>(initialQuality);
  const [selectedAudio, setSelectedAudio] = useState<'hindi' | 'english' | 'dual'>(initialAudio);
  
  // Playback Control State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(240); // Initial 4 min progress
  const [durationSec, setDurationSec] = useState<number>(7200); // 2 hours default
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(100); // 0-200% with audio boost
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // TV Seasons & Episodes Data
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [details, setDetails] = useState<any>(null);

  const cinemaWrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Trigger HUD Toast Notification
  const triggerToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe PostMessage dispatcher to video frames
  const postPlayerMessage = useCallback((action: string, payload?: any) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      // HTML5 video & standard embed message formats
      win.postMessage({ type: action, ...payload }, '*');
      win.postMessage({ event: 'command', func: action, args: payload ? [payload] : [] }, '*');
      win.postMessage(JSON.stringify({ event: 'command', func: action, args: payload ? [payload] : [] }), '*');
      win.postMessage(JSON.stringify({ method: action, value: payload }), '*');
    } catch {
      // Ignored for strict origin isolation
    }
  }, []);

  // 1. Play / Pause / Stop / Start Toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      postPlayerMessage('pauseVideo');
      postPlayerMessage('pause');
      triggerToast('⏸️ Playback Paused (Stopped)');
    } else {
      setIsPlaying(true);
      postPlayerMessage('playVideo');
      postPlayerMessage('play');
      triggerToast('▶️ Playback Resumed (Started)');
    }
  };

  // 2. Skip Forward / Backward by N seconds
  const skipSeconds = (seconds: number) => {
    const newTime = Math.max(0, Math.min(durationSec, currentTimeSec + seconds));
    setCurrentTimeSec(newTime);
    postPlayerMessage('seekTo', newTime);
    postPlayerMessage('seek', seconds);
    if (seconds > 0) {
      triggerToast(`⏩ Fast-Forward +${seconds}s (${formatTime(newTime)})`);
    } else {
      triggerToast(`⏪ Rewound ${Math.abs(seconds)}s (${formatTime(newTime)})`);
    }
  };

  // 3. Jump to specific progress percentage
  const handleSeekProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSec = Number(e.target.value);
    setCurrentTimeSec(targetSec);
    postPlayerMessage('seekTo', targetSec);
    triggerToast(`⏱️ Jumped to ${formatTime(targetSec)}`);
  };

  // 4. Quality Switcher with Auto-Sync
  const handleChangeQuality = (qual: '4k' | '1080p' | '720p' | '480p') => {
    setSelectedQuality(qual);
    if (qual === '4k') {
      handleAutoSyncServer('superembed');
      triggerToast('💎 Switched to 4K Ultra HD (2160p HDR Stream)');
    } else if (qual === '1080p') {
      handleAutoSyncServer('autoembed');
      triggerToast('✨ Switched to 1080p Full HD (BluRay 60fps)');
    } else if (qual === '720p') {
      handleAutoSyncServer('embed-su');
      triggerToast('⚡ Switched to 720p HD (High Speed CDN)');
    } else {
      handleAutoSyncServer('vidsrc-net');
      triggerToast('📱 Switched to 480p Mobile Data Saver');
    }
  };

  // 5. Dual Audio Switcher
  const handleChangeAudio = (audio: 'hindi' | 'english' | 'dual') => {
    setSelectedAudio(audio);
    if (audio === 'hindi') {
      handleAutoSyncServer('superembed');
      triggerToast('🇮🇳 Switched to Hindi Dubbed / Bollywood Audio Track');
    } else if (audio === 'english') {
      handleAutoSyncServer('embed-su');
      triggerToast('🌐 Switched to English 5.1 Dolby Audio Track');
    } else {
      handleAutoSyncServer('autoembed');
      triggerToast('🎧 Switched to Dual Audio Stream');
    }
  };

  // 6. Playback Speed Controller
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    postPlayerMessage('setPlaybackRate', speed);
    triggerToast(`⚡ Playback Speed: ${speed}x`);
  };

  // 7. Fullscreen Toggle (Works on container and document)
  const toggleFullscreen = () => {
    const elem = cinemaWrapperRef.current || document.documentElement;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      triggerToast('⛶ 100% Fullscreen Cinema Activated');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
      triggerToast('Fullscreen Exited');
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // 8. Auto-Sync to next server
  const activeServerIndex = STREAMING_SERVERS.findIndex((s) => s.id === activeServerId);
  const activeServer = activeServerIndex !== -1 ? STREAMING_SERVERS[activeServerIndex] : STREAMING_SERVERS[0];

  const handleAutoSyncServer = useCallback((targetServerId?: string) => {
    let nextServer;
    if (targetServerId) {
      nextServer = STREAMING_SERVERS.find((s) => s.id === targetServerId) || STREAMING_SERVERS[0];
    } else {
      const nextIndex = (activeServerIndex + 1) % STREAMING_SERVERS.length;
      nextServer = STREAMING_SERVERS[nextIndex];
    }

    setActiveServerId(nextServer.id);
    setIframeKey((k) => k + 1);
    triggerToast(`⚡ Auto-Synced: Server #${STREAMING_SERVERS.findIndex(s => s.id === nextServer.id) + 1} (${nextServer.name})`);
  }, [activeServerIndex, triggerToast]);

  // Refresh current stream
  const handleRefreshStream = () => {
    setIframeKey((k) => k + 1);
    triggerToast(`🔄 Stream reloaded on ${activeServer.name}`);
  };

  // 9. Simulated live playback progress timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= durationSec) return 0;
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, durationSec]);

  // 10. Fetch Deep Details & TV Seasons
  useEffect(() => {
    let isMounted = true;
    fetchMediaDetails(media.id, isTv ? 'tv' : 'movie')
      .then((data) => {
        if (!isMounted) return;
        setDetails(data);
        if (data.runtime) {
          setDurationSec(data.runtime * 60);
        } else if ((data as any).episode_run_time?.[0]) {
          setDurationSec((data as any).episode_run_time[0] * 60);
        }
      })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [media.id, isTv]);

  useEffect(() => {
    if (!isTv) return;
    let isMounted = true;
    setLoadingEpisodes(true);

    fetchTVSeason(media.id, currentSeason)
      .then((data) => {
        if (isMounted) {
          setSeasonData(data);
          setLoadingEpisodes(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoadingEpisodes(false);
      });

    return () => { isMounted = false; };
  }, [media.id, currentSeason, isTv]);

  // 11. Full Keyboard Shortcuts (Space, Arrows, F, S, H, Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        skipSeconds(-10);
      } else if (e.code === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        skipSeconds(10);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleAutoSyncServer();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleChangeAudio(selectedAudio === 'hindi' ? 'english' : 'hindi');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
        triggerToast(!isMuted ? '🔇 Audio Muted' : '🔊 Audio Unmuted');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTimeSec, durationSec, selectedAudio, isMuted, handleAutoSyncServer]);

  // Compute Current Server URL
  const playerUrl = isTv
    ? activeServer.getTvUrl(media.id, currentSeason, currentEpisode)
    : activeServer.getMovieUrl(media.id);

  // Copy Permastream Link
  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      triggerToast('🔗 Cinema stream permalink copied to clipboard!');
    }
  };

  // Close or Navigate Back
  const handleClosePlayer = () => {
    if (onClose) {
      onClose();
    } else if (window.opener) {
      window.close();
    } else {
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#07080d] text-white flex flex-col font-sans select-none">
      
      {/* Floating HUD Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#101322]/95 border-2 border-emerald-500 text-emerald-300 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top VIP Cinema Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0b12]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleClosePlayer}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer flex-shrink-0"
            title="Return to Main Portal"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                VIP CINEMA
              </span>
              <h1 className="text-sm sm:text-base md:text-lg font-black text-white truncate">
                {title}
              </h1>
              {year && <span className="text-gray-400 text-xs hidden sm:inline">({year})</span>}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {rating}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Server #{activeServerIndex + 1} ({activeServer.name.split(' ')[0]})</span>
              <span>•</span>
              <span className="text-gray-300 font-semibold">{selectedQuality.toUpperCase()}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{selectedAudio === 'hindi' ? 'Hindi Audio' : selectedAudio === 'english' ? 'English 5.1' : 'Dual Audio'}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Help & Audio Guide */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Audio & Player Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Copy Share Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Download Button */}
          <button
            onClick={() => onOpenDownload ? onOpenDownload(media) : window.open(`https://player.autoembed.cc/embed/movie/${media.id}?server=streamtape`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            title="Download Movie in 4K / 1080p"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download</span>
          </button>

          {/* Fullscreen Button in Header */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black transition-all cursor-pointer shadow-md shadow-amber-500/20"
            title="Toggle True Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 stroke-[2.5]" /> : <Maximize className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Close Window */}
          <button
            onClick={handleClosePlayer}
            className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all cursor-pointer border border-red-500/30"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Player Canvas Container */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 gap-3">
        
        {/* 20 Live Streaming Servers Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider flex-shrink-0 mr-1">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="hidden sm:inline">20 Servers:</span>
          </div>

          {STREAMING_SERVERS.map((srv, idx) => {
            const isCur = srv.id === activeServerId;
            return (
              <button
                key={srv.id}
                onClick={() => handleAutoSyncServer(srv.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 border ${
                  isCur
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-[#121422] text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                }`}
                title={`${srv.name} (${srv.speed} - ${srv.quality})`}
              >
                <span>S{idx + 1}</span>
                <span className="hidden md:inline text-[11px] font-bold opacity-90">{srv.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* TV Series Episode & Season Quick Bar (Only for TV Shows) */}
        {isTv && (
          <div className="bg-[#10121d] border border-white/10 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-red-400 uppercase text-[11px] flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" /> TV Episodes:
              </span>
              
              {/* Season Select */}
              <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <span className="text-gray-400 text-[11px] font-bold">Season:</span>
                <select
                  value={currentSeason}
                  onChange={(e) => {
                    setCurrentSeason(Number(e.target.value));
                    setCurrentEpisode(1);
                  }}
                  className="bg-transparent text-white font-black text-xs focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: details?.number_of_seasons || 10 }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s} className="bg-[#12141f]">Season {s}</option>
                  ))}
                </select>
              </div>

              {/* Episode Select */}
              <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <span className="text-gray-400 text-[11px] font-bold">Episode:</span>
                <select
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                  className="bg-transparent text-white font-black text-xs focus:outline-none cursor-pointer"
                >
                  {seasonData?.episodes ? (
                    seasonData.episodes.map((ep) => (
                      <option key={ep.episode_number} value={ep.episode_number} className="bg-[#12141f]">
                        Ep {ep.episode_number}: {ep.name || `Episode ${ep.episode_number}`}
                      </option>
                    ))
                  ) : (
                    Array.from({ length: 30 }, (_, i) => i + 1).map((ep) => (
                      <option key={ep} value={ep} className="bg-[#12141f]">Episode {ep}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Prev / Next Episode Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentEpisode <= 1}
                onClick={() => setCurrentEpisode((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Ep</span>
              </button>

              <button
                onClick={() => setCurrentEpisode((prev) => prev + 1)}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next Ep</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CINEMA STAGE: Screen Frame + Video Display */}
        <div 
          ref={cinemaWrapperRef}
          className={`relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 group aspect-video w-full transition-all duration-300 ${
            theaterMode ? 'max-w-full' : ''
          }`}
        >
          {/* Floating Badges */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
            <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              {activeServer.name.toUpperCase()}
            </span>
            <span className="bg-black/85 backdrop-blur-md text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-400/40">
              {selectedQuality.toUpperCase()}
            </span>
            <span className="bg-black/85 backdrop-blur-md text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-400/40">
              {selectedAudio === 'hindi' ? '🇮🇳 HINDI DUBBED' : selectedAudio === 'english' ? '🌐 ENGLISH 5.1' : '🎧 DUAL AUDIO'}
            </span>
          </div>

          {/* Floating Corner Fullscreen & Reload Trigger */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
            <button
              onClick={handleRefreshStream}
              className="p-2 rounded-xl bg-black/80 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 shadow"
              title="Refresh / Re-sync Stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 shadow"
              title="100% True Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 stroke-[2.5]" /> : <Maximize className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          {/* Unblocked Direct Video Frame */}
          <iframe
            key={`${iframeKey}-${activeServerId}-${isTv ? `${currentSeason}-${currentEpisode}` : 'movie'}`}
            ref={iframeRef}
            src={playerUrl}
            title={`Streaming ${title}`}
            className="w-full h-full border-0 absolute inset-0 z-10 bg-black"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; screen-wake-lock; display-capture"
          />

          {/* Quick HUD Overlay Bar when hovering inside player */}
          <div className="absolute bottom-3 left-3 right-3 z-30 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 flex items-center justify-between text-xs opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlayPause} 
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-transform active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button 
                onClick={() => skipSeconds(-10)} 
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="Rewind 10 Seconds"
              >
                <RotateCcw className="w-3 h-3" /> -10s
              </button>
              <button 
                onClick={() => skipSeconds(10)} 
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="Fast-Forward 10 Seconds"
              >
                +10s <RotateCw className="w-3 h-3" />
              </button>
              <span className="text-[11px] text-gray-300 font-mono hidden sm:inline ml-2">
                {formatTime(currentTimeSec)} / {formatTime(durationSec)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAutoSyncServer()} 
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black cursor-pointer flex items-center gap-1 shadow"
                title="Auto-Switch Next Working Server"
              >
                <Zap className="w-3 h-3 fill-black" /> Next Server
              </button>
              <button 
                onClick={toggleFullscreen} 
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer" 
                title="True Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MASTER CINEMA CONTROL DECK (The Complete Suite: Skip, Stop/Start, Quality, Dual Audio, Fullscreen) */}
        <section className="bg-[#0f111e] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
          
          {/* 1. INTERACTIVE PROGRESS SEEK BAR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{formatTime(currentTimeSec)}</span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{formatTime(durationSec)}</span>
                <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.2 rounded font-sans ml-1">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="text-[11px] text-gray-400 hidden sm:flex items-center gap-2">
                <span>Speed: <strong className="text-amber-400">{playbackSpeed}x</strong></span>
                <span>•</span>
                <span>Status: <strong className={isPlaying ? 'text-emerald-400' : 'text-amber-400'}>{isPlaying ? 'Playing' : 'Paused'}</strong></span>
              </div>
            </div>

            {/* Slider track */}
            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={durationSec}
                step={1}
                value={currentTimeSec}
                onChange={handleSeekProgress}
                className="w-full h-2.5 bg-gray-700/60 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none transition-all group-hover:h-3"
              />
            </div>
          </div>

          {/* 2. MAIN CONTROLS ROW (Play/Pause, Skip -10s, +10s, -30s, +30s, Quality, Audio, Fullscreen) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
            
            {/* Playback & Skip Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Play / Pause Toggle (Stop / Start) */}
              <button
                onClick={togglePlayPause}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer transform active:scale-95"
                title={isPlaying ? 'Pause Playback (Stop)' : 'Start Playback (Play)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              {/* Rewind -10s */}
              <button
                onClick={() => skipSeconds(-10)}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="Rewind 10 Seconds (-10s)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>-10s</span>
              </button>

              {/* Fast-Forward +10s */}
              <button
                onClick={() => skipSeconds(10)}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="Fast-Forward 10 Seconds (+10s)"
              >
                <span>+10s</span>
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Jump -30s */}
              <button
                onClick={() => skipSeconds(-30)}
                className="hidden md:flex px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-xs items-center gap-1 transition-all cursor-pointer"
                title="Rewind 30 Seconds (-30s)"
              >
                <span>-30s</span>
              </button>

              {/* Jump +30s */}
              <button
                onClick={() => skipSeconds(30)}
                className="hidden md:flex px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-xs items-center gap-1 transition-all cursor-pointer"
                title="Fast-Forward 30 Seconds (+30s)"
              >
                <span>+30s</span>
              </button>

              {/* Restart from beginning */}
              <button
                onClick={() => {
                  setCurrentTimeSec(0);
                  postPlayerMessage('seekTo', 0);
                  triggerToast('⏮️ Restarted movie from 00:00:00');
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quality & Audio Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Quality Dropdown */}
              <div className="flex items-center gap-1 bg-[#161828] px-2.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase">Quality:</span>
                <select
                  value={selectedQuality}
                  onChange={(e) => handleChangeQuality(e.target.value as any)}
                  className="bg-transparent text-amber-400 font-black text-xs focus:outline-none cursor-pointer"
                >
                  <option value="4k" className="bg-[#12141f]">💎 4K Ultra HD (2160p HDR)</option>
                  <option value="1080p" className="bg-[#12141f]">✨ 1080p Full HD (BluRay)</option>
                  <option value="720p" className="bg-[#12141f]">⚡ 720p HD (High Speed)</option>
                  <option value="480p" className="bg-[#12141f]">📱 480p SD (Data Saver)</option>
                </select>
              </div>

              {/* Dual Audio & Language Dropdown */}
              <div className="flex items-center gap-1 bg-[#161828] px-2.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase">Audio:</span>
                <select
                  value={selectedAudio}
                  onChange={(e) => handleChangeAudio(e.target.value as any)}
                  className="bg-transparent text-emerald-400 font-black text-xs focus:outline-none cursor-pointer"
                >
                  <option value="hindi" className="bg-[#12141f]">🇮🇳 Hindi Dubbed (Bollywood)</option>
                  <option value="english" className="bg-[#12141f]">🌐 English Original (5.1 Dolby)</option>
                  <option value="dual" className="bg-[#12141f]">🎧 Dual Audio (Multi-Language)</option>
                </select>
              </div>

              {/* Playback Speed Selector */}
              <div className="hidden lg:flex items-center gap-1 bg-[#161828] px-2.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                <Gauge className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="bg-transparent text-gray-200 font-black text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.75} className="bg-[#12141f]">0.75x</option>
                  <option value={1.0} className="bg-[#12141f]">1.0x (Normal)</option>
                  <option value={1.25} className="bg-[#12141f]">1.25x</option>
                  <option value={1.5} className="bg-[#12141f]">1.5x</option>
                  <option value={2.0} className="bg-[#12141f]">2.0x</option>
                </select>
              </div>

              {/* True Fullscreen Action Button */}
              <button
                onClick={toggleFullscreen}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95"
                title="Activate 100% Fullscreen Mode"
              >
                {isFullscreen ? <Minimize className="w-4 h-4 stroke-[2.5]" /> : <Maximize className="w-4 h-4 stroke-[2.5]" />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* 3. PRO STREAM SYNC & CONTROLS TOOLBAR */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Auto-Switch & Server Engine Status */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300 font-semibold">Active Engine:</span>
              <span className="text-white font-extrabold">{activeServer.name}</span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-md">
                {activeServer.quality}
              </span>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAutoSyncServer()}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
                title="If current server buffers, click to auto-sync next server"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Auto-Sync Next Server</span>
              </button>

              <button
                onClick={handleRefreshStream}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reload video stream"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Stream</span>
              </button>
            </div>
          </div>
        </section>

        {/* HIGH-CPM MONETIZATION BANNER (Clean placement below player) */}
        <AdsterraAdBanner format="stream_accelerator" className="my-1" />

        {/* HINDI / DUAL AUDIO & KEYBOARD GUIDE NOTICE */}
        <div className="bg-[#0b0d18] border border-emerald-500/20 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <h4 className="font-black text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>🇮🇳 Hindi Dubbed / Dual Audio & Fullscreen Guidance:</span>
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px] sm:text-xs">
              Hindi Dubbed audio is enabled by default on <strong>Server 1 (SuperEmbed)</strong>, <strong>Server 2 (AutoEmbed)</strong>, and <strong>Server 5 (SmashyStream)</strong>. To switch audio tracks or subtitles manually, you can also tap the audio/cog icon inside the stream player frame. Press <strong>'F'</strong> for Fullscreen or <strong>Space</strong> to Play/Pause.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleChangeAudio('hindi')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/50 font-black text-xs transition-all cursor-pointer"
            >
              🇮🇳 Force Hindi Audio
            </button>
          </div>
        </div>
      </main>

      {/* HELP & SHORTCUTS MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121422] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Player Controls & Shortcuts Guide
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg bg-white/10 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Keyboard Shortcuts:</h5>
                <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">Space</span>: Play / Pause</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">← / J</span>: -10s Rewind</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">→ / L</span>: +10s Forward</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">F</span>: 100% Fullscreen</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">S</span>: Next Server</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">H</span>: Hindi Audio Track</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">M</span>: Mute / Unmute</li>
                  <li className="bg-white/5 p-2 rounded-lg"><span className="text-amber-400 font-bold">Esc</span>: Close Player</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px] leading-relaxed">
                <strong>🇮🇳 Hindi Audio Help:</strong> If Hindi audio is not playing immediately, click the audio track icon inside the video frame, or click "Next Server" to load Server 1 / Server 5 with multi-audio sources.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-colors cursor-pointer"
            >
              Got it, continue streaming!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
