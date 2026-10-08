import { getKeywords } from './keywords';
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
}) {
  const locale = getAppLocale();

  const title =
    options.title?.trim() ||
    `${SITE_NAME} — Watch Movies & TV Shows Online`;

  const description =
    options.description?.trim() ||
    'Discover movies and TV shows with search, genres, ratings, cast information and a smooth cinema experience.';

  const path =
    options.path ||
    (typeof window !== 'undefined'
      ? window.location.pathname
      : '/');

  const canonical = new URL(
    path,
    DEFAULT_ORIGIN
  ).href;

  const keywords = getKeywords(
    options.keywords || [],
    {
      title: options.title,
      year: options.year,
      category: options.category,
    }
  );

  if (typeof document === 'undefined') {
    return;
  }

  document.title = title;

  upsertMeta(
    'meta[name="description"]',
    'name',
    description
  );

  upsertMeta(
    'meta[name="keywords"]',
    'name',
    keywords.join(', ')
  );

  upsertMeta(
    'meta[name="robots"]',
    'name',
    'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  );

  upsertMeta(
    'meta[property="og:title"]',
    'property',
    title
  );

  upsertMeta(
    'meta[property="og:description"]',
    'property',
    description
  );

  upsertMeta(
    'meta[property="og:url"]',
    'property',
    canonical
  );

  upsertMeta(
    'meta[property="og:type"]',
    'property',
    'website'
  );

  upsertMeta(
    'meta[property="og:site_name"]',
    'property',
    SITE_NAME
  );

  upsertMeta(
    'meta[name="twitter:card"]',
    'name',
    'summary_large_image'
  );

  upsertMeta(
    'meta[name="twitter:title"]',
    'name',
    title
  );

  upsertMeta(
    'meta[name="twitter:description"]',
    'name',
    description
  );

  upsertLink(
    'canonical',
    canonical
  );

  document.documentElement.lang = locale;

  document.documentElement.dir =
    RTL_LOCALES.has(locale)
      ? 'rtl'
      : 'ltr';

  upsertJsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: DEFAULT_ORIGIN,
    inLanguage: locale,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target:
        `${DEFAULT_ORIGIN}/search?q={search_term_string}`,
      'query-input':
        'required name=search_term_string',
    },
  });
}
