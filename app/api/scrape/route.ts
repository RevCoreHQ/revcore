import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ results: mapResults(items), totalFound: items.length });
    }

    // Async — start run, poll, then fetch items
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

    // Poll up to 160s
    const deadline = Date.now() + 160_000;
    let status = '';
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));
      const pollRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const pollData = await pollRes.json();
      status = pollData.data?.status;
      if (status === 'SUCCEEDED') break;
      if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        return NextResponse.json({ error: `Run ${status}` }, { status: 502 });
      }
    }

    if (status !== 'SUCCEEDED') {
      return NextResponse.json({ error: 'Run timed out', runId }, { status: 504 });
    }

    // Fetch dataset items
    const dsUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`;
    const dsRes = await fetch(dsUrl);
    const items = await dsRes.json();
    return NextResponse.json({ results: mapResults(items), totalFound: items.length, runId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapResults(items: any[]): any[] {
  return (items || []).map((item: any) => {
    const addrParts = (item.address || '').split(',').map((s: string) => s.trim());
    const stateZip = addrParts.length >= 3 ? addrParts[addrParts.length - 1] : '';
    const city = addrParts.length >= 3 ? addrParts[addrParts.length - 2] : '';
    const state = stateZip.split(' ')[0] || '';

    let email = '';
    if (item.emails && item.emails.length > 0) {
      email = item.emails[0];
    } else if (item.email) {
      email = item.email;
    }

    return {
      businessName: item.title || item.name || '',
      phone: item.phone || item.phoneUnformatted || '',
      email,
      website: item.website || item.url || '',
      address: item.address || item.street || '',
      city,
      state,
      rating: item.totalScore ?? item.rating ?? 0,
      reviews: item.reviewsCount ?? item.reviews ?? 0,
      category: item.categoryName || item.category || '',
      placeId: item.placeId || '',
      googleUrl: item.url || '',
      lat: item.location?.lat ?? 0,
      lng: item.location?.lng ?? 0,
      claimStatus: item.claimingStatus || '',
      permanentlyClosed: item.permanentlyClosed || false,
      openingHours: item.openingHours || null,
      additionalInfo: item.additionalInfo || null,
    };
  });
}
