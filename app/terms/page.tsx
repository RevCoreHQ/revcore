import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | RevCore',
  description: 'Terms and conditions governing your use of RevCore services.',
};

const EFFECTIVE_DATE = 'March 1, 2025';
const COMPANY = 'RevCore HQ, LLC';
const EMAIL = 'hello@revcorehq.com';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the RevCore website or engaging with our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website or services. These terms apply to all visitors, clients, and anyone who accesses or uses our services.`,
  },
  {
    title: '2. Services',
    body: `RevCore provides digital marketing, lead generation, sales training, automation, and proprietary software services to home service contractors. The specific scope, deliverables, pricing, and terms of any engagement are governed by the individual service agreement or statement of work executed between RevCore and the client. These Terms of Service apply generally and do not supersede any signed client agreement.`,
  },
  {
    title: '3. Intellectual Property',
    body: `All content on this website — including text, graphics, logos, images, and software — is the property of RevCore HQ, LLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this site without our prior written consent. Any proprietary software, tools, or systems built by RevCore remain the intellectual property of RevCore unless otherwise specified in a written client agreement.`,
  },
  {
    title: '4. Client Responsibilities',
    body: `Clients who engage RevCore's services agree to provide accurate and complete information required to deliver services; cooperate with RevCore staff and provide timely feedback and approvals; comply with all applicable laws in connection with their business operations and use of RevCore's deliverables; and not use RevCore's services or deliverables for any unlawful, misleading, or deceptive purpose.`,
  },
  {
    title: '5. Payment Terms',
    body: `Payment terms for services are outlined in individual client agreements. Failure to remit payment in accordance with the agreed schedule may result in suspension or termination of services. RevCore reserves the right to charge interest on overdue balances at the maximum rate permitted by applicable law.`,
  },
  {
    title: '6. Confidentiality',
    body: `Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the engagement. RevCore will not disclose client business information, performance data, or trade secrets to third parties without written consent, except as required by law. Clients agree not to disclose RevCore's proprietary systems, methodologies, or pricing structures to third parties.`,
  },
  {
    title: '7. Disclaimer of Warranties',
    body: `RevCore's website and services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our website will be uninterrupted, error-free, or free of viruses or other harmful components. While we strive to achieve strong results for our clients, we do not guarantee specific outcomes, revenue targets, or lead volumes, as results depend on many factors outside our control.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `To the maximum extent permitted by applicable law, RevCore shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from our services shall not exceed the total fees paid by you to RevCore in the three months preceding the claim.`,
  },
  {
    title: '9. Termination',
    body: `Either party may terminate a service engagement in accordance with the terms of the applicable client agreement. RevCore reserves the right to suspend or terminate access to its website or services at any time for any reason, including if we believe you have violated these Terms of Service. Upon termination, all licenses granted to you will immediately cease.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved exclusively in the state or federal courts located in Texas, and you consent to personal jurisdiction in such courts.`,
  },
  {
    title: '11. Changes to These Terms',
    body: `We reserve the right to update these Terms of Service at any time. When we do, we will update the effective date at the top of this page. Your continued use of our website or services after any changes constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.`,
  },
  {
    title: '12. Contact Us',
    body: `If you have questions about these Terms of Service, please contact us at:`,
    contact: true,
  },
];

export default function TermsPage() {
  return (
    <main style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '740px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #f0f0f0' }}>
          <Link href="/" style={{ fontSize: '0.78rem', color: '#999', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0A0A0A', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; {COMPANY}</p>
        </div>

        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
          Please read these Terms of Service carefully before using the RevCore website or engaging with our services. These terms constitute a legally binding agreement between you and {COMPANY}.
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
