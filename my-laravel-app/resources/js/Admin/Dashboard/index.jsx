import AdminLayout from '../layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale,
    PointElement, LineElement, BarElement, ArcElement,
    Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale,
    PointElement, LineElement, BarElement, ArcElement,
    Title, Tooltip, Legend, Filler
);

/* ── Icons ─────────────────────────────────────────────────────────────── */
const Ico = {
    Users:      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Blog:       <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    Category:   <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    Portfolio:  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    Message:    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    Services:   <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 11h18"/><path d="M8 11v8"/><path d="M16 11v8"/></svg>,
    Comments:   <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Newsletter: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/><path d="M4 10h16"/></svg>,
    Gallery:    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    Settings:   <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    Email:      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9 2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    Role:       <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M20 8v4"/><path d="M22 10h-4"/></svg>,
    Permission: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2L4 5v6c0 5 3.58 9.74 8 11 4.42-1.26 8-6 8-11V5l-8-3z"/></svg>,
    Scripts:    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 5h16M4 19h16M8 5v14M16 5v14"/></svg>,
    Tags:       <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    BlogCreate: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
};

const avatarColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

/* ── Nav Button Card ─────────────────────────────────────────────────────── */
function NavCard({ href, label, count, icon, color, bg, desc }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div className="nav-card" style={{ '--nc-color': color, '--nc-bg': bg }}>
                <div className="nav-card-icon">{icon}</div>
                <div className="nav-card-body">
                    <div className="nav-card-label">{label}</div>
                    {desc && <div className="nav-card-desc">{desc}</div>}
                </div>
                <svg className="nav-card-arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
            </div>
        </Link>
    );
}

