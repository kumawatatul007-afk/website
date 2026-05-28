import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SEO from '../../../components/SEO';

// Rich project data mapped by slug
const PROJECT_DATA = {
  'kisan-gateway': {
    tagline: 'Connecting Farmers to Digital Markets',
    heroGradient: 'linear-gradient(135deg, #1a4a1a 0%, #2d7a2d 40%, #1b5e20 100%)',
    accentColor: '#2d7a2d',
    accentLight: '#e8f5e9',
    accentBorder: '#a5d6a7',
    category: 'Agriculture & Farming Platform',
    client: 'Kisan Gateway',
    year: '2023',
    website: 'https://kisangateway.com',
    tech: ['Laravel', 'PHP', 'React JS', 'MySQL', 'REST API', 'Bootstrap', 'Razorpay'],
    stats: [
      { value: '53,000+', label: 'Farmers Registered' },
      { value: '7,130+', label: 'Dealers & Providers' },
      { value: '289+', label: 'Coordinators' },
      { value: '24/7', label: 'Platform Uptime' },
    ],
    overview: "Kisan Gateway is a comprehensive digital marketplace that serves as a one-stop platform for all agricultural needs. It connects farmers with dealers, service providers, and coordinators — enabling seamless buying, selling, and access to agrarian resources across India.",
    challenge: "Farmers in rural India struggled to access fair markets, compare product prices, find reliable dealers, and get expert guidance — all while managing daily farm operations. Traditional methods were slow, opaque, and left farmers at a disadvantage. There was a critical need for a technology-driven bridge between farmers and the modern agricultural economy.",
    approach: "We built a feature-rich marketplace with separate portals for farmers, dealers, service providers, and coordinators. The platform features real-time listings for crops, livestock, property, and equipment — along with a dedicated Offer Zone and Ad Zone. Roles were carefully designed so every stakeholder type gets a customised dashboard and workflow, improving adoption and retention.",
    result: "Within the first year, Kisan Gateway onboarded over 53,000 farmers and 7,000+ dealers and service providers. The platform now handles thousands of daily listings and transactions, providing farmers with direct market access and transparent pricing — significantly improving their income potential.",
  },
  'ckship': {
    tagline: "India's Trusted Shipping Aggregator",
    heroGradient: 'linear-gradient(135deg, #7f0000 0%, #c62828 40%, #b71c1c 100%)',
    accentColor: '#c62828',
    accentLight: '#ffebee',
    accentBorder: '#ef9a9a',
    category: 'Shipping & Logistics Platform',
    client: 'CKShip',
    year: '2023',
    website: 'https://ckship.in',
    tech: ['Laravel', 'PHP', 'React JS', 'MySQL', 'Courier APIs', 'Razorpay', 'Webhook Integration'],
    stats: [
      { value: '27,000+', label: 'Active Users' },
      { value: '10+', label: 'Courier Partners' },
      { value: '5,000+', label: 'Daily Shipments' },
      { value: '99.5%', label: 'Delivery Success' },
    ],
    overview: "CKShip is a powerful multi-courier shipping aggregator built for Indian businesses of all sizes. It brings together the country's leading courier services — Delhivery, DTDC, Blue Dart, Ecom Express, and Xpress Bees — under one unified dashboard, making logistics faster, cheaper, and simpler.",
    challenge: "E-commerce sellers and businesses were managing multiple courier accounts separately — logging into different portals, manually comparing rates, and losing time and money. There was no single platform to compare, book, and track shipments across all major Indian couriers in real time.",
    approach: "We integrated APIs from all major Indian courier partners into a single unified platform. Users can compare real-time shipping rates, book shipments, generate labels, and track deliveries from one dashboard. Role-based access was built for sellers, admins, and logistics managers. Automated webhook tracking ensures live delivery status updates without manual refresh.",
    result: "CKShip now serves 27,000+ users processing 5,000+ daily shipments with a 99.5% delivery success rate. Businesses report saving 3–5 hours per day previously spent across multiple courier portals. The platform scaled to handle 10+ courier partners with zero downtime.",
  },
  'cloves-rinagar': {
    tagline: 'Premium Kashmiri Dining Experience Online',
    heroGradient: 'linear-gradient(135deg, #1a0a00 0%, #6d2b00 40%, #bf360c 100%)',
    accentColor: '#bf360c',
    accentLight: '#fbe9e7',
    accentBorder: '#ffab91',
    category: 'Restaurant & Food Platform',
    client: 'Cloves Rinagar',
    year: '2023',
    website: 'https://www.clovesrinagar.com',
    tech: ['Laravel', 'PHP', 'React JS', 'MySQL', 'Figma', 'CSS Animations', 'WhatsApp API'],
    stats: [
      { value: '300%', label: 'Online Orders Growth' },
      { value: '4.8★', label: 'Customer Rating' },
      { value: '50+', label: 'Menu Items Online' },
      { value: '2x', label: 'Table Bookings' },
    ],
    overview: "Cloves Rinagar is a premium restaurant from the heart of Kashmir, renowned for its authentic Kashmiri cuisine and elegant dining experience. We built a visually stunning website and online ordering platform that brings the warmth of Kashmiri hospitality to the digital world.",
    challenge: "Despite being a well-loved local restaurant, Cloves had no digital presence — no website, no online ordering, and no way for customers outside Srinagar to discover or engage with the brand. The brand needed a premium digital identity that matched the quality of its cuisine and ambience.",
    approach: "We designed a visually immersive website using rich imagery, smooth animations, and a warm colour palette inspired by Kashmiri culture. The platform includes a full online menu with categories, a table reservation system, and WhatsApp-integrated ordering. Special attention was given to mobile experience since most users browse on phones.",
    result: "After launch, Cloves saw a 300% increase in online orders within the first 3 months. Table bookings doubled through the online reservation system. The website now ranks on the first page of Google for 'Kashmiri restaurant Srinagar' and has become a key driver of new customer discovery.",
  },
};

