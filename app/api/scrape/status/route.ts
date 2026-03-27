import { NextRequest, NextResponse } from 'next/server';
import { mapResults } from '../utils';

export const maxDuration = 30;

const APIFY_TOKEN = process.env.APIFY_API_TOKEN ?? '';

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get('runId');
  if (!runId) {
    return NextResponse.json({ error: 'runId is required' }, { status: 400 });
  }
  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: 'APIFY_API_TOKEN not configured' }, { status: 500 });
  }

  try {
    const pollRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    if (!pollRes.ok) {
      return NextResponse.json({ error: `Poll error: ${pollRes.status}` }, { status: 502 });
    }

    const pollData = await pollRes.json();
    const status = pollData.data?.status;

    if (status === 'SUCCEEDED') {
      const dsUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`;
      const dsRes = await fetch(dsUrl);
      const items = await dsRes.json();
      return NextResponse.json({ status: 'SUCCEEDED', results: mapResults(items), totalFound: items.length });
    }

    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      return NextResponse.json({ status, error: `Run ${status}` });
    }

    return NextResponse.json({ status: 'RUNNING' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
