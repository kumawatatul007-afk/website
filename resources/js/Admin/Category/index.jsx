import AdminLayout from '../layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { ShimmerTableRows } from '../../components/ShimmerLoader';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ── Type → color palette ───────────────────────────────────────────────── */
const TYPE_PALETTE = {
    blog:      { bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4f46e5', dot: '#6366f1' },
    service:   { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', color: '#16a34a', dot: '#22c55e' },
    portfolio: { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#ea580c', dot: '#f97316' },
    project:   { bg: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', color: '#0369a1', dot: '#0ea5e9' },
    news:      { bg: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', color: '#9333ea', dot: '#a855f7' },
    default:   { bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', color: '#64748b', dot: '#94a3b8' },
};
const typePalette = (type) => {
    if (!type) return TYPE_PALETTE.default;
    return TYPE_PALETTE[type.toLowerCase()] ?? TYPE_PALETTE.default;
};

/* ── SVG icon helpers ───────────────────────────────────────────────────── */
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconEdit     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconFolder   = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconAlert    = () => <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconChevron  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconHome     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconPlus     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

/* ── Delete confirmation modal ──────────────────────────────────────────── */
function DeleteModal({ category, onClose, onConfirm, loading }) {
    useEffect(() => {
        const handler = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, loading]);

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'modalOverlayIn 0.2s ease both',
                padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2.25rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
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

                <h3 style={{
                    fontSize: '1.2rem', fontWeight: 800, color: '#0f172a',
                    marginBottom: '0.6rem', letterSpacing: '-0.3px',
                }}>
                    Delete Category?
                </h3>
                <p style={{
                    fontSize: '0.9rem', color: '#64748b',
                    lineHeight: 1.65, marginBottom: '2rem',
                }}>
                    You're about to permanently delete{' '}
                    <strong style={{
                        color: '#0f172a',
                        background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                    }}>
                        "{category?.name}"
                    </strong>
                    . This action cannot be undone and may affect associated content.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.875rem 1.25rem',
                            borderRadius: '12px', border: '1.5px solid #e2e8f0',
                            background: '#fff', color: '#475569',
                            fontSize: '0.875rem', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            opacity: loading ? 0.5 : 1,
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
                            flex: 1, padding: '0.875rem 1.25rem',
                            borderRadius: '12px', border: 'none',
                            background: loading
                                ? 'linear-gradient(135deg,#fca5a5,#f87171)'
                                : 'linear-gradient(135deg,#ef4444,#dc2626)',
                            color: '#fff',
                            fontSize: '0.875rem', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            boxShadow: loading ? 'none' : '0 6px 18px rgba(239,68,68,0.35)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '0.5rem',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 10px 28px rgba(239,68,68,0.5)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 18px rgba(239,68,68,0.35)'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    width: 14, height: 14,
                                    border: '2px solid rgba(255,255,255,0.35)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'spinIcon 0.65s linear infinite',
                                    display: 'inline-block', flexShrink: 0,
                                }} />
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

/* ── Create Modal ──────────────────────────────────────────────────────── */
function CreateModal({ onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [textFor, setTextFor] = useState('blog');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        router.post('/admin/categories', {
            name,
            text_for: textFor,
            slug: slug || undefined,
        }, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onFinish: () => setLoading(false),
        });
    };

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'modalOverlayIn 0.2s ease both',
                padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <h2 style={{
                    fontSize: '1.4rem', fontWeight: 800, color: '#0f172a',
                    marginBottom: '1.5rem', letterSpacing: '-0.3px',
                }}>
                    Add New Category
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            placeholder="Enter category name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                            Type
                        </label>
                        <select
                            value={textFor}
                            onChange={(e) => setTextFor(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            disabled={loading}
                        >
                            <option value="blog">Blog</option>
                            <option value="service">Service</option>
                            <option value="portfolio">Portfolio</option>
                            <option value="project">Project</option>
                            <option value="news">News</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                            Slug (optional)
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            placeholder="Leave empty to auto-generate"
                            disabled={loading}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                flex: 1, padding: '0.875rem 1.25rem',
                                borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                background: '#fff', color: '#475569',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: loading ? 0.5 : 1,
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            style={{
                                flex: 1, padding: '0.875rem 1.25rem',
                                borderRadius: '12px', border: 'none',
                                background: loading ? 'linear-gradient(135deg, #a5b4fc, #c4b5fd)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: '#fff',
                                fontSize: '0.875rem', fontWeight: 700,
                                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: loading ? 'none' : '0 6px 18px rgba(99,102,241,0.35)',
                            }}
                            onMouseEnter={e => { if (!loading && name.trim()) e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.5)'; }}
                            onMouseLeave={e => { if (!loading && name.trim()) e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.35)'; }}
                        >
                            {loading ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function EditModal({ category, onClose, onSuccess }) {
    const { data, setData, put, processing, errors } = useForm({
        name:     category.name     ?? '',
        text_for: category.text_for ?? '',
        slug:     category.slug     ?? '',
    });

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && !processing && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, processing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`, {
            preserveScroll: true,
            onSuccess: () => onSuccess(),
        });
    };

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'modalOverlayIn 0.2s ease both',
                padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
        >
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Edit Category</h2>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>ID: {category.id}</div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            border: '1px solid #e2e8f0', background: '#f8fafc',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Category Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Web Development"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '14px',
                                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.95rem',
                                transition: 'all 0.2s',
                            }}
                        />
                        {errors.name && <div style={{ marginTop: '0.45rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.name}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Type (text_for)</label>
                        <select
                            value={data.text_for}
                            onChange={(e) => setData('text_for', e.target.value)}
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '14px',
                                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.95rem',
                                background: '#fff', appearance: 'none', WebkitAppearance: 'none',
                            }}
                        >
                            <option value="">— Select type —</option>
                            <option value="blog">blog</option>
                            <option value="service">service</option>
                            <option value="portfolio">portfolio</option>
                            <option value="project">project</option>
                            <option value="news">news</option>
                        </select>
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#94a3b8' }}>Which section does this category belong to?</div>
                        {errors.text_for && <div style={{ marginTop: '0.45rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.text_for}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Slug (URL)</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="e.g. web-development"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '14px',
                                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.95rem',
                                transition: 'all 0.2s',
                            }}
                        />
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#94a3b8' }}>Leave empty to auto-generate from name</div>
                        {errors.slug && <div style={{ marginTop: '0.45rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.slug}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            style={{
                                flex: 1, minWidth: '120px', padding: '0.95rem 1.1rem', borderRadius: '14px',
                                border: '1px solid #e2e8f0', background: '#fff', color: '#475569',
                                fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.name.trim()}
                            style={{
                                flex: 1, minWidth: '120px', padding: '0.95rem 1.1rem', borderRadius: '14px',
                                border: 'none', background: processing ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: '#fff', fontWeight: 700, cursor: processing || !data.name.trim() ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing ? 'Saving…' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function AdminCategoryIndex({ categories, filters }) {
    const [search,        setSearch]        = useState(filters?.search   ?? '');
    const [perPage,       setPerPage]       = useState(filters?.per_page ?? 15);
    const [shimmer,       setShimmer]       = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [deleteModal,   setDeleteModal]   = useState(false);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [createModal,   setCreateModal]   = useState(false);
    const [editModal,     setEditModal]     = useState(false);
    const [editTarget,    setEditTarget]    = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 700);
        return () => clearTimeout(t);
    }, []);

    const applyFilters = (overrides = {}) =>
        router.get('/admin/categories', {
            search,
            per_page: perPage,
            ...overrides,
        }, { preserveState: true, replace: true });

    const openDelete  = (cat) => { setDeleteTarget(cat); setDeleteModal(true); };
    const closeDelete = ()    => { setDeleteModal(false); setDeleteTarget(null); };
    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/categories/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => { closeDelete(); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    const openCreate  = () => setCreateModal(true);
    const closeCreate = () => setCreateModal(false);
    const openEdit    = (cat) => { setEditTarget(cat); setEditModal(true); };
    const closeEdit   = () => { setEditModal(false); setEditTarget(null); };
    const onCreateSuccess = () => {
        router.reload({ only: ['categories'] });
    };
    const onUpdateSuccess = () => {
        router.reload({ only: ['categories'] });
        closeEdit();
    };

    const totalCount = categories?.total ?? categories?.data?.length ?? 0;

    return (
        <AdminLayout title="Categories">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

                /* ── Keyframes ─────────────────────────────────────────── */
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes rowSlideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes shimmerSweep {
                    0%   { background-position: -600px 0; }
                    100% { background-position:  600px 0; }
                }
                @keyframes modalOverlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalPanelIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes spinIcon {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.25); }
                    50%       { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
                }

                /* ── Base ──────────────────────────────────────────────── */
                .cat-page {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    max-width: 1120px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 1.5rem 1rem 0;
                }

                /* ── Page header ───────────────────────────────────────── */
                .cat-header {
                    display: flex; align-items: flex-end;
                    margin-top: 0.75rem;
                    justify-content: space-between;
                    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
                }
                .cat-breadcrumb {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.75rem; font-weight: 500; color: #94a3b8;
                    margin-bottom: 0.45rem; letter-spacing: 0.01em;
                }
                .cat-breadcrumb .bc-active { color: #6366f1; font-weight: 600; }
                .cat-title {
                    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
                    font-size: 1.65rem; font-weight: 900; color: #0f172a;
                    letter-spacing: -0.8px; line-height: 1.15;
                }
                .cat-count-chip {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
                    color: #4f46e5;
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    border: 1px solid rgba(99,102,241,0.2);
                    padding: 0.32rem 0.8rem; border-radius: 999px;
                }
                .cat-count-chip::before {
                    content: '';
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #6366f1;
                    animation: pulseGlow 2s ease infinite;
                    display: inline-block;
                }
                .cat-subtitle {
                    font-size: 0.875rem; color: #94a3b8; font-weight: 400;
                    margin-top: 0.35rem; letter-spacing: 0.01em;
                }

                /* ── Toolbar ───────────────────────────────────────────── */
                .cat-toolbar {
                    display: flex; gap: 0.875rem; margin-bottom: 1.5rem;
                    flex-wrap: wrap; align-items: center;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both;
                }
                .search-actions {
                    display: flex; align-items: center;
                    gap: 0.75rem;
                    flex-wrap: nowrap;
                    width: 100%;
                }
                .search-wrap { position: relative; flex: 1 1 auto; min-width: 0; max-width: 420px; }
                .search-icon-wrap {
                    position: absolute; left: 1rem; top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none; color: #cbd5e1;
                    transition: color 0.2s;
                    display: flex; align-items: center;
                }
                .search-icon-wrap.focused { color: #6366f1; }
                .cat-search {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 2.85rem;
                    border: 1.5px solid #e8ecf2;
                    border-radius: 14px;
                    font-size: 0.875rem; font-family: inherit;
                    background: #fff; color: #0f172a;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
                }
                .cat-search::placeholder { color: #c8d1dc; }
                .cat-search:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.13), 0 1px 4px rgba(15,23,42,0.05);
                }
                .cat-select {
                    padding: 0.9rem 2.75rem 0.9rem 1.1rem;
                    border: 1.5px solid #e8ecf2;
                    border-radius: 14px;
                    font-size: 0.875rem; font-family: inherit;
                    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 1.1rem center;
                    color: #475569; appearance: none; -webkit-appearance: none;
                    outline: none; cursor: pointer;
                    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
                    transition: border-color 0.2s, box-shadow 0.2s;
                    white-space: nowrap;
                }
                .cat-select:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.13);
                }
                .btn-search {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.95rem 1.8rem;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff; border: none; border-radius: 14px;
                    font-size: 0.875rem; font-weight: 700; font-family: inherit;
                    cursor: pointer; white-space: nowrap;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-search:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5);
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                }
                .btn-search:active { transform: translateY(-1px); }

                .btn-add-category {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.95rem 1.8rem;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    font-family: inherit;
                    cursor: pointer;
                    white-space: nowrap;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .btn-add-category:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5);
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                }

                .btn-add-category:active { 
                    transform: translateY(-1px); 
                }

                /* ── Card ──────────────────────────────────────────────── */
                .cat-card {
                    background: #fff;
                    border-radius: 24px;
                    border: 1px solid #eef2f7;
                    overflow: hidden;
                    box-shadow:
                        0 0 0 1px rgba(15,23,42,0.03),
                        0 2px 4px rgba(15,23,42,0.04),
                        0 8px 24px rgba(15,23,42,0.06),
                        0 24px 64px rgba(15,23,42,0.04);
                    animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both;
                }
                .cat-card-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1.1rem 1.75rem;
                    border-bottom: 1px solid #f1f5f9;
                    background: linear-gradient(180deg, #fafbff 0%, #f8fafc 100%);
                }
                .card-header-label {
                    font-size: 0.72rem; font-weight: 800; color: #94a3b8;
                    text-transform: uppercase; letter-spacing: 0.12em;
                }
                .card-header-meta {
                    font-size: 0.8rem; color: #cbd5e1; font-weight: 500;
                }

                /* ── Table ─────────────────────────────────────────────── */
                .cat-table {
                    width: 100%; border-collapse: collapse;
                    font-size: 0.875rem; table-layout: fixed;
                }
                .cat-table thead tr {
                    background: linear-gradient(180deg, #fafbff 0%, #f7f9fc 100%);
                }
                .cat-table th {
                    text-align: left;
                    padding: 1rem 1rem;
                    font-size: 0.695rem; font-weight: 800;
                    color: #b0bec8; text-transform: uppercase;
                    letter-spacing: 0.11em; white-space: nowrap;
                    border-bottom: 1px solid #f1f5f9;
                    user-select: none;
                    vertical-align: middle;
                }
                /* Actions header — always right-aligned */
                .cat-table th.col-actions {
                    text-align: right;
                    padding-right: 1rem;
                }
                .cat-table td {
                    padding: 1rem 1rem;
                    border-bottom: 1px solid #f8fafc;
                    color: #0f172a; vertical-align: middle;
                    text-align: left;
                }
                /* Actions cell — always right-aligned */
                .cat-table td.col-actions {
                    text-align: right;
                    padding-right: 1rem;
                    white-space: nowrap;
                }
                .cat-table tbody tr:last-child td { border-bottom: none; }
                .cat-table tbody tr {
                    transition: background 0.14s ease;
                    animation: rowSlideIn 0.38s cubic-bezier(0.22,1,0.36,1) both;
                }
                .cat-table tbody tr:hover td { background: #fafbff; }

                /* staggered row entrance */
                .cat-table tbody tr:nth-child(1)  { animation-delay: 0.15s; }
                .cat-table tbody tr:nth-child(2)  { animation-delay: 0.19s; }
                .cat-table tbody tr:nth-child(3)  { animation-delay: 0.23s; }
                .cat-table tbody tr:nth-child(4)  { animation-delay: 0.27s; }
                .cat-table tbody tr:nth-child(5)  { animation-delay: 0.31s; }
                .cat-table tbody tr:nth-child(6)  { animation-delay: 0.35s; }
                .cat-table tbody tr:nth-child(7)  { animation-delay: 0.39s; }
                .cat-table tbody tr:nth-child(8)  { animation-delay: 0.43s; }
                .cat-table tbody tr:nth-child(9)  { animation-delay: 0.47s; }
                .cat-table tbody tr:nth-child(10) { animation-delay: 0.51s; }

                /* ── Type badge ────────────────────────────────────────── */
                .type-badge {
                    display: inline-flex; align-items: center; gap: 0.42rem;
                    padding: 0.36rem 0.85rem; border-radius: 999px;
                    font-size: 0.715rem; font-weight: 700;
                    letter-spacing: 0.05em; text-transform: capitalize;
                    white-space: nowrap;
                }
                .type-badge-dot {
                    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
                }

                /* ── Name cell ─────────────────────────────────────────── */
                .cat-name {
                    font-weight: 700; color: #0f172a;
                    font-size: 0.875rem; line-height: 1.3;
                }

                /* ── Slug chip ─────────────────────────────────────────── */
                .slug-chip {
                    display: inline-flex; align-items: center;
                    background: #f5f7ff; border: 1px solid #e8ecff;
                    border-radius: 8px; padding: 0.28rem 0.65rem;
                    gap: 0.3rem; max-width: 100%;
                }
                .slug-chip-hash {
                    color: #a5b4fc; font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
                }
                .slug-chip-text {
                    color: #6366f1; font-size: 0.72rem; font-weight: 600;
                    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    max-width: 160px;
                }

                /* ── Date ──────────────────────────────────────────────── */
                .date-main { color: #475569; font-size: 0.83rem; font-weight: 500; }
                .date-time { color: #c8d1dc; font-size: 0.74rem; margin-top: 2px; }

                /* ── Action buttons ────────────────────────────────────── */
                .actions-cell {
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: flex-end !important;
                    gap: 0.5rem !important;
                    flex-wrap: nowrap !important;
                }
                .btn-icon {
                    width: 38px; height: 38px; border-radius: 10px;
                    display: inline-flex; align-items: center; justify-content: center;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
                    color: #fff; cursor: pointer;
                    border: none;
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none; flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .btn-icon:hover {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.45);
                }
                .btn-icon-danger {
                    width: 38px; height: 38px; border-radius: 10px;
                    display: inline-flex; align-items: center; justify-content: center;
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: #fff; cursor: pointer;
                    border: none;
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); 
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }
                .btn-icon-danger:hover {
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.45);
                }

                /* ── Shimmer ───────────────────────────────────────────── */
                .shimmer-cell {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
                    background-size: 800px 100%;
                    animation: shimmerSweep 1.5s ease-in-out infinite;
                    border-radius: 7px; height: 14px;
                }

                /* ── Empty state ───────────────────────────────────────── */
                .cat-empty {
                    text-align: center; padding: 5.5rem 2rem;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
                }
                .cat-empty-icon-wrap {
                    width: 84px; height: 84px; border-radius: 26px;
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    border: 1px solid rgba(99,102,241,0.15);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 1.75rem;
                    box-shadow: 0 8px 24px rgba(99,102,241,0.15);
                }
                .cat-empty-title {
                    font-size: 1.1rem; font-weight: 800; color: #1e293b;
                    letter-spacing: -0.3px; margin-bottom: 0.5rem;
                }
                .cat-empty-sub {
                    font-size: 0.875rem; color: #94a3b8; font-weight: 400;
                    line-height: 1.6; max-width: 320px; margin: 0 auto;
                }

                /* ── Pagination footer ─────────────────────────────────── */
                .cat-footer {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 1.4rem 1.75rem;
                    border-top: 1px solid #e0e7f1;
                    background: linear-gradient(180deg, #f9faff 0%, #f5f8ff 100%);
                    flex-wrap: wrap; gap: 1rem;
                }
                .footer-info {
                    font-size: 0.8rem; color: #7c8fa3; font-weight: 500;
                }
                .footer-info strong { color: #4f46e5; font-weight: 700; }

                /* ── Responsive breakpoints ────────────────────────────── */
                @media (max-width: 900px) {
                    .col-updated { display: none; }
                }
                @media (max-width: 700px) {
                    .col-slug { display: none; }
                    .cat-title { font-size: 1.35rem; }
                }
                @media (max-width: 520px) {
                    .col-type { display: none; }
                    .cat-footer { justify-content: center; }
                    .footer-info { display: none; }
                    .cat-table th, .cat-table td { padding: 0.875rem 1rem; }
                }
            `}</style>

            <div className="cat-page">

                {/* ═══════════ Header ═══════════ */}
                <div className="cat-header">
                    <div>
                        <div className="cat-breadcrumb">
                            <IconHome />
                            Admin
                            <IconChevron />
                            <span className="bc-active">Categories</span>
                        </div>
                        <h2 className="cat-title">
                            All Categories
                            {totalCount > 0 && (
                                <span className="cat-count-chip">{totalCount} total</span>
                            )}
                        </h2>
                        <p className="cat-subtitle">Browse and manage your content taxonomy</p>
                    </div>
                    <button onClick={openCreate} className="btn-add-category">
                        <IconPlus />
                        Add Category
                    </button>
                </div>

                {/* ═══════════ Toolbar ═══════════ */}
                <div className="cat-toolbar">
                    <div className="search-actions">
                        <div className="search-wrap">
                            <span className={`search-icon-wrap ${searchFocused ? 'focused' : ''}`}>
                                <IconSearch />
                            </span>
                            <input
                                ref={inputRef}
                                className="cat-search"
                                placeholder="Search by name or slug…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            />
                        </div>
                        <button className="btn-search" onClick={() => applyFilters()}>
                            <IconSearch />
                            Search
                        </button>
                    </div>

                    <select
                        className="cat-select"
                        value={perPage}
                        onChange={e => {
                            const val = Number(e.target.value);
                            setPerPage(val);
                            applyFilters({ per_page: val });
                        }}
                    >
                        {[10, 15, 25, 50, 100].map(n => (
                            <option key={n} value={n}>Show {n} entries</option>
                        ))}
                    </select>
                </div>

                {/* ═══════════ Data Card ═══════════ */}
                <div className="cat-card">

                    {/* Card sub-header */}
                    <div className="cat-card-header">
                        <span className="card-header-label">Categories List</span>
                        {!shimmer && (
                            <span className="card-header-meta">
                                {categories?.from ?? 0}–{categories?.to ?? 0} of {totalCount}
                            </span>
                        )}
                    </div>

                    <table className="cat-table">
                        <thead>
                            <tr>
                                <th style={{ width: '12%' }} className="col-type">Type</th>
                                <th style={{ width: '20%' }}>Name</th>
                                <th style={{ width: '18%' }} className="col-slug">Slug</th>
                                <th style={{ width: '15%' }}>Created</th>
                                <th style={{ width: '12%' }} className="col-updated">Updated</th>
                                <th style={{ width: '80px' }} className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shimmer ? (
                                <ShimmerTableRows count={8} cols={6} />
                            ) : categories?.data?.length > 0 ? (
                                categories.data.map((cat, i) => {
                                    const palette = typePalette(cat.text_for);
                                    const created = cat.created_at ? new Date(cat.created_at) : null;
                                    const updated = cat.updated_at ? new Date(cat.updated_at) : null;
                                    const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <tr key={cat.id}>

                                            {/* Type */}
                                            <td className="col-type">
                                                {cat.text_for ? (
                                                    <span
                                                        className="type-badge"
                                                        style={{ background: palette.bg, color: palette.color }}
                                                    >
                                                        <span className="type-badge-dot" style={{ background: palette.dot }} />
                                                        {cat.text_for}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>
                                                )}
                                            </td>

                                            {/* Name */}
                                            <td>
                                                <div className="cat-name">{cat.name}</div>
                                            </td>

                                            {/* Slug */}
                                            <td className="col-slug">
                                                {cat.slug ? (
                                                    <div className="slug-chip">
                                                        <span className="slug-chip-hash">/</span>
                                                        <span className="slug-chip-text">{cat.slug}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>
                                                )}
                                            </td>

                                            {/* Created */}
                                            <td>
                                                {created ? (
                                                    <>
                                                        <div className="date-main">{fmtDate(created)}</div>
                                                        <div className="date-time">{fmtTime(created)}</div>
                                                    </>
                                                ) : <span style={{ color: '#dce3ed' }}>—</span>}
                                            </td>

                                            {/* Updated */}
                                            <td className="col-updated">
                                                {updated ? (
                                                    <div className="date-main">{fmtDate(updated)}</div>
                                                ) : <span style={{ color: '#dce3ed' }}>—</span>}
                                            </td>

                                            {/* Actions */}
                                            <td className="col-actions">
                                                <div className="actions-cell">
                                                    <button
                                                        type="button"
                                                        className="btn-icon"
                                                        title="Edit"
                                                        onClick={() => openEdit(cat)}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        className="btn-icon-danger"
                                                        title="Delete"
                                                        onClick={() => openDelete(cat)}
                                                    >
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
                                        <div className="cat-empty">
                                            <div className="cat-empty-icon-wrap">
                                                <IconFolder />
                                            </div>
                                            <div className="cat-empty-title">
                                                {search ? 'No results found' : 'No categories yet'}
                                            </div>
                                            <div className="cat-empty-sub">
                                                {search
                                                    ? `No categories match "${search}". Try a different keyword.`
                                                    : 'Your category data will appear here once added.'
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination footer */}
                    {!shimmer && categories?.links && (
                        <div className="cat-footer">
                            <div className="footer-info">
                                Showing{' '}
                                <strong>{categories.from ?? 0}</strong>
                                {' – '}
                                <strong>{categories.to ?? 0}</strong>
                                {' of '}
                                <strong>{totalCount}</strong>
                                {' categories'}
                            </div>
                            <Pagination links={categories.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════ Delete modal ═══════════ */}
            {deleteModal && (
                <DeleteModal
                    category={deleteTarget}
                    onClose={closeDelete}
                    onConfirm={confirmDelete}
                    loading={deleteLoading}
                />
            )}

            {createModal && (
                <CreateModal
                    onClose={closeCreate}
                    onSuccess={onCreateSuccess}
                />
            )}

            {editModal && editTarget && (
                <EditModal
                    category={editTarget}
                    onClose={closeEdit}
                    onSuccess={onUpdateSuccess}
                />
            )}
        </AdminLayout>
    );
}