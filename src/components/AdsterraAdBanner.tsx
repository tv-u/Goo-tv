import React, { useRef } from 'react';
import { Sparkles, ExternalLink, Zap, Download, ShieldCheck } from 'lucide-react';
const SMARTLINKS = [
  "https://www.profitableratecpmnetwork.com/hr65xsh7?key=dc01c1237bd130c5ef9bcfef4f0928ed",
  "https://www.profitableratecpmnetwork.com/sa8mca36sv?key=3711015d24018cf89ccb362976c4a2e0",
  "https://www.profitableratecpmnetwork.com/x0wcj4zk?key=c2b46070b44982014166acafd6074c3d",
] as const;

const smartlinkUrl =
  SMARTLINKS[Math.floor(Math.random() * SMARTLINKS.length)];

interface AdsterraAdBannerProps {
  zoneId?: string;
  format?: 'banner_728x90' | 'banner_300x250' | 'native_bar' | 'download_sponsor' | 'stream_accelerator';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  format = 'native_bar',
  className = '',
}) => {
  // High-CPM Adsterra Smartlink (Configured for cinema & download traffic)

if (format === 'download_sponsor') {
    return (
      <div className={`rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#181a27] to-red-950/40 p-3 sm:p-4 shadow-xl ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  ⚡ VIP Ultra-Speed 4K Direct Download (Cloud Server)
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-black shadow">
                  FASTEST
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Zero waiting time • Direct 100 MB/s speed • Multi-audio 4K HDR master files.
              </p>
            </div>
          </div>

          <a
            href={smartlinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Direct 4K Download</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>
    );
  }

  if (format === 'stream_accelerator') {
    return (
      <div className={`rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-[#101420] to-blue-950/30 p-2.5 sm:p-3 shadow-lg ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black font-black flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <div>
              <span className="font-extrabold text-white text-xs">
                Ultra-Speed Streaming Server Boost (Zero Buffer 60fps)
              </span>
              <p className="text-[10px] text-gray-400">
                Unlock unthrottled gigabit bandwidth for instant 4K cinema playback.
              </p>
            </div>
          </div>

          <a
            href={smartlinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all flex-shrink-0 cursor-pointer"
          >
            <span>Activate 60fps Boost</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>
        </div>
      </div>
    );
  }

  // Default 'native_bar' & 'banner_728x90'
  return (
    <div className={`my-4 mx-auto max-w-5xl rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-[#131522] to-red-950/30 p-3 sm:p-4 shadow-xl text-xs ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm">
                High-Speed Cloud VIP Streaming & Direct Downloads
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-black">
                SPONSORED
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Unlock unlimited 4K ultra-speed bandwidth, zero buffer servers, and direct master stream downloads.
            </p>
          </div>
        </div>

        <a
          href={smartlinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <span>Claim VIP Access</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[3]" />
        </a>
      </div>
    </div>
  );
};
