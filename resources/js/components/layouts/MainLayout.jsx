import { useState, useEffect, useRef } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import SEO from '../SEO'

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const [navProgress, setNavProgress] = useState(0)
  const [navActive, setNavActive] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const progressTimer = useRef(null)
  const { props } = usePage()

  // ── Inertia page transition ───────────────────────────────────────────────
  useEffect(() => {
    const offStart = router.on('start', () => {
      setNavActive(true)
      setNavProgress(0)
      setPageReady(false)
      let p = 0
      clearInterval(progressTimer.current)
      progressTimer.current = setInterval(() => {
        p = Math.min(p + Math.random() * 12, 85)
        setNavProgress(p)
      }, 120)
    })
    const offFinish = router.on('finish', () => {
      clearInterval(progressTimer.current)
      setNavProgress(100)
      setTimeout(() => {
        setNavActive(false)
        setNavProgress(0)
        setPageReady(true)
      }, 350)
    })
    return () => { offStart(); offFinish(); clearInterval(progressTimer.current) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Back to top button scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollY / height) * 100
      setScrollProgress(progress)
      setShowBackToTop(scrollY > 300)
    }
    
    // Handle regular window scroll
    window.addEventListener('scroll', handleScroll)
    
    // Also handle Lenis smooth scroll events if available
    const lenisCheckInterval = setInterval(() => {
      if (window.lenis?.on) {
        window.lenis.on('scroll', handleScroll)
        clearInterval(lenisCheckInterval)
      }
    }, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(lenisCheckInterval)
      if (window.lenis?.off) {
        window.lenis.off('scroll', handleScroll)
      }
    }
  }, [])

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: false })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Settings from DB ──────────────────────────────────────────────────────
  const setting     = props.setting || {}
  const siteName    = setting.website_title || 'Nikhil Sharma'
  
  // Get logo URL from settings
  const getLogoUrl = () => {
    if (!setting.logo) return '/images/logo.png'
    if (setting.logo.startsWith('http') || setting.logo.startsWith('/')) {
      return setting.logo
    }
    return `/uploads/settings/${setting.logo}`
  }
  const logoUrl = getLogoUrl()
  const siteEmail   = setting.email   || 'technikhilsharma7@gmail.com'
  const sitePhone   = setting.phone || '+91 95299 21038'
  const siteAddress = setting.address || 'Nikhil Sharma, Jaipur, Rajasthan, India'

  // social_links is stored as JSON: { facebook, twitter, linkedin, github, ... }
  const rawSocial   = setting.social_links
  const socialLinks = typeof rawSocial === 'string'
    ? (() => { try { return JSON.parse(rawSocial) } catch { return {} } })()
    : (rawSocial || {})
  const fbUrl       = socialLinks.facebook  || 'https://www.facebook.com/nikhilsharma7developer'
  const twUrl       = socialLinks.twitter   || 'https://x.com/NikhilSharma881'
  const liUrl       = socialLinks.linkedin  || 'https://www.linkedin.com/in/nikhil-sharma-jaipur'
  const ghUrl       = socialLinks.github    || 'https://github.com/technikhilsharma7'
  const waUrl       = socialLinks.whatsapp  || 'https://wa.me/919529921038'
  const upUrl       = socialLinks.upwork     || 'https://www.upwork.com/freelancers/nikhilsharma'
  const fvUrl       = socialLinks.fiverr     || 'https://www.fiverr.com/technikhil7/'
  const igUrl       = socialLinks.instagram  || 'https://www.instagram.com/nikhil_sharma__7'
  const ptUrl       = socialLinks.pinterest  || 'https://in.pinterest.com/nikhilsharma881/'

  // Custom cursor
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const rafRef  = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const { url } = usePage()
  const currentPath = url.split('?')[0]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: "'Space Grotesk', sans-serif" }}>
      <SEO />


      {/* Top navigation progress bar */}
      {navActive && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          zIndex: 99999, background: 'rgba(255,255,255,0.1)',
        }}>
          <div style={{
            height: '100%',
            width: `${navProgress}%`,
            background: 'linear-gradient(90deg, #1e3a8a, #60a5fa)',
            transition: navProgress === 100 ? 'width 0.25s ease' : 'width 0.12s linear',
            boxShadow: '0 0 8px #60a5fa88',
          }} />
        </div>
      )}

      {/* Custom Cursor */}
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />

      {/* Back to top button with scroll progress */}
      {showBackToTop && (
        <button className="back-to-top-btn" onClick={scrollToTop}>
          <svg viewBox="0 0 100 100" className="progress-ring">
            <circle cx="50" cy="50" r="45" className="progress-ring-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-ring-fill"
              style={{ strokeDashoffset: `calc(283 - (283 * ${scrollProgress}) / 100)` }}
            />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');


        * { cursor: none !important; }

        .cursor-dot {
          position: fixed; top: 0; left: 0;
          width: 6px; height: 6px;
          background: #ffffff; border-radius: 50%;
          pointer-events: none; z-index: 99999;
          margin-left: -3px; margin-top: -3px;
          will-change: transform;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0;
          width: 36px; height: 36px;
          border: 1.5px solid #ffffff; border-radius: 50%;
          pointer-events: none; z-index: 99998;
          margin-left: -18px; margin-top: -18px;
          will-change: transform; background: transparent;
          mix-blend-mode: difference;
        }

        .mora-nav {
          background: #f5f7f8;
          border-bottom: 1px solid #e8ecf0;
          position: sticky; top: 0; z-index: 200;
          box-shadow: 0 1px 8px rgba(30,58,138,0.06);
        }
        .mora-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 2.5rem;
          height: 80px; display: flex; align-items: center;
          justify-content: space-between; gap: 1rem;
        }
        .mora-brand {
          display: flex; align-items: center;
          text-decoration: none; user-select: none; flex-shrink: 0;
          padding: 5px 10px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .mora-logo-svg {
          height: 44px; width: auto;
        }
        .mora-logo-img {
          height: 48px; width: auto; max-width: 160px;
          object-fit: contain;
          filter: brightness(0);
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }
        .mora-brand:hover .mora-logo-img {
          transform: scale(1.05);
          opacity: 0.85;
          filter: brightness(0);
        }
        /* Footer logo — force white */
        .mora-footer-logo {
          height: 40px; width: auto; max-width: 140px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }
        .mora-footer-logo:hover { opacity: 1; }        .mora-links {
          display: flex; align-items: center; gap: 0;
          flex: 1; justify-content: center;
        }
        .mora-link {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 0.82rem;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: #374151; text-decoration: none;
          padding: 0.5rem 1.1rem; border-radius: 0;
          transition: color 0.18s;
        }
        .mora-link:hover, .mora-link.active { color: #1e3a8a; }

        .mora-dropdown-wrap { position: relative; }
        .mora-dropdown-trigger {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 0.82rem;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: #374151; background: none; border: none;
          padding: 0.5rem 1.1rem; border-radius: 0; cursor: pointer;
          display: inline-flex; align-items: center; gap: 4px;
          transition: color 0.18s; text-decoration: none;
        }
        .mora-dropdown-trigger:hover,
        .mora-dropdown-trigger.active { color: #1e3a8a; }
        .mora-chevron { display: inline-block; transition: transform 0.22s ease; line-height: 1; }
        .mora-chevron.up { transform: rotate(180deg); }

        .mora-dropdown-panel {
          position: absolute; top: calc(100% + 14px); left: 50%;
          min-width: 210px; background: #f1f5f9;
          box-shadow: 0 8px 28px rgba(30,58,138,0.13);
          overflow: hidden; opacity: 0; pointer-events: none;
          transform: translateX(-50%) translateY(-8px) scaleY(0.92);
          transform-origin: top center;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 300;
        }
        .mora-dropdown-panel.open {
          opacity: 1; pointer-events: auto;
          transform: translateX(-50%) translateY(0) scaleY(1);
        }
        .mora-dropdown-item {
          display: block; font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 0.82rem;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #1e293b; text-decoration: none;
          padding: 1rem 1.5rem; transition: background 0.15s, color 0.15s;
        }
        .mora-dropdown-item:hover { background: #e2e8f0; color: #1e3a8a; }

        .mora-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .mora-hire-btn {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 0.82rem;
          letter-spacing: 1.8px; text-transform: uppercase;
          background: #1e3a8a; color: #fff; border: 2px solid #1e3a8a;
          padding: 0.8rem 1.8rem; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 0; text-decoration: none;
          position: relative;
          box-shadow: none;
          transition: background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .mora-hire-btn .hire-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }
        .mora-hire-btn:hover {
          background: #fff;
          color: #1a1a1a;
          box-shadow: 6px 6px 0px 0px #1e3a8a;
          transform: translate(-3px, -3px);
        }
        .mora-hire-btn:hover .hire-arrow {
          transform: translateX(4px);
        }

        .mora-hamburger {
          display: none; background: none; border: none;
          cursor: pointer; padding: 4px; color: #1e3a8a;
        }
        .mora-mobile-menu {
          background: #fff; border-top: 1px solid #e2e8f0;
          padding: 1rem 2rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .mora-mobile-link {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 0.9rem;
          letter-spacing: 1px; text-transform: uppercase;
          color: #334155; text-decoration: none;
          padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
          transition: color 0.15s;
        }
        .mora-mobile-link:hover, .mora-mobile-link.active { color: #1e3a8a; }
        .mora-mobile-sub {
          padding-left: 1rem; display: flex; flex-direction: column; gap: 0;
          overflow: hidden; animation: mobileSlide 0.2s ease forwards;
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mora-mobile-sub-link {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 0.82rem;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #475569; text-decoration: none;
          padding: 0.45rem 0; border-bottom: 1px solid #f8fafc;
          transition: color 0.15s;
        }
        .mora-mobile-sub-link:hover { color: #1e3a8a; }
        .mora-mobile-blog-trigger {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 0.9rem;
          letter-spacing: 1px; text-transform: uppercase;
          color: #334155; background: none; border: none;
          border-bottom: 1px solid #f1f5f9;
          padding: 0.5rem 0; cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between; width: 100%;
          transition: color 0.15s;
        }
        .mora-mobile-blog-trigger:hover { color: #1e3a8a; }
        .mora-mobile-footer {
          display: flex; align-items: center;
          justify-content: flex-end;
          padding-top: 0.75rem; margin-top: 0.25rem;
        }

        @media (max-width: 640px) {
          .mora-links    { display: none; }
          .mora-right    { display: none; }
          .mora-hamburger { display: block; }
          .mora-nav-inner { padding: 0 1.25rem; }
        }

        /* FOOTER */
        .mora-footer {
          background: #0f0f0f;
          border-top: 1px solid #1e1e1e;
          padding: 0;
          margin-top: 3rem;
        }
        .mora-footer-main {
          max-width: 1200px; margin: 0 auto;
          padding: 1.25rem 2rem 1rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        /* Brand column */
        .mora-footer-brand { display: flex; flex-direction: column; gap: 0.4rem; }
        .mora-footer-logo {
          height: 40px; width: auto; max-width: 140px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .mora-footer-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem; color: #6b7280;
          line-height: 1.5; font-weight: 400;
          max-width: 220px;
        }
        .mora-footer-contact-list {
          display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.05rem;
        }
        .mora-footer-contact-item {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.68rem; color: #6b7280; font-weight: 400;
          text-decoration: none; transition: color 0.2s;
        }
        .mora-footer-contact-item:hover { color: #e5e7eb; }
        .mora-footer-contact-item svg { flex-shrink: 0; color: #6366f1; }
        /* Footer columns */
        .mora-footer-col { display: flex; flex-direction: column; gap: 0.3rem; }
        .mora-footer-col-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #ffffff; margin-bottom: 0.15rem;
        }
        .mora-footer-col-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem; color: #6b7280; font-weight: 400;
          text-decoration: none; transition: color 0.2s;
          display: flex; align-items: center; gap: 5px;
          line-height: 1.4;
        }
        .mora-footer-col-link:hover { color: #e5e7eb; }
        .mora-footer-col-link::before {
          content: ''; display: inline-block;
          width: 3px; height: 3px; border-radius: 50%;
          background: #6366f1; flex-shrink: 0;
          transition: transform 0.2s;
        }
        .mora-footer-col-link:hover::before { transform: scale(1.5); }
        /* Divider */
        .mora-footer-divider {
          border: none; border-top: 1px solid #1e1e1e; margin: 0;
        }
        /* Bottom bar */
        .mora-footer-bottom {
          max-width: 1200px; margin: 0 auto;
          padding: 0.6rem 2rem;
          display: flex; align-items: center;
          justify-content: space-between; gap: 1rem; flex-wrap: wrap;
        }
        .mora-footer-copy {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem; color: #4b5563; font-weight: 400;
        }
        .mora-footer-copy a { color: #6366f1; text-decoration: none; }
        .mora-footer-copy a:hover { text-decoration: underline; }
        .mora-footer-bottom-links {
          display: flex; align-items: center; gap: 1rem;
        }
        .mora-footer-bottom-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.63rem; color: #4b5563; font-weight: 500;
          text-decoration: none; letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .mora-footer-bottom-link:hover { color: #9ca3af; }
        .mora-footer-socials { display: flex; align-items: center; gap: 0.5rem; }
        .mora-social-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2.2rem; height: 2.2rem; border-radius: 6px;
          background: #1e1e1e; border: 1px solid #333;
          color: #9ca3af; text-decoration: none;
          transition: all 0.22s ease;
        }
        .mora-social-icon svg { width: 1rem; height: 1rem; fill: currentColor; }
        .mora-social-icon.fb:hover  { background: #1877f2; border-color: #1877f2; color: #fff; transform: translateY(-3px); }
        .mora-social-icon.tw:hover  { background: #000;    border-color: #555;    color: #fff; transform: translateY(-3px); }
        .mora-social-icon.pt:hover  { background: #e60023; border-color: #e60023; color: #fff; transform: translateY(-3px); }
        .mora-social-icon.ig:hover  { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); border-color: #e6683c; color: #fff; transform: translateY(-3px); }

        @media (max-width: 900px) {
          .mora-footer-main { grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        }
        @media (max-width: 640px) {
          .mora-footer-main { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.25rem 1.25rem 1rem; }
          .mora-footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.6rem 1.25rem; }
          .mora-footer-bottom-links { flex-wrap: wrap; gap: 0.75rem; }
        }

        /* Back to Top Button */
        .back-to-top-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s ease;
        }

        .back-to-top-btn:hover {
          transform: translateY(-3px);
        }

        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-ring-bg {
          fill: none;
          stroke: #e2e8f0;
          stroke-width: 3;
        }

        .progress-ring-fill {
          fill: none;
          stroke: #1e3a8a;
          stroke-width: 3;
          stroke-dasharray: 283;
          transition: stroke-dashoffset 0.1s linear;
        }

        .arrow-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          color: #1e3a8a;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="mora-nav">
        <div className="mora-nav-inner">

          {/* ── LOGO ── */}
        <Link href="/" className="mora-brand" aria-label={`${siteName} — Home`}>
          <img
            src={logoUrl}
            alt={`${siteName} Logo`}
            className="mora-logo-img"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/logo.png'; }}
          />
        </Link>

          <div className="mora-links">
            <Link href="/"        className={`mora-link${currentPath === '/' || currentPath === '/dashboard' ? ' active' : ''}`}>Home</Link>
            <Link href="/about"   className={`mora-link${currentPath === '/about'   ? ' active' : ''}`}>About</Link>
            <Link href="/services" className={`mora-link${currentPath === '/services' ? ' active' : ''}`}>Services</Link>

            {/* Blog link */}
            <Link href="/blog" className={`mora-link${currentPath.startsWith('/blog') ? ' active' : ''}`}>Blog</Link>

            {/* Portfolio link */}
            <Link href="/portfolio" className={`mora-link${currentPath.startsWith('/portfolio') ? ' active' : ''}`}>Portfolio</Link>

            {/* Gallery link */}
            <Link href="/gallery" className={`mora-link${currentPath === '/gallery' ? ' active' : ''}`}>Gallery</Link>

            <Link href="/contact" className={`mora-link${currentPath === '/contact' ? ' active' : ''}`}>Contact</Link>
          </div>

          <div className="mora-right">
            <Link href="/contact" className="mora-hire-btn">HIRE ME &nbsp;<span className="hire-arrow">›</span></Link>
          </div>

          {/* Mobile hamburger */}
          <button className="mora-hamburger" onClick={() => setMenuOpen((p) => !p)} aria-label="Toggle menu">
            {menuOpen ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mora-mobile-menu">
            <Link href="/"        className={`mora-mobile-link${currentPath === '/' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about"   className={`mora-mobile-link${currentPath === '/about' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/services" className={`mora-mobile-link${currentPath === '/services' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/blog"    className={`mora-mobile-link${currentPath.startsWith('/blog') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/portfolio" className={`mora-mobile-link${currentPath.startsWith('/portfolio') ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Portfolio</Link>
            <Link href="/gallery" className={`mora-mobile-link${currentPath === '/gallery' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Gallery</Link>
            <Link href="/contact" className={`mora-mobile-link${currentPath === '/contact' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>

            <div className="mora-mobile-footer">
              <Link href="/contact" className="mora-hire-btn" onClick={() => setMenuOpen(false)}>HIRE ME &nbsp;<span className="hire-arrow">›</span></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main style={{
        flex: 1, width: '100%',
        opacity: pageReady ? 1 : 0,
        transform: pageReady ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="mora-footer" aria-label="Site footer">

        {/* Main grid */}
        <div className="mora-footer-main">

          {/* Brand + contact */}
          <div className="mora-footer-brand">
            <Link href="/" aria-label={`${siteName} — Home`}>
              <img
                src={logoUrl}
                alt={`${siteName} — Full Stack Developer Jaipur`}
                className="mora-footer-logo"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/logo.png'; }}
              />
            </Link>
            <p className="mora-footer-tagline">
              Freelance Full Stack Developer based in Jaipur, India. Building fast, SEO-optimised websites and apps for businesses across India and the Middle East.
            </p>
            <div className="mora-footer-contact-list">
              <a href={`mailto:${siteEmail}`} className="mora-footer-contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {siteEmail}
              </a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mora-footer-contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {sitePhone}
              </a>
              <div className="mora-footer-contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {siteAddress}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="mora-footer-col" aria-label="Quick links">
            <p className="mora-footer-col-title">Quick Links</p>
            <Link href="/"          className="mora-footer-col-link">Home</Link>
            <Link href="/about"     className="mora-footer-col-link">About Me</Link>
            <Link href="/services"  className="mora-footer-col-link">Services</Link>
            <Link href="/portfolio" className="mora-footer-col-link">Portfolio</Link>
            <Link href="/gallery"   className="mora-footer-col-link">Gallery</Link>
            <Link href="/blog"      className="mora-footer-col-link">Blog</Link>
            <Link href="/contact"   className="mora-footer-col-link">Contact</Link>
          </nav>

          {/* Services */}
          <nav className="mora-footer-col" aria-label="Services">
            <p className="mora-footer-col-title">Services</p>
            <Link href="/services" className="mora-footer-col-link">Web Development</Link>
            <Link href="/services" className="mora-footer-col-link">App Development</Link>
            <Link href="/services" className="mora-footer-col-link">UI/UX Design</Link>
            <Link href="/services" className="mora-footer-col-link">PHP Laravel</Link>
            <Link href="/services" className="mora-footer-col-link">React.js</Link>
            <Link href="/services" className="mora-footer-col-link">Flutter Apps</Link>
          </nav>

          {/* Find Me */}
          <div className="mora-footer-col">
            <p className="mora-footer-col-title">Find Me On</p>
            <a href={upUrl} target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">Upwork</a>
            <a href={fvUrl} target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">Fiverr</a>
            <a href={liUrl} target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">LinkedIn</a>
            <a href={ghUrl} target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">GitHub</a>
          </div>

        </div>

        <hr className="mora-footer-divider" />

        {/* Bottom bar */}
        <div className="mora-footer-bottom">
          <p className="mora-footer-copy">
            © 2026 <a href="https://thenikhilsharma.in">Nikhil Sharma</a> | Freelancer Web Designer &amp; Software Developer. All Rights Reserved.
          </p>

          {/* Social Icons — Facebook, Twitter/X, Pinterest, Instagram */}
          <div className="mora-footer-socials">
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon fb" aria-label="Facebook">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            <a href={twUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon tw" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href={ptUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon pt" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon ig" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>

          <div className="mora-footer-bottom-links">
            <a href="/sitemap.xml"       className="mora-footer-bottom-link" target="_blank" rel="noopener noreferrer">Sitemap</a>
            <Link href="/privacy-policy"   className="mora-footer-bottom-link">Privacy Policy</Link>
            <Link href="/terms-of-service" className="mora-footer-bottom-link">Terms of Service</Link>
          </div>
        </div>

      </footer>
    </div>
  )
}
