import AdminLayout from '../layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsAddRole({ roles }) {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [addModal, setAddModal] = useState(false);
    const addForm = useForm({ name: '' });

    const [editModal, setEditModal] = useState(false);
    const editForm = useForm({ id: null, name: '' });

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const deleteForm = useForm({});

    // Filter and paginate
    const filteredRoles = roles?.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedRoles = filteredRoles.slice(startIdx, startIdx + itemsPerPage);

    // Add functions
    const openAdd = () => {
        addForm.setData('name', '');
        addForm.clearErrors();
        setAddModal(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/settings/user-management/add-role', {
            preserveScroll: true,
            onSuccess: () => {
                setAddModal(false);
            },
        });
    };

    // Edit functions
    const openEdit = (role) => {
        editForm.setData({ id: role.id, name: role.name });
        editForm.clearErrors();
        setEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/settings/user-management/add-role/${editForm.data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditModal(false);
            },
        });
    };

    // Delete functions
    const openDelete = (role) => {
        setDeleteItem(role);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteForm.delete(`/admin/settings/user-management/add-role/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal(false);
            },
        });
    };

    return (
        <AdminLayout title="Role">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-panel { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }
                .seo-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    padding: 1.5rem 1.75rem;
                    background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(167,139,250,0.05));
                    border-radius: 24px;
                    border: 1px solid rgba(99,102,241,0.12);
                    box-shadow: 0 18px 50px rgba(99,102,241,0.08);
                }
                .seo-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    letter-spacing: -0.02em;
                }
                .seo-subtitle {
                    font-size: 0.95rem;
                    color: #7c3aed;
                    margin-top: 0.35rem;
                }
                .seo-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .btn-add {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.95rem 1.5rem;
                    border-radius: 18px;
                    border: none;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #fff;
                    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
                    box-shadow: 0 16px 38px rgba(99,102,241,0.22);
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                }
                .btn-add:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 22px 50px rgba(99,102,241,0.28);
                    opacity: 0.98;
                }
                .seo-card {
                    background: linear-gradient(180deg, #ffffff 0%, #f8f6ff 100%);
                    border-radius: 24px;
                    padding: 1.75rem;
                    box-shadow: 0 20px 55px rgba(15,23,42,0.08);
                    border: 1px solid rgba(99,102,241,0.12);
                }
                .card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #d946ef;
                    margin-bottom: 1.5rem;
                }
                .seo-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(148,163,184,0.18);
                }
                .show-entries {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                    color: #475569;
                }
                .show-entries select {
                    padding: 0.75rem 0.95rem;
                    border-radius: 14px;
                    border: 1px solid rgba(148,163,184,0.45);
                    background: #fff;
                    color: #0f172a;
                    font-size: 0.95rem;
                    font-weight: 600;
                    min-width: 5rem;
                }
                .show-entries select:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 4px rgba(124,58,237,0.12);
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .search-box label {
                    font-size: 0.95rem;
                    color: #475569;
                }
                .search-box input {
                    width: 220px;
                    padding: 0.85rem 1rem;
                    border-radius: 16px;
                    border: 1px solid rgba(148,163,184,0.4);
                    background: #fff;
                    color: #0f172a;
                    font-size: 0.95rem;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .search-box input:focus {
                    outline: none;
                    border-color: #7c3aed;
                    box-shadow: 0 0 0 4px rgba(124,58,237,0.12);
                }
                .seo-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    background: #fff;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 18px 40px rgba(15,23,42,0.08);
                }
                .seo-table th,
                .seo-table td {
                    padding: 1rem 1.25rem;
                }
                .seo-table th {
                    text-align: left;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #0f172a;
                    background: linear-gradient(180deg, #f8f5ff 0%, #f3f0ff 100%);
                    border-bottom: 1px solid rgba(148,163,184,0.18);
                }
                .seo-table td {
                    font-size: 0.95rem;
                    color: #334155;
                    border-bottom: 1px solid rgba(148,163,184,0.14);
                }
                .seo-table tbody tr {
                    transition: background 0.2s ease;
                }
                .seo-table tbody tr:hover {
                    background: rgba(167,139,250,0.1);
                }
                .seo-table tbody tr:nth-child(odd) {
                    background: rgba(99,102,241,0.04);
                }
                .route-name {
                    font-weight: 600;
                    color: #1e293b;
                }
                .action-buttons {
                    display: flex;
                    gap: 0.65rem;
                    justify-content: center;
                }
                .btn-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 14px;
                    border: 1px solid rgba(99,102,241,0.18);
                    background: #f8f5ff;
                    color: #5b21b6;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
                }
                .btn-icon:hover {
                    transform: translateY(-1px);
                    background: #ede9fe;
                    box-shadow: 0 10px 22px rgba(99,102,241,0.12);
                }
                .btn-icon.delete {
                    background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
                    color: #fff;
                    border-color: transparent;
                }
                .btn-icon.delete:hover {
                    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
                    box-shadow: 0 10px 24px rgba(220,38,38,0.2);
                }
                .pagination-area {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(148,163,184,0.18);
                }
                .info-text {
                    font-size: 0.95rem;
                    color: #64748b;
                }
                .pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    flex-wrap: wrap;
                }
                .pagination-btn {
                    min-width: 2.7rem;
                    padding: 0.7rem 1rem;
                    border-radius: 999px;
                    background: #eef2ff;
                    color: #4338ca;
                    border: 1px solid transparent;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
                }
                .pagination-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    background: #e0e7ff;
                    box-shadow: 0 10px 24px rgba(99,102,241,0.12);
                }
                .pagination-btn.active {
                    background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
                    color: #fff;
                    box-shadow: 0 14px 30px rgba(99,102,241,0.24);
                }
                .pagination-btn:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-box {
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 85vh;
                    overflow-y: auto;
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #eee;
                }
                .modal-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #eee;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #444;
                    margin-bottom: 0.35rem;
                }
                .form-control {
                    width: 100%;
                    padding: 0.55rem 0.75rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    box-sizing: border-box;
                }
                .form-control:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                .form-control.error {
                    border-color: #dc2626;
                }
                .error-text {
                    font-size: 0.75rem;
                    color: #dc2626;
                    margin-top: 0.25rem;
                }
                .btn-cancel {
                    background: #e5e7eb;
                    color: #374151;
                    border: none;
                    padding: 0.6rem 1.25rem;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .btn-cancel:hover {
                    background: #d1d5db;
                }
                .btn-primary {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.6rem 1.25rem;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .btn-primary:hover {
                    background: #059669;
                }
                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .btn-danger {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.6rem 1.25rem;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .btn-danger:hover {
                    background: #dc2626;
                }
                .btn-danger:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>

            <div className="page-container">
                <div className="page-panel">
                    {/* Header */}
                    <div className="seo-header">
                <div>
                    <div className="seo-title">Role</div>
                    <div className="seo-subtitle">Role Details</div>
                </div>
                <div className="seo-actions">
                    <button className="btn-add" onClick={openAdd}>Add</button>
                </div>
            </div>

                    {/* Card */}
                    <div className="seo-card">
                <div className="card-title">Roles</div>

                {/* Controls */}
                <div className="seo-controls">
                    <div className="show-entries">
                        Show
                        <select value={itemsPerPage} onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        entries
                    </div>
                    <div className="search-box">
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <table className="seo-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>Name
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>⇅</span>
                            </th>
                            <th style={{ width: '40%' }}>Action
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>⇅</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRoles && paginatedRoles.map((role) => (
                            <tr key={role.id}>
                                <td className="route-name">{role.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon"
                                            onClick={() => openEdit(role)}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="btn-icon delete"
                                            onClick={() => openDelete(role)}
                                            title="Delete"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-area">
                    <span className="info-text">
                        Showing {filteredRoles.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, filteredRoles.length)} of {filteredRoles.length} entries
                    </span>
                    <div className="pagination-buttons">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            PREVIOUS
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

            {/* Add Modal */}
            {addModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setAddModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <span className="modal-title">Add Role</span>
                            <button className="modal-close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        className={`form-control ${addForm.errors.name ? 'error' : ''}`}
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        placeholder="e.g. editor, manager"
                                    />
                                    {addForm.errors.name && <div className="error-text">{addForm.errors.name}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={addForm.processing}>
                                    {addForm.processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <span className="modal-title">Edit Role</span>
                            <button className="modal-close" onClick={() => setEditModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        className={`form-control ${editForm.errors.name ? 'error' : ''}`}
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                    {editForm.errors.name && <div className="error-text">{editForm.errors.name}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={editForm.processing}>
                                    {editForm.processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteModal(false)}>
                    <div className="modal-box" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <span className="modal-title">Delete Role</span>
                            <button className="modal-close" onClick={() => setDeleteModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete "{deleteItem?.name}"?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cancel" onClick={() => setDeleteModal(false)}>Cancel</button>
                            <button type="button" className="btn-danger" onClick={confirmDelete} disabled={deleteForm.processing}>
                                {deleteForm.processing ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
