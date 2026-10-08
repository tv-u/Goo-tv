import { getAppLocale } from '../i18n';

const SITE_NAME = 'GOO TV';
const DEFAULT_ORIGIN =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://goo-tv.pages.dev';

function upsertMeta(
  selector: string,
  attribute: string,
  value: string
) {
  let node = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, selector.includes('property=') ? selector.split('"')[1] : selector.split('"')[1]);
    document.head.appendChild(node);
  }

  node.content = value;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;

  let node = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!node) {
    node = document.createElement('link');
    node.rel = rel;
    if (hreflang) node.hreflang = hreflang;
    document.head.appendChild(node);
  }

  node.href = href;
}

export function applySeo(options: {
  title?: string;
  description?: string;
  path?: string;
}) {
  const locale = getAppLocale();
  const title =
    options.title ||
    `${SITE_NAME} — Watch Movies & TV Shows Online`;

  const description =
    options.description ||
    'Discover movies and TV shows with search, genres, ratings and a smooth cinema experience.';

  const path = options.path || window.location.pathname;
  const canonical = new URL(path, DEFAULT_ORIGIN).href;

  document.title = title;

  upsertMeta(
    'meta[name="description"]',
    'name',
    description
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
    'meta[name="twitter:title"]',
    'name',
    title
  );

  upsertMeta(
    'meta[name="twitter:description"]',
    'name',
    description
  );

  upsertLink('canonical', canonical);

  document.documentElement.lang = locale;
  document.documentElement.dir =
    ['ar', 'fa', 'he', 'ur'].includes(locale) ? 'rtl' : 'ltr';

  upsertJsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: DEFAULT_ORIGIN,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${DEFAULT_ORIGIN}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

function upsertJsonLd(data: Record<string, unknown>) {
  const id = 'goo-tv-jsonld';

  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}
