import { getKeywords, TOP_50_LANGUAGES } from './keywords';
import { getAppLocale } from '../i18n';

const SITE_NAME = 'GOO TV';

const DEFAULT_ORIGIN =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://goo-tv.pages.dev';

const RTL_LOCALES = new Set([
  'ar',
  'fa',
  'he',
  'ur',
]);

function upsertMeta(
  selector: string,
  attribute: string,
  value: string
) {
  let node = document.head.querySelector(
    selector
  ) as HTMLMetaElement | null;

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, selector.split('"')[1]);
    document.head.appendChild(node);
  }

  node.content = value;
}

function upsertLink(
  rel: string,
  href: string,
  hreflang?: string
) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;

  let node = document.head.querySelector(
    selector
  ) as HTMLLinkElement | null;

  if (!node) {
    node = document.createElement('link');
    node.rel = rel;

    if (hreflang) {
      node.hreflang = hreflang;
    }

    document.head.appendChild(node);
  }

  node.href = href;
}

function upsertJsonLd(
  data: Record<string, unknown>
) {
  let script = document.getElementById(
    'goo-tv-jsonld'
  ) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = 'goo-tv-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export function applySeo(options: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  year?: string | number;
  category?: string;
  isTv?: boolean;
  image?: string;
  rating?: number | string;
}) {
  const locale = getAppLocale();

  const title =
    options.title?.trim() ||
    `${SITE_NAME} — Watch Movies & Series Online Free in 4K HDR | 20 Live Servers`;

  const description =
    options.description?.trim() ||
    'Stream unlimited movies and web series with 20 unblocked live servers, multi-audio Hindi Dubbed & Dual Audio tracks, instant seek controls, and zero buffering 4K HDR playback.';

  const path =
    options.path ||
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search + window.location.hash
      : '/');

  const canonical = new URL(
    path.startsWith('#') ? `/${path}` : path,
    DEFAULT_ORIGIN
  ).href;

  const keywords = getKeywords(
    options.keywords || [],
    {
      title: options.title,
      year: options.year,
      category: options.category,
      isTv: options.isTv,
    }
  );

  if (typeof document === 'undefined') {
    return;
  }

  // 1. Update Title & Meta
  document.title = title;

  upsertMeta('meta[name="description"]', 'name', description);
  upsertMeta('meta[name="keywords"]', 'name', keywords.slice(0, 100).join(', '));
  upsertMeta('meta[name="robots"]', 'name', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
  upsertMeta('meta[name="googlebot"]', 'name', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
  upsertMeta('meta[name="bingbot"]', 'name', 'index,follow');

  // 2. OpenGraph
  upsertMeta('meta[property="og:title"]', 'property', title);
  upsertMeta('meta[property="og:description"]', 'property', description);
  upsertMeta('meta[property="og:url"]', 'property', canonical);
  upsertMeta('meta[property="og:type"]', 'property', options.isTv ? 'video.tv_show' : 'video.movie');
  upsertMeta('meta[property="og:site_name"]', 'property', SITE_NAME);
  if (options.image) {
    upsertMeta('meta[property="og:image"]', 'property', options.image);
    upsertMeta('meta[name="twitter:image"]', 'name', options.image);
  }

  // 3. Twitter
  upsertMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
  upsertMeta('meta[name="twitter:title"]', 'name', title);
  upsertMeta('meta[name="twitter:description"]', 'name', description);

  // 4. Canonical & Hreflang
  upsertLink('canonical', canonical);
  upsertLink('alternate', canonical, 'x-default');

  // Add top language alternates for global indexing
  TOP_50_LANGUAGES.slice(0, 20).forEach(lang => {
    upsertLink('alternate', `${canonical}?hl=${lang.code}`, lang.code);
  });

  document.documentElement.lang = locale;
  document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

  // 5. Rich Schema.org JSON-LD
  const schemaType = options.isTv ? 'TVSeries' : (options.title ? 'Movie' : 'WebSite');

  if (options.title && (schemaType === 'Movie' || schemaType === 'TVSeries')) {
    upsertJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': schemaType,
          name: options.title,
          url: canonical,
          description,
          image: options.image || `${DEFAULT_ORIGIN}/cherry_blossom_ambient.jpg`,
          dateCreated: options.year ? `${options.year}-01-01` : '2026-01-01',
          inLanguage: locale,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: options.rating || '8.5',
            bestRating: '10',
            ratingCount: '1540'
          },
          potentialAction: {
            '@type': 'WatchAction',
            target: canonical
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            category: 'Free Streaming'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: DEFAULT_ORIGIN
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: options.isTv ? 'TV Series' : 'Movies',
              item: `${DEFAULT_ORIGIN}/#${options.isTv ? 'tv' : 'movies'}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: options.title,
              item: canonical
            }
          ]
        }
      ]
    });
  } else {
    upsertJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: DEFAULT_ORIGIN,
      inLanguage: locale,
      description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${DEFAULT_ORIGIN}/#search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }
}
