import React, { useState } from 'react';
import { Mail, ShieldCheck, Check, Copy, ExternalLink, Headphones } from 'lucide-react';
import { playGelPop, playGlassPing } from '../utils/gelSound';

interface RunningSupportNoticeProps {
  theme?: 'pastel' | 'dark';
}

export const RunningSupportNotice: React.FC<RunningSupportNoticeProps> = ({ theme = 'pastel' }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const supportEmail = 'Help.wowmovies@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    playGlassPing();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailClick = () => {
    playGelPop(560, 'sine');
  };

  return (
    <div className="w-full my-4">
      {/* 3D Liquid Glassmorphic Gel Notice Capsule */}
      <div className={`relative overflow-hidden rounded-[24px] sm:rounded-full p-2 sm:p-2.5 transition-all shadow-xl group border ${
        theme === 'pastel'
          ? 'liquid-glass-plate text-stone-800'
          : 'liquid-glass-plate-dark text-stone-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Left: 3D Gel Badge with Live Indicator */}
          <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto px-2">
            <div className="w-8 h-8 rounded-xl gel-pink flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <div className="gel-sheen" />
              <Headphones className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 sm:text-xs">
                24/7 SUPPORT
              </span>
              <span className="gel-badge text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                24-48H REPLY
              </span>
            </div>
          </div>

          {/* Center: Running Notice Marquee (English & Hindi) */}
          <div className="flex-1 overflow-hidden relative w-full sm:w-auto h-7 flex items-center">
            {/* Left and right gradient fade for soft 3D liquid edge */}
            <div className={`absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none ${
              theme === 'pastel' ? 'bg-gradient-to-r from-white/90 to-transparent' : 'bg-gradient-to-r from-black/80 to-transparent'
            }`} />
            <div className={`absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none ${
              theme === 'pastel' ? 'bg-gradient-to-l from-white/90 to-transparent' : 'bg-gradient-to-l from-black/80 to-transparent'
            }`} />

            <div className="animate-marquee-notice flex items-center text-xs font-bold space-x-8 cursor-default">
              {/* Message Block 1 (English + Hindi) */}
              <span className="flex items-center gap-3">
                <span className="text-amber-500 font-black">📢 ENGLISH:</span>
                <span>
                  Facing any issue or need movie assistance? Email our 24/7 support team at{' '}
                  <strong className="text-rose-600 underline font-black">{supportEmail}</strong> — Guaranteed reply & resolution within 24 to 48 hours!
                </span>
                <span className="text-rose-400 font-black">✦</span>
                <span className="text-emerald-500 font-black">📢 हिन्दी:</span>
                <span>
                  किसी भी समस्या या सहायता के लिए कृपया हमें{' '}
                  <strong className="text-rose-600 underline font-black">{supportEmail}</strong> पर ईमेल भेजें — 24 से 48 घंटे के भीतर समाधान व जवाब मिल जाएगा!
                </span>
                <span className="text-rose-400 font-black">✦</span>
              </span>

              {/* Message Block 2 Duplicate for seamless infinite loop */}
              <span className="flex items-center gap-3">
                <span className="text-amber-500 font-black">📢 ENGLISH:</span>
                <span>
                  Facing any issue or need movie assistance? Email our 24/7 support team at{' '}
                  <strong className="text-rose-600 underline font-black">{supportEmail}</strong> — Guaranteed reply & resolution within 24 to 48 hours!
                </span>
                <span className="text-rose-400 font-black">✦</span>
                <span className="text-emerald-500 font-black">📢 हिन्दी:</span>
                <span>
                  किसी भी समस्या या सहायता के लिए कृपया हमें{' '}
                  <strong className="text-rose-600 underline font-black">{supportEmail}</strong> पर ईमेल भेजें — 24 से 48 घंटे के भीतर समाधान व जवाब मिल जाएगा!
                </span>
                <span className="text-rose-400 font-black">✦</span>
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons (Email Direct + Copy) */}
          <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto px-1">
            <a
              href={`mailto:${supportEmail}?subject=Support%20Request%20-%20GOO%20TV&body=Hello%20GOO%20TV%20Support,%0A%0AI%20am%20facing%20an%20issue%20with:%20`}
              onClick={handleEmailClick}
              className="px-3.5 py-1.5 rounded-full gel-pink text-white text-[11px] font-black flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={`Click to email ${supportEmail}`}
            >
              <div className="gel-sheen" />
              <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Email Support</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-2.5 py-1.5 rounded-full gel-cream text-stone-900 text-[11px] font-black flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Copy Support Email Address"
            >
              <div className="gel-sheen" />
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-stone-700" />
                  <span className="hidden md:inline">Copy</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
