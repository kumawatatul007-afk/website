import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState } from 'react';

export default function AdminCategoryIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = () => {
        router.get('/admin/categories', { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Categories">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
                
                .page-header { 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    margin-bottom: 2rem; 
                    flex-wrap: wrap; 
                    gap: 1.25rem; 
                }
                
                .page-title { 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    color: #1e293b;
                    letter-spacing: -0.5px;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff; 
                    border: none;
                    padding: 0.75rem 1.5rem; 
                    border-radius: 14px; 
                    font-size: 0.875rem;
                    font-weight: 600; 
                    cursor: pointer; 
                    text-decoration: none;
                    display: inline-flex; 
                    align-items: center; 
                    gap: 0.5rem;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
                }
                
                .btn-primary:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                }
                
                .filters { 
                    display: flex; 
                    gap: 1rem; 
                    margin-bottom: 1.5rem; 
                    flex-wrap: wrap; 
                    align-items: center;
                }
                
                .filter-input {
                    padding: 0.875rem 1.25rem; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 14px;
                    font-size: 0.875rem; 
                    outline: none; 
                    background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%);
                    color: #1e293b;
                    transition: all 0.25s ease;
                    backdrop-filter: blur(10px);
                }
                
                .filter-input:focus { 
                    border-color: #667eea; 
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15); 
                }
                
                .card { 
                    background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%);
                    border-radius: 28px; 
                    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
                    border: 1px solid rgba(255,255,255,0.9);
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                }
                
                .table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    font-size: 0.875rem; 
                    table-layout: fixed;
                }
                
                .table th {
                    text-align: left; 
                    padding: 1rem 1.25rem; 
                    font-size: 0.75rem; 
                    font-weight: 800;
                    color: #64748b; 
                    text-transform: uppercase; 
                    letter-spacing: 0.12em;
                    border-bottom: 1px solid #e2e8f0; 
                    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                }
                
                .table td { 
                    padding: 1rem 1.25rem; 
                    border-bottom: 1px solid #f8fafc; 
                    color: #1e293b; 
                    vertical-align: middle;
                    font-weight: 500;
                }
                
                .table tr:last-child td { border-bottom: none; }
                
                .table tr:hover td { 
                    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                }
                
                .badge { 
                    display: inline-flex; 
                    padding: 0.4rem 0.9rem; 
                    border-radius: 50px; 
                    font-size: 0.75rem; 
                    font-weight: 700; 
                    align-items: center;
                }
                
                .badge-type { 
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    color: #4f46e5; 
                }
                
                .empty { 
                    text-align: center; 
                    padding: 4rem; 
                    color: #94a3b8; 
                    font-size: 0.95rem;
                    font-weight: 500;
                }
                
                .pagination-wrap { 
                    padding: 1.25rem 1.5rem; 
                    border-top: 1px solid rgba(226, 232, 240, 0.7); 
                    background: linear-gradient(180deg, transparent 0%, rgba(248,250,252,0.5) 100%);
                }
                
                .row-num { 
                    color: #cbd5e1; 
                    font-size: 0.8rem; 
                    font-weight: 700; 
                }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                
                .page-header { animation: fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
                .filters { animation: fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
                .card { animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
                .table tbody tr { animation: fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
                .table tbody tr:nth-child(1)  { animation-delay: 0.18s; }
                .table tbody tr:nth-child(2)  { animation-delay: 0.23s; }
                .table tbody tr:nth-child(3)  { animation-delay: 0.28s; }
                .table tbody tr:nth-child(4)  { animation-delay: 0.33s; }
                .table tbody tr:nth-child(5)  { animation-delay: 0.38s; }
                .table tbody tr:nth-child(6)  { animation-delay: 0.43s; }
                .table tbody tr:nth-child(7)  { animation-delay: 0.48s; }
                .table tbody tr:nth-child(8)  { animation-delay: 0.53s; }
                .table tbody tr:nth-child(9)  { animation-delay: 0.58s; }
                .table tbody tr:nth-child(10) { animation-delay: 0.63s; }

                .slug-text {
                    color: #94a3b8;
                    font-size: 0.75rem;
                    margin-top: 4px;
                }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">All Categories</h2>
            </div>

            <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    style={{ flex: 1, minWidth: '250px' }}
                />
                <button className="btn-primary" onClick={applyFilters}>
                    Search
                </button>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th style={{ width: '15%' }}>Type</th>
                            <th style={{ width: '25%' }}>Name</th>
                            <th style={{ width: '25%' }}>Slug</th>
                            <th style={{ width: '20%' }}>Created At</th>
                            <th style={{ width: '14%' }}>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.data?.length > 0 ? categories.data.map((category, i) => (
                            <tr key={category.id}>
                                <td className="row-num" style={{ width: '60px' }}>{(categories.from ?? 0) + i}</td>
                                <td style={{ width: '15%' }}>
                                    <span className="badge badge-type">{category.text_for || '—'}</span>
                                </td>
                                <td style={{ width: '25%' }}>
                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                                        {category.name}
                                    </div>
                                </td>
                                <td style={{ width: '25%' }}>
                                    <div style={{ color: '#667eea', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {category.slug}
                                    </div>
                                </td>
                                <td style={{ width: '20%', color: '#64748b', fontSize: '0.85rem' }}>
                                    {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '—'}
                                </td>
                                <td style={{ width: '14%', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    {category.updated_at ? new Date(category.updated_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : '—'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="empty">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>No categories found</div>
                                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Your category data will appear here</div>
                                </td>
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
        </AdminLayout>
    );
}
