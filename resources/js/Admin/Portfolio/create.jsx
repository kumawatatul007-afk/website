import AdminLayout from '../layouts/AdminLayout';
import { router, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function AdminPortfolioCreate({ categories = [] }) {
    const [imagePreview, setImagePreview]   = useState(null);
    const [notification, setNotification]   = useState(null);
    const [clientErrors, setClientErrors]   = useState({});

    const titleRef    = useRef(null);
    const categoryRef = useRef(null);

    const { data, setData, processing, errors } = useForm({
        title:             '',
        slug:              '',
        category_id:       '',
        image:             null,
        clint_name:        '',
        date:              '',
        website_link:      '',
        short_description: '',
        description:       '',
        meta_keyword:      '',
        meta_description:  '',
        is_publish:        1,
    });

    // Merge server + client errors
    const allErrors = { ...clientErrors, ...errors };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Scroll to first server-side error
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setTimeout(() => {
                if (errors.title && titleRef.current) {
                    titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    titleRef.current.focus();
                } else if (errors.category_id && categoryRef.current) {
                    categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    categoryRef.current.focus();
                } else {
                    const firstErr = document.querySelector('.form-input.err, .form-textarea.err, .form-error');
                    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 200);
        }
    }, [errors]);

    // ─── Submit with client-side validation ───────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!data.title || !data.title.trim()) {
            newErrors.title = 'Title is required.';
        }
        if (!data.category_id) {
            newErrors.category_id = 'Category is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            setTimeout(() => {
                if (newErrors.title && titleRef.current) {
                    titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    titleRef.current.focus();
                } else if (newErrors.category_id && categoryRef.current) {
                    categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    categoryRef.current.focus();
                }
            }, 50);
            return;
        }

        setClientErrors({});

        const formData = new FormData();
        formData.append('title',             data.title);
        formData.append('slug',              data.slug              || '');
        formData.append('category_id',       data.category_id       || '');
        if (data.image) formData.append('image', data.image);
        formData.append('clint_name',        data.clint_name        || '');
        formData.append('date',              data.date              || '');
        formData.append('website_link',      data.website_link      || '');
        formData.append('short_description', data.short_description || '');
        formData.append('description',       data.description       || '');
        formData.append('meta_keyword',      data.meta_keyword      || '');
        formData.append('meta_description',  data.meta_description  || '');
        formData.append('is_publish',        String(data.is_publish ?? 1));

        router.post('/admin/portfolio', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setNotification({ message: 'Portfolio created successfully!', type: 'success' }),
            onError: () => {
                const firstError = Object.values(errors)[0] || 'Create failed. Please check the form.';
                setNotification({ message: firstError, type: 'error' });
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
                .form-input.err { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.10); }
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

                {notification && (
                    <div style={{ marginBottom:'1rem', padding:'1rem 1.15rem', borderRadius:'10px', background: notification.type === 'success' ? '#ecfdf5' : '#fef2f2', color: notification.type === 'success' ? '#166534' : '#b91c1c', border: notification.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca' }}>
                        {notification.message}
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div style={{ marginBottom:'1rem', padding:'1rem 1.15rem', borderRadius:'10px', background:'#fef2f2', color:'#b91c1c', border:'1px solid #fecaca' }}>
                        Please fix the highlighted errors before submitting.
                    </div>
                )}

                <div className="form-card">
                    <form onSubmit={handleSubmit} noValidate>

                        {/* ── Row 1: Title + Slug ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input
                                    ref={titleRef}
                                    className={`form-input${allErrors.title ? ' err' : ''}`}
                                    value={data.title}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData('title', val);
                                        setData('slug', slugify(val));
                                        if (clientErrors.title) setClientErrors(prev => ({ ...prev, title: '' }));
                                    }}
                                    placeholder="Project title"
                                />
                                {allErrors.title && <p className="form-error">{allErrors.title}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug</label>
                                <input
                                    className={`form-input${allErrors.slug ? ' err' : ''}`}
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value)}
                                    placeholder="Auto-generated from title"
                                />
                                {allErrors.slug && <p className="form-error">{allErrors.slug}</p>}
                            </div>
                        </div>

                        {/* ── Row 2: Category + Client Name ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    ref={categoryRef}
                                    className={`form-input${allErrors.category_id ? ' err' : ''}`}
                                    value={data.category_id}
                                    onChange={e => {
                                        setData('category_id', e.target.value);
                                        if (clientErrors.category_id) setClientErrors(prev => ({ ...prev, category_id: '' }));
                                    }}
                                >
                                    <option value="">— Select Category —</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {allErrors.category_id && <p className="form-error">{allErrors.category_id}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Client Name</label>
                                <input
                                    className={`form-input${allErrors.clint_name ? ' err' : ''}`}
                                    value={data.clint_name}
                                    onChange={e => setData('clint_name', e.target.value)}
                                    placeholder="Client / Company name"
                                />
                                {allErrors.clint_name && <p className="form-error">{allErrors.clint_name}</p>}
                            </div>
                        </div>

                        {/* ── Row 3: Image + Website / Date ── */}
                        <div className="form-row">
                            <div className="form-group upload-control">
                                <label className="form-label">Portfolio Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`form-input${allErrors.image ? ' err' : ''}`}
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        setData('image', file);
                                        if (file) setImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                                {data.image && typeof data.image === 'object' && (
                                    <p className="help-text">Selected file: {data.image.name}</p>
                                )}
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" style={{ marginTop:'0.8rem', maxWidth:'100%', borderRadius:'10px' }} />
                                )}
                                {allErrors.image && <p className="form-error">{allErrors.image}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Website Link</label>
                                <input
                                    className={`form-input${allErrors.website_link ? ' err' : ''}`}
                                    value={data.website_link}
                                    onChange={e => setData('website_link', e.target.value)}
                                    placeholder="https://..."
                                />
                                {allErrors.website_link && <p className="form-error">{allErrors.website_link}</p>}
                                <div style={{ marginTop:'0.7rem' }}>
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className={`form-input${allErrors.date ? ' err' : ''}`}
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                    {allErrors.date && <p className="form-error">{allErrors.date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ── Row 4: Short Description + Published ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Short Description</label>
                                <input
                                    className={`form-input${allErrors.short_description ? ' err' : ''}`}
                                    value={data.short_description}
                                    onChange={e => setData('short_description', e.target.value)}
                                    placeholder="Brief one-line description"
                                />
                                {allErrors.short_description && <p className="form-error">{allErrors.short_description}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Published</label>
                                <select
                                    className={`form-input${allErrors.is_publish ? ' err' : ''}`}
                                    value={data.is_publish}
                                    onChange={e => setData('is_publish', parseInt(e.target.value))}
                                >
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                                {allErrors.is_publish && <p className="form-error">{allErrors.is_publish}</p>}
                            </div>
                        </div>

                        {/* ── Full Description ── */}
                        <div className="form-group">
                            <label className="form-label">Full Description</label>
                            <textarea
                                className={`form-input${allErrors.description ? ' err' : ''}`}
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Detailed project description..."
                                style={{ resize:'vertical' }}
                            />
                            {allErrors.description && <p className="form-error">{allErrors.description}</p>}
                        </div>

                        <div className="section-label">SEO / Meta</div>

                        {/* ── Row SEO ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Meta Description</label>
                                <input
                                    className={`form-input${allErrors.meta_description ? ' err' : ''}`}
                                    value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)}
                                    placeholder="Meta description"
                                />
                                {allErrors.meta_description && <p className="form-error">{allErrors.meta_description}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Meta Keywords</label>
                                <input
                                    className={`form-input${allErrors.meta_keyword ? ' err' : ''}`}
                                    value={data.meta_keyword}
                                    onChange={e => setData('meta_keyword', e.target.value)}
                                    placeholder="keyword1, keyword2"
                                />
                                {allErrors.meta_keyword && <p className="form-error">{allErrors.meta_keyword}</p>}
                            </div>
                        </div>

                        <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' }}>
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : 'Create Item'}
                            </button>
                            <Link href="/admin/portfolio" className="btn-cancel">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}