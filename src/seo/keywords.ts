export interface SeoKeywordSet {
  primary: string[];
  longTail: string[];
  languages: string[];
  global50: string[];
  nativeQueries: string[];
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

// 🌐 TOP 50 WORLDWIDE CINEMA & STREAMING LANGUAGES WITH NATIVE SCRIPTS & QUERY PATTERNS
export const TOP_50_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', searchTemplate: (t: string) => `watch ${t} full movie online free 4k` },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', searchTemplate: (t: string) => `${t} पूरी फिल्म हिंदी में ऑनलाइन देखें फुल मूवी डाउनलोड 1080p` },
  { code: 'es', name: 'Spanish', native: 'Español', searchTemplate: (t: string) => `ver ${t} pelicula completa en español latino online gratis hd 1080p` },
  { code: 'fr', name: 'French', native: 'Français', searchTemplate: (t: string) => `regarder ${t} film complet streaming vf gratuit en français vostfr` },
  { code: 'de', name: 'German', native: 'Deutsch', searchTemplate: (t: string) => `${t} ganzer film deutsch online kostenlos streamen 1080p hd` },
  { code: 'ja', name: 'Japanese', native: '日本語', searchTemplate: (t: string) => `${t} 映画 フル 無料 視聴 日本語 字幕 吹き替え オンライン` },
  { code: 'ko', name: 'Korean', native: '한국어', searchTemplate: (t: string) => `${t} 다시보기 한국어 자막 무료 영화 스트리밍 고화질` },
  { code: 'ar', name: 'Arabic', native: 'العربية', searchTemplate: (t: string) => `مشاهدة فيلم ${t} مترجم كامل اون لاين بجودة عالية 1080p` },
  { code: 'pt', name: 'Portuguese', native: 'Português', searchTemplate: (t: string) => `assistir ${t} filme completo dublado online gratis em português hd` },
  { code: 'ru', name: 'Russian', native: 'Русский', searchTemplate: (t: string) => `смотреть ${t} фильм онлайн бесплатно в хорошем качестве hd 1080` },
  { code: 'it', name: 'Italian', native: 'Italiano', searchTemplate: (t: string) => `guardare ${t} film completo streaming ita gratis in altadefinizione` },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', searchTemplate: (t: string) => `${t} türkçe dublaj izle full hd tek parça 1080p filmi` },
  { code: 'zh', name: 'Chinese', native: '中文', searchTemplate: (t: string) => `${t} 完整版 免费 在线 观看 中文字幕 高清 1080p` },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', searchTemplate: (t: string) => `bekijk ${t} volledige film online gratis nederlands ondertiteld` },
  { code: 'pl', name: 'Polish', native: 'Polski', searchTemplate: (t: string) => `oglądaj ${t} cały film online za darmo lektor pl napisy hd` },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', searchTemplate: (t: string) => `nonton film ${t} sub indo full movie streaming gratis 1080p` },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', searchTemplate: (t: string) => `xem phim ${t} vietsub thuyết minh hd full online miễn phí` },
  { code: 'th', name: 'Thai', native: 'ไทย', searchTemplate: (t: string) => `ดูหนัง ${t} เต็มเรื่อง พากย์ไทย ซับไทย hd ฟรี ไม่กระตุก` },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', searchTemplate: (t: string) => `${t} ফুল মুভি অনলাইন ফ্রি দেখুন বাংলা ডাব এইচডি` },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', searchTemplate: (t: string) => `${t} ਪੂਰੀ ਫਿਲਮ ਆਨਲਾਈਨ ਮੁਫ਼ਤ ਦੇਖੋ ਪੰਜਾਬੀ ਮੂਵੀ 1080p` },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', searchTemplate: (t: string) => `${t} முழு படம் தமிழில் இலவசமாக பார்க்க தமிழ் டப்பிங்` },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', searchTemplate: (t: string) => `${t} పూర్తి సినిమా తెలుగులో ఉచితంగా చూడండి తెలుగు డబ్బింగ్` },
  { code: 'mr', name: 'Marathi', native: 'मराठी', searchTemplate: (t: string) => `${t} पूर्ण चित्रपट मराठीत ऑनलाईन मोफत बघा एचडी` },
  { code: 'ur', name: 'Urdu', native: 'اردو', searchTemplate: (t: string) => `${t} پوری فلم آن لائن مفت دیکھیں اردو میں مکمل ایچ ڈی` },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', searchTemplate: (t: string) => `${t} સંપૂર્ણ મૂવી ગુજરાતીમાં ઓનલાઈન જુઓ મફત` },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', searchTemplate: (t: string) => `${t} ಪೂರ್ಣ ಚಲನಚಿತ್ರ ಕನ್ನಡದಲ್ಲಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ ಉಚಿತ` },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', searchTemplate: (t: string) => `${t} മുഴുവൻ സിനിമ മലയാളത്തിൽ ഓൺലൈനിൽ സൗജന്യമായി കാണുക` },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', searchTemplate: (t: string) => `${t} ସମ୍ପୂର୍ଣ୍ଣ ଚଳଚ୍ଚିତ୍ର ଅନଲାଇନ୍ ମାଗଣାରେ ଦେଖନ୍ତୁ` },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', searchTemplate: (t: string) => `panoorin ang ${t} buong pelikula online libre pinoy hd` },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', searchTemplate: (t: string) => `дивитися фільм ${t} онлайн українською мовою безкоштовно hd` },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', searchTemplate: (t: string) => `δείτε ${t} πλήρη ταινία online με ελληνικούς υπότιτλους hd` },
  { code: 'cs', name: 'Czech', native: 'Čeština', searchTemplate: (t: string) => `sledovat ${t} celý film online zdarma český dabing hd` },
  { code: 'sv', name: 'Swedish', native: 'Svenska', searchTemplate: (t: string) => `se ${t} hela filmen gratis online med svensk text hd` },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', searchTemplate: (t: string) => `nézd meg a ${t} teljes filmet online ingyen magyar szinkronnal` },
  { code: 'ro', name: 'Romanian', native: 'Română', searchTemplate: (t: string) => `vezi ${t} film online subtitrat in romana gratis hd 1080p` },
  { code: 'da', name: 'Danish', native: 'Dansk', searchTemplate: (t: string) => `se ${t} hele filmen gratis online med danske undertekster` },
  { code: 'fi', name: 'Finnish', native: 'Suomi', searchTemplate: (t: string) => `katso ${t} koko elokuva ilmaiseksi netissä suomeksi` },
  { code: 'no', name: 'Norwegian', native: 'Norsk', searchTemplate: (t: string) => `se ${t} hele filmen gratis på nett med norsk tekst` },
  { code: 'he', name: 'Hebrew', native: 'עברית', searchTemplate: (t: string) => `צפייה ישירה בסרט ${t} עם תרגום מובנה בעברית מלא` },
  { code: 'fa', name: 'Persian', native: 'فارسی', searchTemplate: (t: string) => `تماشای آنلاین فیلم ${t} با زیرنویس فارسی رایگان` },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', searchTemplate: (t: string) => `tonton ${t} filem penuh online percuma sarikata melayu` },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', searchTemplate: (t: string) => `tazama ${t} filamu nzima mtandaoni bila malipo` },
  { code: 'sr', name: 'Serbian', native: 'Srpski', searchTemplate: (t: string) => `gledaj ${t} ceo film online sa prevodom besplatno hd` },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', searchTemplate: (t: string) => `gledaj ${t} cijeli film online s prijevodom besplatno` },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', searchTemplate: (t: string) => `sledovať ${t} celý film online zadarmo so slovenským dabingom` },
  { code: 'bg', name: 'Bulgarian', native: 'Български', searchTemplate: (t: string) => `гледай ${t} цял филм онлайн с българско аудио субтитри` },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', searchTemplate: (t: string) => `žiūrėti ${t} pilną filmą internetu nemokamai su lietuviškais subtitrais` },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', searchTemplate: (t: string) => `skatīties ${t} pilnu filmu tiešsaistē bez maksas latviešu valodā` },
  { code: 'et', name: 'Estonian', native: 'Eesti', searchTemplate: (t: string) => `vaata ${t} täispikka filmi tasuta veebis eestikeelsete subtiitritega` },
  { code: 'fil', name: 'Filipino', native: 'Filipino', searchTemplate: (t: string) => `manood ng ${t} buong pelikula libre tagalog dubbed pinoy` },
] as const;

