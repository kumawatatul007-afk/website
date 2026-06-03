import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsAddRole({ roles }) {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [addModal, setAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '' });
    const [addLoading, setAddLoading] = useState(false);

    const [editModal, setEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Filter and paginate
    const filteredRoles = roles?.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedRoles = filteredRoles.slice(startIdx, startIdx + itemsPerPage);

    // Add functions
    const openAdd = () => {
        setAddForm({ name: '' });
        setAddModal(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setAddLoading(true);
        router.post('/admin/settings/user-management/add-role', addForm, {
            preserveScroll: true,
            onSuccess: () => {
                setAddLoading(false);
                setAddModal(false);
            },
            onError: () => setAddLoading(false),
        });
    };

    // Edit functions
    const openEdit = (role) => {
        setEditForm({ ...role });
        setEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setEditLoading(true);
        router.put(`/admin/settings/user-management/add-role/${editForm.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditLoading(false);
                setEditModal(false);
            },
            onError: () => setEditLoading(false),
        });
    };

    // Delete functions
    const openDelete = (role) => {
        setDeleteItem(role);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/settings/user-management/add-role/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteLoading(false);
                setDeleteModal(false);
            },
            onError: () => setDeleteLoading(false),
        });
    };

    return (
        <AdminLayout title="Role">
            <style>{`
                .seo-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    padding: 1.25rem 1.5rem;
                    background: #f5f5f5;
                    border-radius: 0;
                }
                .seo-title {
                    font-size: 1.75rem;
                    font-weight: 500;
                    color: #333;
                }
                .seo-subtitle {
                    font-size: 0.9rem;
                    color: #3b82f6;
                    margin-top: 0.25rem;
                }
                .seo-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .btn-add {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .btn-add:hover {
                    background: #2563eb;
                }
                .seo-card {
                    background: white;
                    border-radius: 0;
                    padding: 1.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #ec4899;
                    margin-bottom: 1.5rem;
                }
                .seo-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #ddd;
                }
                .show-entries {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: #444;
                }
                .show-entries select {
                    padding: 0.25rem 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .search-box label {
                    font-size: 0.9rem;
                    color: #444;
                }
                .search-box input {
                    padding: 0.35rem 0.5rem;
                    border: none;
                    border-bottom: 1px solid #aaa;
                    font-size: 0.9rem;
                    width: 200px;
                }
                .search-box input:focus {
                    outline: none;
                    border-bottom-color: #3b82f6;
                }
                .seo-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .seo-table th {
                    padding: 0.75rem;
                    text-align: left;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #333;
                    border-bottom: 2px solid #ddd;
                }
                .seo-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #ddd;
                    font-size: 0.9rem;
                    color: #333;
                }
                .seo-table tbody tr:nth-child(odd) {
                    background: #f5f5f5;
                }
                .route-name {
                    font-weight: 500;
                    color: #333;
                }
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }
                .btn-icon {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    color: #3b82f6;
                }
                .btn-icon.delete {
                    color: #3b82f6;
                }
                .pagination-area {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding-top: 1rem;
                }
                .info-text {
                    font-size: 0.9rem;
                    color: #666;
                }
                .pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .pagination-btn {
                    padding: 0.4rem 0.9rem;
                    border-radius: 20px;
                    background: #e0e0e0;
                    color: #666;
                    border: none;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .pagination-btn:hover:not(:disabled) {
                    background: #ccc;
                }
                .pagination-btn.active {
                    background: #666;
                    color: white;
                }
                .pagination-btn:disabled {
                    opacity: 0.5;
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
                                        className="form-control"
                                        value={addForm.name}
                                        onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. editor, manager"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={addLoading}>
                                    {addLoading ? 'Saving...' : 'Save'}
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
                                        className="form-control"
                                        value={editForm.name || ''}
                                        onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={editLoading}>
                                    {editLoading ? 'Saving...' : 'Save'}
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
                            <button type="button" className="btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
