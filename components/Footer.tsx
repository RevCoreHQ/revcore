import Link from 'next/link';

const footerLinks = {
  Services: [
    { label: 'Lead Generation', href: '/services#leads' },
    { label: 'Organic Growth', href: '/services#organic' },
    { label: 'Smart Automation', href: '/services#automation' },
    { label: 'Sales Training', href: '/services#training' },
    { label: 'Sales Software', href: '/services#software' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Results', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'YouTube', href: '#' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-primary)', color: 'var(--color-white)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '60px' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="1" width="4" height="4" fill="#0A0A0A" rx="1"/>
                  <rect x="7" y="1" width="4" height="4" fill="#0A0A0A" rx="1"/>
                  <rect x="1" y="7" width="4" height="4" fill="#0A0A0A" rx="1"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-white)' }}>
                RevCore
              </span>
            </Link>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', maxWidth: '240px' }}>
              Automated revenue systems for home service contractors. Exclusive territory. Performance guaranteed.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.65rem', fontWeight: 700,
                  transition: 'border-color 0.2s, color 0.2s',
                }}>
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '32px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} RevCore HQ. All rights reserved.
          </p>
          <a href="mailto:hello@revcorehq.com" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
            hello@revcorehq.com
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
