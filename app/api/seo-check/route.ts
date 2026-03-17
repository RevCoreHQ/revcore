import { NextRequest, NextResponse } from 'next/server';

type Status = 'pass' | 'warning' | 'fail';
type Impact = 'high' | 'medium' | 'low';

interface SEOCheck {
  id: string;
  category: 'technical' | 'content' | 'images' | 'social' | 'local';
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

async function fetchSitemapUrls(origin: string): Promise<{ urls: string[]; found: boolean }> {
  const attempts = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap`];
  for (const sitemapUrl of attempts) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(sitemapUrl, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RevCore-SEO-Checker/1.0)' },
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const text = await res.text();
      if (!/<(?:urlset|sitemapindex)/i.test(text)) continue;

      if (/<sitemapindex/i.test(text)) {
        const childUrl = extract(text, /<loc>([^<]+)<\/loc>/i);
        const sitemapCount = (text.match(/<sitemap>/gi) || []).length;
        if (childUrl) {
          try {
            const ctrl2 = new AbortController();
            const t2 = setTimeout(() => ctrl2.abort(), 5000);
            const res2 = await fetch(childUrl, {
              signal: ctrl2.signal,
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RevCore-SEO-Checker/1.0)' },
            });
            clearTimeout(t2);
            const text2 = await res2.text();
            const childUrls = [...text2.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => m[1].trim());
            if (childUrls.length > 0) {
              const total = childUrls.length * Math.max(1, sitemapCount);
              const fakeExtra = Array.from({ length: total - childUrls.length }, (_, i) => `__est__${i}`);
              return { urls: [...childUrls, ...fakeExtra], found: true };
            }
          } catch { /* ignore */ }
        }
        return { urls: [], found: true };
      }

      const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => m[1].trim());
      return { urls, found: urls.length > 0 };
    } catch { /* try next */ }
  }
  return { urls: [], found: false };
}

async function fetchRobotsTxt(origin: string): Promise<{ found: boolean; content: string; blocksAll: boolean; blocksCrawlers: boolean }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${origin}/robots.txt`, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RevCore-SEO-Checker/1.0)' },
    });
    clearTimeout(t);
    if (!res.ok) return { found: false, content: '', blocksAll: false, blocksCrawlers: false };
    const text = await res.text();
    if (!text.includes('User-agent') && !text.includes('user-agent')) {
      return { found: false, content: '', blocksAll: false, blocksCrawlers: false };
    }
    const blocksAll = /Disallow:\s*\/\s*$/m.test(text) && /User-agent:\s*\*/m.test(text);
    const blocksCrawlers = /Disallow:\s*\/(?!\s*$)/m.test(text);
    return { found: true, content: text.substring(0, 500), blocksAll, blocksCrawlers };
  } catch {
    return { found: false, content: '', blocksAll: false, blocksCrawlers: false };
  }
}

