import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminPortfolioEdit({ item, categories = [] }) {
    const [imagePreview, setImagePreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title:             item.title             ?? '',
        category_id:       item.category_id       ?? '',
        image:             item.image             ?? '',
        image_file:        null,
        clint_name:        item.clint_name         ?? '',
        status:            item.status            ?? 'Active',
        date:              item.date              ?? '',
        website_link:      item.website_link       ?? '',
        short_description: item.short_description  ?? '',
        description:       item.description       ?? '',
        meta_keyword:      item.meta_keyword       ?? '',
        meta_description:  item.meta_description   ?? '',
        is_publish:        item.is_publish         ?? 1,
        _method:           'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Always use post with _method: PUT for file uploads
        post(`/admin/portfolio/${item.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reset only image_file after successful update
                setData('image_file', null);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            // Show preview (separate from data.image)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Don't set data.image to base64
        }
    };

    const getImageUrl = () => {
        if (imagePreview) return imagePreview;
        if (!data.image) return '';
        if (typeof data.image === 'string' && data.image.startsWith('http')) return data.image;
        return `/images/portfolio/${data.image}`;
    };

    return (
        <AdminLayout title="Edit Portfolio Item">
            <style>{`
                .form-card { background:#fff; border-radius:12px; padding:2rem; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #f1f5f9; max-width:1100px; }
                .form-group { margin-bottom:1.25rem; }
                .form-label { display:block; font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.45rem; }
                .form-input { width:100%; padding:0.7rem 0.875rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.875rem; color:#0f172a; outline:none; transition:border-color 0.15s,box-shadow 0.15s; background:#fff; box-sizing:border-box; }
                .form-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
                .form-input.err { border-color:#ef4444; }
                .form-error { color:#ef4444; font-size:0.78rem; margin-top:0.3rem; }
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                .section-label { font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.12em; margin:1.5rem 0 0.875rem; padding-bottom:0.5rem; border-bottom:1px solid #e2e8f0; }
                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.7rem 1.5rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; transition:background 0.15s; }
                .btn-primary:hover:not(:disabled) { background:#1d4ed8; }
                .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
                .btn-cancel { background:#f8fafc; color:#374151; border:1px solid #e2e8f0; padding:0.7rem 1.5rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-block; transition:background 0.15s; }
                .btn-cancel:hover { background:#f1f5f9; }
                .page-header { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
                
                .img-upload-box { position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;padding:1.5rem;border:2px dashed #cbd5e1;border-radius:12px;background:#f8fafc;cursor:pointer;transition:all .2s;margin-bottom:1rem; }
                .img-upload-box:hover { border-color:#3b82f6;background:#eff6ff; }
                .img-upload-box input { position:absolute;inset:0;opacity:0;cursor:pointer; }
                .img-preview { margin-bottom:1rem;border-radius:10px;overflow:hidden;border:1.5px solid #e2e8f0;background:#f8fafc;max-height:200px;display:flex;align-items:center;justify-content:center; }
                .img-preview img { max-height:200px;max-width:100%;object-fit:contain; }
                .btn-remove { width:100%;padding:.5rem 1rem;background:#fee2e2;color:#dc2626;border:none;border-radius:8px;font-size:.75rem;font-weight:600;cursor:pointer;margin-bottom:1rem; }
                .btn-remove:hover { background:#fecaca; }
                
                @media (max-width:600px) { .form-row { grid-template-columns:1fr; } }
            `}</style>

            <div className="page-header">
                <Link href="/admin/portfolio" className="btn-cancel">← Back</Link>
                <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#0f172a' }}>Edit Portfolio Item</h2>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input className={`form-input${errors.title ? ' err' : ''}`} value={data.title} onChange={e => setData('title', e.target.value)} />
                        {errors.title && <p className="form-error">{errors.title}</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-input" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                <option value="">— Select Category —</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Featured Image</label>
                            
                            {/* Show current or new image preview */}
                            {data.image && (
                                <>
                                    <div className="img-preview">
                                        <img src={getImageUrl()} alt="preview" />
                                    </div>
                                    <button 
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => { setData('image', ''); setData('image_file', null); setImagePreview(null); }}
                                    >
                                        Remove Image
                                    </button>
                                </>
                            )}

                            {/* File upload box */}
                            {!data.image && (
                                <div className="img-upload-box">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <div style={{ fontSize: '.875rem', fontWeight: '600', color: '#475569' }}>Click to upload image</div>
                                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>PNG, JPG, GIF, WEBP up to 5MB</div>
                                </div>
                            )}

                            {/* Manual URL/filename input */}
                            <div style={{ padding: '.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <label className="form-label" style={{ marginBottom: '.4rem' }}>Or enter image URL/filename</label>
                                <input 
                                    className="form-input" 
                                    value={typeof data.image === 'string' && !data.image.startsWith('data:') ? data.image : ''} 
                                    onChange={e => { setData('image', e.target.value); setData('image_file', null); }} 
                                    placeholder="e.g. project.jpg or https://..." 
                                />
                            </div>
                            {errors.image && <p className="form-error">{errors.image}</p>}
                            {errors.image_file && <p className="form-error">{errors.image_file}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Name</label>
                            <input className="form-input" value={data.clint_name} onChange={e => setData('clint_name', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Website Link</label>
                            <input className="form-input" value={data.website_link} onChange={e => setData('website_link', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="date" className="form-input" value={data.date ? data.date.split('T')[0] : ''} onChange={e => setData('date', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Short Description</label>
                        <input className="form-input" value={data.short_description} onChange={e => setData('short_description', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Description</label>
                        <textarea className="form-input" rows={4} value={data.description} onChange={e => setData('description', e.target.value)} style={{ resize:'vertical' }} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Published</label>
                            <select className="form-input" value={data.is_publish} onChange={e => setData('is_publish', parseInt(e.target.value))}>
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                            </select>
                        </div>
                    </div>

                    <div className="section-label">SEO / Meta</div>

                    <div className="form-group">
                        <label className="form-label">Meta Description</label>
                        <input className="form-input" value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Meta Keywords</label>
                        <input className="form-input" value={data.meta_keyword} onChange={e => setData('meta_keyword', e.target.value)} />
                    </div>

                    <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' }}>
                        <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Saving...' : 'Update Item'}</button>
                        <Link href="/admin/portfolio" className="btn-cancel">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
