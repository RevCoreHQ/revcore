import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | RevCore',
  description: 'How RevCore collects, uses, and protects your information.',
};

const EFFECTIVE_DATE = 'March 1, 2025';
const COMPANY = 'RevCore HQ, LLC';
const EMAIL = 'hello@revcorehq.com';

const sections = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us, including when you fill out a contact or onboarding form, book a call, or communicate with us by email or phone. This may include your name, email address, phone number, company name, and business information. We also automatically collect certain technical information when you visit our website, such as your IP address, browser type, pages visited, and referring URLs, through cookies and similar tracking technologies.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to provide, operate, and improve our services; respond to your inquiries and communicate with you about our services; send you marketing and promotional communications (you may opt out at any time); analyze usage trends to improve your experience; and comply with legal obligations. We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Your Information Stays Private',
    body: `We do not sell, rent, trade, or otherwise share your personal information with any third parties. Information you provide to RevCore is used solely to deliver and improve your service experience. It stays within our organization and is never disclosed to outside parties except as strictly required by law, court order, or government authority.`,
  },
  {
    title: '4. Cookies and Tracking',
    body: `Our website uses cookies and similar technologies to enhance your browsing experience and collect analytics data. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our website. We use analytics tools (such as Google Analytics) to understand how visitors interact with our site.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, maintain our business records, and comply with applicable laws. When information is no longer needed, we take reasonable steps to delete or anonymize it.`,
  },
  {
    title: '6. Your Rights',
    body: `Depending on your location, you may have the right to access, correct, or delete your personal information; opt out of marketing communications at any time by clicking "unsubscribe" in any email or contacting us directly; and request that we restrict or stop processing your data. To exercise any of these rights, contact us at the email address below.`,
  },
  {
    title: '7. Security',
    body: `We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '8. Third-Party Links',
    body: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies independently.`,
  },
  {
    title: '9. Children\'s Privacy',
    body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it.`,
  },
  {
    title: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will revise the effective date at the top of this page. Your continued use of our website after any changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    body: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:`,
    contact: true,
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '740px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #f0f0f0' }}>
          <Link href="/" style={{ fontSize: '0.78rem', color: '#999', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0A0A0A', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; {COMPANY}</p>
        </div>

        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
          {COMPANY} (&ldquo;RevCore,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services.
        </p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((s) => (
            <div key={s.title}>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
                {s.title}
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '0.9375rem' }}>{s.body}</p>
              {s.contact && (
                <div style={{ marginTop: '0.75rem', background: '#f8f8f8', borderRadius: '12px', padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: '#444', lineHeight: '1.8' }}>
                  <strong style={{ color: '#0A0A0A' }}>{COMPANY}</strong><br />
                  Email: <a href={`mailto:${EMAIL}`} style={{ color: '#FE6462', textDecoration: 'none' }}>{EMAIL}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .container { padding: 0 clamp(1.25rem, 4vw, 2rem); margin: 0 auto; }
      `}</style>
    </main>
  );
}
