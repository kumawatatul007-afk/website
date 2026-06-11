import AdminLayout from '../layouts/AdminLayout';
import { router, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// Simple slugify function
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export default function AdminPortfolioCreate({ categories = [] }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [notification, setNotification] = useState(null);
    
    // Refs for fields that need validation scrolling
    const titleRef = useRef(null);
    const categoryRef = useRef(null);

    const { data, setData, processing, errors, post } = useForm({
        title: '',
        slug: '',
        category_id: '',
        image: null,
        clint_name: '',
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

    // Scroll to first error when validation fails (prioritizing title and category)
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setTimeout(() => {
                // Priority order: title -> category -> others
                if (errors.title && titleRef.current) {
                    titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    titleRef.current.focus();
                } 
                else if (errors.category_id && categoryRef.current) {
                    categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    categoryRef.current.focus();
                }
                else {
                    // Fallback to any error field
                    const firstErrorInput = document.querySelector('.form-input.err, .form-textarea.err, select.err');
                    const firstErrorMsg = document.querySelector('.form-error');
                    const firstError = firstErrorInput || firstErrorMsg;
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 200);
        }
    }, [errors]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.title || String(data.title).trim() === '') {
            showNotification('Title is required to create a portfolio item.', 'error');
            // Scroll to title field
            if (titleRef.current) {
                titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                titleRef.current.focus();
            }
            return;
        }

        if (!data.category_id) {
            showNotification('Please select a category.', 'error');
            if (categoryRef.current) {
                categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                categoryRef.current.focus();
            }
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug || '');
        formData.append('category_id', data.category_id || '');
        if (data.image) {
            formData.append('image', data.image);
        }
        formData.append('clint_name', data.clint_name || '');
        formData.append('date', data.date || '');
        formData.append('website_link', data.website_link || '');
        formData.append('short_description', data.short_description || '');
        formData.append('description', data.description || '');
        formData.append('meta_keyword', data.meta_keyword || '');
        formData.append('meta_description', data.meta_description || '');
        formData.append('is_publish', String(data.is_publish ?? 1));

        router.post('/admin/portfolio', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showNotification('Portfolio created successfully!', 'success');
            },
            onError: (errorResponse) => {
                // Scroll will be handled by the errors useEffect
                const firstError = Object.values(errors)[0] || 'Create failed. Please check the form.';
                showNotification(firstError, 'error');
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
                    <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input 
                                ref={titleRef}
                                className={`form-input${errors.title ? ' err' : ''}`} 
                                value={data.title} 
                                onChange={e => {
                                    const newTitle = e.target.value;
                                    setData('title', newTitle);
                                    setData('slug', slugify(newTitle));
                                }} 
                                placeholder="Project title" 
                            />
                            {errors.title && <p className="form-error">{errors.title}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input 
                                className={`form-input${errors.slug ? ' err' : ''}`} 
                                value={data.slug} 
                                onChange={e => setData('slug', e.target.value)} 
                                placeholder="Auto-generated from title" 
                            />
                            {errors.slug && <p className="form-error">{errors.slug}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select 
                                ref={categoryRef}
                                className={`form-input${errors.category_id ? ' err' : ''}`} 
                                value={data.category_id} 
                                onChange={e => setData('category_id', e.target.value)}
                            >
                                <option value="">— Select Category —</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="form-error">{errors.category_id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Name</label>
                            <input 
                                className={`form-input${errors.clint_name ? ' err' : ''}`} 
                                value={data.clint_name} 
                                onChange={e => setData('clint_name', e.target.value)} 
                                placeholder="Client / Company name" 
                            />
                            {errors.clint_name && <p className="form-error">{errors.clint_name}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group upload-control">
                            <label className="form-label">Portfolio Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className={`form-input${errors.image ? ' err' : ''}`}
                                onChange={e => {
                                    const file = e.target.files[0];
                                    setData('image', file);
                                    if (file) {
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {data.image && typeof data.image === 'object' && (
                                <p className="help-text">Selected file: {data.image.name}</p>
                            )}
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" style={{ marginTop: '0.8rem', maxWidth: '100%', borderRadius: '10px' }} />
                            )}
                            {errors.image && <p className="form-error">{errors.image}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Website Link</label>
                            <input 
                                className={`form-input${errors.website_link ? ' err' : ''}`} 
                                value={data.website_link} 
                                onChange={e => setData('website_link', e.target.value)} 
                                placeholder="https://..." 
                            />
                            {errors.website_link && <p className="form-error">{errors.website_link}</p>}
                            <div style={{ marginTop: '0.7rem' }}>
                                <label className="form-label">Date</label>
                                <input 
                                    type="date" 
                                    className={`form-input${errors.date ? ' err' : ''}`} 
                                    value={data.date} 
                                    onChange={e => setData('date', e.target.value)} 
                                />
                                {errors.date && <p className="form-error">{errors.date}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Short Description</label>
                            <input 
                                className={`form-input${errors.short_description ? ' err' : ''}`} 
                                value={data.short_description} 
                                onChange={e => setData('short_description', e.target.value)} 
                                placeholder="Brief one-line description" 
                            />
                            {errors.short_description && <p className="form-error">{errors.short_description}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Published</label>
                            <select 
                                className={`form-input${errors.is_publish ? ' err' : ''}`} 
                                value={data.is_publish} 
                                onChange={e => setData('is_publish', parseInt(e.target.value))}
                            >
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                            </select>
                            {errors.is_publish && <p className="form-error">{errors.is_publish}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Description</label>
                        <textarea 
                            className={`form-input${errors.description ? ' err' : ''}`} 
                            rows={4} 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            placeholder="Detailed project description..." 
                            style={{ resize:'vertical' }} 
                        />
                        {errors.description && <p className="form-error">{errors.description}</p>}
                    </div>

                    <div className="section-label">SEO / Meta</div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Meta Description</label>
                            <input 
                                className={`form-input${errors.meta_description ? ' err' : ''}`} 
                                value={data.meta_description} 
                                onChange={e => setData('meta_description', e.target.value)} 
                                placeholder="Meta description" 
                            />
                            {errors.meta_description && <p className="form-error">{errors.meta_description}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Keywords</label>
                            <input 
                                className={`form-input${errors.meta_keyword ? ' err' : ''}`} 
                                value={data.meta_keyword} 
                                onChange={e => setData('meta_keyword', e.target.value)} 
                                placeholder="keyword1, keyword2" 
                            />
                            {errors.meta_keyword && <p className="form-error">{errors.meta_keyword}</p>}
                        </div>
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