/* ── Main Dashboard ─────────────────────────────────────────────────────── */
export default function AdminDashboard({
    stats = {},
    recent_users = [],
    recent_messages = [],
    recent_blogs = [],
    chart = {},
}) {
    const [now, setNow] = useState(new Date());
    const donutRef = useRef(null);
    const lineRef  = useRef(null);
    const barRef   = useRef(null);
    const chartBlogsRef    = useRef([]);
    const chartMessagesRef = useRef([]);

    useEffect(() => {
        const tick = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(tick);
    }, []);

    const greet = () => {
        const h = now.getHours();
        return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    };

    /* Chart data */
    const chartLabels   = chart.labels   || ['Jan','Feb','Mar','Apr','May','Jun'];
    const chartBlogs    = chart.blogs    || [0,0,0,0,0,0];
    const chartMessages = chart.messages || [0,0,0,0,0,0];

    /* keep refs fresh so animation closures always read latest data */
    useEffect(() => { chartBlogsRef.current    = chartBlogs;    }, [chartBlogs]);
    useEffect(() => { chartMessagesRef.current = chartMessages; }, [chartMessages]);

    /* Donut: continuous slow rotation */
    useEffect(() => {
        let angle = 0;
        const id = setInterval(() => {
            angle = (angle + 1.2) % 360;
            if (donutRef.current) {
                donutRef.current.options.rotation = angle;
                donutRef.current.update('none');
            }
        }, 40);
        return () => clearInterval(id);
    }, []);

    /* Line chart: gentle wave oscillation up/down */
    useEffect(() => {
        let tick = 0;
        const id = setInterval(() => {
            tick += 0.04;
            if (lineRef.current) {
                lineRef.current.data.datasets[0].data = chartBlogsRef.current.map(
                    (v, i) => Math.max(0, v + Math.sin(tick + i * 0.9) * (v > 0 ? v * 0.13 : 0.6))
                );
                lineRef.current.data.datasets[1].data = chartMessagesRef.current.map(
                    (v, i) => Math.max(0, v + Math.cos(tick + i * 0.9) * (v > 0 ? v * 0.11 : 0.4))
                );
                lineRef.current.update('none');
            }
        }, 50);
        return () => clearInterval(id);
    }, []);

    /* Bar chart: gentle wave oscillation up/down */
    useEffect(() => {
        let tick = 0;
        const id = setInterval(() => {
            tick += 0.04;
            if (barRef.current) {
                barRef.current.data.datasets[0].data = chartBlogsRef.current.map(
                    (v, i) => Math.max(0, v + Math.sin(tick + i * 0.9) * (v > 0 ? v * 0.13 : 0.6))
                );
                barRef.current.data.datasets[1].data = chartMessagesRef.current.map(
                    (v, i) => Math.max(0, v + Math.cos(tick + i * 0.9) * (v > 0 ? v * 0.11 : 0.4))
                );
                barRef.current.update('none');
            }
        }, 50);
        return () => clearInterval(id);
    }, []);

    const lineData = {
        labels: chartLabels,
        datasets: [
            { label:'Blog Posts', data:chartBlogs, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.07)', fill:true, tension:0.45, pointBackgroundColor:'#6366f1', pointBorderColor:'#fff', pointBorderWidth:2.5, pointRadius:5, pointHoverRadius:8, borderWidth:2.5 },
            { label:'Messages',   data:chartMessages, borderColor:'#ec4899', backgroundColor:'rgba(236,72,153,0.05)', fill:true, tension:0.45, pointBackgroundColor:'#ec4899', pointBorderColor:'#fff', pointBorderWidth:2.5, pointRadius:5, pointHoverRadius:8, borderWidth:2 },
        ],
    };
    const lineOptions = {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'rgba(15,23,42,0.92)', padding:14, cornerRadius:12, titleColor:'#f1f5f9', bodyColor:'#94a3b8', titleFont:{size:12,weight:'700',family:'Inter,sans-serif'}, bodyFont:{size:11,family:'Inter,sans-serif'}, displayColors:true, boxWidth:8, boxHeight:8, boxPadding:4, borderColor:'rgba(255,255,255,0.08)', borderWidth:1 }},
        scales:{ x:{grid:{display:false}, border:{display:false}, ticks:{font:{size:11,family:'Inter,sans-serif'}, color:'#94a3b8', padding:6}}, y:{grid:{color:'rgba(241,245,249,1)', lineWidth:1}, border:{display:false}, ticks:{font:{size:10,family:'Inter,sans-serif'}, color:'#94a3b8', padding:8, stepSize:1}, beginAtZero:true} },
        animation:{duration:1400, easing:'easeInOutQuart'}, interaction:{mode:'index', intersect:false},
    };

    const barData = {
        labels: chartLabels,
        datasets: [
            { label:'Blog Posts', data:chartBlogs, backgroundColor:'rgba(99,102,241,0.85)', borderRadius:8, borderSkipped:false, hoverBackgroundColor:'#4f46e5' },
            { label:'Messages',   data:chartMessages, backgroundColor:'rgba(236,72,153,0.75)', borderRadius:8, borderSkipped:false, hoverBackgroundColor:'#be185d' },
        ],
    };
    const barOptions = {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'rgba(15,23,42,0.92)', padding:12, cornerRadius:10, titleColor:'#f1f5f9', bodyColor:'#94a3b8', titleFont:{size:12,weight:'700',family:'Inter,sans-serif'}, bodyFont:{size:11,family:'Inter,sans-serif'} }},
        scales:{ x:{grid:{display:false}, border:{display:false}, ticks:{font:{size:11,family:'Inter,sans-serif'}, color:'#94a3b8'}}, y:{grid:{color:'rgba(241,245,249,1)'}, border:{display:false}, ticks:{font:{size:10,family:'Inter,sans-serif'}, color:'#94a3b8', stepSize:1}, beginAtZero:true} },
        animation:{duration:1200, easing:'easeInOutQuart'},
    };

    const totalContent = (stats.total_blogs??0) + (stats.total_portfolio??0) + (stats.total_categories??0) + (stats.total_messages??0);
    const donutData = {
        labels:['Blog Posts','Portfolio','Categories','Messages'],
        datasets:[{ data:[stats.total_blogs??1, stats.total_portfolio??1, stats.total_categories??1, stats.total_messages??1], backgroundColor:['#6366f1','#f59e0b','#10b981','#ec4899'], hoverBackgroundColor:['#4f46e5','#d97706','#059669','#be185d'], borderWidth:0, spacing:3, borderRadius:6 }],
    };
    const donutOptions = {
        responsive:true, maintainAspectRatio:false, cutout:'72%',
        plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'rgba(15,23,42,0.92)', padding:12, cornerRadius:10, titleColor:'#f1f5f9', bodyColor:'#94a3b8', titleFont:{size:12,weight:'700',family:'Inter,sans-serif'} }},
        animation:{duration:1000, animateRotate:true},
    };

    /* All admin module nav cards */
    const navCards = [
        { href:'/admin/categories',   label:'Categories',    desc:'Content groups',     count:stats.total_categories??0,   icon:Ico.Category,   color:'#10b981', bg:'#f0fdf4' },
        { href:'/admin/blog',         label:'Blog Posts',    desc:'Manage articles',    count:stats.total_blogs??0,        icon:Ico.Blog,       color:'#2563eb', bg:'#eff6ff' },
        { href:'/admin/blog/create',  label:'New Blog Post', desc:'Write new article',  count:null,                        icon:Ico.BlogCreate, color:'#6366f1', bg:'#eef2ff' },
        { href:'/admin/gallery',      label:'Gallery',       desc:'Media library',      count:stats.total_gallery??0,      icon:Ico.Gallery,    color:'#db2777', bg:'#fdf2f8' },
        { href:'/admin/comments',     label:'Comments',      desc:'Blog comments',      count:stats.total_comments??0,     icon:Ico.Comments,   color:'#7c3aed', bg:'#f5f3ff' },
        { href:'/admin/portfolio',    label:'Portfolio',     desc:'Projects & work',    count:stats.total_portfolio??0,    icon:Ico.Portfolio,  color:'#d97706', bg:'#fffbeb' },
        { href:'/admin/services',     label:'Services',      desc:'Service offerings',  count:stats.total_services??0,     icon:Ico.Services,   color:'#0d9488', bg:'#f0fdfa' },
        { href:'/admin/messages',     label:'Messages',      desc:'Contact messages',   count:stats.total_messages??0,     icon:Ico.Message,    color:'#ec4899', bg:'#fdf2f8' },
        { href:'/admin/newsletters',  label:'Newsletters',   desc:'Email subscribers',  count:stats.total_newsletters??0,  icon:Ico.Newsletter, color:'#059669', bg:'#f0fdf4' },
        { href:'/admin/users',        label:'Users',         desc:'Registered users',   count:stats.total_users??0,        icon:Ico.Users,      color:'#6366f1', bg:'#eef2ff' },
        { href:'/admin/settings',     label:'Settings',      desc:'General settings',   count:null,                        icon:Ico.Settings,   color:'#64748b', bg:'#f8fafc' },
        { href:'/admin/settings/email', label:'Email Settings', desc:'SMTP & mail config', count:null,                    icon:Ico.Email,      color:'#0284c7', bg:'#f0f9ff' },
        { href:'/admin/settings/user-management/add-role', label:'Add Role', desc:'User roles',   count:null,             icon:Ico.Role,       color:'#8b5cf6', bg:'#f5f3ff' },
        { href:'/admin/settings/user-management/permission', label:'Permission', desc:'Access control', count:null,       icon:Ico.Permission, color:'#ef4444', bg:'#fef2f2' },
        { href:'/admin/settings/scripts', label:'Scripts',   desc:'Custom scripts',     count:null,                        icon:Ico.Scripts,    color:'#f59e0b', bg:'#fffbeb' },
        { href:'/admin/settings/tags',    label:'Tags',      desc:'Content tags',       count:null,                        icon:Ico.Tags,       color:'#06b6d4', bg:'#ecfeff' },
    ];

    return (
        <AdminLayout title="Dashboard" hideSidebar={true}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                @keyframes dashIn    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
                @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

                /* ── Hero ── */
                .d-hero {
                    background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 40%,#9333ea 100%);
                    background-size:300% 300%; animation:gradShift 12s ease infinite, dashIn 0.4s ease both;
                    border-radius:22px; padding:2rem 2.25rem; margin-bottom:1.75rem;
                    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.25rem;
                    position:relative; overflow:hidden;
                    box-shadow:0 20px 60px rgba(99,102,241,0.4), 0 4px 20px rgba(99,102,241,0.2);
                }
                .d-hero::before { content:''; position:absolute; top:-50px; right:-30px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); pointer-events:none; }
                .d-hero::after  { content:''; position:absolute; bottom:-70px; left:12%; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none; }
                .hero-greet { font-size:1.9rem; font-weight:900; color:#fff; letter-spacing:-0.05em; line-height:1.1; position:relative; z-index:1; }
                .hero-sub   { font-size:0.9rem; color:rgba(255,255,255,0.7); margin-top:0.5rem; font-weight:500; position:relative; z-index:1; }
                .hero-pills { display:flex; gap:0.65rem; margin-top:1.1rem; flex-wrap:wrap; position:relative; z-index:1; }
                .hero-pill  { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(255,255,255,0.16); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.25); border-radius:999px; padding:0.4rem 1rem; font-size:0.72rem; font-weight:700; color:#fff; letter-spacing:0.03em; text-decoration:none; transition:all 0.18s; }
                .hero-pill:hover { background:rgba(255,255,255,0.28); transform:translateY(-2px); }
                .hero-pill-dot { width:7px; height:7px; border-radius:50%; background:#fff; opacity:0.8; }
                .hero-date { background:rgba(255,255,255,0.14); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.22); border-radius:18px; padding:1.1rem 1.5rem; text-align:right; position:relative; z-index:1; min-width:190px; }
                .hero-date-day  { font-size:0.875rem; font-weight:800; color:#fff; letter-spacing:-0.01em; }
                .hero-date-time { font-size:0.72rem; color:rgba(255,255,255,0.55); margin-top:5px; }
                .hero-avatar { width:56px; height:56px; border-radius:18px; background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.35); display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:900; color:#fff; position:relative; z-index:1; flex-shrink:0; animation:floatY 4s ease-in-out infinite; }

                /* ── Section Title ── */
                .d-section-title { font-size:1rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem; }
                .d-section-title::before { content:''; display:block; width:4px; height:18px; border-radius:3px; background:linear-gradient(180deg,#6366f1,#9333ea); }

                /* ── Nav Cards Grid ── */
                .d-nav-grid {
                    display:grid; grid-template-columns:repeat(4,1fr);
                    gap:1rem; margin-bottom:1.75rem;
                    animation:dashIn 0.5s ease 0.08s both;
                }
                @media(max-width:1200px){ .d-nav-grid{grid-template-columns:repeat(3,1fr)} }
                @media(max-width:800px) { .d-nav-grid{grid-template-columns:repeat(2,1fr)} }
                @media(max-width:480px) { .d-nav-grid{grid-template-columns:1fr} }

                .nav-card {
                    padding:1.1rem 1.2rem; border-radius:16px;
                    background:var(--nc-bg); border:1.5px solid transparent;
                    display:flex; align-items:center; gap:0.85rem;
                    cursor:pointer; transition:all 0.2s ease;
                    box-shadow:0 1px 4px rgba(0,0,0,0.05);
                    text-decoration:none;
                }
                .nav-card:hover { transform:translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,0.12); border-color:var(--nc-color); }
                .nav-card-icon { width:44px; height:44px; border-radius:12px; background:var(--nc-color); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 12px rgba(0,0,0,0.15); }
                .nav-card-body { flex:1; min-width:0; }
                .nav-card-label { font-size:0.82rem; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .nav-card-desc  { font-size:0.68rem; color:#94a3b8; margin-top:2px; font-weight:500; }
                .nav-card-count { font-size:1.15rem; font-weight:900; color:var(--nc-color); line-height:1.2; margin-top:3px; }
                .nav-card-arr   { opacity:0.35; flex-shrink:0; transition:all 0.15s; color:var(--nc-color); }
                .nav-card:hover .nav-card-arr { opacity:0.85; transform:translateX(3px); }

                /* ── White card ── */
                .d-card { background:#fff; border-radius:20px; border:1px solid #eef2f7; box-shadow:0 2px 8px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05); overflow:hidden; }
                .d-card-head { padding:1.15rem 1.5rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; gap:0.75rem; background:linear-gradient(180deg,#fafbff 0%,#f8fafc 100%); }
                .d-card-title { font-size:0.9rem; font-weight:800; color:#0f172a; letter-spacing:-0.01em; }
                .d-card-body  { padding:1.25rem 1.5rem; }

                /* ── Chart legend ── */
                .chart-legend { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
                .c-leg { display:flex; align-items:center; gap:6px; }
                .c-dot { width:9px; height:9px; border-radius:50%; }
                .c-lbl { font-size:0.72rem; font-weight:600; color:#64748b; }

                /* ── Charts row ── */
                .d-charts { display:grid; grid-template-columns:1fr 1fr 260px; gap:1rem; margin-bottom:1.75rem; animation:dashIn 0.5s ease 0.16s both; }
                @media(max-width:1200px){ .d-charts{grid-template-columns:1fr 1fr} .d-donut-col{display:none} }
                @media(max-width:800px) { .d-charts{grid-template-columns:1fr} }

                .d-donut-wrap   { position:relative; height:180px; }
                .d-donut-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; }
                .d-donut-num    { font-size:1.6rem; font-weight:900; color:#0f172a; letter-spacing:-0.04em; }
                .d-donut-lbl    { font-size:0.65rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px; }
                .d-donut-list   { margin-top:1rem; display:flex; flex-direction:column; gap:0.5rem; }
                .d-donut-row    { display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; }
                .d-donut-rowl   { display:flex; align-items:center; gap:0.5rem; color:#475569; font-weight:500; }
                .d-donut-dot    { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
                .d-donut-val    { font-weight:800; color:#0f172a; font-size:0.82rem; }

                /* ── Tables row ── */
                .d-tables { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.75rem; animation:dashIn 0.5s ease 0.24s both; }
                @media(max-width:900px){ .d-tables{grid-template-columns:1fr} }

                .d-table { width:100%; border-collapse:collapse; }
                .d-table th { padding:0.75rem 1.25rem; text-align:left; font-size:0.65rem; font-weight:800; color:#b0bec8; text-transform:uppercase; letter-spacing:0.12em; background:linear-gradient(180deg,#fafbff 0%,#f8fafc 100%); border-bottom:1px solid #f1f5f9; }
                .d-table td { padding:0.9rem 1.25rem; border-bottom:1px solid #f8fafc; color:#334155; font-size:0.82rem; font-weight:500; vertical-align:middle; }
                .d-table tr:last-child td { border-bottom:none; }
                .d-table tbody tr { transition:background 0.13s; }
                .d-table tbody tr:hover td { background:#fafbff; }

                .u-av { width:36px; height:36px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800; color:#fff; flex-shrink:0; margin-right:0.7rem; }
                .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; font-size:0.67rem; font-weight:700; letter-spacing:0.04em; white-space:nowrap; }
                .badge-admin  { background:#ede9fe; color:#6d28d9; }
                .badge-user   { background:#e0f2fe; color:#0369a1; }
                .badge-read   { background:#dcfce7; color:#15803d; }
                .badge-unread { background:#fef3c7; color:#b45309; }
                .vbtn { font-size:0.72rem; font-weight:700; color:#6366f1; text-decoration:none; padding:5px 12px; border-radius:999px; background:#eef2ff; white-space:nowrap; transition:all 0.18s; display:inline-flex; align-items:center; gap:4px; border:1px solid #e0e7ff; }
                .vbtn:hover { background:#6366f1; color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.35); border-color:#6366f1; }
                .blog-rank { width:26px; height:26px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-weight:800; font-size:0.72rem; display:inline-flex; align-items:center; justify-content:center; }
                .d-blogs { animation:dashIn 0.5s ease 0.3s both; margin-bottom:1.75rem; }
                .empty-tbl { text-align:center; padding:2.5rem 1rem; }
                .empty-ico  { font-size:1.5rem; opacity:0.35; margin-bottom:6px; }
                .empty-txt  { font-size:0.8rem; color:#b0bec8; font-weight:500; }
                .d-footer { text-align:center; font-size:0.7rem; color:#c8d1dc; padding:1.25rem 0 0; border-top:1px solid #f1f5f9; font-weight:500; animation:dashIn 0.5s ease 0.36s both; }
            `}</style>

            {/* ═══════════ Hero ═══════════ */}
            <div className="d-hero">
                <div style={{ position:'relative', zIndex:1 }}>
                    <div className="hero-greet">{greet()}, Nikhil! 👋</div>
                    <div className="hero-sub">Here's your complete platform overview for today.</div>
                    <div className="hero-pills">
                        <Link href="/admin/blog/create" className="hero-pill" style={{ color:'#fff', textDecoration:'none' }}>
                            <span className="hero-pill-dot" />+ New Post
                        </Link>
                        <Link href="/admin/messages" className="hero-pill" style={{ color:'#fff', textDecoration:'none' }}>
                            <span className="hero-pill-dot" />View Messages
                        </Link>
                        <Link href="/admin/portfolio/create" className="hero-pill" style={{ color:'#fff', textDecoration:'none' }}>
                            <span className="hero-pill-dot" />+ Portfolio
                        </Link>
                    </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', position:'relative', zIndex:1 }}>
                    <div className="hero-avatar">N</div>
                    <div className="hero-date">
                        <div className="hero-date-day">
                            {now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                        </div>
                        <div className="hero-date-time">
                            {now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ All Module Nav Buttons ═══════════ */}
            <div className="d-section-title">Quick Navigation</div>
            <div className="d-nav-grid">
                {navCards.map((c, i) => <NavCard key={i} {...c} />)}
            </div>

            {/* ═══════════ Charts ═══════════ */}
            <div className="d-charts">
                <div className="d-card">
                    <div className="d-card-head">
                        <span className="d-card-title">Activity — Last 6 Months</span>
                        <div className="chart-legend">
                            <div className="c-leg"><div className="c-dot" style={{ background:'#6366f1' }}/><span className="c-lbl">Blogs</span></div>
                            <div className="c-leg"><div className="c-dot" style={{ background:'#ec4899' }}/><span className="c-lbl">Messages</span></div>
                        </div>
                    </div>
                    <div className="d-card-body" style={{ height:220 }}><Line ref={lineRef} data={lineData} options={lineOptions}/></div>
                </div>

                <div className="d-card">
                    <div className="d-card-head">
                        <span className="d-card-title">Monthly Breakdown</span>
                        <div className="chart-legend">
                            <div className="c-leg"><div className="c-dot" style={{ background:'#6366f1' }}/><span className="c-lbl">Blogs</span></div>
                            <div className="c-leg"><div className="c-dot" style={{ background:'#ec4899' }}/><span className="c-lbl">Messages</span></div>
                        </div>
                    </div>
                    <div className="d-card-body" style={{ height:220 }}><Bar ref={barRef} data={barData} options={barOptions}/></div>
                </div>

                <div className="d-card d-donut-col">
                    <div className="d-card-head"><span className="d-card-title">Content Mix</span></div>
                    <div className="d-card-body">
                        <div className="d-donut-wrap">
                            <Doughnut ref={donutRef} data={donutData} options={donutOptions}/>
                            <div className="d-donut-center">
                                <div className="d-donut-num">{totalContent}</div>
                                <div className="d-donut-lbl">Total</div>
                            </div>
                        </div>
                        <div className="d-donut-list">
                            {[
                                { label:'Blogs',      val:stats.total_blogs??0,      color:'#6366f1' },
                                { label:'Portfolio',  val:stats.total_portfolio??0,  color:'#f59e0b' },
                                { label:'Categories', val:stats.total_categories??0, color:'#10b981' },
                                { label:'Messages',   val:stats.total_messages??0,   color:'#ec4899' },
                            ].map((r,i) => (
                                <div key={i} className="d-donut-row">
                                    <div className="d-donut-rowl"><div className="d-donut-dot" style={{ background:r.color }}/>{r.label}</div>
                                    <div className="d-donut-val">{r.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ Recent Users + Messages ═══════════ */}
            <div className="d-tables">
                <div className="d-card">
                    <div className="d-card-head">
                        <span className="d-card-title">Recent Users</span>
                        <Link href="/admin/users" className="vbtn">View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
                    </div>
                    <table className="d-table">
                        <thead><tr><th>User</th><th>Role</th><th>Joined</th></tr></thead>
                        <tbody>
                            {recent_users.length > 0 ? recent_users.map((u,i) => (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display:'flex', alignItems:'center' }}>
                                            <div className="u-av" style={{ background:avatarColors[i%avatarColors.length] }}>{u.name?.charAt(0)?.toUpperCase()}</div>
                                            <div>
                                                <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.83rem' }}>{u.name}</div>
                                                <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:1 }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={`badge ${u.role==='admin'?'badge-admin':'badge-user'}`}>{u.role==='admin'?'Admin':'Member'}</span></td>
                                    <td style={{ color:'#94a3b8', fontSize:'0.73rem', whiteSpace:'nowrap' }}>{new Date(u.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3}><div className="empty-tbl"><div className="empty-ico">👤</div><div className="empty-txt">No users yet</div></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-card">
                    <div className="d-card-head">
                        <span className="d-card-title">Recent Messages</span>
                        <Link href="/admin/messages" className="vbtn">View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
                    </div>
                    <table className="d-table">
                        <thead><tr><th>From</th><th>Subject</th><th>Status</th></tr></thead>
                        <tbody>
                            {recent_messages.length > 0 ? recent_messages.map((m,i) => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                                            <div className="u-av" style={{ background:avatarColors[(i+2)%avatarColors.length], marginRight:0 }}>{m.name?.charAt(0)?.toUpperCase()}</div>
                                            <div>
                                                <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.83rem' }}>{m.name}</div>
                                                <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:1 }}>{m.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth:130, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#475569', fontSize:'0.8rem' }}>{m.subject||<span style={{color:'#cbd5e1'}}>—</span>}</td>
                                    <td><span className={`badge ${m.is_read?'badge-read':'badge-unread'}`}>{m.is_read?'Read':'New'}</span></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3}><div className="empty-tbl"><div className="empty-ico">✉️</div><div className="empty-txt">No messages yet</div></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══════════ Recent Blog Posts ═══════════ */}
            <div className="d-card d-blogs">
                <div className="d-card-head">
                    <span className="d-card-title">Recent Blog Posts</span>
                    <Link href="/admin/blog" className="vbtn">View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
                </div>
                <table className="d-table">
                    <thead><tr><th>Title</th><th>Published</th></tr></thead>
                    <tbody>
                        {recent_blogs.length > 0 ? recent_blogs.map((b,i) => (
                            <tr key={b.id}>
                                <td style={{ fontWeight:600, color:'#1e293b', maxWidth:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</td>
                                <td style={{ color:'#94a3b8', fontSize:'0.73rem', whiteSpace:'nowrap' }}>{new Date(b.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={2}><div className="empty-tbl"><div className="empty-ico">📝</div><div className="empty-txt">No blog posts yet</div></div></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-footer">Nikhil Sharma Admin Panel &bull; {new Date().getFullYear()} &bull; Built with ❤️</div>
        </AdminLayout>
    );
}
