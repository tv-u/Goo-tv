import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Info, CheckCircle2, Lock, Scale, Mail } from 'lucide-react';

export type PolicyPageType = 'about' | 'terms' | 'privacy' | 'dmca';

interface PolicyModalProps {
  page: PolicyPageType;
  onClose: () => void;
  onSelectPage: (page: PolicyPageType) => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ page, onClose, onSelectPage }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#11131c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0c0d14] border-b border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onSelectPage('about')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'about'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => onSelectPage('terms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'terms'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => onSelectPage('privacy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'privacy'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security & Privacy</span>
            </button>

            <button
              onClick={() => onSelectPage('dmca')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                page === 'dmca'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DMCA & Disclaimer</span>
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-gray-300 leading-relaxed">
          
          {/* ABOUT US CONTENT */}
          {page === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-black text-red-500 uppercase tracking-wider">Our Platform</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">About GOO TV</h2>
                <p className="text-xs text-gray-400 mt-1">Next-Generation Cinema & Series Discovery Network</p>
              </div>

              <div className="space-y-4">
                <p>
                  <strong>GOO TV</strong> was founded with a singular mission: to make global cinema accessible, responsive, and seamless for film enthusiasts everywhere. We aggregate public metadata and connect audiences with diverse cinematic experiences across Hollywood blockbusters, Bollywood hits, South Asian regional cinema, and Japanese animation.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="bg-[#141624] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">20-Server Redundancy</h3>
                    <p className="text-xs text-gray-400">
                      Our system orchestrates 20 distinct streaming engines with instant server auto-syncing, guaranteeing uninterrupted zero-buffer playback.
                    </p>
                  </div>

                  <div className="bg-[#141624] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Multi-Language Audio</h3>
                    <p className="text-xs text-gray-400">
                      Enjoy films in original theatrical audio or verified Hindi, English, and multi-language dubs with synchronized subtitles.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white pt-2">Our Technology</h3>
                <p>
                  Built with modern React and lightning-fast edge delivery, GOO TV provides complete season and episode navigation, watch history tracking, offline watchlist persistence, and direct popout cinema viewing. We respect user privacy by requiring no accounts, no credit cards, and storing no personal data.
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE CONTENT */}
          {page === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-black text-amber-500 uppercase tracking-wider">Legal Agreement</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Terms of Service</h2>
                <p className="text-xs text-gray-400 mt-1">Last Updated: October 2026</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using GOO TV, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using this website immediately.
                </p>

                <h3 className="text-base font-bold text-white">2. Nature of Service</h3>
                <p>
                  GOO TV operates strictly as an informational index and search engine for media content. We do not host, store, upload, or broadcast any video files, media streams, or copyrighted material on our own servers. All media items and streams referenced on this site are hosted and served by independent third-party providers over which we exercise no control.
                </p>

                <h3 className="text-base font-bold text-white">3. User Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
                  <li>You agree to use this platform strictly for personal, non-commercial purposes.</li>
                  <li>You are responsible for ensuring that viewing or accessing third-party content complies with your local jurisdiction's laws and copyright regulations.</li>
                  <li>You agree not to attempt to disrupt, exploit, or overload our servers or infrastructure.</li>
                </ul>

                <h3 className="text-base font-bold text-white">4. Limitation of Liability</h3>
                <p>
                  Under no circumstances shall GOO TV, its operators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform or any third-party links accessed through it.
                </p>
              </div>
            </div>
          )}

          {/* SECURITY & PRIVACY POLICY CONTENT */}
          {page === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Data Protection</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Security & Privacy Policy</h2>
                <p className="text-xs text-gray-400 mt-1">Zero-Log Philosophy & Client-Side Encryption</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">1. Information We Do NOT Collect</h3>
                <p>
                  We believe in fundamental digital privacy. GOO TV does not require user registration, passwords, names, emails, or payment information. We maintain a strict zero-log policy regarding individual browsing and playback habits.
                </p>

                <h3 className="text-base font-bold text-white">2. Local Storage Usage</h3>
                <p>
                  To deliver a personalized experience without centralized user accounts, our application stores minimal operational data exclusively on your device using browser `localStorage`:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                  <li>Your personal Watchlist bookmarks.</li>
                  <li>Your Recent Continue-Watching history.</li>
                  <li>Your preferred default playback server.</li>
                </ul>
                <p className="text-xs text-gray-400">
                  This data never leaves your device and can be erased instantly by clearing your browser cache.
                </p>

                <h3 className="text-base font-bold text-white">3. Third-Party Advertising & Smart Links</h3>
                <p>
                  To keep our platform completely free, we may display third-party advertisements via verified advertising networks (such as Adsterra). These advertising partners may use non-personalized cookies and web beacons to serve contextually relevant ads. Users may utilize browser content controls to manage cookies at any time.
                </p>

                <h3 className="text-base font-bold text-white">4. SSL / HTTPS Encryption</h3>
                <p>
                  All connections to GOO TV are end-to-end encrypted using industry-standard TLS/SSL encryption, ensuring your connection cannot be monitored or modified in transit.
                </p>
              </div>
            </div>
          )}

          {/* DMCA & DISCLAIMER CONTENT */}
          {page === 'dmca' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-black text-red-500 uppercase tracking-wider">Copyright Compliance</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">DMCA & Copyright Disclaimer</h2>
                <p className="text-xs text-gray-400 mt-1">Digital Millennium Copyright Act (17 U.S.C. § 512) Compliance</p>
              </div>

              <div className="space-y-4">
                <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 text-xs text-red-300">
                  <strong>Notice:</strong> GOO TV is an online content index. We do not host, broadcast, or store any video media or streams. All video links provided point to external third-party hosting services (such as StreamTape, Filemoon, DoodStream, etc.).
                </div>

                <h3 className="text-base font-bold text-white">Safe Harbor Statement</h3>
                <p>
                  GOO TV operates in compliance with 17 U.S.C. § 512 and the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;). It is our policy to respond with urgency to any infringement notices and take appropriate actions under the DMCA and applicable intellectual property laws.
                </p>

                <h3 className="text-base font-bold text-white">Filing a Takedown Notice</h3>
                <p>
                  If you are a copyright owner or an agent thereof and believe that any content indexed on this platform infringes upon your copyright, you may submit a formal notification containing the following:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
                  <li>A physical or electronic signature of the authorized copyright holder.</li>
                  <li>Clear identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Direct URLs on our platform where the material is indexed.</li>
                  <li>Your contact details including mailing address, phone number, and email.</li>
                  <li>A statement that you have a good-faith belief that use of the material is not authorized.</li>
                </ul>

                <div className="bg-[#141624] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-500" />
                      DMCA Designated Agent Contact
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">We review and remove indexed links within 24 to 48 business hours.</p>
                  </div>
                  <a
                    href="mailto:dmca@gootv.app?subject=DMCA%20Takedown%20Notice"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex-shrink-0"
                  >
                    Send Notice
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#0c0d14] border-t border-white/10 px-6 py-3 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <span>GOO TV Compliance & Governance</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
