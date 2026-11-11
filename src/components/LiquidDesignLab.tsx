import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  Film, 
  Sparkles, 
  Play, 
  Tv, 
  ExternalLink,
  Code2,
  Heart
} from 'lucide-react';
import { playGelPop, playGlassPing } from '../utils/gelSound';

export const LiquidDesignLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'cinema' | 'tokens'>('components');
  const [copiedCode, setCopiedCode] = useState(false);

  // Playground interactive states
  const [selectedGelColor, setSelectedGelColor] = useState<'pink' | 'cream' | 'white'>('pink');
  const [selectedShape, setSelectedShape] = useState<'pill' | 'circle' | 'squircle'>('pill');
  const [buttonLiked, setButtonLiked] = useState(false);

  // Adsterra Native Container Injection
  useEffect(() => {
    try {
      const container = document.getElementById('container-a4e46263cbd8519b40b7d5e084f699d2');
      if (container && !container.hasChildNodes()) {
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl31775987.profitableratecpmnetwork.com/a4e46263cbd8519b40b7d5e084f699d2/invoke.js';
        container.appendChild(script);
      }
    } catch {}
  }, []);

  const cssTokensCode = `/* 3D Liquid Glassmorphic Card */
.liquid-glass-plate {
  background: linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,245,247,0.28) 45%, rgba(255,255,255,0.45) 100%);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow: 
    0 25px 50px -12px rgba(225, 112, 140, 0.22),
    0 10px 22px -5px rgba(0, 0, 0, 0.05),
    inset 0 2px 3px rgba(255, 255, 255, 0.95),
    inset 0 -2px 4px rgba(230, 160, 180, 0.25),
    inset 0 0 20px rgba(255, 255, 255, 0.25);
  border-radius: 36px;
}

/* Skeuomorphic Pink Gel Button */
.gel-pink {
  background: radial-gradient(circle at 35% 25%, #ffffff 0%, #ffc5d3 18%, #fb7185 55%, #e11d48 100%);
  box-shadow: 
    inset 0 3px 6px rgba(255, 255, 255, 0.95),
    inset 0 -4px 8px rgba(159, 18, 57, 0.42),
    inset 0 0 12px rgba(251, 113, 133, 0.35),
    0 10px 20px -3px rgba(225, 29, 72, 0.32);
}

/* Skeuomorphic Cream Gel Button */
.gel-cream {
  background: radial-gradient(circle at 35% 25%, #ffffff 0%, #fffdfa 20%, #f6ede2 58%, #e4d3bf 100%);
  box-shadow: 
    inset 0 3px 6px rgba(255, 255, 255, 0.98),
    inset 0 -3px 6px rgba(168, 134, 110, 0.32),
    inset 0 0 10px rgba(240, 226, 210, 0.4),
    0 10px 20px -4px rgba(140, 110, 90, 0.16);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cssTokensCode);
    setCopiedCode(true);
    playGlassPing(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleCinemaPicks = [
    { id: 933260, title: 'Stree 2', year: '2024', genre: 'Horror · Comedy', rating: '8.2', poster: '/cherry_blossom_ambient.jpg' },
    { id: 822119, title: 'Pushpa 2', year: '2024', genre: 'Action · Thriller', rating: '8.4', poster: '/cherry_blossom_sprig.jpg' },
    { id: 792307, title: 'Kalki 2898 AD', year: '2024', genre: 'Sci-Fi · Myth', rating: '7.9', poster: '/cherry_blossom_ambient.jpg' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pt-4 pb-12 px-3 sm:px-6">
      
      {/* Segmented Control Bar */}
      <div className="flex justify-center">
        <div className="liquid-glass-plate rounded-full p-1.5 flex items-center gap-1.5 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('components');
              playGelPop('med');
            }}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'components'
                ? 'gel-pink text-stone-950 shadow-md'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {activeTab === 'components' && <div className="gel-sheen" />}
            <Layers className="w-4 h-4" />
            <span>Gel Components</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cinema');
              playGelPop('high');
            }}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cinema'
                ? 'gel-pink text-stone-950 shadow-md'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {activeTab === 'cinema' && <div className="gel-sheen" />}
            <Film className="w-4 h-4" />
            <span>Liquid Cinema</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tokens');
              playGelPop('low');
            }}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tokens'
                ? 'gel-pink text-stone-950 shadow-md'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {activeTab === 'tokens' && <div className="gel-sheen" />}
            <Code2 className="w-4 h-4" />
            <span>CSS Tokens</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GEL COMPONENTS LAB */}
      {activeTab === 'components' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Interactive Playground Plate */}
          <div className="liquid-glass-plate rounded-[36px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/40 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 tracking-tight">Interactive 3D Gel Playground</h3>
                <p className="text-xs text-stone-600 font-medium">Test real-time tactile squish, high-gloss specular lens refractions, and sound synthesis.</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Color Selector */}
                <div className="flex items-center gap-1 p-1 rounded-full bg-white/40 border border-white/60">
                  <button 
                    onClick={() => { setSelectedGelColor('pink'); playGelPop('high'); }}
                    className={`w-6 h-6 rounded-full gel-pink cursor-pointer ${selectedGelColor === 'pink' ? 'ring-2 ring-rose-400' : 'opacity-80'}`}
                    title="Pastel Pink Gel"
                  />
                  <button 
                    onClick={() => { setSelectedGelColor('cream'); playGelPop('med'); }}
                    className={`w-6 h-6 rounded-full gel-cream cursor-pointer ${selectedGelColor === 'cream' ? 'ring-2 ring-amber-400' : 'opacity-80'}`}
                    title="Vanilla Cream Gel"
                  />
                </div>

                {/* Shape Selector */}
                <div className="flex items-center gap-1 p-1 rounded-full bg-white/40 border border-white/60">
                  <button 
                    onClick={() => { setSelectedShape('pill'); playGelPop('med'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${selectedShape === 'pill' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
                  >
                    Pill
                  </button>
                  <button 
                    onClick={() => { setSelectedShape('squircle'); playGelPop('med'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${selectedShape === 'squircle' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
                  >
                    Squircle
                  </button>
                  <button 
                    onClick={() => { setSelectedShape('circle'); playGelPop('med'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${selectedShape === 'circle' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
                  >
                    Circle
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Center */}
            <div className="py-8 flex flex-col items-center justify-center min-h-[160px] bg-gradient-to-b from-white/30 to-pink-50/20 rounded-3xl border border-white/50">
              <button
                onClick={() => {
                  setButtonLiked(!buttonLiked);
                  playGlassPing(!buttonLiked);
                }}
                className={`transition-all duration-200 cursor-pointer active:scale-90 flex items-center justify-center gap-2 text-stone-950 font-black shadow-xl ${
                  selectedGelColor === 'pink' ? 'gel-pink' : 'gel-cream'
                } ${
                  selectedShape === 'pill' 
                    ? 'rounded-full px-8 py-3.5 text-sm sm:text-base' 
                    : selectedShape === 'squircle' 
                    ? 'rounded-[26px] p-6 w-28 h-28 text-base' 
                    : 'rounded-full w-20 h-20 text-base'
                }`}
              >
                <div className="gel-sheen" />
                <div className="gel-crescent" />
                <Heart className={`w-5 h-5 z-10 ${buttonLiked ? 'fill-rose-700 text-rose-700 scale-125' : 'text-stone-950'} transition-transform`} />
                {selectedShape === 'pill' && (
                  <span className="z-10">{buttonLiked ? 'Favorited Gel Capsule' : 'Touch Liquid Gel'}</span>
                )}
              </button>
            </div>
          </div>

          {/* Cards Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Glass Card 1: Ambient Profile Capsule */}
            <div className="liquid-glass-plate rounded-[32px] p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full gel-pink flex items-center justify-center shadow-md">
                  <div className="gel-sheen" />
                  <span className="text-lg font-black text-stone-950">✦</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-base">Aura Capsule</h4>
                  <p className="text-xs text-stone-600 font-medium">3D Skeuomorphic Gel Matrix</p>
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Featuring multi-layered optical refraction, distinct inner bevel shadows, and hyper-tactile 60fps interaction physics.
              </p>
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => playGelPop('med')}
                  className="px-4 py-2 rounded-full gel-cream text-xs font-bold text-stone-900 cursor-pointer active:scale-95"
                >
                  <div className="gel-sheen" />
                  Explore System
                </button>
                <button 
                  onClick={() => playGelPop('high')}
                  className="px-4 py-2 rounded-full gel-pink text-xs font-bold text-stone-950 cursor-pointer active:scale-95 shadow-sm"
                >
                  <div className="gel-sheen" />
                  Activate 4K
                </button>
              </div>
            </div>

            {/* Glass Card 2: Floral Botanical Plate */}
            <div className="liquid-glass-plate rounded-[32px] p-5 space-y-3 relative overflow-hidden">
              <div 
                className="absolute right-0 bottom-0 w-36 h-36 bg-cover bg-center opacity-60 pointer-events-none"
                style={{ backgroundImage: `url('/cherry_blossom_sprig.jpg')` }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 bg-white/60 px-2.5 py-1 rounded-full border border-white/80 inline-block shadow-xs">
                Sakura Bloom Edition
              </span>
              <h4 className="font-black text-stone-900 text-base">Cherry Blossom Refraction</h4>
              <p className="text-xs text-stone-700 leading-relaxed pr-12">
                Delicate spring florals embedded in optical crystal glass with high-gloss liquid refractions and cream vanilla tones.
              </p>
              <div className="pt-2">
                <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden shadow-inner p-0.5">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-300 w-3/4" />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: LIQUID CINEMA PLAYER (20-SERVER STREAMING PREVIEW) */}
      {activeTab === 'cinema' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="liquid-glass-plate rounded-[36px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/40 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <Tv className="w-5 h-5 text-rose-600" />
                  <span>Liquid Cinema · 20 Unblocked VIP Servers</span>
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Watch blockbusters in 4K UHD with SuperEmbed Ultra, AutoEmbed, Embed.su, and VidSrc.
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-400/40">
                ● 20 Streaming Nodes Online
              </span>
            </div>

            {/* Movies Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sampleCinemaPicks.map(movie => (
                <div key={movie.id} className="liquid-glass-plate rounded-[28px] p-3.5 space-y-2.5 relative group overflow-hidden">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-rose-100/50 shadow-md">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600/90 text-white shadow-xs">
                      ★ {movie.rating}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-white/80 text-stone-950 backdrop-blur-sm">
                      4K HDR
                    </span>
                    <button 
                      onClick={() => {
                        playGelPop('high');
                        alert(`🍿 Playing ${movie.title} on SuperEmbed Ultra (4K)!`);
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-stone-950/30 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full gel-pink flex items-center justify-center shadow-2xl">
                        <div className="gel-sheen" />
                        <Play className="w-5 h-5 text-stone-950 fill-current ml-0.5" />
                      </div>
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{movie.title}</h4>
                    <p className="text-[11px] text-stone-600">{movie.genre} · {movie.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Servers Pill Matrix */}
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2.5">
                Active Streaming Servers:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  '1. SuperEmbed Ultra (4K)',
                  '2. AutoEmbed CC (Smart)',
                  '3. Embed.su (VIP CDN)',
                  '4. VidSrc Net (Unblocked)',
                  '5. SmashyStream Multi',
                  '6. 2Embed Global',
                  '7. RiveStream VIP'
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => playGelPop('med')}
                    className="px-3 py-1.5 rounded-full gel-cream text-xs font-bold text-stone-900 cursor-pointer active:scale-95"
                  >
                    <div className="gel-sheen" />
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: CSS TOKENS & CODE */}
      {activeTab === 'tokens' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="liquid-glass-plate rounded-[36px] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/40 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900">3D Liquid Glass & Gel CSS Architecture</h3>
                <p className="text-xs text-stone-600">Copy pristine drop shadows, inner bevels, and radial refraction maps.</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-full gel-pink text-xs font-bold text-stone-950 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
              >
                <div className="gel-sheen" />
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-stone-900/90 text-pink-200 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-white/20">
              <pre>{cssTokensCode}</pre>
            </div>
          </div>
        </div>
      )}

      {/* NON-INTRUSIVE SPONSORED LIQUID GLASS CARD (Adsterra Integration) */}
      <div className="liquid-glass-plate rounded-[32px] p-4 text-center space-y-2 shadow-lg">
        <div className="text-[10px] font-bold text-rose-800/70 tracking-widest uppercase">
          ✦ Premium Sponsored Partner
        </div>
        <div 
          id="container-a4e46263cbd8519b40b7d5e084f699d2" 
          className="w-full flex items-center justify-center min-h-[60px]"
        />
      </div>

    </div>
  );
};
