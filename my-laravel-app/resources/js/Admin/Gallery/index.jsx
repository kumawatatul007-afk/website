import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { useState, useRef, useEffect } from 'react';
import { ShimmerPortfolioCard } from '../../components/ShimmerLoader';

export default function AdminGalleryIndex({ items, filters }) {
    const [file, setFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [shimmer, setShimmer] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 650);
        return () => clearTimeout(t);
    }, []);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Lightbox
    const [lightbox, setLightbox] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
        setUploadError('');
    };

    const submitUpload = (e) => {
        e.preventDefault();
        if (!file) { setUploadError('Please choose an image file.'); return; }
        setUploadLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        router.post('/admin/gallery', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setFile(null);
                setUploadError('');
                setUploadLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err) => {
                setUploadError(err.image ?? 'Upload failed. Please try again.');
                setUploadLoading(false);
            },
        });
    };

    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/gallery/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => { setDeleteModal(false); setDeleteLoading(false); },
            onFinish: () => setDeleteLoading(false),
        });
    };

    return (
        <AdminLayout title="Image Gallery">
            <style>{`
                /* ── Page title ── */
                .page-title {
                    font-size: 1.3rem; font-weight: 700; color: #0f172a;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }

                /* ── White card ── */
                .section-card {
                    background: #fff; border-radius: 10px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07);
                    border: 1px solid #f1f5f9;
                    padding: 1.75rem 1.75rem 1.5rem;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both;
                }
                .section-card:nth-child(2) { animation-delay: 0.06s; }
                .section-card:nth-child(3) { animation-delay: 0.12s; }

                /* ── Add Image heading ── */
                .add-heading {
                    font-size: 1rem; font-weight: 700;
                    color: #e91e8c; /* pink */
                    font-family: 'Courier New', monospace;
                    margin-bottom: 1.25rem;
                    letter-spacing: 0.02em;
                }

                /* ── Form ── */
                .form-label {
                    display: block; font-size: 0.875rem;
                    color: #374151; margin-bottom: 0.5rem; font-weight: 500;
                }
                .file-input-wrap {
                    display: flex; align-items: center;
                    border: 1px solid #d1d5db; border-radius: 5px;
                    overflow: hidden; width: 100%; max-width: 420px;
                    background: #fff;
                }
                .file-choose-btn {
                    padding: 0.45rem 0.875rem;
                    background: #f3f4f6; border: none; border-right: 1px solid #d1d5db;
                    font-size: 0.82rem; color: #374151; cursor: pointer;
                    white-space: nowrap; font-weight: 500;
                    transition: background 0.15s;
                }
                .file-choose-btn:hover { background: #e5e7eb; }
                .file-name-display {
                    padding: 0.45rem 0.75rem; font-size: 0.82rem;
                    color: #6b7280; flex: 1; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis;
                }
                .hidden-file-input { display: none; }

                .form-error { font-size: 0.75rem; color: #ef4444; margin-top: 0.5rem; }

                .upload-row {
                    display: flex; justify-content: flex-end;
                    margin-top: 1.25rem;
                }
                .btn-upload {
                    background: #0bc5b8; /* teal */
                    color: #fff; border: none;
                    padding: 0.55rem 1.5rem; border-radius: 6px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                    letter-spacing: 0.02em;
                }
                .btn-upload:hover { background: #0aa89c; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(11,197,184,0.3); }
                .btn-upload:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

                /* ── Gallery List heading ── */
                .gallery-heading {
                    font-size: 1rem; font-weight: 400;
                    margin-bottom: 1.25rem;
                }
                .gallery-heading .pink { color: #e91e8c; font-weight: 700; font-family: 'Courier New', monospace; }
                .gallery-heading .dark { color: #0f172a; font-weight: 700; }

                /* ── Grid ── */
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                }

                /* ── Card ── */
                .gallery-card {
                    border-radius: 10px; overflow: hidden;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    background: #fff;
                    transition: transform 0.2s, box-shadow 0.2s;
                    animation: fadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
                }
                .gallery-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

                .img-wrap {
                    position: relative; width: 100%; padding-top: 70%;
                    background: #f3f4f6; overflow: hidden; cursor: zoom-in;
                }
                .img-wrap img {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                    object-fit: cover; transition: transform 0.3s;
                }
                .gallery-card:hover .img-wrap img { transform: scale(1.05); }
                .img-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0);
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s;
                }
                .gallery-card:hover .img-overlay { background: rgba(0,0,0,0.22); }
                .zoom-icon { opacity: 0; color: #fff; font-size: 1.4rem; transition: opacity 0.2s; }
                .gallery-card:hover .zoom-icon { opacity: 1; }

                .img-placeholder {
                    position: absolute; inset: 0; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    color: #9ca3af; gap: 0.3rem; background: #f9fafb;
                }
                .img-placeholder span { font-size: 0.68rem; color: #d1d5db; }

                .card-body { padding: 0.65rem 0.75rem; }
                .card-name {
                    font-size: 0.72rem; color: #6b7280;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    margin-bottom: 0.25rem;
                }
                .card-date { font-size: 0.68rem; color: #9ca3af; margin-bottom: 0.5rem; }

                .btn-del {
                    width: 100%; padding: 0.35rem; border-radius: 5px;
                    font-size: 0.72rem; font-weight: 600; cursor: pointer; border: none;
                    background: #fef2f2; color: #dc2626;
                    display: flex; align-items: center; justify-content: center; gap: 0.3rem;
                    transition: background 0.15s;
                }
                .btn-del:hover { background: #fee2e2; }

                /* ── Empty ── */
                .empty-state {
                    text-align: center; padding: 3rem 1rem; color: #9ca3af;
                }
                .empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }

                /* ── Pagination ── */
                .pagination-wrap { margin-top: 1.25rem; }

                /* ── Animations ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .gallery-card:nth-child(1)  { animation-delay: 0.05s; }
                .gallery-card:nth-child(2)  { animation-delay: 0.09s; }
                .gallery-card:nth-child(3)  { animation-delay: 0.13s; }
                .gallery-card:nth-child(4)  { animation-delay: 0.17s; }
                .gallery-card:nth-child(5)  { animation-delay: 0.21s; }
                .gallery-card:nth-child(6)  { animation-delay: 0.25s; }
                .gallery-card:nth-child(7)  { animation-delay: 0.29s; }
                .gallery-card:nth-child(8)  { animation-delay: 0.33s; }
                .gallery-card:nth-child(9)  { animation-delay: 0.37s; }
                .gallery-card:nth-child(10) { animation-delay: 0.41s; }
                .gallery-card:nth-child(11) { animation-delay: 0.45s; }
                .gallery-card:nth-child(12) { animation-delay: 0.49s; }

                /* ── Delete Modal ── */
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(15,23,42,0.45);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; padding: 1rem; animation: fadeIn 0.15s ease;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box {
                    background: #fff; border-radius: 14px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
                    width: 100%; max-width: 380px;
                    animation: slideUp 0.18s ease;
                }
                @keyframes slideUp {
                    from { transform: translateY(18px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                .modal-body   { padding: 2rem 1.5rem 1rem; text-align: center; }
                .modal-footer {
                    display: flex; justify-content: flex-end; gap: 0.75rem;
                    padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9;
                }
                .btn-cancel {
                    background: #f1f5f9; color: #374151; border: none;
                    padding: 0.55rem 1.2rem; border-radius: 8px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                }
                .btn-cancel:hover { background: #e2e8f0; }
                .btn-danger {
                    background: #dc2626; color: #fff; border: none;
                    padding: 0.55rem 1.2rem; border-radius: 8px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                }
                .btn-danger:hover { background: #b91c1c; }
                .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ── Lightbox ── */
                .lightbox-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.92);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 2000; padding: 1rem; cursor: zoom-out;
                    animation: fadeIn 0.15s ease;
                }
                .lightbox-img {
                    max-width: 90vw; max-height: 85vh; border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    cursor: default; animation: slideUp 0.2s ease;
                }
                .lightbox-close {
                    position: fixed; top: 1.25rem; right: 1.25rem;
                    background: rgba(255,255,255,0.12); border: none; color: #fff;
                    width: 38px; height: 38px; border-radius: 50%; font-size: 1rem;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                }
                .lightbox-close:hover { background: rgba(255,255,255,0.22); }
                .lightbox-caption {
                    position: fixed; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
                    background: rgba(0,0,0,0.55); color: #fff;
                    padding: 0.3rem 1rem; border-radius: 20px;
                    font-size: 0.75rem; white-space: nowrap;
                    max-width: 80vw; overflow: hidden; text-overflow: ellipsis;
                }
            `}</style>

            <div className="page-title">Image Gallery</div>

            {/* ── Add Image Section ── */}
            <div className="section-card">
                <div className="add-heading">Add Image</div>
                <form onSubmit={submitUpload}>
                    <label className="form-label">Image</label>
                    <div className="file-input-wrap">
                        <button
                            type="button"
                            className="file-choose-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose Files
                        </button>
                        <span className="file-name-display">
                            {file ? file.name : 'No file chosen'}
                        </span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={handleFileChange}
                    />
                    {uploadError && <div className="form-error">{uploadError}</div>}
                    <div className="upload-row">
                        <button type="submit" className="btn-upload" disabled={uploadLoading}>
                            {uploadLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Gallery List Section ── */}
            <div className="section-card">
                <div className="gallery-heading">
                    <span className="pink">Gallery</span>{' '}
                    <span className="dark">List</span>
                </div>

                {shimmer ? (
                    <div className="gallery-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <ShimmerPortfolioCard />
                            </div>
                        ))}
                    </div>
                ) : items?.data?.length > 0 ? (
                    <>
                        <div className="gallery-grid">
                            {items.data.map((item) => (
                                <GalleryCard
                                    key={item.id}
                                    item={item}
                                    onZoom={() => setLightbox(item)}
                                    onDelete={() => { setDeleteItem(item); setDeleteModal(true); }}
                                />
                            ))}
                        </div>
                        {items?.links && (
                            <div className="pagination-wrap">
                                <Pagination links={items.links} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div>No images in gallery yet</div>
                    </div>
                )}
            </div>

            {/* ── DELETE MODAL ── */}
            {deleteModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModal(false)}>
                    <div className="modal-box">
                        <div className="modal-body">
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Delete Image?
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                                Delete <strong style={{ color: '#0f172a' }}>"{deleteItem?.image}"</strong>?
                                <br />This cannot be undone.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setDeleteModal(false)}>Cancel</button>
                            <button className="btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── LIGHTBOX ── */}
            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                    <img
                        className="lightbox-img"
                        src={lightbox.image_url}
                        alt={lightbox.image}
                        onClick={e => e.stopPropagation()}
                    />
                    <div className="lightbox-caption">{lightbox.image}</div>
                </div>
            )}
        </AdminLayout>
    );
}

/* ── Individual Gallery Card ── */
function GalleryCard({ item, onZoom, onDelete }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="gallery-card">
            <div className="img-wrap" onClick={!imgError ? onZoom : undefined}>
                {!imgError && item.image_url ? (
                    <>
                        <img
                            src={item.image_url}
                            alt={item.image}
                            onError={() => setImgError(true)}
                        />
                        <div className="img-overlay">
                            <span className="zoom-icon">🔍</span>
                        </div>
                    </>
                ) : (
                    <div className="img-placeholder">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Not available</span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <div className="card-name" title={item.image}>{item.image}</div>
                <div className="card-date">
                    {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                </div>
                <button className="btn-del" onClick={onDelete}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    );
}
