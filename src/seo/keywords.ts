export interface SeoKeywordSet {
  primary: string[];
  longTail: string[];
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

export function buildMovieKeywords(
  title: string,
  year?: string | number
): SeoKeywordSet {
  const cleanTitle = title.trim();
  const yearSuffix = year ? ` ${year}` : '';

  return {
    primary: unique([
      `watch ${cleanTitle}`,
      `${cleanTitle} movie`,
      `${cleanTitle} online`,
      `watch ${cleanTitle} online`,
      `${cleanTitle} streaming`,
    ]),

    longTail: unique([
      `watch ${cleanTitle} online free${yearSuffix}`,
      `${cleanTitle} movie online watch${yearSuffix}`,
      `where to watch ${cleanTitle} online`,
      `${cleanTitle} movie details cast rating`,
      `${cleanTitle} movie release date cast`,
      `${cleanTitle} streaming information`,
      `${cleanTitle} movie synopsis`,
      `${cleanTitle} ratings and reviews`,
    ]),
  };
}

export function buildCategoryKeywords(
  category: string
): SeoKeywordSet {
  const cleanCategory = category.trim();

  return {
    primary: unique([
      `${cleanCategory} movies`,
      `best ${cleanCategory} movies`,
      `${cleanCategory} TV shows`,
      `${cleanCategory} streaming`,
    ]),

    longTail: unique([
      `best ${cleanCategory} movies to watch online`,
      `new ${cleanCategory} movies and TV shows`,
      `${cleanCategory} movies with ratings and cast`,
      `popular ${cleanCategory} movies online`,
      `${cleanCategory} movies release dates`,
      `${cleanCategory} TV shows to watch`,
    ]),
  };
}

export function getKeywords(
  extra: string[] = [],
  context?: {
    title?: string;
    year?: string | number;
    category?: string;
  }
): string[] {
  const result: string[] = [];

  if (context?.title?.trim()) {
    const movie = buildMovieKeywords(
      context.title,
      context.year
    );

    result.push(
      ...movie.primary,
      ...movie.longTail
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
