export interface SeoKeywordSet {
  primary: string[];
  longTail: string[];
}

export function buildMovieKeywords(title: string, year?: string | number): SeoKeywordSet {
  const suffix = year ? ` ${year}` : '';

  return {
    primary: [
      `watch ${title}`,
      `${title} movie`,
      `${title} online`,
      `watch ${title} online`,
    ],
    longTail: [
      `watch ${title} online free${suffix}`,
      `${title} movie online watch${suffix}`,
      `where to watch ${title} online`,
      `${title} movie details cast rating`,
      `watch ${title} full movie online`,
      `${title} streaming information`,
    ],
  };
}

export function buildCategoryKeywords(category: string): SeoKeywordSet {
  return {
    primary: [
      `${category} movies`,
      `best ${category} movies`,
      `${category} TV shows`,
    ],
    longTail: [
      `best ${category} movies to watch online`,
      `new ${category} movies and TV shows`,
      `${category} movies with ratings and cast`,
      `popular ${category} movies online`,
    ],
  };
}