function categorizeUrls(urls: string[], origin: string) {
  const SERVICE_RE = /\b(service|repair|install|replac|clean|roof|gutter|siding|window|door|flooring|paint|plumb|electr|hvac|heat|cool|landscap|lawn|tree|fence|deck|concrete|driveway|paving|pool|solar|bathroom|kitchen|remodel|renovation|restoration|waterproof|insulation|foundation|basement|handyman|pest|pressure.?wash|power.?wash|carpet|tile|cabinet|coating|sealing|stucco|drywall|framing|inspection)\b/i;
  const LOCATION_RE = /([-\/](al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)([-\/\d]|$))|\b(in|near|around|serving)[-\s][\w-]+|service[-_]area|areas?[-_]served|cities[-_]served|locations?[-\/]/i;
  const BLOG_RE = /\/(blog|news|article|post|resource|guide|tip|learn|insight)/i;
  const SKIP_RE = /\/(contact|about|privacy|terms|faq|gallery|testimonials?|reviews?|team|careers?|cart|checkout|account|login|register|wp-|feed|rss|sitemap|search|tag\/|category\/|author\/|page\/\d|\?)/i;

  let servicePages = 0, locationPages = 0, blogPages = 0;
  for (const url of urls) {
    if (url.startsWith('__est__')) continue;
    const path = url.replace(origin, '').replace(/^https?:\/\/[^/]+/, '');
    if (SKIP_RE.test(path) || path === '/' || path === '') continue;
    if (BLOG_RE.test(path)) { blogPages++; continue; }
    if (LOCATION_RE.test(path)) { locationPages++; continue; }
    if (SERVICE_RE.test(path)) { servicePages++; }
  }
  return { servicePages, locationPages, blogPages };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    let targetUrl = url.trim();
    if (!targetUrl.match(/^https?:\/\//)) targetUrl = 'https://' + targetUrl;

    const origin = new URL(targetUrl).origin;

    // ── Fetch page + sitemap + robots.txt in parallel ─────────────────────────
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const fetchStart = Date.now();
    const [pageResult, sitemapResult, robotsResult] = await Promise.allSettled([
      fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RevCore-SEO-Checker/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      }),
      fetchSitemapUrls(origin),
      fetchRobotsTxt(origin),
    ]);

    clearTimeout(timeout);
    const responseTimeMs = Date.now() - fetchStart;

    if (pageResult.status === 'rejected') {
      const e = pageResult.reason as Error;
      if (e.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out. The site may be blocking crawlers or is too slow.' }, { status: 408 });
      }
      return NextResponse.json({ error: `Could not reach ${targetUrl}: ${e.message}` }, { status: 500 });
    }

    const response = pageResult.value;
    const html = await response.text();
    const htmlSizeKB = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
    const isHttps = targetUrl.startsWith('https://');

    // Response headers
    const contentEncoding = response.headers.get('content-encoding') || '';
    const hasCompression = /gzip|br|deflate/i.test(contentEncoding);

    const { urls: sitemapUrls, found: hasSitemap } =
      sitemapResult.status === 'fulfilled' ? sitemapResult.value : { urls: [], found: false };

    const robots = robotsResult.status === 'fulfilled'
      ? robotsResult.value
      : { found: false, content: '', blocksAll: false, blocksCrawlers: false };

    const realUrls  = sitemapUrls.filter(u => !u.startsWith('__est__'));
    const totalPages = sitemapUrls.length;
    const { servicePages, locationPages, blogPages } = categorizeUrls(realUrls, origin);

    // ── Parse HTML ─────────────────────────────────────────────────────────────
    const title    = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
    const metaDesc =
      extract(html, /<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']([^\"']{1,500})[\"']/i) ||
      extract(html, /<meta[^>]+content=[\"']([^\"']{1,500})[\"'][^>]+name=[\"']description[\"']/i);
    const canonical =
      extract(html, /<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']*)[\"']/i) ||
      extract(html, /<link[^>]+href=[\"']([^\"']*)[\"'][^>]+rel=[\"']canonical[\"']/i);
    const robotsMeta = extract(html, /<meta[^>]+name=[\"']robots[\"'][^>]+content=[\"']([^\"']*)[\"']/i);
    const viewport   = extract(html, /<meta[^>]+name=[\"']viewport[\"'][^>]+content=[\"']([^\"']*)[\"']/i);

    // Lang attribute
    const langAttr = extract(html, /<html[^>]+lang=[\"']([^\"']*)[\"']/i);

    // Favicon
    const hasFavicon =
      /<link[^>]+rel=[\"'](?:icon|shortcut icon|apple-touch-icon)[\"']/i.test(html) ||
      /<link[^>]+href=[^>]*favicon/i.test(html);

    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    const h1Count   = h1Matches.length;
    const h1Text    = h1Matches[0] ? h1Matches[0][1].replace(/<[^>]+>/g, '').trim() : '';
    const h2Count   = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count   = (html.match(/<h3[^>]*>/gi) || []).length;

    const imgTags    = html.match(/<img[^>]+>/gi) || [];
    const imgCount   = imgTags.length;
    const missingAlt = imgTags.filter(img => !img.match(/alt=[\"'][^\"'][^\"']*[\"']/i)).length;
    const lazyLoadedImgs = imgTags.filter(img => /loading=[\"']lazy[\"']/i.test(img)).length;
    const modernFormatImgs = imgTags.filter(img => /\.(webp|avif)/i.test(img)).length;

    const hasOgTitle = /<meta[^>]+property=[\"']og:title[\"']/i.test(html);
    const hasOgDesc  = /<meta[^>]+property=[\"']og:description[\"']/i.test(html);
    const hasOgImage = /<meta[^>]+property=[\"']og:image[\"']/i.test(html);
    const hasGTag    = /gtag\(|google-analytics\.com|googletagmanager\.com/i.test(html);

    // Twitter cards
    const hasTwitterCard = /<meta[^>]+name=[\"']twitter:card[\"']/i.test(html);
    const hasTwitterTitle = /<meta[^>]+name=[\"']twitter:title[\"']/i.test(html);

    // Schema — look for JSON-LD and specifically LocalBusiness subtype
    const schemaBlocks   = [...html.matchAll(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    const hasSchema      = schemaBlocks.length > 0;
    const hasLocalSchema = schemaBlocks.some(b =>
      /LocalBusiness|HomeAndConstructionBusiness|RoofingContractor|GeneralContractor|Plumber|Electrician|Painter|LandscapeService|Contractor/i.test(b)
    );

    // Schema detail validation — parse for specific fields
    let schemaHasHours = false, schemaHasRating = false, schemaHasGeo = false, schemaHasPriceRange = false, schemaHasServiceArea = false;
    for (const block of schemaBlocks) {
      try {
        const parsed = JSON.parse(block);
        const items = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
        for (const item of items) {
          if (item.openingHours || item.openingHoursSpecification) schemaHasHours = true;
          if (item.aggregateRating) schemaHasRating = true;
          if (item.geo || item.hasMap) schemaHasGeo = true;
          if (item.priceRange) schemaHasPriceRange = true;
          if (item.areaServed || item.serviceArea) schemaHasServiceArea = true;
        }
      } catch { /* invalid JSON-LD */ }
    }
    const schemaDetailScore = [schemaHasHours, schemaHasRating, schemaHasGeo, schemaHasPriceRange, schemaHasServiceArea].filter(Boolean).length;

    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 2).length;

    // Local signals
    const hasPhone = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(bodyText);
    const hasAddress =
      /\d{1,5}\s+[A-Za-z][\w\s]{2,40}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Place|Pl|Highway|Hwy)\b/i.test(bodyText) ||
      /\b[A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*,\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\s+\d{5}\b/i.test(bodyText);

    // Tap-to-call links
    const telLinks = (html.match(/href=[\"']tel:[^\"']+[\"']/gi) || []).length;

    // Internal links
    const allLinks = [...html.matchAll(/<a[^>]+href=[\"']([^\"'#][^\"']*)[\"']/gi)].map(m => m[1]);
    const internalLinks = allLinks.filter(l => l.startsWith('/') || l.includes(origin)).length;
    const externalLinks = allLinks.filter(l => /^https?:\/\//i.test(l) && !l.includes(origin)).length;

    const hasCTA =
      /<(?:a|button)[^>]*>[\s\S]{0,80}(?:call|get a quote|free quote|contact us|book|schedule|request|get started|free estimate|get estimate|claim|talk to|speak with|get in touch|reach out|hire us|work with us)/i.test(html) ||
      /<input[^>]+type=[\"']submit[\"']/i.test(html) ||
      (/<form[^>]*action/i.test(html) && /<input|<textarea/i.test(html));

    const titleLen   = title?.length || 0;
    const descLen    = metaDesc?.length || 0;
    const isNoindex  = robotsMeta ? /noindex/i.test(robotsMeta) : false;

    // ── Checks ─────────────────────────────────────────────────────────────────
    const checks: SEOCheck[] = [

      // ── TECHNICAL ──────────────────────────────────────────────────────────
      {
        id: 'ssl',
        category: 'technical',
        title: 'HTTPS / SSL Certificate',
        status: isHttps ? 'pass' : 'fail',
        current: isHttps ? 'Secure (HTTPS)' : 'Not secure, running on HTTP',
        recommendation: isHttps
          ? 'SSL is active. Keep it renewed annually.'
          : 'Install an SSL certificate immediately and set up 301 redirects from all HTTP to HTTPS.',
        impact: 'high',
        why: 'Google uses HTTPS as a confirmed ranking signal. Browsers flag HTTP sites as "Not Secure", killing visitor trust before they read a single word.',
      },
      {
        id: 'title',
        category: 'technical',
        title: 'Page Title Tag',
        status: !title ? 'fail' : titleLen < 40 || titleLen > 65 ? 'warning' : 'pass',
        current: title ? `"${title}" (${titleLen} chars)` : 'Missing, no title tag found',
        recommendation: !title
          ? 'Add a title tag immediately: [Primary Service] in [City] | [Company Name]'
          : titleLen < 40
          ? `Too short at ${titleLen} chars. Target 50-60 characters with your primary keyword + city.`
          : titleLen > 65
          ? `Too long at ${titleLen} chars, Google truncates at ~65. Trim to 55-60 characters.`
          : 'Title length is optimal. Ensure it contains your service keyword and city name.',
        impact: 'high',
        why: 'The title tag is the #1 on-page ranking factor. It tells Google what the page is about and is the first thing homeowners see in search results, it directly controls your click-through rate.',
      },
      {
        id: 'meta-desc',
        category: 'technical',
        title: 'Meta Description',
        status: !metaDesc ? 'fail' : descLen < 120 || descLen > 158 ? 'warning' : 'pass',
        current: metaDesc
          ? `"${metaDesc.substring(0, 100)}${metaDesc.length > 100 ? '...' : ''}" (${descLen} chars)`
          : 'Missing, no meta description found',
        recommendation: !metaDesc
          ? 'Write a 140-155 char meta description with your service, city, and a CTA: "Call today for a free estimate."'
          : descLen < 120
          ? `Only ${descLen} chars, expand to 140-155 characters with service, location, and reason to click.`
          : descLen > 158
          ? `${descLen} chars, will be cut off in search results. Trim to 150 characters.`
          : 'Description length is ideal.',
        impact: 'high',
        why: 'Your meta description is your ad copy in Google search results. A compelling, keyword-rich description increases click-through rate, which Google uses as a quality signal to improve your ranking.',
      },
      {
        id: 'robots',
        category: 'technical',
        title: 'Robots / Indexing Status',
        status: isNoindex ? 'fail' : 'pass',
        current: isNoindex
          ? `BLOCKED from indexing: "${robotsMeta}"`
          : robotsMeta ? `Indexable, robots: ${robotsMeta}` : 'Indexable (no restrictions found)',
        recommendation: isNoindex
          ? 'Remove "noindex" immediately. This tag hides the entire page from Google, often added during development and forgotten.'
          : 'Page is set to be indexed. Good.',
        impact: 'high',
        why: 'A noindex tag completely removes the page from Google, no impressions, no clicks, no leads. This is often invisible to the business owner and one of the most damaging technical mistakes a site can have.',
      },
      {
        id: 'robots-txt',
        category: 'technical',
        title: 'Robots.txt File',
        status: !robots.found ? 'warning' : robots.blocksAll ? 'fail' : 'pass',
        current: !robots.found
          ? 'No robots.txt found'
          : robots.blocksAll
          ? 'BLOCKING ALL CRAWLERS, Disallow: / detected'
          : `Robots.txt found${robots.blocksCrawlers ? ' with some disallow rules' : ', no critical blocks'}`,
        recommendation: !robots.found
          ? 'Create a robots.txt file with a Sitemap: directive pointing to your sitemap.xml. This helps Google discover and crawl your site efficiently.'
          : robots.blocksAll
          ? 'Your robots.txt is blocking ALL search engine crawlers from your entire site. Remove the "Disallow: /" rule immediately, this is preventing Google from indexing any page.'
          : 'Robots.txt is configured. Ensure it includes your sitemap URL and does not block important pages.',
        impact: 'high',
        why: 'Robots.txt controls which pages search engines can access. A misconfigured file can silently block your entire site from appearing in Google. Many developers accidentally leave blocking rules from staging environments.',
      },
      {
        id: 'viewport',
        category: 'technical',
        title: 'Mobile Viewport Tag',
        status: viewport ? 'pass' : 'fail',
        current: viewport ? `Configured: "${viewport}"` : 'Missing mobile viewport meta tag',
        recommendation: viewport
          ? 'Mobile viewport is configured correctly.'
          : 'Add: <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.',
        impact: 'high',
        why: 'Google uses mobile-first indexing, your mobile site is the primary version Google ranks. Without this tag, your site renders as a tiny desktop page on phones and fails Google\'s mobile usability test.',
      },
      {
        id: 'response-time',
        category: 'technical',
        title: 'Server Response Time (TTFB)',
        status: responseTimeMs > 3000 ? 'fail' : responseTimeMs > 1500 ? 'warning' : 'pass',
        current: `${(responseTimeMs / 1000).toFixed(1)}s server response time`,
        recommendation: responseTimeMs > 3000
          ? `Server took ${(responseTimeMs / 1000).toFixed(1)}s to respond, critically slow. Switch to a faster host, enable server-side caching, or use a CDN like Cloudflare. Google recommends under 200ms TTFB.`
          : responseTimeMs > 1500
          ? `${(responseTimeMs / 1000).toFixed(1)}s is slower than ideal. Enable caching and consider a CDN. Target under 1 second.`
          : 'Server response time is fast.',
        impact: 'high',
        why: 'Time To First Byte (TTFB) directly impacts Core Web Vitals and user experience. Slow servers cause visitors to leave before the page even starts rendering. Google measures this and uses it as a ranking signal.',
      },
      {
        id: 'page-speed',
        category: 'technical',
        title: 'Page Weight / Load Speed',
        status: htmlSizeKB > 400 ? 'fail' : htmlSizeKB > 180 ? 'warning' : 'pass',
        current: `HTML document is ${htmlSizeKB}KB`,
        recommendation: htmlSizeKB > 400
          ? `At ${htmlSizeKB}KB, the HTML alone is critically heavy. Minify HTML, remove inline scripts/styles, lazy-load images. Target under 100KB.`
          : htmlSizeKB > 180
          ? `${htmlSizeKB}KB is above the recommended threshold. Minify HTML and defer non-critical scripts.`
          : 'Page weight is within acceptable range.',
        impact: 'medium',
        why: 'Google\'s Core Web Vitals are a direct ranking factor. Heavy pages load slowly on mobile, causing visitors to leave before the page finishes. High bounce rate signals poor quality and tanks your rankings.',
      },
      {
        id: 'compression',
        category: 'technical',
        title: 'Response Compression (Gzip/Brotli)',
        status: hasCompression ? 'pass' : 'warning',
        current: hasCompression ? `Compression active: ${contentEncoding}` : 'No compression detected on response',
        recommendation: hasCompression
          ? 'Compression is enabled. This reduces transfer sizes by 60-80%.'
          : 'Enable gzip or Brotli compression on your server. This can reduce page transfer size by 60-80%, significantly improving load times for mobile visitors.',
        impact: 'medium',
        why: 'Without compression, your server sends full-size HTML, CSS, and JavaScript files. This wastes bandwidth and slows load times, especially on mobile connections where most homeowners browse.',
      },
      {
        id: 'canonical',
        category: 'technical',
        title: 'Canonical URL Tag',
        status: canonical ? 'pass' : 'warning',
        current: canonical ? `Set to: ${canonical}` : 'No canonical tag found',
        recommendation: canonical
          ? 'Canonical is set, duplicate content is handled.'
          : 'Add <link rel="canonical" href="[full URL]"> to prevent Google splitting your ranking power across duplicate URL versions.',
        impact: 'medium',
        why: 'Without a canonical tag, Google may index multiple versions of your page (www vs non-www, trailing slash variants), diluting your SEO authority across duplicates instead of concentrating it on one URL.',
      },
      {
        id: 'analytics',
        category: 'technical',
        title: 'Analytics / Conversion Tracking',
        status: hasGTag ? 'pass' : 'warning',
        current: hasGTag ? 'Google Analytics / GTM detected' : 'No Google Analytics or GTM detected',
        recommendation: hasGTag
          ? 'Analytics active. Ensure conversion goals are set up for form submissions and phone calls.'
          : 'Install Google Analytics 4 and configure conversion events for lead forms and calls. Without this, you have zero data on what is working.',
        impact: 'medium',
        why: 'Without analytics you have no data on which keywords drive leads, which pages lose visitors, or your cost-per-lead. You cannot improve, or intelligently scale, what you cannot measure.',
      },
      {
        id: 'favicon',
        category: 'technical',
        title: 'Favicon',
        status: hasFavicon ? 'pass' : 'warning',
        current: hasFavicon ? 'Favicon detected' : 'No favicon link tag found',
        recommendation: hasFavicon
          ? 'Favicon is set. Ensure it displays correctly in browser tabs and Google search results.'
          : 'Add a favicon (32x32 PNG and apple-touch-icon). It appears in browser tabs, bookmarks, and Google search results next to your site name. Missing favicons look unprofessional.',
        impact: 'low',
        why: 'Google now shows favicons next to search results. A missing or broken favicon makes your listing look less professional than competitors who have one, subtly reducing click-through rate.',
      },
      {
        id: 'lang',
        category: 'technical',
        title: 'Language Tag',
        status: langAttr ? 'pass' : 'warning',
        current: langAttr ? `Language set to: "${langAttr}"` : 'No lang attribute on <html> tag',
        recommendation: langAttr
          ? 'Language tag is set correctly.'
          : 'Add lang="en" to your <html> tag. This helps search engines understand your content language and improves accessibility for screen readers.',
        impact: 'low',
        why: 'The lang attribute helps Google serve your pages to the right audience and is a basic accessibility requirement. Missing it signals a site built without attention to fundamentals.',
      },

      // ── CONTENT ────────────────────────────────────────────────────────────
      {
        id: 'h1',
        category: 'content',
        title: 'H1 Heading Tag',
        status: h1Count === 0 ? 'fail' : h1Count > 1 ? 'warning' : 'pass',
        current: h1Count === 0
          ? 'No H1 tag found'
          : h1Count > 1
          ? `${h1Count} H1 tags found, must be exactly 1`
          : `"${h1Text.substring(0, 70)}${h1Text.length > 70 ? '...' : ''}"`,
        recommendation: h1Count === 0
          ? 'Add a single H1 with your primary keyword: "Roofing Contractor in Miami, FL, Free Estimates"'
          : h1Count > 1
          ? `Reduce to one H1. Multiple H1s split the ranking signal. Currently ${h1Count} found.`
          : 'H1 is present. Ensure it contains your primary service keyword and city name.',
        impact: 'high',
        why: 'The H1 is the most important on-page content signal. It tells Google exactly what the page is about. Missing or multiple H1s send a confused signal and hurt topical relevance, directly impacting where you rank.',
      },
      {
        id: 'headings',
        category: 'content',
        title: 'Heading Structure (H2/H3)',
        status: h2Count >= 4 ? 'pass' : h2Count >= 2 ? 'warning' : 'fail',
        current: h2Count === 0
          ? 'No H2 headings found'
          : `${h2Count} H2${h2Count !== 1 ? 's' : ''} + ${h3Count} H3${h3Count !== 1 ? 's' : ''} found`,
        recommendation: h2Count < 4
          ? `Only ${h2Count} H2${h2Count !== 1 ? 's' : ''} found. Aim for 5-8 H2s covering: Our Services, Our Process, Areas We Serve, Why Choose Us, FAQs, Reviews, and Contact. Each H2 is an additional ranking opportunity.`
          : 'Good structure. Ensure each H2 targets a keyword variation like "Emergency Roof Repair Miami" or "What to Expect During a Roof Replacement."',
        impact: 'medium',
        why: 'Rich heading hierarchies signal content depth to Google. Pages with thin heading structure consistently lose to competitors who have 6+ H2s covering FAQs and services, Google rewards comprehensive, well-organised content.',
      },
      {
        id: 'word-count',
        category: 'content',
        title: 'Content Depth / Word Count',
        status: wordCount >= 900 ? 'pass' : wordCount >= 500 ? 'warning' : 'fail',
        current: `~${wordCount.toLocaleString()} words of visible body content`,
        recommendation: wordCount < 500
          ? `Critically thin at ${wordCount} words. Competitive service pages need 1,000-1,500 words. Add service descriptions, your process, service areas, FAQ, and trust signals.`
          : wordCount < 900
          ? `${wordCount} words is below the competitive standard of 1,000-1,500 words. Add a detailed FAQ section and city-specific content sections.`
          : 'Content length is solid. A 10-question FAQ and city-level content can push rankings higher.',
        impact: 'high',
        why: 'Thin pages consistently lose to competitors who answer homeowner questions comprehensively. Google rewards depth, it signals genuine expertise and reduces bounce rate. Short pages look like placeholder sites to the algorithm.',
      },
      {
        id: 'cta',
        category: 'content',
        title: 'Call-to-Action (CTA) Presence',
        status: hasCTA ? 'pass' : 'fail',
        current: hasCTA ? 'CTA detected (form, button, or contact link found)' : 'No clear call-to-action detected on this page',
        recommendation: hasCTA
          ? 'CTA present. Ensure it appears above the fold, mid-page, and at the bottom with urgent action language: "Get Your Free Estimate Today."'
          : 'Add a prominent CTA: a contact form, "Call Now" button, or "Get a Free Quote" link. Place it above the fold and repeat it throughout the page.',
        impact: 'high',
        why: 'Without a clear CTA, visitors who are ready to hire someone have no obvious next step and leave. Every visitor who leaves without contacting you is a lost lead, converting existing traffic is the cheapest way to get more jobs.',
      },
      {
        id: 'internal-links',
        category: 'content',
        title: 'Internal Link Structure',
        status: internalLinks >= 15 ? 'pass' : internalLinks >= 5 ? 'warning' : 'fail',
        current: `${internalLinks} internal links, ${externalLinks} external links found`,
        recommendation: internalLinks < 5
          ? `Only ${internalLinks} internal links. Add navigation links to service pages, location pages, about, contact, and key content pages. Internal linking distributes ranking authority across your site.`
          : internalLinks < 15
          ? `${internalLinks} internal links is below average. A well-linked homepage should have 20-30+ internal links covering services, locations, and content pages.`
          : 'Good internal link structure. Ensure service and location pages cross-link to each other.',
        impact: 'medium',
        why: 'Internal links distribute PageRank (Google\'s authority score) across your site. Pages with no internal links are orphaned and may never get indexed. A strong internal linking structure helps Google discover all your content and understand which pages are most important.',
      },
      {
        id: 'blog-content',
        category: 'content',
        title: 'Blog / Content Marketing',
        status: !hasSitemap ? 'fail' : blogPages >= 5 ? 'pass' : blogPages >= 1 ? 'warning' : 'fail',
        current: !hasSitemap
          ? 'Cannot determine, no sitemap found'
          : blogPages === 0
          ? 'No blog or content pages detected'
          : `~${blogPages} blog/content pages found`,
        recommendation: !hasSitemap || blogPages === 0
          ? 'No blog content found. Start with 5-10 articles answering common homeowner questions: "How much does a roof replacement cost?", "Signs you need a new roof", etc. These pages capture top-of-funnel searches your service pages cannot.'
          : blogPages < 5
          ? `Only ${blogPages} content pages. Aim for 10-20+ articles targeting informational searches. Each article is another entry point to your site from Google.`
          : 'Good content presence. Keep publishing regularly, ideally 2-4 articles per month to maintain freshness signals.',
        impact: 'medium',
        why: 'Blog content captures informational searches ("how much does X cost?") that service pages cannot rank for. These visitors may not convert immediately but build brand awareness and generate backlinks naturally, boosting your entire site\'s authority.',
      },

      // ── IMAGES ─────────────────────────────────────────────────────────────
      {
        id: 'img-alt',
        category: 'images',
        title: 'Image Alt Text',
        status: imgCount === 0
          ? 'fail'
          : missingAlt === 0
          ? 'pass'
          : missingAlt > imgCount / 2
          ? 'fail'
          : 'warning',
        current: imgCount === 0
          ? 'No images detected, needs project photos for trust and Google Images rankings'
          : missingAlt === 0
          ? `All ${imgCount} images have alt text`
          : `${missingAlt} of ${imgCount} images are missing alt text`,
        recommendation: imgCount === 0
          ? 'Add 8-12 photos of completed projects with keyword-rich alt text. Photos of real work build trust and rank in Google Images, a free additional traffic source.'
          : missingAlt > 0
          ? `Fix all ${missingAlt} missing alt attributes. Example: alt="metal roof installation in Fort Lauderdale FL"`
          : 'All images have alt text. Audit that each description uses a service keyword and location naturally.',
        impact: 'medium',
        why: 'Alt text tells Google what images depict, contributing to image search rankings and reinforcing the page topic. Project photos with proper alt text also build homeowner trust, a critical factor in converting visits to leads.',
      },
      {
        id: 'img-lazy',
        category: 'images',
        title: 'Image Lazy Loading',
        status: imgCount === 0
          ? 'warning'
          : imgCount <= 3
          ? 'pass'
          : lazyLoadedImgs >= imgCount * 0.5
          ? 'pass'
          : lazyLoadedImgs > 0
          ? 'warning'
          : 'fail',
        current: imgCount === 0
          ? 'No images on page'
          : `${lazyLoadedImgs} of ${imgCount} images use lazy loading`,
        recommendation: imgCount > 3 && lazyLoadedImgs < imgCount * 0.5
          ? `Only ${lazyLoadedImgs} of ${imgCount} images are lazy loaded. Add loading="lazy" to all below-the-fold images. This prevents the browser from downloading images the visitor hasn't scrolled to yet, dramatically improving initial load time.`
          : 'Image lazy loading is configured properly.',
        impact: 'medium',
        why: 'Without lazy loading, the browser downloads ALL images on page load, even those far below the fold. On a contractor site with 15+ project photos, this can add 5-10MB of unnecessary initial load, destroying mobile performance and Core Web Vitals scores.',
      },
      {
        id: 'img-format',
        category: 'images',
        title: 'Modern Image Formats (WebP/AVIF)',
        status: imgCount === 0
          ? 'warning'
          : modernFormatImgs >= imgCount * 0.5
          ? 'pass'
          : modernFormatImgs > 0
          ? 'warning'
          : 'fail',
        current: imgCount === 0
          ? 'No images on page'
          : modernFormatImgs === 0
          ? `All ${imgCount} images use legacy formats (JPEG/PNG)`
          : `${modernFormatImgs} of ${imgCount} images use modern formats`,
        recommendation: modernFormatImgs < imgCount * 0.5
          ? 'Convert images to WebP or AVIF format. These are 25-50% smaller than JPEG/PNG with equal quality. Most modern browsers support them, and they significantly reduce page weight.'
          : 'Good use of modern image formats.',
        impact: 'medium',
        why: 'JPEG and PNG are outdated formats. WebP and AVIF deliver the same visual quality at half the file size. Google\'s own PageSpeed Insights recommends modern formats, and using them directly improves Core Web Vitals scores.',
      },

      // ── LOCAL SEO ──────────────────────────────────────────────────────────
      {
        id: 'phone',
        category: 'local',
        title: 'Phone Number on Page',
        status: hasPhone ? 'pass' : 'fail',
        current: hasPhone ? 'Phone number detected in page content' : 'No phone number found on this page',
        recommendation: hasPhone
          ? 'Phone number present. Ensure it is in the header, hero, and footer, linked as a tel: href for mobile tap-to-call.'
          : 'Add your phone number prominently to the header and hero. Link it as <a href="tel:+1XXXXXXXXXX">. Critical for mobile visitors who want to call immediately.',
        impact: 'high',
        why: 'Phone calls are typically the highest-value lead type for local service businesses. Without a visible phone number, motivated buyers look elsewhere, and often call a competitor whose number is easier to find.',
      },
      {
        id: 'tap-to-call',
        category: 'local',
        title: 'Tap-to-Call Links (tel:)',
        status: telLinks >= 2 ? 'pass' : telLinks === 1 ? 'warning' : 'fail',
        current: telLinks === 0
          ? 'No clickable tel: links found'
          : `${telLinks} tap-to-call link${telLinks > 1 ? 's' : ''} found`,
        recommendation: telLinks === 0
          ? 'Your phone number exists as plain text but is NOT clickable on mobile. Wrap it in <a href="tel:+1XXXXXXXXXX">. Over 60% of contractor site visitors are on mobile, they need to tap to call instantly.'
          : telLinks === 1
          ? 'Only 1 tap-to-call link. Add tel: links in the header, hero section, and footer so visitors can call from anywhere on the page.'
          : 'Multiple tap-to-call links found. Good mobile UX.',
        impact: 'high',
        why: 'A phone number that isn\'t clickable on mobile is almost useless. Mobile visitors won\'t manually copy-paste a number. Every tap-to-call link you add removes friction between a motivated homeowner and your sales team.',
      },
      {
        id: 'address',
        category: 'local',
        title: 'Business Address / NAP',
        status: hasAddress ? 'pass' : 'warning',
        current: hasAddress ? 'Physical address detected in page content' : 'No physical address found in page content',
        recommendation: hasAddress
          ? 'Address present. Ensure your Name, Address, and Phone (NAP) exactly matches your Google Business Profile and all online directories.'
          : 'Add your full business address to the footer and contact page. NAP consistency across your site, Google Business Profile, and directories is a core local ranking factor.',
        impact: 'medium',
        why: 'Google cross-references your site address against business directories and your Google Business Profile. NAP inconsistency is a common reason local businesses don\'t appear in the Google Maps 3-pack, the most valuable local search placement.',
      },
      {
        id: 'sitemap',
        category: 'local',
        title: 'XML Sitemap',
        status: hasSitemap ? 'pass' : 'fail',
        current: hasSitemap
          ? `Sitemap found, ${totalPages > 0 ? `~${totalPages} pages` : 'URL count could not be determined'}`
          : 'No sitemap found at /sitemap.xml or /sitemap_index.xml',
        recommendation: hasSitemap
          ? 'Sitemap present. Submit it in Google Search Console and keep it auto-updated as you add pages.'
          : 'Create and submit a sitemap.xml immediately. Without it, new pages may take months to get indexed, or never get found by Google.',
        impact: 'high',
        why: 'A sitemap tells Google exactly which pages exist and when they were updated. Without one, new service and location pages you add may never get indexed, meaning zero organic rankings from those pages.',
      },
      {
        id: 'page-count',
        category: 'local',
        title: 'Total Indexed Pages',
        status: !hasSitemap ? 'fail' : totalPages >= 25 ? 'pass' : totalPages >= 10 ? 'warning' : 'fail',
        current: !hasSitemap
          ? 'Cannot determine, no sitemap found'
          : totalPages === 0
          ? 'Sitemap found but page count could not be determined'
          : `~${totalPages} pages in sitemap`,
        recommendation: !hasSitemap || totalPages < 10
          ? 'Severely under-paged. A competitive local service website needs 20-40+ pages: Home, About, one page per service, one page per city/suburb served, FAQ, and Blog content.'
          : totalPages < 25
          ? `${totalPages} pages is below competitive standard. Top-ranking local service sites have 25-60+ pages. Add dedicated service and location pages to capture more search queries.`
          : 'Good page count. Continue adding location and service pages to expand your organic search footprint.',
        impact: 'high',
        why: 'Every page is a ranking opportunity. A 5-page site can rank for 5 queries. A 40-page site can rank for 40+. More targeted pages = more organic traffic = more leads, without increasing ad spend. Your competitors with more pages win by default.',
      },
      {
        id: 'service-pages',
        category: 'local',
        title: 'Dedicated Service Pages',
        status: !hasSitemap ? 'fail' : servicePages >= 6 ? 'pass' : servicePages >= 3 ? 'warning' : 'fail',
        current: !hasSitemap
          ? 'Cannot determine, no sitemap found'
          : `~${servicePages} service-specific pages detected`,
        recommendation: !hasSitemap || servicePages < 3
          ? 'No or very few dedicated service pages found. Create a separate page for EACH service: Roof Repair, Roof Replacement, Metal Roofing, Gutter Installation, etc. One service = one page = one keyword cluster to rank for.'
          : servicePages < 6
          ? `Only ${servicePages} service pages detected. Aim for at least one page per service variant. A single "Services" overview page cannot rank for individual service searches.`
          : 'Good service page coverage. Each page should target a specific keyword with 600-1,000 words of unique content.',
        impact: 'high',
        why: 'Google ranks individual pages for individual queries. A single "Services" page cannot rank for both "metal roofing" and "roof repair" simultaneously. Without a dedicated page for each service, you are invisible for those specific searches, your competitor with dedicated pages wins every time.',
      },
      {
        id: 'location-pages',
        category: 'local',
        title: 'Location / Service Area Pages',
        status: !hasSitemap ? 'fail' : locationPages >= 5 ? 'pass' : locationPages >= 2 ? 'warning' : 'fail',
        current: !hasSitemap
          ? 'Cannot determine, no sitemap found'
          : `~${locationPages} location/area pages detected`,
        recommendation: !hasSitemap || locationPages < 2
          ? 'No location-specific pages found. You need a dedicated page for every city and suburb you serve: "Roofing in Coral Gables", "Roof Repair Brickell", etc. These are the fastest pages to rank and directly target motivated buyers in each area.'
          : locationPages < 5
          ? `Only ${locationPages} location pages. Most competitive markets require 8-20+ location pages, one for each city and suburb in your service area.`
          : 'Good location page coverage. Each page must have unique local content, the city name in the H1 and title, and a local phone number or address.',
        impact: 'high',
        why: 'Homeowners search "[service] in [their city]", not just "[service]". Without a page for their specific suburb, you are completely invisible for that search. Location pages are the #1 way local contractors expand organic reach without increasing ad spend.',
      },

      // ── SOCIAL / SCHEMA ────────────────────────────────────────────────────
      {
        id: 'og-tags',
        category: 'social',
        title: 'Open Graph Tags (Social Sharing)',
        status: hasOgTitle && hasOgDesc && hasOgImage ? 'pass' : hasOgTitle || hasOgDesc ? 'warning' : 'fail',
        current: !hasOgTitle
          ? 'No Open Graph tags found'
          : `Title: ${hasOgTitle ? '✓' : '✗'}  Description: ${hasOgDesc ? '✓' : '✗'}  Image: ${hasOgImage ? '✓' : '✗'}`,
        recommendation: !hasOgTitle
          ? 'Add og:title, og:description, and og:image. Without these, shared links appear as blank or ugly auto-generated previews on Facebook, Instagram, and LinkedIn.'
          : 'Add the missing OG tags. All three (title, description, image) are required for a professional share preview.',
        impact: 'medium',
        why: 'When past customers or referral partners share your site on social media, OG tags control the preview. Without them the link looks unprofessional, reducing referral traffic and damaging brand perception with every share.',
      },
      {
        id: 'twitter-cards',
        category: 'social',
        title: 'Twitter / X Card Tags',
        status: hasTwitterCard && hasTwitterTitle ? 'pass' : hasTwitterCard || hasTwitterTitle ? 'warning' : 'fail',
        current: !hasTwitterCard
          ? 'No Twitter card meta tags found'
          : `Card: ${hasTwitterCard ? '✓' : '✗'}  Title: ${hasTwitterTitle ? '✓' : '✗'}`,
        recommendation: !hasTwitterCard
          ? 'Add twitter:card, twitter:title, and twitter:description meta tags. Controls how your site preview appears when shared on X/Twitter.'
          : 'Add the missing Twitter card tags for a complete social preview.',
        impact: 'low',
        why: 'Twitter cards control link previews on X. While less critical than Open Graph, complete social meta tags signal a professionally built site and ensure your brand looks polished everywhere it appears online.',
      },
      {
        id: 'schema',
        category: 'social',
        title: 'LocalBusiness Schema Markup',
        status: hasLocalSchema ? 'pass' : hasSchema ? 'warning' : 'fail',
        current: hasLocalSchema
          ? 'LocalBusiness JSON-LD schema detected'
          : hasSchema
          ? 'JSON-LD schema found but no LocalBusiness type'
          : 'No schema markup found on this page',
        recommendation: hasLocalSchema
          ? 'LocalBusiness schema found. Verify it includes NAP, service areas, opening hours, and aggregate star rating.'
          : hasSchema
          ? 'Schema exists but lacks LocalBusiness type. Update to include LocalBusiness (or trade-specific: RoofingContractor, Plumber, etc.) with NAP, geo coordinates, service areas, and aggregate rating.'
          : 'Add LocalBusiness JSON-LD schema immediately. This is one of the highest-impact local SEO improvements available, and most competitors still skip it.',
        impact: 'high',
        why: 'LocalBusiness schema enables rich results, showing your star rating, phone number, and address directly in search results before anyone clicks. This dramatically increases click-through rate for local searches and signals to Google that your business information is verified and trustworthy.',
      },
      {
        id: 'schema-detail',
        category: 'social',
        title: 'Schema Completeness',
        status: !hasLocalSchema ? 'fail' : schemaDetailScore >= 4 ? 'pass' : schemaDetailScore >= 2 ? 'warning' : 'fail',
        current: !hasLocalSchema
          ? 'No LocalBusiness schema to validate'
          : `${schemaDetailScore}/5 schema fields present: ${[
              schemaHasHours ? 'Hours ✓' : 'Hours ✗',
              schemaHasRating ? 'Rating ✓' : 'Rating ✗',
              schemaHasGeo ? 'Geo ✓' : 'Geo ✗',
              schemaHasPriceRange ? 'Price ✓' : 'Price ✗',
              schemaHasServiceArea ? 'Area ✓' : 'Area ✗',
            ].join(', ')}`,
        recommendation: !hasLocalSchema
          ? 'Add LocalBusiness schema first, then enrich it with all 5 key fields.'
          : schemaDetailScore < 4
          ? `Your schema is missing ${5 - schemaDetailScore} key fields. Add: ${[
              !schemaHasHours && 'openingHoursSpecification (business hours)',
              !schemaHasRating && 'aggregateRating (star rating + review count)',
              !schemaHasGeo && 'geo (latitude/longitude coordinates)',
              !schemaHasPriceRange && 'priceRange (e.g. "$$")',
              !schemaHasServiceArea && 'areaServed (cities/regions you serve)',
            ].filter(Boolean).join(', ')}. Complete schemas get richer search results.`
          : 'Schema is comprehensive with all key fields.',
        impact: 'high',
        why: 'A bare-bones LocalBusiness schema with just a name and address is wasted potential. Google uses opening hours for "open now" filters, aggregateRating for star snippets, and geo coordinates for Maps results. Each missing field is a missed opportunity for a richer, more clickable search result.',
      },
    ];

    // ── Score (weighted by impact) ─────────────────────────────────────────────
    const weights: Record<Impact, number> = { high: 3, medium: 2, low: 1 };
    const pts: Record<Status, number>     = { pass: 1, warning: 0.5, fail: 0 };
    let total = 0, earned = 0;
    for (const c of checks) {
      const w = weights[c.impact];
      total  += w;
      earned += w * pts[c.status];
    }
    const score = Math.round((earned / total) * 100);

    return NextResponse.json({
      url: targetUrl,
      score,
      wordCount,
      totalPages,
      servicePages,
      locationPages,
      blogPages,
      responseTimeMs,
      hasSitemap,
      checks,
      summary: {
        pass:    checks.filter(c => c.status === 'pass').length,
        warning: checks.filter(c => c.status === 'warning').length,
        fail:    checks.filter(c => c.status === 'fail').length,
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
