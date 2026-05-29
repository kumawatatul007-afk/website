import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function AdminServicesIndex({ services = [] }) {
    const handleDelete = (id) => {
        if (confirm('Delete this service?')) {
            router.delete(`/admin/services/${id}`);
        }
    };

    return (
        <AdminLayout title="Services">
            <style>{`
                .svc-wrap { padding: 0; }

                /* ── Page header ── */
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both;
                }
                .page-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; }

                .btn-new {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: #fff;
                    border: none;
                    padding: 0.65rem 1.4rem;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
                    white-space: nowrap;
                }
                .btn-new:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(37,99,235,0.4);
                }

                /* ── Card ── */
                .card {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(15,23,42,0.07);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                    animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.08s both;
                }

                /* ── Table ── */
                .svc-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                    table-layout: fixed;
                }

                .svc-table thead tr {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }

                .svc-table th {
                    text-align: left;
                    padding: 0.875rem 1rem;
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .svc-table td {
                    padding: 0.875rem 1rem;
                    border-bottom: 1px solid #f8fafc;
                    color: #374151;
                    vertical-align: middle;
                    overflow: hidden;
                }

                .svc-table tr:last-child td { border-bottom: none; }
                .svc-table tbody tr:hover td { background: #fafbff; }

                /* Column widths */
                .col-num    { width: 48px; }
                .col-title  { width: 30%; }
                .col-slug   { width: 22%; }
                .col-tags   { width: 18%; }
                .col-status { width: 90px; }
                .col-order  { width: 70px; }
                .col-actions { width: 130px; }

                /* ── Badges ── */
                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.7rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    white-space: nowrap;
                }
                .badge-active   { background: #f0fdf4; color: #15803d; }
                .badge-inactive { background: #fef2f2; color: #dc2626; }

                /* ── Action buttons ── */
                .actions-cell {
                    display: flex;
                    gap: 0.4rem;
                    align-items: center;
                    flex-wrap: nowrap;
                }

                .btn-sm {
                    padding: 0.35rem 0.8rem;
                    border-radius: 7px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s;
                    white-space: nowrap;
                    flex-shrink: 0;
                    min-width: 52px;
                }
                .btn-edit   { background: #eff6ff; color: #2563eb; }
                .btn-edit:hover   { background: #dbeafe; transform: translateY(-1px); }
                .btn-delete { background: #fef2f2; color: #dc2626; }
                .btn-delete:hover { background: #fee2e2; transform: translateY(-1px); }

                /* ── Title cell ── */
                .title-main {
                    font-weight: 600;
                    color: #0f172a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                    display: block;
                }
                .title-sub {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                    display: block;
                }

                /* ── Slug cell ── */
                .slug-text {
                    color: #2563eb;
                    font-size: 0.78rem;
                    font-weight: 500;
                    word-break: break-all;
                    line-height: 1.4;
                }

                /* ── Tags cell ── */
                .tags-text {
                    color: #64748b;
                    font-size: 0.78rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: block;
                }

                /* ── Empty state ── */
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #94a3b8;
                }
                .empty-state-title { font-size: 1rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem; }
                .empty-state-sub   { font-size: 0.85rem; }

                /* ── Count bar ── */
                .count-bar {
                    padding: 0.75rem 1.25rem;
                    border-top: 1px solid #f1f5f9;
                    background: #fafafa;
                    font-size: 0.78rem;
                    color: #94a3b8;
                    font-weight: 500;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .svc-table tbody tr {
                    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }
                .svc-table tbody tr:nth-child(1)  { animation-delay: 0.10s; }
                .svc-table tbody tr:nth-child(2)  { animation-delay: 0.14s; }
                .svc-table tbody tr:nth-child(3)  { animation-delay: 0.18s; }
                .svc-table tbody tr:nth-child(4)  { animation-delay: 0.22s; }
                .svc-table tbody tr:nth-child(5)  { animation-delay: 0.26s; }
                .svc-table tbody tr:nth-child(6)  { animation-delay: 0.30s; }
                .svc-table tbody tr:nth-child(7)  { animation-delay: 0.34s; }
                .svc-table tbody tr:nth-child(8)  { animation-delay: 0.38s; }
                .svc-table tbody tr:nth-child(9)  { animation-delay: 0.42s; }
                .svc-table tbody tr:nth-child(10) { animation-delay: 0.46s; }

                /* Responsive: hide tags on small screens */
                @media (max-width: 900px) {
                    .col-tags, .hide-sm { display: none; }
                    .col-title { width: 40%; }
                }
                @media (max-width: 640px) {
                    .col-slug, .hide-xs { display: none; }
                    .col-title { width: 55%; }
                }
            `}</style>

            <div className="svc-wrap">
                {/* Header */}
                <div className="page-header">
                    <h2 className="page-title">Services</h2>
                    <Link href="/admin/services/create" className="btn-new">+ New Service</Link>
                </div>

                {/* Table card */}
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table className="svc-table">
                            <thead>
                                <tr>
                                    <th className="col-num">#</th>
                                    <th className="col-title">Title</th>
                                    <th className="col-slug hide-xs">Slug</th>
                                    <th className="col-tags hide-sm">Tags</th>
                                    <th className="col-status">Status</th>
                                    <th className="col-order">Order</th>
                                    <th className="col-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 ? services.map((svc, i) => (
                                    <tr key={svc.id}>
                                        {/* # */}
                                        <td className="col-num" style={{ color: '#cbd5e1', fontWeight: 700 }}>
                                            {i + 1}
                                        </td>

                                        {/* Title + meta desc */}
                                        <td className="col-title">
                                            <span className="title-main">{svc.title}</span>
                                            {svc.meta_description && (
                                                <span className="title-sub">{svc.meta_description}</span>
                                            )}
                                        </td>

                                        {/* Slug */}
                                        <td className="col-slug hide-xs">
                                            <span className="slug-text">{svc.slug || '—'}</span>
                                        </td>

                                        {/* Tags */}
                                        <td className="col-tags hide-sm">
                                            <span className="tags-text">{svc.tags || '—'}</span>
                                        </td>

                                        {/* Status */}
                                        <td className="col-status">
                                            <span className={`badge ${svc.status == 1 ? 'badge-active' : 'badge-inactive'}`}>
                                                {svc.status == 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Order */}
                                        <td className="col-order" style={{ color: '#94a3b8', fontWeight: 600 }}>
                                            {svc.serial_number ?? '—'}
                                        </td>

                                        {/* Actions */}
                                        <td className="col-actions">
                                            <div className="actions-cell">
                                                <Link
                                                    href={`/admin/services/${svc.id}/edit`}
                                                    className="btn-sm btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn-sm btn-delete"
                                                    onClick={() => handleDelete(svc.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="empty-state">
                                                <div className="empty-state-title">No services found</div>
                                                <div className="empty-state-sub">Click "+ New Service" to add one.</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Count footer */}
                    {services.length > 0 && (
                        <div className="count-bar">
                            Showing {services.length} service{services.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
