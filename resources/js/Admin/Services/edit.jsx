import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>|<\/div>|<\/h[1-6]>|<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&#\d+;/g, '')
        .replace(/&[a-zA-Z]+;/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}


export default function AdminServiceEdit({ service }) {
    const { data, setData, put, processing, errors } = useForm({
        title:            service.title            ?? '',
        slug:             service.slug             ?? '',
        meta_description: service.meta_description ?? '',
        meta_keyword:     service.meta_keyword     ?? '',
        tags:             service.tags             ?? '',
        content:          stripHtml(service.content ?? service.description ?? ''),
        main_image:       service.main_image ?? service.image ?? '',
        main_image_file:  null,
        serial_number:    service.serial_number    ?? 100,
        status:           service.status           ?? 1,
        category_id:      service.category_id      ?? '',
    });

    const fileInputRef = useRef(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);

    function resolveServiceImageUrl(image) {
        if (!image) return null;
        if (image.startsWith('http') || image.startsWith('//')) return image;
        if (image.startsWith('/')) return image;
        return `/uploads/services/${image}`;
    }

    const previewUrl = filePreviewUrl || resolveServiceImageUrl(data.main_image);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }

        const objectUrl = URL.createObjectURL(file);
        setFilePreviewUrl(objectUrl);
        setData('main_image', file.name);
        setData('main_image_file', file);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        return () => {
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    };

    return (
        <AdminLayout title="Edit Service">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
                .page-overline { margin: 0; color: #2563eb; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
                .page-heading { margin: 0; font-size: 1.7rem; font-weight: 800; color: #0f172a; }
                .page-actions { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
                .btn-secondary { background: #1d4ed8; color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
                .btn-secondary:hover { background: #1e40af; }
                .form-card { background: #fff; border-radius: 20px; border: 1px solid #e5e7eb; box-shadow: 0 18px 60px rgba(15,23,42,0.06); padding: 2rem; }
                .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
                .form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .id-badge { display: inline-flex; align-items: center; justify-content: center; background: #eef2ff; color: #4338ca; font-size: 0.75rem; font-weight: 700; padding: 0.55rem 0.9rem; border-radius: 999px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                @media (max-width: 980px) { .form-grid { grid-template-columns: 1fr; } }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group.full { grid-column: 1 / -1; }
                .form-label { font-size: 0.78rem; font-weight: 700; color: #374151; letter-spacing: 0.08em; text-transform: uppercase; }
                .form-input, .form-textarea { width: 100%; padding: 0.95rem 1rem; border-radius: 14px; border: 1px solid #d1d5db; font-size: 0.95rem; color: #111827; background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
                .form-input:focus, .form-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.12); }
                .form-textarea { min-height: 200px; resize: vertical; }
                .error { font-size: 0.82rem; color: #dc2626; }
                .hint { font-size: 0.85rem; color: #6b7280; }
                .toggle-row { display: flex; align-items: center; gap: 0.8rem; }
                .toggle { position: relative; width: 46px; height: 26px; }
                .toggle input { opacity: 0; width: 0; height: 0; }
                .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #cbd5e1; border-radius: 999px; transition: background 0.2s; }
                .toggle-slider::before { content: ''; position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
                .toggle input:checked + .toggle-slider { background: #2563eb; }
                .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }
                .toggle-label { font-size: 0.95rem; color: #374151; font-weight: 600; }
                .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.75rem; flex-wrap: wrap; }
                .btn-primary { background: #2563eb; color: #fff; border: none; padding: 0.9rem 1.3rem; border-radius: 14px; font-weight: 700; cursor: pointer; }
                .btn-primary:hover { background: #1d4ed8; }
                .btn-cancel { background: transparent; color: #374151; border: 1px solid #d1d5db; padding: 0.9rem 1.3rem; border-radius: 14px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
                .btn-cancel:hover { background: #f8fafc; }
                .image-preview { position: relative; display: flex; align-items: center; gap: 0.75rem; }

                /* Thumbnail card to mimic portfolio thumbnails */
                .thumb-card { background: #fff; border: 1px solid #e6e9ef; border-radius: 12px; padding: 8px; box-shadow: 0 10px 30px rgba(2,6,23,0.06); width: 140px; display: inline-block; }
                .thumb-card.thumb-empty { display: flex; align-items: center; justify-content: center; height: 120px; }
                .thumb-img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; display: block; }
                .thumb-caption { text-align: center; font-size: 0.82rem; color: #6b7280; margin-top: 6px; }

                @media (max-width: 980px) {
                    .thumb-card { width: 110px; }
                    .thumb-img { height: 96px; }
                }

                .upload-action { position: absolute; top: 6px; right: 6px; width: 30px; height: 30px; border-radius: 8px; background: #fff; border: 1px solid #d1d5db; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; padding: 0; }
                .image-placeholder { color: #6b7280; text-align: center; padding: 0.2rem; font-size: 0.75rem; }
            `}</style>

            <div className="page-container">
                <div className="page-topbar">
                    <div>
                        <p className="page-overline">Edit Service</p>
                        <h1 className="page-heading">Update Service Details</h1>
                    </div>
                    <div className="page-actions">
                        <Link href="/admin/services" className="btn-secondary">← Back</Link>
                    </div>
                </div>

                <div className="form-card">
                    <div className="form-header">
                        <div>
                            <h2 className="form-title">Service ID</h2>
                            <span className="id-badge">#{service.id}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input className="form-input" value={data.title}
                                    onChange={e => setData('title', e.target.value)} />
                                {errors.title && <div className="error">{errors.title}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Slug (URL)</label>
                                <input className="form-input" value={data.slug}
                                    onChange={e => setData('slug', e.target.value)} />
                                <span className="hint">Leave blank to auto-generate from title</span>
                                {errors.slug && <div className="error">{errors.slug}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Meta Description</label>
                                <textarea className="form-textarea" rows={3} value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)} />
                                {errors.meta_description && <div className="error">{errors.meta_description}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Meta Keywords</label>
                                <input className="form-input" value={data.meta_keyword}
                                    onChange={e => setData('meta_keyword', e.target.value)} />
                                {errors.meta_keyword && <div className="error">{errors.meta_keyword}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input className="form-input" value={data.tags}
                                    onChange={e => setData('tags', e.target.value)}
                                    placeholder="website,software,application" />
                                <span className="hint">Comma-separated tags</span>
                                {errors.tags && <div className="error">{errors.tags}</div>}
                            </div>

                            <div className="form-group full">
                                <label className="form-label">Content (Full Description)</label>
                                <textarea className="form-textarea" value={data.content}
                                    onChange={e => setData('content', e.target.value)} />
                                <span className="hint">Plain text only — HTML tags are stripped automatically</span>
                                {errors.content && <div className="error">{errors.content}</div>}
                            </div>

                            <div className="form-group full">
                                <label className="form-label">Main Image Preview</label>
                                <div className="image-preview">
                                    {previewUrl ? (
                                        <div className="thumb-card">
                                            <img src={previewUrl} alt="Current Image" className="thumb-img" onError={(e) => { e.target.src = previewUrl; }} />
                                            <div className="thumb-caption">Current Image</div>
                                        </div>
                                    ) : (
                                        <div className="thumb-card thumb-empty">
                                            <div className="thumb-empty-box">No image</div>
                                            <div className="thumb-caption">No Image</div>
                                        </div>
                                    )}
                                    <button type="button" className="upload-action" onClick={openFilePicker} title="Upload image">Upload</button>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Main Image (filename or URL)</label>
                                <input className="form-input" value={data.main_image}
                                    onChange={e => {
                                        setData('main_image', e.target.value);
                                        setData('main_image_file', null);
                                        setFilePreviewUrl(null);
                                    }}
                                    placeholder="e.g. 1637216446.png or https://..." />
                                {errors.main_image && <div className="error">{errors.main_image}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Serial / Sort Order</label>
                                <input className="form-input" type="number" min="0" value={data.serial_number}
                                    onChange={e => setData('serial_number', parseInt(e.target.value) || 0)} />
                                {errors.serial_number && <div className="error">{errors.serial_number}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category ID</label>
                                <input className="form-input" type="number" min="1" value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)} />
                                {errors.category_id && <div className="error">{errors.category_id}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
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
                                {processing ? 'Saving…' : 'Update Service'}
                            </button>
                            <Link href="/admin/services" className="btn-cancel">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
