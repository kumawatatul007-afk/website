import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { ShimmerTableRows } from '../../components/ShimmerLoader';

export default function AdminCommentsIndex({ comments, blogs, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [blogId, setBlogId] = useState(filters?.blog_id ?? '');
    const [perPage, setPerPage] = useState(10);
    const [shimmer, setShimmer] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 650);
        return () => clearTimeout(t);
    }, []);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteComment, setDeleteComment] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const applyFilters = (overrides = {}) => {
        router.get('/admin/comments', { search, blog_id: blogId, ...overrides }, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/comments/${deleteComment.id}`, {
            preserveScroll: true,
            onSuccess: () => { setDeleteModal(false); setDeleteLoading(false); },
            onFinish: () => setDeleteLoading(false),
        });
    };

    // Client-side per-page filter
    const displayData = comments?.data
        ? comments.data.slice(0, perPage)
        : [];

    return (
        <AdminLayout title="Blog Comments">
            <style>{`
                /* ── Page header ── */
                .page-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
                }
                .page-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1.2; }

                /* ── Card ── */
                .card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
                    overflow: hidden;
                    animation: fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both;
                }

                /* ── Toolbar ── */
                .toolbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.875rem 1.25rem; border-bottom: 1px solid #f1f5f9;
                    flex-wrap: wrap; gap: 0.75rem;
                }
                .toolbar-left { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #64748b; }
                .toolbar-right { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #64748b; }

                .select-sm {
                    padding: 0.3rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px;
                    font-size: 0.82rem; color: #374151; outline: none; background: #fff;
                    cursor: pointer;
                }
                .select-sm:focus { border-color: #3b82f6; }

                .search-input {
                    padding: 0.35rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px;
                    font-size: 0.82rem; color: #374151; outline: none; background: #fff;
                    min-width: 180px; transition: border-color 0.15s;
                }
                .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

                /* ── Table ── */
                .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
                .table th {
                    text-align: left; padding: 0.75rem 1rem;
                    font-size: 0.82rem; font-weight: 700; color: #374151;
                    border-bottom: 2px solid #e2e8f0; background: #fff;
                    white-space: nowrap;
                }
                .table td {
                    padding: 0.875rem 1rem; border-bottom: 1px solid #f1f5f9;
                    color: #374151; vertical-align: top;
                }
                .table tr:last-child td { border-bottom: none; }
                .table tbody tr { transition: background 0.12s; }
                .table tbody tr:hover td { background: #f8fafc; }

                /* Column widths */
                .col-blog      { min-width: 120px; max-width: 160px; }
                .col-name      { min-width: 100px; max-width: 130px; }
                .col-email     { min-width: 150px; }
                .col-mobile    { min-width: 110px; white-space: nowrap; }
                .col-website   { min-width: 160px; max-width: 200px; }
                .col-desc      { min-width: 180px; }
                .col-action    { width: 60px; text-align: center; }

                .cell-blog {
                    font-size: 0.82rem; color: #374151; line-height: 1.4;
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .cell-name { font-weight: 600; color: #0f172a; }
                .cell-email { color: #374151; font-size: 0.82rem; }
                .cell-mobile { color: #374151; font-size: 0.82rem; white-space: nowrap; }
                .cell-website {
                    color: #2563eb; font-size: 0.82rem; text-decoration: none;
                    display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    max-width: 200px;
                }
                .cell-website:hover { text-decoration: underline; }
                .cell-desc {
                    font-size: 0.82rem; color: #374151; line-height: 1.5;
                    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Delete icon button */
                .btn-icon-delete {
                    width: 32px; height: 32px; border-radius: 6px;
                    background: none; border: none; cursor: pointer;
                    display: inline-flex; align-items: center; justify-content: center;
                    color: #2563eb; font-size: 1rem;
                    transition: background 0.15s, color 0.15s, transform 0.15s;
                    margin: 0 auto;
                }
                .btn-icon-delete:hover {
                    background: #fef2f2; color: #dc2626;
                    transform: scale(1.15);
                }

                /* Empty */
                .empty-row td {
                    text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.875rem;
                }

                /* Footer */
                .table-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9;
                    font-size: 0.8rem; color: #64748b; flex-wrap: wrap; gap: 0.5rem;
                }

                /* Animations */
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .page-header { animation: fadeSlideUp 0.3s cubic-bezier(0.22,1,0.36,1) both; }

                /* Row stagger */
                .table tbody tr {
                    animation: fadeSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) both;
                }
                .table tbody tr:nth-child(1)  { animation-delay: 0.08s; }
                .table tbody tr:nth-child(2)  { animation-delay: 0.12s; }
                .table tbody tr:nth-child(3)  { animation-delay: 0.16s; }
                .table tbody tr:nth-child(4)  { animation-delay: 0.20s; }
                .table tbody tr:nth-child(5)  { animation-delay: 0.24s; }
                .table tbody tr:nth-child(6)  { animation-delay: 0.28s; }
                .table tbody tr:nth-child(7)  { animation-delay: 0.32s; }
                .table tbody tr:nth-child(8)  { animation-delay: 0.36s; }
                .table tbody tr:nth-child(9)  { animation-delay: 0.40s; }
                .table tbody tr:nth-child(10) { animation-delay: 0.44s; }

                /* Modal */
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(15,23,42,0.45);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; padding: 1rem; animation: fadeIn 0.15s ease;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box {
                    background: #fff; border-radius: 14px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
                    width: 100%; max-width: 400px;
                    animation: slideUp 0.18s ease;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                .modal-body  { padding: 2rem 1.5rem 1rem; text-align: center; }
                .modal-footer {
                    display: flex; justify-content: flex-end; gap: 0.75rem;
                    padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9;
                }
                .btn-cancel {
                    background: #f1f5f9; color: #374151; border: none;
                    padding: 0.6rem 1.25rem; border-radius: 8px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                }
                .btn-cancel:hover { background: #e2e8f0; }
                .btn-danger {
                    background: #dc2626; color: #fff; border: none;
                    padding: 0.6rem 1.25rem; border-radius: 8px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                }
                .btn-danger:hover { background: #b91c1c; }
                .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            {/* Page header */}
            <div className="page-header">
                <div className="page-title">Blog Comments</div>
            </div>

            {/* Table card */}
            <div className="card">
                {/* Toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <span>Show</span>
                        <select
                            className="select-sm"
                            value={perPage}
                            onChange={e => setPerPage(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="toolbar-right">
                        <span>Search:</span>
                        <input
                            className="search-input"
                            value={search}
                            onChange={e => { setSearch(e.target.value); applyFilters({ search: e.target.value }); }}
                            placeholder=""
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="col-blog">Blog</th>
                                <th className="col-name">Name</th>
                                <th className="col-email">Email</th>
                                <th className="col-mobile">Mobile No.</th>
                                <th className="col-website">Website</th>
                                <th className="col-desc">Description</th>
                                <th className="col-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shimmer ? (
                                <ShimmerTableRows count={6} cols={7} />
                            ) : displayData.length > 0 ? displayData.map((comment) => (
                                <tr key={comment.id}>
                                    <td className="col-blog">
                                        <div className="cell-blog">
                                            {comment.blog?.title || `Blog #${comment.blog_id}`}
                                        </div>
                                    </td>
                                    <td className="col-name">
                                        <div className="cell-name">{comment.name}</div>
                                    </td>
                                    <td className="col-email">
                                        <div className="cell-email">{comment.email || '—'}</div>
                                    </td>
                                    <td className="col-mobile">
                                        <div className="cell-mobile">{comment.mobile_no || '—'}</div>
                                    </td>
                                    <td className="col-website">
                                        {comment.website
                                            ? <a href={comment.website} target="_blank" rel="noopener noreferrer" className="cell-website">{comment.website}</a>
                                            : <span style={{ color: '#94a3b8' }}>—</span>
                                        }
                                    </td>
                                    <td className="col-desc">
                                        <div className="cell-desc">{comment.description || '—'}</div>
                                    </td>
                                    <td className="col-action">
                                        <button
                                            className="btn-icon-delete"
                                            title="Delete comment"
                                            onClick={() => { setDeleteComment(comment); setDeleteModal(true); }}
                                        >
                                            {/* Trash icon — same blue as screenshot, turns red on hover */}
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                <path d="M10 11v6"/>
                                                <path d="M14 11v6"/>
                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="empty-row">
                                    <td colSpan={7}>
                                        No comments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="table-footer">
                    <span>
                        {displayData.length > 0
                            ? `Showing 1 to ${displayData.length} of ${comments?.total ?? displayData.length} entries`
                            : 'No entries to show'}
                    </span>
                    {comments?.links && <Pagination links={comments.links} />}
                </div>
            </div>

            {/* ── DELETE MODAL ── */}
            {deleteModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModal(false)}>
                    <div className="modal-box">
                        <div className="modal-body">
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Delete Comment?
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                                Delete comment by{' '}
                                <strong style={{ color: '#0f172a' }}>{deleteComment?.name}</strong>?
                                <br />This action cannot be undone.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModal(false)}>Cancel</button>
                            <button className="btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
