import SEO from '../../components/SEO'

export default function PrivacyPolicy() {
  const siteUrl = 'https://thenikhilsharma.in'
  const lastUpdated = 'January 1, 2025'

  return (
    <>
      <SEO
        title="Privacy Policy | Nikhil Sharma — Full Stack Developer Jaipur"
        description="Privacy Policy for Nikhil Sharma's freelance web development services. Learn how we collect, use, and protect your personal information."
        canonical={`${siteUrl}/privacy-policy`}
        robots="noindex, follow"
        ogType="website"
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "url": `${siteUrl}/privacy-policy`,
          "description": "Privacy Policy for Nikhil Sharma's freelance web development services.",
          "publisher": {
            "@type": "Person",
            "name": "Nikhil Sharma",
            "url": siteUrl,
            "jobTitle": "Full Stack Developer",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Jaipur",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            }
          }
        }]}
      />

      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '5rem 2rem 4rem',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6366f1', marginBottom: '1rem' }}>
            Legal
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>

            <Section title="1. Introduction">
              <p>Welcome to <strong>thenikhilsharma.in</strong> ("Website"), operated by <strong>Nikhil Sharma</strong>, a freelance Full Stack Developer based in Jaipur, Rajasthan, India. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit this website or engage my services.</p>
              <p>By using this website, you agree to the collection and use of information in accordance with this policy.</p>
            </Section>

            <Section title="2. Information I Collect">
              <p><strong>Information you provide directly:</strong></p>
              <ul>
                <li>Name, email address, phone number — when you fill out the contact form</li>
                <li>Project details and requirements — when you inquire about services</li>
                <li>Newsletter subscription email — if you subscribe to updates</li>
              </ul>
              <p><strong>Information collected automatically:</strong></p>
              <ul>
                <li>IP address, browser type, operating system</li>
                <li>Pages visited, time spent, referring URLs</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </Section>

            <Section title="3. How I Use Your Information">
              <ul>
                <li>To respond to your inquiries and provide requested services</li>
                <li>To send project updates, invoices, and service-related communications</li>
                <li>To send newsletters (only if you have subscribed)</li>
                <li>To improve website performance and user experience</li>
                <li>To analyse website traffic via Google Analytics</li>
                <li>To comply with legal obligations</li>
              </ul>
            </Section>

            <Section title="4. Cookies">
              <p>This website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device. I use:</p>
              <ul>
                <li><strong>Essential cookies</strong> — required for the website to function properly</li>
                <li><strong>Analytics cookies</strong> — Google Analytics to understand how visitors use the site</li>
              </ul>
              <p>You can disable cookies through your browser settings. Note that disabling cookies may affect website functionality.</p>
            </Section>

            <Section title="5. Third-Party Services">
              <p>I may use the following third-party services that have their own privacy policies:</p>
              <ul>
                <li><strong>Google Analytics</strong> — website traffic analysis</li>
                <li><strong>Google Fonts</strong> — typography</li>
                <li><strong>WhatsApp</strong> — direct communication</li>
              </ul>
              <p>I do not sell, trade, or rent your personal information to third parties.</p>
            </Section>

            <Section title="6. Data Security">
              <p>I implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </Section>

            <Section title="7. Data Retention">
              <p>I retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Contact form submissions are retained for up to 2 years.</p>
            </Section>

            <Section title="8. Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal data I hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for newsletter communications at any time</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p>To exercise these rights, contact me at <a href="mailto:nikhilsharma@thenikhilsharma.in" style={{ color: '#6366f1' }}>nikhilsharma@thenikhilsharma.in</a>.</p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>This website is not directed at children under 13 years of age. I do not knowingly collect personal information from children under 13.</p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>I may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the website after changes constitutes acceptance of the updated policy.</p>
            </Section>

            <Section title="11. Contact">
              <p>If you have any questions about this Privacy Policy, please contact:</p>
              <p>
                <strong>Nikhil Sharma</strong><br />
                Jaipur, Rajasthan, India<br />
                Email: <a href="mailto:nikhilsharma@thenikhilsharma.in" style={{ color: '#6366f1' }}>nikhilsharma@thenikhilsharma.in</a><br />
                Website: <a href="https://thenikhilsharma.in" style={{ color: '#6366f1' }}>thenikhilsharma.in</a>
              </p>
            </Section>

          </div>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #e2e8f0',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '0.92rem',
        color: '#475569',
        lineHeight: '1.8',
      }}>
        {children}
      </div>
    </div>
  )
}
