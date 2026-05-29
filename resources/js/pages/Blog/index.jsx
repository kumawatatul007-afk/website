
import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import SEO from '../../components/SEO'
import { ShimmerBlogCard } from '../../components/ShimmerLoader'

const POSTS_PER_PAGE = 6


export default function BlogPage({ posts, seo }) {
  const allPosts = Array.isArray(posts) ? posts : [];
  const [activeTag, setActiveTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTag(params.get('tag') || '');
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
  }, [currentPage]);

  // Debug: log posts to check data
  useEffect(() => {
    if (!shimmer) {
      // eslint-disable-next-line no-console
      console.log('Blog posts:', allPosts);
    }
  }, [shimmer, allPosts]);

  const filteredPosts = activeTag
    ? allPosts.filter(post => {
        if (!post.tags) return false;
        return post.tags.split(',').map(t => t.trim()).includes(activeTag);
      })
    : allPosts;

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

  function getImageUrl(mainImage) {
    if (!mainImage) return 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg';
    if (typeof mainImage === 'string' && mainImage.startsWith('http')) return mainImage;
    return `/images/blogs/${mainImage}`;
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
          {activeTag && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#6b7280' }}>
                Tag: <strong style={{ color: '#1d4ed8' }}>{activeTag}</strong>
              </span>
              <Link
                href="/blog"
                style={{ fontSize: '0.85rem', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '999px', padding: '2px 12px', textDecoration: 'none' }}
              >
                ✕ Clear
              </Link>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!shimmer && filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
            {activeTag ? (
              <>
                No posts found for tag <strong style={{ color: '#1d4ed8' }}>"{activeTag}"</strong>.<br />
                <Link href="/blog" style={{ color: '#1d4ed8', fontSize: '0.9em' }}>View all posts</Link>
              </>
            ) : (
              <>
                No blog posts published yet.<br />
                <span style={{ fontSize: '0.9em', color: '#bdbdbd' }}>
                  (Check your admin panel or database for published blog posts)
                </span>
              </>
            )}
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
                const content = post.content || '';
                const mainImage = post.main_image || '';
                return (
                  <Link
                    key={post.id || index}
                    href={slug.startsWith('/') ? slug : `/${slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration="700"
                  >
                    <div className="blog-card">
                      <div className="blog-img-wrap">
                        <img
                          src={getImageUrl(mainImage)}
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
                            : getExcerpt(content)
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
              <div className="blogpage-pagination" data-aos="fade-up" data-aos-duration="600">
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
    </div>
  )
}
