import { blogPosts } from '@/lib/data';
import { FeaturedPost, PostCard } from '@/components/BlogCard';
import BlogHeroTitle from '@/components/BlogHeroTitle';

export const metadata = { title: 'Blog — RevCore' };

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <section style={{ paddingTop: '160px', paddingBottom: '80px', background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-tag">Contractor Growth Blog</div>
          <BlogHeroTitle />
          <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem', lineHeight: '1.75', marginTop: '1.25rem', maxWidth: '540px' }}>
            Real insights on leads, sales systems, and scaling a home service business. No fluff, no theory. Just what actually works in the field.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: '120px', background: 'var(--color-bg)' }}>
        <div className="container">
          <FeaturedPost post={featured} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section:last-of-type .container > div:last-child { grid-template-columns: 1fr !important; }
          h1 { white-space: normal !important; font-size: clamp(2rem, 10vw, 3rem) !important; }
        }
      `}</style>
    </>
  );
}
