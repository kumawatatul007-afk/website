import AdminLayout from '../layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ── Animated counter ── */
function useCounter(target, duration = 1000, active = false) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active || target === 0) { setVal(target); return; }
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, active]);
    return val;
}

/* ── SVG Mini Sparkline ── */
function Sparkline({ data = [], color = 'rgba(255,255,255,0.8)' }) {
    if (data.length < 2) return null;
    const W = 72, H = 28;
    const max = Math.max(...data, 1), min = Math.min(...data, 0), range = max - min || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`).join(' ');
    const area = `0,${H} ${pts} ${W},${H}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
            <polygon points={area} fill={color} opacity="0.15" />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, gradient, icon, sparkData, href, delay = 0, active }) {
    const count = useCounter(value, 900, active);
    return (
        <Link href={href || '#'} style={{ textDecoration: 'none', display: 'block', animationDelay: `${delay}ms`, animation: 'dashCardIn 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="stat-card" style={{ background: gradient }}>
                <div className="stat-card-decor1" />
                <div className="stat-card-decor2" />
                <div className="stat-top">
                    <div className="stat-icon-box">{icon}</div>
                    <Sparkline data={sparkData} />
                </div>
                <div className="stat-count">{count.toLocaleString()}</div>
                <div className="stat-label">{label}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </Link>
    );
}

/* ── Icons ── */
const Ico = {
    Users:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Blog:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    Category:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    Portfolio: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    Message:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Arrow:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    Dot:       <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>,
};

/* ── Main ── */
export default function AdminDashboard({ stats = {}, recent_users = [], recent_messages = [], recent_blogs = [], chart = {} }) {
    const [loaded, setLoaded] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        const tick = setInterval(() => setNow(new Date()), 60000);
        return () => { clearTimeout(t); clearInterval(tick); };
    }, []);

    const greet = () => {
        const h = now.getHours();
        return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
    };

    const chartLabels   = chart.labels   || ['Jan','Feb','Mar','Apr','May','Jun'];
    const chartBlogs    = chart.blogs    || [0,0,0,0,0,0];
    const chartMessages = chart.messages || [0,0,0,0,0,0];

    const lineData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Blog Posts',
                data: chartBlogs,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.08)',
                fill: true,
                tension: 0.45,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2.5,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 2.5,
            },
            {
                label: 'Messages',
                data: chartMessages,
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236,72,153,0.06)',
                fill: true,
                tension: 0.45,
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#fff',
                pointBorderWidth: 2.5,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 2,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15,23,42,0.9)',
                padding: 12,
                cornerRadius: 10,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                titleFont: { size: 12, weight: '700', family: 'Inter,sans-serif' },
                bodyFont: { size: 11, family: 'Inter,sans-serif' },
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                boxPadding: 4,
                borderColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { font: { size: 11, family: 'Inter,sans-serif' }, color: '#94a3b8', padding: 6 },
            },
            y: {
                grid: { color: 'rgba(241,245,249,1)', lineWidth: 1 },
                border: { display: false, dash: [4, 4] },
                ticks: { font: { size: 10, family: 'Inter,sans-serif' }, color: '#94a3b8', padding: 8, stepSize: 1 },
                beginAtZero: true,
            },
        },
        animation: { duration: 1200, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
    };

    const statCards = [
        { label: 'Total Users',    value: stats.total_users ?? 0,      sub: 'Registered accounts',            gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: Ico.Users,     sparkData: [2,4,3,6,5,8,7,9], href: '/admin/users',      delay: 0   },
        { label: 'Blog Posts',     value: stats.total_blogs ?? 0,      sub: 'Published articles',             gradient: 'linear-gradient(135deg,#0ea5e9,#2563eb)', icon: Ico.Blog,      sparkData: [1,3,2,5,4,7,6,8], href: '/admin/blog',       delay: 70  },
        { label: 'Categories',     value: stats.total_categories ?? 0, sub: 'Content groups',                 gradient: 'linear-gradient(135deg,#10b981,#059669)', icon: Ico.Category,  sparkData: [1,2,3,3,4,5,5,6], href: '/admin/categories', delay: 140 },
        { label: 'Portfolio',      value: stats.total_portfolio ?? 0,  sub: `${stats.featured_projects ?? 0} published`, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: Ico.Portfolio, sparkData: [1,2,2,3,4,4,5,6], href: '/admin/portfolio', delay: 210 },
        { label: 'Unread Msgs',    value: stats.unread_messages ?? 0,  sub: `${stats.total_messages ?? 0} total`,       gradient: 'linear-gradient(135deg,#ec4899,#be185d)', icon: Ico.Message,  sparkData: [3,5,4,8,6,9,7,10], href: '/admin/messages', delay: 280 },
    ];

    const avatarColors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899'];

    return (
        <AdminLayout title="Dashboard">
            <style>{`
                @keyframes dashCardIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
                @keyframes dashFadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
                @keyframes gradShift    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

                /* Hero */
                .dash-hero {
                    background: linear-gradient(135deg,#6366f1 0%,#7c3aed 50%,#a78bfa 100%);
                    background-size: 300% 300%;
                    animation: gradShift 10s ease infinite, dashFadeUp 0.4s cubic-bezier(0.22,1,0.36,1);
                    border-radius: 20px;
                    padding: 1.75rem 2rem;
                    margin-bottom: 1.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 1rem;
                    position: relative; overflow: hidden;
                    box-shadow: 0 16px 48px rgba(99,102,241,0.4);
                }
                .dash-hero::before {
                    content:''; position:absolute; top:-60px; right:-40px;
                    width:200px; height:200px; border-radius:50%;
                    background:rgba(255,255,255,0.07); pointer-events:none;
                }
                .dash-hero::after {
                    content:''; position:absolute; bottom:-70px; left:10%;
                    width:160px; height:160px; border-radius:50%;
                    background:rgba(255,255,255,0.05); pointer-events:none;
                }
                .hero-greet     { font-size:1.85rem; font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1.1; position:relative;z-index:1; }
                .hero-sub       { font-size:0.875rem; color:rgba(255,255,255,0.72); margin-top:0.4rem; font-weight:500; position:relative;z-index:1; }
                .hero-date {
                    background:rgba(255,255,255,0.14); backdrop-filter:blur(16px);
                    border:1px solid rgba(255,255,255,0.22); border-radius:16px;
                    padding:1rem 1.5rem; text-align:right; position:relative;z-index:1;
                    min-width:180px;
                }
                .hero-date-day  { font-size:0.875rem; font-weight:700; color:#fff; }
                .hero-date-time { font-size:0.75rem; color:rgba(255,255,255,0.6); margin-top:4px; }

                /* Stat cards */
                .dash-stats {
                    display: grid;
                    grid-template-columns: repeat(5,1fr);
                    gap: 1.1rem;
                    margin-bottom: 1.5rem;
                }
                @media(max-width:1300px){ .dash-stats{grid-template-columns:repeat(3,1fr);} }
                @media(max-width:800px) { .dash-stats{grid-template-columns:repeat(2,1fr);} }
                @media(max-width:500px) { .dash-stats{grid-template-columns:1fr;} }

                .stat-card {
                    border-radius: 18px;
                    padding: 1.4rem 1.5rem 1.25rem;
                    position: relative; overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.14);
                    transition: transform 0.22s ease, box-shadow 0.22s ease;
                    cursor: pointer;
                }
                .stat-card:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(0,0,0,0.22); }
                .stat-card-decor1 {
                    position:absolute; top:-20px; right:-20px;
                    width:96px; height:96px; border-radius:50%;
                    background:rgba(255,255,255,0.1); pointer-events:none;
                }
                .stat-card-decor2 {
                    position:absolute; bottom:-28px; left:-10px;
                    width:80px; height:80px; border-radius:50%;
                    background:rgba(255,255,255,0.06); pointer-events:none;
                }
                .stat-top  { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:0.875rem; position:relative; z-index:1; }
                .stat-icon-box {
                    width:44px; height:44px; border-radius:12px;
                    background:rgba(255,255,255,0.2); backdrop-filter:blur(6px);
                    display:flex; align-items:center; justify-content:center; color:#fff;
                    flex-shrink:0;
                }
                .stat-count  { font-size:2rem; font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1; position:relative; z-index:1; }
                .stat-label  { font-size:0.75rem; font-weight:600; color:rgba(255,255,255,0.85); margin-top:0.35rem; text-transform:uppercase; letter-spacing:0.07em; position:relative; z-index:1; }
                .stat-sub    { font-size:0.68rem; color:rgba(255,255,255,0.55); margin-top:2px; position:relative; z-index:1; }

                /* White card base */
                .dash-wcard {
                    background:#fff; border-radius:18px;
                    border:1px solid #e8edf5;
                    box-shadow:0 2px 16px rgba(15,23,42,0.06);
                    overflow:hidden;
                }
                .dash-wcard-head {
                    padding:1.1rem 1.5rem;
                    border-bottom:1px solid #f1f5f9;
                    display:flex; align-items:center; justify-content:space-between;
                    gap:0.75rem;
                }
                .dash-wcard-title { font-size:0.9rem; font-weight:700; color:#0f172a; }
                .dash-wcard-body  { padding:1.25rem 1.5rem; }

                /* Chart section */
                .dash-chart-row {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 1.1rem;
                    margin-bottom: 1.5rem;
                    animation: dashFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
                }
                @media(max-width:1000px){ .dash-chart-row{grid-template-columns:1fr;} }

                .chart-legend { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
                .legend-dot   { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
                .legend-lbl   { font-size:0.72rem; font-weight:600; color:#64748b; }
                .legend-item  { display:flex; align-items:center; gap:5px; }

                /* Quick actions panel */
                .quick-list  { display:flex; flex-direction:column; gap:0.6rem; }
                .quick-row {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:0.875rem 1rem; border-radius:12px;
                    text-decoration:none; color:inherit;
                    transition:all 0.18s ease;
                    border:1px solid transparent;
                }
                .quick-row:hover { transform:translateX(3px); border-color:currentColor; border-opacity:0.15; }
                .quick-row-label { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; }
                .quick-row-val   { font-size:1.55rem; font-weight:900; color:#0f172a; line-height:1; margin-top:2px; }
                .quick-row-arr   { flex-shrink:0; opacity:0.5; }

                /* Tables section */
                .dash-tables {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.1rem;
                    margin-bottom: 1.5rem;
                    animation: dashFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both;
                }
                @media(max-width:900px){ .dash-tables{grid-template-columns:1fr;} }

                .dash-table { width:100%; border-collapse:collapse; }
                .dash-table th {
                    padding:0.7rem 1.25rem; text-align:left;
                    font-size:0.65rem; font-weight:700; color:#94a3b8;
                    text-transform:uppercase; letter-spacing:0.1em;
                    background:#f8fafc; border-bottom:1px solid #f1f5f9;
                }
                .dash-table td {
                    padding:0.875rem 1.25rem; border-bottom:1px solid #f8fafc;
                    color:#334155; font-size:0.82rem; font-weight:500; vertical-align:middle;
                }
                .dash-table tr:last-child td { border-bottom:none; }
                .dash-table tr:hover td { background:#fafbff; }

                /* Avatar */
                .u-av {
                    width:34px; height:34px; border-radius:10px; flex-shrink:0;
                    display:inline-flex; align-items:center; justify-content:center;
                    font-size:0.78rem; font-weight:800; color:#fff; margin-right:0.65rem;
                }

                /* Badges */
                .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:50px; font-size:0.67rem; font-weight:700; letter-spacing:0.04em; white-space:nowrap; }
                .badge-admin  { background:#ede9fe; color:#6d28d9; }
                .badge-user   { background:#e0f2fe; color:#0369a1; }
                .badge-read   { background:#dcfce7; color:#15803d; }
                .badge-unread { background:#fef3c7; color:#b45309; }

                /* View-all btn */
                .vbtn { font-size:0.72rem; font-weight:700; color:#6366f1; text-decoration:none; padding:4px 12px; border-radius:50px; background:#ede9fe; white-space:nowrap; transition:all 0.18s; display:inline-flex; align-items:center; gap:4px; }
                .vbtn:hover { background:#6366f1; color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.35); }

                /* Blog table */
                .blog-row {
                    animation: dashFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both;
                    margin-bottom: 1.5rem;
                }

                /* Empty */
                .empty-tbl { text-align:center; padding:2.5rem 1rem; color:#cbd5e1; }
                .empty-tbl-ico { font-size:1.75rem; margin-bottom:6px; opacity:0.5; }

                /* Footer */
                .dash-footer {
                    text-align:center; font-size:0.7rem; color:#cbd5e1;
                    padding-top:1.25rem; border-top:1px solid #f1f5f9; font-weight:500;
                    animation: dashFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both;
                }

                /* Blog rank bubble */
                .blog-rank {
                    width:24px; height:24px; border-radius:7px; flex-shrink:0;
                    background:linear-gradient(135deg,#6366f1,#8b5cf6);
                    color:#fff; font-weight:800; font-size:0.7rem;
                    display:inline-flex; align-items:center; justify-content:center;
                }
            `}</style>

            {/* ── Hero ── */}
            <div className="dash-hero">
                <div>
                    <div className="hero-greet">{greet()}, Nikhil! 👋</div>
                    <div className="hero-sub">Here's your platform overview for today.</div>
                </div>
                <div className="hero-date">
                    <div className="hero-date-day">
                        {now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                    </div>
                    <div className="hero-date-time">
                        {now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })}
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="dash-stats">
                {statCards.map((c, i) => (
                    <StatCard key={i} {...c} active={loaded} />
                ))}
            </div>

            {/* ── Chart + Quick Actions ── */}
            <div className="dash-chart-row">

                {/* Line Chart */}
                <div className="dash-wcard">
                    <div className="dash-wcard-head">
                        <span className="dash-wcard-title">Activity Overview — Last 6 Months</span>
                        <div className="chart-legend">
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background:'#6366f1' }} />
                                <span className="legend-lbl">Blogs</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background:'#ec4899' }} />
                                <span className="legend-lbl">Messages</span>
                            </div>
                        </div>
                    </div>
                    <div className="dash-wcard-body" style={{ height: 220 }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dash-wcard">
                    <div className="dash-wcard-head">
                        <span className="dash-wcard-title">Quick Overview</span>
                    </div>
                    <div className="dash-wcard-body">
                        <div className="quick-list">
                            {[
                                { label:'Portfolio',      val: stats.total_portfolio   ?? 0, color:'#f59e0b', bg:'#fffbeb', href:'/admin/portfolio'  },
                                { label:'Published',      val: stats.featured_projects ?? 0, color:'#10b981', bg:'#f0fdf4', href:'/admin/portfolio'  },
                                { label:'Categories',     val: stats.total_categories  ?? 0, color:'#6366f1', bg:'#eef2ff', href:'/admin/categories' },
                                { label:'Total Messages', val: stats.total_messages    ?? 0, color:'#ec4899', bg:'#fdf2f8', href:'/admin/messages'   },
                            ].map((q, i) => (
                                <Link key={i} href={q.href} className="quick-row" style={{ background: q.bg, color: q.color }}>
                                    <div>
                                        <div className="quick-row-label">{q.label}</div>
                                        <div className="quick-row-val">{q.val}</div>
                                    </div>
                                    <div className="quick-row-arr">{Ico.Arrow}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Users + Messages ── */}
            <div className="dash-tables">

                {/* Recent Users */}
                <div className="dash-wcard">
                    <div className="dash-wcard-head">
                        <span className="dash-wcard-title">Recent Users</span>
                        <Link href="/admin/users" className="vbtn">View all {Ico.Arrow}</Link>
                    </div>
                    <table className="dash-table">
                        <thead><tr><th>User</th><th>Role</th><th>Joined</th></tr></thead>
                        <tbody>
                            {recent_users.length > 0 ? recent_users.map((u, i) => (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display:'flex', alignItems:'center' }}>
                                            <div className="u-av" style={{ background: avatarColors[i % avatarColors.length] }}>
                                                {u.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.83rem' }}>{u.name}</div>
                                                <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:1 }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                            {u.role === 'admin' ? 'Admin' : 'Member'}
                                        </span>
                                    </td>
                                    <td style={{ color:'#94a3b8', fontSize:'0.73rem', whiteSpace:'nowrap' }}>
                                        {new Date(u.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3}>
                                    <div className="empty-tbl"><div className="empty-tbl-ico">👤</div>No users yet</div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Recent Messages */}
                <div className="dash-wcard">
                    <div className="dash-wcard-head">
                        <span className="dash-wcard-title">Recent Messages</span>
                        <Link href="/admin/messages" className="vbtn">View all {Ico.Arrow}</Link>
                    </div>
                    <table className="dash-table">
                        <thead><tr><th>From</th><th>Subject</th><th>Status</th></tr></thead>
                        <tbody>
                            {recent_messages.length > 0 ? recent_messages.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.83rem' }}>{m.name}</div>
                                        <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:1 }}>{m.email}</div>
                                    </td>
                                    <td style={{ maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#475569', fontSize:'0.8rem' }}>
                                        {m.subject || <span style={{ color:'#cbd5e1' }}>—</span>}
                                    </td>
                                    <td>
                                        <span className={`badge ${m.is_read ? 'badge-read' : 'badge-unread'}`}>
                                            {m.is_read ? 'Read' : 'New'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3}>
                                    <div className="empty-tbl"><div className="empty-tbl-ico">✉️</div>No messages yet</div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Recent Blogs ── */}
            <div className="dash-wcard blog-row">
                <div className="dash-wcard-head">
                    <span className="dash-wcard-title">Recent Blog Posts</span>
                    <Link href="/admin/blog" className="vbtn">View all {Ico.Arrow}</Link>
                </div>
                <table className="dash-table">
                    <thead><tr><th>#</th><th>Title</th><th>Published</th></tr></thead>
                    <tbody>
                        {recent_blogs.length > 0 ? recent_blogs.map((b, i) => (
                            <tr key={b.id}>
                                <td style={{ width:42 }}><div className="blog-rank">{i+1}</div></td>
                                <td style={{ fontWeight:600, color:'#1e293b', maxWidth:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</td>
                                <td style={{ color:'#94a3b8', fontSize:'0.73rem', whiteSpace:'nowrap' }}>
                                    {new Date(b.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3}>
                                <div className="empty-tbl"><div className="empty-tbl-ico">📝</div>No blog posts yet</div>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Footer ── */}
            <div className="dash-footer">
                Nikhil Sharma Admin Panel &bull; {new Date().getFullYear()} &bull; Built with ❤️
            </div>
        </AdminLayout>
    );
}
