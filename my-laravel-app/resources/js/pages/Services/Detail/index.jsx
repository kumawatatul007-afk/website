import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../../components/SEO';
import './index.css';

/* ─────────────────────────────────────────────
   HERO BACKGROUND IMAGES — high-quality Unsplash
───────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=90&fit=crop',
    label: 'Digital Solutions',
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=90&fit=crop',
    label: 'Business Growth',
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=90&fit=crop',
    label: 'Expert Team',
  },
  {
    url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920&q=90&fit=crop',
    label: 'Web Development',
  },
];

/* ─────────────────────────────────────────────
   STRIP HTML HELPER
───────────────────────────────────────────── */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/\s{2,}/g, ' ').trim();
}

/* ─────────────────────────────────────────────
   SLUG → URL HELPER
───────────────────────────────────────────── */
function toServiceUrl(slug) {
  if (!slug) return '/services';
  const parts = slug.split('-');
  const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const rest = parts.slice(1).join('-');
  return rest ? `/service/${prefix}/${rest}` : `/service/${prefix}`;
}

/* ─────────────────────────────────────────────
   HERO IMAGE SLIDER COMPONENT
───────────────────────────────────────────── */
function HeroSlider({ title, subtitle, priceRange, ctaText }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 900);
  }, [animating, current]);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const goBack = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const titleWords = (title || '').split(' ');
  const titleMain = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';
  const titleLast = titleWords[titleWords.length - 1] || title;

  return (
    <section className="sd-hero">
      {/* SLIDES */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="sd-slide-base"
          style={{
            backgroundImage: `url(${slide.url})`,
            opacity: i === current ? 1 : 0,
            transform: 'scale(1)',
            transition: 'opacity 0.8s ease',
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* OVERLAYS */}
      <div className="sd-overlay-dark" />
      <div className="sd-overlay-grad" />
      <div className="sd-overlay-dots" />

      {/* SLIDE LABEL PILL */}
      <div className="sd-slide-label-wrap">
        <span className="sd-slide-label">
          <span className="sd-slide-label-dot" />
          {HERO_SLIDES[current].label}
        </span>
      </div>

      {/* HERO CONTENT */}
      <div className="sd-hero-inner">
        {/* Breadcrumb */}
        <nav className="sd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="sd-bc-link">Home</Link>
          <span className="sd-bc-sep">›</span>
          <Link href="/services" className="sd-bc-link">Services</Link>
          <span className="sd-bc-sep">›</span>
          <span className="sd-bc-cur">{title}</span>
        </nav>

        {/* Eyebrow */}
        <div className="sd-hero-eyebrow" data-aos="fade-up" data-aos-delay="50">
          <span className="sd-eyebrow-line" />
          Premium Service
          <span className="sd-eyebrow-line" />
        </div>

        {/* Title */}
        <h1 className="sd-hero-h1" data-aos="fade-up" data-aos-delay="100">
          {titleMain && <>{titleMain}{' '}</>}
          <span className="sd-hero-accent">{titleLast}</span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="sd-hero-sub" data-aos="fade-up" data-aos-delay="160">
            {subtitle}
          </p>
        )}

        {/* CTA Row */}
        <div className="sd-hero-cta-row" data-aos="fade-up" data-aos-delay="220">
          {priceRange && (
            <span className="sd-price-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              {priceRange}
            </span>
          )}
          <Link href="/contact" className="sd-hero-cta-btn">
            {ctaText || 'Get a Free Quote'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/services" className="sd-hero-ghost-btn">
            All Services
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="sd-scroll-hint" data-aos="fade-up" data-aos-delay="300">
          <div className="sd-scroll-mouse">
            <div className="sd-scroll-wheel" />
          </div>
          <span className="sd-scroll-text">Scroll to explore</span>
        </div>
      </div>

      {/* SLIDER CONTROLS */}
      <button className="sd-slider-arrow" style={{ left: '1.5rem' }} onClick={goBack} aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="sd-slider-arrow" style={{ right: '1.5rem' }} onClick={next} aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* DOTS */}
      <div className="sd-dot-row">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`sd-dot ${i === current ? 'sd-dot-active' : ''}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function ServiceDetailPage({ service, related = [], setting = null }) {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 50 });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [service?.id]);

  const siteName = setting?.website_title || 'Nikhil Sharma';
  const sitePhone = setting?.phone || null;
  const siteEmail = setting?.email || null;

  if (!service) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1rem' }}>Service not found</h2>
          <Link href="/services" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>← Back to Services</Link>
        </div>
      </main>
    );
  }

  const features = Array.isArray(service.features) ? service.features : [];
  const descText = stripHtml(service.description || '');
  const hasHtmlDesc = !!(service.description && service.description.includes('<'));

  const structuredData = [{
    '@context': 'https://schema.org', '@type': 'Service',
    name: service.title || '',
    description: (service.meta_description || descText || '').slice(0, 300),
    provider: { '@type': 'Person', name: siteName, url: 'https://thenikhilsharma.in' },
    url: `https://thenikhilsharma.in${toServiceUrl(service.slug || '')}`,
    ...(service.price_range ? { offers: { '@type': 'Offer', description: service.price_range } } : {}),
  }];

  return (
    <main className="sd-root">
      <SEO
        title={service.meta_title || `${service.title} — Jaipur | ${siteName}`}
        description={service.meta_description || service.subtitle || (descText ? descText.slice(0, 160) : '') || `Professional ${service.title} services in Jaipur by ${siteName}.`}
        keywords={service.meta_keyword || `${service.title} Jaipur, ${service.title} India, ${siteName} ${service.title}`}
        structuredData={structuredData}
      />

      {/* ── HERO SLIDER ── */}
      <HeroSlider
        title={service.title}
        subtitle={service.subtitle}
        priceRange={service.price_range}
        ctaText={service.cta_text}
      />

      {/* ── STATS STRIP ── */}
      <div className="sd-stats-strip" data-aos="fade-up" data-aos-duration="600">
        {[
          { num: '9+', label: 'Years Experience' },
          { num: '120+', label: 'Projects Delivered' },
          { num: '3', label: 'Countries Served' },
          { num: '98%', label: 'Client Satisfaction' },
        ].map((s, i) => (
          <div key={i} className="sd-stat-item">
            <span className="sd-stat-icon">{s.icon}</span>
            <span className="sd-stat-num">{s.num}</span>
            <span className="sd-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="sd-body">
        <div className="sd-grid">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Overview Card */}
            {service.description && (
              <div className="sd-card" data-aos="fade-up" data-aos-duration="600">
                <div className="sd-card-header">
                  <div className="sd-card-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="sd-eyebrow">Overview</p>
                    <h2 className="sd-card-title">About This Service</h2>
                  </div>
                </div>
                <div className="sd-card-divider" />
                {hasHtmlDesc ? (
                  <div className="sd-desc-html" dangerouslySetInnerHTML={{ __html: service.description }} />
                ) : (
                  <p className="sd-desc-text">{descText}</p>
                )}
              </div>
            )}

            {/* Features Card */}
            {features.length > 0 && (
              <div className="sd-card" data-aos="fade-up" data-aos-delay="80" data-aos-duration="600">
                <div className="sd-card-header">
                  <div className="sd-card-icon-box" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="sd-eyebrow" style={{ color: '#16a34a' }}>Included</p>
                    <h2 className="sd-card-title">What's Included</h2>
                  </div>
                </div>
                <div className="sd-card-divider" />
                <div className="sd-feat-grid">
                  {features.map((feat, i) => (
                    <div key={i} className="sd-feat-item" data-aos="zoom-in" data-aos-delay={i * 40}>
                      <span className="sd-feat-check">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="sd-feat-text">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Steps */}
            <div className="sd-card" data-aos="fade-up" data-aos-delay="120" data-aos-duration="600">
              <div className="sd-card-header">
                <div className="sd-card-icon-box" style={{ background: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="sd-eyebrow" style={{ color: '#9333ea' }}>Process</p>
                  <h2 className="sd-card-title">How It Works</h2>
                </div>
              </div>
              <div className="sd-card-divider" />
              <div className="sd-process-steps">
                {[
                  { step: '01', title: 'Discovery Call', desc: 'We discuss your requirements, goals, and project scope in detail.' },
                  { step: '02', title: 'Proposal & Planning', desc: 'Detailed proposal with timeline, milestones, and cost breakdown.' },
                  { step: '03', title: 'Design & Development', desc: 'Iterative development with regular updates and feedback loops.' },
                  { step: '04', title: 'Launch & Support', desc: 'Smooth deployment with post-launch support and maintenance.' },
                ].map((p, i) => (
                  <div key={i} className="sd-process-item" data-aos="fade-right" data-aos-delay={i * 80}>
                    <div className="sd-process-num">{p.step}</div>
                    <div className="sd-process-content">
                      <h4 className="sd-process-title">{p.title}</h4>
                      <p className="sd-process-desc">{p.desc}</p>
                    </div>
                    {i < 3 && <div className="sd-process-line" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside>
            {/* CTA Card */}
            <div className="sd-cta-card" data-aos="fade-left" data-aos-duration="600">
              <div className="sd-cta-card-glow" />
              <div className="sd-cta-card-inner">
                <div className="sd-cta-icon-ring">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
                  </svg>
                </div>
                <h3 className="sd-cta-card-title">Ready to Get Started?</h3>
                <p className="sd-cta-card-sub">Let's build something amazing together. Free consultation, no commitment.</p>
                <Link href="/contact" className="sd-cta-card-btn">
                  Contact Me Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="sd-cta-card-meta">
                  <span className="sd-cta-meta-item">✓ Free Quote</span>
                  <span className="sd-cta-meta-item">✓ Fast Response</span>
                  <span className="sd-cta-meta-item">✓ No Hidden Fees</span>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="sd-side-card" data-aos="fade-left" data-aos-delay="80" data-aos-duration="600">
              <div className="sd-side-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="sd-side-card-title">Quick Info</span>
              </div>
              <div className="sd-info-list">
                {[
                  { label: 'Location', value: 'Jaipur, India (Remote OK)' },
                  { label: 'Delivery', value: '2–12 weeks' },
                  { label: 'Stack', value: 'React, Laravel, Flutter' },
                  { label: 'Support', value: 'Post-launch available' },
                  ...(sitePhone ? [{ label: 'Phone', value: sitePhone }] : []),
                  ...(siteEmail ? [{ label: 'Email', value: siteEmail }] : []),
                ].map((item, i) => (
                  <div key={i} className="sd-info-row">
                    <span className="sd-info-icon">{item.icon}</span>
                    <span className="sd-info-label">{item.label}</span>
                    <span className="sd-info-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="sd-side-card" data-aos="fade-left" data-aos-delay="140" data-aos-duration="600">
              <div className="sd-side-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
                <span className="sd-side-card-title">Technologies</span>
              </div>
              <div className="sd-tech-grid">
                {['React', 'Laravel', 'PHP', 'MySQL', 'Flutter', 'Figma', 'Node.js', 'Tailwind'].map((t, i) => (
                  <span key={i} className="sd-tech-badge">{t}</span>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <Link href="/services" className="sd-back-btn" data-aos="fade-left" data-aos-delay="200" data-aos-duration="600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              View All Services
            </Link>
          </aside>
        </div>

        {/* ── RELATED SERVICES ── */}
        {related.length > 0 && (
          <div className="sd-related-section" data-aos="fade-up" data-aos-duration="700">
            <div className="sd-related-header">
              <p className="sd-eyebrow">Explore More</p>
              <h2 className="sd-related-title">Other Services</h2>
            </div>
            <div className="sd-related-grid">
              {related.map((s, i) => (
                <Link key={s.id} href={toServiceUrl(s.slug)} className="sd-related-card" data-aos="zoom-in" data-aos-delay={i * 60}>
                  <div className="sd-related-card-top">
                    <div className="sd-related-card-num">0{i + 1}</div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="sd-related-card-title">{s.title}</h3>
                  {s.subtitle && <p className="sd-related-card-sub">{s.subtitle}</p>}
                  {s.price_range && <span className="sd-related-price">{s.price_range}</span>}
                  <div className="sd-related-card-footer">
                    <span className="sd-related-cta">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="sd-bottom-banner" data-aos="fade-up" data-aos-duration="700">
          <div className="sd-bottom-banner-glow" />
          <div className="sd-bottom-banner-dots" />
          <div className="sd-bottom-banner-inner">
            <p className="sd-bottom-eyebrow">— Let's Work Together —</p>
            <h2 className="sd-bottom-title">Have a Project in Mind?</h2>
            <p className="sd-bottom-sub">From idea to launch — I handle everything. Let's build something great.</p>
            <div className="sd-bottom-btns">
              <Link href="/contact" className="sd-bottom-btn-primary">
                Start a Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/portfolio" className="sd-bottom-btn-ghost">View Portfolio</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}