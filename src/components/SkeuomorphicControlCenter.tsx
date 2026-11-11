import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  ArrowUpDown, 
  Wifi, 
  Bluetooth, 
  RotateCcw, 
  BellOff, 
  Bell,
  Sun, 
  Volume2, 
  VolumeX, 
  Moon, 
  Flashlight, 
  Timer as TimerIcon, 
  Calculator as CalcIcon, 
  Camera as CameraIcon, 
  AudioWaveform, 
  Disc, 
  BatteryMedium, 
  Tv, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Sparkles,
  Check
} from 'lucide-react';
import { playGelPop, playGlassPing, playSliderHaptic } from '../utils/gelSound';

interface ControlCenterProps {
  onBrightnessChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onOpenCalculator?: () => void;
  onOpenTimer?: () => void;
  onOpenCinema?: () => void;
}

export const SkeuomorphicControlCenter: React.FC<ControlCenterProps> = ({
  onBrightnessChange,
  onVolumeChange,
  onOpenCalculator,
  onOpenTimer,
  onOpenCinema
}) => {
  // Connectivity states
  const [airplane, setAirplane] = useState(false);
  const [cellular, setCellular] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  // Quick Action states
  const [rotationLock, setRotationLock] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [lowPower, setLowPower] = useState(false);
  const [airplayActive, setAirplayActive] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Sliders
  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(65);
  const brightnessRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isDraggingBrightness, setIsDraggingBrightness] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Music Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = [
    { title: 'Sakura Reverie', artist: 'Hana & Lofi Garden' },
    { title: 'Blush Velvet', artist: 'Pastel Dreamscape' },
    { title: 'Whispering Petals', artist: 'Aura Ambient Strings' },
    { title: 'Vanilla Raindrop', artist: 'Skeuo Sound Studio' }
  ];

  // Screen recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  // Brightness drag handlers
  const handleBrightnessMove = (clientY: number) => {
    if (!brightnessRef.current) return;
    const rect = brightnessRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const clampedY = Math.max(0, Math.min(rect.height, relativeY));
    const newPercent = Math.round(100 - (clampedY / rect.height) * 100);
    setBrightness(newPercent);
    playSliderHaptic();
    onBrightnessChange?.(newPercent);
  };

  // Volume drag handlers
  const handleVolumeMove = (clientY: number) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const clampedY = Math.max(0, Math.min(rect.height, relativeY));
    const newPercent = Math.round(100 - (clampedY / rect.height) * 100);
    setVolume(newPercent);
    playSliderHaptic();
    onVolumeChange?.(newPercent);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingBrightness) handleBrightnessMove(e.clientY);
      if (isDraggingVolume) handleVolumeMove(e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingBrightness && e.touches[0]) handleBrightnessMove(e.touches[0].clientY);
      if (isDraggingVolume && e.touches[0]) handleVolumeMove(e.touches[0].clientY);
    };
    const onEnd = () => {
      setIsDraggingBrightness(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingBrightness || isDraggingVolume) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingBrightness, isDraggingVolume]);

  const currentTrack = playlist[trackIndex];

  return (
    <div className="relative w-full max-w-[430px] mx-auto select-none p-3 sm:p-5">
      {/* Background Soft Refractive Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-pink-300/30 via-rose-200/20 to-amber-100/30 rounded-[50px] blur-2xl -z-10 pointer-events-none" />

      {/* Main Control Matrix Grid */}
      <div className="space-y-4">
        
        {/* ROW 1: Connectivity Squircle Glass + Floral Music Player Squircle Glass */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* CONNECTIVITY SQUIRCLE GLASS TILE */}
          <div className="liquid-glass-plate rounded-[36px] p-3 sm:p-3.5 flex flex-col justify-between aspect-square relative group">
            {/* Specular Glare across card edge */}
            <div className="absolute inset-x-4 top-1 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 h-full items-center justify-items-center">
              
              {/* Airplane Mode (Cream Gel) */}
              <button
                onClick={() => {
                  setAirplane(!airplane);
                  playGlassPing(!airplane);
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
                  airplane ? 'gel-pink' : 'gel-cream'
                }`}
                aria-label="Airplane Mode"
                title={airplane ? 'Airplane Mode: On' : 'Airplane Mode: Off'}
              >
                <div className="gel-sheen" />
                <div className="gel-crescent" />
                <Plane className={`w-6 h-6 z-10 transition-transform ${airplane ? 'text-white rotate-45' : 'text-stone-900'}`} />
              </button>

              {/* Cellular Data (Pink Gel) */}
              <button
                onClick={() => {
                  setCellular(!cellular);
                  playGlassPing(!cellular);
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
                  cellular ? 'gel-pink' : 'gel-cream'
                }`}
                aria-label="Cellular Data"
                title={cellular ? 'Cellular Data: 5G Active' : 'Cellular Data: Off'}
              >
                <div className="gel-sheen" />
                <div className="gel-crescent" />
                <ArrowUpDown className={`w-6 h-6 z-10 ${cellular ? 'text-stone-950 font-bold' : 'text-stone-500'}`} />
              </button>

              {/* Wi-Fi (Pink Gel) */}
              <button
                onClick={() => {
                  setWifi(!wifi);
                  playGlassPing(!wifi);
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
                  wifi ? 'gel-pink' : 'gel-cream'
                }`}
                aria-label="Wi-Fi"
                title={wifi ? 'Wi-Fi: Connected (Sakura-5G)' : 'Wi-Fi: Disconnected'}
              >
                <div className="gel-sheen" />
                <div className="gel-crescent" />
                <Wifi className={`w-6 h-6 z-10 ${wifi ? 'text-stone-950 font-bold' : 'text-stone-500'}`} />
              </button>

              {/* Bluetooth (Cream Gel) */}
              <button
                onClick={() => {
                  setBluetooth(!bluetooth);
                  playGlassPing(!bluetooth);
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
                  bluetooth ? 'gel-pink' : 'gel-cream'
                }`}
                aria-label="Bluetooth"
                title={bluetooth ? 'Bluetooth: Connected' : 'Bluetooth: Off'}
              >
                <div className="gel-sheen" />
                <div className="gel-crescent" />
                <Bluetooth className={`w-6 h-6 z-10 ${bluetooth ? 'text-white' : 'text-stone-900'}`} />
              </button>
            </div>
          </div>

          {/* MUSIC / AMBIENT FLORAL SQUIRCLE GLASS TILE */}
          <div className="liquid-glass-plate rounded-[36px] p-3.5 sm:p-4 aspect-square relative overflow-hidden flex flex-col justify-between">
            {/* Botanical Floral Refraction in Glass (Matching Reference Image) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-multiply pointer-events-none scale-105"
              style={{ backgroundImage: `url('/cherry_blossom_sprig.jpg')` }}
            />
            {/* Ambient Glass Mist Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-pink-100/30 to-white/70 backdrop-blur-[2px] pointer-events-none" />
            <div className="absolute inset-x-4 top-1 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

            {/* Track Info */}
            <div className="relative z-10 pt-1">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-tight truncate drop-shadow-sm">
                {currentTrack.title}
              </h3>
              <p className="text-xs font-semibold text-rose-900/70 truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Animated Soundwave Ribbon */}
            <div className="relative z-10 flex items-center gap-1 my-1 px-0.5">
              {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-rose-400 to-pink-200 transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(4, (h * (volume / 100)))}px` : '4px',
                    opacity: isPlaying ? 0.9 : 0.4
                  }}
                />
              ))}
            </div>

            {/* Media Player Controls (Glass Capsule Sheen) */}
            <div className="relative z-10 flex items-center justify-between px-1">
              {/* Prev */}
              <button
                onClick={() => {
                  setTrackIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1));
                  playGelPop('low');
                }}
                className="p-2 text-stone-900 hover:text-rose-700 active:scale-90 transition-transform cursor-pointer"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  playGelPop('high');
                }}
                className="w-10 h-10 rounded-full gel-pink flex items-center justify-center cursor-pointer active:scale-90 transition-transform shadow-md"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <div className="gel-sheen" />
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-stone-950 fill-current z-10" />
                ) : (
                  <Play className="w-4 h-4 text-stone-950 fill-current ml-0.5 z-10" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  setTrackIndex(prev => (prev + 1) % playlist.length);
                  playGelPop('med');
                }}
                className="p-2 text-stone-900 hover:text-rose-700 active:scale-90 transition-transform cursor-pointer"
                aria-label="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Rotation Lock + Mute Bell + Brightness Slider + Volume Slider */}
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
          
          {/* Left Column: Stack of 2 Circular Gel Buttons */}
          <div className="col-span-2 grid grid-cols-2 gap-3.5 sm:gap-4">
            
            {/* Rotation Lock (Cream Gel) */}
            <button
              onClick={() => {
                setRotationLock(!rotationLock);
                playGlassPing(!rotationLock);
              }}
              className={`aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gel-transition ${
                rotationLock ? 'gel-cream' : 'gel-pink'
              }`}
              aria-label="Screen Rotation Lock"
              title={rotationLock ? 'Rotation Locked' : 'Rotation Unlocked'}
            >
              <div className="gel-sheen" />
              <div className="gel-crescent" />
              <div className={`transition-transform duration-500 z-10 ${rotationLock ? 'rotate-0' : 'rotate-90'}`}>
                <RotateCcw className={`w-7 h-7 sm:w-8 sm:h-8 ${rotationLock ? 'text-stone-900' : 'text-stone-950 font-bold'}`} />
              </div>
            </button>

            {/* Silent Mode Bell (Pink Gel) */}
            <button
              onClick={() => {
                setSilentMode(!silentMode);
                playGlassPing(!silentMode);
              }}
              className={`aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gel-transition ${
                silentMode ? 'gel-pink' : 'gel-cream'
              }`}
              aria-label="Mute Audio"
              title={silentMode ? 'Silent Mode On' : 'Sound Enabled'}
            >
              <div className="gel-sheen" />
              <div className="gel-crescent" />
              {silentMode ? (
                <BellOff className="w-7 h-7 sm:w-8 sm:h-8 text-stone-950 font-bold z-10 animate-bounce" />
              ) : (
                <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-stone-900 z-10" />
              )}
            </button>
          </div>

          {/* BRIGHTNESS VERTICAL SQUIRCLE CAPSULE SLIDER (Pink/Cream Split) */}
          <div
            ref={brightnessRef}
            onMouseDown={() => setIsDraggingBrightness(true)}
            onTouchStart={() => setIsDraggingBrightness(true)}
            className="gel-slider-vertical rounded-[36px] sm:rounded-[40px] h-[134px] sm:h-[148px] flex flex-col justify-end cursor-ns-resize relative group"
            title={`Brightness: ${brightness}%`}
          >
            {/* Specular high-gloss sheen */}
            <div className="absolute inset-x-2 top-1.5 h-10 bg-gradient-to-b from-white/95 to-transparent rounded-full pointer-events-none z-20" />
            
            {/* Top Pink Liquid Gel Fill */}
            <div 
              className="w-full absolute top-0 left-0 right-0 transition-all duration-75 gel-pink"
              style={{ height: `${brightness}%` }}
            >
              <div className="gel-sheen" />
            </div>

            {/* Bottom Cream Gel Base & Icon */}
            <div className="w-full relative z-10 pb-3 sm:pb-3.5 flex flex-col items-center justify-center pointer-events-none">
              <Sun className="w-6 h-6 text-stone-900 drop-shadow-sm stroke-[2.2]" />
              <span className="text-[10px] font-extrabold text-stone-900/80 mt-0.5">{brightness}%</span>
            </div>
          </div>

          {/* VOLUME VERTICAL SQUIRCLE CAPSULE SLIDER (Floral Gel Refraction) */}
          <div
            ref={volumeRef}
            onMouseDown={() => setIsDraggingVolume(true)}
            onTouchStart={() => setIsDraggingVolume(true)}
            className="gel-slider-vertical rounded-[36px] sm:rounded-[40px] h-[134px] sm:h-[148px] flex flex-col justify-end cursor-ns-resize relative group overflow-hidden"
            title={`Volume: ${volume}%`}
          >
            {/* Botanical Floral Artwork in Glass (Reference Image) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none scale-125"
              style={{ backgroundImage: `url('/cherry_blossom_ambient.jpg')` }}
            />
            {/* Liquid Volume Gel Fill */}
            <div 
              className="w-full absolute bottom-0 left-0 right-0 transition-all duration-75 bg-gradient-to-t from-pink-400/80 to-rose-300/60 backdrop-blur-sm"
              style={{ height: `${volume}%` }}
            />
            {/* Top Specular Crescent */}
            <div className="absolute inset-x-2 top-1.5 h-10 bg-gradient-to-b from-white/90 to-transparent rounded-full pointer-events-none z-20" />

            {/* Bottom Speaker Icon */}
            <div className="w-full relative z-10 pb-3 sm:pb-3.5 flex flex-col items-center justify-center pointer-events-none">
              {volume === 0 ? (
                <VolumeX className="w-6 h-6 text-stone-900 stroke-[2.2]" />
              ) : (
                <Volume2 className="w-6 h-6 text-stone-900 stroke-[2.2]" />
              )}
              <span className="text-[10px] font-extrabold text-stone-900/80 mt-0.5">{volume}%</span>
            </div>
          </div>
        </div>

        {/* ROW 3: FOCUS / SLEEP HORIZONTAL CAPSULE TOGGLE */}
        <div className="relative">
          <button
            onClick={() => {
              setFocusMode(!focusMode);
              playGlassPing(!focusMode);
            }}
            className="w-full gel-toggle-track rounded-full h-[62px] sm:h-[68px] p-1.5 flex items-center justify-between relative overflow-hidden cursor-pointer group"
          >
            {/* Botanical Floral Background Inside Glass Track */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-3/5 bg-cover bg-center opacity-65 pointer-events-none"
              style={{ backgroundImage: `url('/cherry_blossom_sprig.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent pointer-events-none" />

            {/* Sliding Moon Gel Button */}
            <div 
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full gel-pink flex items-center justify-center transition-all duration-300 transform shadow-md z-10 ${
                focusMode ? 'translate-x-[calc(100vw-120px)] max-translate-x-[320px]' : 'translate-x-0'
              }`}
            >
              <div className="gel-sheen" />
              <Moon className="w-6 h-6 text-stone-950 fill-stone-950/20 z-10" />
            </div>

            {/* Label */}
            <div className="pr-5 text-right z-10">
              <span className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight block">
                {focusMode ? 'Do Not Disturb · Active' : 'Focus Mode'}
              </span>
              <span className="text-[10px] font-medium text-stone-600">
                {focusMode ? 'Silenced for Sleep' : 'Tap to Activate'}
              </span>
            </div>
          </button>
        </div>

        {/* ROW 4: 4 CIRCULAR GEL BUTTONS (Torch, Timer, Calculator, Camera) */}
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Flashlight (Pink Gel) */}
          <button
            onClick={() => {
              setFlashlight(!flashlight);
              playGelPop('high');
            }}
            className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
              flashlight ? 'gel-pink' : 'gel-pink'
            }`}
            aria-label="Flashlight"
            title={flashlight ? 'Flashlight On' : 'Flashlight Off'}
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <Flashlight className={`w-6 h-6 sm:w-7 sm:h-7 z-10 ${flashlight ? 'text-stone-950 stroke-[2.5] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-stone-900'}`} />
          </button>

          {/* Timer / Stopwatch (Pink Gel) */}
          <button
            onClick={() => {
              playGelPop('med');
              onOpenTimer?.();
            }}
            className="aspect-square rounded-full gel-pink flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition"
            aria-label="Stopwatch Timer"
            title="Open Stopwatch"
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <TimerIcon className="w-6 h-6 sm:w-7 sm:h-7 text-stone-900 z-10" />
          </button>

          {/* Calculator (Cream Gel) */}
          <button
            onClick={() => {
              playGelPop('med');
              onOpenCalculator?.();
            }}
            className="aspect-square rounded-full gel-cream flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition"
            aria-label="Calculator"
            title="Open Calculator"
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <CalcIcon className="w-6 h-6 sm:w-7 sm:h-7 text-stone-900 z-10" />
          </button>

          {/* Camera (Cream Gel) */}
          <button
            onClick={() => {
              playGelPop('high');
              alert('📸 Gel Cam snapshot taken!');
            }}
            className="aspect-square rounded-full gel-cream flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition"
            aria-label="Camera"
            title="Take Photo"
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <CameraIcon className="w-6 h-6 sm:w-7 sm:h-7 text-stone-900 z-10" />
          </button>
        </div>

        {/* ROW 5: 4 CIRCULAR GEL BUTTONS (Voice Memo, Screen Record, Battery, Screen Mirror) */}
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Voice Memo / Soundwave (Cream Gel) */}
          <button
            onClick={() => {
              playGelPop('med');
            }}
            className="aspect-square rounded-full gel-cream flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition"
            aria-label="Voice Memos"
            title="Voice Memo Recording"
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <AudioWaveform className="w-6 h-6 sm:w-7 sm:h-7 text-stone-900 z-10" />
          </button>

          {/* Screen Record (Cream Gel with animated indicator) */}
          <button
            onClick={() => {
              setRecording(!recording);
              playGlassPing(!recording);
            }}
            className="aspect-square rounded-full gel-cream flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition relative"
            aria-label="Screen Record"
            title={recording ? `Recording: ${recordSeconds}s` : 'Start Recording'}
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <Disc className={`w-6 h-6 sm:w-7 sm:h-7 z-10 ${recording ? 'text-rose-600 animate-spin' : 'text-stone-900'}`} />
            {recording && (
              <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping z-20" />
            )}
          </button>

          {/* Low Power Mode (Cream Gel) */}
          <button
            onClick={() => {
              setLowPower(!lowPower);
              playGlassPing(!lowPower);
            }}
            className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
              lowPower ? 'gel-pink' : 'gel-cream'
            }`}
            aria-label="Low Power Battery"
            title={lowPower ? 'Low Power Mode: 84%' : 'Normal Power Mode'}
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <BatteryMedium className={`w-6 h-6 sm:w-7 sm:h-7 z-10 ${lowPower ? 'text-stone-950 font-bold' : 'text-stone-900'}`} />
          </button>

          {/* Screen Mirror / AirPlay (Pink Gel) */}
          <button
            onClick={() => {
              setAirplayActive(!airplayActive);
              playGelPop('high');
            }}
            className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 gel-transition ${
              airplayActive ? 'gel-pink-active' : 'gel-pink'
            }`}
            aria-label="AirPlay Screen Mirror"
            title="Screen Mirroring"
          >
            <div className="gel-sheen" />
            <div className="gel-crescent" />
            <Tv className="w-6 h-6 sm:w-7 sm:h-7 text-stone-950 z-10" />
          </button>
        </div>

      </div>

      {/* Screen Torch Effect when Flashlight is active */}
      {flashlight && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  );
};