export function buildMovieKeywords(
  title: string,
  year?: string | number,
  isTv?: boolean
): SeoKeywordSet {
  const cleanTitle = title.trim();
  const yearSuffix = year ? ` ${year}` : '';
  const typeLabel = isTv ? 'web series all seasons episodes' : 'full movie';

  // 1. High-CTR, Zero-Competition Long-Tail Queries (Targeted for Instant Ranking)
  const longTail = unique([
    `watch ${cleanTitle}${yearSuffix} ${typeLabel} online free 4k`,
    `${cleanTitle} full movie free online streaming no sign up`,
    `${cleanTitle}${yearSuffix} hindi dubbed full movie download 1080p hd`,
    `${cleanTitle} dual audio hindi english bluray 2160p`,
    `where to watch ${cleanTitle} online free without ads`,
    `${cleanTitle} streaming 20 live servers auto sync`,
    `${cleanTitle}${yearSuffix} download direct mp4 streamtape google drive`,
    `${cleanTitle} cast rating release date trailer storyline imdb`,
    `${cleanTitle} unblocked streaming superembed 4k`,
    `${cleanTitle} netflix hotstar prime video ott release watch free`,
    isTv ? `${cleanTitle} all seasons episodes online free hd english sub` : `${cleanTitle} full movie 1080p hd bluray`,
    isTv ? `${cleanTitle} season 1 episode 1 stream free 1080p` : `${cleanTitle} english sub movie online free`,
    `${cleanTitle} zero buffering 4k hdr cinema online`,
  ]);

  // 2. Short High-Volume Anchor Keywords
  const primary = unique([
    `watch ${cleanTitle}`,
    `${cleanTitle} online`,
    `${cleanTitle} movie`,
    `${cleanTitle} stream`,
    `${cleanTitle} free`,
    `watch ${cleanTitle} free`,
    `${cleanTitle} hindi dubbed`,
    `${cleanTitle} 4k hd`,
    `${cleanTitle} download`,
    `${cleanTitle} full movie`,
  ]);

  // 3. Top 50 Worldwide Native Language Search Queries
  const nativeQueries = TOP_50_LANGUAGES.map(lang => lang.searchTemplate(cleanTitle));

  // 4. Global Suffix Combinations
  const global50 = TOP_50_LANGUAGES.map(lang => `${cleanTitle} ${lang.name} Sub / Dub`);

  return {
    primary,
    longTail,
    languages: TOP_50_LANGUAGES.map(l => l.name),
    global50,
    nativeQueries,
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
      `watch ${cleanCategory} online free`,
    ]),

    longTail: unique([
      `best ${cleanCategory} movies to watch online free 4k`,
      `new ${cleanCategory} movies and web series 1080p`,
      `${cleanCategory} hindi dubbed movies collection online`,
      `unlimited free ${cleanCategory} streaming no registration`,
      `${cleanCategory} top rated cinema releases 2026`,
      `free online ${cleanCategory} high speed 20 servers`,
    ]),

    languages: ['English', 'Hindi', 'Spanish', 'Tamil', 'Telugu'],
    global50: TOP_50_LANGUAGES.slice(0, 20).map(lang => `${cleanCategory} ${lang.name}`),
    nativeQueries: TOP_50_LANGUAGES.slice(0, 15).map(lang => lang.searchTemplate(cleanCategory)),
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
    'hollywood movies dual audio 4k',
    'bollywood movies full watch online hindi',
    'tollywood telugu movies online free hd',
    'kollywood tamil movies in hindi dubbed',
    'mollywood malayalam cinema online free',
    'sandalwood kannada movies full 1080p',
    'pollywood punjabi movies online comedy',
    'tollywood bengali movies online free',
    'dhollywood gollywood gujarati movies',
    'ollywood odia movies online free',
    'bhojiwood bhojpuri movies full hd',
    'nollywood nigerian cinema movies online',
    'hallyuwood korean kdrama movies online',
    'dhallywood bangladesh cinema online free',
    'lollywood pakistani urdu movies online',
    'japanese anime nihon eiga movies online',
    'french cinema streaming vf gratuit 1080p',
    'spanish cinema peliculas online gratis',
    'turkish cinema dizileri izle full hd',
    'chinese cinema chinawood martial arts',
    '20 live streaming servers unblocked',
    'unblocked cinema player 4k hdr zero sandbox',
    'superembed movies free watch online',
    'world class movie streaming website 2026',
    'fast streaming cinema no buffering',
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
      ...movie.nativeQueries,
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
