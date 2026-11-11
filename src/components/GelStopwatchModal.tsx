import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { playGelPop, playGlassPing } from '../utils/gelSound';

interface StopwatchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GelStopwatchModal: React.FC<StopwatchProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isOpen) return null;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    playGelPop(isRunning ? 'low' : 'high');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    playGlassPing(false);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [time, ...prev]);
      playGelPop('med');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xs liquid-glass-plate rounded-[40px] p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/40">
          <span className="text-xs font-bold text-stone-800 tracking-wider uppercase">Gel Chronometer</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full gel-cream flex items-center justify-center cursor-pointer active:scale-90"
          >
            <div className="gel-sheen" />
            <X className="w-3.5 h-3.5 text-stone-900" />
          </button>
        </div>

        {/* Stopwatch Screen */}
        <div className="rounded-3xl bg-white/50 border border-white/80 p-5 mb-5 shadow-inner text-center">
          <span className="text-3xl font-black text-stone-900 font-mono tracking-tight drop-shadow-sm">
            {formatTime(time)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handleReset}
            className="w-14 h-14 rounded-full gel-cream flex items-center justify-center cursor-pointer active:scale-95"
            title="Reset"
          >
            <div className="gel-sheen" />
            <RotateCcw className="w-5 h-5 text-stone-800" />
          </button>

          <button
            onClick={handleStartPause}
            className="w-16 h-16 rounded-full gel-pink flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
            title={isRunning ? 'Pause' : 'Start'}
          >
            <div className="gel-sheen" />
            {isRunning ? (
              <Pause className="w-6 h-6 text-stone-950 fill-current" />
            ) : (
              <Play className="w-6 h-6 text-stone-950 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className={`w-14 h-14 rounded-full gel-cream flex items-center justify-center cursor-pointer active:scale-95 ${!isRunning ? 'opacity-50 pointer-events-none' : ''}`}
            title="Lap"
          >
            <div className="gel-sheen" />
            <Flag className="w-5 h-5 text-stone-800" />
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-none">
            {laps.map((lapTime, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs px-2 py-1 bg-white/40 rounded-lg">
                <span className="font-semibold text-stone-600">Lap {laps.length - idx}</span>
                <span className="font-mono font-bold text-stone-900">{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
