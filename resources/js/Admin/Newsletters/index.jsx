import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState } from 'react';

export default function AdminNewslettersIndex({ newsletters, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = () => {
        router.get('/admin/newsletters', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this newsletter subscription?')) {
            router.delete(`/admin/newsletters/${id}`);
        }
    };

    return (
        <AdminLayout title="Newsletters">
            <style>{` 
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
                .page-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .page-panel { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }
                .btn-primary {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.75rem 1.35rem;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.22); }
                .filters { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
                .filter-input {
                    flex: 1; min-width: 240px; padding: 0.85rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    outline: none;
                    background: #f8fafc;
                    color: #374151;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .filter-input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.08); }
                .card { background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 12px 40px rgba(15,23,42,0.04); }
                .table { width: 100%; border-collapse: collapse; font-size: 0.95rem; min-width: 640px; }
                .table th {
                    text-align: left;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    border-bottom: 1px solid #f1f5f9;
                    background: #fafafa;
                }
                .table td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #f8fafc; color: #374151; vertical-align: middle; }
                .table tr:last-child td { border-bottom: none; }
                .table tr:hover td { background: #fafafa; }
                .btn-sm {
                    padding: 0.35rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    text-decoration: none;
                    display: inline-block;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-delete { background: #fef2f2; color: #dc2626; }
                .btn-delete:hover { background: #fee2e2; }
                .empty { text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.875rem; }
                .pagination-wrap { padding: 1rem 1.25rem; border-top: 1px solid #f1f5f9; }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .page-header { animation: fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                .filters { animation: fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
                .card { animation: fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
                .table tbody tr {
                    animation: fadeSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
                }
                .table tbody tr:nth-child(1)  { animation-delay: 0.12s; }
                .table tbody tr:nth-child(2)  { animation-delay: 0.17s; }
                .table tbody tr:nth-child(3)  { animation-delay: 0.22s; }
                .table tbody tr:nth-child(4)  { animation-delay: 0.27s; }
                .table tbody tr:nth-child(5)  { animation-delay: 0.32s; }
                .table tbody tr:nth-child(6)  { animation-delay: 0.37s; }
                .table tbody tr:nth-child(7)  { animation-delay: 0.42s; }
                .table tbody tr:nth-child(8)  { animation-delay: 0.47s; }
                .table tbody tr:nth-child(9)  { animation-delay: 0.52s; }
                .table tbody tr:nth-child(10) { animation-delay: 0.57s; }
            `}</style>

            <div className="page-container">
                <div className="page-header">
                    <h2 className="page-title">Newsletter Subscriptions</h2>
                </div> 

                <div className="page-panel">
                    <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    style={{ flex: 1, minWidth: 200 }}
                />
                <button className="btn-primary" onClick={applyFilters}>Search</button>
            </div>

                    <div className="card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Subscribed At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsletters?.data?.length > 0 ? newsletters.data.map(newsletter => (
                                    <tr key={newsletter.id}>
                                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{newsletter.id}</td>
                                        <td style={{ fontWeight: 500, color: '#374151' }}>{newsletter.email}</td>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(newsletter.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn-sm btn-delete" onClick={() => handleDelete(newsletter.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="empty">No newsletter subscriptions found</td></tr>
                                )}
                            </tbody>
                        </table>
                        {newsletters?.links && <div className="pagination-wrap"><Pagination links={newsletters.links} /></div>}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
