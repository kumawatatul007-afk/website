import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SEO from '../../../components/SEO';

export default function ProjectDetailPage({ id, item: dbItem, related: dbRelated }) {
  const pathId = id ? Number(id) : Number(window.location.pathname.split('/').pop());
  const navigate = (path) => { router.visit(path); };

  const [project, setProject] = useState(dbItem || null);
  const [prevItem, setPrevItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);
  const [loading, setLoading] = useState(!dbItem);

  const heroRef    = useRef(null);
  const contentRef = useRef(null);
  const nextRef    = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Sirf tab API call karo jab Inertia se data nahi aaya
    if (!dbItem) {
      setLoading(true);
      fetch(`/api/portfolio/${pathId}`)
        .then(res => res.json())
        .then(data => {
          setProject(data.item || data);
          setPrevItem(data.prev_item || null);
          setNextItem(data.next_item || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      // Inertia se data aaya, prev/next API se lo
      fetch(`/api/portfolio/${pathId}`)
        .then(res => res.json())
        .then(data => {
          setPrevItem(data.prev_item || null);
          setNextItem(data.next_item || null);
        })
        .catch(() => {});
    }
  }, [pathId]);

  /* scroll-in animation */
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('pd-visible'); }),
      { threshold: 0.08 }
    );
    [heroRef, contentRef, nextRef].forEach((r) => { if (r.current) observer.observe(r.current); });
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
        Project not found.{' '}
        <Link href="/portfolio" style={{ color: '#0A3981' }}>Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <>      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap');

        .pd-page {
          background: #f8fafb;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          margin: -2rem -2rem 0;
          padding: 0;
          color: #2d2d2d;
        }

        .pd-hero-outer { width: 100%; }

        .pd-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem);
        }

        h1, h2, h3, h4, h5, h6 { color: #131313; }

        .pd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
        }

        .pd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          padding: 0;
          transition: color 0.2s ease;
        }
        .pd-back-btn:hover { color: #131313; }

        .pd-breadcrumb-sep { color: #d1d5db; font-size: 0.75rem; }

        .pd-breadcrumb-current {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-hero-section {
          position: relative;
          background: linear-gradient(135deg, #dce8f5 0%, #e8f1f8 30%, #f0f6fb 60%, #f8fafb 100%);
          padding: 5rem 2rem 4rem;
          overflow: hidden;
        }

        .pd-hero-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,210,240,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        .pd-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .pd-hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #131313;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 0.85rem;
        }

        .pd-hero-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .pd-hero-tags a {
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pd-hero-tags a:hover { color: #0A3981; }
        .pd-hero-tags span { color: #9ca3af; }

        .pd-featured-image {
          margin-bottom: 3rem;
          display: flex;
          justify-content: center;
          padding: 2rem 0 3rem;
          margin-left: calc(-1 * clamp(4rem, 15vw, 12rem));
          margin-right: calc(-1 * clamp(4rem, 15vw, 12rem));
        }

        .pd-featured-image img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 16px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.13), 0 10px 28px rgba(0,0,0,0.08);
          transform: perspective(1400px) rotateX(5deg) rotateY(-3deg) rotateZ(1.2deg) scale(0.97);
        }

        .pd-info-row-custom {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-bottom: 3rem;
          border: 1px solid #e5e7eb;
          background: #f8fafb;
          margin-left: calc(-1 * clamp(4rem, 15vw, 12rem));
          margin-right: calc(-1 * clamp(4rem, 15vw, 12rem));
        }

        .pd-info-item {
          flex: 1;
          min-width: 160px;
          padding: 1.75rem 2rem;
          border-right: 1px solid #e5e7eb;
        }
        .pd-info-item:last-child { border-right: none; }

        .pd-info-item h4 {
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-info-item p {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.7;
          font-family: 'Space Grotesk', sans-serif;
        }

        @media (max-width: 768px) {
          .pd-info-row-custom { margin-left: 0; margin-right: 0; }
          .pd-info-item { border-right: none; border-bottom: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; }
          .pd-info-item:last-child { border-bottom: none; }
        }

        .pd-content-layout {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s 0.1s cubic-bezier(0.4,0,0.2,1),
                      transform 0.7s 0.1s cubic-bezier(0.4,0,0.2,1);
        }
        .pd-content-layout.pd-visible { opacity: 1; transform: translateY(0); }

        .pd-description-text {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: #2d2d2d;
          line-height: 1.85;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 1.5rem;
        }

        .pd-blog-content h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 2.5rem 0 0.85rem;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-blog-content p {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.85;
          margin-bottom: 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-blog-content ul, .pd-blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .pd-blog-content li {
          margin-bottom: 0.6rem;
          color: #6b7280;
          line-height: 1.8;
          font-size: 0.95rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-detail-imgs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 2rem 0;
        }

        @media (max-width: 480px) { .pd-detail-imgs { grid-template-columns: 1fr; } }

        .pd-detail-img-wrap {
          overflow: hidden;
          background: #e5e7eb;
          clip-path: inset(0px);
          transition: clip-path 0.65s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
        }
        .pd-detail-img-wrap:hover { clip-path: inset(8px); }

        .pd-detail-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          transition: transform 1.8s cubic-bezier(0.4,0,0.2,1);
        }
        .pd-detail-img-wrap:hover .pd-detail-img { transform: scale(1.06); }

        .pd-divider { border: none; border-top: 1px solid #e5e7eb; margin: 3.5rem 0; }

        .pd-post-nav {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 2.5rem 0;
          padding: 1.5rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .pd-post-nav-prev, .pd-post-nav-next { flex: 1; }

        .pd-post-nav-prev a, .pd-post-nav-next a {
          text-decoration: none;
          display: inline-flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .pd-nav-label-text {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0A3981;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-nav-title {
          font-size: 0.95rem;
          font-weight: 400;
          color: #2d2d2d;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.4;
        }

        .pd-post-nav-next { text-align: right; }

        .pd-comments-section { margin-top: 3rem; }

        .pd-comments-title {
          font-size: 1.6rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-comment-form h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 0.4rem;
        }

        .pd-comment-form .pd-form-subtitle {
          font-size: 0.85rem;
          color: #6b7280;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 1.75rem;
        }

        .pd-comment-form label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #2d2d2d;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 0.5rem;
        }

        .pd-comment-form textarea,
        .pd-comment-form input[type="text"],
        .pd-comment-form input[type="email"],
        .pd-comment-form input[type="url"] {
          width: 100%;
          padding: 0.75rem 0;
          border: none;
          border-bottom: 2px solid #2d2d2d;
          border-radius: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #2d2d2d;
          background: transparent;
          margin-bottom: 1.75rem;
          box-sizing: border-box;
        }

        .pd-comment-form textarea:focus,
        .pd-comment-form input:focus {
          outline: none;
          border-bottom-color: #0A3981;
        }

        .pd-comment-form .pd-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 640px) {
          .pd-comment-form .pd-form-row { grid-template-columns: 1fr; gap: 0; }
        }

        .pd-comment-form .pd-form-field { display: flex; flex-direction: column; }

        .pd-comment-form .pd-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin: 0 0 1.75rem;
          font-size: 0.82rem;
          color: #6b7280;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pd-comment-form .pd-checkbox-row input[type="checkbox"] {
          margin-top: 0.2rem;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .pd-comment-form .pd-checkbox-row label { margin-bottom: 0; font-weight: 400; color: #6b7280; }

        .pd-submit-btn {
          background-color: #0A3981;
          color: #ffffff;
          border: 2px solid #0A3981;
          padding: 1rem 2.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        .pd-submit-btn:hover {
          background-color: #ffffff;
          color: #131313;
        }

        .pd-back-all {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 2.5rem;
          background: none;
          border: 1.5px solid #131313;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #131313;
          padding: 0.75rem 1.5rem;
          transition: background 0.2s ease, color 0.2s ease;
          text-decoration: none;
        }
        .pd-back-all:hover { background: #131313; color: #ffffff; }

        /* ── Case Study ── */
        .pd-case-study { margin-top: 1rem; }

        .pd-case-block {
          margin-bottom: 2.5rem;
        }

        .pd-case-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: #131313;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.01em;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .pd-case-text {
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.85;
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
        }

        .pd-tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .pd-tech-chip {
          display: inline-block;
          padding: 0.3rem 0.85rem;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
        }

        .pd-result-block {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .pd-result-block .pd-case-heading {
          border-bottom-color: #bbf7d0;
          color: #15803d;
        }

        .pd-result-block .pd-case-text {
          color: #166534;
        }
      `}</style>

      <div className="pd-page">

        {/* SEO */}
        {project && (
          <SEO
            title={`${project.title} | Portfolio Case Study`}
            description={project.challenge
              ? `${project.challenge.slice(0, 140)}...`
              : project.description
                ? project.description.replace(/<[^>]+>/g, '').slice(0, 155)
                : `${project.title} — a ${project.category} project by Nikhil Sharma, Full Stack Developer in Jaipur.`
            }
            keywords={`${project.title}, ${project.category}, ${project.tech_stack || 'Web Development'}, Portfolio Case Study, Nikhil Sharma`}
            ogType="article"
            structuredData={[{
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": project.title,
              "description": project.description ? project.description.replace(/<[^>]+>/g, '') : project.title,
              "url": typeof window !== 'undefined' ? window.location.href : '',
              "image": project.image_url || (project.image ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`) : ''),
              "creator": {
                "@type": "Person",
                "name": "Nikhil Sharma",
                "url": "https://thenikhilsharma.in"
              },
              "genre": project.category,
              ...(project.tech_stack ? { "keywords": project.tech_stack } : {})
            }]}
          />
        )}

        {/* Hero Section */}
        <div className="pd-hero-outer">
          <div className="pd-hero-section">
            <div className="pd-hero-content">
              <h1 className="pd-hero-title">{project.title}</h1>
              <div className="pd-hero-tags">
                <Link href="/portfolio">{project.category}</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pd-inner">

          {/* Breadcrumb */}
          <div className="pd-breadcrumb">
            <button className="pd-back-btn" onClick={() => navigate('/portfolio')}>
              ← Portfolio
            </button>
            <span className="pd-breadcrumb-sep">/</span>
            <span className="pd-breadcrumb-current">{project.title}</span>
          </div>

          {/* Featured Image — clickable, opens website */}
          <div className="pd-featured-image">
            <div style={{ width: '100%' }}>
              {project.website_link ? (
                <a href={project.website_link} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                  <img
                    src={
                      project.image_url ||
                      (project.image
                        ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`)
                        : 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-detail-fi-1.jpg')
                    }
                    alt={project.title}
                    style={{ cursor: 'pointer' }}
                  />
                </a>
              ) : (
                <img
                  src={
                    project.image_url ||
                    (project.image
                      ? (project.image.startsWith('http') ? project.image : `/images/portfolio/${project.image}`)
                      : 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-detail-fi-1.jpg')
                  }
                  alt={project.title}
                />
              )}
            </div>
          </div>

          <div style={{ height: '3rem' }} />

          {/* Project Info Row */}
          <div className="pd-info-row-custom">
            <div className="pd-info-item">
              <h4>Category</h4>
              <p>{project.category || project.short_description || 'Web Development'}</p>
            </div>
            <div className="pd-info-item">
              <h4>Client</h4>
              <p>{project.clint_name || project.title}</p>
            </div>
            {(project.website_link || project.project_url) && (
              <div className="pd-info-item">
                <h4>Live Website</h4>
                <p>
                  <a
                    href={project.website_link || project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0A3981', fontWeight: 600 }}
                  >
                    Visit Website →
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="pd-content-layout" ref={contentRef}>
            <div className="pd-desc-col">
              {project.description ? (
                <div
                  className="pd-blog-content"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : project.short_description ? (
                <p className="pd-description-text">{project.short_description}</p>
              ) : (
                <p className="pd-description-text">
                  This project showcases creative design and development work. Check back for more details.
                </p>
              )}

              {/* ── Case Study Sections ── */}
              {(project.challenge || project.approach || project.tech_stack || project.result) && (
                <div className="pd-case-study">
                  <hr className="pd-divider" />

                  {project.challenge && (
                    <div className="pd-case-block">
                      <h3 className="pd-case-heading">The Challenge</h3>
                      <p className="pd-case-text">{project.challenge}</p>
                    </div>
                  )}

                  {project.approach && (
                    <div className="pd-case-block">
                      <h3 className="pd-case-heading">Our Approach</h3>
                      <p className="pd-case-text">{project.approach}</p>
                    </div>
                  )}

                  {project.tech_stack && (
                    <div className="pd-case-block">
                      <h3 className="pd-case-heading">Tech Stack</h3>
                      <div className="pd-tech-chips">
                        {project.tech_stack.split(',').map((tech) => (
                          <span key={tech.trim()} className="pd-tech-chip">{tech.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.result && (
                    <div className="pd-case-block pd-result-block">
                      <h3 className="pd-case-heading">Result</h3>
                      <p className="pd-case-text">{project.result}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Post Navigation */}
          <div className="pd-post-nav">
            <div className="pd-post-nav-prev">
              {prevItem ? (
                <Link href={`/portfolio/${prevItem.id}`}>
                  <span className="pd-nav-label-text">← Previous Project</span>
                  <span className="pd-nav-title">{prevItem.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
            <div className="pd-post-nav-next">
              {nextItem ? (
                <Link href={`/portfolio/${nextItem.id}`}>
                  <span className="pd-nav-label-text">Next Project →</span>
                  <span className="pd-nav-title">{nextItem.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>

          <Link href="/portfolio" className="pd-back-all">
            ← Back to All Projects
          </Link>

        </div>
      </div>
    </>
  );
}
