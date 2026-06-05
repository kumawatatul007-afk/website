import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useRef, useState } from 'react';

const s = {
    label: {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#0073aa',
        marginBottom: '0.35rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem 0.65rem',
        border: '1px solid #8c8f94',
        borderRadius: '3px',
        fontSize: '0.875rem',
        color: '#2c3338',
        outline: 'none',
        background: '#fff',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '0.5rem 0.65rem',
        border: '1px solid #8c8f94',
        borderRadius: '3px',
        fontSize: '0.875rem',
        color: '#2c3338',
        outline: 'none',
        background: '#fff',
        boxSizing: 'border-box',
        resize: 'vertical',
        minHeight: '82px',
    },
};

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
    toolbar: { container: '#create-blog-toolbar' },
};

export default function AdminBlogCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title:            '',
        content:          '',
        main_image:       '',
        category_id:      '',
        meta_title:       '',
        meta_keyword:     '',
        meta_keywords:    '',
        meta_description: '',
        og_title:         '',
        og_description:   '',
        image_alt:        '',
        tags:             '',
        type:             1,
        status:           1,
        serial_number:    '',
    });

    const [imgPreview, setImgPreview] = useState('');
    const fileRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgPreview(URL.createObjectURL(file));
        setData('main_image', file.name);
    };

    const getPreviewUrl = () => {
        if (imgPreview) return imgPreview;
        if (!data.main_image) return null;
        return data.main_image.startsWith('http') ? data.main_image : `/images/blogs/${data.main_image}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/blog');
    };

    const previewUrl = getPreviewUrl();

    return (
        <AdminLayout title="Blog Post">
            <style>{`
                /* ── Editor two-row toolbar ── */
                #create-blog-toolbar { padding: 4px 6px; background: #f6f7f7; border: 1px solid #c5c5c5; border-bottom: none; border-radius: 3px 3px 0 0; }
                .ck-row { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-height: 30px; }
                .ck-row2 { border-top: 1px solid #ddd; padding-top: 3px; margin-top: 3px; }
                #create-blog-toolbar .ql-formats { margin-right: 6px; }
                #create-blog-toolbar .ql-formats button,
                #create-blog-toolbar .ql-formats .ql-picker { height: 24px; }
                .ql-source-btn { font-family: monospace; font-size: 11px !important; width: auto !important; padding: 0 7px !important; color: #444 !important; background: #fff !important; border: 1px solid #c5c5c5 !important; border-radius: 2px; cursor: pointer; height: 22px !important; line-height: 22px !important; }
                #create-blog-toolbar .ql-picker-label { border: 1px solid #c5c5c5; border-radius: 2px; background: #fff; }

                /* ── Editor content area ── */
                #create-blog-toolbar + .ql-container { border-color: #c5c5c5; border-radius: 0 0 3px 3px; min-height: 200px; font-size: 0.9rem; }
                #create-blog-toolbar + .ql-container .ql-editor { min-height: 180px; line-height: 1.7; color: #2c3338; }
                #create-blog-toolbar + .ql-container .ql-editor h1,
                #create-blog-toolbar + .ql-container .ql-editor h2,
                #create-blog-toolbar + .ql-container .ql-editor h3 { color: #1d2327; font-weight: 700; margin-bottom: 0.5rem; }
                #create-blog-toolbar + .ql-container .ql-editor p { margin-bottom: 0.75rem; }

                /* ── Featured image preview ── */
                .feat-img-box { border: 1px solid #c5c5c5; border-radius: 3px; overflow: hidden; background: #f6f7f7; flex-shrink: 0; }
                .feat-img-box img { display: block; width: 130px; height: 100px; object-fit: cover; }
                .feat-img-placeholder { width: 130px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; color: #a7aaad; font-size: 0.72rem; cursor: pointer; }
                .feat-img-placeholder:hover { background: #eee; }

                /* ── Form inputs ── */
                .bp-input:focus { border-color: #2271b1 !important; box-shadow: 0 0 0 1px #2271b1; outline: none; }

                /* ── Image box ── */
                .bp-img-box { border: 1px solid #c3c4c7; border-radius: 3px; padding: 6px; cursor: pointer; position: relative; flex-shrink: 0; }
                .bp-img-box:hover { border-color: #2271b1; }
                .bp-upload-icon { position: absolute; top: 4px; right: 4px; background: #fff; border: 1px solid #c3c4c7; border-radius: 2px; padding: 2px 5px; font-size: 0.7rem; color: #646970; }
            `}</style>

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1d2327', margin: 0, lineHeight: 1.3 }}>Blog Post</h1>
                    <div style={{ fontSize: '0.8rem', color: '#646970', marginTop: '3px' }}>
                        <Link href="/admin/blog" style={{ color: '#0073aa', textDecoration: 'none' }}>Blog</Link>
                        {' / New Post'}
                    </div>
                </div>
                <Link
                    href="/admin/blog"
                    title="Back to Blog List"
                    style={{ width: '38px', height: '38px', background: '#646970', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}
                >
                    ←
                </Link>
            </div>

            {/* ── Form Card ── */}
            <div style={{ background: '#fff', border: '1px solid #c3c4c7', borderRadius: '4px', padding: '1.5rem 1.75rem' }}>
                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div style={{ marginBottom: '1.1rem' }}>
                        <label style={s.label}>Title</label>
                        <input
                            className="bp-input"
                            style={{ ...s.input, ...(errors.title ? { borderColor: '#d63638' } : {}) }}
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Enter post title"
                        />
                        {errors.title && <div style={{ color: '#d63638', fontSize: '0.78rem', marginTop: '3px' }}>{errors.title}</div>}
                    </div>

                    {/* Category Name + Image Preview */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={s.label}>Category Name</label>
                            <select
                                className="bp-input"
                                style={s.input}
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                            >
                                <option value="">— Select Category —</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            <div className="bp-img-box" onClick={() => fileRef.current?.click()}>
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        style={{ width: '112px', height: '90px', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div style={{ width: '112px', height: '90px', background: '#f6f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a7aaad', fontSize: '0.72rem', flexDirection: 'column', gap: '5px' }}>
                                        <span style={{ fontSize: '1.6rem' }}>🖼</span>
                                        <span>No Image</span>
                                    </div>
                                )}
                                <div className="bp-upload-icon">⬆</div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Title | Meta Description */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.1rem' }}>
                        <div>
                            <label style={s.label}>Meta Title</label>
                            <input className="bp-input" style={s.input} value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Meta title" />
                        </div>
                        <div>
                            <label style={s.label}>Meta Description</label>
                            <textarea className="bp-input" style={s.textarea} value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Meta description for search engines" />
                        </div>
                    </div>

                    {/* Meta Keyword | Image Alt */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.1rem' }}>
                        <div>
                            <label style={s.label}>Meta Keyword</label>
                            <input className="bp-input" style={s.input} value={data.meta_keyword} onChange={e => setData('meta_keyword', e.target.value)} placeholder="website, development, SEO" />
                        </div>
                        <div>
                            <label style={s.label}>Image Alt</label>
                            <input className="bp-input" style={s.input} value={data.image_alt} onChange={e => setData('image_alt', e.target.value)} placeholder="Enter Image Alt" />
                        </div>
                    </div>

                    {/* OG Title | OG Description */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.1rem' }}>
                        <div>
                            <label style={s.label}>OG Title</label>
                            <input className="bp-input" style={s.input} value={data.og_title} onChange={e => setData('og_title', e.target.value)} placeholder="OG title" />
                        </div>
                        <div>
                            <label style={s.label}>OG Description</label>
                            <textarea className="bp-input" style={s.textarea} value={data.og_description} onChange={e => setData('og_description', e.target.value)} placeholder="OG description" />
                        </div>
                    </div>



                    {/* Blog Description */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ ...s.label, fontSize: '0.85rem', marginBottom: '0.6rem' }}>Blog Description</label>
                        <BlogToolbar id="create-blog-toolbar" />
                        <ReactQuill
                            theme="snow"
                            value={data.content}
                            onChange={val => setData('content', val)}
                            modules={quillModules}
                        />
                        {errors.content && <div style={{ color: '#d63638', fontSize: '0.78rem', marginTop: '3px' }}>{errors.content}</div>}
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ background: '#2271b1', color: '#fff', border: 'none', borderRadius: '3px', padding: '0.5rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, letterSpacing: '0.06em' }}
                        >
                            {processing ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
