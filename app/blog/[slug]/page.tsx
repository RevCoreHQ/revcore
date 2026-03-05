import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/lib/data';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return { title: post ? `${post.title} — RevCore` : 'Article — RevCore' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--color-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Back to blog
          </Link>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ background: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>{post.category}</span>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>{post.date} · {post.readTime}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>{post.title}</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-gray)', lineHeight: '1.7' }}>{post.excerpt}</p>
        </div>
      </section>

      {/* Cover */}
      <div style={{
        background: post.color, padding: '72px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '520px', padding: '0 2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>
            {post.category}
          </div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: 'white',
            lineHeight: 1.15, letterSpacing: '-0.02em', opacity: 0.9,
          }}>
            {post.title}
          </div>
          <div style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
            {post.date} · {post.readTime}
          </div>
        </div>
      </div>

      {/* Body */}
      <section style={{ padding: '80px 0', background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          {paragraphs.map((para, i) => {
            // Standalone heading: entire paragraph is **text**
            if (/^\*\*[^*]+\*\*$/.test(para.trim())) {
              return <h2 key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.375rem', fontWeight: 700, margin: '2.75rem 0 0.875rem', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>{para.replace(/\*\*/g, '')}</h2>;
            }
            // Numbered list
            if (para.match(/^\d\./)) {
              return (
                <ul key={i} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                  {para.split('\n').map((line, j) => (
                    <li key={j} style={{ marginBottom: '0.5rem', color: 'var(--color-gray)', lineHeight: '1.8', fontSize: '1.0625rem' }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} style={{ color: 'var(--color-gray)', lineHeight: '1.9', fontSize: '1.0625rem', marginBottom: '1.625rem' }}
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-primary);font-weight:700">$1</strong>') }}
              />
            );
          })}

          {/* CTA at end of article */}
          <div style={{
            marginTop: '4rem', padding: '2.5rem', borderRadius: '20px',
            background: 'var(--color-primary)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(254,100,98,0.2)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>RevCore</p>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.375rem', color: 'white', lineHeight: 1.2, marginBottom: '0.875rem' }}>
                Ready to build the system that solves this for your business?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '480px' }}>
                Everything covered in this article is something RevCore builds and manages for home service contractors. Book a free strategy call and we will show you exactly how it works for your trade and market.
              </p>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'white', color: 'var(--color-primary)',
                padding: '12px 24px', borderRadius: '100px',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              }}>
                Book a free strategy call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
