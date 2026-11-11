export interface SeoKeywordSet {
  primary: string[];
  longTail: string[];
  languages: string[];
  global50: string[];
}

function unique(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map(value => value.trim().replace(/\s+/g, ' '))
        .filter(Boolean)
    )
  );
}

// TOP 50 WORLDWIDE CINEMA & STREAMING LANGUAGES
export const TOP_50_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', suffix: 'English Sub / Dub' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', suffix: 'Hindi Dubbed' },
  { code: 'es', name: 'Spanish', native: 'Español', suffix: 'en Español Castellano Latino' },
  { code: 'fr', name: 'French', native: 'Français', suffix: 'en Français VF VOSTFR' },
  { code: 'de', name: 'German', native: 'Deutsch', suffix: 'auf Deutsch German Stream' },
  { code: 'ja', name: 'Japanese', native: '日本語', suffix: 'Japanese Anime Sub Eng' },
  { code: 'ko', name: 'Korean', native: '한국어', suffix: 'Korean Drama Eng Sub' },
  { code: 'ar', name: 'Arabic', native: 'العربية', suffix: 'مترجم بالعربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português', suffix: 'em Português Dublado' },
  { code: 'ru', name: 'Russian', native: 'Русский', suffix: 'на русском озвучка' },
  { code: 'it', name: 'Italian', native: 'Italiano', suffix: 'in Italiano streaming' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', suffix: 'Türkçe Dublaj Altyazılı' },
  { code: 'zh', name: 'Chinese', native: '中文', suffix: '中文字幕' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', suffix: 'Nederlands ondertiteld' },
  { code: 'pl', name: 'Polish', native: 'Polski', suffix: 'Polski Lektor z napisami' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', suffix: 'Sub Indo' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', suffix: 'Vietsub Thuyết Minh' },
  { code: 'th', name: 'Thai', native: 'ไทย', suffix: 'พากย์ไทย ซับไทย' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', suffix: 'Bengali Dubbed' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', suffix: 'Punjabi Movie Online' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', suffix: 'Tamil Dubbed Movie' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', suffix: 'Telugu Dubbed Movie' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', suffix: 'Marathi Cinema' },
  { code: 'ur', name: 'Urdu', native: 'اردو', suffix: 'Urdu Dubbed Free' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', suffix: 'Gujarati Cinema' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', suffix: 'Kannada Dubbed Movie' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', suffix: 'Malayalam Dubbed Movie' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', suffix: 'Odia Movie Online' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', suffix: 'Tagalog Dubbed Pinoy' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', suffix: 'українською мовою' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', suffix: 'με ελληνικούς υπότιτλους' },
  { code: 'cs', name: 'Czech', native: 'Čeština', suffix: 's českým dabingem' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', suffix: 'med svensk text' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', suffix: 'magyar szinkronnal' },
  { code: 'ro', name: 'Romanian', native: 'Română', suffix: 'subtitrat in romana' },
  { code: 'da', name: 'Danish', native: 'Dansk', suffix: 'med danske undertekster' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', suffix: 'suomeksi tekstitetty' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', suffix: 'med norsk tekst' },
  { code: 'he', name: 'Hebrew', native: 'עברית', suffix: 'עם תרגום לעברית' },
  { code: 'fa', name: 'Persian', native: 'فارسی', suffix: 'با زیرنویس فارسی' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', suffix: 'Melayu Subtitle' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', suffix: 'Kiswahili Movie' },
  { code: 'sr', name: 'Serbian', native: 'Srpski', suffix: 'sa prevodom' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', suffix: 's prijevodom' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', suffix: 'so slovenským dabingom' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', suffix: 'с българско аудио' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', suffix: 'su lietuviškais subtitrais' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', suffix: 'ar latviešu subtitriem' },
  { code: 'et', name: 'Estonian', native: 'Eesti', suffix: 'eestikeelsete subtiitritega' },
  { code: 'fil', name: 'Filipino', native: 'Filipino', suffix: 'Pinoy HD Cinema' },
] as const;

export function buildMovieKeywords(
  title: string,
  year?: string | number,
  isTv?: boolean
): SeoKeywordSet {
  const cleanTitle = title.trim();
  const yearSuffix = year ? ` ${year}` : '';
  const typeLabel = isTv ? 'web series TV show' : 'full movie';

  // High-CTR, Zero-Competition Long-Tail Keywords
  const longTail = unique([
    `watch ${cleanTitle}${yearSuffix} ${typeLabel} online free 4k`,
    `${cleanTitle} full movie online streaming no signup`,
    `${cleanTitle}${yearSuffix} hindi dubbed full movie download 1080p`,
    `${cleanTitle} dual audio hindi english bluray 2160p`,
    `where to watch ${cleanTitle} online free without ads`,
    `${cleanTitle} streaming 20 live servers auto sync`,
    `${cleanTitle}${yearSuffix} download direct mp4 streamtape google drive`,
    `${cleanTitle} cast rating release date trailer storyline`,
    `${cleanTitle} unblocked streaming superembed autoembed`,
    isTv ? `${cleanTitle} all seasons episodes online free hd` : `${cleanTitle} full movie 1080p hd bluray`,
    isTv ? `${cleanTitle} season 1 episode 1 stream free` : `${cleanTitle} english sub movie online`,
  ]);

  // Primary short queries
  const primary = unique([
    `watch ${cleanTitle}`,
    `${cleanTitle} online`,
    `${cleanTitle} movie`,
    `${cleanTitle} stream`,
    `${cleanTitle} free`,
    `watch ${cleanTitle} free`,
    `${cleanTitle} hindi dubbed`,
    `${cleanTitle} 4k hd`,
  ]);

  // Top 50 global language targeted keywords
  const global50 = TOP_50_LANGUAGES.map(lang => 
    `${cleanTitle} ${lang.suffix}`
  );

  return {
    primary,
    longTail,
    languages: TOP_50_LANGUAGES.map(l => l.name),
    global50,
  };
}

export function buildCategoryKeywords(
  category: string
): SeoKeywordSet {
  const cleanCategory = category.trim();

  return {
    primary: unique([
      `${cleanCategory} movies`,
      `best ${cleanCategory} movies 2026`,
      `${cleanCategory} TV shows`,
      `${cleanCategory} free streaming 4k`,
    ]),

    longTail: unique([
      `best ${cleanCategory} movies to watch online free 4k`,
      `new ${cleanCategory} movies and web series 1080p`,
      `${cleanCategory} hindi dubbed movies collection`,
      `unlimited free ${cleanCategory} streaming no registration`,
      `${cleanCategory} top rated cinema releases`,
    ]),

    languages: ['English', 'Hindi', 'Spanish', 'Tamil', 'Telugu'],
    global50: TOP_50_LANGUAGES.slice(0, 15).map(lang => `${cleanCategory} ${lang.suffix}`),
  };
}

export function getKeywords(
  extra: string[] = [],
  context?: {
    title?: string;
    year?: string | number;
    category?: string;
    isTv?: boolean;
  }
): string[] {
  const result: string[] = [
    'goo tv',
    'goo tv online free',
    'watch free movies online no sign up',
    'hindi dubbed movies 4k',
    'hollywood movies dual audio',
    'south movies in hindi',
    'punjabi movies online free',
    'kdrama hindi dubbed',
    '20 live streaming servers',
    'unblocked cinema player 4k'
  ];

  if (context?.title?.trim()) {
    const movie = buildMovieKeywords(
      context.title,
      context.year,
      context.isTv
    );

    result.push(
      ...movie.primary,
      ...movie.longTail,
      ...movie.global50
    );
  }

  if (context?.category?.trim()) {
    const category = buildCategoryKeywords(
      context.category
    );

    result.push(
      ...category.primary,
      ...category.longTail
    );
  }

  result.push(...extra);

  return unique(result);
}

export default getKeywords;
