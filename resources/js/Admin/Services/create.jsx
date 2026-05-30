import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

export default function AdminServiceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        meta_description: '',
        meta_keywords: '',
        tags: '',
        content: '',
        main_image: '',
        serial_number: 100,
        status: 1,
        category_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/services');
    };

    return (
        <AdminLayout title="New Service">
            <style>{`
                .form-card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
                    padding: 2rem; max-width: 820px;
                    animation: fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
                .form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .form-group.full { grid-column: 1 / -1; }
                label { font-size: 0.78rem; font-weight: 600; color: #374151; letter-spacing: 0.04em; text-transform: uppercase; }
                .form-input, .form-textarea {
                    padding: 0.65rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px;
                    font-size: 0.875rem; color: #374151; background: #fff; outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit;
                }
                .form-input:focus, .form-textarea:focus {
                    border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .form-textarea { resize: vertical; min-height: 160px; }
                .error { font-size: 0.75rem; color: #dc2626; margin-top: 0.2rem; }
                .form-actions { display: flex; gap: 0.75rem; margin-top: 1.75rem; flex-wrap: wrap; }
                .btn-primary {
                    background: #2563eb; color: #fff; border: none; padding: 0.7rem 1.75rem;
                    border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
                    transition: background 0.15s, transform 0.15s; font-family: inherit;
                }
                .btn-primary:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel { background: #f1f5f9; color: #374151; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.15s; font-family: inherit; }
                .btn-cancel:hover { background: #e2e8f0; }
                .toggle-row { display: flex; align-items: center; gap: 0.75rem; }
                .toggle { position: relative; width: 42px; height: 24px; }
                .toggle input { opacity: 0; width: 0; height: 0; }
                .toggle-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background: #cbd5e1; border-radius: 24px; transition: background 0.2s;
                }
                .toggle-slider::before {
                    content: ''; position: absolute; height: 18px; width: 18px;
                    left: 3px; bottom: 3px; background: #fff; border-radius: 50%;
                    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                }
                .toggle input:checked + .toggle-slider { background: #2563eb; }
                .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }
                .toggle-label { font-size: 0.875rem; color: #374151; font-weight: 500; }
                .hint { font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem; }
                .content-textarea { resize: vertical; min-height: 240px; line-height: 1.75; font-family: inherit; }
            `}</style>

            <div className="form-card">
                <div className="form-header">
                    <h2 className="form-title">New Service</h2>
                    <Link href="/admin/services" className="btn-cancel">← Back</Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">

                        {/* Title */}
                        <div className="form-group">
                            <label>Title *</label>
                            <input className="form-input" value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Custom Website Development Services" />
                            {errors.title && <span className="error">{errors.title}</span>}
                        </div>

                        {/* Slug */}
                        <div className="form-group">
                            <label>Slug (URL)</label>
                            <input className="form-input" value={data.slug}
                                onChange={e => setData('slug', e.target.value)}
                                placeholder="auto-generated if empty" />
                            <span className="hint">Leave empty to auto-generate from title</span>
                            {errors.slug && <span className="error">{errors.slug}</span>}
                        </div>

                        {/* Meta Description */}
                        <div className="form-group full">
                            <label>Meta Description</label>
                            <textarea className="form-textarea" rows={3} value={data.meta_description}
                                onChange={e => setData('meta_description', e.target.value)}
                                placeholder="Short description for SEO and listing..." />
                            {errors.meta_description && <span className="error">{errors.meta_description}</span>}
                        </div>

                        {/* Meta Keywords */}
                        <div className="form-group full">
                            <label>Meta Keywords</label>
                            <input className="form-input" value={data.meta_keywords}
                                onChange={e => setData('meta_keywords', e.target.value)}
                                placeholder="website, development, software..." />
                            {errors.meta_keywords && <span className="error">{errors.meta_keywords}</span>}
                        </div>

                        {/* Tags */}
                        <div className="form-group full">
                            <label>Tags</label>
                            <input className="form-input" value={data.tags}
                                onChange={e => setData('tags', e.target.value)}
                                placeholder="website,software,application,web-application" />
                            <span className="hint">Comma-separated tags</span>
                            {errors.tags && <span className="error">{errors.tags}</span>}
                        </div>

                        {/* Content — Plain Text */}
                        <div className="form-group full">
                            <label>Content (Full Description)</label>
                            <textarea
                                className="form-textarea content-textarea"
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                placeholder="Full service description..."
                            />
                            <span className="hint">Plain text only — no HTML tags</span>
                            {errors.content && <span className="error">{errors.content}</span>}
                        </div>

                        {/* Main Image */}
                        <div className="form-group full">
                            <label>Main Image (filename or URL)</label>
                            <input className="form-input" value={data.main_image}
                                onChange={e => setData('main_image', e.target.value)}
                                placeholder="e.g. 1637216446.png or https://..." />
                            {errors.main_image && <span className="error">{errors.main_image}</span>}
                        </div>

                        {/* Serial Number */}
                        <div className="form-group">
                            <label>Serial / Sort Order</label>
                            <input className="form-input" type="number" min="0" value={data.serial_number}
                                onChange={e => setData('serial_number', parseInt(e.target.value) || 0)} />
                            {errors.serial_number && <span className="error">{errors.serial_number}</span>}
                        </div>

                        {/* Category ID */}
                        <div className="form-group">
                            <label>Category ID</label>
                            <input className="form-input" type="number" min="1" value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                placeholder="e.g. 2" />
                            {errors.category_id && <span className="error">{errors.category_id}</span>}
                        </div>

                        {/* Status toggle */}
                        <div className="form-group full">
                            <label>Status</label>
                            <div className="toggle-row">
                                <label className="toggle">
                                    <input type="checkbox" checked={data.status == 1}
                                        onChange={e => setData('status', e.target.checked ? 1 : 0)} />
                                    <span className="toggle-slider" />
                                </label>
                                <span className="toggle-label">
                                    {data.status == 1 ? 'Active (visible on site)' : 'Inactive (hidden)'}
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving…' : 'Create Service'}
                        </button>
                        <Link href="/admin/services" className="btn-cancel">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
