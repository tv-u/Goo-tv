import React, { useEffect, useRef } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdsterraAdBannerProps {
  zoneId?: string;
  format?: 'banner_728x90' | 'banner_300x250' | 'native_bar';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  zoneId = 'adsterra_smartlink',
  format = 'native_bar',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Adsterra Smartlink URL (Can be customized with user's specific Adsterra link)
  const smartlinkUrl = 'https://www.profitablecpmrate.com/c17x0t4u0?key=adsterra_smartlink_stream';

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
                High-Speed Cloud VIP Streaming & Downloads
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
