import { useEffect, useRef, useState } from 'react';
import SEO from '../../components/SEO';

export default function GalleryPage({ gallery: dbGallery }) {
  const [gallery, setGallery] = useState(dbGallery || []);

  useEffect(() => {
    if (dbGallery && dbGallery.length > 0) {
      setGallery(dbGallery);
    }
  }, [dbGallery]);

  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gallery-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    const items = gridRef.current?.querySelectorAll('.gallery-item');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [gallery]);

  return (
    <div className="gallery-page-wrapper">
      <SEO />
      <section className="gallery-section">
        <div className="gallery-header" ref={headerRef}>
          <span className="gallery-stroke-label">Gallery</span>
          <h1 className="gallery-big-title">
            A GLIMPSE OF<br />
            MY WORK &<br />
            CREATIVE JOURNEY
          </h1>
        </div>

        {gallery.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <p>No gallery items available yet.</p>
          </div>
        )}

        {gallery.length > 0 && (
          <div className="gallery-grid" ref={gridRef}>
            {gallery.map((item, i) => (
              <div
                key={item.id}
                className="gallery-item"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <img
                  src={item.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                  alt={`Gallery Item ${i + 1}`}
                  className="gallery-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');

        .gallery-page-wrapper {
          background-color: #f8fafb;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
        }

        .gallery-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2rem);
        }

        .gallery-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gallery-header.gallery-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-stroke-label {
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

        .gallery-big-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.2rem, 5.5vw, 4.5rem);
          font-weight: 900;
          color: #131313;
          text-transform: uppercase;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s ease;
        }

        .gallery-item.gallery-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-item:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .gallery-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
          transform: scale(1);
          transition: transform 0.6s ease;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.08);
        }

        @media (max-width: 639px) {
          .gallery-big-title {
            font-size: 2rem;
          }
          .gallery-img {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
