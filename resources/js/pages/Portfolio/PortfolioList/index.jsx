import { useEffect, useRef, useState } from 'react';

export default function PortfolioListPage({ items: dbItems }) {
  const [projects, setProjects] = useState(dbItems || []);
  const [loading, setLoading] = useState(!dbItems || dbItems.length === 0);

  useEffect(() => {
    if (!dbItems || dbItems.length === 0) {
      fetch('/api/portfolio')
        .then(res => res.json())
        .then(data => { setProjects(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, []);

  const navigate  = (path) => { window.location.href = path; };
  const headerRef = useRef(null);
  const gridRef   = useRef(null);

  /* ── Scroll-in animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('pl-visible');
        });
      },
      { threshold: 0.12 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    gridRef.current?.querySelectorAll('.pl-item')?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projects]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');

        .pl-page {
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          margin: -2rem -2rem 0;
          padding: 0;
        }

        .pl-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem);
        }

        .pl-header {
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1),
                      transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }
        .pl-header.pl-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pl-stroke-label {
          display: block;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.8rem);
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px #9ca3af;
          text-stroke: 1.5px #9ca3af;
          line-height: 1.15;
          letter-spacing: 0.01em;
          margin-bottom: 0.1rem;
        }

        .pl-big-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.6rem, 6.5vw, 5.5rem);
          font-weight: 700;
          color: #131313;
          text-transform: uppercase;
          line-height: 1.05;
          letter-spacing: -0.015em;
          margin: 0;
        }

        .pl-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        @media (max-width: 900px) {
          .pl-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .pl-grid { grid-template-columns: 1fr; }
          .pl-big-title { font-size: 2.2rem; }
        }

        .pl-item {
          cursor: pointer;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
                      transform 0.55s cubic-bezier(0.4,0,0.2,1);
        }
        .pl-item.pl-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .pl-item:focus-visible {
          outline: 2px solid #131313;
          outline-offset: 3px;
        }

        .pl-img-wrap {
          position: relative;
          overflow: hidden;
          background: #d1d5db;
          clip-path: inset(0px);
          transition: clip-path 0.65s cubic-bezier(0.4,0,0.2,1);
        }
        .pl-item:hover .pl-img-wrap {
          clip-path: inset(10px);
        }

        .pl-img-wrap {
          position: relative;
          overflow: hidden;
          height: 280px;
        }
        .pl-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: unset;
          transform: translateY(0);
          transition: transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pl-item:hover .pl-img {
          transform: translateY(calc(-100% + 280px));
        }

        @media (max-width: 560px) {
          .pl-img-wrap { height: 220px; }
          .pl-item:hover .pl-img { transform: translateY(calc(-100% + 220px)); }
        }

        .pl-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(248,250,251,0.95) 0%,
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.45s ease;
          display: flex;
          align-items: flex-end;
          padding: 1.25rem 1.5rem;
        }
        .pl-item:hover .pl-overlay { opacity: 1; }

        .pl-overlay-content {
          transform: translateY(8px);
          transition: transform 0.45s ease;
        }
        .pl-item:hover .pl-overlay-content { transform: translateY(0); }

        .pl-overlay-cat {
          font-size: 0.7rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.15rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
        }
        .pl-overlay-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #131313;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
        }
      `}</style>

      <div className="pl-page">
        <div className="pl-inner">

          {/* ── Header ── */}
          <div className="pl-header" ref={headerRef}>
            <span className="pl-stroke-label">Portfolio</span>
            <h2 className="pl-big-title">
              BLENDING INNOVATIVE<br />
              DESIGN WITH<br />
              FUNCTIONALITY
            </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
              Loading portfolio...
            </div>
          )}

          {/* Empty */}
          {!loading && projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
              No portfolio items yet.
            </div>
          )}

          {/* ── Grid ── */}
          {!loading && projects.length > 0 && (
            <div className="pl-grid" ref={gridRef}>
              {projects.map((project, i) => (
                <a
                  key={project.id}
                  href={project.website_link || '#'}
                  target={project.website_link ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="pl-item"
                  style={{ transitionDelay: `${i * 0.07}s`, textDecoration: 'none', display: 'block' }}
                  aria-label={`Visit ${project.title}`}
                >
                  <div className="pl-img-wrap">
                    <img
                      src={
                        project.image
                          ? (project.image.startsWith('http') ? project.image : `/uploads/portfolio/${project.image}`)
                          : (project.image_url || 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg')
                      }
                      alt={project.title}
                      className="pl-img"
                      loading="lazy"
                      onError={e => { 
                        // Try images folder as fallback
                        if (!e.target.src.includes('/images/portfolio/')) {
                          e.target.src = `/images/portfolio/${project.image}`;
                        } else {
                          e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg';
                        }
                      }}
                    />
                    <div className="pl-overlay">
                      <div className="pl-overlay-content">
                        <p className="pl-overlay-cat">{project.short_description || project.category}</p>
                        <h4 className="pl-overlay-title">{project.title}</h4>
                        {project.website_link && <span style={{ fontSize: '0.75rem', color: '#0A3981', fontWeight: 700, marginTop: '0.3rem', display: 'block' }}>Visit Website →</span>}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
