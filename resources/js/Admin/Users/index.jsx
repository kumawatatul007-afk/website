import AdminLayout from '../layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function CreateUserModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'user', phone: '',
    });

    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape' && !processing) onClose(); };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [processing, onClose]);

    const onSubmit = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const inputStyle = (field) => ({
        width: '100%', padding: '0.75rem 0.95rem', borderRadius: '10px', border: `1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
        fontSize: '0.875rem', outline: 'none', background: '#fff', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
    });

    const fieldLabel = { display: 'block', marginBottom: '0.35rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#64748b', fontWeight: 700 };
    const errorText = { display: 'block', marginTop: '0.35rem', fontSize: '0.75rem', color: '#ef4444' };

    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, padding: '1rem' }}
            onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
        >
            <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 28px 90px rgba(15,23,42,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Create New User</h3>
                        <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>Add a new user directly from this page.</p>
                    </div>
                    <button type="button" onClick={() => !processing && onClose()} style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', cursor: processing ? 'not-allowed' : 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label style={fieldLabel}>Name *</label>
                            <input style={inputStyle('name')} value={data.name} onChange={e => setData('name', e.target.value)} disabled={processing} />
                            {errors.name && <span style={errorText}>{errors.name}</span>}
                        </div>
                        <div>
                            <label style={fieldLabel}>Email *</label>
                            <input type="email" style={inputStyle('email')} value={data.email} onChange={e => setData('email', e.target.value)} disabled={processing} />
                            {errors.email && <span style={errorText}>{errors.email}</span>}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label style={fieldLabel}>Password *</label>
                            <input type="password" style={inputStyle('password')} value={data.password} onChange={e => setData('password', e.target.value)} disabled={processing} />
                            {errors.password && <span style={errorText}>{errors.password}</span>}
                        </div>
                        <div>
                            <label style={fieldLabel}>Confirm Password *</label>
                            <input type="password" style={inputStyle('password_confirmation')} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} disabled={processing} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label style={fieldLabel}>Role *</label>
                            <select value={data.role} onChange={e => setData('role', e.target.value)} disabled={processing} style={{ ...inputStyle('role'), cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label style={fieldLabel}>Phone</label>
                            <input style={inputStyle('phone')} value={data.phone} onChange={e => setData('phone', e.target.value)} disabled={processing} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => !processing && onClose()} disabled={processing} style={{ flex: '1 1 140px', padding: '0.85rem 1rem', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: processing ? 0.6 : 1 }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} style={{ flex: '2 1 220px', padding: '0.85rem 1rem', borderRadius: 12, border: 'none', background: processing ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', boxShadow: processing ? 'none' : '0 10px 25px rgba(37,99,235,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {processing ? 'Creating…' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default function AdminUsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [createModal, setCreateModal] = useState(false);

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
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-panel { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }
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

            <div className="page-container">
                <div className="page-panel">
                    <div className="page-header">
                        <h2 className="page-title">All Users</h2>
                        <button type="button" className="btn-primary" onClick={() => setCreateModal(true)}>
                            + New User
                        </button>
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
                </div>
            </div>
            {createModal && <CreateUserModal onClose={() => setCreateModal(false)} />}
        </AdminLayout>
    );
}
