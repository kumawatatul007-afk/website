import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsEmail({ setting }) {
    const [form, setForm] = useState({
        driver: setting?.driver ?? 'smtp',
        host: setting?.host ?? '',
        port: setting?.port ?? '',
        username: setting?.username ?? '',
        password: setting?.password ?? '',
        encryption: setting?.encryption ?? 'tls',
        from_address: setting?.from_address ?? '',
        sendmail: setting?.sendmail ?? '',
        from_name: setting?.from_name ?? '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.put('/admin/settings/email', form, {
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError: (err) => { setErrors(err); setLoading(false); },
        });
    };

    return (
        <AdminLayout title="Email Setting">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-panel { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }
                .page-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .page-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.25rem;
                }
                .page-subtitle {
                    font-size: 0.95rem;
                    color: #2563eb;
                }
                .card {
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 12px 40px rgba(15,23,42,0.04);
                    border: 1px solid #f1f5f9;
                }
                .section-label {
                    padding: 1.5rem 1.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #94a3b8;
                }
                .section-label .pink {
                    color: #e53e3e;
                }
                .form-container {
                    padding: 0 1.5rem 1.5rem;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    color: #0f172a;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    background: #f8fafc;
                }
                .form-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
                }
                .btn-submit {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.85rem 1.65rem;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-submit:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(37,99,235,0.22);
                }
                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .form-error {
                    font-size: 0.8rem;
                    color: #dc2626;
                    margin-top: 0.35rem;
                }
            `}</style>

            <div className="page-container">
                <div className="page-panel">
                    <div className="page-header">
                        <div>
                            <div className="page-title">Email Setting</div>
                            <div className="page-subtitle">Add Email Settings</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-label">
                            <span className="pink">EMAIL</span> SETTING
                        </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Mail Mailer</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.driver}
                                    onChange={e => set('driver', e.target.value)}
                                    placeholder="smtp"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mail Host</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.host}
                                    onChange={e => set('host', e.target.value)}
                                    placeholder="smtp.gmail.com"
                                />
                                {errors.host && <div className="form-error">{errors.host}</div>}
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.username}
                                    onChange={e => set('username', e.target.value)}
                                    placeholder="username@gmail.com"
                                />
                                {errors.username && <div className="form-error">{errors.username}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Mail Port</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.port}
                                    onChange={e => set('port', e.target.value)}
                                    placeholder="587"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mail Encryption</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.encryption}
                                    onChange={e => set('encryption', e.target.value)}
                                    placeholder="tls"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Mail From Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.from_address}
                                    onChange={e => set('from_address', e.target.value)}
                                    placeholder="from@example.com"
                                />
                                {errors.from_address && <div className="form-error">{errors.from_address}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mail From Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.from_name}
                                    onChange={e => set('from_name', e.target.value)}
                                    placeholder="From Name"
                                />
                                {errors.from_name && <div className="form-error">{errors.from_name}</div>}
                            </div>
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Saving...' : 'SUBMIT'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        </AdminLayout>
    );
}
