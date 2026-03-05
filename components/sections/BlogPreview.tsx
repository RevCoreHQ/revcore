import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    slug: 'close-28k-average-ticket',
    title: 'How contractors are closing $28K average tickets with in-home sales training',
    category: 'Sales Training',
    date: 'Feb 18, 2026',
    readTime: '6 min read',
    color: '#0f1923',
    accent: '#FE6462',
  },
  {
    slug: 'ai-callback-60-seconds',
    title: 'The 60-second AI callback: why speed-to-lead changes everything for contractors',
    category: 'AI Automation',
    date: 'Jan 29, 2026',
    readTime: '5 min read',
    color: '#0f1a1a',
    accent: '#4FC3F7',
  },
  {
    slug: 'seo-aeo-organic-growth',
    title: 'SEO + AEO: the organic growth stack dominating contractor markets in 2026',
    category: 'Organic Growth',
    date: 'Jan 10, 2026',
    readTime: '7 min read',
    color: '#1a1a0f',
    accent: '#94D96B',
  },
];

export default function BlogPreview() {
  return (
    <section style={{ padding: '120px 0', background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-tag">Insights</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              From the RevCore playbook
            </h2>
          </div>
          <Link href="/blog" className="btn-outline">
            All articles <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="card-hover-up" style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}>
                <div style={{
                  height: '160px',
                  background: post.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                    fontSize: '5rem', color: `${post.accent}22`,
                    position: 'absolute', right: '1rem', bottom: '-0.5rem',
                    lineHeight: 1,
                  }}>
                    RC
                  </div>
                  <span style={{
                    background: `${post.accent}22`, color: post.accent,
                    padding: '4px 12px', borderRadius: '100px',
                    fontSize: '0.72rem', fontWeight: 700,
                    border: `1px solid ${post.accent}44`,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    {post.category}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.975rem', fontWeight: 700,
                    lineHeight: '1.45', marginBottom: '1rem', color: 'var(--color-primary)',
                  }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--color-gray)', fontSize: '0.75rem' }}>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <ArrowRight size={15} color="var(--color-gray)" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
