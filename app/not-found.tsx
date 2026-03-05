import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--color-bg)', paddingTop: '80px' }}>
      <div>
        <div style={{ fontSize: '8rem', fontWeight: 800, fontFamily: 'DM Sans, sans-serif', color: 'var(--color-border)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.75rem' }}>Page not found</h1>
        <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has moved.</p>
        <Link href="/" className="btn-primary">
          Back home <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
