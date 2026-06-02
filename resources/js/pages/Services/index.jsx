import { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO';
import { ShimmerServiceCard } from '../../components/ShimmerLoader';
import './index.css';

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>/gi, ' ').replace(/<\/li>/gi, ' ')
    .replace(/<li[^>]*>/gi, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'").replace(/&#39;/g, "'").replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&quot;/g, '"')
    .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/\s{2,}/g, ' ').trim();
}

const ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><polyline points="8 9 10 11 8 13" /><line x1="12" y1="13" x2="15" y2="13" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
];

const FAQS = [
  { q: 'How much does a website cost in Jaipur?', a: 'A basic business website starts from ₹15,000. A custom React or Laravel web application typically ranges from ₹50,000 to ₹1,50,000 depending on features and complexity. I provide a detailed quote after a free discovery call.' },
  { q: 'How long does it take to build a website?', a: 'A standard 5–8 page business website takes 2–3 weeks. A full-featured web application with backend, admin panel, and API integrations typically takes 6–12 weeks. Timelines are agreed upfront with weekly progress updates.' },
  { q: 'Do you work with clients outside Jaipur?', a: 'Yes. I work with clients across India and internationally — including the UAE, UK, and USA. All communication is via video calls, email, and project management tools, so location is never a barrier.' },
  { q: 'What technologies do you use?', a: 'I primarily use React (frontend), Laravel/PHP (backend), and MySQL or SQLite (database). For mobile apps I use Flutter and React Native. I choose the stack that best fits your project requirements.' },
  { q: 'Will my website rank on Google?', a: 'Every website I build includes on-page SEO foundations: semantic HTML, structured data (JSON-LD), fast load times, Core Web Vitals optimisation, and mobile-first design.' },
  { q: 'Do you provide maintenance after launch?', a: 'Yes. I offer monthly maintenance packages covering security updates, performance monitoring, content changes, and bug fixes. Rates start from ₹3,000/month.' },
];

const PER_PAGE = 5;

function toServiceUrl(slug) {
  if (!slug) return '/services';
  const parts = slug.split('-');
  const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const rest = parts.slice(1).join('-');
  return rest ? `/${prefix}/${rest}` : `/${prefix}`;
}

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ num, label }) {
  const match = String(num).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';

  const { count, ref } = useCountUp(target, 1800);

  return (
    <div className="srv-stat" ref={ref}>
      <span className="srv-stat-num">{count}{suffix}</span>
      <span className="srv-stat-label">{label}</span>
    </div>
  );
}

