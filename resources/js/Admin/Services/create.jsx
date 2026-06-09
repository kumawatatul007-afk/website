import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
        {/* Toolbar Row 1 */}
        <div className="ck-row">
            <span className="ql-formats">
                <button className="ql-link"   title="Link" />
                <button className="ql-image"  title="Image" />
                <button className="ql-video"  title="Video" />
            </span>
            <span className="ql-formats">
                <button className="ql-code-block" title="Code Block" />
            </span>
            <span className="ql-formats" style={{ marginLeft: 'auto' }}>
                <button className="ql-source-btn" title="Source">Source</button>
            </span>
        </div>
        {/* Toolbar Row 2 */}
        <div className="ck-row ck-row2">
            <span className="ql-formats">
                <button className="ql-bold"   title="Bold" />
                <button className="ql-italic" title="Italic" />
                <button className="ql-strike" title="Strikethrough" />
                <button className="ql-clean"  title="Remove Format" />
            </span>
            <span className="ql-formats">
                <button className="ql-list" value="ordered" title="Ordered List" />
                <button className="ql-list" value="bullet"  title="Bullet List" />
                <button className="ql-indent" value="+1"    title="Increase Indent" />
                <button className="ql-indent" value="-1"    title="Decrease Indent" />
                <button className="ql-blockquote"           title="Blockquote" />
            </span>
            <span className="ql-formats">
                <select className="ql-header" title="Heading">
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
    toolbar: { container: '#create-service-toolbar' },
};

