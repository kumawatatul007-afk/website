import AdminLayout from '../layouts/AdminLayout';
import { Link } from '@inertiajs/react';

const cards = [
    {
        href: '/admin/settings/user-management/add-role',
        label: 'Roles',
        description: 'Create and manage user roles',
        color: '#6366f1',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <path d="M20 8v4" /><path d="M22 10h-4" />
            </svg>
        ),
    },
    {
        href: '/admin/users',
        label: 'Users',
        description: 'View, add, and manage users',
        color: '#0ea5e9',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        href: '/admin/settings/user-management/permission',
        label: 'Permissions',
        description: 'Control access and permissions',
        color: '#f59e0b',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L4 5v6c0 5 3.58 9.74 8 11 4.42-1.26 8-6 8-11V5l-8-3z" />
                <path d="M9 11h6" /><path d="M12 14v-6" />
            </svg>
        ),
    },
];

export default function AdminSettingsUserManagement() {
    return (
        <AdminLayout title="User Management">
            <style>{`
                .um-page-header {
                    display: flex; align-items: flex-start; justify-content: space-between;
                    margin-bottom: 1.75rem;
                    animation: umFadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }
                .um-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .um-subtitle { font-size: 0.82rem; color: #2563eb; font-weight: 500; margin-top: 0.25rem; }

                .um-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.25rem;
                    animation: umFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both;
                }

                .um-card {
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                    padding: 1.5rem 1.5rem 1.25rem;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .um-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.1);
                }

                .um-card-icon {
                    width: 52px; height: 52px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                .um-card-label {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.2rem;
                }
                .um-card-desc {
                    font-size: 0.82rem;
                    color: #64748b;
                }

                .um-card-arrow {
                    margin-top: auto;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                @keyframes umFadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="um-page-header">
                <div>
                    <div className="um-title">User Management</div>
                    <div className="um-subtitle">Manage users, roles and permissions</div>
                </div>
            </div>

            <div className="um-cards-grid">
                {cards.map(card => (
                    <Link key={card.href} href={card.href} className="um-card">
                        <div
                            className="um-card-icon"
                            style={{ background: card.color + '18', color: card.color }}
                        >
                            {card.icon}
                        </div>
                        <div>
                            <div className="um-card-label">{card.label}</div>
                            <div className="um-card-desc">{card.description}</div>
                        </div>
                        <div className="um-card-arrow" style={{ color: card.color }}>
                            Manage {card.label}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
