import SEO from '../../components/SEO'

export default function TermsOfService() {
  const siteUrl = 'https://thenikhilsharma.in'
  const lastUpdated = 'January 1, 2025'

  return (
    <>
      <SEO
        title="Terms of Service | Nikhil Sharma — Full Stack Developer Jaipur"
        description="Terms of Service for Nikhil Sharma's freelance web development services. Read the terms governing use of this website and engagement of services."
        canonical={`${siteUrl}/terms-of-service`}
        robots="noindex, follow"
        ogType="website"
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms of Service",
          "url": `${siteUrl}/terms-of-service`,
          "description": "Terms of Service for Nikhil Sharma's freelance web development services.",
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>

            <Section title="1. Acceptance of Terms">
              <p>By accessing and using <strong>thenikhilsharma.in</strong> ("Website") or engaging the freelance services of <strong>Nikhil Sharma</strong> ("I", "me", "my"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this website or engage my services.</p>
            </Section>

            <Section title="2. Services Offered">
              <p>I provide freelance web development and design services including, but not limited to:</p>
              <ul>
                <li>Full Stack Web Development (Laravel, React.js, Node.js)</li>
                <li>Mobile App Development (Flutter)</li>
                <li>UI/UX Design</li>
                <li>SEO Optimisation</li>
                <li>Website Maintenance and Support</li>
              </ul>
              <p>All services are subject to a separate written agreement or proposal that outlines scope, timeline, and pricing.</p>
            </Section>

            <Section title="3. Project Agreements">
              <p>Each project will be governed by a separate Statement of Work (SOW) or proposal document. The SOW will specify:</p>
              <ul>
                <li>Project scope and deliverables</li>
                <li>Timeline and milestones</li>
                <li>Payment terms and schedule</li>
                <li>Revision policy</li>
                <li>Ownership and intellectual property rights</li>
              </ul>
              <p>Work begins only after written confirmation and receipt of any agreed advance payment.</p>
            </Section>

            <Section title="4. Payment Terms">
              <ul>
                <li>Pricing is agreed upon before project commencement</li>
                <li>A deposit (typically 50%) is required before work begins</li>
                <li>Final payment is due before delivery of final files or website launch</li>
                <li>Late payments may incur a delay in project delivery</li>
                <li>All prices are in Indian Rupees (INR) unless otherwise agreed</li>
              </ul>
            </Section>

            <Section title="5. Intellectual Property">
              <p>Upon receipt of full payment:</p>
              <ul>
                <li>You own the final deliverables created specifically for your project</li>
                <li>I retain the right to display the work in my portfolio unless otherwise agreed in writing</li>
                <li>Third-party assets (fonts, stock images, plugins) remain subject to their respective licences</li>
                <li>I retain ownership of any pre-existing code, frameworks, or tools used in the project</li>
              </ul>
            </Section>

            <Section title="6. Revisions and Changes">
              <p>The number of revisions included is specified in the project agreement. Additional revisions beyond the agreed scope will be billed at my standard hourly rate. Significant changes to project scope after commencement may require a revised proposal and additional charges.</p>
            </Section>

            <Section title="7. Client Responsibilities">
              <p>You agree to:</p>
              <ul>
                <li>Provide accurate and complete project requirements</li>
                <li>Supply necessary content, assets, and access credentials in a timely manner</li>
                <li>Provide feedback within agreed timeframes</li>
                <li>Ensure you have rights to any content or materials you provide</li>
                <li>Not use deliverables for illegal or unethical purposes</li>
              </ul>
            </Section>

            <Section title="8. Limitation of Liability">
              <p>To the maximum extent permitted by law, I shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website or services, including but not limited to loss of revenue, data, or business opportunities.</p>
              <p>My total liability for any claim shall not exceed the total amount paid by you for the specific service giving rise to the claim.</p>
            </Section>

            <Section title="9. Confidentiality">
              <p>I treat all client information as confidential and will not disclose project details, business information, or proprietary data to third parties without your written consent, except as required by law.</p>
            </Section>

            <Section title="10. Termination">
              <p>Either party may terminate a project agreement with written notice. In the event of termination:</p>
              <ul>
                <li>You are liable for payment for all work completed up to the termination date</li>
                <li>The deposit is non-refundable if work has commenced</li>
                <li>Completed deliverables will be provided upon receipt of outstanding payment</li>
              </ul>
            </Section>

            <Section title="11. Website Use">
              <p>You agree not to:</p>
              <ul>
                <li>Use this website for any unlawful purpose</li>
                <li>Attempt to gain unauthorised access to any part of the website</li>
                <li>Transmit any harmful, offensive, or disruptive content</li>
                <li>Reproduce or distribute website content without permission</li>
              </ul>
            </Section>

            <Section title="12. Governing Law">
              <p>These Terms of Service are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, India.</p>
            </Section>

            <Section title="13. Changes to Terms">
              <p>I reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the website or services after changes constitutes acceptance of the updated terms.</p>
            </Section>

            <Section title="14. Contact">
              <p>For questions about these Terms of Service, please contact:</p>
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
