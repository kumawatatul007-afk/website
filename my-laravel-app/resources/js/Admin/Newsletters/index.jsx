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
                .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
                .page-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .btn-primary {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.6rem 1.25rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: background 0.15s;
                }
                .btn-primary:hover { background: #1d4ed8; }
                .filters { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
                .filter-input {
                    padding: 0.6rem 0.875rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    outline: none;
                    background: #fff;
                    color: #374151;
                    transition: border-color 0.15s;
                }
                .filter-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
                .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
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
                .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
                .btn-sm {
                    padding: 0.35rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    text-decoration: none;
                    display: inline-block;
                    transition: background 0.15s;
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

                .btn-sm {
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s !important;
                }
                .btn-sm:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.1) !important;
                }
                .btn-primary {
                    transition: background 0.18s, transform 0.18s, box-shadow 0.18s !important;
                }
                .btn-primary:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(37,99,235,0.25) !important;
                }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">Newsletter Subscriptions</h2>
            </div> 

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
        </AdminLayout>
    );
}
