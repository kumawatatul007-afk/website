import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashMessage from '../../components/admin/FlashMessage';
import './adminlayout.css';

const Icons = {
  Dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Category: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Blog: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  BlogPost: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Gallery: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Comments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Portfolio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  Users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Messages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  General: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 11h18" />
      <path d="M8 11v8" />
      <path d="M16 11v8" />
    </svg>
  ),
  UserManagement: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Role: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
      <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M20 8v4" />
      <path d="M22 10h-4" />
    </svg>
  ),
  Permission: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 5v6c0 5 3.58 9.74 8 11 4.42-1.26 8-6 8-11V5l-8-3z" />
      <path d="M9 11h6" />
      <path d="M12 14v-6" />
    </svg>
  ),
  Plugin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Scripts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M4 19h16M8 5v14M16 5v14" />
    </svg>
  ),
  Tags: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Newsletter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
      <path d="M4 10h16" />
    </svg>
  ),
  Arrow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const AdminLogo = ({ collapsed }) => (
  <div className={`admin-brand ${collapsed ? 'collapsed' : ''}`}>
    <div className="admin-brand-content">
      <div className="admin-brand-logo">
        <img
          src="https://www.thenikhilsharma.in/public/admin/images/logo/GUJKF-100621-yYB.png"
          alt="Logo"
        />
      </div>
      {!collapsed && (
        <div className="admin-brand-text">
          <span className="admin-brand-title">Nikhil Sharma</span>
          <span className="admin-brand-subtitle">Admin Panel</span>
        </div>
      )}
    </div>
  </div>
);

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Icons.Dashboard, animation: 'pulse' },
  { label: 'Categories', href: '/admin/categories', icon: Icons.Category, animation: 'bounce' },
  {
    label: 'Blog', href: '/admin/blog', icon: Icons.Blog, animation: 'wiggle',
    children: [
      { label: 'Blog Posts', href: '/admin/blog', icon: Icons.BlogPost, animation: 'pop' },
      { label: 'Gallery', href: '/admin/gallery', icon: Icons.Gallery, animation: 'shake' },
      { label: 'Comments', href: '/admin/comments', icon: Icons.Comments, animation: 'bounce' },
    ],
  },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Icons.Portfolio, animation: 'pop' },
  { label: 'Services', href: '/admin/services', icon: Icons.General, animation: 'pop' },
  { label: 'Messages', href: '/admin/messages', icon: Icons.Messages, animation: 'shake' },
  { label: 'Newsletters', href: '/admin/newsletters', icon: Icons.Newsletter, animation: 'pulse' },
  {
    label: 'Settings', href: '/admin/settings', icon: Icons.Settings, animation: 'rotate',
    children: [
      { label: 'General', href: '/admin/settings', icon: Icons.General, animation: 'rotate', exactMatch: true },
      { label: 'Email', href: '/admin/settings/email', icon: Icons.Email, animation: 'bounce' },
    ],
  },
  {
    label: 'User Management',
    href: '/admin/settings/user-management',
    icon: Icons.UserManagement,
    animation: 'pop',
    children: [
      { label: 'Add Role', href: '/admin/settings/user-management/add-role', icon: Icons.Role, animation: 'rotate' },
      { label: 'Add Users', href: '/admin/users', icon: Icons.Users, animation: 'wiggle' },
      { label: 'Permission', href: '/admin/settings/user-management/permission', icon: Icons.Permission, animation: 'shake' },
    ],
  },
  {
    label: 'Plugins', href: '/admin/settings/plugin', icon: Icons.Plugin, animation: 'bounce',
    children: [
      { label: 'Scripts', href: '/admin/settings/scripts', icon: Icons.Scripts, animation: 'pulse' },
    ],
  },
  { label: 'Tags', href: '/admin/settings/tags', icon: Icons.Tags, animation: 'pop' },
];

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const navRef = useRef(null);
  const savedNavScroll = useRef(0);
  const { url } = usePage();

  useEffect(() => {
    const removeBeforeNav = router.on('before', () => {
      if (navRef.current) savedNavScroll.current = navRef.current.scrollTop;
    });
    const removeNavigate = router.on('navigate', () => {
      const target = savedNavScroll.current;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (navRef.current) navRef.current.scrollTop = target;
        });
      });
    });
    return () => { removeBeforeNav(); removeNavigate(); };
  }, []);

  useEffect(() => {
    const auto = {};
    if (url.startsWith('/admin/blog') || url.startsWith('/admin/gallery') || url.startsWith('/admin/comments')) {
      auto['/admin/blog'] = true;
    }
    if (
      url.startsWith('/admin/settings') &&
      !url.startsWith('/admin/settings/user-management') &&
      !url.startsWith('/admin/settings/plugin') &&
      !url.startsWith('/admin/settings/scripts')
    ) {
      auto['/admin/settings'] = true;
    }
    if (url.startsWith('/admin/settings/user-management')) {
      auto['/admin/settings/user-management'] = true;
    }
    if (url.startsWith('/admin/settings/plugin') || url.startsWith('/admin/settings/scripts')) {
      auto['/admin/settings/plugin'] = true;
    }
    setOpenMenus(prev => ({ ...prev, ...auto }));
  }, [url]);

  const toggleMenu = (href) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };

  const fetchNotifications = () => {
    fetch('/admin/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  const handleLogout = () => {
    router.post('/admin/logout');
  };

  const getAnimationClass = (anim) => {
    switch (anim) {
      case 'rotate': return 'anim-rotate';
      case 'pulse': return 'anim-pulse';
      case 'shake': return 'anim-shake';
      case 'wiggle': return 'anim-wiggle';
      case 'pop': return 'anim-pop';
      default: return 'anim-bounce';
    }
  };

  const isItemActive = (item) => {
    if (item.children) {
      return url === item.href || url.startsWith(item.href + '/') || item.children.some(c => isItemActive(c));
    }
    if (item.exactMatch) return url === item.href;
    return url === item.href || url.startsWith(item.href + '/');
  };

  const renderNavItem = (item, depth = 0) => {
    const animationClass = getAnimationClass(item.animation);

    if (item.children) {
      const isGroupActive = isItemActive(item);
      const isOpen = !!openMenus[item.href];

      return (
        <div key={item.href}>
          <button
            className={`admin-nav-item ${isGroupActive ? 'group-active' : ''} ${animationClass}`}
            onClick={() => toggleMenu(item.href)}
          >
            <span className="nav-icon">{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
            {sidebarOpen && (
              <span className={`chevron-icon ${isOpen ? 'rotated' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            )}
          </button>
          {isOpen && sidebarOpen && (
            <div className="submenu">
              <div className="submenu-item">
                {item.children.map(child => renderNavItem(child, depth + 1))}
              </div>
            </div>
          )}
        </div>
      );
    }

    const isActive = item.exactMatch
      ? url === item.href
      : url === item.href || url.startsWith(item.href + '/');

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`admin-nav-item ${isActive ? 'active' : ''} ${animationClass}`}
        style={depth > 0 ? {
          fontSize: '0.82rem',
          paddingLeft: `${1 + depth * 0.5}rem`
        } : {}}
      >
        {depth === 0 && <span className="nav-icon">{item.icon}</span>}
        {sidebarOpen && <span>{item.label}</span>}
        {isActive && sidebarOpen && <span className="nav-indicator"></span>}
      </Link>
    );
  };

  return (
    <div className="admin-layout-container">
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <AdminLogo collapsed={!sidebarOpen} />

        <nav className="admin-nav" ref={navRef}>
          {sidebarOpen && <p className="nav-section-label">Navigation</p>}
          {NAV_ITEMS.map(item => renderNavItem(item))}
        </nav>

        <div className="admin-sidebar-footer">
          {sidebarOpen && (
            <div className="help-card">
              <div className="help-title">Need Help?</div>
              <div className="help-text">info@thenikhilsharma.in</div>
            </div>
          )}
        </div>
      </aside>

      <div className={`admin-main ${!sidebarOpen ? 'collapsed' : ''}`}>
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="admin-toggle-btn" onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle sidebar">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            <span className="admin-topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <div className="notif-wrapper" ref={notifRef}>
              <button
                className="topbar-notif-btn"
                title="Notifications"
                onClick={() => setNotifOpen(o => !o)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span className="notif-title">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="notif-unread-label">{unreadCount} unread</span>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <Link
                          key={n.id}
                          href={`/admin/messages/${n.id}`}
                          className={`notif-item ${!n.is_read ? 'notif-item-unread' : ''}`}
                          onClick={() => setNotifOpen(false)}
                        >
                          <div className="notif-item-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                          </div>
                          <div className="notif-item-content">
                            <p className="notif-item-name">{n.name}</p>
                            <p className="notif-item-msg">{n.message ? n.message.slice(0, 50) + (n.message.length > 50 ? '…' : '') : ''}</p>
                            <p className="notif-item-time">{n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</p>
                          </div>
                          {!n.is_read && <span className="notif-dot" />}
                        </Link>
                      ))
                    )}
                  </div>
                  <Link href="/admin/messages" className="notif-footer" onClick={() => setNotifOpen(false)}>
                    View all messages →
                  </Link>
                </div>
              )}
            </div>
            <div className="topbar-divider" />
            <div className="user-info">
              <span className="user-name">Nikhil Sharma</span>
              <span className="user-role">Super Admin</span>
            </div>
            <div className="topbar-user-badge">N</div>
            <button className="topbar-logout-btn" onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main className="admin-content">
          <FlashMessage />
          {children}
        </main>
      </div>
    </div>
  );
}