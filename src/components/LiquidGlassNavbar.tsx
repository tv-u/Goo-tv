import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, LayoutGrid, Smartphone, Layers, Palette } from 'lucide-react';
import { playGelPop, playGlassPing, toggleMute, getMuted } from '../utils/gelSound';

interface NavbarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  viewMode: 'compact' | 'expanded';
  onViewModeChange: (mode: 'compact' | 'expanded') => void;
}

export const LiquidGlassNavbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeChange,
  viewMode,
  onViewModeChange
}) => {
  const [muted, setMuted] = useState(getMuted());
  const [timeStr, setTimeStr] = useState('01:57');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const themes = [
    { id: 'sakura', name: 'Sakura Blush', color: '#fbcfe8' },
    { id: 'vanilla', name: 'Vanilla Cream', color: '#fef3c7' },
    { id: 'rose', name: 'Rose Quartz', color: '#fda4af' },
    { id: 'crystal', name: 'Crystal White', color: '#ffffff' },
  ];

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
    playGlassPing(!newMuted);
  };

  return (
    <header className="sticky top-3 z-40 max-w-5xl mx-auto px-3 sm:px-6 my-2">
      <nav className="liquid-glass-plate rounded-full py-2.5 px-4 sm:px-6 flex items-center justify-between shadow-xl">
        
        {/* Brand Pill Capsule */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gel-pink flex items-center justify-center shadow-md">
            <div className="gel-sheen" />
            <Sparkles className="w-4 h-4 text-stone-950" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-stone-900 tracking-tight flex items-center gap-1.5">
              LUMIÈRE <span className="text-rose-500 font-black">GEL</span>
            </span>
          </div>
        </div>

        {/* Center: Status & Time Pill */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1 rounded-full bg-white/40 border border-white/60 shadow-inner text-xs font-bold text-stone-800">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{timeStr}</span>
          <span className="text-stone-400">·</span>
          <span>3D Liquid Glassmorphism</span>
        </div>

        {/* Right Controls Group */}
        <div className="flex items-center gap-2">
          
          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="w-9 h-9 rounded-full gel-cream flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            title={muted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            <div className="gel-sheen" />
            {muted ? (
              <VolumeX className="w-4 h-4 text-stone-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-stone-900" />
            )}
          </button>

          {/* View Mode Switcher Pill */}
          <div className="flex items-center p-1 rounded-full bg-white/40 border border-white/60">
            <button
              onClick={() => {
                onViewModeChange('compact');
                playGelPop('med');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                viewMode === 'compact'
                  ? 'gel-pink text-stone-950 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
              title="Reference Control Center Layout"
            >
              {viewMode === 'compact' && <div className="gel-sheen" />}
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Center</span>
            </button>
            <button
              onClick={() => {
                onViewModeChange('expanded');
                playGelPop('high');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                viewMode === 'expanded'
                  ? 'gel-pink text-stone-950 shadow-sm'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
              title="Full Design System Showcase"
            >
              {viewMode === 'expanded' && <div className="gel-sheen" />}
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Showcase</span>
            </button>
          </div>

          {/* Theme Dropdown / Pills */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  onThemeChange(t.id);
                  playGelPop('med');
                }}
                className={`w-6 h-6 rounded-full border border-white/80 transition-transform cursor-pointer ${
                  currentTheme === t.id ? 'scale-125 ring-2 ring-rose-400' : 'hover:scale-110 opacity-70'
                }`}
                style={{ backgroundColor: t.color }}
                title={t.name}
              />
            ))}
          </div>

        </div>

      </nav>
    </header>
  );
};
