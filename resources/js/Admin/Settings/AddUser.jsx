import AdminLayout from '../layouts/AdminLayout';

export default function AdminSettingsAddUser() {
    return (
        <AdminLayout title="Add User">
            <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Add User</h1>
                    <p style={{ color: '#475569', marginTop: '0.5rem' }}>Register a new user and assign them a role.</p>
                </div>
                <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc' }}>
                    <p style={{ margin: 0, color: '#334155' }}>This section is ready for your add-user form.</p>
                </div>
            </div>
        </AdminLayout>
    );
}
