import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { ShimmerTableRows } from '../../components/ShimmerLoader';

export default function AdminPortfolioIndex({ items, filters, hasSearched, categories = [] }) {
    const [search, setSearch]         = useState(filters?.search ?? '');
    const [statusFilter, setStatus]   = useState(filters?.status ?? '');
    const [shimmer, setShimmer]       = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 650);
        return () => clearTimeout(t);
    }, []);

    const applyFilters = () => {
        router.get('/admin/portfolio', { search, status: statusFilter, searched: 1 }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this portfolio item?')) {
            router.delete(`/admin/portfolio/${id}`);
        }
    };

    const catName = (id) => {
        const c = categories.find(c => c.id === id);
        return c ? c.name : (id ? `Cat #${id}` : '—');
    };

    return (
        <AdminLayout title="Portfolio">
            <style>{`
                .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
                .page-title  { font-size:1.1rem; font-weight:700; color:#0f172a; }
                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.6rem 1.25rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem; transition:background 0.15s; }
                .btn-primary:hover { background:#1d4ed8; }
                .filters { display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
                .filter-input { padding:0.6rem 0.875rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.875rem; outline:none; background:#fff; color:#374151; transition:border-color 0.15s; }
                .filter-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
                .card { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #f1f5f9; overflow:hidden; }
                .table { width:100%; border-collapse:collapse; font-size:0.875rem; table-layout:fixed; }
                .table th { text-align:left; padding:0.75rem 1rem; font-size:0.7rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid #f1f5f9; background:#fafafa; }
                .table td { padding:0.75rem 1rem; border-bottom:1px solid #f8fafc; color:#374151; vertical-align:middle; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .table tr:last-child td { border-bottom:none; }
                .table tr:hover td { background:#fafafa; }
                .badge { display:inline-block; padding:0.2rem 0.65rem; border-radius:20px; font-size:0.7rem; font-weight:700; }
                .badge-pub   { background:#f0fdf4; color:#15803d; }
                .badge-draft { background:#fef9c3; color:#ca8a04; }
                .badge-off   { background:#f1f5f9; color:#64748b; }
                .btn-sm { padding:0.35rem 0.75rem; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:background 0.15s; }
                .btn-edit   { background:#eff6ff; color:#2563eb; }
                .btn-edit:hover   { background:#dbeafe; }
                .btn-delete { background:#fef2f2; color:#dc2626; }
                .btn-delete:hover { background:#fee2e2; }
                .empty { text-align:center; padding:3rem; color:#94a3b8; font-size:0.875rem; }
                .pagination-wrap { padding:1rem 1.25rem; border-top:1px solid #f1f5f9; }
                .thumb { width:52px; height:38px; object-fit:cover; border-radius:6px; background:#f1f5f9; display:block; }

                @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .page-header { animation:fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                .filters     { animation:fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
                .card        { animation:fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">
                    Portfolio Items
                    {items?.total != null && (
                        <span style={{ fontSize:'0.8rem', fontWeight:500, color:'#64748b', marginLeft:'0.5rem' }}>
                            ({items.total} total)
                        </span>
                    )}
                </h2>
                <Link href="/admin/portfolio/create" className="btn-primary">+ New Item</Link>
            </div>

            <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search title or description..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    style={{ flex: 1, minWidth: 200 }}
                />
                <select
                    className="filter-input"
                    value={statusFilter}
                    onChange={e => setStatus(e.target.value)}
                    style={{ minWidth: 130 }}
                >
                    <option value="">All Status</option>
                    <option value="1">Published</option>
                    <option value="0">Draft</option>
                </select>
                <button className="btn-primary" onClick={applyFilters}>Search</button>
            </div>

            <div className="card">
                {!hasSearched ? (
                    <div className="empty" style={{ padding:'4rem' }}>
                        <div style={{ fontWeight:600, fontSize:'0.95rem', color:'#64748b', marginBottom:'0.35rem' }}>
                            Use the search bar to find portfolio items
                        </div>
                        <div style={{ fontSize:'0.82rem' }}>
                            Filter by title or status and click <strong>Search</strong>
                        </div>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width:'60px' }}>Img</th>
                                <th style={{ width:'22%' }}>Title</th>
                                <th style={{ width:'14%' }}>Category</th>
                                <th style={{ width:'14%' }}>Client</th>
                                <th style={{ width:'10%' }}>Status</th>
                                <th style={{ width:'10%' }}>Published</th>
                                <th style={{ width:'10%' }}>Date</th>
                                <th style={{ width:'110px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shimmer ? (
                                <ShimmerTableRows count={5} cols={8} />
                            ) : items?.data?.length > 0 ? items.data.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `/uploads/portfolio/${item.image}`}
                                                alt={item.title}
                                                className="thumb"
                                                onError={e => { 
                                                    // Try old images folder as fallback
                                                    if (!e.target.src.includes('/images/portfolio/')) {
                                                        e.target.src = `/images/portfolio/${item.image}`;
                                                    } else {
                                                        e.target.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="thumb" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'0.65rem' }}>No img</div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight:600, color:'#0f172a' }}>
                                        <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
                                        {item.slug && <div style={{ fontSize:'0.7rem', color:'#94a3b8', marginTop:'2px' }}>/{item.slug}</div>}
                                    </td>
                                    <td style={{ color:'#64748b', fontSize:'0.82rem' }}>{catName(item.category_id)}</td>
                                    <td style={{ color:'#64748b', fontSize:'0.82rem' }}>{item.clint_name || '—'}</td>
                                    <td>
                                        <span className={`badge ${item.status === 'Active' ? 'badge-pub' : 'badge-off'}`}>
                                            {item.status || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.is_publish === 1 ? 'badge-pub' : 'badge-draft'}`}>
                                            {item.is_publish === 1 ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td style={{ color:'#94a3b8', fontSize:'0.8rem' }}>
                                        {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display:'flex', gap:'0.4rem' }}>
                                            <Link href={`/admin/portfolio/${item.id}/edit`} className="btn-sm btn-edit">Edit</Link>
                                            <button className="btn-sm btn-delete" onClick={() => handleDelete(item.id)}>Del</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="empty">No portfolio items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                {hasSearched && items?.links && (
                    <div className="pagination-wrap">
                        <Pagination links={items.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
