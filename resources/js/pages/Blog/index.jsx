import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import SEO from '../../components/SEO'
import { ShimmerBlogCard } from '../../components/ShimmerLoader'

const POSTS_PER_PAGE = 6


export default function BlogPage({ posts, categories, seo, setting }) {
  const allPosts = Array.isArray(posts) ? posts : [];
  const allCategories = Array.isArray(categories) ? categories : [];
  const [activeTag, setActiveTag] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shimmer, setShimmer] = useState(true);

  // Get social links from setting
  const rawSocial = setting?.social_links;
  const socialLinks = typeof rawSocial === 'string'
    ? (() => { try { return JSON.parse(rawSocial); } catch { return {}; } })()
    : (rawSocial || {});
  const fbUrl = socialLinks.facebook || 'https://www.facebook.com/nikhilsharma7developer';
  const twUrl = socialLinks.twitter || 'https://x.com/NikhilSharma881';
  const liUrl = socialLinks.linkedin || 'https://www.linkedin.com/in/nikhil-sharma-jaipur';
  const ptUrl = socialLinks.pinterest || 'https://in.pinterest.com/nikhilsharma881/';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTag(params.get('tag') || '');
    const categoryParam = params.get('category');
    setActiveCategoryId(categoryParam ? parseInt(categoryParam, 10) : null);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShimmer(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  useEffect(() => {
    AOS.refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeCategoryId, activeTag]);

  // Debug: log posts to check data
  useEffect(() => {
    if (!shimmer) {
      // eslint-disable-next-line no-console
      console.log('Blog posts:', allPosts);
    }
  }, [shimmer, allPosts]);

  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = activeCategoryId
      ? post.category_id === activeCategoryId
      : true;
    return matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  function formatDate(dateStr) {
    if (!dateStr) return 'No date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'No date';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getExcerpt(content) {
    if (!content) return 'No content available.';
    const plain = content.replace(/<[^>]*>/g, '').trim();
    return plain.length > 150 ? plain.slice(0, 150) + '...' : plain;
  }

  function getImageUrl(image) {
    if (!image) return 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg';
    if (typeof image === 'string' && image.startsWith('http')) return image;
    return `/images/blogs/${image}`;
  }

  function getPageNumbers() {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  }



  return (
    <div className="blogpage-root">
      <SEO
        title={seo?.title       || 'Blog | Nikhil Sharma - Web Development Articles & Insights'}
        description={seo?.description || 'Read articles on web development, UI/UX design, and software engineering by Nikhil Sharma.'}
        keywords={seo?.keywords  || 'Web Development Blog, React JS Tips, PHP Laravel, UI UX Design'}
        canonical={seo?.canonical}
        robots={seo?.robots}
      />

      <div className="blogpage-container">

        {/* Header */}
        <div className="blogpage-section-header" data-aos="fade-up" data-aos-duration="800">
          <span className="blogpage-stroke-label">My Blog</span>
          <h1 className="blogpage-big-title">Latest Articles & Insights</h1>
          {(activeTag || activeCategoryId) && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {activeTag && (
                <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Tag: <span style={{ color: '#667eea', fontWeight: '900' }}>{activeTag}</span>
                </span>
              )}
              {activeCategoryId && (
                <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Category: <span style={{ color: '#667eea', fontWeight: '900' }}>{allCategories.find(c => c.id === activeCategoryId)?.name}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="blogpage-layout">
          {/* Main Content */}
          <div className="blogpage-main">
            {/* Empty state */}
            {!shimmer && filteredPosts.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem', 
                color: '#64748b', 
                fontFamily: "'Space Grotesk', sans-serif",
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
              }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>No blog posts found.</p>
              </div>
            )}

            {/* Shimmer skeleton */}
            {shimmer && (
              <div className="blog-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ShimmerBlogCard key={i} />
                ))}
              </div>
            )}

            {/* Blog Cards Grid */}
            {!shimmer && filteredPosts.length > 0 && (
              <>
                <div className="blog-grid">
                  {paginatedPosts.map((post, index) => {
                    // Defensive: fallback for missing fields
                    const title = post.title || 'No title';
                    const slug = post.slug || '#';
                    const metaDescription = post.meta_description || '';
                    const description = post.description || '';
                    const image = post.image || '';
                    return (
                      <Link
                        key={post.id || index}
                        href={slug.startsWith('/') ? slug : `/${slug}`}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        data-aos-duration="700"
                      >
                        <div className="blog-card">
                          <div className="blog-img-wrap">
                            <img
                              src={getImageUrl(image)}
                              alt={title}
                              className="blog-img"
                              onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg'; }}
                            />
                          </div>
                          <div className="blog-card-body">
                            <h4 className="blog-card-title">{title}</h4>
                            <p className="blog-card-excerpt">
                              {metaDescription
                                ? (metaDescription.length > 150 ? metaDescription.slice(0, 150) + '...' : metaDescription)
                                : getExcerpt(description)
                              }
                            </p>
                            <div className="blog-card-meta">
                              <div className="blog-card-author-wrap">
                                <div className="blog-card-avatar">
                                  <img
                                    src="https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg"
                                    alt="Author"
                                  />
                                </div>
                                <span className="blog-card-author">Nikhil Sharma</span>
                              </div>
                              <span className="blog-card-date">{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="blogpage-pagination" data-aos="fade-up" data-aos-duration="800">
                    <button
                      className="blogpage-page-btn"
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>

                    {getPageNumbers()[0] > 1 && (
                      <>
                        <button className={`blogpage-page-num ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
                        {getPageNumbers()[0] > 2 && <span className="blogpage-ellipsis">…</span>}
                      </>
                    )}

                    {getPageNumbers().map(num => (
                      <button
                        key={num}
                        className={`blogpage-page-num ${currentPage === num ? 'active' : ''}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}

                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                      <>
                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="blogpage-ellipsis">…</span>}
                        <button className={`blogpage-page-num ${currentPage === totalPages ? 'active' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                      </>
                    )}

                    <button
                      className="blogpage-page-btn"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="blogpage-sidebar">
            {/* Author Widget */}
            <div className="blogpage-widget blogpage-widget-author" data-aos="fade-up" data-aos-duration="800">
              <div className="blogpage-author-wrapper">
                <div className="blogpage-author-avatar">
                  <img src="/images/blogs/1780913489_rohithgfgj.png" alt="Nikhil Sharma" className="blogpage-author-img" onError={(e) => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg'; }} />
                </div>
                <h3 className="blogpage-author-name">Nikhil Sharma</h3>
                <p className="blogpage-author-bio">Hi! beautiful people, I'm an author of this blog. Read our post - stay with us.</p>
                <div className="blogpage-author-social">
                  <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="blogpage-social-link" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                    </svg>
                  </a>
                  <a href={twUrl} target="_blank" rel="noopener noreferrer" className="blogpage-social-link" aria-label="Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href={liUrl} target="_blank" rel="noopener noreferrer" className="blogpage-social-link" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={ptUrl} target="_blank" rel="noopener noreferrer" className="blogpage-social-link" aria-label="Pinterest">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Categories Widget */}
            {allCategories.length > 0 && (
              <div className="blogpage-widget" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
                <h3 className="blogpage-widget-title">Categories</h3>
                <ul className="blogpage-category-list">
                  <li key="all">
                    <button
                      onClick={() => setActiveCategoryId(null)}
                      className={`blogpage-category-link ${!activeCategoryId ? 'active' : ''}`}
                    >
                      <span>All</span>
                      <span className="blogpage-category-count">15</span>
                    </button>
                  </li>
                  {allCategories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategoryId(category.id)}
                        className={`blogpage-category-link ${activeCategoryId === category.id ? 'active' : ''}`}
                      >
                        <span>{category.name}</span>
                        <span className="blogpage-category-count">{category.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
