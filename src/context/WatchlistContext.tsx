import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MediaItem, WatchHistoryItem } from '../types/movie';

interface WatchlistContextType {
  watchlist: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  history: WatchHistoryItem[];
  addToHistory: (
    item: MediaItem,
    details?: { season?: number; episode?: number; serverId?: string }
  ) => void;
  clearHistory: () => void;
  preferredServer: string;
  setPreferredServer: (serverId: string) => void;
  playerSkin: string;
  setPlayerSkin: (skin: string) => void;
  autoSyncServers: boolean;
  setAutoSyncServers: (enabled: boolean) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinesphere_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinesphere_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [preferredServer, setPreferredServerState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cinesphere_server');
      if (!saved || saved === 'vidsrc-to' || saved === 'superembed') {
        try { localStorage.setItem('cinesphere_server', 'autoembed'); } catch {}
        return 'autoembed';
      }
      return saved;
    } catch {
      return 'autoembed';
    }
  });

  const [playerSkin, setPlayerSkinState] = useState<string>(() => {
    try {
      return localStorage.getItem('cinesphere_skin') || 'videojs';
    } catch {
      return 'videojs';
    }
  });

  const [autoSyncServers, setAutoSyncServersState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cinesphere_autosync') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinesphere_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('cinesphere_history', JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('cinesphere_server', preferredServer);
    } catch {}
  }, [preferredServer]);

  useEffect(() => {
    try {
      localStorage.setItem('cinesphere_skin', playerSkin);
    } catch {}
  }, [playerSkin]);

  useEffect(() => {
    try {
      localStorage.setItem('cinesphere_autosync', String(autoSyncServers));
    } catch {}
  }, [autoSyncServers]);

  const addToWatchlist = useCallback((item: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWatchlist = useCallback((id: number) => {
    return watchlist.some((i) => i.id === id);
  }, [watchlist]);

  const setPreferredServer = useCallback((serverId: string) => {
    setPreferredServerState(serverId);
  }, []);

  const setPlayerSkin = useCallback((skin: string) => {
    setPlayerSkinState(skin);
  }, []);

  const setAutoSyncServers = useCallback((enabled: boolean) => {
    setAutoSyncServersState(enabled);
  }, []);

  const addToHistory = useCallback((
    item: MediaItem,
    details?: { season?: number; episode?: number; serverId?: string }
  ) => {
    setHistory((prev) => {
      // Check if the most recent item is already this exact item to prevent duplicates
      if (prev.length > 0 && prev[0].id === item.id && prev[0].season === details?.season && prev[0].episode === details?.episode) {
        return prev;
      }

      const historyEntry: WatchHistoryItem = {
        id: item.id,
        mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
        title: item.title || item.name || 'Unknown Title',
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        voteAverage: item.vote_average,
        season: details?.season,
        episode: details?.episode,
        serverId: details?.serverId || 'superembed',
        timestamp: Date.now(),
      };

      const filtered = prev.filter((h) => h.id !== item.id);
      return [historyEntry, ...filtered].slice(0, 50); // Keep last 50
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const contextValue = useMemo(() => ({
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    history,
    addToHistory,
    clearHistory,
    preferredServer,
    setPreferredServer,
    playerSkin,
    setPlayerSkin,
    autoSyncServers,
    setAutoSyncServers,
  }), [
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    history,
    addToHistory,
    clearHistory,
    preferredServer,
    setPreferredServer,
    playerSkin,
    setPlayerSkin,
    autoSyncServers,
    setAutoSyncServers,
  ]);

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
