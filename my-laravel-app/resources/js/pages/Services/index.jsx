import { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO';
import { ShimmerServiceCard } from '../../components/ShimmerLoader';

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>/gi, ' ').replace(/<\/li>/gi, ' ')
    .replace(/<li[^>]*>/gi, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/\s{2,}/g, ' ').trim();
}

const ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><polyline points="8 9 10 11 8 13" /><line x1="12" y1="13" x2="15" y2="13" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
];

const ACCENT_COLORS = [
  { bg: '#e8f4fd', accent: '#2563eb', light: '#dbeafe' },
  { bg: '#fdf2f8', accent: '#9333ea', light: '#f3e8ff' },
  { bg: '#f0fdf4', accent: '#16a34a', light: '#dcfce7' },
  { bg: '#fff7ed', accent: '#ea580c', light: '#ffedd5' },
  { bg: '#fefce8', accent: '#ca8a04', light: '#fef9c3' },
  { bg: '#f0f9ff', accent: '#0891b2', light: '#e0f2fe' },
  { bg: '#fdf4ff', accent: '#a21caf', light: '#fae8ff' },
  { bg: '#fff1f2', accent: '#e11d48', light: '#ffe4e6' },
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

// "web-development" → "/service/Web/development"
function toServiceUrl(slug) {
  if (!slug) return '/services';
  const parts = slug.split('-');
  const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const rest = parts.slice(1).join('-');
  return rest ? `/${prefix}/${rest}` : `/${prefix}`;
}

// Count-up hook — animates from 0 to target when element enters viewport
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
            // Ease-out cubic
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

// Individual stat item with count-up
function StatItem({ num, label }) {
  // Parse: "8+" → { value: 8, suffix: '+' }, "120+" → { value: 120, suffix: '+' }, "98%" → { value: 98, suffix: '%' }, "3" → { value: 3, suffix: '' }
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

  // Brief shimmer on mount
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
    '@context': 'https://schema.org', '@type': 'Service', name: s.title,
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .srv-root {
          font-family: 'Space Grotesk', sans-serif;
          background: #f5f5f5;
          color: #1a1a1a;
          min-height: 100vh;
        }

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */
        .srv-hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
        }
        .srv-hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          pointer-events: none;
        }
        .srv-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg,
            rgba(10,10,20,0.55) 0%,
            rgba(15,15,35,0.50) 40%,
            rgba(10,20,50,0.50) 70%,
            rgba(8,30,70,0.55) 100%);
          z-index: 1;
        }
        .srv-hero-dots {
          position: absolute; inset: 0; z-index: 2;
          background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .srv-hero-glow {
          position: absolute; z-index: 2;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%);
          top: -100px; right: -100px;
          pointer-events: none;
        }
        .srv-hero-glow2 {
          position: absolute; z-index: 2;
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 65%);
          bottom: -80px; left: 10%;
          pointer-events: none;
        }
        .srv-hero-inner {
          position: relative; z-index: 3;
          text-align: center;
          padding: 5rem 2rem;
          max-width: 860px;
          margin: 0 auto;
        }
        .srv-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          padding: 0.4rem 1.2rem;
          border-radius: 100px;
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1.8rem;
        }
        .srv-hero-badge span {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1; display: inline-block;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .srv-hero h1 {
          font-size: clamp(2.6rem, 6vw, 4.8rem);
          font-weight: 700; color: #ffffff;
          line-height: 1.08; letter-spacing: -0.03em;
          margin-bottom: 1.4rem;
        }
        .srv-hero h1 .srv-h1-accent {
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
        }
        .srv-hero-sub {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,0.65);
          line-height: 1.75; max-width: 560px;
          margin: 0 auto 2.5rem; font-weight: 400;
        }
        .srv-hero-btns {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; flex-wrap: wrap;
        }
        .srv-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          transition: all 0.25s ease;
        }
        .srv-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5); gap: 14px; }
        .srv-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 0.85rem 2rem;
          background: transparent; color: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(255,255,255,0.2);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none;
          border-radius: 8px; transition: all 0.25s ease;
        }
        .srv-btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; transform: translateY(-2px); }

        /* ═══════════════════════════════════════
           STATS STRIP
        ═══════════════════════════════════════ */
        .srv-stats {
          background: #ffffff;
          display: flex; flex-wrap: wrap;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .srv-stat {
          flex: 1; min-width: 140px;
          display: flex; flex-direction: column; align-items: center;
          padding: 1.6rem 1rem;
          border-right: 1px solid #f0f0f0;
          transition: background 0.2s;
        }
        .srv-stat:last-child { border-right: none; }
        .srv-stat:hover { background: #fafafa; }
        .srv-stat-num {
          font-size: 1.9rem; font-weight: 700; color: #111;
          letter-spacing: -0.02em; line-height: 1;
        }
        .srv-stat-label {
          font-size: 0.65rem; color: #9ca3af;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-top: 5px; font-weight: 600;
        }

        /* ═══════════════════════════════════════
           SECTION WRAPPER
        ═══════════════════════════════════════ */
        .srv-wrap {
          max-width: 1180px; margin: 0 auto;
          padding: clamp(3rem, 6vw, 5rem) clamp(1.2rem, 4vw, 2.5rem);
        }
        .srv-section-top {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 2rem;
          margin-bottom: 3rem; flex-wrap: wrap;
        }
        .srv-section-eyebrow {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #6366f1; margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 8px;
        }
        .srv-section-eyebrow::before {
          content: ''; display: inline-block;
          width: 20px; height: 2px; background: #6366f1;
        }
        .srv-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 700; color: #111;
          letter-spacing: -0.02em; line-height: 1.15;
        }
        .srv-section-title span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .srv-count-badge {
          background: #f3f4f6; border: 1px solid #e5e7eb;
          padding: 0.4rem 1rem; border-radius: 100px;
          font-size: 0.78rem; font-weight: 600; color: #6b7280;
          white-space: nowrap; align-self: flex-start;
        }

        /* ═══════════════════════════════════════
           SERVICE CARDS GRID
        ═══════════════════════════════════════ */
        .srv-grid {
          display: flex; flex-direction: column; gap: 1.5rem;
        }

        .srv-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 320px;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          position: relative;
        }
        .srv-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        /* Even cards flip columns */
        .srv-card.srv-flip .srv-card-info  { order: 2; }
        .srv-card.srv-flip .srv-card-aside { order: 1; }

        /* ── INFO PANEL ── */
        .srv-card-info {
          padding: clamp(1.8rem, 4vw, 3rem);
          display: flex; flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #f0f0f0;
        }
        .srv-card.srv-flip .srv-card-info {
          border-right: none;
          border-left: 1px solid #f0f0f0;
        }
        .srv-card-top { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.4rem; }
        .srv-card-icon-box {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.3s ease;
        }
        .srv-card:hover .srv-card-icon-box { transform: scale(1.08) rotate(-3deg); }
        .srv-card-meta { flex: 1; }
        .srv-card-num {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #9ca3af; margin-bottom: 0.3rem;
        }
        .srv-card-title {
          font-size: clamp(1.3rem, 2.2vw, 1.7rem);
          font-weight: 700; color: #111;
          letter-spacing: -0.02em; line-height: 1.2;
        }
        .srv-card-subtitle {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #9ca3af; margin-top: 0.3rem;
        }
        .srv-card-desc {
          font-size: 0.92rem; color: #555;
          line-height: 1.8; font-weight: 400;
          flex: 1; margin-bottom: 1.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .srv-card-footer {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;
        }
        .srv-price-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.04em;
        }
        .srv-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.6rem 1.4rem;
          border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; transition: all 0.2s ease;
          color: #fff;
        }
        .srv-cta-btn svg { transition: transform 0.2s ease; }
        .srv-cta-btn:hover svg { transform: translateX(4px); }
        .srv-cta-btn:hover { transform: translateY(-1px); }

        /* ── ASIDE PANEL ── */
        .srv-card-aside {
          padding: clamp(1.8rem, 4vw, 3rem);
          display: flex; flex-direction: column;
          justify-content: center;
          position: relative; overflow: hidden;
        }
        .srv-aside-bg {
          position: absolute; inset: 0;
          opacity: 0.5; pointer-events: none;
          background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%);
        }
        .srv-aside-label {
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(0,0,0,0.4); margin-bottom: 1.2rem;
          position: relative; z-index: 1;
        }
        .srv-features-list {
          list-style: none; display: flex; flex-direction: column;
          gap: 0.75rem; position: relative; z-index: 1;
        }
        .srv-features-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.88rem; color: rgba(0,0,0,0.75);
          font-weight: 500; line-height: 1.5;
        }
        .srv-feat-check {
          flex-shrink: 0; width: 18px; height: 18px;
          border-radius: 50%; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.15);
        }
        .srv-feat-check svg { width: 9px; height: 9px; }

        /* No features — decorative visual */
        .srv-aside-visual {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          height: 100%; gap: 1rem;
          position: relative; z-index: 1;
        }
        .srv-aside-big-icon {
          width: 80px; height: 80px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.12);
        }
        .srv-aside-big-icon svg { width: 40px; height: 40px; }
        .srv-aside-tagline {
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(0,0,0,0.45); text-align: center;
        }

        /* ═══════════════════════════════════════
           PAGINATION
        ═══════════════════════════════════════ */
        .srv-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; margin-top: 3rem; padding-top: 2.5rem;
          border-top: 1px solid #e5e7eb;
        }
        .srv-pg-arrow {
          width: 42px; height: 42px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #374151;
          transition: all 0.2s ease;
        }
        .srv-pg-arrow:hover:not(:disabled) { background: #111; color: #fff; border-color: #111; }
        .srv-pg-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .srv-pg-num {
          min-width: 42px; height: 42px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #6b7280;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          transition: all 0.2s ease;
        }
        .srv-pg-num:hover { border-color: #6366f1; color: #6366f1; }
        .srv-pg-num.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent; color: #fff;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4);
        }

        /* ═══════════════════════════════════════
           FAQ
        ═══════════════════════════════════════ */
        .srv-faq-section {
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          padding: clamp(3rem, 6vw, 5rem) clamp(1.2rem, 4vw, 2.5rem);
        }
        .srv-faq-inner { max-width: 780px; margin: 0 auto; }
        .srv-faq-eyebrow {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #6366f1; margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 8px;
        }
        .srv-faq-eyebrow::before { content: ''; display: inline-block; width: 20px; height: 2px; background: #6366f1; }
        .srv-faq-title {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; color: #111;
          letter-spacing: -0.02em; margin-bottom: 0.5rem;
        }
        .srv-faq-sub { font-size: 0.95rem; color: #9ca3af; margin-bottom: 2.5rem; }
        .srv-faq-item { border-bottom: 1px solid #f0f0f0; }
        .srv-faq-btn {
          width: 100%; background: none; border: none;
          padding: 1.3rem 0;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem; font-weight: 600; color: #111;
          text-align: left; line-height: 1.4; transition: color 0.2s;
        }
        .srv-faq-btn:hover { color: #6366f1; }
        .srv-faq-chevron { flex-shrink: 0; color: #9ca3af; transition: transform 0.25s ease; }
        .srv-faq-chevron.open { transform: rotate(180deg); color: #6366f1; }
        .srv-faq-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease, padding 0.3s ease;
          font-size: 0.92rem; color: #6b7280; line-height: 1.8; padding: 0;
        }
        .srv-faq-body.open { max-height: 300px; padding-bottom: 1.5rem; }

        /* ═══════════════════════════════════════
           BOTTOM CTA
        ═══════════════════════════════════════ */
        .srv-cta-section {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f3460 100%);
          padding: clamp(4rem, 8vw, 6rem) 2rem;
          text-align: center; position: relative; overflow: hidden;
        }
        .srv-cta-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }
        .srv-cta-glow {
          position: absolute; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%);
          top: -150px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }
        .srv-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .srv-cta-eyebrow {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: #6366f1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 1.2rem;
        }
        .srv-cta-eyebrow::before, .srv-cta-eyebrow::after { content: ''; display: inline-block; width: 20px; height: 1px; background: #6366f1; }
        .srv-cta-h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; color: #fff;
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem;
        }
        .srv-cta-p { font-size: 1rem; color: rgba(255,255,255,0.55); margin-bottom: 2.5rem; line-height: 1.7; }
        .srv-cta-btns { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 768px) {
          .srv-card { grid-template-columns: 1fr; min-height: auto; }
          .srv-card.srv-flip .srv-card-info  { order: 1; }
          .srv-card.srv-flip .srv-card-aside { order: 2; }
          .srv-card-info { border-right: none !important; border-left: none !important; border-bottom: 1px solid #f0f0f0; }
          .srv-card-aside { min-height: 200px; }
          .srv-section-top { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 540px) {
          .srv-stat { flex: 1 1 50%; }
          .srv-stat:nth-child(2) { border-right: none; }
          .srv-hero-btns { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="srv-hero">
        <video
          className="srv-hero-video"
          src="https://v.ftcdn.net/19/77/69/30/240_F_1977693015_EfB0b5sUA4GStjUV19ondWzMQF0QCpF6_ST.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="srv-hero-bg" />
        <div className="srv-hero-dots" />
        <div className="srv-hero-glow" />
        <div className="srv-hero-glow2" />
        <div className="srv-hero-inner" data-aos="fade-up" data-aos-duration="900">
          <div className="srv-hero-badge">
            <span /> Bespoke Digital Solutions
          </div>
          <h1>
            Web, App &amp; Design<br />
            <span className="srv-h1-accent">Services in Jaipur</span>
          </h1>
          <p className="srv-hero-sub">
            8+ years helping businesses across India and the Middle East build digital products that look great, load fast, and rank on Google.
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
          { num: '8+', label: 'Years Experience' },
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
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem' }}>No services available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="srv-grid">
              {paged.map((service, i) => {
                const gi = page * PER_PAGE + i;
                const color = ACCENT_COLORS[gi % ACCENT_COLORS.length];
                const isFlip = gi % 2 === 1;
                const desc = stripHtml(service.description || service.subtitle || '');

                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className={`srv-card${isFlip ? ' srv-flip' : ''}`}
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                    data-aos-duration="700"
                  >
                    {/* INFO PANEL */}
                    <div className="srv-card-info">
                      <div>
                        <div className="srv-card-top">
                          <div className="srv-card-icon-box" style={{ background: color.light }}>
                            <span style={{ color: color.accent }}>
                              {ICONS[gi % ICONS.length]}
                            </span>
                          </div>
                          <div className="srv-card-meta">
                            <p className="srv-card-num">Service {String(gi + 1).padStart(2, '0')}</p>
                            <h3 className="srv-card-title">
                              <a href={toServiceUrl(service.slug)} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {service.title}
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
                          <span className="srv-price-tag" style={{ background: color.light, color: color.accent }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            Starting from {service.price_range}
                          </span>
                        ) : (
                          <span />
                        )}
                        <Link
                          href="/contact"
                          className="srv-cta-btn"
                          style={{ background: `linear-gradient(135deg, ${color.accent}, ${color.accent}dd)`, boxShadow: `0 6px 18px ${color.accent}40` }}
                        >
                          {service.cta_text || 'Get a Quote'}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>

                    {/* ASIDE PANEL */}
                    <div className="srv-card-aside" style={{ background: color.bg }}>
                      <div className="srv-aside-bg" />
                      {service.features && service.features.length > 0 ? (
                        <>
                          <p className="srv-aside-label">What's Included</p>
                          <ul className="srv-features-list">
                            {service.features.slice(0, 8).map((feat, fi) => (
                              <li key={fi}>
                                <span className="srv-feat-check" style={{ background: color.light }}>
                                  <svg viewBox="0 0 12 12" fill="none" stroke={color.accent} strokeWidth="2.5">
                                    <polyline points="2 6 5 9 10 3" />
                                  </svg>
                                </span>
                                <span style={{ color: '#374151' }}>{stripHtml(feat)}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '1.5rem' }}>
                          {/* Top: icon + title */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 56, height: 56, borderRadius: 14, background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ color: color.accent }}>{ICONS[gi % ICONS.length]}</span>
                            </div>
                            <div>
                              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 4 }}>Service Highlights</p>
                              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>{service.title}</p>
                            </div>
                          </div>

                          {/* Middle: 3 highlight points */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                            {[
                              'Custom solution tailored to your business goals',
                              'Fast delivery with regular progress updates',
                              'Post-launch support & maintenance included',
                              'SEO-optimised & mobile-first by default',
                            ].map((point, pi) => (
                              <div key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                                  <svg viewBox="0 0 12 12" fill="none" stroke={color.accent} strokeWidth="2.5" width="9" height="9">
                                    <polyline points="2 6 5 9 10 3" />
                                  </svg>
                                </span>
                                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.87rem', color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>{point}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bottom: CTA strip */}
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>Free consultation available</p>
                            <Link
                              href="/contact"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: color.accent, textDecoration: 'none', borderBottom: `1.5px solid ${color.accent}`, paddingBottom: 2 }}
                            >
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
                    <span key={`ellipsis-${i}`} style={{ padding: '0 8px', color: '#9ca3af', fontWeight: 600 }}>...</span>
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
