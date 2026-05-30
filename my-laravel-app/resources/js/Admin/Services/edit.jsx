import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

const IconBack    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconSave    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconInfo    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconSEO     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconContent = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconImage   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconHome    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevron = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconSpinner = () => <span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'svSpin .65s linear infinite', display:'inline-block', flexShrink:0 }} />;

export default function AdminServiceEdit({ service }) {
    const { data, setData, put, processing, errors } = useForm({
        title:            service.title            ?? '',
        slug:             service.slug             ?? '',
        meta_description: service.meta_description ?? '',
        meta_keywords:    service.meta_keywords    ?? '',
        tags:             service.tags             ?? '',
        content:          service.content          ?? '',
        main_image:       service.main_image       ?? '',
        serial_number:    service.serial_number    ?? 100,
        status:           service.status           ?? 1,
        category_id:      service.category_id      ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    };

    return (
        <AdminLayout title="Edit Service">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

                @keyframes svFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes svSpin   { to{transform:rotate(360deg)} }

                .sv-page { font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; max-width:1100px; }

                /* ── Breadcrumb ── */
                .sv-breadcrumb { display:flex;align-items:center;gap:0.4rem;font-size:.75rem;font-weight:500;color:#94a3b8;margin-bottom:0.5rem;animation:svFadeUp .35s ease both; }
                .sv-breadcrumb .bc-active { color:#3b82f6;font-weight:600; }

                /* ── Page header ── */
                .sv-page-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;animation:svFadeUp .4s ease both; }
                .sv-page-title-wrap h1 { font-size:1.6rem;font-weight:900;color:#0f172a;letter-spacing:-.6px;margin:0 0 .3rem; }
                .sv-id-badge { display:inline-flex;align-items:center;gap:.35rem;background:linear-gradient(135deg,#eff6ff,#dbeafe);color:#2563eb;font-size:.72rem;font-weight:700;padding:.25rem .75rem;border-radius:999px;border:1px solid rgba(37,99,235,.15); }
                .sv-id-badge::before { content:'';width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block; }
                .sv-header-actions { display:flex;gap:.75rem;align-items:center; }
                .sv-btn-back { display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.1rem;background:#fff;color:#475569;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.875rem;font-weight:600;text-decoration:none;transition:all .15s;font-family:inherit; }
                .sv-btn-back:hover { background:#f8fafc;border-color:#cbd5e1;transform:translateY(-1px); }
                .sv-btn-save { display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.6rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;font-size:.875rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(37,99,235,.4);transition:transform .15s,box-shadow .15s; }
                .sv-btn-save:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,.5); }
                .sv-btn-save:disabled { opacity:.65;cursor:not-allowed;transform:none;box-shadow:none; }

                /* ── Layout: left (main) + right (sidebar) ── */
                .sv-layout { display:grid;grid-template-columns:1fr 320px;gap:1.5rem;align-items:start; }
                @media(max-width:900px){ .sv-layout{grid-template-columns:1fr;} }

                /* ── Section card ── */
                .sv-card { background:#fff;border-radius:18px;border:1px solid #eef2f7;box-shadow:0 1px 3px rgba(15,23,42,.04),0 6px 24px rgba(15,23,42,.05);overflow:hidden;animation:svFadeUp .45s ease both; }
                .sv-card + .sv-card { margin-top:1.25rem; }
                .sv-card-head { display:flex;align-items:center;gap:.6rem;padding:1.1rem 1.5rem;border-bottom:1px solid #f1f5f9;background:linear-gradient(180deg,#fafbff,#f8fafc); }
                .sv-card-head-icon { width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
                .sv-card-head-icon.blue   { background:linear-gradient(135deg,#eff6ff,#dbeafe);color:#2563eb; }
                .sv-card-head-icon.purple { background:linear-gradient(135deg,#f5f3ff,#ede9fe);color:#7c3aed; }
                .sv-card-head-icon.green  { background:linear-gradient(135deg,#f0fdf4,#dcfce7);color:#16a34a; }
                .sv-card-head-icon.orange { background:linear-gradient(135deg,#fff7ed,#ffedd5);color:#ea580c; }
                .sv-card-title { font-size:.8rem;font-weight:800;color:#0f172a;letter-spacing:.02em;text-transform:uppercase; }
                .sv-card-body { padding:1.5rem; }

                /* ── Form elements ── */
                .sv-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1.1rem; }
                @media(max-width:580px){ .sv-grid-2{grid-template-columns:1fr;} }
                .sv-field { display:flex;flex-direction:column;gap:.4rem; }
                .sv-field + .sv-field { margin-top:1.1rem; }
                .sv-label { font-size:.72rem;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:.35rem; }
                .sv-label .req { color:#ef4444;font-size:.8rem; }
                .sv-input, .sv-textarea, .sv-select {
                    padding:.75rem 1rem;border:1.5px solid #e2e8f0;border-radius:10px;
                    font-size:.875rem;color:#0f172a;background:#fff;outline:none;
                    font-family:inherit;transition:border-color .15s,box-shadow .15s;
                    width:100%;box-sizing:border-box;
                }
                .sv-input:focus, .sv-textarea:focus, .sv-select:focus {
                    border-color:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.1);
                }
                .sv-input.err, .sv-textarea.err { border-color:#ef4444; box-shadow:0 0 0 4px rgba(239,68,68,.08); }
                .sv-textarea { resize:vertical;min-height:130px;line-height:1.65; }
                .sv-textarea.tall { min-height:220px; }
                .sv-hint { font-size:.72rem;color:#94a3b8;margin-top:.15rem;line-height:1.5; }
                .sv-error { font-size:.75rem;color:#ef4444;margin-top:.2rem; }

                /* ── Character count ── */
                .sv-field-meta { display:flex;justify-content:space-between;align-items:center; }
                .sv-char-count { font-size:.7rem;color:#cbd5e1;font-weight:500; }
                .sv-char-count.warn { color:#f59e0b; }
                .sv-char-count.over { color:#ef4444; }

                /* ── Image preview ── */
                .sv-img-preview { margin-top:.75rem;border-radius:10px;overflow:hidden;border:1.5px solid #e2e8f0;background:#f8fafc;max-height:180px;display:flex;align-items:center;justify-content:center; }
                .sv-img-preview img { max-height:180px;max-width:100%;object-fit:contain; }
                .sv-img-placeholder { padding:2rem;text-align:center;color:#c8d1dc;font-size:.8rem; }

                /* ── Status toggle ── */
                .sv-status-wrap { display:flex;align-items:center;justify-content:space-between;padding:1rem 1.1rem;border-radius:12px;border:1.5px solid #e2e8f0;background:#f8fafc;transition:border-color .2s,background .2s; }
                .sv-status-wrap.active { border-color:rgba(34,197,94,.35);background:linear-gradient(135deg,#f0fdf4,#dcfce7); }
                .sv-status-text { font-size:.875rem;font-weight:600;color:#374151; }
                .sv-status-sub  { font-size:.75rem;color:#94a3b8;margin-top:.15rem; }
                .sv-toggle { position:relative;width:46px;height:26px;flex-shrink:0; }
                .sv-toggle input { opacity:0;width:0;height:0; }
                .sv-toggle-track { position:absolute;cursor:pointer;inset:0;background:#cbd5e1;border-radius:26px;transition:background .25s; }
                .sv-toggle-track::before { content:'';position:absolute;height:20px;width:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .25s;box-shadow:0 1px 4px rgba(0,0,0,.2); }
                .sv-toggle input:checked + .sv-toggle-track { background:#22c55e; }
                .sv-toggle input:checked + .sv-toggle-track::before { transform:translateX(20px); }

                /* ── Sort order input ── */
                .sv-number-wrap { position:relative;display:flex;align-items:stretch; }
                .sv-number-wrap .sv-input { border-radius:10px 0 0 10px;border-right:none;flex:1; }
                .sv-number-unit { display:flex;align-items:center;padding:0 .875rem;background:#f1f5f9;border:1.5px solid #e2e8f0;border-left:none;border-radius:0 10px 10px 0;font-size:.78rem;color:#64748b;font-weight:600;white-space:nowrap; }

                /* ── Bottom bar ── */
                .sv-bottom-bar { display:flex;align-items:center;justify-content:flex-end;gap:.75rem;margin-top:1.5rem;padding:1.25rem 1.5rem;background:#fff;border-radius:16px;border:1px solid #eef2f7;box-shadow:0 1px 3px rgba(15,23,42,.04);animation:svFadeUp .5s ease .3s both; }

                /* ── Sidebar cards delay ── */
                .sv-card:nth-child(1) { animation-delay:.05s; }
                .sv-card:nth-child(2) { animation-delay:.1s; }
                .sv-card:nth-child(3) { animation-delay:.15s; }
                .sv-sidebar .sv-card { animation-delay:.2s; }
                .sv-sidebar .sv-card + .sv-card { animation-delay:.25s; }

            `}</style>

            <div className="sv-page">

                {/* Breadcrumb */}
                <div className="sv-breadcrumb">
                    <IconHome /> Admin <IconChevron />
                    <Link href="/admin/services" style={{ color:'#94a3b8', textDecoration:'none' }}>Services</Link>
                    <IconChevron />
                    <span className="bc-active">Edit Service</span>
                </div>

                {/* Page header */}
                <div className="sv-page-header">
                    <div className="sv-page-title-wrap">
                        <h1>Edit Service</h1>
                        <span className="sv-id-badge">ID: {service.id}</span>
                    </div>
                    <div className="sv-header-actions">
                        <Link href="/admin/services" className="sv-btn-back">
                            <IconBack /> Back to Services
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="sv-layout">

                        {/* ── Left / Main column ── */}
                        <div className="sv-main">

                            {/* Basic Info */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon blue"><IconInfo /></div>
                                    <span className="sv-card-title">Basic Information</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className="sv-grid-2">
                                        <div className="sv-field">
                                            <label className="sv-label">Title <span className="req">*</span></label>
                                            <input className={`sv-input${errors.title ? ' err' : ''}`} value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="e.g. Website Development" />
                                            {errors.title && <span className="sv-error">{errors.title}</span>}
                                        </div>
                                        <div className="sv-field">
                                            <label className="sv-label">Slug (URL)</label>
                                            <input className={`sv-input${errors.slug ? ' err' : ''}`} value={data.slug}
                                                onChange={e => setData('slug', e.target.value)}
                                                placeholder="website-development" />
                                            <span className="sv-hint">Leave empty to auto-generate from title</span>
                                            {errors.slug && <span className="sv-error">{errors.slug}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon purple"><IconSEO /></div>
                                    <span className="sv-card-title">SEO &amp; Meta</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className="sv-field">
                                        <div className="sv-field-meta">
                                            <label className="sv-label">Meta Description</label>
                                            <span className={`sv-char-count${data.meta_description.length > 160 ? ' over' : data.meta_description.length > 130 ? ' warn' : ''}`}>
                                                {data.meta_description.length}/160
                                            </span>
                                        </div>
                                        <textarea className={`sv-textarea${errors.meta_description ? ' err' : ''}`} rows={4}
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            placeholder="A concise description for search engines (max 160 chars)…" />
                                        {errors.meta_description && <span className="sv-error">{errors.meta_description}</span>}
                                    </div>

                                    <div className="sv-field">
                                        <label className="sv-label">Meta Keywords</label>
                                        <input className={`sv-input${errors.meta_keywords ? ' err' : ''}`}
                                            value={data.meta_keywords}
                                            onChange={e => setData('meta_keywords', e.target.value)}
                                            placeholder="keyword1, keyword2, keyword3" />
                                        <span className="sv-hint">Comma-separated keywords for search engines</span>
                                        {errors.meta_keywords && <span className="sv-error">{errors.meta_keywords}</span>}
                                    </div>

                                    <div className="sv-field">
                                        <label className="sv-label">Tags</label>
                                        <input className={`sv-input${errors.tags ? ' err' : ''}`}
                                            value={data.tags}
                                            onChange={e => setData('tags', e.target.value)}
                                            placeholder="website, software, application" />
                                        <span className="sv-hint">Comma-separated tags for filtering</span>
                                        {errors.tags && <span className="sv-error">{errors.tags}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon green"><IconContent /></div>
                                    <span className="sv-card-title">Content</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className="sv-field">
                                        <label className="sv-label">Full Description</label>
                                        <textarea className={`sv-textarea tall${errors.content ? ' err' : ''}`} rows={10}
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            placeholder="Write a detailed description of this service…" />
                                        {errors.content && <span className="sv-error">{errors.content}</span>}
                                    </div>
                                </div>
                            </div>

                        </div>{/* end sv-main */}

                        {/* ── Right / Sidebar column ── */}
                        <div className="sv-sidebar">

                            {/* Status */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon green">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <span className="sv-card-title">Publish Status</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className={`sv-status-wrap${data.status == 1 ? ' active' : ''}`}>
                                        <div>
                                            <div className="sv-status-text">
                                                {data.status == 1 ? '✓ Active' : '○ Inactive'}
                                            </div>
                                            <div className="sv-status-sub">
                                                {data.status == 1 ? 'Visible on website' : 'Hidden from website'}
                                            </div>
                                        </div>
                                        <label className="sv-toggle">
                                            <input type="checkbox" checked={data.status == 1}
                                                onChange={e => setData('status', e.target.checked ? 1 : 0)} />
                                            <span className="sv-toggle-track" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Media */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon orange"><IconImage /></div>
                                    <span className="sv-card-title">Featured Image</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className="sv-field">
                                        <label className="sv-label">Image (filename or URL)</label>
                                        <input className={`sv-input${errors.main_image ? ' err' : ''}`}
                                            value={data.main_image}
                                            onChange={e => setData('main_image', e.target.value)}
                                            placeholder="e.g. service.png or https://…" />
                                        <span className="sv-hint">Filename from uploads or a full URL</span>
                                        {errors.main_image && <span className="sv-error">{errors.main_image}</span>}
                                    </div>
                                    {data.main_image && data.main_image.startsWith('http') && (
                                        <div className="sv-img-preview">
                                            <img src={data.main_image} alt="preview"
                                                onError={e => e.currentTarget.parentElement.style.display='none'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Organisation */}
                            <div className="sv-card">
                                <div className="sv-card-head">
                                    <div className="sv-card-head-icon blue">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                    </div>
                                    <span className="sv-card-title">Organisation</span>
                                </div>
                                <div className="sv-card-body">
                                    <div className="sv-field">
                                        <label className="sv-label">Category ID</label>
                                        <input className={`sv-input${errors.category_id ? ' err' : ''}`}
                                            type="number" min="1"
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            placeholder="e.g. 3" />
                                        {errors.category_id && <span className="sv-error">{errors.category_id}</span>}
                                    </div>

                                    <div className="sv-field">
                                        <label className="sv-label">Sort Order</label>
                                        <div className="sv-number-wrap">
                                            <input className="sv-input" type="number" min="0"
                                                value={data.serial_number}
                                                onChange={e => setData('serial_number', parseInt(e.target.value) || 0)} />
                                            <span className="sv-number-unit"># order</span>
                                        </div>
                                        <span className="sv-hint">Lower number = appears first</span>
                                        {errors.serial_number && <span className="sv-error">{errors.serial_number}</span>}
                                    </div>
                                </div>
                            </div>

                        </div>{/* end sv-sidebar */}
                    </div>


                    {/* Bottom action bar */}
                    <div className="sv-bottom-bar">
                        <Link href="/admin/services" className="sv-btn-back">
                            <IconBack /> Discard Changes
                        </Link>
                        <button type="submit" className="sv-btn-save" disabled={processing}>
                            {processing ? <><IconSpinner /> Saving…</> : <><IconSave /> Save Changes</>}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
