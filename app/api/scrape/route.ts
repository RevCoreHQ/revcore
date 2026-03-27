import { NextRequest, NextResponse } from 'next/server';
import { mapResults } from './utils';

export const maxDuration = 180;

const APIFY_TOKEN = process.env.APIFY_API_TOKEN ?? '';
const ACTOR_ID = 'compass~crawler-google-places';

interface ScrapeBody {
  searchQuery: string;
  locationQuery: string;
  maxResults: number;
  language?: string;
  zoom?: number;
}

export async function POST(req: NextRequest) {
  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: 'APIFY_API_TOKEN not configured' }, { status: 500 });
  }

  let body: ScrapeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { searchQuery, locationQuery, maxResults = 50, language = 'en', zoom = 12 } = body;
  if (!searchQuery || !locationQuery) {
    return NextResponse.json({ error: 'searchQuery and locationQuery are required' }, { status: 400 });
  }

  const input = {
    searchStringsArray: [searchQuery],
    locationQuery,
    maxCrawledPlacesPerSearch: maxResults,
    language,
    zoom,
    skipClosedPlaces: true,
    scrapeContacts: true,
    scrapeReviewsPersonalData: false,
  };

  try {
    if (maxResults <= 100) {
      // Sync — blocks until done, returns dataset items directly
      const url = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=170`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `Apify error: ${res.status}`, detail: text }, { status: 502 });
      }

      const items = await res.json();
      return NextResponse.json({ results: mapResults(items), totalFound: items.length, mode: 'sync' });
    }

    // Async — start run, return runId immediately (client polls /api/scrape/status)
    const startUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`;
    const startRes = await fetch(startUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!startRes.ok) {
      const text = await startRes.text();
      return NextResponse.json({ error: `Apify start error: ${startRes.status}`, detail: text }, { status: 502 });
    }

    const runData = await startRes.json();
    const runId = runData.data?.id;
    if (!runId) {
      return NextResponse.json({ error: 'No run ID returned' }, { status: 502 });
    }

    return NextResponse.json({ runId, mode: 'async' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
