export interface SerpResult {
  brandSearch: SerpSearchResult;
  localPack: SerpSearchResult;
  reviewSearch: SerpSearchResult;
  competitorSearch: SerpSearchResult;
  keywordRankings: KeywordRanking[];
}

interface SerpSearchResult {
  query: string;
  organicResults: Array<{
    position: number;
    title: string;
    link: string;
    snippet: string;
    domain: string;
  }>;
  localResults: Array<{
    title: string;
    rating: number;
    reviews: number;
    address: string;
    type: string;
  }>;
  totalResults: number;
  error?: string;
}

export interface KeywordRanking {
  keyword: string;
  position: number | null; // null = not found in top 100
  page: number | null;
  url: string | null;
}

async function searchGoogle(query: string, location?: string): Promise<SerpSearchResult> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return { query, organicResults: [], localResults: [], totalResults: 0, error: 'SERPAPI_KEY not configured' };
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      engine: 'google',
      q: query,
      num: '10',
      gl: 'ca',
      hl: 'en',
    });

    if (location) {
      params.set('location', location);
    }

    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    if (!response.ok) {
      return { query, organicResults: [], localResults: [], totalResults: 0, error: `SERP API error: ${response.status}` };
    }

    const data = await response.json();

    const organicResults = (data.organic_results || []).slice(0, 10).map((r: Record<string, unknown>) => ({
      position: r.position as number,
      title: (r.title as string) || '',
      link: (r.link as string) || '',
      snippet: (r.snippet as string) || '',
      domain: (r.displayed_link as string) || '',
    }));

    const localResults = (data.local_results?.places || data.local_results || []).slice(0, 5).map((r: Record<string, unknown>) => ({
      title: (r.title as string) || '',
      rating: (r.rating as number) || 0,
      reviews: (r.reviews as number) || 0,
      address: (r.address as string) || '',
      type: (r.type as string) || '',
    }));

    return {
      query,
      organicResults,
      localResults,
      totalResults: data.search_information?.total_results || 0,
    };
  } catch (err: unknown) {
    return { query, organicResults: [], localResults: [], totalResults: 0, error: err instanceof Error ? err.message : 'Search failed' };
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export async function runSerpEnrichment(
  businessName: string,
  websiteUrl: string,
  city?: string,
  industry?: string
): Promise<SerpResult> {
  const domain = extractDomain(websiteUrl);
  const location = city ? `${city}, British Columbia, Canada` : 'British Columbia, Canada';

  // Run searches in parallel
  const [brandSearch, localPack, reviewSearch, competitorSearch] = await Promise.all([
    searchGoogle(`"${businessName}"`, location),
    searchGoogle(`${businessName} ${city || ''}`.trim(), location),
    searchGoogle(`${businessName} reviews`, location),
    searchGoogle(`${industry || 'business'} ${city || 'Kootenay'}`, location),
  ]);

  // Check keyword rankings - does target domain appear in competitor search?
  const keywordRankings: KeywordRanking[] = [];

  // Check brand ranking
  const brandPos = brandSearch.organicResults.find(r => r.link.includes(domain));
  keywordRankings.push({
    keyword: businessName,
    position: brandPos?.position || null,
    page: brandPos ? Math.ceil(brandPos.position / 10) : null,
    url: brandPos?.link || null,
  });

  // Check industry + city ranking
  if (industry && city) {
    const industryPos = competitorSearch.organicResults.find(r => r.link.includes(domain));
    keywordRankings.push({
      keyword: `${industry} ${city}`,
      position: industryPos?.position || null,
      page: industryPos ? Math.ceil(industryPos.position / 10) : null,
      url: industryPos?.link || null,
    });
  }

  // Check local pack presence
  const inLocalPack = localPack.localResults.some(r =>
    r.title.toLowerCase().includes(businessName.toLowerCase())
  );
  keywordRankings.push({
    keyword: `${businessName} (Local Pack)`,
    position: inLocalPack ? 1 : null,
    page: inLocalPack ? 1 : null,
    url: inLocalPack ? websiteUrl : null,
  });

  return {
    brandSearch,
    localPack,
    reviewSearch,
    competitorSearch,
    keywordRankings,
  };
}
