import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminPortfolioCreate({ categories = [] }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [notification, setNotification] = useState(null);

    const { data, setData, processing, errors } = useForm({
        title: '',
        slug: '',
        category_id: '',
        image: null,
        clint_name: '',
        status: 'Active',
        date: '',
        website_link: '',
        short_description: '',
        description: '',
        meta_keyword: '',
        meta_description: '',
        is_publish: 1,
    });

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post('/admin/portfolio', {
            title: data.title,
            category_id: data.category_id || null,
            image: data.image,
            clint_name: data.clint_name || null,
            status: data.status,
            date: data.date || null,
            website_link: data.website_link || null,
            short_description: data.short_description || null,
            description: data.description || null,
            meta_keyword: data.meta_keyword || null,
            meta_description: data.meta_description || null,
            is_publish: data.is_publish,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showNotification('Portfolio created successfully!', 'success');
            },
            onError: () => {
                showNotification('Create failed. Please check the form.', 'error');
            },
        });
    };

    return (
        <AdminLayout title="Create Portfolio Item">
            <style>{`
                .admin-container { max-width:1140px; width:100%; margin:0 auto; padding:1.8rem 1rem 1.75rem; }
                .form-card { background:#fff; border-radius:12px; padding:1.75rem; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #f1f5f9; width:100%; }
                .form-group { margin-bottom:1rem; }
                .form-label { display:block; font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.35rem; }
                .form-input { width:100%; padding:0.75rem 0.95rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.9rem; color:#0f172a; outline:none; transition:border-color 0.15s,box-shadow 0.15s; background:#fff; box-sizing:border-box; }
                .form-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
                .form-input.err { border-color:#ef4444; }
                .form-error { color:#ef4444; font-size:0.78rem; margin-top:0.25rem; }
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.95rem; }
                .upload-control { max-width:320px; }
                .upload-control input[type=file] { width:100%; padding:0.65rem 0.85rem; }
                .section-label { font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.12em; margin:1.2rem 0 0.7rem; padding-bottom:0.45rem; border-bottom:1px solid #e2e8f0; }
                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.65rem 1.35rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; transition:background 0.15s; }
                .btn-primary:hover:not(:disabled) { background:#1d4ed8; }
                .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
                .btn-cancel { background:#f8fafc; color:#374151; border:1px solid #e2e8f0; padding:0.65rem 1.35rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-block; transition:background 0.15s; }
                .btn-cancel:hover { background:#f1f5f9; }
                .page-header { display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; }
                @media (max-width:760px) { .form-row { grid-template-columns:1fr; } .upload-control { max-width:100%; } }
            `}</style>

            <div className="admin-container">
                <div className="page-header">
                    <Link href="/admin/portfolio" className="btn-cancel">← Back</Link>
                    <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#0f172a' }}>Create Portfolio Item</h2>
                </div>

                <div className="form-card">
                    <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input className={`form-input${errors.title ? ' err' : ''}`} value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Project title" />
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
                        <div className="form-group upload-control">
                            <label className="form-label">Portfolio Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-input"
                                onChange={e => setData('image', e.target.files[0])}
                            />
                            {data.image && typeof data.image === 'object' && (
                                <p className="help-text">Selected file: {data.image.name}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Name</label>
                            <input className="form-input" value={data.clint_name} onChange={e => setData('clint_name', e.target.value)} placeholder="Client / Company name" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Website Link</label>
                            <input className="form-input" value={data.website_link} onChange={e => setData('website_link', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="date" className="form-input" value={data.date} onChange={e => setData('date', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Short Description</label>
                        <input className="form-input" value={data.short_description} onChange={e => setData('short_description', e.target.value)} placeholder="Brief one-line description" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Description</label>
                        <textarea className="form-input" rows={4} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Detailed project description..." style={{ resize:'vertical' }} />
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
                        <input className="form-input" value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Meta description" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Meta Keywords</label>
                        <input className="form-input" value={data.meta_keyword} onChange={e => setData('meta_keyword', e.target.value)} placeholder="keyword1, keyword2" />
                    </div>

                    <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' }}>
                        <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Saving...' : 'Create Item'}</button>
                        <Link href="/admin/portfolio" className="btn-cancel">Cancel</Link>
                    </div>
                </form>
            </div>
            </div>
        </AdminLayout>
    );
}
