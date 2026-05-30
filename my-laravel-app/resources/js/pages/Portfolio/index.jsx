import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import SEO from '../../components/SEO';
import { ShimmerPortfolioCard } from '../../components/ShimmerLoader';

export default function PortfolioPage({ items: dbItems }) {
  const [portfolios, setPortfolios] = useState(dbItems || []);
  const [loading, setLoading] = useState(!dbItems || dbItems.length === 0);

  useEffect(() => {
    // Sirf tab fetch karo jab Inertia se data nahi aaya
    if (!dbItems || dbItems.length === 0) {
      fetch('/api/portfolio')
        .then(res => res.json())
        .then(data => {
          setPortfolios(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);
  /* ── Intersection Observer for scroll-in animations ── */
  const headerRef = useRef(null);
  const gridRef   = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('port-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    const items = gridRef.current?.querySelectorAll('.port-item');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [portfolios]);

  return (
    <div className="portfolio-page-wrapper">
      <SEO
        title="Portfolio | Nikhil Sharma - Web & App Development Projects"
        description="Explore Nikhil Sharma's portfolio of web development, app development, and UI/UX design projects for clients across India and the Middle East."
        keywords="Web Development Portfolio, React Projects, Laravel Portfolio, UI UX Design Work, Nikhil Sharma Projects"
      />
      <section className="port-section">

        {/* ── Header block: "Portfolio" stroke + big heading stacked ── */}
        <div className="port-header" ref={headerRef}>
          {/* "Portfolio" — outline/stroke gray text, top */}
          <span className="port-stroke-label">Portfolio</span>

          {/* Big bold uppercase heading below */}
          <h1 className="port-big-title">
            BLENDING INNOVATIVE<br />
            DESIGN WITH<br />
            FUNCTIONALITY
          </h1>

        </div>

        {/* Loading shimmer state */}
        {loading && (
          <div className="port-grid" style={{ opacity: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerPortfolioCard key={i} />
            ))}
          </div>
        )}

        {/* ── Portfolio Grid ── */}
        {!loading && (
          <div className="port-grid" ref={gridRef}>
            {portfolios.map((project, i) => (
              <a
                key={project.id}
                href={`/portfolio/${project.slug || project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="port-item"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="port-img-wrap">
                    <img
                      src={
                        project.image
                          ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`)
                          : (project.image_url || 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg')
                      }
                      alt={project.title}
                      className="port-img"
                      loading="lazy"
                      onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg'; }}
                    />
                    <div className="port-overlay">
                      <div className="port-overlay-content">
                        {project.short_description && (
                          <p className="port-overlay-cat">{project.short_description.slice(0, 80)}</p>
                        )}
                        <span className="port-link">View Details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');

        .portfolio-page-wrapper {
          background-color: #f8fafb;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
        }

        .port-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2rem);
        }

        /* ── Header block ── */
        .port-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .port-header.port-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .port-stroke-label {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: transparent;
          -webkit-text-stroke: 1.5px #9ca3af;
          text-stroke: 1.5px #9ca3af;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .port-big-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.2rem, 5.5vw, 4.5rem);
          font-weight: 900;
          color: #131313;
          text-transform: uppercase;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .port-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .port-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .port-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .port-item {
          cursor: pointer;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .port-item.port-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .port-img-wrap {
          position: relative;
          overflow: hidden;
          height: 280px;
          background: #e5e7eb;
        }

        .port-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: unset;
          transform: translateY(0);
          transition: transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .port-item:hover .port-img {
          transform: translateY(calc(-100% + 280px));
        }

        .port-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(248, 250, 251, 0.95) 0%,
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }

        .port-item:hover .port-overlay {
          opacity: 1;
        }

        .port-overlay-content {
          transform: translateY(8px);
          transition: transform 0.5s ease;
        }

        .port-item:hover .port-overlay-content {
          transform: translateY(0);
        }

        .port-overlay-cat {
          font-size: 0.72rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
        }

        .port-overlay-title {
          font-size: 1rem;
          font-weight: 600;
          color: #131313;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
        }

        .port-overlay-type {
          margin: 0.35rem 0 0;
          color: #dbeafe;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .port-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.95);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          z-index: 2;
        }

        .port-link {
          display: inline-flex;
          align-items: center;
          margin-top: 0.75rem;
          font-size: 0.82rem;
          color: #93c5fd;
          text-decoration: underline;
          font-weight: 700;
        }

        @media (max-width: 639px) {
          .port-big-title {
            font-size: 2rem;
          }
          .port-img-wrap {
            height: 220px;
          }
          .port-item:hover .port-img {
            transform: translateY(calc(-100% + 220px));
          }
        }
      `}</style>
    </div>
  );
}
