import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { portfolioProjects } from '@/lib/data';

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = portfolioProjects.find((p) => p.slug === params.slug);
  return { title: project ? `${project.title} — Floka` : 'Project — Floka' };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = portfolioProjects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const currentIndex = portfolioProjects.indexOf(project);
  const next = portfolioProjects[(currentIndex + 1) % portfolioProjects.length];

  return (
    <>
      <section style={{ paddingTop: '120px', background: 'var(--color-bg)' }}>
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--color-gray)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">{project.category}</div>
              <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{project.title}</h1>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray)' }}>{project.year}</div>
          </div>
        </div>
        <div style={{ height: 'clamp(300px, 55vw, 600px)', background: project.color, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 800, color: 'rgba(255,255,255,0.07)' }}>{project.title}</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--color-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '5rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-gray)' }}>{project.description}</p>
            <div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '1rem' }}>Services</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ background: 'var(--color-bg)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Next project</p>
          <Link href={`/portfolio/${next.slug}`} className="link-hover-accent" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--color-primary)' }}>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'inherit' }}>
              {next.title}
            </h2>
            <ArrowRight size={32} />
          </Link>
        </div>
      </section>
    </>
  );
}
