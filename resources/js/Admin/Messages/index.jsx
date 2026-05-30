import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/* ── Message Detail Modal ─────────────────────────────────────────────────── */
function MessageModal({ message, onClose, onDelete }) {
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!message.is_read) {
            router.patch(`/admin/messages/${message.id}/read`, {}, { preserveScroll: true, preserveState: true });
        }
    }, [message.id]);

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && !deleting && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [deleting, onClose]);

    const handleDelete = () => {
        if (!confirm('Delete this message?')) return;
        setDeleting(true);
        router.delete(`/admin/messages/${message.id}`, {
            preserveScroll: true,
            onSuccess: () => { setDeleting(false); onClose(); },
            onError:   () => setDeleting(false),
        });
    };

    const lbl = { fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.3rem', display: 'block' };

    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '1rem', animation: 'msgOverlayIn .2s ease both' }}
            onClick={(e) => e.target === e.currentTarget && !deleting && onClose()}
        >
            <div style={{ background: 'linear-gradient(145deg,#ffffff,#f8faff)', borderRadius: '20px', width: '100%', maxWidth: '540px', boxShadow: '0 24px 60px rgba(15,23,42,0.22), 0 0 0 1px rgba(99,102,241,0.08)', animation: 'msgPanelIn .3s cubic-bezier(.22,1,.36,1) both', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Message Detail</h3>
                            <span style={{ fontSize: '.68rem', background: message.is_read ? '#f0fdf4' : '#fef2f2', color: message.is_read ? '#15803d' : '#dc2626', padding: '.1rem .45rem', borderRadius: '5px', fontWeight: 700 }}>
                                {message.is_read ? 'Read' : 'Unread'}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => !deleting && onClose()} style={{ width: 30, height: 30, borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '1rem', lineHeight: 1 }}>
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                    {/* Meta grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.875rem', marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div>
                            <span style={lbl}>From</span>
                            <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#0f172a' }}>{message.name}</div>
                        </div>
                        <div>
                            <span style={lbl}>Email</span>
                            <a href={`mailto:${message.email}`} style={{ fontSize: '.875rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}>{message.email}</a>
                        </div>
                        <div>
                            <span style={lbl}>Subject</span>
                            <div style={{ fontSize: '.875rem', color: '#374151', fontWeight: 500 }}>{message.subject || '(No subject)'}</div>
                        </div>
                        <div>
                            <span style={lbl}>Received</span>
                            <div style={{ fontSize: '.875rem', color: '#374151', fontWeight: 500 }}>{new Date(message.created_at).toLocaleString()}</div>
                        </div>
                        {message.phone && (
                            <div>
                                <span style={lbl}>Phone</span>
                                <div style={{ fontSize: '.875rem', color: '#374151', fontWeight: 500 }}>{message.phone}</div>
                            </div>
                        )}
                    </div>

                    {/* Message body */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <span style={lbl}>Message</span>
                        <div style={{ fontSize: '.875rem', color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap', background: '#fff', borderRadius: '10px', padding: '1rem', border: '1.5px solid #e2e8f0', maxHeight: 180, overflowY: 'auto' }}>
                            {message.message}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                        <button onClick={() => !deleting && onClose()} disabled={deleting}
                            style={{ flex: 1, padding: '.7rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
                            Close
                        </button>
                        <button onClick={handleDelete} disabled={deleting}
                            style={{ flex: 1, padding: '.7rem', borderRadius: '12px', border: 'none', background: deleting ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: '.875rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', boxShadow: deleting ? 'none' : '0 4px 14px rgba(239,68,68,.3)', transition: 'all .15s' }}>
                            {deleting ? (
                                <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'msgSpin .65s linear infinite', display: 'inline-block' }} />Deleting…</>
                            ) : (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function AdminMessagesIndex({ messages, filters }) {
    const [search,         setSearch]        = useState(filters?.search ?? '');
    const [status,         setStatus]        = useState(filters?.status ?? '');
    const [selectedMsg,    setSelectedMsg]   = useState(null);

    const applyFilters = () => {
        router.get('/admin/messages', { search, status }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this message?')) {
            router.delete(`/admin/messages/${id}`);
        }
    };

    const handleMarkRead = (id) => {
        router.patch(`/admin/messages/${id}/read`, {}, { preserveState: true, preserveScroll: true });
    };

    const closeModal = useCallback(() => setSelectedMsg(null), []);

    return (
        <AdminLayout title="Messages">
            <style>{`
                @keyframes msgOverlayIn { from { opacity:0 } to { opacity:1 } }
                @keyframes msgPanelIn   { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:none } }
                @keyframes msgSpin      { to { transform:rotate(360deg) } }
                .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
                .page-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .btn-primary {
                    background: #2563eb; color: #fff; border: none;
                    padding: 0.6rem 1.25rem; border-radius: 8px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                    text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
                .filters { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
                .filter-input {
                    padding: 0.6rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px;
                    font-size: 0.875rem; outline: none; background: #fff; color: #374151; transition: border-color 0.15s;
                }
                .filter-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
                .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
                .table th {
                    text-align: left; padding: 0.75rem 1.25rem;
                    font-size: 0.7rem; font-weight: 700; color: #94a3b8;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    border-bottom: 1px solid #f1f5f9; background: #fafafa;
                }
                .table td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #f8fafc; color: #374151; vertical-align: middle; }
                .table tr:last-child td { border-bottom: none; }
                .table tr:hover td { background: #fafafa; }
                .table tr.unread td { background: #fffbeb; }
                .table tr.unread:hover td { background: #fef9c3; }
                .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
                .badge-read { background: #f0fdf4; color: #15803d; }
                .badge-unread { background: #fef2f2; color: #dc2626; }
                .btn-sm {
                    padding: 0.35rem 0.75rem; border-radius: 6px;
                    font-size: 0.78rem; font-weight: 600; cursor: pointer;
                    border: none; text-decoration: none; display: inline-block;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-sm:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.1); }
                .btn-view { background: #eff6ff; color: #2563eb; }
                .btn-view:hover { background: #dbeafe; }
                .btn-mark { background: #f0fdf4; color: #15803d; }
                .btn-mark:hover { background: #dcfce7; }
                .btn-delete { background: #fef2f2; color: #dc2626; }
                .btn-delete:hover { background: #fee2e2; }
                .empty { text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.875rem; }
                .pagination-wrap { padding: 1rem 1.25rem; border-top: 1px solid #f1f5f9; }
                @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
                .page-header { animation: fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                .filters     { animation: fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
                .card        { animation: fadeSlideUp 0.4s  cubic-bezier(0.22,1,0.36,1) 0.1s  both; }
                .table tbody tr { animation: fadeSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both; }
                .table tbody tr:nth-child(1)  { animation-delay:.12s }
                .table tbody tr:nth-child(2)  { animation-delay:.17s }
                .table tbody tr:nth-child(3)  { animation-delay:.22s }
                .table tbody tr:nth-child(4)  { animation-delay:.27s }
                .table tbody tr:nth-child(5)  { animation-delay:.32s }
                .table tbody tr:nth-child(6)  { animation-delay:.37s }
                .table tbody tr:nth-child(7)  { animation-delay:.42s }
                .table tbody tr:nth-child(8)  { animation-delay:.47s }
                .table tbody tr:nth-child(9)  { animation-delay:.52s }
                .table tbody tr:nth-child(10) { animation-delay:.57s }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">Contact Messages</h2>
            </div>

            <div className="filters">
                <input
                    className="filter-input"
                    placeholder="Search name, email or subject..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    style={{ flex: 1, minWidth: 200 }}
                />
                <select
                    className="filter-input"
                    value={status}
                    onChange={e => { setStatus(e.target.value); router.get('/admin/messages', { search, status: e.target.value }, { preserveState: true, replace: true }); }}
                >
                    <option value="">All Messages</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                </select>
                <button className="btn-primary" onClick={applyFilters}>Search</button>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages?.data?.length > 0 ? messages.data.map(msg => (
                            <tr key={msg.id} className={!msg.is_read ? 'unread' : ''}>
                                <td>
                                    <div style={{ fontWeight: msg.is_read ? 500 : 700, color: '#0f172a' }}>{msg.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{msg.email}</div>
                                </td>
                                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: msg.is_read ? 400 : 600, color: '#374151' }}>
                                    {msg.subject || '(No subject)'}
                                </td>
                                <td><span className={`badge badge-${msg.is_read ? 'read' : 'unread'}`}>{msg.is_read ? 'Read' : 'Unread'}</span></td>
                                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <button className="btn-sm btn-view" onClick={() => setSelectedMsg(msg)}>View</button>
                                        {!msg.is_read && <button className="btn-sm btn-mark" onClick={() => handleMarkRead(msg.id)}>Mark Read</button>}
                                        <button className="btn-sm btn-delete" onClick={() => handleDelete(msg.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="empty">No messages found</td></tr>
                        )}
                    </tbody>
                </table>
                {messages?.links && <div className="pagination-wrap"><Pagination links={messages.links} /></div>}
            </div>

            {selectedMsg && (
                <MessageModal
                    message={selectedMsg}
                    onClose={closeModal}
                    onDelete={closeModal}
                />
            )}
        </AdminLayout>
    );
}
