import { NextRequest, NextResponse } from 'next/server';

type Status = 'pass' | 'warning' | 'fail';
type Impact = 'high' | 'medium' | 'low';

interface SEOCheck {
  id: string;
  category: 'technical' | 'content' | 'images' | 'social';
  title: string;
  status: Status;
  current: string;
  recommendation: string;
  impact: Impact;
  why: string;
}

function extract(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match ? (match[1] ?? match[0])?.trim() || null : null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    let targetUrl = url.trim();
    if (!targetUrl.match(/^https?:\/\//)) targetUrl = 'https://' + targetUrl;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let html = '';
    try {
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RevCore-SEO-Checker/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timeout);
      html = await res.text();
    } catch (err: unknown) {
      clearTimeout(timeout);
      const e = err as Error;
      if (e.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out. The site may be blocking crawlers or is too slow.' }, { status: 408 });
      }
      return NextResponse.json({ error: `Could not reach ${targetUrl}: ${e.message}` }, { status: 500 });
    }

    const isHttps = targetUrl.startsWith('https://');

    // ── Parse ──────────────────────────────────────────────────────────────
    const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
    const metaDesc =
      extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,500})["']/i) ||
      extract(html, /<meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']description["']/i);
    const canonical =
      extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
      extract(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
    const robotsMeta = extract(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    const viewport = extract(html, /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']*)["']/i);

    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    const h1Count = h1Matches.length;
    const h1Text = h1Matches[0] ? h1Matches[0][1].replace(/<[^>]+>/g, '').trim() : '';
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;

    const imgTags = html.match(/<img[^>]+>/gi) || [];
    const imgCount = imgTags.length;
    const missingAlt = imgTags.filter(img => !img.match(/alt=["'][^"'][\s\S]*?["']/i)).length;

    const hasOgTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
    const hasOgDesc = /<meta[^>]+property=["']og:description["']/i.test(html);
    const hasOgImage = /<meta[^>]+property=["']og:image["']/i.test(html);
    const hasSchema = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
    const hasGTag = /gtag\(|google-analytics\.com|googletagmanager\.com/i.test(html);

    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 2).length;

    const titleLen = title?.length || 0;
    const descLen = metaDesc?.length || 0;
    const isNoindex = robotsMeta ? /noindex/i.test(robotsMeta) : false;

    // ── Checks ─────────────────────────────────────────────────────────────
    const checks: SEOCheck[] = [
      // Technical
      {
        id: 'ssl',
        category: 'technical',
        title: 'HTTPS / SSL Certificate',
        status: isHttps ? 'pass' : 'fail',
        current: isHttps ? 'Secure (HTTPS)' : 'Not secure — running on HTTP',
        recommendation: isHttps
          ? 'SSL is active. Keep it renewed annually.'
          : 'Install an SSL certificate and set up 301 redirects from all HTTP URLs to HTTPS.',
        impact: 'high',
        why: 'Google uses HTTPS as a confirmed ranking signal. Browsers flag HTTP sites as "Not Secure," which kills trust and drives homeowners away before they even read your page.',
      },
      {
        id: 'title',
        category: 'technical',
        title: 'Page Title Tag',
        status: !title ? 'fail' : titleLen < 30 || titleLen > 70 ? 'warning' : 'pass',
        current: title ? `"${title}" (${titleLen} chars)` : 'Missing — no title tag found',
        recommendation: !title
          ? 'Add a title tag: [Primary Service] in [City] | [Company Name]'
          : titleLen < 30
          ? 'Title is too short. Target 50–60 characters including your primary keyword and city.'
          : titleLen > 70
          ? 'Title is too long and will be truncated in search results. Trim to 55–60 characters.'
          : 'Title length is optimal.',
        impact: 'high',
        why: "The title tag is the #1 on-page SEO element. It tells Google exactly what the page is about and is the first thing homeowners see in search results — directly controlling your click-through rate.",
      },
      {
        id: 'meta-desc',
        category: 'technical',
        title: 'Meta Description',
        status: !metaDesc ? 'fail' : descLen < 80 || descLen > 165 ? 'warning' : 'pass',
        current: metaDesc
          ? `"${metaDesc.substring(0, 90)}${metaDesc.length > 90 ? '…' : ''}" (${descLen} chars)`
          : 'Missing — no meta description found',
        recommendation: !metaDesc
          ? 'Write a 130–155 char meta description. Include your service, city, and a CTA like "Call today for a free quote."'
          : descLen < 80
          ? 'Too short. Expand to 130–155 characters with your service, location, and a compelling reason to click.'
          : descLen > 165
          ? 'Too long — will be cut off. Trim to 150 characters.'
          : 'Description length is ideal.',
        impact: 'high',
        why: 'Your meta description is your ad copy in Google search results. A compelling description increases click-through rate, which Google uses as a quality signal to improve your ranking over time.',
      },
      {
        id: 'robots',
        category: 'technical',
        title: 'Robots / Indexing Status',
        status: isNoindex ? 'fail' : 'pass',
        current: isNoindex
          ? `BLOCKED from indexing: "${robotsMeta}"`
          : robotsMeta
          ? `Indexable — robots: ${robotsMeta}`
          : 'Indexable (no robots restriction)',
        recommendation: isNoindex
          ? 'Remove "noindex" immediately. This tag is hiding your entire site from Google. It is often added during development and forgotten.'
          : 'Good — page is set to be indexed by search engines.',
        impact: 'high',
        why: 'A noindex tag completely hides the page from Google search results — no impressions, no clicks, no leads. This is one of the most damaging mistakes a site can have and is often invisible to the business owner.',
      },
      {
        id: 'viewport',
        category: 'technical',
        title: 'Mobile Viewport Tag',
        status: viewport ? 'pass' : 'fail',
        current: viewport ? `Configured: "${viewport}"` : 'Missing mobile viewport meta tag',
        recommendation: viewport
          ? 'Mobile viewport is configured correctly.'
          : 'Add: <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head>.',
        impact: 'high',
        why: 'Google uses mobile-first indexing — your mobile site is the primary version Google crawls and ranks. Without a viewport tag, the site renders as a shrunken desktop page on phones, failing the mobile usability test.',
      },
      {
        id: 'canonical',
        category: 'technical',
        title: 'Canonical URL Tag',
        status: canonical ? 'pass' : 'warning',
        current: canonical ? `Set to: ${canonical}` : 'No canonical tag found',
        recommendation: canonical
          ? 'Canonical is set — duplicate content issues are prevented.'
          : 'Add <link rel="canonical" href="[full URL]"> to prevent Google from indexing duplicate versions of the same page.',
        impact: 'medium',
        why: 'Without a canonical tag, Google may index multiple versions of your page (www vs non-www, http vs https, trailing slash), splitting your ranking power across duplicates instead of concentrating it on one URL.',
      },
      {
        id: 'tracking',
        category: 'technical',
        title: 'Analytics / Conversion Tracking',
        status: hasGTag ? 'pass' : 'warning',
        current: hasGTag ? 'Google Analytics / GTM detected' : 'No Google Analytics tracking detected',
        recommendation: hasGTag
          ? 'Analytics active. Ensure conversion goals are set up for form submissions and phone calls.'
          : 'Install Google Analytics 4 and set up conversion events for lead forms and calls.',
        impact: 'medium',
        why: "Without analytics, you have no data on which keywords drive leads, what pages lose visitors, or what your cost-per-lead is. You can't improve what you can't measure.",
      },
      // Content
      {
        id: 'h1',
        category: 'content',
        title: 'H1 Heading Tag',
        status: h1Count === 0 ? 'fail' : h1Count > 1 ? 'warning' : 'pass',
        current:
          h1Count === 0
            ? 'No H1 tag found'
            : h1Count > 1
            ? `${h1Count} H1 tags found — should be exactly 1`
            : `"${h1Text.substring(0, 70)}${h1Text.length > 70 ? '…' : ''}"`,
        recommendation:
          h1Count === 0
            ? 'Add a single H1 tag with your primary keyword: e.g., "Roofing Contractor in Miami, FL — Free Estimates"'
            : h1Count > 1
            ? `Reduce to one H1. Multiple H1s dilute the signal. Currently ${h1Count} found.`
            : 'H1 present. Confirm it includes your primary service keyword and city.',
        impact: 'high',
        why: 'The H1 is the most important content signal on the page. It tells Google (and the visitor) what the page is specifically about. Missing or multiple H1s confuse the algorithm and hurt your topical relevance score.',
      },
      {
        id: 'h2s',
        category: 'content',
        title: 'H2 Subheadings / Page Structure',
        status: h2Count >= 2 ? 'pass' : h2Count === 1 ? 'warning' : 'fail',
        current: h2Count === 0 ? 'No H2 headings found' : `${h2Count} H2 heading${h2Count > 1 ? 's' : ''} found`,
        recommendation:
          h2Count < 2
            ? 'Add H2 headings to organize content into sections (Services, Process, Service Areas, FAQs). Each H2 is an opportunity to rank for a keyword variation.'
            : 'Good structure. Ensure each H2 targets a secondary keyword like "Emergency Roof Repair Miami" or "What to Expect During a Roof Replacement."',
        impact: 'medium',
        why: 'H2s signal content depth to Google. Pages with clear heading hierarchies rank higher because they demonstrate expertise and make it easier for Google to understand all the topics covered on the page.',
      },
      {
        id: 'word-count',
        category: 'content',
        title: 'Content Depth / Word Count',
        status: wordCount > 600 ? 'pass' : wordCount > 300 ? 'warning' : 'fail',
        current: `~${wordCount.toLocaleString()} words of visible text content`,
        recommendation:
          wordCount < 300
            ? 'Critically thin content. Add at least 600 words covering your services, process, service areas, FAQs, and why choose you.'
            : wordCount < 600
            ? 'Content is thin. Expand to 700+ words. Add a FAQ section and break down your service process step-by-step.'
            : 'Content length is competitive. Adding a detailed FAQ section and city-specific content can push rankings higher.',
        impact: 'medium',
        why: "Thin pages get outranked by competitors who provide comprehensive answers to homeowners' questions. Google rewards depth because it signals expertise and reduces pogo-sticking (users returning to search after a bad result).",
      },
      // Images
      {
        id: 'img-alt',
        category: 'images',
        title: 'Image Alt Text',
        status:
          imgCount === 0
            ? 'warning'
            : missingAlt === 0
            ? 'pass'
            : missingAlt > imgCount / 2
            ? 'fail'
            : 'warning',
        current:
          imgCount === 0
            ? 'No images detected on this page'
            : missingAlt === 0
            ? `All ${imgCount} images have alt text`
            : `${missingAlt} of ${imgCount} images are missing alt text`,
        recommendation:
          imgCount === 0
            ? 'Add photos of completed jobs with keyword-rich alt text. Project photos build trust and rank in Google Images.'
            : missingAlt > 0
            ? `Add descriptive alt text to all ${missingAlt} images. Example: alt="metal roof installation in Fort Lauderdale FL"`
            : 'All images have alt text. Review that each description includes a keyword naturally.',
        impact: 'medium',
        why: 'Alt text tells Google what your images show, contributing to image search rankings and reinforcing the overall page topic. Images of completed work with proper alt text also build trust with homeowners viewing the page.',
      },
      // Social / Schema
      {
        id: 'og-tags',
        category: 'social',
        title: 'Open Graph Tags (Social Sharing)',
        status: hasOgTitle && hasOgDesc && hasOgImage ? 'pass' : hasOgTitle || hasOgDesc ? 'warning' : 'fail',
        current: !hasOgTitle
          ? 'No Open Graph tags found'
          : `Title: ${hasOgTitle ? '✓' : '✗'}  Description: ${hasOgDesc ? '✓' : '✗'}  Image: ${hasOgImage ? '✓' : '✗'}`,
        recommendation: !hasOgTitle
          ? 'Add og:title, og:description, and og:image. Without these, shared links appear as blank cards on Facebook and LinkedIn.'
          : 'Add the missing OG tags. All three (title, description, image) are required for a professional-looking shared link.',
        impact: 'medium',
        why: 'When past customers or referral partners share your website on social media, OG tags control the preview. Without them, the link looks unprofessional or blank — reducing referral traffic and brand perception.',
      },
      {
        id: 'schema',
        category: 'social',
        title: 'Schema Markup (Structured Data)',
        status: hasSchema ? 'pass' : 'fail',
        current: hasSchema ? 'JSON-LD structured data detected' : 'No schema markup found',
        recommendation: hasSchema
          ? 'Schema found. Verify LocalBusiness schema includes your NAP (Name, Address, Phone), service areas, and review aggregate.'
          : 'Add LocalBusiness schema markup immediately. This is one of the highest-impact local SEO improvements available.',
        impact: 'high',
        why: 'LocalBusiness schema enables rich results in Google — showing your star rating, phone number, and address directly in search results. This dramatically increases click-through rate for local searches and signals to Google that your business information is verified and trustworthy.',
      },
    ];

    // ── Score (weighted by impact) ──────────────────────────────────────────
    const weights: Record<Impact, number> = { high: 3, medium: 2, low: 1 };
    const pts: Record<Status, number> = { pass: 1, warning: 0.5, fail: 0 };
    let total = 0, earned = 0;
    for (const c of checks) {
      const w = weights[c.impact];
      total += w;
      earned += w * pts[c.status];
    }
    const score = Math.round((earned / total) * 100);

    return NextResponse.json({
      url: targetUrl,
      score,
      wordCount,
      checks,
      summary: {
        pass: checks.filter(c => c.status === 'pass').length,
        warning: checks.filter(c => c.status === 'warning').length,
        fail: checks.filter(c => c.status === 'fail').length,
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
