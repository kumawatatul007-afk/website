import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO';
import './index.css';

/* ── Hero Slides — unique HD Unsplash images for Keyword page ── */
const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=100&auto=format&fit=crop',
    label: 'Strategy Planning',
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=100&auto=format&fit=crop',
    label: 'Business Meeting',
  },
  {
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=100&auto=format&fit=crop',
    label: 'Remote Collaboration',
  },
];

/* ── Image Slider Component ── */
function HeroImageSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 800);
  }, [animating, current]);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  return { current, next, prev, goTo, slides: HERO_SLIDES };
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// "Best Software Developer in Jaipur" → "/Best/software-developer/Jaipur"
// "Best Software Developer in Kalwar Road" → "/Best/software-developer/Kalwar-Road"
// "Top 10 Website Design Near Me" → "/Top10/website-design-near-me"
function toKeywordUrl(keyword) {
  const inParts = keyword.split(' in ');
  const servicePart = (inParts[0] || keyword).trim();
  const location = (inParts[1] || '').trim();
  const words = servicePart.split(/\s+/);
  let prefix = words[0] || 'Best';
  let restWords;
  // If second word is a number (e.g. "Top 10", "Top 5"), merge into prefix
  if (words[1] && /^\d+$/.test(words[1])) {
    prefix = prefix + words[1];
    restWords = words.slice(2);
  } else {
    restWords = words.slice(1);
  }
  const rest = restWords.join(' ');
  const serviceSlug = rest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Convert location to slug: "Kalwar Road" → "Kalwar-Road"
  const locationSlug = location
    ? location.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '')
    : '';
  return locationSlug ? `/${prefix}/${serviceSlug}/${locationSlug}` : `/${prefix}/${serviceSlug}`;
}