export default function AdminServiceCreate({ categories = [] }) {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [autoSlug, setAutoSlug] = useState('');
    const { data, setData, processing, errors } = useForm({
        title: '',
        slug: '',
        subtitle: '',
        meta_title: '',
        meta_keyword: '',
        meta_description: '',
        tags: '',
        content: '',
        main_image: '',
        main_image_file: null,
        image_alt: '',
        serial_number: 0,
        status: 1,
        category_id: '',
    });

    function resolveServiceImageUrl(image) {
        if (!image) return null;
        if (image.startsWith('http') || image.startsWith('//') || image.startsWith('/')) return image;
        return `/uploads/services/${image}`;
    }

    const previewUrl = imagePreview || resolveServiceImageUrl(data.main_image);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('main_image', file.name);
            setData('main_image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const nextSlug = makeSlug(data.title);
        if ((!data.slug && nextSlug) || data.slug === autoSlug) {
            setData('slug', nextSlug);
            setAutoSlug(nextSlug);
        }
    }, [data.title]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = new FormData();
        payload.append('title', data.title || '');
        payload.append('slug', data.slug || '');
        payload.append('subtitle', data.subtitle || '');
        payload.append('meta_title', data.meta_title || '');
        payload.append('meta_keyword', data.meta_keyword || '');
        payload.append('meta_description', data.meta_description || '');
        payload.append('tags', data.tags || '');
        payload.append('content', data.content || '');
        payload.append('main_image', data.main_image || '');
        if (data.main_image_file) payload.append('main_image_file', data.main_image_file);
        payload.append('image_alt', data.image_alt || '');
        payload.append('serial_number', data.serial_number || 0);
        payload.append('status', data.status || 1);
        payload.append('category_id', data.category_id || '');

        router.post('/admin/services', payload, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Add / Update Services">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
                .page-overline { margin: 0; color: #2563eb; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
                .page-heading { margin: 0; font-size: 1.7rem; font-weight: 800; color: #0f172a; }
                .page-actions { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
                .btn-secondary { background: #1d4ed8; color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
                .btn-secondary:hover { background: #1e40af; }
                .btn-primary { background: #2563eb; color: #fff; border: none; padding: 0.9rem 1.3rem; border-radius: 14px; font-weight:700; cursor:pointer; }
                .btn-primary:hover { background:#1d4ed8; }
                .btn-icon { width: 48px; height: 48px; border-radius: 12px; background: #2563eb; color: #fff; border: none; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer; }
                .form-card { background: #fff; border-radius: 20px; border: 1px solid #e5e7eb; box-shadow: 0 18px 60px rgba(15,23,42,0.06); padding: 2rem; }
                .section-grid { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 1.5rem; }
                .image-panel { display: grid; gap: 1rem; }
                .image-preview { position: relative; border: 1px solid #d1d5db; border-radius: 18px; background: #f8fafc; min-height: 100px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .image-preview img { width: 100%; height: 100%; object-fit: contain; }
                .image-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #6b7280; text-align: center; padding: 0.75rem; }
                .image-placeholder svg { width: 30px; height: 30px; }
                .upload-action { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 10px; background: #fff; border: 1px solid #d1d5db; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
                .image-note { font-size: 0.85rem; color: #6b7280; }
                /* Quill Editor Styles */
                #create-service-toolbar { padding: 4px 6px; background: #f6f7f7; border: 1px solid #c5c5c5; border-bottom: none; border-radius: 3px 3px 0 0; }
                .ck-row { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-height: 30px; }
                .ck-row2 { border-top: 1px solid #ddd; padding-top: 3px; margin-top: 3px; }
                #create-service-toolbar .ql-formats { margin-right: 6px; }
                #create-service-toolbar .ql-formats button,
                #create-service-toolbar .ql-formats .ql-picker { height: 24px; }
                .ql-source-btn { font-family: monospace; font-size: 11px !important; width: auto !important; padding: 0 7px !important; color: #444 !important; background: #fff !important; border: 1px solid #c5c5c5 !important; border-radius: 2px; cursor: pointer; height: 22px !important; line-height: 22px !important; }
                #create-service-toolbar .ql-picker-label { border: 1px solid #c5c5c5; border-radius: 2px; background: #fff; }
                #create-service-toolbar + .ql-container { border-color: #c5c5c5; border-radius: 0 0 3px 3px; min-height: 200px; font-size: 0.9rem; }
                #create-service-toolbar + .ql-container .ql-editor { min-height: 180px; line-height: 1.7; color: #2c3338; }
                .form-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group.full { grid-column: 1 / -1; }
                .form-label { font-size: 0.78rem; font-weight: 700; color: #374151; letter-spacing: 0.08em; text-transform: uppercase; }
                .form-input, .form-textarea, .form-select { width: 100%; padding: 0.9rem 1rem; border-radius: 14px; border: 1px solid #d1d5db; font-size: 0.95rem; color: #111827; background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
                .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.12); }
                .form-textarea { min-height: 200px; resize: vertical; }
                .small-input { max-width: 100%; }
                .hint { font-size: 0.85rem; color: #6b7280; }
                .row-3 { display: grid; grid-template-columns: 1fr 1fr 220px; gap: 1.25rem; }
                .checkbox-row { display: flex; align-items: center; gap: 0.8rem; }
                .checkbox-row input { width: 18px; height: 18px; accent-color: #2563eb; }
                .checkbox-label { font-size: 0.95rem; color: #374151; }
                .form-footer { display: flex; justify-content: flex-end; margin-top: 1.75rem; }
                .form-error { color: #dc2626; font-size: 0.82rem; }
                @media (max-width: 980px) { .section-grid { grid-template-columns: 1fr; } .row-3 { grid-template-columns: 1fr; } }
            `}</style>

            <div className="page-container">
                <div className="page-topbar">
                    <div>
                        <p className="page-overline">Add Services</p>
                        <h1 className="page-heading">Add / Update Services</h1>
                    </div>
                    <div className="page-actions">
                        <Link href="/admin/services" className="btn-secondary">Back</Link>
                    </div>
                </div>

                <div className="form-card">
                    <form id="service-form" onSubmit={handleSubmit}>
                        <div className="section-grid">
                            <div className="image-panel">
                                <div className="image-preview">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Service preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 7h16M4 11h16M4 15h16M4 19h16" />
                                                <path d="M11 5l1 14" />
                                            </svg>
                                            <div>No Image Available</div>
                                        </div>
                                    )}
                                    <button type="button" className="upload-action" onClick={openFilePicker} title="Upload image">
                                        ⬆
                                    </button>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                <div className="form-group">
                                    <label className="form-label">Image filename or URL</label>
                                    <input className="form-input" value={data.main_image} onChange={e => {
                                        setData('main_image', e.target.value);
                                        setData('main_image_file', null);
                                        setImagePreview(null);
                                    }} placeholder="Enter filename or URL" />
                                    <span className="hint">Use a URL or choose a file to upload.</span>
                                    {errors.main_image && <div className="form-error">{errors.main_image}</div>}
                                </div>
                            </div>

                            <div className="form-grid-two">
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input className="form-input" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Enter Services Name" />
                                    {errors.title && <div className="form-error">{errors.title}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slug</label>
                                    <input className="form-input" value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="Leave blank to generate from title" />
                                    <span className="hint">If empty, slug is created automatically from the title.</span>
                                    {errors.slug && <div className="form-error">{errors.slug}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Title</label>
                                    <input className="form-input" value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Enter Meta Title" />
                                    {errors.meta_title && <div className="form-error">{errors.meta_title}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category Name</label>
                                    <select className="form-select" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <div className="form-error">{errors.category_id}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Keyword</label>
                                    <input className="form-input" value={data.meta_keyword} onChange={e => setData('meta_keyword', e.target.value)} placeholder="Enter Meta Keyword" />
                                    {errors.meta_keyword && <div className="form-error">{errors.meta_keyword}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image Alt</label>
                                    <input className="form-input" value={data.image_alt} onChange={e => setData('image_alt', e.target.value)} placeholder="Enter Image Alt" />
                                    {errors.image_alt && <div className="form-error">{errors.image_alt}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Description</label>
                                    <textarea className="form-textarea" rows={3} value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Enter Meta Description" />
                                    {errors.meta_description && <div className="form-error">{errors.meta_description}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-group full">
                            <label className="form-label">Description</label>
                            <BlogToolbar id="create-service-toolbar" />
                            <ReactQuill
                                theme="snow"
                                value={data.content}
                                onChange={val => setData('content', val)}
                                modules={quillModules}
                            />
                            {errors.content && <div className="form-error">{errors.content}</div>}
                        </div>

                        <div className="form-grid-two" style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Designation</label>
                                <input className="form-input" value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} placeholder="Enter designation" />
                                {errors.subtitle && <div className="form-error">{errors.subtitle}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input className="form-input" value={data.tags} onChange={e => setData('tags', e.target.value)} placeholder="Enter tags" />
                                {errors.tags && <div className="form-error">{errors.tags}</div>}
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Include Area</label>
                            <div className="checkbox-row">
                                <input type="checkbox" checked={data.is_active == 1} onChange={e => setData('is_active', e.target.checked ? 1 : 0)} />
                                <span className="checkbox-label">Active</span>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Saving…' : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
