import { useState, useEffect, useRef } from 'react'
import { Link, usePage } from '@inertiajs/react'
import SEO from '../SEO'

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { props } = usePage()

  // ── Settings from DB ──────────────────────────────────────────────────────
  const setting     = props.setting || {}
  const siteName    = setting.title || setting.website_title || 'Nikhil Sharma'
  const logoUrl     = setting.logo
    ? `/storage/${setting.logo}`
    : '/images/logo.png'
  const siteEmail   = setting.email   || 'technikhilsharma7@gmail.com'
  const sitePhone   = setting.phonenumber || setting.phone || '+91 9529921038'
  const siteAddress = setting.address || 'Jaipur, Rajasthan, India'

  // social_links is stored as JSON: { facebook, twitter, linkedin, github, ... }
  const rawSocial   = setting.social_links
  const socialLinks = typeof rawSocial === 'string'
    ? (() => { try { return JSON.parse(rawSocial) } catch { return {} } })()
    : (rawSocial || {})
  const fbUrl       = socialLinks.facebook  || 'https://www.facebook.com/nikhilsharma'
  const twUrl       = socialLinks.twitter   || 'https://twitter.com/nikhilsharma_in'
  const liUrl       = socialLinks.linkedin  || 'https://www.linkedin.com/in/nikhil-sharma-jaipur'
  const ghUrl       = socialLinks.github    || 'https://github.com/nikhilsharma'
  const waUrl       = socialLinks.whatsapp  || 'https://wa.me/919529921038'

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
      
      {/* Custom Cursor */}
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />

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
        .mora-footer-socials { display: flex; align-items: center; gap: 0.3rem; }
        .mora-social-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 1.6rem; height: 1.6rem; border-radius: 4px;
          background: #1a1a1a; border: 1px solid #2a2a2a;
          color: #6b7280; text-decoration: none;
          transition: all 0.2s ease;
        }
        .mora-social-icon svg { width: 0.65rem; height: 0.65rem; fill: currentColor; }
        .mora-social-icon:hover { background: #6366f1; border-color: #6366f1; color: #fff; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .mora-footer-main { grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        }
        @media (max-width: 640px) {
          .mora-footer-main { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.25rem 1.25rem 1rem; }
          .mora-footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.6rem 1.25rem; }
          .mora-footer-bottom-links { flex-wrap: wrap; gap: 0.75rem; }
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
            <Link href="/contact" className={`mora-mobile-link${currentPath === '/contact' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>

            <div className="mora-mobile-footer">
              <Link href="/contact" className="mora-hire-btn" onClick={() => setMenuOpen(false)}>HIRE ME &nbsp;<span className="hire-arrow">›</span></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main style={{ flex: 1, width: '100%' }}>
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
              <span className="mora-footer-contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {siteAddress}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="mora-footer-col" aria-label="Quick links">
            <p className="mora-footer-col-title">Quick Links</p>
            <Link href="/"          className="mora-footer-col-link">Home</Link>
            <Link href="/about"     className="mora-footer-col-link">About Me</Link>
            <Link href="/services"  className="mora-footer-col-link">Services</Link>
            <Link href="/portfolio" className="mora-footer-col-link">Portfolio</Link>
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
            <a href="https://www.upwork.com/freelancers/nikhilsharma"       target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">Upwork</a>
            <a href="https://clutch.co/profile/nikhil-sharma-developer"     target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">Clutch</a>
            <a href="https://www.linkedin.com/in/nikhil-sharma-jaipur"      target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">LinkedIn</a>
            <a href="https://github.com/nikhilsharma"                       target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">GitHub</a>
            <a href="https://www.goodfirms.co/company/nikhil-sharma"        target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">GoodFirms</a>
            <a href="https://www.justdial.com/nikhilsharma"                 target="_blank" rel="noopener noreferrer" className="mora-footer-col-link">Justdial</a>
          </div>

        </div>

        <hr className="mora-footer-divider" />

        {/* Bottom bar */}
        <div className="mora-footer-bottom">
          <p className="mora-footer-copy">
            © {new Date().getFullYear()} <a href="https://thenikhilsharma.in">{siteName}</a>. All Rights Reserved. | {siteAddress}
          </p>
          <div className="mora-footer-bottom-links">
            <a href="/sitemap.xml"       className="mora-footer-bottom-link" target="_blank" rel="noopener noreferrer">Sitemap</a>
            <Link href="/privacy-policy"   className="mora-footer-bottom-link">Privacy Policy</Link>
            <Link href="/terms-of-service" className="mora-footer-bottom-link">Terms of Service</Link>
          </div>
          <div className="mora-footer-socials">
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={twUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={liUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href={ghUrl} target="_blank" rel="noopener noreferrer" className="mora-social-icon" aria-label="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://dribbble.com/nikhilsharma" target="_blank" rel="noopener noreferrer" className="mora-social-icon" aria-label="Dribbble">
              <svg viewBox="0 0 24 24"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.176zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.477 0-.945.04-1.4.112zm13.44 9.483c-.453-.14-3.773-.993-7.76-.43 1.5 4.11 2.11 7.47 2.23 8.13 2.87-1.9 4.84-5.01 5.53-7.7z"/></svg>
            </a> 
          </div>
        </div>

      </footer>
    </div>
  )
}
