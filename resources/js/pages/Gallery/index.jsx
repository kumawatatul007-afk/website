import { useEffect, useRef, useState } from 'react';
import SEO from '../../components/SEO';

export default function GalleryPage({ gallery: dbGallery }) {
  const [gallery, setGallery] = useState(dbGallery || []);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

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
          <div className="gallery-header-accent">
            <div className="accent-line"></div>
            <span className="accent-label">Certifications</span>
          </div>
          <h1 className="gallery-big-title">
            Professional <span className="gradient-text">Certificates</span>
          </h1>
          <p className="gallery-subtitle">
            A showcase of my achievements and professional credentials
          </p>
        </div>

        {gallery.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <p>No certificates available yet.</p>
          </div>
        )}

        {gallery.length > 0 && (
          <div className="gallery-grid" ref={gridRef}>
            {gallery.map((item, i) => (
              <div
                key={item.id}
                className="gallery-item"
                style={{ transitionDelay: `${i * 0.08}s` }}
                onClick={() => setSelectedCertificate(item)}
              >
                <div className="certificate-card">
                  <div className="card-glow"></div>
                  <div className="card-content">
                    <div className="certificate-badge">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#gold-gradient)"/>
                        <defs>
                          <linearGradient id="gold-gradient" x1="2" y1="2" x2="22" y2="22">
                            <stop offset="0%" stopColor="#F59E0B"/>
                            <stop offset="100%" stopColor="#D97706"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="certificate-image-container">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/600x400?text=Certificate'}
                        alt={`Certificate ${i + 1}`}
                        className="certificate-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400?text=Certificate';
                        }}
                      />
                      <div className="certificate-overlay">
                        <div className="view-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View Certificate
                        </div>
                      </div>
                    </div>
                    <div className="certificate-info">
                      <h3 className="certificate-title">Certificate {i + 1}</h3>
                      <div className="certificate-meta">
                        <span className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedCertificate && (
        <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCertificate(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <img
              src={selectedCertificate.image_url}
              alt="Certificate"
              className="modal-image"
            />
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .gallery-page-wrapper {
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F4FF 100%);
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
        }

        .gallery-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(3rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem);
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gallery-header.gallery-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-header-accent {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.5rem;
        }

        .accent-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #F59E0B 0%, #3B82F6 100%);
          border-radius: 2px;
        }

        .accent-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .gallery-big-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          color: #1E293B;
          line-height: 1.1;
          margin: 0 0 1rem 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gallery-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #64748B;
          margin: 0;
          font-weight: 400;
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: #9CA3AF;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .gallery-item {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .gallery-item.gallery-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .certificate-card {
          position: relative;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(229, 231, 235, 0.8);
        }

        .certificate-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #F59E0B 0%, #3B82F6 50%, #F59E0B 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .certificate-card:hover .card-glow {
          opacity: 1;
        }

        .card-content {
          padding: 1.5rem;
        }

        .certificate-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
          z-index: 10;
        }

        .certificate-image-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .certificate-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .certificate-card:hover .certificate-img {
          transform: scale(1.06);
        }

        .certificate-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .certificate-card:hover .certificate-overlay {
          opacity: 1;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #1E293B;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          transform: translateY(10px);
          transition: transform 0.4s ease;
        }

        .certificate-card:hover .view-btn {
          transform: translateY(0);
        }

        .certificate-info {
          padding: 0 0.25rem;
        }

        .certificate-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 0.75rem 0;
        }

        .certificate-meta {
          display: flex;
          gap: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
          font-size: 0.9rem;
        }

        /* Modal */
        .certificate-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 48px;
          height: 48px;
          background: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .close-btn:hover {
          transform: rotate(90deg);
          background: #F1F5F9;
        }

        .modal-image {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 639px) {
          .gallery-big-title {
            font-size: 2.2rem;
          }
          .certificate-img {
            height: 200px;
          }
          .certificate-modal {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
