import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
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

export default function AdminPortfolioEdit({ item, categories = [] }) {
    const [imagePreview, setImagePreview] = useState(
        item?.image_url || (item?.image ? `/uploads/portfolio/${item.image}` : null)
    );
    const [notification, setNotification] = useState(null);
    
    // Refs for fields that need validation scrolling
    const titleRef = useRef(null);
    const categoryRef = useRef(null);

    const { data, setData, processing, errors, reset, put } = useForm({
        title: item?.title || '',
        slug: item?.slug || '',
        category_id: item?.category_id || '',
        image: null,
        clint_name: item?.clint_name || '',
        date: item?.date ? item.date.split('T')[0] : '',
        website_link: item?.website_link || '',
        short_description: item?.short_description || '',
        description: item?.description || '',
        meta_keyword: item?.meta_keyword || '',
        meta_description: item?.meta_description || '',
        is_publish: item?.is_publish ?? 1,
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size must be less than 5MB', 'error');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file', 'error');
                return;
            }
            
            setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            showNotification('Image selected successfully', 'success');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side guard: ensure title is present
        if (!data.title || String(data.title).trim() === '') {
            showNotification('Please enter a title before updating.', 'error');
            // Scroll to title field
            if (titleRef.current) {
                titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                titleRef.current.focus();
            }
            return;
        }

        // Client-side guard: ensure category is selected
        if (!data.category_id) {
            showNotification('Please select a category.', 'error');
            if (categoryRef.current) {
                categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                categoryRef.current.focus();
            }
            return;
        }

        // Build FormData explicitly to ensure fields are sent reliably
        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('title', data.title || '');
        payload.append('slug', data.slug || '');
        payload.append('category_id', data.category_id || '');
        if (data.image) payload.append('image', data.image);
        payload.append('clint_name', data.clint_name || '');
        payload.append('date', data.date || '');
        payload.append('website_link', data.website_link || '');
        payload.append('short_description', data.short_description || '');
        payload.append('description', data.description || '');
        payload.append('meta_keyword', data.meta_keyword || '');
        payload.append('meta_description', data.meta_description || '');
        payload.append('is_publish', data.is_publish ?? 1);

        router.post(`/admin/portfolio/${item.id}`, payload, {
            preserveScroll: true,
            onStart: () => {},
            onSuccess: () => {
                showNotification('Portfolio updated successfully!', 'success');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                showNotification('Failed to update portfolio. Please check the form.', 'error');
            },
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
                .form-input.err { border-color:#ef4444; }
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
                    <h1 className="page-title">
                        Edit Portfolio Item
                    </h1>

                    <Link href="/admin/portfolio" className="btn-cancel">
                        ← Back to List
                    </Link>
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

                        {/* Basic Information Section */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Portfolio Title <span className="required-asterisk">*</span>
                                </label>

                                <input
                                    ref={titleRef}
                                    type="text"
                                    name="title"
                                    required
                                    className={`form-input ${errors.title ? 'err' : ''}`}
                                    value={data.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setData('title', newTitle);
                                        // Auto-generate slug from title
                                        setData('slug', slugify(newTitle));
                                    }}
                                    placeholder="Enter portfolio title"
                                />

                                {errors.title && (
                                    <p className="form-error">{errors.title}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Slug</label>

                                <input
                                    type="text"
                                    name="slug"
                                    className={`form-input ${errors.slug ? 'err' : ''}`}
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="Auto-generated from title"
                                />

                                {errors.slug && (
                                    <p className="form-error">{errors.slug}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category <span className="required-asterisk">*</span></label>

                                <select
                                    ref={categoryRef}
                                    name="category_id"
                                    className={`form-input ${errors.category_id ? 'err' : ''}`}
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">— Select Category —</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.category_id && (
                                    <p className="form-error">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Client Name</label>

                                <input
                                    type="text"
                                    name="clint_name"
                                    className={`form-input ${errors.clint_name ? 'err' : ''}`}
                                    value={data.clint_name}
                                    onChange={(e) => setData('clint_name', e.target.value)}
                                    placeholder="Enter client name"
                                />

                                {errors.clint_name && (
                                    <p className="form-error">{errors.clint_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Section */}
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
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `/uploads/portfolio/${item.image}`;
                                                }}
                                            />
                                            <span className="image-label">Current Image</span>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className={`form-input ${errors.image ? 'err' : ''}`}
                                        onChange={handleImageChange}
                                    />

                                    <p className="help-text">
                                        Upload a new image to replace the current one (Max 5MB, JPG/PNG)
                                    </p>
                                </div>

                                {errors.image && (
                                    <p className="form-error">{errors.image}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Website Link</label>

                                <input
                                    type="url"
                                    name="website_link"
                                    className={`form-input ${errors.website_link ? 'err' : ''}`}
                                    placeholder="https://example.com"
                                    value={data.website_link}
                                    onChange={(e) => setData('website_link', e.target.value)}
                                />

                                {errors.website_link && (
                                    <p className="form-error">{errors.website_link}</p>
                                )}
                                <p className="help-text">Full URL including https://</p>

                                <div style={{ marginTop: '0.7rem' }}>
                                    <label className="form-label">Project Date</label>

                                    <input
                                        type="date"
                                        name="date"
                                        className={`form-input ${errors.date ? 'err' : ''}`}
                                        value={data.date || ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />

                                    {errors.date && (
                                        <p className="form-error">{errors.date}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Details Section */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Short Description</label>

                                <input
                                    type="text"
                                    name="short_description"
                                    className={`form-input ${errors.short_description ? 'err' : ''}`}
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="Brief summary for listings and previews"
                                />

                                {errors.short_description && (
                                    <p className="form-error">{errors.short_description}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Publish Status</label>

                                <select
                                    name="is_publish"
                                    className={`form-input ${errors.is_publish ? 'err' : ''}`}
                                    value={data.is_publish}
                                    onChange={(e) => setData('is_publish', Number(e.target.value))}
                                >
                                    <option value={1}>Published (Visible to public)</option>
                                    <option value={0}>Draft (Hidden from public)</option>
                                </select>

                                {errors.is_publish && (
                                    <p className="form-error">{errors.is_publish}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Description</label>

                            <textarea
                                name="description"
                                rows="6"
                                className={`form-input ${errors.description ? 'err' : ''}`}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Detailed project description, features, and outcomes"
                            />

                            {errors.description && (
                                <p className="form-error">{errors.description}</p>
                            )}
                        </div>

                        {/* SEO Section */}
                        <div className="section-label">SEO & Meta Information</div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Meta Description</label>

                                <textarea
                                    name="meta_description"
                                    rows="3"
                                    className={`form-input ${errors.meta_description ? 'err' : ''}`}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder="Brief description for search engines (150-160 characters)"
                                    maxLength="160"
                                />

                                {errors.meta_description && (
                                    <p className="form-error">{errors.meta_description}</p>
                                )}
                                <p className="help-text">
                                    {data.meta_description.length}/160 characters
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Meta Keywords</label>

                                <input
                                    type="text"
                                    name="meta_keyword"
                                    className={`form-input ${errors.meta_keyword ? 'err' : ''}`}
                                    value={data.meta_keyword}
                                    onChange={(e) => setData('meta_keyword', e.target.value)}
                                    placeholder="keyword1, keyword2, keyword3"
                                />

                                {errors.meta_keyword && (
                                    <p className="form-error">{errors.meta_keyword}</p>
                                )}
                                <p className="help-text">Separate keywords with commas</p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Portfolio'}
                            </button>

                            <Link href="/admin/portfolio" className="btn-cancel">
                                Cancel
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}