import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import SEO from '../../../components/SEO';

const PROJECT_DATA = {
  'kisan-gateway': {
    tagline: 'Connecting 53,000+ Farmers to Digital Markets',
    heroGradient: 'linear-gradient(135deg,#0a2e0a 0%,#1b5e20 50%,#2e7d32 100%)',
    accent: '#2e7d32',
    accentRgb: '46,125,50',
    accentLight: '#e8f5e9',
    accentBorder: '#a5d6a7',
    category: 'Agriculture & Farming Platform',
    client: 'Kisan Gateway',
    year: '2026',
    website: 'https://kisangateway.com',
    tech: ['Laravel','PHP','React JS','MySQL','REST API','Bootstrap','Razorpay','Redis'],
    stats:[
      {value:53397,suffix:'+',label:'Farmers Registered'},
      {value:7130,suffix:'+',label:'Dealers & Providers'},
      {value:289,suffix:'+',label:'Coordinators'},
      {value:99,suffix:'%',label:'Uptime'},
    ],
    overview:"Kisan Gateway is India's comprehensive digital marketplace for agriculture — a one-stop platform where farmers meet dealers, service providers, and market experts. From buying seeds to selling harvests, listing livestock to finding machinery — everything under one roof.",
    challenge:"Farmers across rural India lacked access to transparent markets, reliable dealers, and expert guidance. Managing livestock sales, equipment purchases, and crop listings required visiting multiple places physically. There was no digital bridge between farmers and modern agrarian commerce.",
    approach:"We built separate role-based portals for farmers, dealers, service providers, and coordinators. The platform features real-time listings for crops, livestock, property, equipment, plus a dedicated Offer Zone and Ad Zone. An intelligent dashboard gives every stakeholder type a customised workflow for better adoption.",
    result:"Onboarded 53,000+ farmers and 7,000+ dealers within the first year. The platform now powers thousands of daily transactions, giving farmers direct market access, transparent pricing, and a measurable boost in income — without middlemen.",
  },
  'ckship': {
    tagline: "India's Multi-Courier Shipping Aggregator",
    heroGradient: 'linear-gradient(135deg,#3e0000 0%,#b71c1c 50%,#e53935 100%)',
    accent: '#c62828',
    accentRgb: '198,40,40',
    accentLight: '#ffebee',
    accentBorder: '#ef9a9a',
    category: 'Shipping & Logistics Platform',
    client: 'CKShip',
    year: '2026',
    website: 'https://ckship.in',
    tech:['Laravel','PHP','React JS','MySQL','Delhivery API','DTDC API','Razorpay','Webhooks'],
    stats:[
      {value:27000,suffix:'+',label:'Active Users'},
      {value:10,suffix:'+',label:'Courier Partners'},
      {value:5000,suffix:'+',label:'Daily Shipments'},
      {value:99.5,suffix:'%',label:'Delivery Success'},
    ],
    overview:"CKShip is a powerful multi-courier shipping aggregator built for Indian businesses. It unifies Delhivery, DTDC, Blue Dart, Ecom Express, and Xpress Bees into one seamless dashboard — compare rates, book shipments, generate labels, and track deliveries in real time.",
    challenge:"E-commerce sellers juggled multiple courier portals — logging in separately, manually comparing rates, and wasting hours daily. No single platform offered real-time rate comparison, booking, and tracking across all major Indian couriers under one login.",
    approach:"We integrated live APIs from all major courier partners into a unified platform. Role-based access for sellers, admins, and logistics managers. Automated webhook tracking delivers live delivery-status updates. A clean React dashboard lets businesses manage all shipments without switching tabs.",
    result:"27,000+ users now process 5,000+ daily shipments with a 99.5% delivery success rate. Businesses report saving 3–5 hours per day. The platform scaled seamlessly to 10+ courier partners with zero downtime during peak sale seasons.",
  },
  'cloves-rinagar': {
    tagline: 'Premium Kashmiri Dining Experience — Online',
    heroGradient: 'linear-gradient(135deg,#1a0800 0%,#4e1c00 50%,#bf360c 100%)',
    accent: '#bf360c',
    accentRgb: '191,54,12',
    accentLight: '#fbe9e7',
    accentBorder: '#ffab91',
    category: 'Restaurant & Food Platform',
    client: 'Clove Srinagar',
    year: '2026',
    website: 'https://www.clovesrinagar.com',
    tech:['Laravel','PHP','React JS','MySQL','Figma','WhatsApp API','CSS Animations','SEO'],
    stats:[
      {value:300,suffix:'%',label:'Orders Growth'},
      {value:4.8,suffix:'★',label:'Customer Rating'},
      {value:50,suffix:'+',label:'Menu Items Online'},
      {value:2,suffix:'x',label:'Table Bookings'},
    ],
    overview:"Cloves Rinagar is a premium restaurant from the heart of Kashmir, celebrated for its authentic cuisine and warm hospitality. We built a visually immersive website and online ordering platform that brings the magic of Kashmiri dining to the digital world.",
    challenge:"Despite being a beloved local landmark, Cloves had zero digital presence — no website, no online ordering, and no way for customers outside Srinagar to discover the brand. A premium digital identity was needed to match the quality of its food and ambience.",
    approach:"We designed an immersive website using rich food photography, smooth scroll animations, and a warm Kashmiri-inspired colour palette. The platform includes a categorised online menu, table reservation system, and WhatsApp-integrated ordering — fully optimised for mobile-first browsing.",
    result:"300% increase in online orders within 3 months of launch. Table bookings doubled via the online reservation system. The site now ranks page-1 on Google for 'Kashmiri restaurant Srinagar' — driving consistent new customer discovery from across India.",
  },
};

