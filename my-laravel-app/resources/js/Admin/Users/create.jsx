import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

export default function AdminUsersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
        role: 'user', phone: '', is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout title="Create User">
            <style>{`
                .form-card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; max-width: 600px; }
                .form-group { margin-bottom: 1.25rem; }
                .form-label { display: block; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.45rem; }
                .form-input {
                    width: 100%;
                    padding: 0.7rem 0.875rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    color: #0f172a;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    background: #fff;
                }
                .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .form-input.err { border-color: #ef4444; }
                .form-error { color: #ef4444; font-size: 0.78rem; margin-top: 0.3rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .btn-primary {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.7rem 1.5rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel {
                    background: #f8fafc;
                    color: #374151;
                    border: 1px solid #e2e8f0;
                    padding: 0.7rem 1.5rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    transition: background 0.15s;
                }
                .btn-cancel:hover { background: #f1f5f9; }
                .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
            `}</style>

            <div className="page-header">
                <Link href="/admin/users" className="btn-cancel">← Back</Link>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Create New User</h2>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input className={`form-input${errors.name ? ' err' : ''}`} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Full name" />
                            {errors.name && <p className="form-error">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input type="email" className={`form-input${errors.email ? ' err' : ''}`} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@example.com" />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password *</label>
                            <input type="password" className={`form-input${errors.password ? ' err' : ''}`} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min 8 characters" />
                            {errors.password && <p className="form-error">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password *</label>
                            <input type="password" className="form-input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Role *</label>
                            <select className="form-input" value={data.role} onChange={e => setData('role', e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+1 234 567 8900" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Creating...' : 'Create User'}</button>
                        <Link href="/admin/users" className="btn-cancel">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
