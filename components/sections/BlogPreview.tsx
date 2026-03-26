'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal, fadeUp, scaleUp } from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';

const posts = [
  {
    slug: 'close-28k-average-ticket',
    title: 'How contractors are closing $28K average tickets with in-home sales training',
    category: 'Sales Training',
    date: 'Feb 18, 2026',
    readTime: '6 min read',
    accent: '#FE6462',
    bg: '#130c0c',
  },
  {
    slug: 'ai-callback-60-seconds',
    title: 'The 60-second AI callback: why speed-to-lead changes everything for contractors',
    category: 'AI Automation',
    date: 'Jan 29, 2026',
    readTime: '5 min read',
    accent: '#4FC3F7',
    bg: '#0c1219',
  },
  {
    slug: 'seo-aeo-organic-growth',
    title: 'SEO + AEO: the organic growth stack dominating contractor markets in 2026',
    category: 'Organic Growth',
    date: 'Jan 10, 2026',
    readTime: '7 min read',
    accent: '#94D96B',
    bg: '#0c130c',
  },
];

function BlogCard({ post, i, inView }: { post: (typeof posts)[0]; i: number; inView: boolean }) {
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ ...scaleUp(inView, i * 120) }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setMx(e.clientX - r.left);
            setMy(e.clientY - r.top);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: `radial-gradient(360px at ${mx}px ${my}px, ${post.accent}${hovered ? '14' : '00'} 0%, transparent 65%), ${post.bg}`,
            border: `1px solid ${hovered ? post.accent + '40' : 'rgba(255,255,255,0.07)'}`,
            cursor: 'pointer',
            transition: 'border-color 0.25s ease, box-shadow 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            boxShadow: hovered
              ? `0 0 0 1px ${post.accent}25, 0 24px 60px rgba(0,0,0,0.5), 0 8px 20px ${post.accent}14`
              : '0 2px 16px rgba(0,0,0,0.25)',
          }}
        >
          {/* Abstract header */}
          <div style={{
            height: '180px',
            background: post.bg,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Accent glow blob */}
            <div style={{
              position: 'absolute',
              width: '240px', height: '240px',
              borderRadius: '50%',
              background: post.accent,
              filter: 'blur(90px)',
              opacity: hovered ? 0.2 : 0.1,
              top: '-80px', left: '-60px',
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              width: '120px', height: '120px',
              borderRadius: '50%',
              background: post.accent,
              filter: 'blur(50px)',
              opacity: hovered ? 0.15 : 0.07,
              bottom: '-20px', right: '10%',
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }} />

            {/* Geometric SVG grid + circles */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((j) => (
                <line key={`v${j}`} x1={j * 70 - 10} y1="0" x2={j * 70 - 10} y2="200" stroke={`${post.accent}12`} strokeWidth="1" />
              ))}
              {[0, 1, 2, 3].map((j) => (
                <line key={`h${j}`} x1="0" y1={j * 60} x2="100%" y2={j * 60} stroke={`${post.accent}10`} strokeWidth="1" />
              ))}
              {/* Concentric circles */}
              <circle cx="78%" cy="45%" r="70" stroke={`${post.accent}18`} strokeWidth="1" fill="none" />
              <circle cx="78%" cy="45%" r="42" stroke={`${post.accent}22`} strokeWidth="1" fill="none" />
              <circle cx="78%" cy="45%" r="18" stroke={`${post.accent}30`} strokeWidth="1" fill="none" />
              <circle cx="78%" cy="45%" r="5" fill={`${post.accent}50`} />
              {/* Corner dots */}
              <circle cx="8%" cy="18%" r="2" fill={`${post.accent}35`} />
              <circle cx="14%" cy="18%" r="1.2" fill={`${post.accent}25`} />
              <circle cx="20%" cy="18%" r="1.5" fill={`${post.accent}20`} />
            </svg>

            {/* Top accent shimmer */}
            <div style={{
              position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${post.accent}60, transparent)`,
              opacity: hovered ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
            }} />

            {/* Category badge */}
            <div style={{ position: 'absolute', bottom: '1.1rem', left: '1.25rem' }}>
              <span style={{
                background: `${post.accent}18`, color: post.accent,
                padding: '4px 12px', borderRadius: '100px',
                fontSize: '0.68rem', fontWeight: 700,
                border: `1px solid ${post.accent}35`,
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {post.category}
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '0.975rem', fontWeight: 700,
              lineHeight: '1.5', marginBottom: '1.25rem',
              color: hovered ? 'white' : 'rgba(255,255,255,0.82)',
              transition: 'color 0.2s ease',
            }}>
              {post.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <div style={{
                color: post.accent,
                opacity: hovered ? 1 : 0.4,
                transition: 'opacity 0.2s ease, transform 0.25s ease',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default function BlogPreview() {
  const { ref: headerRef, inView: headerIn } = useScrollReveal();
  const { ref: cardsRef, inView: cardsIn } = useScrollReveal({ threshold: 0.05 });

  return (
    <section style={{ padding: 'clamp(48px, 8vw, 120px) 0', background: '#070b0f' }}>
      <div className="container">
        <div
          ref={headerRef as React.Ref<HTMLDivElement>}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-tag" style={{ ...fadeUp(headerIn, 0) }}>Insights</div>
            <AnimatedText
              as="h2"
              inView={headerIn}
              delay={120}
              stagger={90}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              From the RevCore playbook
            </AnimatedText>
          </div>
          <div style={{ ...fadeUp(headerIn, 150) }}>
            <Link href="/blog" className="btn-outline">
              All articles <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div
          ref={cardsRef as React.Ref<HTMLDivElement>}
          className="blog-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}
        >
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} i={i} inView={cardsIn} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
