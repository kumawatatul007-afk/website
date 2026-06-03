import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import './index.css'

export default function BlogDetailSidebarPage({ post: serverPost, recentPosts: serverRecentPosts }) {
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
                    post.main_image
                      ? (post.main_image.startsWith('http') ? post.main_image : `/images/blogs/${post.main_image}`)
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
                {post.content ? (
                  <div
                    className="bds-paragraph"
                    ref={addToRefs}
                    dangerouslySetInnerHTML={{ __html: post.content }}
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
                            <p>{comment.comment}</p>
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
                    <p className="bds-form-field">
                      <label htmlFor="url">Website</label>
                      <input id="url" name="url" type="url" />
                    </p>
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
                                  rp.main_image
                                    ? (rp.main_image.startsWith('http') ? rp.main_image : `/images/blogs/${rp.main_image}`)
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
            </aside>

          </div>
        </div>
      </section>
    </main>
  )
}
