import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    const openDelete = (post) => { setDeletePost(post); setDeleteModal(true); };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/blog/${deletePost.id}`, {
            preserveScroll: true,
            onSuccess: () => { setDeleteModal(false); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    const stripHtml = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\n{3,}/g, '\n\n')
            .trim();
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

                .blog-page {
                    max-width: 1120px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 1.5rem 1rem 0;
                }

                .page-header { display:flex; align-items:center; justify-content:space-between; margin:1.5rem 0 1rem; flex-wrap:wrap; gap:1.25rem; }
                .page-title  { font-size:1.5rem; font-weight:700; color:#1e293b; letter-spacing:-0.5px; margin:0; }

                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.75rem 1.5rem; border-radius:10px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.15s ease; }
                .btn-primary:hover { background:#1d4ed8; }

                .filters { display:flex; gap:0.85rem; margin-bottom:2rem; flex-wrap:wrap; align-items:center; }
                .filter-input { padding:0.72rem 0.95rem; border:1px solid #e2e8f0; border-radius:12px; font-size:0.875rem; outline:none; background:#fff; color:#1e293b; transition:all 0.15s ease; min-width:120px; }
                .filter-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }

                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.72rem 1.2rem; border-radius:12px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.15s ease; }
                .btn-primary:hover { background:#1d4ed8; }

                .card { background:#fff; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05); border:1px solid #e2e8f0; overflow:hidden; margin-top:1.35rem; }

                .table { width:100%; border-collapse:collapse; font-size:0.875rem; table-layout:fixed; }
                .table th { text-align:left; padding:0.875rem 1rem; font-size:0.72rem; font-weight:600; color:#64748b; text-transform:uppercase; border-bottom:1px solid #e2e8f0; background:#f8fafc; }
                .table th:last-child,
                .table td:last-child { text-align:center; }
                .table td { padding:0.875rem 1rem; border-bottom:1px solid #f1f5f9; color:#1e293b; vertical-align:middle; }
                .table tr:last-child td { border-bottom:none; }
                .table tr:hover td { background:#f8fafc; }
                .table td:last-child > div { display:flex; justify-content:center; align-items:center; gap:0.5rem; }

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
                .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.55); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1.5rem; animation:fadeIn 0.2s ease; }
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

            <div className="blog-page">
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
                    style={{ flex: '1 1 260px', minWidth: '180px', maxWidth: '330px' }}
                />
                <select
                    className="filter-input"
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    style={{ minWidth: '140px', maxWidth: '190px' }}
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
                    style={{ minWidth: '110px', maxWidth: '150px' }}
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
                            <th style={{ width:'50px' }}>Img</th>
                            <th style={{ width:'25%' }}>Title / Slug</th>
                            <th style={{ width:'12%' }}>Category</th>
                            <th style={{ width:'120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shimmer ? (
                            <ShimmerTableRows count={8} cols={4} />
                        ) : posts?.data?.length > 0 ? posts.data.map((post, i) => (
                            <tr key={post.id}>
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
                                    <div style={{ display:'flex', gap:'0.4rem' }}>
                                        <Link href={`/admin/blog/${post.id}/edit`} className="btn-sm btn-edit">Edit</Link>
                                        <button className="btn-sm btn-delete" onClick={() => openDelete(post)}>Del</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="empty">
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

            {/* ── Delete Modal ── */}
            </div>
            {deleteModal && createPortal(
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
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
