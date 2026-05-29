import AdminLayout from '../layouts/AdminLayout';

export default function AdminSettingsScripts({ scripts }) {
    return (
        <AdminLayout title="Scripts">
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
                    margin-bottom: 1.5rem;
                }
                .card-header {
                    padding: 1.5rem 1.5rem 0.5rem;
                }
                .card-body {
                    padding: 0.5rem 1.5rem 1.5rem;
                }
                .section-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #718096;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
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
                .form-input,
                .form-textarea,
                .form-select {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #cbd5e0;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    color: #2d3748;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    background: white;
                }
                .form-input:focus,
                .form-textarea:focus,
                .form-select:focus {
                    border-color: #3182ce;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
                }
                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                .btn-save {
                    background: #38a169;
                    color: #ffffff;
                    border: none;
                    padding: 0.75rem 1.25rem;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .btn-save:hover {
                    background: #2f855a;
                }
                .seo-item {
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    margin-bottom: 1rem;
                    overflow: hidden;
                }
                .seo-item-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: #f7fafc;
                    border-bottom: 1px solid #e2e8f0;
                }
                .field-group {
                    margin-bottom: 1rem;
                }
                .field-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #718096;
                    text-transform: uppercase;
                    margin-bottom: 0.25rem;
                }
                .field-value {
                    font-size: 0.875rem;
                    color: #2d3748;
                    padding: 0.75rem;
                    background: #f7fafc;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                    white-space: pre-wrap;
                }
            `}</style>
            <div className="page-header">
                <div>
                    <div className="page-title">Scripts</div>
                    <div className="page-subtitle">Manage custom script snippets.</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="section-label">Existing Scripts</div>
                </div>
                <div className="card-body">
                    {scripts && scripts.length > 0 ? (
                        scripts.map((script) => (
                            <div key={script.id} className="seo-item">
                                <div className="seo-item-header">
                                    <div>
                                        <strong>{script.name}</strong>
                                        <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                                            {script.is_publish ? 'Published' : 'Unpublished'} · {script.status ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                                <div className="seo-item-body">
                                    <div className="field-group">
                                        <div className="field-label">Script</div>
                                        <div className="field-value" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                            {script.script || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', color: '#718096', padding: '1.5rem' }}>
                            No scripts found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
