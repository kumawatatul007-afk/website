import AdminLayout from '../layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/* ── Spinner ─────────────────────────────────────────────────────────────── */
const Spinner = () => (
    <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'uSpin .65s linear infinite', display:'inline-block', flexShrink:0 }} />
);

/* ── Create User Modal ───────────────────────────────────────────────────── */
function CreateUserModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
        role: 'user', phone: '',
    });

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !processing && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [processing, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const inputCls = (field) => ({
        width: '100%', padding: '0.7rem 0.875rem',
        border: `1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: '10px', fontSize: '0.875rem', color: '#0f172a',
        outline: 'none', background: '#fff', fontFamily: 'inherit',
        boxSizing: 'border-box', transition: 'border-color .15s, box-shadow .15s',
    });

    return createPortal(
        <div
            style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', padding:'1rem', animation:'uOverlay .2s ease both' }}
            onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
        >
            <div style={{ background:'#fff', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'520px', boxShadow:'0 32px 80px rgba(15,23,42,0.25)', border:'1px solid rgba(255,255,255,0.85)', animation:'uPanel .3s cubic-bezier(.22,1,.36,1) both', maxHeight:'90vh', overflowY:'auto' }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                    <div>
                        <h3 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#0f172a', letterSpacing:'-.3px' }}>Create New User</h3>
                        <p style={{ margin:0, marginTop:'0.2rem', fontSize:'0.8rem', color:'#94a3b8' }}>Fill in the details to add a new user</p>
                    </div>
                    <button
                        onClick={() => !processing && onClose()}
                        style={{ width:34, height:34, borderRadius:'10px', border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name + Email */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
                        <div>
                            <label style={lbl}>Name *</label>
                            <input style={inputCls('name')} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Full name" disabled={processing} />
                            {errors.name && <span style={err}>{errors.name}</span>}
                        </div>
                        <div>
                            <label style={lbl}>Email *</label>
                            <input type="email" style={inputCls('email')} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@example.com" disabled={processing} />
                            {errors.email && <span style={err}>{errors.email}</span>}
                        </div>
                    </div>

                    {/* Password + Confirm */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
                        <div>
                            <label style={lbl}>Password *</label>
                            <input type="password" style={inputCls('password')} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min 8 characters" disabled={processing} />
                            {errors.password && <span style={err}>{errors.password}</span>}
                        </div>
                        <div>
                            <label style={lbl}>Confirm Password *</label>
                            <input type="password" style={inputCls('password_confirmation')} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" disabled={processing} />
                        </div>
                    </div>

                    {/* Role + Phone */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'1.5rem' }}>
                        <div>
                            <label style={lbl}>Role *</label>
                            <select
                                style={{ ...inputCls('role'), cursor:'pointer', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 0.875rem center', paddingRight:'2.5rem', appearance:'none', WebkitAppearance:'none' }}
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                disabled={processing}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Phone</label>
                            <input style={inputCls('phone')} value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+1 234 567 8900" disabled={processing} />
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop:'1px solid #f1f5f9', paddingTop:'1.25rem', display:'flex', gap:'0.75rem' }}>
                        <button type="button" onClick={() => !processing && onClose()} disabled={processing}
                            style={{ flex:1, padding:'0.875rem', borderRadius:'12px', border:'1.5px solid #e2e8f0', background:'#fff', color:'#475569', fontSize:'0.875rem', fontWeight:600, cursor:processing?'not-allowed':'pointer', fontFamily:'inherit', opacity:processing?0.5:1 }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            style={{ flex:2, padding:'0.875rem', borderRadius:'12px', border:'none', background:processing?'#93c5fd':'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontSize:'0.875rem', fontWeight:700, cursor:processing?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow:processing?'none':'0 4px 14px rgba(37,99,235,0.4)' }}>
                            {processing ? <><Spinner />Creating…</> : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ── Delete Confirm Modal ────────────────────────────────────────────────── */
function DeleteModal({ user, onClose, onConfirm, loading }) {
    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [loading, onClose]);

    return createPortal(
        <div
            style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', padding:'1rem', animation:'uOverlay .2s ease both' }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{ background:'#fff', borderRadius:'24px', padding:'2.25rem', width:'100%', maxWidth:'420px', boxShadow:'0 32px 80px rgba(15,23,42,0.25)', border:'1px solid rgba(255,255,255,0.85)', animation:'uPanel .3s cubic-bezier(.22,1,.36,1) both' }}>
                <div style={{ width:58, height:58, borderRadius:'18px', background:'linear-gradient(135deg,#fee2e2,#fecaca)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem', boxShadow:'0 6px 18px rgba(239,68,68,0.2)' }}>
                    <svg width="26" height="26" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </div>
                <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, color:'#0f172a', marginBottom:'0.5rem' }}>Delete User?</h3>
                <p style={{ margin:0, fontSize:'0.875rem', color:'#64748b', lineHeight:1.65, marginBottom:'1.75rem' }}>
                    You're about to delete{' '}
                    <strong style={{ color:'#0f172a' }}>{user?.name}</strong>.
                    {' '}This action cannot be undone.
                </p>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                    <button onClick={onClose} disabled={loading}
                        style={{ flex:1, padding:'0.8rem', borderRadius:'12px', border:'1.5px solid #e2e8f0', background:'#fff', color:'#475569', fontSize:'0.875rem', fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', opacity:loading?0.5:1 }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        style={{ flex:1, padding:'0.8rem', borderRadius:'12px', border:'none', background:loading?'#fca5a5':'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontSize:'0.875rem', fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow:loading?'none':'0 4px 12px rgba(239,68,68,0.4)' }}>
                        {loading ? <><Spinner />Deleting…</> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Edit User Modal ─────────────────────────────────────────────────────── */
function EditUserModal({ userId, onClose }) {
    const [loading, setLoading] = useState(true);
    const { data, setData, put, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
        role: 'user', phone: '',
    });

    useEffect(() => {
        fetch(`/admin/users/${userId}/data`)
            .then(r => r.json())
            .then(u => {
                setData({ name: u.name ?? '', email: u.email ?? '', password: '', password_confirmation: '', role: u.role ?? 'user', phone: u.phone ?? '' });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !processing && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [processing, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${userId}`, { onSuccess: () => onClose() });
    };

    const inputCls = (field) => ({
        width: '100%', padding: '0.7rem 0.875rem',
        border: `1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: '10px', fontSize: '0.875rem', color: '#0f172a',
        outline: 'none', background: '#fff', fontFamily: 'inherit',
        boxSizing: 'border-box', transition: 'border-color .15s, box-shadow .15s',
    });

    return createPortal(
        <div
            style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', padding:'1rem', animation:'uOverlay .2s ease both' }}
            onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
        >
            <div style={{ background:'#fff', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'520px', boxShadow:'0 32px 80px rgba(15,23,42,0.25)', border:'1px solid rgba(255,255,255,0.85)', animation:'uPanel .3s cubic-bezier(.22,1,.36,1) both', maxHeight:'90vh', overflowY:'auto' }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                    <div>
                        <h3 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#0f172a', letterSpacing:'-.3px' }}>Edit User</h3>
                        <p style={{ margin:0, marginTop:'0.2rem', fontSize:'0.8rem', color:'#94a3b8' }}>Update user information</p>
                    </div>
                    <button onClick={() => !processing && onClose()}
                        style={{ width:34, height:34, borderRadius:'10px', border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>
                        <div style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#6366f1', borderRadius:'50%', animation:'uSpin .7s linear infinite', margin:'0 auto 0.75rem' }} />
                        Loading user data…
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Name + Email */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
                            <div>
                                <label style={lbl}>Name *</label>
                                <input style={inputCls('name')} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Full name" disabled={processing} />
                                {errors.name && <span style={errSty}>{errors.name}</span>}
                            </div>
                            <div>
                                <label style={lbl}>Email *</label>
                                <input type="email" style={inputCls('email')} value={data.email} onChange={e => setData('email', e.target.value)} disabled={processing} />
                                {errors.email && <span style={errSty}>{errors.email}</span>}
                            </div>
                        </div>

                        {/* Password + Confirm */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
                            <div>
                                <label style={lbl}>New Password</label>
                                <input type="password" style={inputCls('password')} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Leave blank to keep current" disabled={processing} />
                                {errors.password && <span style={errSty}>{errors.password}</span>}
                                <span style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.2rem', display:'block' }}>Leave blank to keep current</span>
                            </div>
                            <div>
                                <label style={lbl}>Confirm Password</label>
                                <input type="password" style={inputCls('password_confirmation')} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat new password" disabled={processing} />
                            </div>
                        </div>

                        {/* Role + Phone */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'1.5rem' }}>
                            <div>
                                <label style={lbl}>Role *</label>
                                <select
                                    style={{ ...inputCls('role'), cursor:'pointer', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 0.875rem center', paddingRight:'2.5rem', appearance:'none', WebkitAppearance:'none' }}
                                    value={data.role} onChange={e => setData('role', e.target.value)} disabled={processing}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>Phone</label>
                                <input style={inputCls('phone')} value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+1 234 567 8900" disabled={processing} />
                            </div>
                        </div>

                        <div style={{ borderTop:'1px solid #f1f5f9', paddingTop:'1.25rem', display:'flex', gap:'0.75rem' }}>
                            <button type="button" onClick={() => !processing && onClose()} disabled={processing}
                                style={{ flex:1, padding:'0.875rem', borderRadius:'12px', border:'1.5px solid #e2e8f0', background:'#fff', color:'#475569', fontSize:'0.875rem', fontWeight:600, cursor:processing?'not-allowed':'pointer', fontFamily:'inherit', opacity:processing?0.5:1 }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing}
                                style={{ flex:2, padding:'0.875rem', borderRadius:'12px', border:'none', background:processing?'#93c5fd':'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontSize:'0.875rem', fontWeight:700, cursor:processing?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow:processing?'none':'0 4px 14px rgba(37,99,235,0.4)' }}>
                                {processing ? <><Spinner />Saving…</> : 'Update User'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}

/* ── Shared label / error styles ────────────────────────────────────────── */
const lbl    = { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.4rem' };
const err    = { display:'block', fontSize:'0.75rem', color:'#ef4444', marginTop:'0.25rem' };
const errSty = err;

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function AdminUsersIndex({ users, filters }) {
    const [search,        setSearch]        = useState(filters?.search ?? '');
    const [createModal,   setCreateModal]   = useState(false);
    const [editModal,     setEditModal]     = useState(false);
    const [editUserId,    setEditUserId]    = useState(null);
    const [deleteModal,   setDeleteModal]   = useState(false);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const applyFilters = () =>
        router.get('/admin/users', { search }, { preserveState: true, replace: true });

    const openDelete  = (user) => { setDeleteTarget(user); setDeleteModal(true); };
    const closeDelete = ()     => { setDeleteModal(false); setDeleteTarget(null); };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/users/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => { closeDelete(); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    return (
        <AdminLayout title="Users">
            <style>{`
                @keyframes uOverlay { from{opacity:0} to{opacity:1} }
                @keyframes uPanel   { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes uSpin    { to{transform:rotate(360deg)} }
                @keyframes uFadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

                .u-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;animation:uFadeUp .35s cubic-bezier(.22,1,.36,1) both; }
                .u-title  { font-size:1.15rem;font-weight:800;color:#0f172a; }
                .u-filters { display:flex;gap:.75rem;margin-bottom:1.25rem;flex-wrap:wrap;animation:uFadeUp .35s cubic-bezier(.22,1,.36,1) .05s both; }
                .u-card { background:#fff;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06),0 4px 16px rgba(15,23,42,.05);border:1px solid #f1f5f9;overflow:hidden;animation:uFadeUp .4s cubic-bezier(.22,1,.36,1) .1s both; }
                .u-table { width:100%;border-collapse:collapse;font-size:.875rem; }
                .u-table th { text-align:left;padding:.75rem 1.25rem;font-size:.695rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #f1f5f9;background:#fafbff; }
                .u-table td { padding:.9rem 1.25rem;border-bottom:1px solid #f8fafc;color:#374151;vertical-align:middle; }
                .u-table tr:last-child td { border-bottom:none; }
                .u-table tbody tr { transition:background .14s;animation:uFadeUp .32s cubic-bezier(.22,1,.36,1) both; }
                .u-table tbody tr:hover td { background:#fafbff; }
                .u-table tbody tr:nth-child(1)  { animation-delay:.12s; }
                .u-table tbody tr:nth-child(2)  { animation-delay:.17s; }
                .u-table tbody tr:nth-child(3)  { animation-delay:.22s; }
                .u-table tbody tr:nth-child(4)  { animation-delay:.27s; }
                .u-table tbody tr:nth-child(5)  { animation-delay:.32s; }
                .u-table tbody tr:nth-child(6)  { animation-delay:.37s; }
                .u-table tbody tr:nth-child(7)  { animation-delay:.42s; }
                .u-table tbody tr:nth-child(8)  { animation-delay:.47s; }

                .u-avatar { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;flex-shrink:0; }
                .u-badge { display:inline-block;padding:.2rem .65rem;border-radius:20px;font-size:.7rem;font-weight:700; }
                .u-badge-verified   { background:#d1fae5;color:#065f46; }
                .u-badge-unverified { background:#fee2e2;color:#b91c1c; }

                .u-btn-new { display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.25rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;font-size:.875rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 12px rgba(37,99,235,.35);transition:transform .15s,box-shadow .15s; }
                .u-btn-new:hover { transform:translateY(-2px);box-shadow:0 8px 20px rgba(37,99,235,.45); }

                .u-filter-input { flex:1;min-width:200px;padding:.65rem .875rem;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.875rem;outline:none;background:#fff;color:#374151;transition:border-color .15s;font-family:inherit; }
                .u-filter-input:focus { border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1); }
                .u-btn-search { display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.25rem;background:#f1f5f9;color:#374151;border:none;border-radius:10px;font-size:.875rem;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s; }
                .u-btn-search:hover { background:#e2e8f0; }

                .u-btn-edit   { padding:.35rem .8rem;border-radius:7px;font-size:.78rem;font-weight:600;cursor:pointer;border:none;text-decoration:none;display:inline-block;background:#eff6ff;color:#2563eb;transition:background .15s,transform .15s; }
                .u-btn-edit:hover { background:#dbeafe;transform:translateY(-1px); }
                .u-btn-del    { padding:.35rem .8rem;border-radius:7px;font-size:.78rem;font-weight:600;cursor:pointer;border:none;background:#fef2f2;color:#dc2626;transition:background .15s,transform .15s; }
                .u-btn-del:hover  { background:#fee2e2;transform:translateY(-1px); }

                .u-empty { text-align:center;padding:3rem;color:#94a3b8;font-size:.875rem; }
                .u-pagination { padding:1rem 1.25rem;border-top:1px solid #f1f5f9; }
            `}</style>

            {/* Header */}
            <div className="u-header">
                <h2 className="u-title">All Users</h2>
                <button className="u-btn-new" onClick={() => setCreateModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New User
                </button>
            </div>

            {/* Filters */}
            <div className="u-filters">
                <input
                    className="u-filter-input"
                    placeholder="Search name or email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                />
                <button className="u-btn-search" onClick={applyFilters}>Search</button>
            </div>

            {/* Table */}
            <div className="u-card">
                <table className="u-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email Verified</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.data?.length > 0 ? users.data.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                        <div className="u-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontWeight:600, color:'#0f172a', fontSize:'.875rem' }}>{user.name}</div>
                                            <div style={{ fontSize:'.75rem', color:'#94a3b8', marginTop:2 }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`u-badge ${user.email_verified_at ? 'u-badge-verified' : 'u-badge-unverified'}`}>
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td style={{ color:'#94a3b8', fontSize:'.8rem' }}>
                                    {new Date(user.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                </td>
                                <td>
                                    <div style={{ display:'flex', gap:'0.4rem' }}>
                                        <button className="u-btn-edit" onClick={() => { setEditUserId(user.id); setEditModal(true); }}>Edit</button>
                                        <button className="u-btn-del" onClick={() => openDelete(user)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="u-empty">No users found</td></tr>
                        )}
                    </tbody>
                </table>
                {users?.links && <div className="u-pagination"><Pagination links={users.links} /></div>}
            </div>

            {/* Create User Popup */}
            {createModal && (
                <CreateUserModal onClose={() => setCreateModal(false)} />
            )}

            {/* Edit User Popup */}
            {editModal && editUserId && (
                <EditUserModal userId={editUserId} onClose={() => { setEditModal(false); setEditUserId(null); }} />
            )}

            {/* Delete Confirm Popup */}
            {deleteModal && deleteTarget && (
                <DeleteModal
                    user={deleteTarget}
                    onClose={closeDelete}
                    onConfirm={confirmDelete}
                    loading={deleteLoading}
                />
            )}
        </AdminLayout>
    );
}
