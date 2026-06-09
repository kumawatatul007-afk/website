import AdminLayout from '../layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { ShimmerTableRows } from '../../components/ShimmerLoader';
import FlashMessage from '../../components/admin/FlashMessage';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <h3 style={{
                    fontSize: '1.1rem', fontWeight: 800, color: '#0f172a',
                    marginBottom: '0.5rem',
                }}>
                    Delete Category?
                </h3>
                <p style={{
                    fontSize: '0.875rem', color: '#64748b',
                    lineHeight: 1.6, marginBottom: '1.5rem',
                }}>
                    You're about to permanently delete <strong style={{ color: '#0f172a' }}>"{category?.name}"</strong>. This action cannot be undone and may affect associated content.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.6rem 1.25rem',
                            borderRadius: '8px', border: '1px solid #e2e8f0',
                            background: '#fff', color: '#374151',
                            fontSize: '0.875rem', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'background 0.15s',
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.6rem 1.25rem',
                            borderRadius: '8px', border: 'none',
                            background: loading ? '#fca5a5' : '#dc2626',
                            color: '#fff',
                            fontSize: '0.875rem', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'background 0.15s',
                        }}
                    >
                        {loading ? 'Deleting…' : 'Delete'}
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
                borderRadius: '16px',
                padding: '1.75rem',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <h2 style={{
                    fontSize: '1.1rem', fontWeight: 800, color: '#0f172a',
                    marginBottom: '1.25rem',
                }}>
                    Add New Category
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.875rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: '#fff',
                                color: '#374151',
                                transition: 'border-color 0.15s',
                            }}
                            placeholder="Enter category name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                            Type
                        </label>
                        <select
                            value={textFor}
                            onChange={(e) => setTextFor(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.875rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: '#fff',
                                color: '#374151',
                                transition: 'border-color 0.15s',
                            }}
                            disabled={loading}
                        >
                            <option value="blog">Blog</option>
                            <option value="service">Service</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                            Slug (optional)
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.875rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: '#fff',
                                color: '#374151',
                                transition: 'border-color 0.15s',
                            }}
                            placeholder="Leave empty to auto-generate"
                            disabled={loading}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                flex: 1, padding: '0.6rem 1.25rem',
                                borderRadius: '8px', border: '1px solid #e2e8f0',
                                background: '#fff', color: '#374151',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            style={{
                                flex: 1, padding: '0.6rem 1.25rem',
                                borderRadius: '8px', border: 'none',
                                background: loading ? '#a5b4fc' : '#6366f1',
                                color: '#fff', fontWeight: 600,
                                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Creating…' : 'Create Category'}
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
                borderRadius: '16px',
                padding: '1.75rem',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Edit Category</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        style={{
                            width: '32px', height: '32px', borderRadius: '6px',
                            border: '1px solid #e2e8f0', background: '#f8fafc',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Category Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Web Development"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem',
                                background: '#fff',
                                color: '#374151',
                            }}
                        />
                        {errors.name && <div style={{ marginTop: '0.35rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.name}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Type (text_for)</label>
                        <select
                            value={data.text_for}
                            onChange={(e) => setData('text_for', e.target.value)}
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem',
                                background: '#fff',
                                color: '#374151',
                            }}
                        >
                            <option value="">— Select type —</option>
                            <option value="blog">blog</option>
                            <option value="service">service</option>
                        </select>
                        {errors.text_for && <div style={{ marginTop: '0.35rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.text_for}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Slug (URL)</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="e.g. web-development"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem',
                                background: '#fff',
                                color: '#374151',
                            }}
                        />
                        <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>Leave empty to auto-generate from name</div>
                        {errors.slug && <div style={{ marginTop: '0.35rem', color: '#dc2626', fontSize: '0.8rem' }}>{errors.slug}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            style={{
                                flex: 1, minWidth: '120px', padding: '0.6rem 1.25rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: '#fff', color: '#374151',
                                fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.name.trim()}
                            style={{
                                flex: 1, minWidth: '120px', padding: '0.6rem 1.25rem', borderRadius: '8px',
                                border: 'none', background: processing ? '#a5b4fc' : '#6366f1',
                                color: '#fff', fontWeight: 600, cursor: processing || !data.name.trim() ? 'not-allowed' : 'pointer',
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
    const [search, setSearch]         = useState(filters?.search ?? '');
    const [perPage, setPerPage]       = useState(filters?.per_page ?? 15);
    const [shimmer, setShimmer]       = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 650);
        return () => clearTimeout(t);
    }, []);

    const applyFilters = () => {
        router.get('/admin/categories', {
            search,
            per_page: perPage,
        }, { preserveState: true, replace: true });
    };

    const openDelete  = (cat) => { setDeleteTarget(cat); setDeleteModal(true); };
    const closeDelete = () => { setDeleteModal(false); setDeleteTarget(null); };
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
                * { box-sizing: border-box; }
                .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
                .page-title  { font-size:1.1rem; font-weight:700; color:#0f172a; }
                .btn-primary { background:#6366f1; color:#fff; border:none; padding:0.6rem 1.25rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem; transition:background 0.15s; }
                .btn-primary:hover { background:#4f46e5; }
                .filters { display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:nowrap; align-items:center; }
                .filter-input { padding:0.6rem 0.875rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.875rem; outline:none; background:#fff; color:#374151; transition:border-color 0.15s; }
                .filter-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
                .cat-page { max-width:1140px; width:100%; margin:0 auto; padding:1rem 1rem 1.25rem; overflow-x: hidden; }
                .card { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #f1f5f9; overflow:hidden; }
                .table { width:100%; border-collapse:collapse; font-size:0.875rem; table-layout:fixed; }
                .table th { text-align:left; padding:0.75rem 1rem; font-size:0.7rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #f1f5f9; background:#fafafa; }
                .table td { padding:0.75rem 1rem; border-bottom:1px solid #f8fafc; color:#374151; vertical-align:middle; }
                .table th.col-actions, .table td.col-actions { text-align:right; width:140px; min-width:140px; white-space:nowrap; }
                .table tr:last-child td { border-bottom:none; }
                .table tr:hover td { background:#fafafa; }
                .badge { display:inline-block; padding:0.2rem 0.65rem; border-radius:20px; font-size:0.7rem; font-weight:700; }
                .badge-blog { background:#e0e7ff; color:#4f46e5; }
                .badge-service { background:#dcfce7; color:#15803d; }
                .btn-sm { padding:0.35rem 0.75rem; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:background 0.15s; }
                .btn-edit   { background:#eff6ff; color:#2563eb; }
                .btn-edit:hover   { background:#dbeafe; }
                .btn-delete { background:#fef2f2; color:#dc2626; }
                .btn-delete:hover { background:#fee2e2; }
                .empty { text-align:center; padding:3rem; color:#94a3b8; font-size:0.875rem; }
                .pagination-wrap { padding:1rem 1.25rem; border-top:1px solid #f1f5f9; }

                @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .page-header { animation:fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                .filters     { animation:fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
                @media (max-width: 600px) { .filters { flex-wrap: wrap; } }
                .card        { animation:fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
            `}</style>

            <FlashMessage />
            <div className="cat-page">
                <div className="page-header">
                    <h2 className="page-title">
                        All Categories
                        {totalCount > 0 && (
                            <span style={{ fontSize:'0.8rem', fontWeight:500, color:'#64748b', marginLeft:'0.5rem' }}>
                                ({totalCount} total)
                            </span>
                        )}
                    </h2>
                    <button onClick={openCreate} className="btn-primary">+ New Category</button>
                </div>

                <div className="filters">
                    <input
                        className="filter-input"
                        placeholder="Search name or slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        style={{ flex: '1 1 200px', minWidth: 140, maxWidth: 300 }}
                    />
                    <select
                        className="filter-input"
                        value={perPage}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setPerPage(val);
                            applyFilters();
                        }}
                        style={{ flex: '0 0 auto', minWidth: 120, maxWidth: 160 }}
                    >
                        <option value={10}>Show 10</option>
                        <option value={15}>Show 15</option>
                        <option value={25}>Show 25</option>
                        <option value={50}>Show 50</option>
                    </select>
                    <button className="btn-primary" onClick={applyFilters} style={{ flex: '0 0 auto', padding: '0.6rem 1.25rem', height: 'auto' }}>Search</button>
                </div>

                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '120px' }}>Type</th>
                                <th style={{ width: '25%' }}>Name</th>
                                <th style={{ width: '20%' }}>Slug</th>
                                <th style={{ width: '18%' }}>Created</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shimmer ? (
                                <ShimmerTableRows count={6} cols={5} />
                            ) : categories?.data?.length > 0 ? categories.data.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <span className={`badge badge-${category.text_for || 'blog'}`}>
                                            {category.text_for || 'blog'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{category.name}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.825rem' }}>/{category.slug || '—'}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.825rem' }}>
                                        {category.created_at ? new Date(category.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="col-actions">
                                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openEdit(category)} className="btn-sm btn-edit">Edit</button>
                                            <button onClick={() => openDelete(category)} className="btn-sm btn-delete">Del</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="empty">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {categories?.links && (
                        <div className="pagination-wrap">
                            <Pagination links={categories.links} />
                        </div>
                    )}
                </div>
            </div>

            {createModal && <CreateModal onClose={closeCreate} onSuccess={onCreateSuccess} />}
            {editModal && editTarget && <EditModal category={editTarget} onClose={closeEdit} onSuccess={onUpdateSuccess} />}
            {deleteModal && deleteTarget && <DeleteModal category={deleteTarget} onClose={closeDelete} onConfirm={confirmDelete} loading={deleteLoading} />}
        </AdminLayout>
    );
}