function generatePagination(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  if (currentPage < 3) {
    return [0, 1, 2, 3, 4, '...', totalPages - 1];
  }
  if (currentPage >= totalPages - 3) {
    return [0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
  }
  return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
}

export default function ServicesPage({ services = [] }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [page, setPage] = useState(0);
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShimmer(false), 700);
    return () => clearTimeout(t);
  }, []);

  const totalPages = Math.ceil(services.length / PER_PAGE);
  const paged = services.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 50 });
    setTimeout(() => AOS.refresh(), 100);
  }, []);

  useEffect(() => {
    const el = document.getElementById('srv-list');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page]);

  const serviceSchemas = services.map((s) => ({
    '@context': 'https://schema.org', 
    '@type': 'Service', 
    name: s.title,
    description: stripHtml(s.description ? s.description.slice(0, 200) : s.subtitle || ''),
    provider: { '@type': 'Person', name: 'Nikhil Sharma', url: 'https://thenikhilsharma.in' },
    url: `https://thenikhilsharma.in/services#${s.slug}`,
  }));

  return (
    <main className="srv-root">
      <SEO
        title="Web Development, App Development & UI/UX Design Services — Jaipur"
        description="Hire Nikhil Sharma for professional web development, mobile app development, and UI/UX design in Jaipur. PHP, React, Flutter. Affordable rates, fast delivery."
        keywords="Web Development Services Jaipur, App Development Jaipur, UI UX Design India, PHP Developer Jaipur, React Developer, Flutter App Developer"
        structuredData={serviceSchemas}
      />

      {/* ── HERO ── */}
      <section className="srv-hero">
        <div className="srv-hero-img-bg" />
        <div className="srv-hero-bg" />
        <div className="srv-hero-dots" />
        <div className="srv-hero-glow" />
        <div className="srv-hero-inner" data-aos="fade-up" data-aos-duration="900">
          <div className="srv-hero-badge">
            <span /> Bespoke Digital Solutions
          </div>
          <h1>
            Web, App &amp; Design<br />
            <span className="srv-h1-accent">Services in Jaipur</span>
          </h1>
          <p className="srv-hero-sub">
            9+ years helping businesses across India and the Middle East build digital products that look great, load fast, and rank on Google.
          </p>
          <div className="srv-hero-btns">
            <Link href="/contact" className="srv-btn-primary">
              Get a Free Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/portfolio" className="srv-btn-ghost">View My Work</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="srv-stats">
        {[
          { num: '9+', label: 'Years Experience' },
          { num: '120+', label: 'Projects Delivered' },
          { num: '3', label: 'Countries Served' },
          { num: '98%', label: 'Client Satisfaction' },
        ].map((s) => (
          <StatItem key={s.label} num={s.num} label={s.label} />
        ))}
      </div>

      {/* ── SERVICES LIST ── */}
      <div className="srv-wrap" id="srv-list">
        <div className="srv-section-top">
          <div>
            <p className="srv-section-eyebrow">What I Offer</p>
            <h2 className="srv-section-title">
              My <span>Services</span>
            </h2>
          </div>
          {services.length > 0 && (
            <span className="srv-count-badge">
              {services.length} Service{services.length !== 1 ? 's' : ''} Available
            </span>
          )}
        </div>

        {shimmer ? (
          <div className="srv-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <ShimmerServiceCard key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="srv-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="srv-grid">
              {paged.map((service, i) => {
                const gi = page * PER_PAGE + i;
                const isFlip = gi % 2 === 1;
                const hasFeatures = service.features && service.features.length > 0;
                const desc = stripHtml(service.description || service.subtitle || '');

                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className={`srv-card${isFlip ? ' srv-flip' : ''}${!hasFeatures ? ' srv-compact-aside' : ''}`}
                    data-aos="fade-up"
                    data-aos-delay={i * 60}
                    data-aos-duration="600"
                  >
                    {/* INFO PANEL */}
                    <div className="srv-card-info">
                      <div>
                        <div className="srv-card-top">
                          <div className="srv-card-icon-box">
                            <span className="srv-icon-wrapper">
                              {ICONS[gi % ICONS.length]}
                            </span>
                          </div>
                          <div className="srv-card-meta">
                            <p className="srv-card-num">Service {String(gi + 1).padStart(2, '0')}</p>
                            <h3 className="srv-card-title">
                              <a href={toServiceUrl(service.slug)}>
                                {stripHtml(service.title)}
                              </a>
                            </h3>
                            {service.subtitle && (
                              <p className="srv-card-subtitle">{stripHtml(service.subtitle)}</p>
                            )}
                          </div>
                        </div>
                        <p className="srv-card-desc">{desc}</p>
                      </div>
                      <div className="srv-card-footer">
                        {service.price_range ? (
                          <span className="srv-price-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            Starting from {service.price_range}
                          </span>
                        ) : (
                          <span />
                        )}
                        <Link href="/contact" className="srv-cta-btn">
                          {service.cta_text || 'Get a Quote'}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>

                    {/* ASIDE PANEL */}
                    <div className="srv-card-aside">
                      <div className="srv-aside-bg" />
                      {hasFeatures ? (
                        <>
                          <p className="srv-aside-label">What's Included</p>
                          <ul className="srv-features-list">
                            {service.features.slice(0, 6).map((feat, fi) => (
                              <li key={fi}>
                                <span className="srv-feat-check">
                                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="2 6 5 9 10 3" />
                                  </svg>
                                </span>
                                <span className="srv-feat-text">{stripHtml(feat)}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <div className="srv-aside-fallback">
                          <div className="srv-fallback-top">
                            <div className="srv-fallback-icon-box">
                              <span>{ICONS[gi % ICONS.length]}</span>
                            </div>
                            <div>
                              <p className="srv-fallback-label">Highlights</p>
                              <p className="srv-fallback-title">{stripHtml(service.title)}</p>
                            </div>
                          </div>

                          <div className="srv-fallback-points">
                            {[
                              'Bespoke Premium Architecture',
                              'Speed & Core Web Vitals Guarded',
                              'SEO Foundations Integrated',
                            ].map((point, pi) => (
                              <div key={pi} className="srv-fallback-point-item">
                                <span className="srv-fallback-check">
                                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9">
                                    <polyline points="2 6 5 9 10 3" />
                                  </svg>
                                </span>
                                <span className="srv-fallback-point-text">{point}</span>
                              </div>
                            ))}
                          </div>

                          <div className="srv-fallback-footer">
                            <Link href="/contact" className="srv-fallback-link">
                              Discuss Project
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="srv-pagination">
                <button className="srv-pg-arrow" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                {generatePagination(page, totalPages).map((p, i) => (
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="srv-pg-ellipsis">...</span>
                  ) : (
                    <button key={p} className={`srv-pg-num${page === p ? ' active' : ''}`} onClick={() => setPage(p)} aria-label={`Page ${p + 1}`}>
                      {p + 1}
                    </button>
                  )
                ))}
                <button className="srv-pg-arrow" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FAQ ── */}
      <section className="srv-faq-section" aria-labelledby="faq-h">
        <div className="srv-faq-inner">
          <p className="srv-faq-eyebrow">Got Questions?</p>
          <h2 className="srv-faq-title" id="faq-h">Frequently Asked Questions</h2>
          <p className="srv-faq-sub">Everything you need to know before hiring a web developer in Jaipur.</p>
          {FAQS.map((faq, i) => (
            <div key={i} className="srv-faq-item">
              <button className="srv-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                {faq.q}
                <svg className={`srv-faq-chevron${openFaq === i ? ' open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`srv-faq-body${openFaq === i ? ' open' : ''}`}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}