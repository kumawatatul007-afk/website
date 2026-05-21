import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO';

/* ── Hero Slides — 5 alag ultra-HD tech images ── */
const HERO_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=100&auto=format&fit=crop', label: 'Business Meeting' },
  { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=100&auto=format&fit=crop', label: 'Strategy Planning' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=100&auto=format&fit=crop', label: 'Remote Work' },
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

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .kd-root { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; color: #1a1a1a; min-height: 100vh; }

  /* ── HERO SLIDER ── */
  .kd-hero {
    position: relative;
    height: clamp(380px, 52vh, 500px);
    display: flex;
    align-items: center;
    overflow: hidden;
    isolation: isolate;
  }
  .kd-slide {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    will-change: opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: opacity 0.8s ease;
  }
  .kd-overlay-dark {
    position: absolute; inset: 0; z-index: 2;
    background: rgba(5,5,15,0.30);
  }
  .kd-overlay-grad {
    position: absolute; inset: 0; z-index: 3;
    background: linear-gradient(135deg, rgba(10,10,30,0.25) 0%, rgba(30,10,60,0.15) 50%, rgba(10,30,80,0.20) 100%);
  }
  .kd-overlay-dots {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .kd-slide-label-wrap {
    position: absolute; top: 1.2rem; right: 4.5rem; z-index: 10;
  }
  .kd-slide-label {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.15);
    padding: 0.3rem 0.9rem; border-radius: 100px;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.8);
  }
  .kd-slide-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #6366f1; display: inline-block;
    animation: kd-pulse 2s infinite;
  }
  .kd-hero-inner {
    position: relative; z-index: 10;
    max-width: 900px; margin: 0 auto;
    padding: clamp(2rem,5vw,3rem) clamp(1.5rem,5vw,3rem);
    width: 100%;
  }
  .kd-slider-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 20; width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff; transition: all 0.2s ease;
  }
  .kd-slider-arrow:hover { background: rgba(255,255,255,0.25); transform: translateY(-50%) scale(1.1); }
  .kd-slider-arrow-left { left: 1.2rem; }
  .kd-slider-arrow-right { right: 1.2rem; }
  .kd-dot-row {
    position: absolute; bottom: 1.2rem; left: 50%; transform: translateX(-50%);
    z-index: 20; display: flex; gap: 7px;
  }
  .kd-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,0.35); border: none; cursor: pointer;
    transition: all 0.3s ease; padding: 0;
  }
  .kd-dot-active { width: 24px; border-radius: 4px; background: #6366f1; }

  .kd-breadcrumb {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.8rem;
  }
  .kd-breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
  .kd-breadcrumb a:hover { color: rgba(255,255,255,0.9); }
  .kd-bc-sep { opacity: 0.4; }
  .kd-bc-cur { color: rgba(255,255,255,0.85); }

  .kd-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
    padding: 0.35rem 1rem; border-radius: 100px; margin-bottom: 0.8rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: #a5b4fc;
  }
  .kd-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; animation: kd-pulse 2s infinite; }
  @keyframes kd-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .kd-hero h1 {
    font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 700; color: #fff;
    letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.7rem;
  }
  .kd-hero h1 .accent {
    background: linear-gradient(135deg, #818cf8, #ec4899);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .kd-hero-sub {
    font-size: clamp(0.88rem,1.4vw,1rem); color: rgba(255,255,255,0.80);
    line-height: 1.65; max-width: 580px; margin-bottom: 1.4rem; font-weight: 400;
  }
  .kd-hero-btns { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .kd-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 0.85rem 2rem; border-radius: 8px; text-decoration: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
    font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(99,102,241,0.4); transition: all 0.25s ease;
  }
  .kd-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5); }
  .kd-btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 0.85rem 2rem; border-radius: 8px; text-decoration: none;
    background: transparent; color: rgba(255,255,255,0.8);
    border: 1.5px solid rgba(255,255,255,0.2);
    font-size: 0.82rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    transition: all 0.25s ease;
  }
  .kd-btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; transform: translateY(-2px); }

  .kd-body { max-width: 1100px; margin: 0 auto; padding: clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,2.5rem); }
  .kd-grid { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; align-items: start; }
  @media (max-width: 900px) { .kd-grid { grid-template-columns: 1fr; } }

  .kd-card {
    background: #fff; border-radius: 20px; border: 1px solid #e5e7eb;
    padding: clamp(2rem,4vw,3rem); margin-bottom: 2rem;
  }
  .kd-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
    color: #6366f1; display: flex; align-items: center; gap: 8px; margin-bottom: 1.2rem;
  }
  .kd-eyebrow::before { content: ''; display: inline-block; width: 16px; height: 2px; background: #6366f1; }

  .kd-about-text { font-size: 0.97rem; color: #444; line-height: 1.9; }
  .kd-about-text p { margin-bottom: 1rem; }
  .kd-about-text h2 { font-size: 1.25rem; font-weight: 700; color: #111; margin: 1.6rem 0 0.7rem; }
  .kd-about-text h3 { font-size: 1.05rem; font-weight: 700; color: #222; margin: 1.2rem 0 0.5rem; }
  .kd-about-text ul { padding-left: 1.4rem; margin-bottom: 1rem; }
  .kd-about-text li { margin-bottom: 0.4rem; }
  .kd-about-text strong { color: #111; font-weight: 700; }

  .kd-why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; margin-top: 1rem; }
  .kd-why-item {
    padding: 1.2rem; background: #f9fafb; border-radius: 12px;
    border: 1px solid #f0f0f0; transition: border-color 0.2s, background 0.2s;
  }
  .kd-why-item:hover { background: #f0f4ff; border-color: #c7d2fe; }
  .kd-why-icon {
    width: 36px; height: 36px; border-radius: 10px; margin-bottom: 0.8rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .kd-why-title { font-size: 0.88rem; font-weight: 700; color: #111; margin-bottom: 0.3rem; }
  .kd-why-desc { font-size: 0.78rem; color: #6b7280; line-height: 1.5; }

  .kd-services-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
  .kd-service-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.2rem; background: #f9fafb; border-radius: 12px;
    border: 1px solid #f0f0f0; text-decoration: none; color: inherit;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .kd-service-link:hover { background: #f0f4ff; border-color: #c7d2fe; transform: translateX(4px); }
  .kd-service-link-title { font-size: 0.9rem; font-weight: 600; color: #111; }
  .kd-service-link-arrow { color: #6366f1; font-size: 1rem; }

  .kd-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
  .kd-cta-card {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 20px; padding: 2rem; text-align: center; color: #fff;
  }
  .kd-cta-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; }
  .kd-cta-card p { font-size: 0.85rem; opacity: 0.8; margin-bottom: 1.5rem; line-height: 1.6; }
  .kd-cta-card-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0.75rem 1.8rem; background: #fff; color: #6366f1;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    text-decoration: none; border-radius: 8px; transition: all 0.2s ease;
  }
  .kd-cta-card-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }

  .kd-info-card { background: #fff; border-radius: 20px; border: 1px solid #e5e7eb; padding: 1.8rem; }
  .kd-info-title { font-size: 0.85rem; font-weight: 700; color: #111; margin-bottom: 1.2rem; }
  .kd-info-row {
    display: flex; justify-content: space-between; gap: 1rem; font-size: 0.85rem;
    border-bottom: 1px solid #f0f0f0; padding-bottom: 0.9rem; margin-bottom: 0.9rem;
  }
  .kd-info-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .kd-info-label { color: #9ca3af; font-weight: 600; }
  .kd-info-value { color: #374151; font-weight: 500; text-align: right; }

  .kd-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0.85rem 1.5rem; background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 10px; text-decoration: none; font-size: 0.82rem;
    font-weight: 700; color: #374151; transition: all 0.2s ease;
  }
  .kd-back-btn:hover { border-color: #6366f1; color: #6366f1; }

  .kd-stats { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
  .kd-stat {
    flex: 1; min-width: 100px; background: #f9fafb; border-radius: 12px;
    border: 1px solid #f0f0f0; padding: 1rem; text-align: center;
  }
  .kd-stat-num { font-size: 1.6rem; font-weight: 700; color: #111; letter-spacing: -0.02em; }
  .kd-stat-label { font-size: 0.65rem; color: #9ca3af; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 3px; }
`;

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// "Best Software Developer in Jaipur" → "/Best/software-developer/Jaipur"
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
  return location ? `/${prefix}/${serviceSlug}/${location}` : `/${prefix}/${serviceSlug}`;
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
        description={`Looking for ${safeKeyword}? ${siteName} is a top-rated freelance developer in ${location} with 8+ years of experience. Affordable rates, fast delivery, real results.`}
        keywords={`${safeKeyword}, ${serviceType} ${location}, hire ${serviceType.toLowerCase()}, freelance developer ${location}`}
        structuredData={structuredData}
      />
      <style>{PAGE_STYLES}</style>

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
            {siteName} is a top-rated freelance developer in {location} with 8+ years of experience building websites, mobile apps, and digital solutions for businesses across India and the Middle East.
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
                  With over 8 years of hands-on experience in web development, mobile app development, and UI/UX design,
                  {siteName} has helped 120+ businesses build their digital presence — from startups to established enterprises.
                </p>
                <h2>Why Choose {siteName} as Your {serviceType}?</h2>
                <p>
                  Finding a reliable {serviceType.toLowerCase()} in {location} can be challenging. {siteName} offers a
                  unique combination of technical expertise, creative design, and business understanding that sets apart.
                </p>
                <ul>
                  <li>8+ years of professional experience in web and app development</li>
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
              <div className="kd-info-row"><span className="kd-info-label">Experience</span><span className="kd-info-value">8+ Years</span></div>
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
                  { num: '8+', label: 'Years Exp.' },
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
