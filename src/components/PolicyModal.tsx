import React, { useEffect } from 'react';
import { X, ShieldCheck, AlertTriangle, Info, CheckCircle2, Lock, Scale, Mail, Film, Sparkles, ExternalLink } from 'lucide-react';
import { playGelPop } from '../utils/gelSound';

export type PolicyPageType = 'about' | 'terms' | 'privacy' | 'dmca';

interface PolicyModalProps {
  page: PolicyPageType;
  onClose: () => void;
  onSelectPage: (page: PolicyPageType) => void;
  theme?: 'pastel' | 'dark';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ 
  page, 
  onClose, 
  onSelectPage,
  theme = 'pastel',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTabClick = (tab: PolicyPageType) => {
    playGelPop(540, 'sine');
    onSelectPage(tab);
    window.location.hash = `#${tab === 'privacy' ? 'security' : tab === 'dmca' ? 'disclaimer' : tab}`;
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* 3D Liquid Glassmorphic Policy Container */}
      <div className={`relative w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh] transition-all ${
        theme === 'pastel'
          ? 'liquid-glass-plate border-2 border-white/90 text-[#2e1c24]'
          : 'liquid-glass-plate-dark border border-white/20 text-[#f8fafc]'
      }`}>
        
        {/* Top 3D Tab Bar */}
        <div className="border-b border-black/10 px-5 sm:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleTabClick('about')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'about'
                  ? 'gel-pink text-white shadow-md'
                  : 'gel-cream text-stone-900 shadow-sm hover:scale-105'
              }`}
            >
              <div className="gel-sheen" />
              <Info className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => handleTabClick('terms')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'terms'
                  ? 'gel-pink text-white shadow-md'
                  : 'gel-cream text-stone-900 shadow-sm hover:scale-105'
              }`}
            >
              <div className="gel-sheen" />
              <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => handleTabClick('privacy')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'privacy'
                  ? 'gel-pink text-white shadow-md'
                  : 'gel-cream text-stone-900 shadow-sm hover:scale-105'
              }`}
            >
              <div className="gel-sheen" />
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Security & Privacy</span>
            </button>

            <button
              onClick={() => handleTabClick('dmca')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'dmca'
                  ? 'gel-pink text-white shadow-md'
                  : 'gel-cream text-stone-900 shadow-sm hover:scale-105'
              }`}
            >
              <div className="gel-sheen" />
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Disclaimer & DMCA</span>
            </button>
          </div>

          <button
            onClick={() => {
              playGelPop(460, 'sine');
              onClose();
            }}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full gel-white text-stone-900 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <X className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-9 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
          {/* ABOUT US CONTENT */}
          {page === 'about' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-black/10 pb-4">
                <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Our Platform</span>
                <h2 className="text-2xl sm:text-4xl font-black mt-1">About GOO TV VIP</h2>
                <p className="text-xs font-bold opacity-70 mt-1">World-Class 3D Liquid Glassmorphism Cinema & Series Engine</p>
              </div>

              <div className="space-y-4">
                <p>
                  <strong>GOO TV</strong> was founded with a singular, unyielding mission: to make global cinema accessible, responsive, ultra-fast, and completely seamless for movie and television lovers worldwide. We aggregate publicly accessible media metadata and connect audiences with diverse cinematic experiences across Hollywood blockbusters, Bollywood hits, South Asian regional cinema, K-Drama, and Japanese anime.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className={`p-4 rounded-[22px] space-y-2.5 shadow-md ${
                    theme === 'pastel' ? 'bg-white/70 border border-white' : 'bg-black/40 border border-white/10'
                  }`}>
                    <div className="w-9 h-9 rounded-2xl gel-pink text-white flex items-center justify-center font-bold">
                      <div className="gel-sheen" />
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-black text-base">20 Live Unblocked Servers</h3>
                    <p className="text-xs opacity-75 font-semibold">
                      Our system orchestrates 20 distinct streaming engines with instant server auto-syncing, guaranteeing uninterrupted zero-buffer 4K playback.
                    </p>
                  </div>

                  <div className={`p-4 rounded-[22px] space-y-2.5 shadow-md ${
                    theme === 'pastel' ? 'bg-white/70 border border-white' : 'bg-black/40 border border-white/10'
                  }`}>
                    <div className="w-9 h-9 rounded-2xl gel-cream text-stone-900 flex items-center justify-center font-bold">
                      <div className="gel-sheen" />
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 stroke-[2.5]" />
                    </div>
                    <h3 className="font-black text-base">Top 50 Languages & Multi-Audio</h3>
                    <p className="text-xs opacity-75 font-semibold">
                      Enjoy films in verified Hindi Dubbed, English 5.1 Dolby, Tamil, Telugu, Spanish, French, German, and multi-language dubs with synchronized subtitles.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-black pt-2">Our Technology</h3>
                <p>
                  Built with modern React, Vite, and lightning-fast edge delivery for Cloudflare Pages and GitHub Pages, GOO TV provides complete season and episode navigation, watch history tracking, offline watchlist persistence, 10-second forward/backward seek controls, and direct popout cinema viewing. We respect user privacy by requiring no accounts, no credit cards, and storing no personal data.
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE CONTENT */}
          {page === 'terms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-black/10 pb-4">
                <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Legal Governance</span>
                <h2 className="text-2xl sm:text-4xl font-black mt-1">Terms of Service</h2>
                <p className="text-xs font-bold opacity-70 mt-1">Effective Date: October 2026 • Worldwide Accessibility</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-black">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using GOO TV, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using this website immediately.
                </p>

                <h3 className="text-base font-black">2. Nature of Service</h3>
                <p>
                  GOO TV operates strictly as an informational index and search engine for media content. We do not host, store, upload, or broadcast any video files, media streams, or copyrighted material on our own servers. All media items and streams referenced on this site are hosted and served by independent third-party providers over which we exercise no control.
                </p>

                <h3 className="text-base font-black">3. User Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs opacity-80 font-semibold">
                  <li>You agree to use this platform strictly for personal, non-commercial purposes.</li>
                  <li>You are responsible for ensuring that viewing or accessing third-party content complies with your local jurisdiction's copyright regulations.</li>
                  <li>You agree not to attempt to disrupt, exploit, or overload our servers or infrastructure.</li>
                </ul>

                <h3 className="text-base font-black">4. Limitation of Liability</h3>
                <p>
                  Under no circumstances shall GOO TV, its operators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform or any third-party links accessed through it.
                </p>
              </div>
            </div>
          )}

          {/* SECURITY & PRIVACY POLICY CONTENT */}
          {page === 'privacy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-black/10 pb-4">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Data Protection</span>
                <h2 className="text-2xl sm:text-4xl font-black mt-1">Security & Privacy Policy</h2>
                <p className="text-xs font-bold opacity-70 mt-1">Zero-Log Philosophy & Client-Side Privacy Guarantee</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-black">1. Information We Do NOT Collect</h3>
                <p>
                  We believe in fundamental digital privacy. GOO TV does not require user registration, passwords, names, emails, telephone numbers, or payment information. We maintain a strict zero-log policy regarding individual browsing and playback habits.
                </p>

                <h3 className="text-base font-black">2. Local Storage Usage</h3>
                <p>
                  To deliver a personalized experience without centralized user accounts, our application stores minimal operational data exclusively on your device using browser `localStorage`:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs opacity-80 font-semibold">
                  <li>Your personal Watchlist bookmarks.</li>
                  <li>Your Recent Continue-Watching history.</li>
                  <li>Your preferred default playback server and theme mode.</li>
                </ul>
                <p className="text-xs opacity-75">
                  This data never leaves your device and can be erased instantly by clearing your browser cache.
                </p>

                <h3 className="text-base font-black">3. Third-Party Advertising & Smart Links</h3>
                <p>
                  To keep our platform completely free, we display third-party advertisements via verified advertising networks (including Adsterra). These advertising partners may use non-personalized cookies and web beacons to serve contextually relevant ads. Users may utilize browser content controls to manage cookies at any time.
                </p>

                <h3 className="text-base font-black">4. SSL / HTTPS Encryption</h3>
                <p>
                  All connections to GOO TV are end-to-end encrypted using industry-standard TLS/SSL encryption, ensuring your connection cannot be monitored or modified in transit.
                </p>
              </div>
            </div>
          )}

          {/* DMCA & DISCLAIMER CONTENT */}
          {page === 'dmca' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-black/10 pb-4">
                <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Copyright Compliance</span>
                <h2 className="text-2xl sm:text-4xl font-black mt-1">DMCA & Copyright Disclaimer</h2>
                <p className="text-xs font-bold opacity-70 mt-1">Digital Millennium Copyright Act (17 U.S.C. § 512) Compliance</p>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs font-semibold text-rose-600">
                  <strong>Notice:</strong> GOO TV is an online content index. We do not host, broadcast, or store any video media or streams. All video links provided point to external third-party hosting services (such as AutoEmbed, Embed.su, VidSrc, StreamTape, Filemoon, DoodStream, etc.).
                </div>

                <h3 className="text-base font-black">Safe Harbor Statement</h3>
                <p>
                  GOO TV operates in compliance with 17 U.S.C. § 512 and the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;). It is our policy to respond with urgency to any infringement notices and take appropriate actions under the DMCA and applicable intellectual property laws.
                </p>

                <h3 className="text-base font-black">Filing a Takedown Notice</h3>
                <p>
                  If you are a copyright owner or an agent thereof and believe that any content indexed on this platform infringes upon your copyright, you may submit a formal notification containing the following:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs opacity-80 font-semibold">
                  <li>A physical or electronic signature of the authorized copyright holder.</li>
                  <li>Clear identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Direct URLs on our platform where the material is indexed.</li>
                  <li>Your contact details including mailing address, phone number, and email.</li>
                  <li>A statement that you have a good-faith belief that use of the material is not authorized.</li>
                </ul>

                <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 border ${
                  theme === 'pastel' ? 'bg-white/60 border-black/10' : 'bg-black/40 border-white/10'
                }`}>
                  <div>
                    <h4 className="font-black text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-rose-500" />
                      DMCA Designated Agent Contact
                    </h4>
                    <p className="text-xs opacity-75 mt-0.5">We review and remove indexed links within 24 to 48 business hours.</p>
                  </div>
                  <a
                    href="mailto:dmca@gootv.app?subject=DMCA%20Takedown%20Notice"
                    className="px-4 py-2 rounded-full gel-pink text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                  >
                    Send Notice
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="border-t border-black/10 px-6 py-3.5 flex items-center justify-between text-xs font-bold opacity-75 flex-shrink-0">
          <span>GOO TV Compliance & Governance</span>
          <button
            onClick={() => {
              playGelPop(460, 'sine');
              onClose();
            }}
            className="px-4 py-1.5 rounded-full gel-cream text-stone-900 font-black transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
