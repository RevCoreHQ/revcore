import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const VERIPHONE_KEY = process.env.VERIPHONE_API_KEY ?? '';

export async function POST(req: NextRequest) {
  if (!VERIPHONE_KEY) {
    return NextResponse.json({ error: 'VERIPHONE_API_KEY not configured' }, { status: 500 });
  }

  let body: { phones: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { phones } = body;
  if (!phones || !Array.isArray(phones) || phones.length === 0) {
    return NextResponse.json({ error: 'phones array is required' }, { status: 400 });
  }

  const results: { phone: string; phone_valid: boolean | null; phone_type: string | null; carrier: string | null }[] = [];
  const BATCH_SIZE = 10;

  for (let i = 0; i < phones.length; i += BATCH_SIZE) {
    const batch = phones.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (phone: string) => {
        try {
          const res = await fetch(
            `https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(phone)}&key=${VERIPHONE_KEY}&default_country=US`
          );
          if (!res.ok) {
            return { phone, phone_valid: null, phone_type: null, carrier: null };
          }
          const data = await res.json();
          return {
            phone,
            phone_valid: data.phone_valid ?? null,
            phone_type: data.phone_type ?? null,
            carrier: data.carrier ?? null,
          };
        } catch {
          return { phone, phone_valid: null, phone_type: null, carrier: null };
        }
      })
    );
    results.push(...batchResults);
    if (i + BATCH_SIZE < phones.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return NextResponse.json({ results });
}
