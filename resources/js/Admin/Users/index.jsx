import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState } from 'react';

export default function AdminUsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = () => {
        router.get('/admin/users', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout title="Users">
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
                .badge-admin { background: #ede9fe; color: #6d28d9; }
                .badge-user { background: #e0f2fe; color: #0369a1; }
                .avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
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
                .btn-edit { background: #eff6ff; color: #2563eb; }
                .btn-edit:hover { background: #dbeafe; }
                .btn-delete { background: #fef2f2; color: #dc2626; }
                .btn-delete:hover { background: #fee2e2; }
                .empty { text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.875rem; }
                .pagination-wrap { padding: 1rem 1.25rem; border-top: 1px solid #f1f5f9; }

                /* ── Animations ── */
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
                <h2 className="page-title">All Users</h2>
                <Link href="/admin/users/create" className="btn-primary">+ New User</Link>
            </div>

            <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search name or email..."
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${user.email_verified_at ? 'badge-admin' : 'badge-user'}`}>
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <Link href={`/admin/users/${user.id}/edit`} className="btn-sm btn-edit">Edit</Link>
                                        <button className="btn-sm btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="empty">No users found</td></tr>
                        )}
                    </tbody>
                </table>
                {users?.links && <div className="pagination-wrap"><Pagination links={users.links} /></div>}
            </div>
        </AdminLayout>
    );
}
