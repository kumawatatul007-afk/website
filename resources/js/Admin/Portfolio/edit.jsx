import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
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

export default function AdminPortfolioEdit({ item, categories = [] }) {
    const [imagePreview, setImagePreview] = useState(
        item?.image_url || (item?.image ? `/uploads/portfolio/${item.image}` : null)
    );
    const [notification, setNotification] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    const titleRef    = useRef(null);
    const categoryRef = useRef(null);

    const { data, setData, processing, errors } = useForm({
        title:             item?.title             || '',
        slug:              item?.slug              || '',
        category_id:       item?.category_id       || '',
        image:             null,
        clint_name:        item?.clint_name        || '',
        date:              item?.date ? item.date.split('T')[0] : '',
        website_link:      item?.website_link      || '',
        short_description: item?.short_description || '',
        description:       item?.description       || '',
        meta_keyword:      item?.meta_keyword      || '',
        meta_description:  item?.meta_description  || '',
        is_publish:        item?.is_publish        ?? 1,
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
                    const firstErr = document.querySelector('.form-input.err, .form-error');
                    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 200);
        }
    }, [errors]);

    const showNotification = (message, type = 'success') => setNotification({ message, type });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showNotification('Image size must be less than 5MB', 'error'); return; }
        if (!file.type.startsWith('image/')) { showNotification('Please select a valid image file', 'error'); return; }
        setData('image', file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        showNotification('Image selected successfully', 'success');
    };

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

        const payload = new FormData();
        payload.append('_method',          'PUT');
        payload.append('title',            data.title            || '');
        payload.append('slug',             data.slug             || '');
        payload.append('category_id',      data.category_id      || '');
        if (data.image) payload.append('image', data.image);
        payload.append('clint_name',       data.clint_name       || '');
        payload.append('date',             data.date             || '');
        payload.append('website_link',     data.website_link     || '');
        payload.append('short_description',data.short_description|| '');
        payload.append('description',      data.description      || '');
        payload.append('meta_keyword',     data.meta_keyword     || '');
        payload.append('meta_description', data.meta_description || '');
        payload.append('is_publish',       data.is_publish       ?? 1);

        router.post(`/admin/portfolio/${item.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => showNotification('Portfolio updated successfully!', 'success'),
            onError:   () => showNotification('Failed to update portfolio. Please check the form.', 'error'),
        });
    };

    return (
        <AdminLayout title="Edit Portfolio Item">
            <style>{`
                .admin-container { max-width:1080px; width:100%; margin:0 auto; padding:1.25rem 1rem 1.75rem; }
                .form-card { background:#fff; border-radius:12px; padding:1.5rem; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #f1f5f9; width:100%; }
                .form-group { margin-bottom:1rem; }
                .form-label { display:block; font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.35rem; }
                .form-label .required-asterisk { color:#ef4444; margin-left:2px; }
                .form-input { width:100%; padding:0.65rem 0.85rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.875rem; color:#0f172a; outline:none; transition:border-color 0.15s,box-shadow 0.15s; background:#fff; box-sizing:border-box; }
                .form-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
                .form-input.err { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.10); }
                .form-error { color:#ef4444; font-size:0.78rem; margin-top:0.25rem; }
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }
                .section-label { font-size:0.72rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.12em; margin:0.9rem 0 0.6rem; padding-bottom:0.45rem; border-bottom:1px solid #e2e8f0; }
                .image-upload-area { display:grid; gap:0.65rem; }
                .image-preview-container { width:160px; max-width:100%; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#f8fafc; padding:0.45rem; }
                .image-preview { width:100%; height:auto; display:block; border-radius:10px; object-fit:cover; max-height:180px; }
                .image-label { display:block; font-size:0.72rem; font-weight:700; color:#475569; margin-top:0.5rem; }
                .help-text { font-size:0.8rem; color:#6b7280; margin-top:0.3rem; }
                .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.65rem 1.4rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; transition:background 0.15s; }
                .btn-primary:hover:not(:disabled) { background:#1d4ed8; }
                .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
                .btn-cancel { background:#f8fafc; color:#374151; border:1px solid #e2e8f0; padding:0.65rem 1.4rem; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; display:inline-block; transition:background 0.15s; }
                .btn-cancel:hover { background:#f1f5f9; }
                .page-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
                .form-actions { display:flex; gap:0.8rem; flex-wrap:wrap; margin-top:1.25rem; }
                @media (max-width:900px) { .image-preview-container { width:140px; } }
                @media (max-width:600px) { .form-row { grid-template-columns:1fr; } .form-actions { flex-direction:column; } }
            `}</style>

            <div className="admin-container">
                <div className="page-header">
                    <h1 style={{ fontSize:'1.1rem', fontWeight:700, color:'#0f172a', margin:0 }}>Edit Portfolio Item</h1>
                    <Link href="/admin/portfolio" className="btn-cancel">← Back to List</Link>
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
                                <label className="form-label">
                                    Portfolio Title <span className="required-asterisk">*</span>
                                </label>
                                <input
                                    ref={titleRef}
                                    type="text"
                                    className={`form-input${allErrors.title ? ' err' : ''}`}
                                    value={data.title}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData('title', val);
                                        setData('slug', slugify(val));
                                        if (clientErrors.title) setClientErrors(prev => ({ ...prev, title: '' }));
                                    }}
                                    placeholder="Enter portfolio title"
                                />
                                {allErrors.title && <p className="form-error">{allErrors.title}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
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
                                <label className="form-label">
                                    Category <span className="required-asterisk">*</span>
                                </label>
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
                                    type="text"
                                    className={`form-input${allErrors.clint_name ? ' err' : ''}`}
                                    value={data.clint_name}
                                    onChange={e => setData('clint_name', e.target.value)}
                                    placeholder="Enter client name"
                                />
                                {allErrors.clint_name && <p className="form-error">{allErrors.clint_name}</p>}
                            </div>
                        </div>

                        {/* ── Row 3: Image + Website / Date ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <div className="image-upload-area">
                                    <label className="form-label">Portfolio Image</label>
                                    {imagePreview && (
                                        <div className="image-preview-container">
                                            <img
                                                src={imagePreview}
                                                alt="Portfolio preview"
                                                className="image-preview"
                                                onError={e => { e.target.onerror = null; e.target.src = `/uploads/portfolio/${item.image}`; }}
                                            />
                                            <span className="image-label">Current Image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={`form-input${allErrors.image ? ' err' : ''}`}
                                        onChange={handleImageChange}
                                    />
                                    <p className="help-text">Upload a new image to replace the current one (Max 5MB, JPG/PNG)</p>
                                </div>
                                {allErrors.image && <p className="form-error">{allErrors.image}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Website Link</label>
                                <input
                                    type="url"
                                    className={`form-input${allErrors.website_link ? ' err' : ''}`}
                                    placeholder="https://example.com"
                                    value={data.website_link}
                                    onChange={e => setData('website_link', e.target.value)}
                                />
                                {allErrors.website_link && <p className="form-error">{allErrors.website_link}</p>}
                                <p className="help-text">Full URL including https://</p>
                                <div style={{ marginTop:'0.7rem' }}>
                                    <label className="form-label">Project Date</label>
                                    <input
                                        type="date"
                                        className={`form-input${allErrors.date ? ' err' : ''}`}
                                        value={data.date || ''}
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                    {allErrors.date && <p className="form-error">{allErrors.date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ── Row 4: Short Description + Publish Status ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Short Description</label>
                                <input
                                    type="text"
                                    className={`form-input${allErrors.short_description ? ' err' : ''}`}
                                    value={data.short_description}
                                    onChange={e => setData('short_description', e.target.value)}
                                    placeholder="Brief summary for listings and previews"
                                />
                                {allErrors.short_description && <p className="form-error">{allErrors.short_description}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Publish Status</label>
                                <select
                                    className={`form-input${allErrors.is_publish ? ' err' : ''}`}
                                    value={data.is_publish}
                                    onChange={e => setData('is_publish', Number(e.target.value))}
                                >
                                    <option value={1}>Published (Visible to public)</option>
                                    <option value={0}>Draft (Hidden from public)</option>
                                </select>
                                {allErrors.is_publish && <p className="form-error">{allErrors.is_publish}</p>}
                            </div>
                        </div>

                        {/* ── Full Description ── */}
                        <div className="form-group">
                            <label className="form-label">Full Description</label>
                            <textarea
                                rows="6"
                                className={`form-input${allErrors.description ? ' err' : ''}`}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Detailed project description, features, and outcomes"
                            />
                            {allErrors.description && <p className="form-error">{allErrors.description}</p>}
                        </div>

                        <div className="section-label">SEO & Meta Information</div>

                        {/* ── Row SEO ── */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Meta Description</label>
                                <textarea
                                    rows="3"
                                    className={`form-input${allErrors.meta_description ? ' err' : ''}`}
                                    value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)}
                                    placeholder="Brief description for search engines (150-160 characters)"
                                    maxLength="160"
                                />
                                {allErrors.meta_description && <p className="form-error">{allErrors.meta_description}</p>}
                                <p className="help-text">{data.meta_description.length}/160 characters</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Meta Keywords</label>
                                <input
                                    type="text"
                                    className={`form-input${allErrors.meta_keyword ? ' err' : ''}`}
                                    value={data.meta_keyword}
                                    onChange={e => setData('meta_keyword', e.target.value)}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                                {allErrors.meta_keyword && <p className="form-error">{allErrors.meta_keyword}</p>}
                                <p className="help-text">Separate keywords with commas</p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Portfolio'}
                            </button>
                            <Link href="/admin/portfolio" className="btn-cancel">Cancel</Link>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}