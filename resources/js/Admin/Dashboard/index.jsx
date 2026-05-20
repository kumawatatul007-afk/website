import AdminLayout from '../layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ── Mini Bar Chart (pure SVG, no library needed) ─────────────────────────────
function BarChart({ data = [], color = '#7c3aed', label = '' }) {
    const max = Math.max(...data, 1);
    const W = 340, H = 90, pad = 8, barW = Math.floor((W - pad * 2) / data.length) - 4;
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {data.map((v, i) => {
                const bh = Math.max(4, ((v / max) * (H - 20)));
                const x = pad + i * ((W - pad * 2) / data.length) + 2;
                const y = H - bh - 4;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={bh}
                            rx="4" fill={color} opacity="0.85" />
                        <text x={x + barW / 2} y={H} textAnchor="middle"
                            fontSize="9" fill="#94a3b8">{label}</text>
                    </g>
                );
            })}
        </svg>
    );
}

// ── Sparkline (SVG line chart) ────────────────────────────────────────────────
function Sparkline({ data = [], color = '#7c3aed', fill = 'rgba(124,58,237,0.12)' }) {
    if (!data.length) return null;
    const W = 120, H = 40;
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (v / max) * (H - 4) - 2;
        return `${x},${y}`;
    });
    const polyline = pts.join(' ');
    const area = `${pts[0].split(',')[0]},${H} ` + polyline + ` ${pts[pts.length - 1].split(',')[0]},${H}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <polygon points={area} fill={fill} />
            <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Combined Line+Bar Chart ───────────────────────────────────────────────────
function ComboChart({ labels = [], blogs = [], messages = [] }) {
    const W = 600, H = 160, padL = 30, padR = 16, padT = 12, padB = 28;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const max = Math.max(...blogs, ...messages, 1);
    const n = labels.length;
    const barW = Math.floor(cW / n / 2) - 2;

    const linePoints = (arr) => arr.map((v, i) => {
        const x = padL + (i / (n - 1)) * cW;
        const y = padT + cH - (v / max) * cH;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = (arr) => {
        const pts = arr.map((v, i) => {
            const x = padL + (i / (n - 1)) * cW;
            const y = padT + cH - (v / max) * cH;
            return `${x},${y}`;
        });
        return `${padL},${padT + cH} ${pts.join(' ')} ${padL + cW},${padT + cH}`;
    };

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i}
                    x1={padL} y1={padT + cH * (1 - t)}
                    x2={padL + cW} y2={padT + cH * (1 - t)}
                    stroke="#f1f5f9" strokeWidth="1" />
            ))}

            {/* Bars - blogs */}
            {blogs.map((v, i) => {
                const bh = Math.max(2, (v / max) * cH);
                const x = padL + (i / (n - 1)) * cW - barW - 1;
                return <rect key={i} x={x} y={padT + cH - bh} width={barW} height={bh}
                    rx="3" fill="#7c3aed" opacity="0.7" />;
            })}

            {/* Bars - messages */}
            {messages.map((v, i) => {
                const bh = Math.max(2, (v / max) * cH);
                const x = padL + (i / (n - 1)) * cW + 1;
                return <rect key={i} x={x} y={padT + cH - bh} width={barW} height={bh}
                    rx="3" fill="#a78bfa" opacity="0.5" />;
            })}

            {/* Area - messages line */}
            {n > 1 && <polygon points={areaPoints(messages)} fill="rgba(167,139,250,0.08)" />}
            {n > 1 && <polyline points={linePoints(messages)} fill="none"
                stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Area - blogs line */}
            {n > 1 && <polygon points={areaPoints(blogs)} fill="rgba(124,58,237,0.1)" />}
            {n > 1 && <polyline points={linePoints(blogs)} fill="none"
                stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Dots */}
            {blogs.map((v, i) => {
                const x = padL + (i / (n - 1)) * cW;
                const y = padT + cH - (v / max) * cH;
                return <circle key={i} cx={x} cy={y} r="4" fill="#7c3aed" stroke="#fff" strokeWidth="2" />;
            })}
            {messages.map((v, i) => {
                const x = padL + (i / (n - 1)) * cW;
                const y = padT + cH - (v / max) * cH;
                return <circle key={i} cx={x} cy={y} r="3.5" fill="#a78bfa" stroke="#fff" strokeWidth="2" />;
            })}

            {/* X labels */}
            {labels.map((l, i) => (
                <text key={i}
                    x={padL + (i / (n - 1)) * cW} y={H - 4}
                    textAnchor="middle" fontSize="10" fill="#94a3b8">{l}</text>
            ))}
        </svg>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, gradient, sparkData, sparkColor, sparkFill, href }) {
    return (
        <Link href={href || '#'} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ background: gradient }}>
                <div className="stat-card-top">
                    <div className="stat-spark">
                        <Sparkline data={sparkData} color={sparkColor} fill={sparkFill} />
                    </div>
                </div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </Link>
    );
}

// ── Main Dashboard Component ──────────────────────────────────────────────────
export default function AdminDashboard({ stats = {}, recent_users = [], recent_messages = [], recent_blogs = [], chart = {} }) {
    const [time, setTime] = useState(new Date());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        const tick = setInterval(() => setTime(new Date()), 60000);
        return () => { clearTimeout(t); clearInterval(tick); };
    }, []);

    const greet = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const chartLabels   = chart.labels   || ['Jan','Feb','Mar','Apr','May','Jun'];
    const chartBlogs    = chart.blogs    || [0,0,0,0,0,0];
    const chartMessages = chart.messages || [0,0,0,0,0,0];

    const statCards = [
        {
            label: 'Total Users',
            value: stats.total_users ?? 0,
            sub: 'Registered accounts',
            gradient: 'linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)',
            sparkData: [2,4,3,6,5,8,7,9,stats.total_users ?? 0],
            sparkColor: 'rgba(255,255,255,0.9)',
            sparkFill: 'rgba(255,255,255,0.15)',
            href: '/admin/users',
        },
        {
            label: 'Blog Posts',
            value: stats.total_blogs ?? 0,
            sub: 'Published articles',
            gradient: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)',
            sparkData: [1,3,2,5,4,7,6,8,stats.total_blogs ?? 0],
            sparkColor: 'rgba(255,255,255,0.9)',
            sparkFill: 'rgba(255,255,255,0.15)',
            href: '/admin/blog',
        },
        {
            label: 'Categories',
            value: stats.total_categories ?? 0,
            sub: 'Blog categories',
            gradient: 'linear-gradient(135deg,#059669 0%,#047857 100%)',
            sparkData: [1,2,3,3,4,4,5,5,stats.total_categories ?? 0],
            sparkColor: 'rgba(255,255,255,0.9)',
            sparkFill: 'rgba(255,255,255,0.15)',
            href: '/admin/categories',
        },
        {
            label: 'Portfolio Items',
            value: stats.total_portfolio ?? 0,
            sub: `${stats.featured_projects ?? 0} featured`,
            gradient: 'linear-gradient(135deg,#0891b2 0%,#0e7490 100%)',
            sparkData: [1,2,2,3,4,4,5,6,stats.total_portfolio ?? 0],
            sparkColor: 'rgba(255,255,255,0.9)',
            sparkFill: 'rgba(255,255,255,0.15)',
            href: '/admin/portfolio',
        },
        {
            label: 'Unread Messages',
            value: stats.unread_messages ?? 0,
            sub: `${stats.total_messages ?? 0} total received`,
            gradient: 'linear-gradient(135deg,#db2777 0%,#be185d 100%)',
            sparkData: [3,5,4,8,6,9,7,10,stats.unread_messages ?? 0],
            sparkColor: 'rgba(255,255,255,0.9)',
            sparkFill: 'rgba(255,255,255,0.15)',
            href: '/admin/messages',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                .db * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }

                /* ── Fade-in ── */
                .db { opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease; }
                .db.loaded { opacity: 1; transform: translateY(0); }

                /* ── Header banner ── */
                .db-header {
                    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%);
                    border-radius: 20px;
                    padding: 1.75rem 2rem;
                    margin-bottom: 1.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 12px 40px rgba(124,58,237,0.35);
                }
                .db-header::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -40px;
                    width: 200px; height: 200px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                }
                .db-header::after {
                    content: '';
                    position: absolute;
                    bottom: -50px; left: 25%;
                    width: 150px; height: 150px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                }
                .db-greet { font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; position: relative; z-index: 1; }
                .db-greet-sub { font-size: 0.88rem; color: rgba(255,255,255,0.75); margin-top: 0.3rem; font-weight: 500; position: relative; z-index: 1; }
                .db-date-box {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 14px;
                    padding: 0.875rem 1.25rem;
                    text-align: right;
                    position: relative; z-index: 1;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .db-date-day { font-size: 0.88rem; font-weight: 700; color: #fff; }
                .db-date-time { font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 0.2rem; }

                /* ── Stat cards ── */
                .db-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.25rem; margin-bottom: 1.75rem; }
                @media (max-width: 1200px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 900px)  { .db-stats { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 600px)  { .db-stats { grid-template-columns: 1fr; } }

                .stat-card {
                    border-radius: 18px;
                    padding: 1.4rem 1.5rem 1.2rem;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 6px 24px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: hidden;
                }
                .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
                .stat-card-top { display: flex; align-items: flex-start; justify-content: flex-end; margin-bottom: 1rem; }
                .stat-spark { opacity: 0.9; }
                .stat-value { font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1; margin-bottom: 0.35rem; }
                .stat-label { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.06em; }
                .stat-sub { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 0.25rem; }

                /* ── Chart section ── */
                .db-chart-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; margin-bottom: 1.75rem; }
                @media (max-width: 900px) { .db-chart-row { grid-template-columns: 1fr; } }

                .db-card {
                    background: #fff;
                    border-radius: 18px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 20px rgba(15,23,42,0.06);
                    overflow: hidden;
                }
                .db-card-head {
                    padding: 1.1rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .db-card-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
                .db-card-body { padding: 1.25rem 1.5rem; }

                /* Legend */
                .chart-legend { display: flex; gap: 1.25rem; align-items: center; }
                .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
                .legend-label { font-size: 0.75rem; font-weight: 600; color: #64748b; }

                /* ── Quick stats mini cards ── */
                .db-mini-grid { display: flex; flex-direction: column; gap: 0.875rem; }
                .db-mini-card {
                    background: linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%);
                    border-radius: 14px;
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 1px solid #ede9fe;
                    transition: transform 0.15s;
                    cursor: pointer;
                    text-decoration: none;
                }
                .db-mini-card:hover { transform: translateX(4px); }
                .db-mini-label { font-size: 0.78rem; font-weight: 600; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.06em; }
                .db-mini-val { font-size: 1.5rem; font-weight: 800; color: #4c1d95; margin-top: 0.1rem; }

                /* ── Tables ── */
                .db-tables { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.75rem; }
                @media (max-width: 900px) { .db-tables { grid-template-columns: 1fr; } }

                .db-table { width: 100%; border-collapse: collapse; }
                .db-table th {
                    text-align: left;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    background: #f8fafc;
                    border-bottom: 1px solid #f1f5f9;
                }
                .db-table td {
                    padding: 0.875rem 1.25rem;
                    border-bottom: 1px solid #f8fafc;
                    color: #334155;
                    font-size: 0.83rem;
                    font-weight: 500;
                    vertical-align: middle;
                }
                .db-table tr:last-child td { border-bottom: none; }
                .db-table tr:hover td { background: #faf9ff; }

                /* Badges */
                .badge {
                    display: inline-flex; align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                }
                .badge-admin   { background: #ede9fe; color: #6d28d9; }
                .badge-user    { background: #e0f2fe; color: #0369a1; }
                .badge-read    { background: #dcfce7; color: #15803d; }
                .badge-unread  { background: #fef3c7; color: #b45309; }

                /* Avatar */
                .u-avatar {
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #7c3aed, #6d28d9);
                    display: inline-flex; align-items: center; justify-content: center;
                    font-size: 0.78rem; font-weight: 800; color: #fff;
                    margin-right: 0.65rem; flex-shrink: 0;
                }

                /* View all btn */
                .view-btn {
                    font-size: 0.75rem; font-weight: 700;
                    color: #7c3aed;
                    text-decoration: none;
                    padding: 0.35rem 0.9rem;
                    border-radius: 50px;
                    background: #ede9fe;
                    transition: all 0.2s;
                    border: none; cursor: pointer;
                }
                .view-btn:hover { background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #fff; }

                /* ── Recent blogs full-width ── */
                .db-blogs { margin-bottom: 1.75rem; }

                /* ── Footer ── */
                .db-footer {
                    text-align: center;
                    font-size: 0.72rem;
                    color: #cbd5e1;
                    padding-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                    font-weight: 500;
                }
            `}</style>

            <div className={`db${loaded ? ' loaded' : ''}`}>

                {/* ── Header ── */}
                <div className="db-header">
                    <div>
                        <div className="db-greet">{greet()}, Admin! </div>
                        <div className="db-greet-sub">Here's your platform overview for today.</div>
                    </div>
                    <div className="db-date-box">
                        <div className="db-date-day">
                            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="db-date-time">
                            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="db-stats">
                    {statCards.map((c, i) => (
                        <StatCard key={i} {...c} />
                    ))}
                </div>

                {/* ── Chart + Quick Stats ── */}
                <div className="db-chart-row">
                    {/* Main combo chart */}
                    <div className="db-card">
                        <div className="db-card-head">
                            <span className="db-card-title">Activity Overview — Last 6 Months</span>
                            <div className="chart-legend">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className="legend-dot" style={{ background: '#7c3aed' }} />
                                    <span className="legend-label">Blogs</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className="legend-dot" style={{ background: '#a78bfa' }} />
                                    <span className="legend-label">Messages</span>
                                </div>
                            </div>
                        </div>
                        <div className="db-card-body">
                            <ComboChart labels={chartLabels} blogs={chartBlogs} messages={chartMessages} />
                        </div>
                    </div>

                    {/* Quick stats mini */}
                    <div className="db-card">
                        <div className="db-card-head">
                            <span className="db-card-title">Quick Stats</span>
                        </div>
                        <div className="db-card-body">
                            <div className="db-mini-grid">
                                <Link href="/admin/portfolio" className="db-mini-card">
                                    <div>
                                        <div className="db-mini-label">Portfolio</div>
                                        <div className="db-mini-val">{stats.total_portfolio ?? 0}</div>
                                    </div>
                                </Link>
                                <Link href="/admin/portfolio" className="db-mini-card">
                                    <div>
                                        <div className="db-mini-label">Featured Projects</div>
                                        <div className="db-mini-val">{stats.featured_projects ?? 0}</div>
                                    </div>
                                </Link>
                                <Link href="/admin/categories" className="db-mini-card">
                                    <div>
                                        <div className="db-mini-label">Categories</div>
                                        <div className="db-mini-val">{stats.total_categories ?? 0}</div>
                                    </div>
                                </Link>
                                <Link href="/admin/messages" className="db-mini-card">
                                    <div>
                                        <div className="db-mini-label">Total Messages</div>
                                        <div className="db-mini-val">{stats.total_messages ?? 0}</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Recent Users + Messages ── */}
                <div className="db-tables">
                    {/* Recent Users */}
                    <div className="db-card">
                        <div className="db-card-head">
                            <span className="db-card-title">Recent Users</span>
                            <Link href="/admin/users" className="view-btn">View all →</Link>
                        </div>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_users.length > 0 ? recent_users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className="u-avatar">{u.name?.charAt(0)?.toUpperCase()}</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.83rem' }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                {u.role === 'admin' ? 'Admin' : 'Member'}
                                            </span>
                                        </td>
                                        <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                                            {new Date(u.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>No users yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Messages */}
                    <div className="db-card">
                        <div className="db-card-head">
                            <span className="db-card-title">Recent Messages</span>
                            <Link href="/admin/messages" className="view-btn">View all →</Link>
                        </div>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_messages.length > 0 ? recent_messages.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.83rem' }}>{m.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{m.email}</div>
                                        </td>
                                        <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                                            {m.subject || '—'}
                                        </td>
                                        <td>
                                            <span className={`badge ${m.is_read ? 'badge-read' : 'badge-unread'}`}>
                                                {m.is_read ? 'Read' : 'Unread'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>No messages yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent Blog Posts ── */}
                <div className="db-blogs db-card">
                    <div className="db-card-head">
                        <span className="db-card-title">Recent Blog Posts</span>
                        <Link href="/admin/blog" className="view-btn">View all →</Link>
                    </div>
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Published</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_blogs.length > 0 ? recent_blogs.map((b, i) => (
                                <tr key={b.id}>
                                    <td style={{ color: '#c4b5fd', fontWeight: 700, width: 40 }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600, color: '#1e293b', maxWidth: 480, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {b.title}
                                    </td>
                                    <td style={{ color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                        {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>No blog posts yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className="db-footer">Admin Panel &bull; Nikhil Sharma &bull; {new Date().getFullYear()}</div>
            </div>
        </AdminLayout>
    );
}
