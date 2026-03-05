'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  color: string;
  excerpt: string;
};

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
      <article
        style={{
          borderRadius: '24px', overflow: 'hidden',
          background: post.color, display: 'grid',
          gridTemplateColumns: '1fr 1fr', minHeight: '400px',
          cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '4px 12px', borderRadius: '100px',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {post.category}
            </span>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em',
              marginTop: '1.25rem', color: 'white',
            }}>
              {post.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '1rem', lineHeight: '1.75', fontSize: '0.9375rem' }}>
              {post.excerpt}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{post.date} · {post.readTime}</span>
            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#0A0A0A', padding: '8px 18px', borderRadius: '100px', fontWeight: 700, fontSize: '0.8rem' }}>
              Read article <ArrowRight size={13} />
            </div>
          </div>
        </div>
        {/* Right panel — decorative */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: 1,
              color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.04em',
              userSelect: 'none',
            }}>
              {post.date.split(' ')[1]}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              {[post.readTime, 'In-depth guide', 'Free to read'].map((tag) => (
                <span key={tag} style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          borderRadius: '20px', overflow: 'hidden',
          background: post.color, cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          minHeight: '320px', display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '3px 10px', borderRadius: '100px',
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              {post.category}
            </span>
            <h3 style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '1.125rem',
              fontWeight: 800, lineHeight: 1.3, color: 'white', marginBottom: '0.875rem',
            }}>
              {post.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: '1.65' }}>
              {post.excerpt}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{post.date} · {post.readTime}</span>
            <ArrowRight size={16} color="rgba(255,255,255,0.4)" />
          </div>
        </div>
      </article>
    </Link>
  );
}
