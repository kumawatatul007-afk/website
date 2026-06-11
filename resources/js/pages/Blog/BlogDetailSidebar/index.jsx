import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import './index.css'

export default function BlogDetailSidebarPage({ post: serverPost, recentPosts: serverRecentPosts, categories: serverCategories, setting }) {
  const allCategories = Array.isArray(serverCategories) ? serverCategories : [];
  // Get social links from setting
  const rawSocial = setting?.social_links;
  const socialLinks = typeof rawSocial === 'string'
    ? (() => { try { return JSON.parse(rawSocial); } catch { return {}; } })()
    : (rawSocial || {});
  const fbUrl = socialLinks.facebook || 'https://www.facebook.com/nikhilsharma7developer';
  const twUrl = socialLinks.twitter || 'https://x.com/NikhilSharma881';
  const liUrl = socialLinks.linkedin || 'https://www.linkedin.com/in/nikhil-sharma-jaipur';
  const ptUrl = socialLinks.pinterest || 'https://in.pinterest.com/nikhilsharma881/';
  // New URL format: /{slug}/sidebar — extract slug from path
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  // Remove 'sidebar' suffix if present
  const pathSlug = pathParts[pathParts.length - 1] === 'sidebar'
    ? pathParts[pathParts.length - 2] || ''
    : pathParts[pathParts.length - 1] || '';

  const [post, setPost] = useState(serverPost || null);
  const [recentPosts, setRecentPosts] = useState(serverRecentPosts || []);
  const [loading, setLoading] = useState(!serverPost);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (serverPost) return; // Inertia se data aa gaya

    setLoading(true);
    Promise.all([
      fetch(`/api/blog/${pathSlug}`).then(r => r.json()),
      fetch('/api/blog').then(r => r.json()),
    ])
      .then(([postData, allPosts]) => {
        setPost(postData);
        const recent = allPosts
          .filter(p => p.slug !== pathSlug)
          .slice(0, 3);
        setRecentPosts(recent);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathSlug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const animatedRefs = useRef([])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bds-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    animatedRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [post])

  const addToRefs = (el) => {
    if (el && !animatedRefs.current.includes(el)) {
      animatedRefs.current.push(el)
    }
  }

  if (loading) {
    return (
      <main className="bds-main-wrapper">
        <div style={{ textAlign: 'center', padding: '5rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
          Loading post...
        </div>
      </main>
    );
  }

  if (!post || post.message) {
    return (
      <main className="bds-main-wrapper">
        <div style={{ textAlign: 'center', padding: '5rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
          Post not found.{' '}
          <Link href="/blog" style={{ color: '#0A3981' }}>Back to Blog</Link>
        </div>
      </main>
    );
  }

  const comments = post.comments || [];
  const prevPost = post.prev_post || null;
  const nextPost = post.next_post || null;

  return (
    <main className="bds-main-wrapper">
      <section className="bds-section">
        <div className="container">
          <div className="bds-grid">

            {/* Left Column - Main Content */}
            <div className="bds-content-col">
              <figure className="bds-featured-image">
                <img
                  src={
                    post.image
                      ? (post.image.startsWith('http') ? post.image : `/images/blogs/${post.image}`)
                      : 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-1.jpg'
                  }
                  alt={post.title}
                  onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-1.jpg'; }}
                />
              </figure>

              <h1 className="bds-title">{post.title}</h1>

              <div className="bds-meta">
                <span className="bds-date">{formatDate(post.created_at)}</span>
                <span className="bds-meta-sep">—</span>
                <span className="bds-author">by <strong>Nikhil Sharma</strong></span>
              </div>

              <div className="bds-content">
                {post.description ? (
                  <div
                    className="bds-paragraph"
                    ref={addToRefs}
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                ) : (
                  <p className="bds-paragraph" ref={addToRefs}>
                    {post.meta_description || 'No content available for this post.'}
                  </p>
                )}
              </div>

              {/* Post Navigation */}
              <nav className="bds-post-nav">
                <div className="bds-post-nav-prev">
                  {prevPost ? (
                    <Link href={`/${prevPost.slug || prevPost.id}/sidebar`}>
                      <span className="bds-nav-label">← Previous Post</span>
                      <span className="bds-nav-title">{prevPost.title}</span>
                    </Link>
                  ) : <span />}
                </div>
                <div className="bds-post-nav-next">
                  {nextPost ? (
                    <Link href={`/${nextPost.slug || nextPost.id}/sidebar`}>
                      <span className="bds-nav-label">Next Post →</span>
                      <span className="bds-nav-title">{nextPost.title}</span>
                    </Link>
                  ) : <span />}
                </div>
              </nav>

              {/* Comments Section */}
              <div className="bds-comments">
                <h2 className="bds-comments-title">Comments ({comments.length})</h2>

                {comments.length > 0 && (
                  <ol className="bds-comment-list">
                    {comments.map((comment) => (
                      <li key={comment.id} className="bds-comment-item">
                        <div className="bds-comment-avatar" style={{ width: 48, height: 48, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>
                          {comment.name ? comment.name[0].toUpperCase() : '?'}
                        </div>
                        <div className="bds-comment-body">
                          <div className="bds-comment-meta">
                            <span className="bds-comment-author">{comment.name}</span>
                            <span className="bds-comment-date">{formatDate(comment.created_at)}</span>
                          </div>
                          <div className="bds-comment-content">
                            <p>{comment.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {/* Comment Form */}
                <div className="bds-comment-form">
                  <h3 className="bds-reply-title">Leave a Reply</h3>
                  <p className="bds-comment-note">
                    Your email address will not be published. Required fields are marked <span className="required">*</span>
                  </p>
                  <form action="#" method="post">
                    <p className="bds-form-row">
                      <label htmlFor="comment">Comment <span className="required">*</span></label>
                      <textarea id="comment" name="comment" rows="6" required></textarea>
                    </p>
                    <div className="bds-form-group">
                      <p className="bds-form-field">
                        <label htmlFor="author">Name <span className="required">*</span></label>
                        <input id="author" name="author" type="text" required />
                      </p>
                      <p className="bds-form-field">
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input id="email" name="email" type="email" required />
                      </p>
                    </div>
                    <div className="bds-form-group">
                      <p className="bds-form-field">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input id="mobile" name="mobile_no" type="tel" maxLength={10} inputMode="numeric" onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 10) val = val.slice(0, 10);
                          e.target.value = val;
                        }} />
                      </p>
                      <p className="bds-form-field">
                        <label htmlFor="url">Website</label>
                        <input id="url" name="url" type="url" />
                      </p>
                    </div>
                    <p className="bds-form-checkbox">
                      <input id="save-info" name="save-info" type="checkbox" />
                      <label htmlFor="save-info">Save my name, email, and website in this browser for the next time I comment.</label>
                    </p>
                    <button type="submit" className="btn-submit">Post Comment</button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <aside className="bds-sidebar-col">
              {/* Author Widget */}
              <div className="bds-widget bds-widget--card bds-widget-author">
                <div className="bds-author-wrapper">
                  <div className="bds-author-avatar">
                    <img src="/images/blogs/1780913489_rohithgfgj.png" alt="Nikhil Sharma" className="bds-author-img" onError={(e) => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg'; }} />
                  </div>
                  <h3 className="bds-author-name">Nikhil Sharma</h3>
                  <p className="bds-author-bio">Hi! beautiful people, I'm an author of this blog. Read our post - stay with us.</p>
                  <div className="bds-author-social">
                    <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="bds-social-link" aria-label="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                      </svg>
                    </a>
                    <a href={twUrl} target="_blank" rel="noopener noreferrer" className="bds-social-link" aria-label="Twitter">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href={liUrl} target="_blank" rel="noopener noreferrer" className="bds-social-link" aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href={ptUrl} target="_blank" rel="noopener noreferrer" className="bds-social-link" aria-label="Pinterest">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Search Widget */}
              <div className="bds-widget bds-widget--search">
                <div className="bds-search-wrap">
                  <input type="text" placeholder="Search Here..." className="bds-search-input" />
                  <button className="bds-search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Recent Posts Widget */}
            {recentPosts.length > 0 && (
              <div className="bds-widget bds-widget--card">
                <div className="bds-widget-inner">
                  <h3 className="bds-widget-title">Recent Posts</h3>
                  <ul className="bds-recent-posts">
                    {recentPosts.map((rp) => (
                      <li key={rp.id}>
                        <Link href={`/${rp.slug || rp.id}/sidebar`} className="bds-recent-link">
                          <div className="bds-recent-img">
                            <img
                              src={
                                rp.image
                                  ? (rp.image.startsWith('http') ? rp.image : `/images/blogs/${rp.image}`)
                                  : 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg'
                              }
                              alt={rp.title}
                              onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg'; }}
                            />
                          </div>
                          <div className="bds-recent-info">
                            <span className="bds-recent-date">{formatDate(rp.created_at)}</span>
                            <span className="bds-recent-title">{rp.title}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Categories Widget */}
            {allCategories.length > 0 && (
              <div className="bds-widget bds-widget--card">
                <div className="bds-widget-inner">
                  <h3 className="bds-widget-title">Categories</h3>
                  <ul className="bds-category-list">
                    {allCategories.map(category => (
                      <li key={category.id}>
                        <Link href={`/blog?category=${category.id}`} className="bds-category-link">
                          <span>{category.name}</span>
                          <span className="bds-category-count">{category.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            </aside>

          </div>
        </div>
      </section>
    </main>
  )
}
