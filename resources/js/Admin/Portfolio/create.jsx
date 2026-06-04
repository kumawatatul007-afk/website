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

    // Auto-generate slug from title
    useEffect(() => {
        if (data.title && !data.slug) {
            const slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setData('slug', slug);
        }
    }, [data.title]);

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
        
        router.post('/admin/portfolio', data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showNotification('Portfolio created successfully!', 'success');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                showNotification('Failed to create portfolio. Please check the form.', 'error');
            },
        });
    };

    return (
        <AdminLayout title="Create Portfolio Item">
            <style>{`
                .admin-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1.5rem;
                }

                .form-card {
                    background: linear-gradient(to bottom, #ffffff, #f9fafb);
                    border-radius: 16px;
                    padding: 2.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04);
                    border: 1px solid #e5e7eb;
                    width: 100%;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #4b5563;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.6rem;
                }

                .required-asterisk {
                    color: #ef4444;
                    margin-left: 2px;
                }

                .form-input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 0.925rem;
                    color: #111827;
                    outline: none;
                    transition: all 0.2s ease;
                    background: #ffffff;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .form-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
                    background: #ffffff;
                }

                .form-input.err {
                    border-color: #ef4444;
                    background: #fef2f2;
                }

                .form-input.err:focus {
                    box-shadow: 0 0 0 4px rgba(239,68,68,0.12);
                }

                textarea.form-input {
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                    line-height: 1.6;
                }

                .form-error {
                    color: #dc2626;
                    font-size: 0.825rem;
                    margin-top: 0.5rem;
                    font-weight: 500;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .section-label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #1f2937;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin: 2rem 0 1.25rem;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                    border-radius: 8px;
                    border-left: 4px solid #3b82f6;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #ffffff;
                    border: none;
                    padding: 0.875rem 2rem;
                    border-radius: 10px;
                    font-size: 0.925rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px -1px rgba(37,99,235,0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    box-shadow: 0 6px 12px -2px rgba(37,99,235,0.4);
                    transform: translateY(-1px);
                }

                .btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .btn-cancel {
                    background: #ffffff;
                    color: #4b5563;
                    border: 2px solid #d1d5db;
                    padding: 0.875rem 2rem;
                    border-radius: 10px;
                    font-size: 0.925rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-cancel:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                    color: #1f2937;
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 2px solid #e5e7eb;
                }

                .page-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #111827;
                    margin: 0;
                }

                .image-upload-area {
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 1.5rem;
                    background: #fafafa;
                    transition: all 0.2s ease;
                }

                .image-upload-area:hover {
                    border-color: #3b82f6;
                    background: #f0f9ff;
                }

                .image-preview-container {
                    margin-bottom: 1rem;
                    text-align: center;
                }

                .image-preview {
                    max-width: 100%;
                    width: 200px;
                    height: 130px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 3px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }

                .image-label {
                    display: block;
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-top: 0.5rem;
                    font-weight: 500;
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2.5rem;
                    padding-top: 2rem;
                    border-top: 2px solid #e5e7eb;
                }

                .help-text {
                    font-size: 0.8rem;
                    color: #6b7280;
                    margin-top: 0.4rem;
                    font-style: italic;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }

                .notification.success {
                    background: #10b981;
                    color: white;
                }

                .notification.error {
                    background: #ef4444;
                    color: white;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    .admin-container {
                        padding: 1rem;
                    }

                    .form-card {
                        padding: 1.5rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .page-title {
                        font-size: 1.35rem;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-primary, .btn-cancel {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="admin-container">
                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <div className="page-header">
                    <h1 className="page-title">
                        Create Portfolio Item
                    </h1>

                    <Link href="/admin/portfolio" className="btn-cancel">
                        ← Back to List
                    </Link>
                </div>

                <div className="form-card">
                    <form onSubmit={handleSubmit}>

                        {/* Basic Information Section */}
                        <div className="form-group">
                            <label className="form-label">
                                Portfolio Title <span className="required-asterisk">*</span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                required
                                className={`form-input ${errors.title ? 'err' : ''}`}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter portfolio title"
                            />

                            {errors.title && (
                                <p className="form-error">{errors.title}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                URL Slug (SEO-Friendly URL)
                            </label>

                            <input
                                type="text"
                                name="slug"
                                className={`form-input ${errors.slug ? 'err' : ''}`}
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="auto-generated-from-title"
                            />

                            {errors.slug && (
                                <p className="form-error">{errors.slug}</p>
                            )}
                            <p className="help-text">Auto-generated from title, or customize manually</p>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category</label>

                                <select
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
                                <label className="form-label">Status</label>

                                <select
                                    name="status"
                                    className={`form-input ${errors.status ? 'err' : ''}`}
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>

                                {errors.status && (
                                    <p className="form-error">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="section-label">Portfolio Image</div>

                        <div className="form-group">
                            <div className="image-upload-area">
                                {imagePreview && (
                                    <div className="image-preview-container">
                                        <img
                                            src={imagePreview}
                                            alt="Portfolio preview"
                                            className="image-preview"
                                        />
                                        <span className="image-label">Image Preview</span>
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
                                    Upload portfolio image (Max 5MB, JPG/PNG/GIF)
                                </p>
                            </div>

                            {errors.image && (
                                <p className="form-error">{errors.image}</p>
                            )}
                        </div>

                        {/* Project Details Section */}
                        <div className="section-label">Project Details</div>

                        <div className="form-row">
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

                            <div className="form-group">
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
                        </div>

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

                        {/* SEO Section */}
                        <div className="section-label">SEO & Meta Information</div>

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

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Portfolio'}
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
