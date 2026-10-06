import React from 'react';
import { X, Trash2, Play, Bookmark, History, Star, Clock } from 'lucide-react';
import { MediaItem, WatchHistoryItem } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/tmdb';

interface WatchlistDrawerProps {
  initialTab?: 'watchlist' | 'history';
  onClose: () => void;
  onPlayMedia: (item: MediaItem) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  initialTab = 'watchlist',
  onClose,
  onPlayMedia,
}) => {
  const [activeTab, setActiveTab] = React.useState<'watchlist' | 'history'>(initialTab);
  const { watchlist, removeFromWatchlist, history, clearHistory } = useWatchlist();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11131c] border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'watchlist'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Watchlist ({watchlist.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History ({history.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'watchlist' ? (
              watchlist.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
                  <p className="text-sm font-semibold text-gray-400">
                    Your watchlist is empty
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Add movies and TV shows from the home page or detail modals to watch them later.
                  </p>
                </div>
              ) : (
                watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                  >
                    <img
                      src={getImageUrl(item.poster_path, 'w300')}
                      alt={item.title || item.name}
                      className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.title || item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-gray-300">
                          {item.media_type || (item.title ? 'Movie' : 'TV')}
                        </span>
                        {item.vote_average ? (
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onPlayMedia(item);
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md shadow-red-600/30"
                        title="Watch Now"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : history.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <History className="w-12 h-12 text-gray-600 mx-auto" />
                <p className="text-sm font-semibold text-gray-400">
                  No watch history yet
                </p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Movies and episodes you stream will be automatically logged here for fast resume.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-end pb-2">
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear History
                  </button>
                </div>
                {history.map((h) => {
                  const mediaItem: MediaItem = {
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
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                      <img
                        src={getImageUrl(h.posterPath, 'w300')}
                        alt={h.title}
                        className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {h.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-400">
                          {h.mediaType === 'tv' && h.season && h.episode ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                              S{h.season}:E{h.episode}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase">
                              Movie
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(h.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onPlayMedia(mediaItem);
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md shadow-red-600/30"
                        title="Resume Playing"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