function useCountUp(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return count;
}

function StatItem({ stat, isVisible }) {
  const count = useCountUp(stat.value, isVisible);
  return (
    <div className="pd3-stat-item">
      <div className="pd3-stat-value">
        {stat.value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{stat.suffix}
      </div>
      <div className="pd3-stat-label">{stat.label}</div>
    </div>
  );
}

function ImageSlider({ imgSrc, websiteUrl }) {
  const STEPS = 4;
  const [step, setStep] = useState(0);

  return (
    <div className="pd3-slider-wrap">
      <div className="pd3-browser-chrome">
        <div className="pd3-browser-dots">
          <span style={{background:'#ff5f57'}} /><span style={{background:'#febc2e'}} /><span style={{background:'#28c840'}} />
        </div>
        <div className="pd3-browser-addr">{websiteUrl || 'https://example.com'}</div>
        <div style={{width:60}} />
      </div>
      <div className="pd3-slide-track">
        <img
          src={imgSrc}
          alt="preview"
          className="pd3-slide-img"
          style={{ transform: `translateY(${-step * 25}%)`, transition: 'transform 0.75s cubic-bezier(0.4,0,0.2,1)' }}
          loading="eager"
        />
        <div className="pd3-slider-controls">
          <button
            className="pd3-slider-arr"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Scroll up"
          >↑</button>
          <div className="pd3-slider-dots">
            {Array.from({ length: STEPS }).map((_, i) => (
              <button
                key={i}
                className={`pd3-dot${i === step ? ' pd3-dot-active' : ''}`}
                onClick={() => setStep(i)}
                aria-label={`Go to section ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="pd3-slider-arr"
            onClick={() => setStep(s => Math.min(STEPS - 1, s + 1))}
            disabled={step === STEPS - 1}
            aria-label="Scroll down"
          >↓</button>
        </div>
      </div>
    </div>
  );
}

function useVisible(ref) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return vis;
}

export default function ProjectDetailPage({ id, slug, item: dbItem }) {
  const pathSlug = (typeof slug !== 'undefined' && slug) ? slug : window.location.pathname.split('/').pop();
  const [project, setProject] = useState(dbItem || null);
  const [prevItem, setPrevItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);
  const [loading, setLoading] = useState(!dbItem);

  const statsRef    = useRef(null); const statsVis    = useVisible(statsRef);
  const overRef     = useRef(null); const overVis     = useVisible(overRef);
  const twoRef      = useRef(null); const twoVis      = useVisible(twoRef);
  const techRef     = useRef(null); const techVis     = useVisible(techRef);
  const resultRef   = useRef(null); const resultVis   = useVisible(resultRef);
  const navRef      = useRef(null); const navVis      = useVisible(navRef);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!dbItem) {
      setLoading(true);
      fetch(`/api/portfolio/${pathSlug}`).then(r=>r.json()).then(d=>{ setProject(d.item||d); setPrevItem(d.prev_item||null); setNextItem(d.next_item||null); setLoading(false); }).catch(()=>setLoading(false));
    } else {
      fetch(`/api/portfolio/${pathSlug}`).then(r=>r.json()).then(d=>{ setPrevItem(d.prev_item||null); setNextItem(d.next_item||null); }).catch(()=>{});
    }
  }, [pathSlug]);

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh',flexDirection:'column',gap:'1.25rem',fontFamily:"'Space Grotesk',sans-serif"}}>
      <div className="pd3-loader"><div /><div /><div /></div>
      <p style={{color:'#9ca3af',fontSize:'0.85rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Loading Project</p>
    </div>
  );
  if (!project) return <div style={{textAlign:'center',padding:'5rem',fontFamily:"'Space Grotesk',sans-serif"}}><p style={{color:'#9ca3af'}}>Project not found.</p><Link href="/portfolio" style={{color:'#0A3981',fontWeight:600}}>← Back to Portfolio</Link></div>;

  const projectSlug = project.slug || '';
  const ex          = PROJECT_DATA[projectSlug] || {};
  const accent      = ex.accent      || '#0A3981';
  const accentRgb   = ex.accentRgb   || '10,57,129';
  const accentLight = ex.accentLight || '#eff6ff';
  const accentBorder= ex.accentBorder|| '#bfdbfe';
  const heroGrad    = ex.heroGradient|| 'linear-gradient(135deg,#0f172a,#1e3a8a)';
  const stats       = ex.stats       || [];
  const tech        = ex.tech        || [];
  const imgSrc      = project.image ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`) : (project.image_url || '');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}

        .pd3-page{background:#f4f6f9;min-height:100vh;font-family:'Space Grotesk',sans-serif;margin:-2rem -2rem 0;overflow-x:hidden;color:#1a1a2e}

        /* LOADER */
        .pd3-loader{display:flex;gap:8px}
        .pd3-loader div{width:10px;height:10px;border-radius:50%;background:${accent};animation:pd3-bounce 1.2s ease-in-out infinite}
        .pd3-loader div:nth-child(2){animation-delay:0.15s}
        .pd3-loader div:nth-child(3){animation-delay:0.3s}
        @keyframes pd3-bounce{0%,80%,100%{transform:scale(0.7);opacity:0.5}40%{transform:scale(1);opacity:1}}

        /* ══ HERO ══ */
        .pd3-hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
        .pd3-hero-bg{position:absolute;inset:0;background:${heroGrad}}
        .pd3-hero-img-bg{position:absolute;inset:0;background-size:cover;background-position:center top;filter:brightness(0.18) blur(2px);transform:scale(1.08);transition:transform 8s ease}
        .pd3-hero:hover .pd3-hero-img-bg{transform:scale(1.12)}
        .pd3-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}
        .pd3-hero-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(${accentRgb},0.35) 0%,transparent 70%);top:-200px;right:-100px;pointer-events:none}

        .pd3-hero-inner{position:relative;z-index:3;max-width:1200px;width:100%;margin:0 auto;padding:2rem 2rem 5rem;display:flex;flex-direction:column;gap:1.25rem}
        .pd3-back-chip{display:inline-flex;align-items:center;gap:0.4rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:0.4rem 1rem;color:rgba(255,255,255,0.65);font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;transition:all 0.2s;width:fit-content;margin-top:5rem}
        .pd3-back-chip:hover{background:rgba(255,255,255,0.16);color:#fff}
        .pd3-category-badge{display:inline-flex;align-items:center;gap:0.5rem;width:fit-content}
        .pd3-badge-dot{width:8px;height:8px;border-radius:50%;background:${accent};box-shadow:0 0 12px rgba(${accentRgb},0.8);animation:pd3-pulse 2s ease-in-out infinite}
        @keyframes pd3-pulse{0%,100%{box-shadow:0 0 6px rgba(${accentRgb},0.6)}50%{box-shadow:0 0 18px rgba(${accentRgb},1)}}
        .pd3-badge-text{font-size:0.72rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7)}
        .pd3-hero-title{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,6rem);font-weight:700;color:#fff;line-height:1.05;letter-spacing:-0.02em;animation:pd3-up 0.8s 0.1s ease both;hyphens:none;-webkit-hyphens:none;overflow-wrap:break-word;word-break:break-word}
        .pd3-hero-tagline{font-size:clamp(1rem,2.2vw,1.3rem);color:rgba(255,255,255,0.6);font-weight:400;max-width:560px;line-height:1.6;animation:pd3-up 0.8s 0.2s ease both}
        .pd3-hero-actions{display:flex;flex-wrap:wrap;gap:1rem;animation:pd3-up 0.8s 0.3s ease both}
        .pd3-btn-primary{display:inline-flex;align-items:center;gap:0.5rem;background:#fff;color:#1a1a2e;border-radius:100px;padding:0.9rem 2rem;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 8px 32px rgba(0,0,0,0.25)}
        .pd3-btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,0.35)}
        .pd3-btn-ghost{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,255,255,0.25);color:#fff;border-radius:100px;padding:0.9rem 2rem;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:background 0.2s}
        .pd3-btn-ghost:hover{background:rgba(255,255,255,0.18)}
        .pd3-hero-scroll{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:0.5rem;color:rgba(255,255,255,0.4);font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;animation:pd3-fade 1s 1s ease both;z-index:3}
        .pd3-scroll-line{width:1.5px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,0.4),transparent);animation:pd3-scroll-anim 1.8s ease-in-out infinite}
        @keyframes pd3-scroll-anim{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        @keyframes pd3-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pd3-fade{from{opacity:0}to{opacity:1}}

        /* ══ SLIDER ══ */
        .pd3-slider-section{background:#000;padding:5rem 2rem}
        .pd3-slider-container{max-width:1100px;margin:0 auto}
        .pd3-slider-header{text-align:center;margin-bottom:2.5rem}
        .pd3-slider-tag{font-size:0.72rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${accent};margin-bottom:0.5rem}
        .pd3-slider-headline{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);color:#fff;font-weight:700}

        .pd3-slider-wrap{position:relative;border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,0.08),0 40px 80px rgba(0,0,0,0.8);background:#111}
        .pd3-browser-chrome{background:#111;padding:0.75rem 1rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid rgba(255,255,255,0.1)}
        .pd3-browser-dots{display:flex;gap:6px}
        .pd3-browser-dots span{width:12px;height:12px;border-radius:50%;display:block}
        .pd3-browser-addr{flex:1;background:rgba(255,255,255,0.08);border-radius:6px;padding:0.3rem 0.75rem;font-size:0.7rem;color:rgba(255,255,255,0.5);font-family:'Space Grotesk',sans-serif;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
        .pd3-slide-track{position:relative;height:520px;overflow:hidden;background:#000}
        @media(max-width:768px){.pd3-slide-track{height:320px}}
        .pd3-slide-img{width:100%;height:auto;object-fit:unset;display:block}
        .pd3-slider-controls{position:absolute;bottom:0;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:1.5rem;z-index:20;background:rgba(0,0,0,0.78);backdrop-filter:blur(12px);padding:0.9rem 1.5rem;border-top:1px solid rgba(255,255,255,0.1)}
        .pd3-slider-arr{background:black;border:2px solid rgba(255,255,255,0.85);color:#fff;width:42px;height:42px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:background 0.2s,transform 0.2s,opacity 0.2s;flex-shrink:0;font-weight:700}
        .pd3-slider-arr:hover:not(:disabled){background:black;transform:scale(1.1)}
        .pd3-slider-arr:disabled{opacity:0.25;cursor:not-allowed}
        .pd3-slider-dots{display:flex;gap:10px;align-items:center}
        .pd3-dot{width:9px;height:9px;border-radius:50%;background:black;border:none;cursor:pointer;transition:background 0.2s,transform 0.2s;padding:0}
        .pd3-dot-active{background:black;transform:scale(1.4)}
        .pd3-slide-label{position:absolute;top:1rem;right:1rem;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);color:#fff;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:0.3rem 0.75rem;border-radius:100px;font-family:'Space Grotesk',sans-serif;z-index:10;border:1px solid rgba(255,255,255,0.15)}

        /* ══ MAIN ══ */
        .pd3-main{max-width:1200px;margin:0 auto;padding:5rem 2rem 6rem}

        /* META BAR */
        .pd3-meta-bar{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;margin-bottom:4rem;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
        .pd3-meta-item{padding:1.75rem 1.5rem;border-right:1px solid #e5e7eb;display:flex;flex-direction:column;gap:0.35rem}
        .pd3-meta-item:last-child{border-right:none}
        .pd3-meta-label{font-size:0.65rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af}
        .pd3-meta-value{font-size:0.95rem;font-weight:700;color:#1a1a2e}
        .pd3-meta-value a{color:${accent};text-decoration:none;font-weight:700}
        .pd3-meta-value a:hover{text-decoration:underline}
        @media(max-width:768px){.pd3-meta-bar{grid-template-columns:1fr 1fr}.pd3-meta-item{border-right:none;border-bottom:1px solid #e5e7eb}.pd3-meta-item:nth-child(odd){border-right:1px solid #e5e7eb}.pd3-meta-item:last-child,.pd3-meta-item:nth-last-child(2):nth-child(odd){border-bottom:none}}

        /* STATS */
        .pd3-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:4rem;opacity:0;transform:translateY(28px);transition:opacity 0.7s,transform 0.7s}
        .pd3-stats-grid.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-stat-item{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:2rem 1.5rem;text-align:center;position:relative;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
        .pd3-stat-item::before{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:${accent}}
        .pd3-stat-item:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.1)}
        .pd3-stat-value{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;color:${accent};font-family:'Space Grotesk',sans-serif;line-height:1;margin-bottom:0.5rem}
        .pd3-stat-label{font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280}
        @media(max-width:900px){.pd3-stats-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.pd3-stats-grid{grid-template-columns:repeat(2,1fr)}}

        /* SECTION SHARED */
        .pd3-section{opacity:0;transform:translateY(28px);transition:opacity 0.65s ease,transform 0.65s ease;margin-bottom:3rem}
        .pd3-section.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-section-eyebrow{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem}
        .pd3-section-dot{width:8px;height:8px;border-radius:50%;background:${accent};flex-shrink:0}
        .pd3-section-tag{font-size:0.7rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${accent}}
        .pd3-section-rule{flex:1;height:1px;background:#e5e7eb}
        .pd3-section-title{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;color:#131313;margin-bottom:1rem;line-height:1.2}

        /* OVERVIEW */
        .pd3-overview-card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:3rem;border-left:4px solid ${accent};box-shadow:0 4px 24px rgba(0,0,0,0.05)}
        .pd3-overview-text{font-size:1.05rem;color:#374151;line-height:1.95}

        /* CHALLENGE + APPROACH */
        .pd3-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:3rem;opacity:0;transform:translateY(28px);transition:opacity 0.65s,transform 0.65s}
        .pd3-two-col.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-col-card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:2.25rem;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 4px 24px rgba(0,0,0,0.04)}
        .pd3-col-card:hover{border-color:${accent};box-shadow:0 8px 40px rgba(${accentRgb},0.1)}
        .pd3-col-card:nth-child(2){transition-delay:0.1s}
        .pd3-col-icon-wrap{width:52px;height:52px;border-radius:14px;background:${accentLight};border:1px solid ${accentBorder};display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
        .pd3-col-title{font-size:1.1rem;font-weight:700;color:#131313;margin-bottom:0.75rem;font-family:'Space Grotesk',sans-serif}
        .pd3-col-text{font-size:0.92rem;color:#4b5563;line-height:1.9}
        @media(max-width:720px){.pd3-two-col{grid-template-columns:1fr}}

        /* TECH */
        .pd3-tech-card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:2.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.04);opacity:0;transform:translateY(28px);transition:opacity 0.65s,transform 0.65s;margin-bottom:3rem}
        .pd3-tech-card.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-tech-chips{display:flex;flex-wrap:wrap;gap:0.6rem;margin-top:1.5rem}
        .pd3-chip{display:inline-flex;align-items:center;padding:0.45rem 1.1rem;background:${accentLight};color:${accent};border:1px solid ${accentBorder};border-radius:100px;font-size:0.8rem;font-weight:600;font-family:'Space Grotesk',sans-serif;letter-spacing:0.04em;opacity:0;transform:translateY(8px) scale(0.95);transition:opacity 0.4s ease,transform 0.4s ease,background 0.2s,color 0.2s;cursor:default}
        .pd3-chip.pd3-chip-vis{opacity:1;transform:translateY(0) scale(1)}
        .pd3-chip:hover{background:${accent};color:#fff;border-color:${accent};transform:translateY(-2px) scale(1.03)}

        /* RESULT */
        .pd3-result-card{background:linear-gradient(135deg,${accentLight} 0%,#fff 60%);border:2px solid ${accentBorder};border-radius:24px;padding:2.75rem;margin-bottom:3rem;opacity:0;transform:translateY(28px);transition:opacity 0.65s,transform 0.65s;box-shadow:0 4px 24px rgba(${accentRgb},0.08)}
        .pd3-result-card.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-result-icon{width:60px;height:60px;border-radius:18px;background:${accent};display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;box-shadow:0 8px 24px rgba(${accentRgb},0.35)}
        .pd3-result-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#131313;margin-bottom:1rem}
        .pd3-result-text{font-size:1rem;color:#374151;line-height:1.9}

        /* CTA BANNER */
        .pd3-cta{background:${heroGrad};border-radius:28px;padding:4rem 3rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:4rem;position:relative;overflow:hidden}
        .pd3-cta::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.06)}
        .pd3-cta::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.04)}
        .pd3-cta-title{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,3vw,2.2rem);color:#fff;font-weight:700;margin-bottom:0.5rem;position:relative;z-index:1}
        .pd3-cta-sub{font-size:0.95rem;color:rgba(255,255,255,0.65);position:relative;z-index:1;margin:0}
        .pd3-cta-btn{display:inline-flex;align-items:center;gap:0.5rem;background:#fff;color:#1a1a2e;padding:1rem 2.25rem;border-radius:100px;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;white-space:nowrap;flex-shrink:0;box-shadow:0 8px 28px rgba(0,0,0,0.25);position:relative;z-index:1}
        .pd3-cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,0.35)}

        /* NAV */
        .pd3-nav{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:3rem;opacity:0;transform:translateY(20px);transition:opacity 0.6s,transform 0.6s}
        .pd3-nav.pd3-vis{opacity:1;transform:translateY(0)}
        .pd3-nav-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;text-decoration:none;color:inherit;transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;display:flex;flex-direction:column;gap:0.35rem;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
        .pd3-nav-card:hover{border-color:${accent};box-shadow:0 6px 28px rgba(0,0,0,0.08);transform:translateY(-2px)}
        .pd3-nav-prev{align-items:flex-start}
        .pd3-nav-next{align-items:flex-end;background:linear-gradient(135deg,#ec4899,#f43f5e);border:none;box-shadow:0 4px 20px rgba(236,72,153,0.35)}
        .pd3-nav-next:hover{border-color:transparent;box-shadow:0 8px 32px rgba(236,72,153,0.5);transform:translateY(-2px)}
        .pd3-nav-next .pd3-nav-label{color:rgba(255,255,255,0.85)}
        .pd3-nav-next .pd3-nav-title{color:black}
        .pd3-nav-label{font-size:0.68rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accent}}
        .pd3-nav-title{font-size:0.92rem;font-weight:600;color:#1a1a2e;line-height:1.4}
        @media(max-width:560px){.pd3-nav{grid-template-columns:1fr}}

        .pd3-back-link{display:inline-flex;align-items:center;gap:0.4rem;background:#1a1a2e;color:#fff;padding:0.8rem 1.75rem;border-radius:100px;font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;transition:opacity 0.2s}
        .pd3-back-link:hover{opacity:0.8}

        @media(max-width:640px){
          .pd3-hero-inner{padding:1.5rem 1.25rem 4rem}
          .pd3-main{padding:3rem 1.25rem 4rem}
          .pd3-cta{padding:2.5rem 1.5rem}
          .pd3-overview-card,.pd3-col-card,.pd3-tech-card,.pd3-result-card{padding:1.75rem}
        }
      `}</style>

      <div className="pd3-page">
        <SEO
          title={`${project.title} — ${ex.category || 'Portfolio'} | Nikhil Sharma`}
          description={ex.overview ? ex.overview.slice(0,155) : `${project.title} — built by Nikhil Sharma, Full Stack Developer Jaipur.`}
          keywords={`${project.title},${ex.category||''},${(tech).slice(0,4).join(',')},Nikhil Sharma Jaipur`}
          ogType="article"
        />

        {/* ══ HERO ══ */}
        <div className="pd3-hero">
          <div className="pd3-hero-bg" />
          {imgSrc && <div className="pd3-hero-img-bg" style={{ backgroundImage:`url(${imgSrc})` }} />}
          <div className="pd3-hero-grid" />
          <div className="pd3-hero-glow" />
          <div className="pd3-hero-inner">
            <Link href="/portfolio" className="pd3-back-chip">← All Projects</Link>
            <div className="pd3-category-badge">
              <div className="pd3-badge-dot" />
              <span className="pd3-badge-text">{ex.category || project.short_description || 'Web Development'}</span>
            </div>
            <h1 className="pd3-hero-title">{ex.client || project.title}</h1>
            {ex.tagline && <p className="pd3-hero-tagline">{ex.tagline}</p>}
            <div className="pd3-hero-actions">
              {project.website_link && (
                <a href={project.website_link} target="_blank" rel="noopener noreferrer" className="pd3-btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  Visit Live Website
                </a>
              )}
              <Link href="/contact" className="pd3-btn-ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Hire Me for a Similar Project
              </Link>
            </div>
          </div>
          <div className="pd3-hero-scroll">
            <div className="pd3-scroll-line" />
            <span>Scroll</span>
          </div>
        </div>

        {/* ══ IMAGE SLIDER ══ */}
        {imgSrc && (
          <div className="pd3-slider-section">
            <div className="pd3-slider-container">
              <div className="pd3-slider-header">
                <p className="pd3-slider-tag">Live Preview</p>
                <h2 className="pd3-slider-headline">The {project.title} Experience</h2>
              </div>
              <ImageSlider imgSrc={imgSrc} websiteUrl={project.website_link} />
            </div>
          </div>
        )}

        {/* ══ MAIN CONTENT ══ */}
        <div className="pd3-main">

          {/* Meta Bar */}
          <div className="pd3-meta-bar">
            <div className="pd3-meta-item">
              <span className="pd3-meta-label">Client</span>
              <span className="pd3-meta-value">{ex.client || project.clint_name || project.title}</span>
            </div>
            <div className="pd3-meta-item">
              <span className="pd3-meta-label">Category</span>
              <span className="pd3-meta-value">{ex.category || project.short_description || 'Web Development'}</span>
            </div>
            <div className="pd3-meta-item">
              <span className="pd3-meta-label">Year</span>
              <span className="pd3-meta-value">{ex.year || '2023'}</span>
            </div>
            <div className="pd3-meta-item">
              <span className="pd3-meta-label">Live Website</span>
              <span className="pd3-meta-value">
                {project.website_link
                  ? <a href={project.website_link} target="_blank" rel="noopener noreferrer">Visit Site →</a>
                  : '—'}
              </span>
            </div>
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className={`pd3-stats-grid${statsVis ? ' pd3-vis' : ''}`} ref={statsRef}>
              {stats.map((s, i) => <StatItem key={i} stat={s} isVisible={statsVis} />)}
            </div>
          )}

          {/* Overview */}
          {ex.overview && (
            <div className={`pd3-section${overVis ? ' pd3-vis' : ''}`} ref={overRef}>
              <div className="pd3-section-eyebrow"><div className="pd3-section-dot"/><span className="pd3-section-tag">Project Overview</span><div className="pd3-section-rule"/></div>
              <div className="pd3-overview-card">
                <h2 className="pd3-section-title">About This Project</h2>
                <p className="pd3-overview-text">{ex.overview}</p>
              </div>
            </div>
          )}

          {/* Challenge & Approach */}
          {(ex.challenge || ex.approach) && (
            <div>
              <div style={{marginBottom:'1.25rem'}} className={`pd3-section${twoVis ? ' pd3-vis' : ''}`} ref={twoRef}>
                <div className="pd3-section-eyebrow"><div className="pd3-section-dot"/><span className="pd3-section-tag">Process</span><div className="pd3-section-rule"/></div>
              </div>
              <div className={`pd3-two-col${twoVis ? ' pd3-vis' : ''}`}>
                {ex.challenge && (
                  <div className="pd3-col-card">
                    <div className="pd3-col-icon-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <h3 className="pd3-col-title">The Challenge</h3>
                    <p className="pd3-col-text">{ex.challenge}</p>
                  </div>
                )}
                {ex.approach && (
                  <div className="pd3-col-card">
                    <div className="pd3-col-icon-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <h3 className="pd3-col-title">Our Approach</h3>
                    <p className="pd3-col-text">{ex.approach}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {tech.length > 0 && (
            <div className={`pd3-tech-card${techVis ? ' pd3-vis' : ''}`} ref={techRef}>
              <div className="pd3-section-eyebrow"><div className="pd3-section-dot"/><span className="pd3-section-tag">Tech Stack</span><div className="pd3-section-rule"/></div>
              <h3 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:'#131313',fontSize:'1.15rem',marginBottom:'0.25rem'}}>Technologies Used</h3>
              <p style={{fontSize:'0.85rem',color:'#9ca3af',marginBottom:0}}>Hover a chip to highlight</p>
              <div className="pd3-tech-chips">
                {tech.map((t, i) => (
                  <span key={t} className={`pd3-chip${techVis ? ' pd3-chip-vis' : ''}`} style={{ transitionDelay:`${i*0.06}s` }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {ex.result && (
            <div className={`pd3-result-card${resultVis ? ' pd3-vis' : ''}`} ref={resultRef}>
              <div className="pd3-result-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="28" height="28"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <div className="pd3-section-eyebrow"><div className="pd3-section-dot"/><span className="pd3-section-tag">Results & Impact</span><div className="pd3-section-rule"/></div>
              <h3 className="pd3-result-title">What We Achieved</h3>
              <p className="pd3-result-text">{ex.result}</p>
            </div>
          )}

          {/* CTA Banner */}
          {project.website_link && (
            <div className="pd3-cta">
              <div>
                <h3 className="pd3-cta-title">See It Live in Action</h3>
                <p className="pd3-cta-sub">Explore the full {project.title} platform right now →</p>
              </div>
              <a href={project.website_link} target="_blank" rel="noopener noreferrer" className="pd3-cta-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open Website
              </a>
            </div>
          )}

          {/* Prev / Next */}
          <div className={`pd3-nav${navVis ? ' pd3-vis' : ''}`} ref={navRef}>
            <div>{prevItem ? <Link href={`/portfolio/${prevItem.slug}`} className="pd3-nav-card pd3-nav-prev"><span className="pd3-nav-label">← Previous</span><span className="pd3-nav-title">{prevItem.title}</span></Link> : <div/>}</div>
            <div>{nextItem ? <Link href={`/portfolio/${nextItem.slug}`} className="pd3-nav-card pd3-nav-next"><span className="pd3-nav-label">Next →</span><span className="pd3-nav-title">{nextItem.title}</span></Link> : <div/>}</div>
          </div>

          <Link href="/portfolio" className="pd3-back-link">← Back to All Projects</Link>

        </div>
      </div>
    </>
  );
}
