import AdminLayout from '../layouts/AdminLayout';
import { useState } from 'react';

export default function AdminSettingsPermission({ permissions }) {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and paginate
    const filteredPermissions = permissions?.filter(permission =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.guard_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedPermissions = filteredPermissions.slice(startIdx, startIdx + itemsPerPage);

    return (
        <AdminLayout title="Permissions">
            <style>{`
                .permission-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    padding: 1.25rem 1.5rem;
                    background: #f5f5f5;
                    border-radius: 0;
                }
                .permission-title {
                    font-size: 1.75rem;
                    font-weight: 500;
                    color: #333;
                }
                .permission-subtitle {
                    font-size: 0.9rem;
                    color: #3b82f6;
                    margin-top: 0.25rem;
                }
                .permission-card {
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
                .permission-controls {
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
                .permission-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .permission-table th {
                    padding: 0.75rem;
                    text-align: left;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #333;
                    border-bottom: 2px solid #ddd;
                }
                .permission-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #ddd;
                    font-size: 0.9rem;
                    color: #333;
                }
                .permission-table tbody tr:nth-child(odd) {
                    background: #f5f5f5;
                }
                .permission-name {
                    font-weight: 500;
                    color: #333;
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
            `}</style>

            {/* Header */}
            <div className="permission-header">
                <div>
                    <div className="permission-title">Permissions</div>
                    <div className="permission-subtitle">Permission Details</div>
                </div>
            </div>

            {/* Card */}
            <div className="permission-card">
                <div className="card-title">Permission Details</div>

                {/* Controls */}
                <div className="permission-controls">
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
                <table className="permission-table">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>ID
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>⇅</span>
                            </th>
                            <th style={{ width: '30%' }}>Name
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>⇅</span>
                            </th>
                            <th style={{ width: '15%' }}>Guard
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>⇅</span>
                            </th>
                            <th style={{ width: '20%' }}>Created At
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>⇅</span>
                            </th>
                            <th style={{ width: '20%' }}>Updated At
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>⇅</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPermissions && paginatedPermissions.map((permission) => (
                            <tr key={permission.id}>
                                <td>{permission.id}</td>
                                <td className="permission-name">{permission.name}</td>
                                <td>{permission.guard_name || 'web'}</td>
                                <td>{permission.created_at || 'N/A'}</td>
                                <td>{permission.updated_at || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-area">
                    <span className="info-text">
                        Showing {filteredPermissions.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, filteredPermissions.length)} of {filteredPermissions.length} entries
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
        </AdminLayout>
    );
}
