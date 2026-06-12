import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|h[1-6]|li|tr|blockquote|section|article)>/gi, "\n")
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&#\d+;/g, '')
        .replace(/&[a-zA-Z]+;/g, '')
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function makeSlug(value) {
    return value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const BlogToolbar = ({ id }) => (
    <div id={id}>
        <div className="ck-row">
            <span className="ql-formats">
                <button className="ql-link" title="Link" />
                <button className="ql-image" title="Image" />
                <button className="ql-video" title="Video" />
            </span>
            <span className="ql-formats">
                <button className="ql-code-block" title="Code Block" />
            </span>
            <span className="ql-formats" style={{ marginLeft: 'auto' }}>
                <button className="ql-source-btn" type="button" title="Source">Source</button>
            </span>
        </div>
        <div className="ck-row ck-row2">
            <span className="ql-formats">
                <button className="ql-bold" title="Bold" />
                <button className="ql-italic" title="Italic" />
                <button className="ql-strike" title="Strikethrough" />
                <button className="ql-clean" title="Remove Format" />
            </span>
            <span className="ql-formats">
                <button className="ql-list" value="ordered" title="Ordered List" />
                <button className="ql-list" value="bullet" title="Bullet List" />
                <button className="ql-indent" value="+1" title="Increase Indent" />
                <button className="ql-indent" value="-1" title="Decrease Indent" />
                <button className="ql-blockquote" title="Blockquote" />
            </span>
            <span className="ql-formats">
                <select className="ql-header" title="Heading" defaultValue="">
                    <option value="">Normal</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                    <option value="4">Heading 4</option>
                    <option value="5">Heading 5</option>
                    <option value="6">Heading 6</option>
                </select>
            </span>
            <span className="ql-formats">
                <select className="ql-color" title="Font Color" />
            </span>
            <span className="ql-formats">
                <select className="ql-align" title="Align" />
            </span>
        </div>
    </div>
);

const quillModules = {
    toolbar: { container: '#edit-service-toolbar' },
};

export default function AdminServiceEdit({ service, categories = [] }) {
    const { data, setData, processing, errors } = useForm({
        title:            service.title            ?? '',
        slug:             service.slug             ?? '',
        meta_description: service.meta_description ?? '',
        meta_keyword:     service.meta_keyword     ?? '',
        tags:             service.tags             ?? '',
        content:          service.content          ?? service.description ?? '',
        main_image:       service.main_image       ?? service.image       ?? '',
        main_image_file:  null,
        serial_number:    service.serial_number    ?? 100,
        status:           service.status           ?? 1,
        category_id:      service.category_id      ?? '',
    });

    const fileInputRef  = useRef(null);
    const titleRef      = useRef(null);
    const categoryRef   = useRef(null);

    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [autoSlug, setAutoSlug]             = useState(service.slug ?? '');
    const [clientErrors, setClientErrors]     = useState({});   // ← client-side errors

    // Merge server + client errors
    const allErrors = { ...clientErrors, ...errors };

    const resolveServiceImageUrl = useCallback((image) => {
        if (!image) return null;
        if (image.startsWith('http') || image.startsWith('//') || image.startsWith('/')) return image;
        return `/uploads/services/${image}`;
    }, []);

    const previewUrl = filePreviewUrl || resolveServiceImageUrl(data.main_image);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        const objectUrl = URL.createObjectURL(file);
        setFilePreviewUrl(objectUrl);
        setData(prev => ({ ...prev, main_image: file.name, main_image_file: file }));
    }, [filePreviewUrl, setData]);

    const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

    // Auto-slug generation
    useEffect(() => {
        const nextSlug = makeSlug(data.title);
        if (nextSlug && (!data.slug || data.slug === autoSlug)) {
            setData('slug', nextSlug);
            setAutoSlug(nextSlug);
        }
    }, [data.title, data.slug, autoSlug, setData]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => { if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl); };
    }, [filePreviewUrl]);

    const handleImageInputChange = useCallback((e) => {
        const value = e.target.value;
        setData(prev => ({ ...prev, main_image: value, main_image_file: null }));
        if (filePreviewUrl) { URL.revokeObjectURL(filePreviewUrl); setFilePreviewUrl(null); }
    }, [filePreviewUrl, setData]);

    const handleContentChange = useCallback((val) => setData('content', val), [setData]);

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
                    const firstErr = document.querySelector('.form-input.err, .form-textarea.err, select.err, .error');
                    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 200);
        }
    }, [errors]);

    // ─── Submit with client-side validation ───────────────────────────────────
    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        // Validate title and category before hitting server
        const newErrors = {};
        if (!data.title || !data.title.trim()) {
            newErrors.title = 'Title is required.';
        }
        if (!data.category_id || String(data.category_id).trim() === '') {
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
            return; // Server ko request nahi jayegi
        }

        // Validation passed – clear client errors and submit
        setClientErrors({});

        const payload = new FormData();
        payload.append('_method',          'PUT');
        payload.append('title',            data.title            || '');
        payload.append('slug',             data.slug             || '');
        payload.append('meta_description', data.meta_description || '');
        payload.append('meta_keyword',     data.meta_keyword     || '');
        payload.append('tags',             data.tags             || '');
        payload.append('content',          data.content          || '');
        payload.append('main_image',       data.main_image       || '');
        if (data.main_image_file instanceof File) {
            payload.append('main_image_file', data.main_image_file);
        }
        payload.append('serial_number', String(data.serial_number ?? ''));
        payload.append('status',        String(data.status        ?? 1));
        payload.append('category_id',   String(data.category_id   ?? ''));

        router.post(`/admin/services/${service.id}`, payload, {
            preserveScroll: true,
            forceFormData: true,
        });
    }, [data, service.id]);

    return (
        <AdminLayout title="Edit Service">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
                .page-overline { margin: 0; color: #2563eb; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
                .page-heading { margin: 0; font-size: 1.7rem; font-weight: 800; color: #0f172a; }
                .page-actions { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
                .btn-secondary { background: #1d4ed8; color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
                .btn-secondary:hover { background: #1e40af; }
                .form-card { background:#fff; border-radius:20px; border:1px solid #e5e7eb; box-shadow:0 18px 60px rgba(15,23,42,0.06); padding:2rem; }
                .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap:1rem; }
                .form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0; }
                .id-badge { display: inline-flex; align-items: center; justify-content: center; background: #eef2ff; color: #4338ca; font-size: 0.75rem; font-weight: 700; padding: 0.55rem 0.9rem; border-radius: 999px; }
                .section-grid { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
                .form-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
                @media (max-width: 980px) { 
                    .section-grid { grid-template-columns: 1fr; } 
                    .form-grid-two { grid-template-columns: 1fr; }
                }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group.full { grid-column: 1 / -1; }
                .form-label { font-size: 0.78rem; font-weight:700; color:#374151; letter-spacing:0.08em; text-transform: uppercase; margin-bottom: 0.25rem; }
                .form-input, .form-textarea, .form-select { width: 100%; padding: 0.95rem 1rem; border-radius:14px; border:1px solid #e5e7eb; font-size:0.95rem; color:#0f172a; background:#fff; outline: none; transition:border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
                .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.12); }
                .form-input.err, .form-textarea.err, .form-select.err { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.10); }
                .form-textarea { min-height: 100px; resize: vertical; }
                .error { font-size:0.82rem; color:#dc2626; margin-top: 0.25rem; }
                .hint { font-size:0.85rem; color:#6b7280; margin-top: 0.25rem; }
                .toggle-row { display: flex; align-items: center; gap: 0.8rem; }
                .toggle { position: relative; width: 46px; height: 26px; flex-shrink: 0; }
                .toggle input { opacity:0; width:0; height:0; position: absolute; }
                .toggle-slider { position: absolute; cursor: pointer; top:0; left:0; right:0; bottom:0; background:#cbd5e1; border-radius:999px; transition:background 0.2s; }
                .toggle-slider::before { content:''; position: absolute; height:20px; width:20px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.15); }
                .toggle input:checked + .toggle-slider { background:#2563eb; }
                .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }
                .toggle-label { font-size:0.95rem; color:#374151; font-weight:600; }
                .form-actions { display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.75rem; flex-wrap: wrap; }
                .btn-primary { background: #2563eb; color: #fff; border: none; padding:0.9rem 1.3rem; border-radius: 14px; font-weight:700; cursor:pointer; font-size: 0.95rem; }
                .btn-primary:hover:not(:disabled) { background:#1d4ed8; }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel { background: transparent; color: #374151; border: 1px solid #e5e7eb; padding:0.9rem 1.3rem; border-radius: 14px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; }
                .btn-cancel:hover { background: #f8fafc; }
                .image-panel { display: grid; gap: 1rem; }
                .image-preview { position: relative; border: 1px solid #d1d5db; border-radius: 18px; background: #f8fafc; min-height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .image-preview img { max-width: 100%; max-height: 300px; object-fit: contain; }
                .image-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #6b7280; text-align: center; padding: 1.5rem; }
                .image-placeholder svg { width: 48px; height: 48px; opacity: 0.5; }
                .upload-action { position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 10px; background: #fff; border: 1px solid #d1d5db; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
                .upload-action:hover { background: #f1f5f9; }
                #edit-service-toolbar { padding: 4px 6px; background: #f6f7f7; border: 1px solid #c5c5c5; border-bottom: none; border-radius: 3px 3px 0 0; }
                .ck-row { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-height: 30px; }
                .ck-row2 { border-top: 1px solid #ddd; padding-top: 3px; margin-top: 3px; }
                #edit-service-toolbar .ql-formats { margin-right: 6px; display: inline-flex; align-items: center; }
                #edit-service-toolbar .ql-formats button,
                #edit-service-toolbar .ql-formats .ql-picker { height: 24px; }
                .ql-source-btn { font-family: monospace; font-size: 11px !important; width: auto !important; padding: 0 7px !important; color: #444 !important; background: #fff !important; border: 1px solid #c5c5c5 !important; border-radius: 2px; cursor: pointer; height: 22px !important; line-height: 22px !important; }
                #edit-service-toolbar .ql-picker-label { border: 1px solid #c5c5c5; border-radius: 2px; background: #fff; }
                .ql-container.ql-snow { border-color: #c5c5c5; border-radius: 0 0 3px 3px; min-height: 200px; font-size: 0.9rem; }
                .ql-container.ql-snow .ql-editor { min-height: 180px; line-height: 1.7; color: #2c3338; }
                .ql-editor.ql-blank::before { font-style: normal; color: #9ca3af; }
                .content-editor-wrapper { margin-top: 1.5rem; }
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

                    <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                        <div className="section-grid">
                            {/* ── Image Panel ── */}
                            <div className="image-panel">
                                <div className="image-preview">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Service preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <div>No Image Available</div>
                                            <small>Click upload to add image</small>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="upload-action"
                                        onClick={openFilePicker}
                                        title="Upload image"
                                        aria-label="Upload image"
                                    >
                                        ⬆
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <div className="form-group">
                                    <label className="form-label" htmlFor="main_image_input">Main Image (filename or URL)</label>
                                    <input
                                        id="main_image_input"
                                        className={`form-input ${allErrors.main_image ? 'err' : ''}`}
                                        value={data.main_image}
                                        onChange={handleImageInputChange}
                                        placeholder="e.g. 1637216446.png or https://..."
                                    />
                                    {allErrors.main_image && <div className="error">{allErrors.main_image}</div>}
                                </div>
                            </div>

                            {/* ── Right Fields ── */}
                            <div className="form-grid-two">

                                {/* Title – required */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="title_input">Title *</label>
                                    <input
                                        ref={titleRef}
                                        id="title_input"
                                        className={`form-input ${allErrors.title ? 'err' : ''}`}
                                        value={data.title}
                                        onChange={e => {
                                            setData('title', e.target.value);
                                            // Error turant clear ho jaye jab user type kare
                                            if (clientErrors.title) setClientErrors(prev => ({ ...prev, title: '' }));
                                        }}
                                    />
                                    {allErrors.title && <div className="error">{allErrors.title}</div>}
                                </div>

                                {/* Slug */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="slug_input">Slug (URL)</label>
                                    <input
                                        id="slug_input"
                                        className={`form-input ${allErrors.slug ? 'err' : ''}`}
                                        value={data.slug}
                                        onChange={e => {
                                            setData('slug', e.target.value);
                                            setAutoSlug('');
                                        }}
                                    />
                                    <span className="hint">Leave blank to auto-generate from title</span>
                                    {allErrors.slug && <div className="error">{allErrors.slug}</div>}
                                </div>

                                {/* Meta Description */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="meta_desc_input">Meta Description</label>
                                    <textarea
                                        id="meta_desc_input"
                                        className={`form-textarea ${allErrors.meta_description ? 'err' : ''}`}
                                        rows={3}
                                        value={data.meta_description}
                                        onChange={e => setData('meta_description', e.target.value)}
                                    />
                                    {allErrors.meta_description && <div className="error">{allErrors.meta_description}</div>}
                                </div>

                                {/* Meta Keywords */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="meta_keyword_input">Meta Keywords</label>
                                    <input
                                        id="meta_keyword_input"
                                        className={`form-input ${allErrors.meta_keyword ? 'err' : ''}`}
                                        value={data.meta_keyword}
                                        onChange={e => setData('meta_keyword', e.target.value)}
                                    />
                                    {allErrors.meta_keyword && <div className="error">{allErrors.meta_keyword}</div>}
                                </div>

                                {/* Tags */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="tags_input">Tags</label>
                                    <input
                                        id="tags_input"
                                        className={`form-input ${allErrors.tags ? 'err' : ''}`}
                                        value={data.tags}
                                        onChange={e => setData('tags', e.target.value)}
                                        placeholder="website, software, application"
                                    />
                                    <span className="hint">Comma-separated tags</span>
                                    {allErrors.tags && <div className="error">{allErrors.tags}</div>}
                                </div>

                                {/* Serial Number */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="serial_input">Serial / Sort Order</label>
                                    <input
                                        id="serial_input"
                                        className={`form-input ${allErrors.serial_number ? 'err' : ''}`}
                                        type="number"
                                        min="0"
                                        value={data.serial_number}
                                        onChange={e => setData('serial_number', parseInt(e.target.value, 10) || 0)}
                                    />
                                    {allErrors.serial_number && <div className="error">{allErrors.serial_number}</div>}
                                </div>

                                {/* Category – required */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="category_input">Category *</label>
                                    {categories.length > 0 ? (
                                        <select
                                            ref={categoryRef}
                                            id="category_input"
                                            className={`form-select ${allErrors.category_id ? 'err' : ''}`}
                                            value={data.category_id}
                                            onChange={e => {
                                                setData('category_id', e.target.value);
                                                // Error turant clear ho jaye jab user select kare
                                                if (clientErrors.category_id) setClientErrors(prev => ({ ...prev, category_id: '' }));
                                            }}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            ref={categoryRef}
                                            id="category_input"
                                            className={`form-input ${allErrors.category_id ? 'err' : ''}`}
                                            type="number"
                                            min="1"
                                            value={data.category_id}
                                            onChange={e => {
                                                setData('category_id', e.target.value);
                                                if (clientErrors.category_id) setClientErrors(prev => ({ ...prev, category_id: '' }));
                                            }}
                                        />
                                    )}
                                    {allErrors.category_id && <div className="error">{allErrors.category_id}</div>}
                                </div>

                                {/* Status Toggle */}
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <div className="toggle-row">
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={Number(data.status) === 1}
                                                onChange={e => setData('status', e.target.checked ? 1 : 0)}
                                            />
                                            <span className="toggle-slider" />
                                        </label>
                                        <span className="toggle-label">
                                            {Number(data.status) === 1 ? 'Active (visible on site)' : 'Inactive (hidden)'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Content Editor ── */}
                        <div className="content-editor-wrapper">
                            <div className="form-group full">
                                <label className="form-label">Content (Full Description)</label>
                                <BlogToolbar id="edit-service-toolbar" />
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={handleContentChange}
                                    modules={quillModules}
                                    placeholder="Enter service description..."
                                />
                                {allErrors.content && <div className="error">{allErrors.content}</div>}
                            </div>
                        </div>

                        <div className="form-actions">
                            <Link href="/admin/services" className="btn-cancel">Cancel</Link>
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Saving…' : 'Update Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}