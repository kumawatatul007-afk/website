import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { ShimmerTableRows } from '../../components/ShimmerLoader';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconClose   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconLink    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IconAlert   = () => <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconComment = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconHome    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevron = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconBlog    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;

/* ── Delete Modal ───────────────────────────────────────────────────────── */
function DeleteModal({ comment, onClose, onConfirm, loading }) {
    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose, loading]);

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                animation: 'cmOverlayIn 0.2s ease both', padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{
                background: '#fff', borderRadius: '24px', padding: '2.25rem',
                width: '100%', maxWidth: '440px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'cmPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '20px',
                    background: 'linear-gradient(135deg,#fee2e2,#fecaca)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 20px rgba(239,68,68,0.2)',
                }}>
                    <IconAlert />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', letterSpacing: '-0.3px' }}>
                    Delete Comment?
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65, marginBottom: '2rem' }}>
                    You're about to permanently delete the comment by{' '}
                    <strong style={{ color: '#0f172a', background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                        {comment?.name}
                    </strong>.
                    {' '}This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.875rem 1.25rem', borderRadius: '14px',
                            border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569',
                            fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', transition: 'all 0.15s', opacity: loading ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.875rem 1.25rem', borderRadius: '14px', border: 'none',
                            background: loading ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                            color: '#fff', fontSize: '0.875rem', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                            boxShadow: loading ? 'none' : '0 4px 14px rgba(239,68,68,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            transition: 'box-shadow 0.15s',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.55)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.4)'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'cmSpin 0.65s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                                Deleting…
                            </>
                        ) : 'Delete'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Edit Modal ─────────────────────────────────────────────────────────── */
function EditModal({ comment, onClose }) {
    const [form, setForm]     = useState({
        name:        comment.name        ?? '',
        email:       comment.email       ?? '',
        website:     comment.website     ?? '',
        description: comment.description ?? '',
        is_publish:  comment.is_publish  ?? 1,
    });
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [loading, onClose]);

    const inpStyle = (field) => ({
        width:'100%', padding:'.6rem .8rem', fontFamily:'inherit',
        border:`1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
        borderRadius:'10px', fontSize:'.875rem', color:'#0f172a',
        background:'#fff', outline:'none', boxSizing:'border-box',
        transition:'border-color .15s,box-shadow .15s',
    });
    const lbl = { display:'block', fontSize:'.68rem', fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.3rem' };
    const errTxt = { display:'block', fontSize:'.75rem', color:'#ef4444', marginTop:'.2rem' };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.put(`/admin/comments/${comment.id}`, form, {
            preserveScroll: true,
            onSuccess: () => { setLoading(false); onClose(); },
            onError:   (errs) => { setErrors(errs); setLoading(false); },
            onFinish:  () => setLoading(false),
        });
    };

    return createPortal(
        <div
            style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', animation:'cmOverlayIn .2s ease both', padding:'1rem' }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{ background:'linear-gradient(145deg,#ffffff,#f8faff)', borderRadius:'20px', padding:'1.5rem', width:'100%', maxWidth:'480px', boxShadow:'0 24px 60px rgba(15,23,42,0.22), 0 0 0 1px rgba(99,102,241,0.08)', animation:'cmPanelIn .3s cubic-bezier(.22,1,.36,1) both' }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem', paddingBottom:'1rem', borderBottom:'1.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                        <div style={{ width:34, height:34, borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div>
                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:800, color:'#0f172a', lineHeight:1.2 }}>Edit Comment</h3>
                            <span style={{ fontSize:'.68rem', background:'#ede9fe', color:'#6366f1', padding:'.1rem .45rem', borderRadius:'5px', fontWeight:700 }}>ID: {comment.id}</span>
                        </div>
                    </div>
                    <button onClick={() => !loading && onClose()} style={{ width:30, height:30, borderRadius:'9px', border:'1.5px solid #e2e8f0', background:'#fff', color:'#94a3b8', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all .15s' }}>
                        <IconClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name + Email */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.65rem', marginBottom:'.65rem' }}>
                        <div>
                            <label style={lbl}>Name *</label>
                            <input style={inpStyle('name')} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Commenter name" disabled={loading} />
                            {errors.name && <span style={errTxt}>{errors.name}</span>}
                        </div>
                        <div>
                            <label style={lbl}>Email</label>
                            <input type="email" style={inpStyle('email')} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="email@example.com" disabled={loading} />
                            {errors.email && <span style={errTxt}>{errors.email}</span>}
                        </div>
                    </div>

                    {/* Website */}
                    <div style={{ marginBottom:'.65rem' }}>
                        <label style={lbl}>Website</label>
                        <input style={inpStyle('website')} value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))} placeholder="https://example.com" disabled={loading} />
                    </div>

                    {/* Comment text */}
                    <div style={{ marginBottom:'.65rem' }}>
                        <label style={lbl}>Comment *</label>
                        <textarea
                            style={{ ...inpStyle('description'), resize:'none', minHeight:90, lineHeight:1.6 }}
                            value={form.description}
                            onChange={e => setForm(f => ({...f, description: e.target.value}))}
                            placeholder="Comment text…"
                            disabled={loading}
                        />
                        {errors.description && <span style={errTxt}>{errors.description}</span>}
                    </div>

                    {/* Publish toggle */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.65rem .875rem', borderRadius:'12px', border:'1.5px solid', borderColor: form.is_publish ? 'rgba(34,197,94,.3)' : '#e2e8f0', background: form.is_publish ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : '#f8fafc', marginBottom:'.875rem', transition:'all .2s' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                            <span style={{ fontSize:'1rem' }}>{form.is_publish ? '✅' : '🔒'}</span>
                            <div>
                                <div style={{ fontSize:'.82rem', fontWeight:700, color: form.is_publish ? '#15803d' : '#374151', lineHeight:1.2 }}>{form.is_publish ? 'Published' : 'Hidden'}</div>
                                <div style={{ fontSize:'.68rem', color:'#94a3b8' }}>{form.is_publish ? 'Visible on blog post' : 'Not shown publicly'}</div>
                            </div>
                        </div>
                        <label style={{ position:'relative', width:44, height:24, flexShrink:0, cursor:'pointer' }}>
                            <input type="checkbox" checked={!!form.is_publish} onChange={e => setForm(f => ({...f, is_publish: e.target.checked ? 1 : 0}))} style={{ opacity:0, width:0, height:0 }} />
                            <span style={{ position:'absolute', cursor:'pointer', inset:0, background: form.is_publish ? '#22c55e' : '#cbd5e1', borderRadius:24, transition:'background .25s' }}>
                                <span style={{ position:'absolute', height:18, width:18, left:3, bottom:3, background:'#fff', borderRadius:'50%', transition:'transform .25s', transform: form.is_publish ? 'translateX(20px)' : 'none', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
                            </span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div style={{ display:'flex', gap:'.6rem' }}>
                        <button type="button" onClick={() => !loading && onClose()} disabled={loading}
                            style={{ flex:1, padding:'.75rem', borderRadius:'12px', border:'1.5px solid #e2e8f0', background:'#fff', color:'#475569', fontSize:'.875rem', fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', opacity:loading?.5:1, transition:'all .15s' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            style={{ flex:2, padding:'.75rem', borderRadius:'12px', border:'none', background:loading?'#a5b4fc':'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontSize:'.875rem', fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', boxShadow:loading?'none':'0 4px 14px rgba(99,102,241,.35)', transition:'all .15s' }}>
                            {loading ? (
                                <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.35)', borderTopColor:'#fff', borderRadius:'50%', animation:'cmSpin .65s linear infinite', display:'inline-block' }} />Saving…</>
                            ) : (
                                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function AdminCommentsIndex({ comments, blogs, filters }) {
    const [search,        setSearch]        = useState(filters?.search   ?? '');
    const [blogId,        setBlogId]        = useState(filters?.blog_id  ?? '');
    const [perPage,       setPerPage]       = useState(filters?.per_page ? Number(filters.per_page) : 15);
    const [shimmer,       setShimmer]       = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [editModal,     setEditModal]     = useState(false);
    const [editComment,   setEditComment]   = useState(null);
    const [deleteModal,   setDeleteModal]   = useState(false);
    const [deleteComment, setDeleteComment] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 700);
        return () => clearTimeout(t);
    }, []);

    const applyFilters = (overrides = {}) =>
        router.get('/admin/comments', {
            search, blog_id: blogId, per_page: perPage,
            ...overrides,
        }, { preserveState: true, replace: true });

    const openDelete  = (c)  => { setDeleteComment(c); setDeleteModal(true); };
    const closeDelete = ()   => { setDeleteModal(false); setDeleteComment(null); };
    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/comments/${deleteComment.id}`, {
            preserveScroll: true,
            onSuccess: () => { closeDelete(); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    const displayData = comments?.data ?? [];
    const totalCount  = comments?.total ?? displayData.length;
    const blogMap     = Object.fromEntries((blogs ?? []).map(b => [b.id, b.title]));

    return (
        <AdminLayout title="Blog Comments">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

                @keyframes cmFadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes cmRowIn     { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
                @keyframes cmOverlayIn { from{opacity:0} to{opacity:1} }
                @keyframes cmPanelIn   { from{opacity:0;transform:translateY(28px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes cmSpin      { to{transform:rotate(360deg)} }
                @keyframes cmPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.25)} 50%{box-shadow:0 0 0 6px rgba(99,102,241,0)} }

                .cm-page { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; }

                /* Header */
                .cm-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:1.75rem; flex-wrap:wrap; gap:1rem; animation:cmFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .cm-breadcrumb { display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; font-weight:500; color:#94a3b8; margin-bottom:0.45rem; }
                .cm-breadcrumb .bc-link { color:#6366f1; font-weight:600; text-decoration:none; }
                .cm-breadcrumb .bc-link:hover { text-decoration:underline; }
                .cm-title { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; font-size:1.65rem; font-weight:900; color:#0f172a; letter-spacing:-0.8px; line-height:1.15; }
                .cm-count-chip { display:inline-flex; align-items:center; gap:0.4rem; font-size:0.72rem; font-weight:700; color:#4f46e5; background:linear-gradient(135deg,#eef2ff,#e0e7ff); border:1px solid rgba(99,102,241,0.2); padding:0.32rem 0.8rem; border-radius:999px; }
                .cm-count-chip::before { content:''; width:6px; height:6px; border-radius:50%; background:#6366f1; display:inline-block; animation:cmPulse 2s ease infinite; }
                .cm-subtitle { font-size:0.875rem; color:#94a3b8; font-weight:400; margin-top:0.35rem; }
                .cm-blog-btn { display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 1.35rem; border-radius:14px; background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%); color:#fff; border:none; cursor:pointer; font-size:0.875rem; font-weight:700; font-family:inherit; text-decoration:none; box-shadow:0 4px 14px rgba(99,102,241,0.4); transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .cm-blog-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.55); }

                /* Toolbar */
                .cm-toolbar { display:flex; gap:0.875rem; margin-bottom:1.5rem; flex-wrap:wrap; align-items:center; animation:cmFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both; }
                .cm-search-wrap { position:relative; flex:1; min-width:220px; }
                .cm-search-ico { position:absolute; left:1rem; top:50%; transform:translateY(-50%); pointer-events:none; color:#cbd5e1; display:flex; align-items:center; transition:color 0.2s; }
                .cm-search-ico.focused { color:#6366f1; }
                .cm-search { width:100%; padding:0.9rem 1rem 0.9rem 2.85rem; border:1.5px solid #e8ecf2; border-radius:14px; font-size:0.875rem; font-family:inherit; background:#fff; color:#0f172a; outline:none; box-shadow:0 1px 4px rgba(15,23,42,0.05); transition:border-color 0.2s,box-shadow 0.2s; }
                .cm-search::placeholder { color:#c8d1dc; }
                .cm-search:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.13),0 1px 4px rgba(15,23,42,0.05); }
                .cm-select { padding:0.9rem 2.75rem 0.9rem 1.1rem; border:1.5px solid #e8ecf2; border-radius:14px; font-size:0.875rem; font-family:inherit; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 1.1rem center; color:#475569; appearance:none; -webkit-appearance:none; outline:none; cursor:pointer; box-shadow:0 1px 4px rgba(15,23,42,0.05); transition:border-color 0.2s,box-shadow 0.2s; white-space:nowrap; }
                .cm-select:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.13); }
                .cm-btn-search { display:inline-flex; align-items:center; gap:0.5rem; padding:0.9rem 1.65rem; border-radius:14px; background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%); color:#fff; border:none; font-size:0.875rem; font-weight:700; font-family:inherit; cursor:pointer; white-space:nowrap; box-shadow:0 4px 16px rgba(99,102,241,0.4); transition:transform 0.15s,box-shadow 0.15s; }
                .cm-btn-search:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(99,102,241,0.55); }

                /* Card */
                .cm-card { background:#fff; border-radius:24px; border:1px solid #eef2f7; overflow:hidden; box-shadow:0 0 0 1px rgba(15,23,42,0.03),0 2px 4px rgba(15,23,42,0.04),0 8px 24px rgba(15,23,42,0.06),0 24px 64px rgba(15,23,42,0.04); animation:cmFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both; }
                .cm-card-header { display:flex; align-items:center; justify-content:space-between; padding:1.1rem 1.75rem; border-bottom:1px solid #f1f5f9; background:linear-gradient(180deg,#fafbff 0%,#f8fafc 100%); }
                .card-lbl  { font-size:0.72rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.12em; }
                .card-meta { font-size:0.8rem; color:#cbd5e1; font-weight:500; }

                /* Table */
                .cm-table-wrap { overflow-x:auto; }
                .cm-table { width:100%; border-collapse:collapse; font-size:0.875rem; min-width:680px; }
                .cm-table thead tr { background:linear-gradient(180deg,#fafbff 0%,#f7f9fc 100%); }
                .cm-table th { text-align:left; padding:1.05rem 1.4rem; font-size:0.695rem; font-weight:800; color:#b0bec8; text-transform:uppercase; letter-spacing:0.11em; border-bottom:1px solid #f1f5f9; white-space:nowrap; }
                .cm-table td { padding:1rem 1.4rem; border-bottom:1px solid #f8fafc; color:#0f172a; vertical-align:top; }
                .cm-table tbody tr:last-child td { border-bottom:none; }
                .cm-table tbody tr { transition:background 0.14s; animation:cmRowIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
                .cm-table tbody tr:hover td { background:#fafbff; }
                .cm-table tbody tr:nth-child(1)  { animation-delay:0.15s; }
                .cm-table tbody tr:nth-child(2)  { animation-delay:0.19s; }
                .cm-table tbody tr:nth-child(3)  { animation-delay:0.23s; }
                .cm-table tbody tr:nth-child(4)  { animation-delay:0.27s; }
                .cm-table tbody tr:nth-child(5)  { animation-delay:0.31s; }
                .cm-table tbody tr:nth-child(6)  { animation-delay:0.35s; }
                .cm-table tbody tr:nth-child(7)  { animation-delay:0.39s; }
                .cm-table tbody tr:nth-child(8)  { animation-delay:0.43s; }
                .cm-table tbody tr:nth-child(9)  { animation-delay:0.47s; }
                .cm-table tbody tr:nth-child(10) { animation-delay:0.51s; }

                /* Cells */
                .cm-user-wrap  { display:flex; align-items:center; gap:0.65rem; }
                .cm-avatar     { width:36px; height:36px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:800; color:#fff; }
                .cm-user-name  { font-weight:700; color:#0f172a; font-size:0.875rem; }
                .cm-user-email { font-size:0.72rem; color:#94a3b8; margin-top:1px; }
                .cm-blog-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-size:0.82rem; font-weight:600; color:#475569; line-height:1.45; }
                .cm-blog-badge { display:inline-flex; align-items:center; gap:0.35rem; background:#eef2ff; color:#4f46e5; border-radius:999px; padding:0.25rem 0.65rem; font-size:0.67rem; font-weight:700; margin-top:4px; border:1px solid #e0e7ff; text-decoration:none; }
                .cm-blog-badge:hover { background:#e0e7ff; }
                .cm-phone      { font-size:0.82rem; color:#475569; font-weight:500; white-space:nowrap; }
                .cm-website-link { display:inline-flex; align-items:center; gap:0.3rem; color:#6366f1; font-size:0.78rem; font-weight:600; text-decoration:none; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .cm-website-link:hover { text-decoration:underline; color:#4f46e5; }
                .cm-desc       { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; font-size:0.8rem; color:#64748b; line-height:1.6; max-width:260px; }

                /* Action */
                .cm-actions   { display:flex; align-items:center; justify-content:center; gap:0.375rem; flex-wrap:nowrap; }
                .btn-icon-edit { width:32px; height:32px; min-width:32px; border-radius:9px; border:1.5px solid #e8ecf2; background:#fff; color:#64748b; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
                .btn-icon-edit:hover { background:#f1f5f9; border-color:#cbd5e1; color:#0f172a; transform:translateY(-1px); box-shadow:0 4px 10px rgba(15,23,42,0.1); }
                .btn-icon-del { width:32px; height:32px; min-width:32px; border-radius:9px; border:1.5px solid #fee2e2; background:#fff5f5; color:#f87171; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
                .btn-icon-del:hover { background:#fef2f2; border-color:#fca5a5; color:#ef4444; transform:translateY(-1px); box-shadow:0 4px 12px rgba(239,68,68,0.18); }

                /* Empty */
                .cm-empty       { text-align:center; padding:5.5rem 2rem; animation:cmFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
                .cm-empty-icon  { width:84px; height:84px; border-radius:26px; background:linear-gradient(135deg,#eef2ff,#e0e7ff); border:1px solid rgba(99,102,241,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 1.75rem; box-shadow:0 8px 24px rgba(99,102,241,0.15); }
                .cm-empty-title { font-size:1.1rem; font-weight:800; color:#1e293b; letter-spacing:-0.3px; margin-bottom:0.5rem; }
                .cm-empty-sub   { font-size:0.875rem; color:#94a3b8; max-width:300px; margin:0 auto; line-height:1.6; }

                /* Footer */
                .cm-footer      { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.75rem; border-top:1px solid #f1f5f9; background:linear-gradient(180deg,transparent 0%,#fafbff 100%); flex-wrap:wrap; gap:0.75rem; }
                .cm-footer-info { font-size:0.8rem; color:#b0bec8; font-weight:500; }
                .cm-footer-info strong { color:#64748b; font-weight:700; }

                @media(max-width:900px){ .col-website{display:none} }
                @media(max-width:700px){ .col-phone{display:none} }
                @media(max-width:560px){ .cm-footer{justify-content:center} .cm-footer-info{display:none} }
            `}</style>

            <div className="cm-page">

                {/* ═══════════ Header ═══════════ */}
                <div className="cm-header">
                    <div>
                        <div className="cm-breadcrumb">
                            <IconHome />
                            Admin
                            <IconChevron />
                            <Link href="/admin/blog" className="bc-link">Blogs</Link>
                            <IconChevron />
                            <span style={{ color: '#6366f1', fontWeight: 600 }}>Comments</span>
                        </div>
                        <h2 className="cm-title">
                            Blog Comments
                            {totalCount > 0 && (
                                <span className="cm-count-chip">{totalCount} total</span>
                            )}
                        </h2>
                        <p className="cm-subtitle">Manage comments left by readers on your blog posts</p>
                    </div>
                    <Link href="/admin/blog" className="cm-blog-btn">
                        <IconBlog />
                        View Blog Posts
                    </Link>
                </div>

                {/* ═══════════ Toolbar ═══════════ */}
                <div className="cm-toolbar">
                    <div className="cm-search-wrap">
                        <span className={`cm-search-ico ${searchFocused ? 'focused' : ''}`}>
                            <IconSearch />
                        </span>
                        <input
                            ref={inputRef}
                            className="cm-search"
                            placeholder="Search by name, email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        />
                    </div>

                    {blogs && blogs.length > 0 && (
                        <select
                            className="cm-select"
                            value={blogId}
                            onChange={e => { setBlogId(e.target.value); applyFilters({ blog_id: e.target.value }); }}
                        >
                            <option value="">All Blogs</option>
                            {blogs.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.title?.slice(0, 38)}{b.title?.length > 38 ? '…' : ''}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        className="cm-select"
                        value={perPage}
                        onChange={e => { const v = Number(e.target.value); setPerPage(v); applyFilters({ per_page: v }); }}
                    >
                        {[10, 15, 25, 50].map(n => (
                            <option key={n} value={n}>Show {n}</option>
                        ))}
                    </select>

                    <button className="cm-btn-search" onClick={() => applyFilters()}>
                        <IconSearch />
                        Search
                    </button>
                </div>

                {/* ═══════════ Card ═══════════ */}
                <div className="cm-card">
                    <div className="cm-card-header">
                        <span className="card-lbl">Comments List</span>
                        {!shimmer && (
                            <span className="card-meta">
                                {comments?.from ?? 0}–{comments?.to ?? 0} of {totalCount}
                            </span>
                        )}
                    </div>

                    <div className="cm-table-wrap">
                        <table className="cm-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '18%' }}>Commenter</th>
                                    <th style={{ width: '22%' }}>Blog Post</th>
                                    <th style={{ width: '12%' }} className="col-phone">Mobile</th>
                                    <th style={{ width: '15%' }} className="col-website">Website</th>
                                    <th>Comment</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shimmer ? (
                                    <ShimmerTableRows count={8} cols={6} />
                                ) : displayData.length > 0 ? (
                                    displayData.map((c, i) => {
                                        const colors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6'];
                                        const col = colors[i % colors.length];
                                        const blogTitle = c.blog?.title || blogMap[c.blog_id] || `Blog #${c.blog_id}`;
                                        return (
                                            <tr key={c.id}>
                                                <td>
                                                    <div className="cm-user-wrap">
                                                        <div className="cm-avatar" style={{ background: col }}>
                                                            {c.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="cm-user-name">{c.name}</div>
                                                            {c.email && <div className="cm-user-email">{c.email}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cm-blog-title">{blogTitle}</div>
                                                    {c.blog_id && (
                                                        <Link href={`/admin/blog/${c.blog_id}/edit`} className="cm-blog-badge" style={{ display: 'inline-flex' }}>
                                                            <IconBlog />
                                                            View post
                                                        </Link>
                                                    )}
                                                </td>
                                                <td className="col-phone">
                                                    {c.mobile_no
                                                        ? <span className="cm-phone">{c.mobile_no}</span>
                                                        : <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>}
                                                </td>
                                                <td className="col-website">
                                                    {c.website ? (
                                                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="cm-website-link">
                                                            <IconLink />
                                                            {c.website.replace(/^https?:\/\//, '').slice(0, 24)}{c.website.length > 31 ? '…' : ''}
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {c.description
                                                        ? <div className="cm-desc">{c.description}</div>
                                                        : <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>}
                                                </td>
                                                <td style={{ padding:'0.75rem 0.5rem' }}>
                                                    <div className="cm-actions">
                                                        <button className="btn-icon-edit" title="Edit" onClick={() => { setEditComment(c); setEditModal(true); }}>
                                                            <IconEdit />
                                                        </button>
                                                        <button className="btn-icon-del" title="Delete" onClick={() => openDelete(c)}>
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ padding: 0, borderBottom: 'none' }}>
                                            <div className="cm-empty">
                                                <div className="cm-empty-icon"><IconComment /></div>
                                                <div className="cm-empty-title">
                                                    {search ? 'No results found' : 'No comments yet'}
                                                </div>
                                                <div className="cm-empty-sub">
                                                    {search
                                                        ? `No comments match "${search}".`
                                                        : 'Reader comments on your blog posts will appear here.'}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!shimmer && comments?.links && (
                        <div className="cm-footer">
                            <div className="cm-footer-info">
                                Showing <strong>{comments.from ?? 0}</strong>–<strong>{comments.to ?? 0}</strong> of <strong>{totalCount}</strong> comments
                            </div>
                            <Pagination links={comments.links} />
                        </div>
                    )}
                </div>
            </div>

            {editModal && editComment && (
                <EditModal
                    comment={editComment}
                    onClose={() => { setEditModal(false); setEditComment(null); }}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    comment={deleteComment}
                    onClose={closeDelete}
                    onConfirm={confirmDelete}
                    loading={deleteLoading}
                />
            )}
        </AdminLayout>
    );
}
