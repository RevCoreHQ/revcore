const items = [
  'Lead Generation', 'Smart Automation', 'Paid Advertising', 'Organic SEO',
  'AEO', 'Sales Training', 'Quoting Software', 'Sales Presentations',
  'CRM Systems', 'Database Reactivation', 'In-Home Sales', 'Revenue Scaling',
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div style={{ background: 'var(--color-primary)', padding: '22px 0', overflow: 'hidden' }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingRight: '32px', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {item}
            </span>
            <span style={{ color: 'var(--color-accent)', fontSize: '1rem' }}>★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
