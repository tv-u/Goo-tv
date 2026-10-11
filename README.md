# 🎬 GOO TV - Movies, Web Series & Live Cinema

A world-class movie & TV streaming application with 20 high-speed verified fallback servers, real TMDB API metadata synchronization, Hindi & multi-audio support, subtitles, multi-quality downloads, and an advanced YouTube/Netflix-style cinema player.

---

## 🌟 Key Features

### 1. 📺 Advanced Cinema Player System (Exact Screenshot UI)
- **Same-Screen Playback:** Streams directly on screen inside a high-speed modal player with zero sandbox issues.
- **YouTube/Netflix Controls Bar:**
  - ⏸️ **Play / Pause / Stop** with smooth state animation.
  - ⏩ **10s Fast-Forward & ⏪ 10s Rewind** (+30s / -30s skip).
  - ⏱️ **Interactive Scrubber Progress Bar** with live elapsed and total duration timestamps (`0:04 / 2:51:07`).
  - 🔊 **Volume Control & 1-Click Mute/Unmute** with volume boost up to 150%.
  - ☀️ **Screen Brightness Slider** (50% to 150%) for cinema viewing comfort.
  - 💬 **Captions / Subtitles (CC) Toggle** for multilingual subtitles.
  - ⚙️ **Quality & Audio Settings:** 4K Ultra HD, 1080p Full HD (BluRay), 720p HD, 480p Data Saver, Hindi Dubbed & English 5.1 Dolby.
  - ⛶ **100% Native Fullscreen Cinema Mode.**
  - ⚡ **Auto-Switch Next Server** button to switch servers without page reload.

### 2. ⚡ 20 High-Speed Streaming Fallback Servers
1. **SuperEmbed Ultra (4K)**: Multi-Audio & Hindi Dubbed
2. **AutoEmbed CC (Smart)**: 1080p BluRay & Subtitles
3. **Embed.su VIP**: 1080p 60fps High Bitrate
4. **VidSrc Net**: Unblocked Fast Global CDN
5. **SmashyStream**: Dual Audio Multi-Host
6. **2Embed Global**: 1080p / 720p Stable
7. **VidSrc XYZ**: High Speed Mirror
8. **MoviesAPI Club**: Multi-Audio Node
9. **RiveStream VIP**: HD Hindi Dubbed
10. **VidFast Pro**: Ultra Fast CDN
11. **Filemoon Cloud**: Resumable Cloud
12. **StreamWish Cloud**: High Speed MP4
13. **DoodStream Node**: Fast Mirror
14. **StreamTape Pro**: Direct Global
15. **Upstream.to**: Multi-Stream Mirror
16. **Voe.sx Enterprise**: European Edge
17. **Vidguard Shield**: Shielded Node
18. **VidSrc PM**: FHD Master
19. **VidLink Clean**: Zero-Ads HD
20. **Noni.to Direct**: Dual Audio Stream

### 3. 🎬 12 GOO TV Real Categories
- 🇮🇳 Hindi Movies
- 🇺🇸 English Movies
- 🟠 Punjabi Movies
- 🌴 South Movies (Tamil, Telugu, Malayalam, Kannada)
- 🕰️ Classic Movies
- 🎙️ Hindi Dubbed Movies
- 🇰🇷 K-Drama
- 🇮🇳🇰🇷 Hindi Dubbed K-Drama
- 🔵 HBO Movies
- 🔴 Netflix Movies
- 🟣 JioHotstar Movies
- 🟢 MX Player Movies

### 4. 🚀 Deployment Ready
- **GitHub Pages:** Direct SPA support with `404.html` and `.nojekyll`.
- **Cloudflare Pages (`goo-tv.pages.dev`):** `_headers` and `_redirects` preconfigured for zero-freeze static hosting.
- **Google SEO:** Meta tags, canonical links, OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Metadata API:** The Movie Database (TMDB) API
- **Deployment:** GitHub Pages / Cloudflare Pages

---

## 💻 Local Development & Deployment

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build
```

### ☁️ Cloudflare Pages (`goo-tv.pages.dev`) Deployment Guide
1. Connect your GitHub repository to **Cloudflare Pages**.
2. Set the build configuration:
   - **Framework preset:** `Vite` (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version (Environment Variables):** `NODE_VERSION` = `20`
3. Click **Save and Deploy**. Cloudflare Pages will build and deploy the site across its global CDN.
4. Both `_headers` (caching & security rules) and `_redirects` (SPA fallback) will be automatically picked up from `public/`.

### 💰 Adsterra Monetization Engine Active
- **Social Bar / Popunder Scripts:** Active with `data-cfasync="false"` for 100% compatibility with Cloudflare Rocket Loader.
- **Native Banner Container:** `container-a4e46263cbd8519b40b7d5e084f699d2` integrated mid-feed with dark cinema styling so earning is maximized without degrading viewing experience.
- **Direct 4K Download Accelerator:** High-converting sponsored link on download modal.
