import { usePage } from '@inertiajs/react'
import SEO from '../../components/SEO'

export default function Impressum() {
    const { props } = usePage()
    const footer = props.footer || {}
    const siteUrl = 'https://thenikhilsharma.in'
    const lastUpdated = 'January 1, 2025'

    return (
        <>
            <SEO
                title="Impressum | Nikhil Sharma — Full Stack Developer Jaipur"
                description="Read the impressum for Nikhil Sharma's website and freelance development services."
                canonical={`${siteUrl}/impressum`}
                robots="noindex, follow"
                ogType="website"
                structuredData={[
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Impressum",
                        "url": `${siteUrl}/impressum`,
                        "description": "Impressum for Nikhil Sharma's freelance web development services.",
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
                    }
                ]}
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
                        Impressum
                    </h1>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        {footer.impressum ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: footer.impressum }}
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: '0.92rem',
                                    color: '#475569',
                                    lineHeight: '1.8',
                                }}
                            />
                        ) : (
                            <>
                                <Section title="1. Information according to § 5 TMG">
                                    <p><strong>Nikhil Sharma</strong></p>
                                    <p>Jaipur, Rajasthan, India</p>
                                    <p>Email: <a href="mailto:technikhilsharma7@gmail.com" style={{ color: '#6366f1' }}>technikhilsharma7@gmail.com</a></p>
                                </Section>

                                <Section title="2. Responsible for content according to § 55 Abs. 2 RStV">
                                    <p>Nikhil Sharma</p>
                                    <p>Jaipur, Rajasthan, India</p>
                                </Section>

                                <Section title="3. Dispute resolution">
                                    <p>The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>https://ec.europa.eu/consumers/odr</a></p>
                                    <p>We are not obliged nor willing to participate in a dispute settlement procedure before a consumer arbitration board.</p>
                                </Section>
                            </>
                        )}
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
