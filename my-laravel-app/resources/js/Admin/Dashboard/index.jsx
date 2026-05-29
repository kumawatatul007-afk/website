import AdminLayout from '../layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

/* ── Animated counter ── */
function useCounter(target, duration = 1200, started = false) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!started || target === 0) { setVal(target); return; }
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - prog, 3);
            setVal(Math.round(ease * target));
            if (prog < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, started]);
    return val;
}

/* ── SVG Mini Sparkline ── */
function Sparkline({ data = [], color = '#fff' }) {
    if (data.length < 2) return null;
    const W = 80, H = 32;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    const area = `0,${H} ${pts} ${W},${H}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', opacity: 0.6 }}>
            <polygon points={area} fill={color} opacity="0.15" />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── Combo Chart ── */
function ComboChart({ labels = [], blogs = [], messages = [] }) {
    const W = 560, H = 160, pL = 36, pR = 12, pT = 12, pB = 30;
    const cW = W - pL - pR, cH = H - pT - pB;
    const max = Math.max(...blogs, ...messages, 1);
    const n = labels.length || 1;
    const bW = Math.max(6, Math.floor(cW / n / 3));

    const x = (i) => pL + (n === 1 ? cW / 2 : (i / (n - 1)) * cW);
    const y = (v) => pT + cH - (v / max) * cH;

    const linePts = (arr) => arr.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    const areaPts = (arr) => {
        const pts = arr.map((v, i) => `${x(i)},${y(v)}`).join(' ');
        return `${x(0)},${pT + cH} ${pts} ${x(n - 1)},${pT + cH}`;
    };

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={pL} y1={pT + cH * (1 - t)} x2={pL + cW} y2={pT + cH * (1 - t)}
                    stroke="#f1f5f9" strokeWidth="1" strokeDasharray={t === 0 ? 'none' : '4,4'} />
            ))}
            {blogs.map((v, i) => {
                const bh = Math.max(2, (v / max) * cH);
                return <rect key={i} x={x(i) - bW - 1} y={pT + cH - bh} width={bW} height={bh}
                    rx="3" fill="url(#grad1)" opacity="0.85" />;
            })}
            {messages.map((v, i) => {
                const bh = Math.max(2, (v / max) * cH);
                return <rect key={i} x={x(i) + 1} y={pT + cH - bh} width={bW} height={bh}
                    rx="3" fill="url(#grad2)" opacity="0.7" />;
            })}
            {n > 1 && <>
                <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                </defs>
                <polygon points={areaPts(blogs)} fill="#6366f1" opacity="0.06" />
                <polyline points={linePts(blogs)} fill="none" stroke="#6366f1" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                <polygon points={areaPts(messages)} fill="#ec4899" opacity="0.06" />
                <polyline points={linePts(messages)} fill="none" stroke="#ec4899" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                {blogs.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                ))}
                {messages.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#ec4899" stroke="#fff" strokeWidth="2" />
                ))}
            </>}
            {labels.map((l, i) => (
                <text key={i} x={x(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Inter,sans-serif">{l}</text>
            ))}
            {[0, Math.round(max / 2), max].map((v, i) => (
                <text key={i} x={pL - 6} y={y(v) + 4} textAnchor="end" fontSize="9" fill="#cbd5e1" fontFamily="Inter,sans-serif">{v}</text>
            ))}
        </svg>
    );
}

/* ── Icons ── */
const IcoUsers      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoBlog       = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoCategory   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IcoPortfolio  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IcoMsg        = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoArrow      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

/* ── Stat Card ── */
function StatCard({ label, value, sub, gradient, icon, sparkData, href, delay = 0, started }) {
    const count = useCounter(value, 1000, started);
    return (
        <Link href={href || '#'} style={{ textDecoration: 'none', display: 'block',
            animationDelay: `${delay}ms`, animation: 'cardIn 0.5s cubic-bezier(0.4,0,0.2,1) both' }}>
            <div style={{
                background: gradient, borderRadius: 18, padding: '1.4rem 1.5rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; }}>

                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -30, left: -10,
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
                    <div style={{
                        width: 46, height: 46, borderRadius: 13,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', backdropFilter: 'blur(8px)',
                    }}>
                        {icon}
                    </div>
                    <Sparkline data={sparkData} color="#fff" />
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {label}
                    </div>
                    {sub && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>{sub}</div>}
                </div>
            </div>
        </Link>
    );
}

/* ── Activity Item ── */
function ActivityDot({ color }) {
    return <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

/* ── Main Component ── */
export default function AdminDashboard({ stats = {}, recent_users = [], recent_messages = [], recent_blogs = [], chart = {} }) {
    const [loaded, setLoaded] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 120);
        const tick = setInterval(() => setTime(new Date()), 60000);
        return () => { clearTimeout(t); clearInterval(tick); };
    }, []);

    const greet = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const chartLabels   = chart.labels   || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartBlogs    = chart.blogs    || [0, 0, 0, 0, 0, 0];
    const chartMessages = chart.messages || [0, 0, 0, 0, 0, 0];

    const cards = [
        { label: 'Total Users',       value: stats.total_users ?? 0,      sub: 'Registered accounts',            gradient: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', icon: <IcoUsers />,     sparkData: [2,4,3,6,5,8,7,9], href: '/admin/users',      delay: 0   },
        { label: 'Blog Posts',         value: stats.total_blogs ?? 0,      sub: 'Published articles',             gradient: 'linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)', icon: <IcoBlog />,      sparkData: [1,3,2,5,4,7,6,8], href: '/admin/blog',       delay: 80  },
        { label: 'Categories',         value: stats.total_categories ?? 0, sub: 'Content groups',                 gradient: 'linear-gradient(135deg,#10b981 0%,#059669 100%)', icon: <IcoCategory />,  sparkData: [1,2,3,3,4,5,5,6], href: '/admin/categories', delay: 160 },
        { label: 'Portfolio Items',    value: stats.total_portfolio ?? 0,  sub: `${stats.featured_projects ?? 0} featured`, gradient: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)', icon: <IcoPortfolio />, sparkData: [1,2,2,3,4,4,5,6], href: '/admin/portfolio', delay: 240 },
        { label: 'Unread Messages',    value: stats.unread_messages ?? 0,  sub: `${stats.total_messages ?? 0} total`, gradient: 'linear-gradient(135deg,#ec4899 0%,#be185d 100%)', icon: <IcoMsg />,      sparkData: [3,5,4,8,6,9,7,10], href: '/admin/messages',  delay: 320 },
    ];

    const sectionStyle = { animation: loaded ? 'sectionIn 0.5s cubic-bezier(0.4,0,0.2,1) both' : 'none' };

    return (
        <AdminLayout title="Dashboard">
            <style>{`
                @keyframes cardIn    { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
                @keyframes sectionIn { from { opacity:0; } to { opacity:1; } }
                @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.7} }
                @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes shimmer   { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }

                .dash-root { font-family:'Inter',system-ui,sans-serif; }
                .dash-section { animation-fill-mode: both; }

                /* Header */
                .dash-header {
                    background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a78bfa 100%);
                    background-size: 200% 200%;
                    animation: gradShift 8s ease infinite;
                    border-radius: 20px;
                    padding: 1.75rem 2rem;
                    margin-bottom: 1.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 1rem;
                    position: relative; overflow: hidden;
                    box-shadow: 0 12px 40px rgba(99,102,241,0.4);
                }
                .dash-header::before {
                    content:''; position:absolute; top:-50px; right:-30px;
                    width:180px; height:180px; border-radius:50%;
                    background:rgba(255,255,255,0.08); pointer-events:none;
                }
                .dash-header::after {
                    content:''; position:absolute; bottom:-60px; left:20%;
                    width:140px; height:140px; border-radius:50%;
                    background:rgba(255,255,255,0.05); pointer-events:none;
                }
                .dash-greet      { font-size:1.75rem; font-weight:900; color:#fff; letter-spacing:-0.04em; position:relative; z-index:1; }
                .dash-greet-sub  { font-size:0.875rem; color:rgba(255,255,255,0.75); margin-top:0.35rem; font-weight:500; position:relative; z-index:1; }
                .dash-date-box   {
                    background:rgba(255,255,255,0.15); backdrop-filter:blur(12px);
                    border:1px solid rgba(255,255,255,0.2); border-radius:14px;
                    padding:0.875rem 1.25rem; text-align:right; position:relative; z-index:1;
                }
                .dash-date-day   { font-size:0.875rem; font-weight:700; color:#fff; }
                .dash-date-time  { font-size:0.75rem; color:rgba(255,255,255,0.65); margin-top:3px; }

                /* Stats grid */
                .dash-stats { display:grid; grid-template-columns:repeat(5,1fr); gap:1.25rem; margin-bottom:1.5rem; }
                @media(max-width:1400px){ .dash-stats{grid-template-columns:repeat(3,1fr);} }
                @media(max-width:900px) { .dash-stats{grid-template-columns:repeat(2,1fr);} }
                @media(max-width:580px) { .dash-stats{grid-template-columns:1fr;} }

                /* Card base */
                .dash-card {
                    background:#fff; border-radius:18px;
                    border:1px solid rgba(226,232,240,0.8);
                    box-shadow:0 4px 20px rgba(15,23,42,0.05);
                    overflow:hidden;
                }
                .dash-card-head {
                    padding:1.1rem 1.5rem;
                    border-bottom:1px solid #f1f5f9;
                    display:flex; align-items:center; justify-content:space-between;
                }
                .dash-card-title { font-size:0.9rem; font-weight:700; color:#0f172a; }
                .dash-card-body  { padding:1.25rem 1.5rem; }

                /* Chart row */
                .dash-chart-row { display:grid; grid-template-columns:2fr 1fr; gap:1.25rem; margin-bottom:1.5rem; }
                @media(max-width:900px){ .dash-chart-row{grid-template-columns:1fr;} }

                /* Legend */
                .chart-legend { display:flex; gap:1.25rem; align-items:center; }
                .legend-item  { display:flex; align-items:center; gap:6px; }
                .legend-dot   { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
                .legend-label { font-size:0.72rem; font-weight:600; color:#64748b; }

                /* Quick stats */
                .quick-grid { display:flex; flex-direction:column; gap:0.75rem; }
                .quick-item {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:1rem 1.25rem;
                    border-radius:12px;
                    text-decoration:none;
                    transition:all 0.2s ease;
                    border:1px solid transparent;
                }
                .quick-item:hover { transform:translateX(3px); border-color:#e0e7ff; }

                /* Tables row */
                .dash-tables { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem; }
                @media(max-width:900px){ .dash-tables{grid-template-columns:1fr;} }

                .dash-table { width:100%; border-collapse:collapse; }
                .dash-table th {
                    text-align:left; padding:0.75rem 1.25rem;
                    font-size:0.67rem; font-weight:700; color:#94a3b8;
                    text-transform:uppercase; letter-spacing:0.1em;
                    background:#f8fafc; border-bottom:1px solid #f1f5f9;
                }
                .dash-table td {
                    padding:0.875rem 1.25rem;
                    border-bottom:1px solid #f8fafc;
                    color:#334155; font-size:0.82rem; font-weight:500;
                    vertical-align:middle;
                }
                .dash-table tr:last-child td { border-bottom:none; }
                .dash-table tr:hover td { background:#fafbff; }

                /* Avatar */
                .u-avatar {
                    width:36px; height:36px; border-radius:10px;
                    display:inline-flex; align-items:center; justify-content:center;
                    font-size:0.8rem; font-weight:800; color:#fff;
                    margin-right:0.75rem; flex-shrink:0;
                }

                /* Badges */
                .badge { display:inline-flex; align-items:center; padding:0.25rem 0.75rem; border-radius:50px; font-size:0.68rem; font-weight:700; letter-spacing:0.04em; }
                .badge-admin  { background:#ede9fe; color:#6d28d9; }
                .badge-user   { background:#e0f2fe; color:#0369a1; }
                .badge-read   { background:#dcfce7; color:#15803d; }
                .badge-unread { background:#fef3c7; color:#b45309; }

                /* View btn */
                .view-btn { font-size:0.72rem; font-weight:700; color:#6366f1; text-decoration:none; padding:0.3rem 0.85rem; border-radius:50px; background:#ede9fe; transition:all 0.2s; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:4px; }
                .view-btn:hover { background:#6366f1; color:#fff; box-shadow:0 4px 12px rgba(99,102,241,0.3); }

                /* Footer */
                .dash-footer { text-align:center; font-size:0.7rem; color:#cbd5e1; padding-top:1.25rem; border-top:1px solid #f1f5f9; font-weight:500; }

                /* Empty state */
                .dash-empty { text-align:center; padding:2.5rem 1rem; color:#cbd5e1; font-size:0.83rem; }
                .dash-empty-icon { font-size:2rem; margin-bottom:0.5rem; opacity:0.4; }
            `}</style>

            <div className="dash-root">

                {/* ── Header ── */}
                <div className="dash-header dash-section" style={{ ...sectionStyle, animationDelay: '0ms' }}>
                    <div>
                        <div className="dash-greet">{greet()}, Nikhil! 👋</div>
                        <div className="dash-greet-sub">Welcome back — here's your platform overview for today.</div>
                    </div>
                    <div className="dash-date-box">
                        <div className="dash-date-day">
                            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="dash-date-time">
                            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="dash-stats dash-section" style={{ ...sectionStyle, animationDelay: '80ms' }}>
                    {cards.map((c, i) => (
                        <StatCard key={i} {...c} started={loaded} />
                    ))}
                </div>

                {/* ── Chart + Quick Stats ── */}
                <div className="dash-chart-row dash-section" style={{ ...sectionStyle, animationDelay: '160ms' }}>

                    {/* Activity Chart */}
                    <div className="dash-card">
                        <div className="dash-card-head">
                            <span className="dash-card-title">Activity Overview — Last 6 Months</span>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <div className="legend-dot" style={{ background: '#6366f1' }} />
                                    <span className="legend-label">Blogs</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot" style={{ background: '#ec4899' }} />
                                    <span className="legend-label">Messages</span>
                                </div>
                            </div>
                        </div>
                        <div className="dash-card-body">
                            <ComboChart labels={chartLabels} blogs={chartBlogs} messages={chartMessages} />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="dash-card">
                        <div className="dash-card-head">
                            <span className="dash-card-title">Quick Actions</span>
                        </div>
                        <div className="dash-card-body">
                            <div className="quick-grid">
                                {[
                                    { label: 'Portfolio',       val: stats.total_portfolio ?? 0,   color: '#f59e0b', bg: '#fffbeb', href: '/admin/portfolio'  },
                                    { label: 'Featured',        val: stats.featured_projects ?? 0, color: '#10b981', bg: '#f0fdf4', href: '/admin/portfolio'  },
                                    { label: 'Categories',      val: stats.total_categories ?? 0,  color: '#6366f1', bg: '#eef2ff', href: '/admin/categories' },
                                    { label: 'Total Messages',  val: stats.total_messages ?? 0,    color: '#ec4899', bg: '#fdf2f8', href: '/admin/messages'   },
                                ].map((q, i) => (
                                    <Link key={i} href={q.href} className="quick-item" style={{ background: q.bg }}>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: q.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{q.label}</div>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.2, marginTop: 2 }}>{q.val}</div>
                                        </div>
                                        <div style={{ color: q.color, opacity: 0.6 }}>
                                            <IcoArrow />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Recent Users + Messages ── */}
                <div className="dash-tables dash-section" style={{ ...sectionStyle, animationDelay: '240ms' }}>

                    {/* Recent Users */}
                    <div className="dash-card">
                        <div className="dash-card-head">
                            <span className="dash-card-title">Recent Users</span>
                            <Link href="/admin/users" className="view-btn">View all <IcoArrow /></Link>
                        </div>
                        <table className="dash-table">
                            <thead>
                                <tr><th>User</th><th>Role</th><th>Joined</th></tr>
                            </thead>
                            <tbody>
                                {recent_users.length > 0 ? recent_users.map((u, i) => {
                                    const colors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899'];
                                    return (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="u-avatar" style={{ background: colors[i % colors.length] }}>
                                                        {u.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.83rem' }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 1 }}>{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                    {u.role === 'admin' ? 'Admin' : 'Member'}
                                                </span>
                                            </td>
                                            <td style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                                {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={3}>
                                        <div className="dash-empty"><div className="dash-empty-icon">👤</div>No users yet</div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Messages */}
                    <div className="dash-card">
                        <div className="dash-card-head">
                            <span className="dash-card-title">Recent Messages</span>
                            <Link href="/admin/messages" className="view-btn">View all <IcoArrow /></Link>
                        </div>
                        <table className="dash-table">
                            <thead>
                                <tr><th>From</th><th>Subject</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {recent_messages.length > 0 ? recent_messages.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.83rem' }}>{m.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 1 }}>{m.email}</div>
                                        </td>
                                        <td style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569', fontSize: '0.8rem' }}>
                                            {m.subject || <span style={{ color: '#cbd5e1' }}>—</span>}
                                        </td>
                                        <td>
                                            <span className={`badge ${m.is_read ? 'badge-read' : 'badge-unread'}`}>
                                                {m.is_read ? 'Read' : 'Unread'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3}>
                                        <div className="dash-empty"><div className="dash-empty-icon">✉️</div>No messages yet</div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent Blogs ── */}
                <div className="dash-card dash-section" style={{ ...sectionStyle, animationDelay: '320ms', marginBottom: '1.5rem' }}>
                    <div className="dash-card-head">
                        <span className="dash-card-title">Recent Blog Posts</span>
                        <Link href="/admin/blog" className="view-btn">View all <IcoArrow /></Link>
                    </div>
                    <table className="dash-table">
                        <thead>
                            <tr><th>#</th><th>Title</th><th>Published</th></tr>
                        </thead>
                        <tbody>
                            {recent_blogs.length > 0 ? recent_blogs.map((b, i) => (
                                <tr key={b.id}>
                                    <td style={{ width: 40 }}>
                                        <div style={{
                                            width: 26, height: 26, borderRadius: 7,
                                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                            color: '#fff', fontWeight: 800, fontSize: '0.72rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>{i + 1}</div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#1e293b', maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {b.title}
                                    </td>
                                    <td style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                        {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3}>
                                    <div className="dash-empty"><div className="dash-empty-icon">📝</div>No blog posts yet</div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className="dash-footer">
                    Nikhil Sharma Admin Panel &bull; {new Date().getFullYear()} &bull; Built with ❤️
                </div>

            </div>
        </AdminLayout>
    );
}
