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
                .page-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }
                .page-title {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #1a202c;
                    margin-bottom: 0.25rem;
                }
                .page-subtitle {
                    font-size: 0.875rem;
                    color: #3182ce;
                }
                .card {
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .section-label {
                    padding: 1.5rem 1.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #718096;
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
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #cbd5e0;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    color: #2d3748;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .form-input:focus {
                    border-color: #3182ce;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
                }
                .btn-submit {
                    background: #3182ce;
                    color: #ffffff;
                    border: none;
                    padding: 0.5rem 1.25rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .btn-submit:hover {
                    background: #2b6cb0;
                }
                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .form-error {
                    font-size: 0.75rem;
                    color: #e53e3e;
                    margin-top: 0.25rem;
                }
            `}</style>

            <div className="page-header">
                <div>
                    <div className="page-title">Email Setting</div>
                    <div className="page-subtitle">Add Email Settings</div>
                </div>
                <div style={{ visibility: 'hidden' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
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
                                    type="email"
                                    className="form-input"
                                    value={form.from_address}
                                    onChange={e => set('from_address', e.target.value)}
                                    placeholder="from@example.com"
                                />
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
        </AdminLayout>
    );
}
