import { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import SEO from '../../../components/SEO';
import './index.css';

export default function BlogDetailPage({ post, recentPosts = [], seo }) {
  const { props } = usePage();
  const flashSuccess = props.flash?.comment_success;
  const [loading] = useState(!post);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Smooth scroll-reveal animation
  const animatedRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bd-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );
    animatedRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [post]);

  const addRef = (el) => {
    if (el && !animatedRefs.current.includes(el)) animatedRefs.current.push(el);
  };

  // Comment form
  const { data, setData, post: submitForm, processing, errors, reset, wasSuccessful } = useForm({
    blog_id:     post?.id ?? '',
    name:        '',
    email:       '',
    website:     '',
    description: '',
    save_info:   false,
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    submitForm('/blog-comment', {
      preserveScroll: true,
      onSuccess: () => reset('name', 'email', 'website', 'description'),
    });
  };

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop';
  
  function getImageUrl(img) {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith('http')) return img;
    return `/images/blogs/${img}`;
  }

  // Loading state
  if (loading || !post) {
    return (
      <div className="bd-state-container">
        <div className="bd-state-card">
          {loading ? (
            <div className="bd-spinner-wrap">
              <div className="bd-spinner"></div>
              <p>Loading premium content...</p>
            </div>
          ) : (
            <>
              <h3>Post Not Found</h3>
              <p>The article you're looking for might have been moved or deleted.</p>
              <Link href="/blog" className="bd-btn-primary">Back to Blog Feed</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const comments = post.comments || [];
  const prevPost = post.prev_post || null;
  const nextPost = post.next_post || null;
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="bd-root">
      <SEO
        title={seo?.title || post.title}
        description={seo?.description || post.meta_description || ''}
        keywords={seo?.keywords || post.meta_keywords || ''}
        canonical={seo?.canonical}
        robots={seo?.robots}
      />

      {/* Premium Hero Section */}
      <header className="bd-hero">
        <div className="bd-hero-bg">
          <img
            src={getImageUrl(post.main_image)}
            alt={post.title}
            onError={e => { e.target.src = FALLBACK_IMAGE; }}
          />
        </div>
        <div className="bd-hero-overlay"></div>
        <div className="bd-hero-content">
          <div className="bd-hero-tags">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="bd-hero-tag">#{tag}</span>
            ))}
          </div>
          <h1 className="bd-hero-title">{post.title}</h1>
          <div className="bd-hero-meta">
            <div className="bd-hero-meta-item">
              <span className="hero-meta-icon"></span>
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="bd-hero-meta-item">
              <span className="hero-meta-icon"></span>
              <span>Nikhil Sharma</span>
            </div>
            <div className="bd-hero-meta-item">
              <span className="hero-meta-icon"></span>
              <span>{comments.length} Comments</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="bd-container">
        <div className="bd-grid-layout">
          
          {/* LEFT COLUMN: Main Article */}
          <article className="bd-main-content">
            <nav className="bd-breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">›</span>
              <Link href="/blog">Blog</Link>
              <span className="sep">›</span>
              <span className="current">{post.title}</span>
            </nav>

            <div className="bd-title-wrapper" ref={addRef}>
              <h1 className="bd-title">{post.title}</h1>
            </div>

            <div className="bd-author-card" ref={addRef}>
              <div className="author-avatar">NS</div>
              <div className="author-info">
                <strong>Nikhil Sharma</strong>
                <span>Senior Writer & Tech Enthusiast</span>
              </div>
              <div className="author-stats">
                <span>{Math.ceil((post.content?.length || 1000) / 1000)} min read</span>
              </div>
            </div>

            <div className="bd-body-content" ref={addRef}>
              {post.content ? (
                <div className="bd-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="bd-fallback-text">
                  <p>{post.meta_description || 'Experience the finest insights from our expert writers. This article explores deep concepts with practical applications.'}</p>
                  <p>Dive into a world where ideas transform into action. Our premium content brings you the latest trends, timeless wisdom, and actionable strategies.</p>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="bd-tags-footer" ref={addRef}>
                <span className="label">Tags:</span>
                <div className="bd-tag-cloud">
                  {tags.map((tag, i) => (
                    <span key={i} className="bd-tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Post Navigation */}
            <nav className="bd-post-navigation" ref={addRef}>
              <div className="nav-box prev">
                {prevPost ? (
                  <Link href={`/${prevPost.slug}`}>
                    <span className="nav-direction">← Previous Post</span>
                    <span className="nav-post-title">{prevPost.title}</span>
                  </Link>
                ) : (
                  <span className="nav-direction disabled">← No previous post</span>
                )}
              </div>
              <div className="nav-box next">
                {nextPost ? (
                  <Link href={`/${nextPost.slug}`}>
                    <span className="nav-direction">Next Post →</span>
                    <span className="nav-post-title">{nextPost.title}</span>
                  </Link>
                ) : (
                  <span className="nav-direction disabled">No next post →</span>
                )}
              </div>
            </nav>

            {/* Comments Section */}
            <section className="bd-comments-section" ref={addRef}>
              <div className="bd-section-header">
                <h2 className="bd-section-heading">Join the Conversation</h2>
                <div className="bd-comment-count">{comments.length} thoughtful responses</div>
              </div>

              {comments.length > 0 && (
                <ul className="bd-comments-list">
                  {comments.map((comment, idx) => (
                    <li key={comment.id} className="bd-comment-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="bd-avatar">
                        {comment.name ? comment.name[0].toUpperCase() : ''}
                      </div>
                      <div className="bd-comment-content">
                        <div className="bd-comment-meta">
                          <span className="author-name">{comment.name}</span>
                          <span className="comment-time">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="comment-text">{comment.description}</p>
                        <button className="comment-reply-btn">Reply</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Premium Comment Form */}
              <div className="bd-form-container">
                <h3 className="bd-form-title">Share Your Thoughts </h3>
                <p className="bd-form-subtitle">Your email stays private. Required fields are marked *</p>

                {(flashSuccess || wasSuccessful) && (
                  <div className="bd-alert-success">
                    <span className="success-icon">✓</span>
                    <span>Your comment has been submitted successfully! It will appear after moderation.</span>
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="bd-form">
                  <div className="bd-form-group full-width">
                    <label htmlFor="comment">Your Comment <span className="required">*</span></label>
                    <textarea
                      id="comment"
                      rows="5"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      placeholder="What are your thoughts on this article? Share your perspective..."
                      required
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>
                  
                  <div className="bd-form-grid">
                    <div className="bd-form-group">
                      <label htmlFor="author">Full Name <span className="required">*</span></label>
                      <input
                        id="author"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="bd-form-group">
                      <label htmlFor="email">Email Address <span className="required">*</span></label>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="bd-form-group full-width">
                    <label htmlFor="url">Website (optional)</label>
                    <input
                      id="url"
                      type="url"
                      value={data.website}
                      onChange={e => setData('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.website && <span className="error-message">{errors.website}</span>}
                  </div>

                  <button type="submit" className="bd-btn-submit" disabled={processing}>
                    {processing ? (
                      <span className="btn-loader"> Publishing...</span>
                    ) : ' Post Comment'}
                  </button>
                </form>
              </div>
            </section>
          </article>

          {/* RIGHT COLUMN: Premium Sidebar */}
          <aside className="bd-sidebar-area">
            <div className="bd-sidebar-sticky">
              
              {/* About Widget */}
              <div className="bd-widget about-widget">
                <h3 className="bd-widget-title">About Blog</h3>
                <p className="widget-desc">Exploring ideas that shape our future. Premium insights, deep dives, and authentic storytelling.</p>
              </div>

              {/* Recent Posts Widget */}
              <div className="bd-widget">
                <h3 className="bd-widget-title"> Fresh Reads</h3>
                {recentPosts.length > 0 ? (
                  <div className="bd-sidebar-posts">
                    {recentPosts.slice(0, 4).map(rp => {
                      const title = rp.title || 'Untitled';
                      const slug = rp.slug || '#';
                      return (
                        <Link key={rp.id} href={slug.startsWith('/') ? slug : `/${slug}`} className="bd-sidebar-post-item">
                          <div className="thumb">
                            <img
                              src={getImageUrl(rp.main_image)}
                              alt={title}
                              onError={e => { e.target.src = FALLBACK_IMAGE; }}
                            />
                          </div>
                          <div className="details">
                            <h4>{title}</h4>
                            <span className="date">{formatDate(rp.created_at)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="bd-empty-widget">No recent posts available.</p>
                )}
              </div>

              {/* Trending Tags */}
              {tags.length > 0 && (
                <div className="bd-widget">
                  <h3 className="bd-widget-title"> Trending Topics</h3>
                  <div className="widget-tags">
                    {tags.map((tag, i) => (
                      <span key={i} className="widget-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action Widget */}
              <div className="bd-widget cta-widget">
                <h3>Never Miss a Post</h3>
                <p>Join 5,000+ readers getting weekly insights.</p>
                <button className="bd-btn-secondary">Subscribe →</button>
              </div>

              {/* Navigation Widget */}
              <div className="bd-widget back-widget">
                <Link href="/blog" className="bd-btn-outline">
                  ← Back to All Posts
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}