export default function KeywordDetailPage({ keyword, services = [], relatedKeywords = [], setting = null }) {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 50 });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [keyword]);

  if (!keyword) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1rem' }}>Page not found</h2>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Go Home</Link>
        </div>
      </main>
    );
  }

  // ── Dynamic values from setting ──────────────────────────────────────────
  const siteName    = setting?.website_title || 'Nikhil Sharma';
  const sitePhone   = setting?.phone         || null;
  const siteEmail   = setting?.email         || null;
  const siteAddress = setting?.address       || 'Jaipur, Rajasthan';
  const siteTiming  = setting?.timing        || null;

  const safeKeyword = keyword || '';
  // Split: "Best Software Developer in Jaipur" → prefix="Best Software Developer in", location="Jaipur"
  const parts = safeKeyword.split(' in ');
  const serviceType = parts[0] ? parts[0].trim() : safeKeyword;
  const location    = parts[1] ? parts[1].trim() : 'Jaipur';

  const titleWords = safeKeyword.split(' ');
  const titleMain  = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';
  const titleLast  = titleWords[titleWords.length - 1] || safeKeyword;

  const structuredData = [{
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: safeKeyword,
    description: `Looking for ${safeKeyword}? ${siteName} is a professional freelance developer based in Jaipur offering ${serviceType} services across ${location} and all of Rajasthan.`,
    provider: { '@type': 'Person', name: siteName, url: 'https://thenikhilsharma.in' },
    areaServed: location,
    url: `https://thenikhilsharma.in${toKeywordUrl(safeKeyword)}`,
  }];

  const slider = HeroImageSlider();

  return (
    <main className="kd-root">
      <SEO
        title={`${safeKeyword} — ${siteName} | Jaipur`}
        description={`Looking for ${safeKeyword}? ${siteName} is a top-rated freelance developer in ${location} with 9+ years of experience. Affordable rates, fast delivery, real results.`}
        keywords={`${safeKeyword}, ${serviceType} ${location}, hire ${serviceType.toLowerCase()}, freelance developer ${location}`}
        structuredData={structuredData}
      />

      {/* ── HERO WITH IMAGE SLIDER ── */}
      <section className="kd-hero">
        {/* Slides */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="kd-slide"
            style={{
              backgroundImage: `url(${slide.url})`,
              opacity: i === slider.current ? 1 : 0,
              zIndex: i === slider.current ? 1 : 0,
            }}
          />
        ))}

        {/* Overlays */}
        <div className="kd-overlay-dark" />
        <div className="kd-overlay-grad" />
        <div className="kd-overlay-dots" />

        {/* Slide label */}
        <div className="kd-slide-label-wrap">
          <span className="kd-slide-label">
            <span className="kd-slide-dot" />
            {HERO_SLIDES[slider.current].label}
          </span>
        </div>

        {/* Hero Content */}
        <div className="kd-hero-inner">
          <nav className="kd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="kd-bc-sep">›</span>
            <span className="kd-bc-cur">{safeKeyword}</span>
          </nav>

          <div className="kd-badge" data-aos="fade-up" data-aos-delay="50">
            <span className="kd-badge-dot" />
            Top Rated Developer
          </div>

          <h1 data-aos="fade-up" data-aos-delay="100" data-aos-duration="700">
            {titleMain
              ? <>{titleMain} <span className="accent">{titleLast}</span></>
              : <span className="accent">{titleLast}</span>
            }
          </h1>

          <p className="kd-hero-sub" data-aos="fade-up" data-aos-delay="160" data-aos-duration="700">
            {siteName} is a top-rated freelance developer in {location} with 9+ years of experience building websites, mobile apps, and digital solutions for businesses across India and the Middle East.
          </p>

          <div className="kd-hero-btns" data-aos="fade-up" data-aos-delay="220" data-aos-duration="700">
            <Link href="/contact" className="kd-btn-primary">
              Get a Free Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/portfolio" className="kd-btn-ghost">View My Work</Link>
          </div>
        </div>

        {/* Arrows */}
        <button className="kd-slider-arrow kd-slider-arrow-left" onClick={slider.prev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button className="kd-slider-arrow kd-slider-arrow-right" onClick={slider.next} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>

        {/* Dots */}
        <div className="kd-dot-row">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => slider.goTo(i)}
              className={`kd-dot${i === slider.current ? ' kd-dot-active' : ''}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* BODY */}
      <div className="kd-body">
        <div className="kd-grid">

          {/* LEFT */}
          <div>
            {/* About */}
            <div className="kd-card" data-aos="fade-up" data-aos-duration="600">
              <p className="kd-eyebrow">About</p>
              <div className="kd-about-text">
                <p>
                  If you're searching for <strong>{safeKeyword}</strong>, you've found the right place.
                  {siteName} is a professional freelance developer based in {siteAddress}, serving clients
                  across {location} and all of India.
                </p>
                <p>
                  With over 9 years of hands-on experience in web development, mobile app development, and UI/UX design,
                  {siteName} has helped 120+ businesses build their digital presence — from startups to established enterprises.
                </p>
                <h2>Why Choose {siteName} as Your {serviceType}?</h2>
                <p>
                  Finding a reliable {serviceType.toLowerCase()} in {location} can be challenging. {siteName} offers a
                  unique combination of technical expertise, creative design, and business understanding that sets apart.
                </p>
                <ul>
                  <li>9+ years of professional experience in web and app development</li>
                  <li>120+ successful projects delivered across India and the Middle East</li>
                  <li>Affordable pricing tailored for startups and small businesses</li>
                  <li>Fast turnaround — most projects delivered within 2–6 weeks</li>
                  <li>Full-stack expertise: React, Laravel, PHP, Flutter, MySQL</li>
                  <li>SEO-optimised websites that rank on Google</li>
                  <li>Post-launch support and maintenance available</li>
                </ul>
                <h2>Services Available in {location}</h2>
                <p>
                  As the {safeKeyword}, {siteName} provides a comprehensive range of digital services including
                  custom website development, mobile application development, UI/UX design, e-commerce solutions,
                  and SEO optimisation — all tailored to your specific business needs.
                </p>
                {(sitePhone || siteEmail) && (
                  <p>
                    Get in touch today
                    {sitePhone && <> — call or WhatsApp: <strong>{sitePhone}</strong></>}
                    {siteEmail && <> or email: <strong>{siteEmail}</strong></>}.
                  </p>
                )}
              </div>
            </div>

            
            {/* Services */}
            {services.length > 0 && (
              <div className="kd-card" data-aos="fade-up" data-aos-delay="120" data-aos-duration="600">
                <p className="kd-eyebrow">Related Services</p>
                <div className="kd-services-grid">
                  {services.slice(0, 8).map((svc) => {
                    const parts = (svc.slug || '').split('-');
                    const prefix = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
                    const rest = parts.slice(1).join('-');
                    const href = prefix && rest ? `/${prefix}/${rest}` : prefix ? `/${prefix}` : '/services';
                    return (
                      <Link key={svc.id} href={href} className="kd-service-link">
                        <span className="kd-service-link-title">{svc.title}</span>
                        <span className="kd-service-link-arrow">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="kd-sidebar">
            <div className="kd-cta-card" data-aos="fade-left" data-aos-duration="600">
              <h3>Ready to get started?</h3>
              <p>Let's discuss your project and build something great together in {location}.</p>
              <Link href="/contact" className="kd-cta-card-btn">
                Contact Me
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div className="kd-info-card" data-aos="fade-left" data-aos-delay="80" data-aos-duration="600">
              <p className="kd-info-title">Quick Info</p>
              <div className="kd-info-row"><span className="kd-info-label">Location</span><span className="kd-info-value">{location}, India</span></div>
              <div className="kd-info-row"><span className="kd-info-label">Experience</span><span className="kd-info-value">9+ Years</span></div>
              <div className="kd-info-row"><span className="kd-info-label">Projects</span><span className="kd-info-value">120+ Delivered</span></div>
              <div className="kd-info-row"><span className="kd-info-label">Stack</span><span className="kd-info-value">React, Laravel, Flutter</span></div>
              {siteTiming && (
                <div className="kd-info-row"><span className="kd-info-label">Timing</span><span className="kd-info-value">{siteTiming}</span></div>
              )}
              {sitePhone && (
                <div className="kd-info-row"><span className="kd-info-label">Phone</span><span className="kd-info-value">{sitePhone}</span></div>
              )}
              <div className="kd-info-row"><span className="kd-info-label">Remote</span><span className="kd-info-value">Available Worldwide</span></div>
            </div>

            <div className="kd-info-card" data-aos="fade-left" data-aos-delay="120" data-aos-duration="600">
              <p className="kd-info-title">Stats</p>
              <div className="kd-stats">
                {[
                  { num: '9+', label: 'Years Exp.' },
                  { num: '120+', label: 'Projects' },
                  { num: '98%', label: 'Satisfaction' },
                  { num: '3', label: 'Countries' },
                ].map(s => (
                  <div key={s.label} className="kd-stat">
                    <div className="kd-stat-num">{s.num}</div>
                    <div className="kd-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {relatedKeywords.length > 0 && (
              <div className="kd-info-card" data-aos="fade-left" data-aos-delay="160" data-aos-duration="600">
                <p className="kd-info-title">Related Searches</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {relatedKeywords.slice(0, 8).map((kw, i) => (
                    <Link
                      key={i}
                      href={toKeywordUrl(kw)}
                      style={{ fontSize: '0.82rem', color: '#6366f1', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                    >
                      → {kw}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href="/" className="kd-back-btn" data-aos="fade-left" data-aos-delay="200" data-aos-duration="600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
