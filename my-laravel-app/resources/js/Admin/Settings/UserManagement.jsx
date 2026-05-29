import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsUserManagement() {
    const [loading, setLoading] = useState(false);

    return (
        <AdminLayout title="User Management">
            <style>{`
                .gs-page-header {
                    display: flex; align-items: flex-start; justify-content: space-between;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }
                .gs-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .gs-subtitle { font-size: 0.82rem; color: #2563eb; font-weight: 500; margin-top: 0.2rem; }

                .gs-card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
                    padding: 1.75rem 1.75rem 2rem;
                    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both;
                }

                .gs-section-label {
                    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
                    margin-bottom: 1.5rem;
                }
                .gs-section-label .pink { color: #e91e8c; }
                .gs-section-label .gray { color: #94a3b8; }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: #94a3b8;
                }
                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="gs-page-header">
                <div>
                    <div className="gs-title">User Management</div>
                    <div className="gs-subtitle">Manage user roles and permissions</div>
                </div>
            </div>

            <div className="gs-card">
                <div className="gs-section-label">
                    <span className="pink">USER</span>{' '}
                    <span className="gray">MANAGEMENT</span>
                </div>

                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>User Management Section</div>
                    <div style={{ fontSize: '0.875rem' }}>Coming soon! Manage users, roles, and permissions here.</div>
                </div>
            </div>
        </AdminLayout>
    );
}