function useScrollAnimation(ref, delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return visible;
}

export default function ProjectDetailPage({ id, item: dbItem }) {
  const pathId = id ? Number(id) : Number(window.location.pathname.split('/').pop());
  const [project, setProject] = useState(dbItem || null);
  const [prevItem, setPrevItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);
  const [loading, setLoading] = useState(!dbItem);
  const [imgLoaded, setImgLoaded] = useState(false);

  const heroRef     = useRef(null);
  const statsRef    = useRef(null);
  const overRef     = useRef(null);
  const challengeRef = useRef(null);
  const approachRef  = useRef(null);
  const techRef      = useRef(null);
  const resultRef    = useRef(null);
  const navRef       = useRef(null);

  const statsVis     = useScrollAnimation(statsRef, 0);
  const overVis      = useScrollAnimation(overRef, 0);
  const challengeVis = useScrollAnimation(challengeRef, 0);
  const approachVis  = useScrollAnimation(approachRef, 0);
  const techVis      = useScrollAnimation(techRef, 0);
  const resultVis    = useScrollAnimation(resultRef, 0);
  const navVis       = useScrollAnimation(navRef, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!dbItem) {
      setLoading(true);
      fetch(`/api/portfolio/${pathId}`)
        .then(r => r.json())
        .then(data => {
          setProject(data.item || data);
          setPrevItem(data.prev_item || null);
          setNextItem(data.next_item || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      fetch(`/api/portfolio/${pathId}`)
        .then(r => r.json())
        .then(data => { setPrevItem(data.prev_item || null); setNextItem(data.next_item || null); })
        .catch(() => {});
    }
  }, [pathId]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:'1rem', fontFamily:"'Space Grotesk',sans-serif" }}>
      <div className="pd2-spinner" />
      <p style={{ color:'#9ca3af', fontSize:'0.9rem' }}>Loading project...</p>
    </div>
  );

  if (!project) return (
    <div style={{ textAlign:'center', padding:'5rem', fontFamily:"'Space Grotesk',sans-serif" }}>
      <p style={{ color:'#9ca3af' }}>Project not found.</p>
      <Link href="/portfolio" style={{ color:'#0A3981', fontWeight:600 }}>← Back to Portfolio</Link>
    </div>
  );

  const slug   = project.slug || '';
  const extra  = PROJECT_DATA[slug] || {};
  const imgSrc = project.image
    ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`)
    : (project.image_url || '');

  const accent      = extra.accentColor || '#0A3981';
  const accentLight = extra.accentLight || '#eff6ff';
  const accentBorder = extra.accentBorder || '#bfdbfe';
  const heroGrad    = extra.heroGradient || 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)';
  const stats       = extra.stats || [];
  const tech        = extra.tech || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        * { box-sizing: border-box; }

        .pd2-page {
          background: #f8fafb;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          margin: -2rem -2rem 0;
          overflow-x: hidden;
          color: #1a1a2e;
        }

        /* ── SPINNER ── */
        .pd2-spinner {
          width: 40px; height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #0A3981;
          border-radius: 50%;
          animation: pd2-spin 0.8s linear infinite;
        }
        @keyframes pd2-spin { to { transform: rotate(360deg); } }

        /* ── HERO ── */
        .pd2-hero {
          position: relative;
          background: ${heroGrad};
          min-height: 480px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 0;
        }
        .pd2-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .pd2-hero-particles {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none;
        }
        .pd2-hero-particles span {
          position: absolute;
          width: 4px; height: 4px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          animation: pd2-float linear infinite;
        }
        @keyframes pd2-float {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) scale(1); opacity: 0; }
        }
        .pd2-hero-inner {
          position: relative; z-index: 2;
          width: 100%; max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pd2-back-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          color: rgba(255,255,255,0.75);
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, color 0.2s;
          width: fit-content;
        }
        .pd2-back-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

        .pd2-hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 0.35rem 1rem;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          width: fit-content;
          animation: pd2-fade-down 0.7s ease both;
        }
        .pd2-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
          margin: 0;
          animation: pd2-fade-up 0.7s 0.1s ease both;
        }
        .pd2-hero-tagline {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(255,255,255,0.7);
          font-weight: 400;
          margin: 0;
          animation: pd2-fade-up 0.7s 0.2s ease both;
        }
        .pd2-hero-cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #ffffff; color: #1a1a2e;
          border: none; border-radius: 100px;
          padding: 0.8rem 2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          width: fit-content;
          animation: pd2-fade-up 0.7s 0.3s ease both;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .pd2-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }

        @keyframes pd2-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pd2-fade-down {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── SCREENSHOT SECTION ── */
        .pd2-screenshot-wrap {
          background: #f0f4f8;
          padding: 3rem 2rem 0;
          display: flex;
          justify-content: center;
        }
        .pd2-browser-frame {
          width: 100%; max-width: 1100px;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.12), 0 40px 80px rgba(0,0,0,0.15);
          animation: pd2-rise 0.9s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes pd2-rise {
          from { opacity: 0; transform: translateY(60px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pd2-browser-bar {
          background: #e2e8f0;
          padding: 0.65rem 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .pd2-browser-dots { display: flex; gap: 6px; }
        .pd2-browser-dot {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .pd2-browser-dot:nth-child(1) { background: #fc5753; }
        .pd2-browser-dot:nth-child(2) { background: #fdbc40; }
        .pd2-browser-dot:nth-child(3) { background: #33c748; }
        .pd2-browser-url {
          flex: 1; background: #fff; border-radius: 6px;
          padding: 0.3rem 0.75rem;
          font-size: 0.72rem; color: #64748b;
          font-family: 'Space Grotesk', sans-serif;
        }
        .pd2-screenshot-img {
          width: 100%; display: block;
          max-height: 600px;
          object-fit: cover;
          object-position: top;
          transition: max-height 1.5s ease;
        }
        .pd2-browser-frame:hover .pd2-screenshot-img {
          max-height: 100vh;
          object-position: top;
        }

        /* ── MAIN CONTENT ── */
        .pd2-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem 6rem;
        }

        /* ── STATS ROW ── */
        .pd2-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e5e7eb;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 4rem;
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .pd2-stats-grid.pd2-vis { opacity: 1; transform: translateY(0); }
        .pd2-stat-item {
          background: #ffffff;
          padding: 2rem;
          text-align: center;
        }
        .pd2-stat-value {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          color: ${accent};
          line-height: 1;
          margin-bottom: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .pd2-stat-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── INFO ROW ── */
        .pd2-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }
        .pd2-info-pill {
          display: flex; flex-direction: column; gap: 0.25rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          flex: 1; min-width: 160px;
        }
        .pd2-info-pill-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #9ca3af;
        }
        .pd2-info-pill-value {
          font-size: 0.95rem; font-weight: 600; color: #1a1a2e;
        }
        .pd2-info-pill-value a {
          color: ${accent}; text-decoration: none; font-weight: 700;
        }
        .pd2-info-pill-value a:hover { text-decoration: underline; }

        /* ── SECTIONS ── */
        .pd2-section {
          margin-bottom: 3rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .pd2-section.pd2-vis { opacity: 1; transform: translateY(0); }

        .pd2-section-label {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .pd2-section-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: ${accent}; flex-shrink: 0;
        }
        .pd2-section-tag {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: ${accent};
        }
        .pd2-section-line {
          flex: 1; height: 1px; background: #e5e7eb;
        }
        .pd2-section-heading {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700; color: #131313;
          margin: 0 0 1.25rem;
          font-family: 'Playfair Display', serif;
          line-height: 1.25;
        }
        .pd2-section-text {
          font-size: 1rem; color: #4b5563;
          line-height: 1.9; margin: 0;
        }

        /* ── OVERVIEW CARD ── */
        .pd2-overview-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 2.5rem;
          border-left: 4px solid ${accent};
        }

        /* ── CHALLENGE / APPROACH ── */
        .pd2-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) { .pd2-two-col { grid-template-columns: 1fr; } }
        .pd2-col-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 2rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .pd2-col-card.pd2-vis { opacity: 1; transform: translateY(0); }
        .pd2-col-card:nth-child(2) { transition-delay: 0.12s; }
        .pd2-col-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
          background: ${accentLight};
        }
        .pd2-col-card-title {
          font-size: 1.1rem; font-weight: 700; color: #131313;
          margin: 0 0 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .pd2-col-card-text {
          font-size: 0.92rem; color: #4b5563; line-height: 1.85; margin: 0;
        }

        /* ── TECH STACK ── */
        .pd2-tech-section {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 3rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .pd2-tech-section.pd2-vis { opacity: 1; transform: translateY(0); }
        .pd2-tech-chips {
          display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.25rem;
        }
        .pd2-tech-chip {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.45rem 1rem;
          background: ${accentLight};
          color: ${accent};
          border: 1px solid ${accentBorder};
          border-radius: 100px;
          font-size: 0.8rem; font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
          opacity: 0; transform: scale(0.85);
          transition: opacity 0.4s ease, transform 0.4s ease, background 0.2s;
        }
        .pd2-tech-chip.pd2-chip-vis { opacity: 1; transform: scale(1); }
        .pd2-tech-chip:hover { background: ${accent}; color: #fff; border-color: ${accent}; }

        /* ── RESULT ── */
        .pd2-result-card {
          background: linear-gradient(135deg, ${accentLight} 0%, #ffffff 100%);
          border: 2px solid ${accentBorder};
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 3rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .pd2-result-card.pd2-vis { opacity: 1; transform: translateY(0); }
        .pd2-result-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: ${accent}; display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }

        /* ── CTA BANNER ── */
        .pd2-cta-banner {
          background: ${heroGrad};
          border-radius: 24px;
          padding: 3rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }
        .pd2-cta-banner::before {
          content: '';
          position: absolute; top: -50px; right: -50px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .pd2-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: #ffffff; font-weight: 700; margin: 0 0 0.5rem;
        }
        .pd2-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin: 0; }
        .pd2-cta-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #ffffff; color: #1a1a2e;
          padding: 0.85rem 2rem; border-radius: 100px;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap; flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .pd2-cta-link:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }

        /* ── POST NAV ── */
        .pd2-nav-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1rem; margin-bottom: 2rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .pd2-nav-row.pd2-vis { opacity: 1; transform: translateY(0); }
        .pd2-nav-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px; padding: 1.5rem;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: flex; flex-direction: column; gap: 0.4rem;
        }
        .pd2-nav-card:hover { border-color: ${accent}; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .pd2-nav-card-prev { align-items: flex-start; }
        .pd2-nav-card-next { align-items: flex-end; }
        .pd2-nav-label {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: ${accent};
        }
        .pd2-nav-title {
          font-size: 0.95rem; font-weight: 600; color: #1a1a2e; line-height: 1.4;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .pd2-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .pd2-stats-grid { grid-template-columns: 1fr 1fr; }
          .pd2-nav-row { grid-template-columns: 1fr; }
          .pd2-hero-inner { padding: 4rem 1.25rem 2.5rem; }
          .pd2-content { padding: 2.5rem 1.25rem 4rem; }
          .pd2-cta-banner { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="pd2-page">

        <SEO
          title={`${project.title} — ${extra.category || project.short_description || 'Portfolio'} | Nikhil Sharma`}
          description={extra.overview || (project.description ? project.description.replace(/<[^>]+>/g, '').slice(0, 155) : `${project.title} — built by Nikhil Sharma, Full Stack Developer Jaipur.`)}
          keywords={`${project.title}, ${extra.category || ''}, ${(extra.tech || []).slice(0, 4).join(', ')}, Portfolio, Nikhil Sharma Jaipur`}
          ogType="article"
        />

        {/* ── HERO ── */}
        <div className="pd2-hero" ref={heroRef}>
          <div className="pd2-hero-particles" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <span key={i} style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${6 + Math.random() * 8}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
              }} />
            ))}
          </div>
          <div className="pd2-hero-inner">
            <Link href="/portfolio" className="pd2-back-btn">← All Projects</Link>
            <span className="pd2-hero-badge">{extra.category || project.short_description || 'Web Development'}</span>
            <h1 className="pd2-hero-title">{project.title}</h1>
            {extra.tagline && <p className="pd2-hero-tagline">{extra.tagline}</p>}
            {project.website_link && (
              <a href={project.website_link} target="_blank" rel="noopener noreferrer" className="pd2-hero-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Visit Live Website
              </a>
            )}
          </div>
        </div>

        {/* ── BROWSER SCREENSHOT ── */}
        {imgSrc && (
          <div className="pd2-screenshot-wrap">
            <div className="pd2-browser-frame">
              <div className="pd2-browser-bar">
                <div className="pd2-browser-dots">
                  <div className="pd2-browser-dot" />
                  <div className="pd2-browser-dot" />
                  <div className="pd2-browser-dot" />
                </div>
                <div className="pd2-browser-url">
                  {project.website_link || `https://${project.slug}.com`}
                </div>
              </div>
              <img
                src={imgSrc}
                alt={project.title}
                className="pd2-screenshot-img"
                onLoad={() => setImgLoaded(true)}
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="pd2-content">

          {/* Info Pills */}
          <div className="pd2-info-row" style={{ marginTop: imgSrc ? '3rem' : '0' }}>
            <div className="pd2-info-pill">
              <span className="pd2-info-pill-label">Client</span>
              <span className="pd2-info-pill-value">{project.clint_name || project.title}</span>
            </div>
            <div className="pd2-info-pill">
              <span className="pd2-info-pill-label">Category</span>
              <span className="pd2-info-pill-value">{extra.category || project.short_description || 'Web Development'}</span>
            </div>
            <div className="pd2-info-pill">
              <span className="pd2-info-pill-label">Year</span>
              <span className="pd2-info-pill-value">{extra.year || '2023'}</span>
            </div>
            {project.website_link && (
              <div className="pd2-info-pill">
                <span className="pd2-info-pill-label">Live Website</span>
                <span className="pd2-info-pill-value">
                  <a href={project.website_link} target="_blank" rel="noopener noreferrer">Visit Site →</a>
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className={`pd2-stats-grid${statsVis ? ' pd2-vis' : ''}`} ref={statsRef}>
              {stats.map((s, i) => (
                <div key={i} className="pd2-stat-item">
                  <div className="pd2-stat-value">{s.value}</div>
                  <div className="pd2-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          {extra.overview && (
            <div className={`pd2-section${overVis ? ' pd2-vis' : ''}`} ref={overRef} style={{ marginBottom: '3rem' }}>
              <div className="pd2-section-label">
                <div className="pd2-section-dot" />
                <span className="pd2-section-tag">Project Overview</span>
                <div className="pd2-section-line" />
              </div>
              <div className="pd2-overview-card">
                <h2 className="pd2-section-heading">About This Project</h2>
                <p className="pd2-section-text">{extra.overview}</p>
              </div>
            </div>
          )}

          {/* Challenge & Approach */}
          {(extra.challenge || extra.approach) && (
            <div className="pd2-two-col" ref={challengeRef}>
              {extra.challenge && (
                <div className={`pd2-col-card${challengeVis ? ' pd2-vis' : ''}`}>
                  <div className="pd2-col-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" width="24" height="24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <h3 className="pd2-col-card-title">The Challenge</h3>
                  <p className="pd2-col-card-text">{extra.challenge}</p>
                </div>
              )}
              {extra.approach && (
                <div className={`pd2-col-card${challengeVis ? ' pd2-vis' : ''}`} ref={approachRef}>
                  <div className="pd2-col-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" width="24" height="24">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <h3 className="pd2-col-card-title">Our Approach</h3>
                  <p className="pd2-col-card-text">{extra.approach}</p>
                </div>
              )}
            </div>
          )}

          {/* Tech Stack */}
          {tech.length > 0 && (
            <div className={`pd2-tech-section${techVis ? ' pd2-vis' : ''}`} ref={techRef}>
              <div className="pd2-section-label">
                <div className="pd2-section-dot" />
                <span className="pd2-section-tag">Tech Stack</span>
                <div className="pd2-section-line" />
              </div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#131313', margin:'0 0 0.25rem' }}>
                Technologies Used
              </h3>
              <p style={{ fontSize:'0.88rem', color:'#9ca3af', margin:0 }}>Hover a chip to explore</p>
              <div className="pd2-tech-chips">
                {tech.map((t, i) => (
                  <span
                    key={t}
                    className={`pd2-tech-chip${techVis ? ' pd2-chip-vis' : ''}`}
                    style={{ transitionDelay: `${i * 0.06}s` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {extra.result && (
            <div className={`pd2-result-card${resultVis ? ' pd2-vis' : ''}`} ref={resultRef}>
              <div className="pd2-result-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" width="28" height="28">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                </svg>
              </div>
              <div className="pd2-section-label" style={{ marginBottom:'1rem' }}>
                <div className="pd2-section-dot" />
                <span className="pd2-section-tag">Results & Impact</span>
                <div className="pd2-section-line" />
              </div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:'#131313', fontSize:'1.5rem', margin:'0 0 1rem' }}>
                What We Achieved
              </h3>
              <p style={{ fontSize:'1rem', color:'#374151', lineHeight:1.85, margin:0 }}>{extra.result}</p>
            </div>
          )}

          {/* CTA Banner */}
          {project.website_link && (
            <div className="pd2-cta-banner">
              <div style={{ position:'relative', zIndex:1 }}>
                <h3 className="pd2-cta-title">See It Live in Action</h3>
                <p className="pd2-cta-sub">Explore the full {project.title} platform →</p>
              </div>
              <a href={project.website_link} target="_blank" rel="noopener noreferrer" className="pd2-cta-link" style={{ position:'relative', zIndex:1 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                Open Website
              </a>
            </div>
          )}

          {/* Next / Prev Navigation */}
          <div className={`pd2-nav-row${navVis ? ' pd2-vis' : ''}`} ref={navRef}>
            <div>
              {prevItem ? (
                <Link href={`/portfolio/${prevItem.id}`} className="pd2-nav-card pd2-nav-card-prev">
                  <span className="pd2-nav-label">← Previous</span>
                  <span className="pd2-nav-title">{prevItem.title}</span>
                </Link>
              ) : <div />}
            </div>
            <div>
              {nextItem ? (
                <Link href={`/portfolio/${nextItem.id}`} className="pd2-nav-card pd2-nav-card-next">
                  <span className="pd2-nav-label">Next →</span>
                  <span className="pd2-nav-title">{nextItem.title}</span>
                </Link>
              ) : <div />}
            </div>
          </div>

          <Link href="/portfolio" className="pd2-back-btn" style={{ background:'#1a1a2e', color:'#fff', border:'none', textDecoration:'none', padding:'0.75rem 1.75rem', borderRadius:'100px', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:'0.4rem', transition:'opacity 0.2s' }}>
            ← Back to All Projects
          </Link>

        </div>
      </div>
    </>
  );
}
