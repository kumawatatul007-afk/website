import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { ShimmerTableRows } from '../../components/ShimmerLoader';

export default function AdminBlogIndex({ posts, filters, categories = [] }) {
    const [search, setSearch]         = useState(filters?.search ?? '');
    const [catFilter, setCatFilter]   = useState(filters?.category_id ?? '');
    const [statusFilter, setStatus]   = useState(filters?.status ?? '');
    const [shimmer, setShimmer]       = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 650);
        return () => clearTimeout(t);
    }, []);

    const [editModal, setEditModal]     = useState(false);
    const [editPost, setEditPost]       = useState(null);
    const [editForm, setEditForm]       = useState({});
    const [editErrors, setEditErrors]   = useState({});
    const [editLoading, setEditLoading] = useState(false);

    const [deleteModal, setDeleteModal]     = useState(false);
    const [deletePost, setDeletePost]       = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const applyFilters = () => {
        router.get('/admin/blog', {
            search,
            category_id: catFilter,
            status: statusFilter,
        }, { preserveState: true, replace: true });
    };

    const openEdit = (post) => {
        setEditPost(post);
        setEditForm({
            title:            post.title            ?? '',
            content:          post.content          ?? '',
            main_image:       post.main_image        ?? '',
            category_id:      post.category_id      ?? '',
            serial_number:    post.serial_number     ?? '',
            meta_keywords:    post.meta_keywords     ?? '',
            meta_description: post.meta_description ?? '',
            tags:             post.tags             ?? '',
            type:             post.type             ?? 0,
            status:           post.status           ?? 1,
        });
        setEditErrors({});
        setEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setEditLoading(true);
        router.put(`/admin/blog/${editPost.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => { setEditModal(false); setEditLoading(false); },
            onError:   (errors) => { setEditErrors(errors); setEditLoading(false); },
        });
    };

    const openDelete = (post) => { setDeletePost(post); setDeleteModal(true); };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/blog/${deletePost.id}`, {
            preserveScroll: true,
            onSuccess: () => { setDeleteModal(false); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/images/blogs/${img}`;
    };

    const catName = (id) => {
        const c = categories.find(c => c.id === id);
        return c ? c.name : `Cat #${id}`;
    };

    return (
        <AdminLayout title="Blog Posts">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

                .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1.25rem; }
                .page-title  { font-size:1.5rem; font-weight:700; color:#1e293b; letter-spacing:-0.5px; }

                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.75rem 1.5rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.15s ease; }
                .btn-primary:hover { background:#1d4ed8; }

                .filters { display:flex; gap:0.875rem; margin-bottom:1.5rem; flex-wrap:wrap; align-items:center; }
                .filter-input { padding:0.75rem 1rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.875rem; outline:none; background:#fff; color:#1e293b; transition:all 0.15s ease; }
                .filter-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }

                .card { background:#fff; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05); border:1px solid #e2e8f0; overflow:hidden; }

                .table { width:100%; border-collapse:collapse; font-size:0.875rem; table-layout:fixed; }
                .table th { text-align:left; padding:0.875rem 1rem; font-size:0.72rem; font-weight:600; color:#64748b; text-transform:uppercase; border-bottom:1px solid #e2e8f0; background:#f8fafc; }
                .table td { padding:0.875rem 1rem; border-bottom:1px solid #f1f5f9; color:#1e293b; vertical-align:middle; }
                .table tr:last-child td { border-bottom:none; }
                .table tr:hover td { background:#f8fafc; }

                .badge { display:inline-block; padding:0.3rem 0.75rem; border-radius:9999px; font-size:0.72rem; font-weight:600; }
                .badge-cat    { background:#eff6ff; color:#2563eb; }
                .badge-pub    { background:#dcfce7; color:#16a34a; }
                .badge-draft  { background:#fef9c3; color:#ca8a04; }

                .btn-sm { padding:0.375rem 0.75rem; border-radius:6px; font-size:0.75rem; font-weight:500; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:all 0.15s ease; }
                .btn-edit   { background:#eff6ff; color:#2563eb; }
                .btn-edit:hover   { background:#dbeafe; }
                .btn-delete { background:#fef2f2; color:#dc2626; }
                .btn-delete:hover { background:#fee2e2; }

                .empty { text-align:center; padding:4rem; color:#94a3b8; font-size:0.95rem; font-weight:500; }
                .pagination-wrap { padding:1.25rem 1.5rem; border-top:1px solid rgba(226,232,240,0.7); }
                .row-num { color:#cbd5e1; font-size:0.8rem; font-weight:600; }
                .thumb { width:40px; height:40px; border-radius:8px; object-fit:cover; background:#f1f5f9; }

                @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .page-header { animation:fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
                .filters     { animation:fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
                .card        { animation:fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }

                /* Modal */
                .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1.5rem; animation:fadeIn 0.2s ease; backdrop-filter:blur(8px); }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .modal-box { background:#fff; border-radius:24px; box-shadow:0 25px 80px rgba(15,23,42,0.3); width:100%; max-width:680px; max-height:90vh; overflow-y:auto; animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1); }
                @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
                .modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.5rem 2rem 1.25rem; border-bottom:1px solid #e2e8f0; }
                .modal-title  { font-size:1.15rem; font-weight:800; color:#0f172a; }
                .modal-close  { background:#f1f5f9; border:none; cursor:pointer; color:#64748b; font-size:1.3rem; padding:0.4rem 0.8rem; border-radius:10px; transition:all 0.2s; }
                .modal-close:hover { color:#0f172a; background:#e2e8f0; transform:rotate(90deg); }
                .modal-body   { padding:1.75rem 2rem; }
                .modal-footer { display:flex; justify-content:flex-end; gap:0.875rem; padding:1.25rem 2rem; border-top:1px solid #e2e8f0; }

                .form-group { margin-bottom:1.1rem; }
                .form-label { display:block; font-size:0.78rem; font-weight:700; color:#374151; margin-bottom:0.4rem; }
                .form-control { width:100%; padding:0.7rem 1rem; border:1px solid #e2e8f0; border-radius:10px; font-size:0.875rem; color:#374151; outline:none; background:#fff; transition:all 0.2s; box-sizing:border-box; }
                .form-control:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
                .form-control.error { border-color:#ef4444; }
                .form-error { font-size:0.75rem; color:#ef4444; margin-top:0.3rem; font-weight:600; }
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                .section-label { font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.12em; margin:1.5rem 0 0.875rem; padding-bottom:0.5rem; border-bottom:1px solid #e2e8f0; }

                .delete-modal-box { background:#fff; border-radius:24px; box-shadow:0 25px 80px rgba(15,23,42,0.3); width:100%; max-width:420px; animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1); }
                .btn-cancel { background:#f1f5f9; color:#475569; border:none; padding:0.7rem 1.5rem; border-radius:10px; font-size:0.875rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
                .btn-cancel:hover { background:#e2e8f0; }
                .btn-danger { background:#dc2626; color:#fff; border:none; padding:0.7rem 1.5rem; border-radius:10px; font-size:0.875rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
                .btn-danger:hover { background:#b91c1c; }
                .btn-danger:disabled, .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
                .btn-save { background:#2563eb; color:#fff; border:none; padding:0.7rem 1.75rem; border-radius:10px; font-size:0.875rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
                .btn-save:hover { background:#1d4ed8; }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <h2 className="page-title">All Blog Posts
                    <span style={{ fontSize:'0.875rem', fontWeight:500, color:'#64748b', marginLeft:'0.75rem' }}>
                        ({posts?.total ?? 0} total)
                    </span>
                </h2>
                <Link href="/admin/blog/create" className="btn-primary">
                    + New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search title, slug or tags..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    style={{ flex: 1, minWidth: '220px' }}
                />
                <select
                    className="filter-input"
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    style={{ minWidth: '160px' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select
                    className="filter-input"
                    value={statusFilter}
                    onChange={e => setStatus(e.target.value)}
                    style={{ minWidth: '130px' }}
                >
                    <option value="">All Status</option>
                    <option value="1">Published</option>
                    <option value="0">Draft</option>
                </select>
                <button className="btn-primary" onClick={applyFilters}>Search</button>
            </div>

            {/* Table */}
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width:'50px' }}>#</th>
                            <th style={{ width:'50px' }}>Img</th>
                            <th style={{ width:'25%' }}>Title / Slug</th>
                            <th style={{ width:'12%' }}>Category</th>
                            <th style={{ width:'8%' }}>Status</th>
                            <th style={{ width:'8%' }}>Type</th>
                            <th style={{ width:'12%' }}>Tags</th>
                            <th style={{ width:'10%' }}>Date</th>
                            <th style={{ width:'120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shimmer ? (
                            <ShimmerTableRows count={8} cols={9} />
                        ) : posts?.data?.length > 0 ? posts.data.map((post, i) => (
                            <tr key={post.id}>
                                <td className="row-num">{(posts.from ?? 0) + i}</td>
                                <td>
                                    {post.main_image ? (
                                        <img
                                            src={getImageUrl(post.main_image)}
                                            alt={post.title}
                                            className="thumb"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="thumb" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'1.2rem' }}>📄</div>
                                    )}
                                </td>
                                <td>
                                    <div style={{ fontWeight:600, color:'#1e293b', fontSize:'0.875rem', lineHeight:1.3 }}>
                                        {post.title}
                                    </div>
                                    {post.slug && (
                                        <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'3px' }}>
                                            /{post.slug}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {post.category_id
                                        ? <span className="badge badge-cat">{catName(post.category_id)}</span>
                                        : <span style={{ color:'#94a3b8', fontSize:'0.8rem' }}>—</span>
                                    }
                                </td>
                                <td>
                                    <span className={`badge ${post.status === 1 ? 'badge-pub' : 'badge-draft'}`}>
                                        {post.status === 1 ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ color:'#64748b', fontSize:'0.8rem' }}>
                                    {post.type === 1 ? 'Blog' : post.type === 0 ? 'Service' : `Type ${post.type}`}
                                </td>
                                <td style={{ fontSize:'0.75rem', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                    {post.tags
                                        ? post.tags.split(',').slice(0, 2).join(', ') + (post.tags.split(',').length > 2 ? '…' : '')
                                        : '—'
                                    }
                                </td>
                                <td style={{ color:'#64748b', fontSize:'0.8rem' }}>
                                    {post.created_at
                                        ? new Date(post.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                                        : '—'
                                    }
                                </td>
                                <td>
                                    <div style={{ display:'flex', gap:'0.4rem' }}>
                                        <button className="btn-sm btn-edit" onClick={() => openEdit(post)}>Edit</button>
                                        <button className="btn-sm btn-delete" onClick={() => openDelete(post)}>Del</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={9} className="empty">
                                    <div style={{ fontSize:'1rem', fontWeight:600, color:'#64748b', marginBottom:'0.25rem' }}>No blog posts found</div>
                                    <div style={{ fontSize:'0.875rem', color:'#94a3b8' }}>Try adjusting your filters or create a new post</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {posts?.links && (
                    <div className="pagination-wrap">
                        <Pagination links={posts.links} />
                    </div>
                )}
            </div>

            {/* ── Edit Modal ── */}
            {editModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <span className="modal-title">Edit Blog Post</span>
                            <button className="modal-close" onClick={() => setEditModal(false)}>✕</button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="modal-body">

                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input
                                        className={`form-control${editErrors.title ? ' error' : ''}`}
                                        value={editForm.title}
                                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Post title"
                                    />
                                    {editErrors.title && <div className="form-error">{editErrors.title}</div>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-control"
                                            value={editForm.category_id}
                                            onChange={e => setEditForm(f => ({ ...f, category_id: e.target.value }))}
                                        >
                                            <option value="">— Select Category —</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-control"
                                            value={editForm.status}
                                            onChange={e => setEditForm(f => ({ ...f, status: parseInt(e.target.value) }))}
                                        >
                                            <option value={1}>Published</option>
                                            <option value={0}>Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Main Image (filename or URL)</label>
                                        <input
                                            className="form-control"
                                            value={editForm.main_image}
                                            onChange={e => setEditForm(f => ({ ...f, main_image: e.target.value }))}
                                            placeholder="e.g. 1637216446.png"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Serial Number</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={editForm.serial_number}
                                            onChange={e => setEditForm(f => ({ ...f, serial_number: e.target.value }))}
                                            placeholder="e.g. 100"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tags (comma-separated)</label>
                                    <input
                                        className="form-control"
                                        value={editForm.tags}
                                        onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))}
                                        placeholder="website, development, SEO"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Content (HTML)</label>
                                    <textarea
                                        className="form-control"
                                        rows={6}
                                        value={editForm.content}
                                        onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                                        placeholder="Blog HTML content..."
                                    />
                                </div>

                                <div className="section-label">SEO / Meta</div>

                                <div className="form-group">
                                    <label className="form-label">Meta Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={editForm.meta_description}
                                        onChange={e => setEditForm(f => ({ ...f, meta_description: e.target.value }))}
                                        placeholder="Meta description for search engines"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Meta Keywords (JSON or plain text)</label>
                                    <input
                                        className="form-control"
                                        value={editForm.meta_keywords}
                                        onChange={e => setEditForm(f => ({ ...f, meta_keywords: e.target.value }))}
                                        placeholder='website, development, SEO'
                                    />
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={editLoading}>
                                    {editLoading ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Modal ── */}
            {deleteModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModal(false)}>
                    <div className="delete-modal-box">
                        <div style={{ padding:'2rem', textAlign:'center' }}>
                            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🗑️</div>
                            <div style={{ fontSize:'1.15rem', fontWeight:800, color:'#0f172a', marginBottom:'0.75rem' }}>Delete Blog Post?</div>
                            <div style={{ fontSize:'0.9rem', color:'#64748b', lineHeight:1.6 }}>
                                This will permanently delete <strong style={{ color:'#0f172a' }}>{deletePost?.title}</strong>. This action cannot be undone.
                            </div>
                        </div>
                        <div style={{ display:'flex', justifyContent:'center', gap:'0.875rem', padding:'0 2rem 2rem' }}>
                            <button className="btn-cancel" onClick={() => setDeleteModal(false)}>Cancel</button>
                            <button className="btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
