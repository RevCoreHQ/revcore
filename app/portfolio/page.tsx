import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { portfolioProjects } from '@/lib/data';

export const metadata = { title: 'Portfolio — Floka' };

export default function PortfolioPage() {
  return (
    <>
      <section style={{ paddingTop: '160px', paddingBottom: '80px', background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-tag">Our Work</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            Work we&apos;re <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>proud of.</span>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: '120px', background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="portfolio-grid">
            {portfolioProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className={`portfolio-card card-hover${i === 0 ? ' portfolio-card--featured' : ''}`}
              >
                <div style={{ borderRadius: '24px', overflow: 'hidden', background: project.color, height: '100%', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{project.category}</div>
                      <h2 style={{ color: 'white', fontSize: i === 0 ? '2rem' : '1.25rem', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>{project.title}</h2>
                    </div>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '4px 12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                    {project.year}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 360px;
          gap: 1.5rem;
        }
        .portfolio-card {
          text-decoration: none;
          display: block;
        }
        .portfolio-card--featured {
          grid-column: span 2;
          grid-row: span 1;
        }
        .portfolio-card--featured > div {
          aspect-ratio: unset;
          height: 100%;
        }
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr !important; grid-auto-rows: 280px !important; }
          .portfolio-card--featured { grid-column: span 1 !important; }
          h1 { white-space: normal !important; font-size: clamp(2rem, 10vw, 3rem) !important; }
        }
      `}</style>
    </>
  );
}
