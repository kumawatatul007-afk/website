import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function AdminMessageShow({ message }) {
    const handleDelete = () => {
        if (confirm('Delete this message?')) {
            router.delete(`/admin/messages/${message.id}`, {
                onSuccess: () => router.visit('/admin/messages'),
            });
        }
    };

    return (
        <AdminLayout title="View Message">
            <style>{`
                .msg-card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; max-width: 700px; }
                .msg-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
                .meta-item label { display: block; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; }
                .meta-item span { font-size: 0.9rem; color: #0f172a; font-weight: 500; }
                .msg-body { font-size: 0.9rem; color: #374151; line-height: 1.75; white-space: pre-wrap; background: #f8fafc; border-radius: 8px; padding: 1.25rem; border: 1px solid #f1f5f9; }
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
                .btn-delete {
                    background: #fef2f2;
                    color: #dc2626;
                    border: none;
                    padding: 0.7rem 1.5rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .btn-delete:hover { background: #fee2e2; }
                .btn-reply {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.7rem 1.5rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    transition: background 0.15s;
                }
                .btn-reply:hover { background: #1d4ed8; }
                .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
                .badge-read { background: #f0fdf4; color: #15803d; }
                .badge-unread { background: #fef2f2; color: #dc2626; }
                .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
                @media (max-width: 600px) { .msg-meta { grid-template-columns: 1fr; } }
            `}</style>

            <div className="page-header">
                <Link href="/admin/messages" className="btn-cancel">← Back</Link>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Message Detail</h2>
                <span className={`badge badge-${message.is_read ? 'read' : 'unread'}`}>{message.is_read ? 'Read' : 'Unread'}</span>
            </div>

            <div className="msg-card">
                <div className="msg-meta">
                    <div className="meta-item">
                        <label>From</label>
                        <span>{message.name}</span>
                    </div>
                    <div className="meta-item">
                        <label>Email</label>
                        <span>
                            <a href={`mailto:${message.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{message.email}</a>
                        </span>
                    </div>
                    <div className="meta-item">
                        <label>Subject</label>
                        <span>{message.subject || '(No subject)'}</span>
                    </div>
                    <div className="meta-item">
                        <label>Received</label>
                        <span>{new Date(message.created_at).toLocaleString()}</span>
                    </div>
                    {message.phone && (
                        <div className="meta-item">
                            <label>Phone</label>
                            <span>{message.phone}</span>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Message</p>
                    <div className="msg-body">{message.message}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    <a href={`mailto:${message.email}`} className="btn-reply">Reply via Email</a>
                    <button className="btn-delete" onClick={handleDelete}>Delete</button>
                    <Link href="/admin/messages" className="btn-cancel">Back to List</Link>
                </div>
            </div>
        </AdminLayout>
    );
}
