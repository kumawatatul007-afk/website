import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

const IconBack    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconSave    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconInfo    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconSEO     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconContent = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconImage   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconProject = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconHome    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevron = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconSpinner = () => <span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'pfSpin .65s linear infinite', display:'inline-block', flexShrink:0 }} />;

export default function AdminPortfolioCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title:             '',
        category_id:       '',
        image:             '',
        clint_name:        '',
        status:            'Active',
        date:              '',
        website_link:      '',
        short_description: '',
        description:       '',
        meta_keyword:      '',
        meta_description:  '',
        is_publish:        1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/portfolio');
    };

    const inp = (field) => ({
        width:'100%', padding:'.75rem 1rem',
        border:`1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
        borderRadius:'10px', fontSize:'.875rem', color:'#0f172a',
        background:'#fff', outline:'none', fontFamily:'inherit',
        boxSizing:'border-box', transition:'border-color .15s,box-shadow .15s',
    });

    const selectInp = (field) => ({
        ...inp(field),
        cursor:'pointer',
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundRepeat:'no-repeat', backgroundPosition:'right 1rem center',
        paddingRight:'2.5rem', appearance:'none', WebkitAppearance:'none',
    });

    return (
        <AdminLayout title="Create Portfolio Item">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

                @keyframes pfFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pfSpin   { to{transform:rotate(360deg)} }

                .pf-page { font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; max-width:1100px; }

                .pf-breadcrumb { display:flex;align-items:center;gap:.4rem;font-size:.75rem;font-weight:500;color:#94a3b8;margin-bottom:.5rem;animation:pfFadeUp .35s ease both; }
                .pf-breadcrumb .bc-active { color:#3b82f6;font-weight:600; }

                .pf-page-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;animation:pfFadeUp .4s ease both; }
                .pf-page-header h1 { font-size:1.6rem;font-weight:900;color:#0f172a;letter-spacing:-.6px;margin:0 0 .3rem; }
                .pf-subtitle { font-size:.85rem;color:#94a3b8;margin:0; }
                .pf-header-actions { display:flex;gap:.75rem;align-items:center; }

                .pf-btn-back { display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.1rem;background:#fff;color:#475569;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.875rem;font-weight:600;text-decoration:none;transition:all .15s;font-family:inherit; }
                .pf-btn-back:hover { background:#f8fafc;border-color:#cbd5e1;transform:translateY(-1px); }

                .pf-layout { display:grid;grid-template-columns:1fr 320px;gap:1.5rem;align-items:start; }
                @media(max-width:900px){ .pf-layout{grid-template-columns:1fr;} }

                .pf-card { background:#fff;border-radius:18px;border:1px solid #eef2f7;box-shadow:0 1px 3px rgba(15,23,42,.04),0 6px 24px rgba(15,23,42,.05);overflow:hidden;animation:pfFadeUp .45s ease both; }
                .pf-card + .pf-card { margin-top:1.25rem; }
                .pf-card-head { display:flex;align-items:center;gap:.6rem;padding:1.1rem 1.5rem;border-bottom:1px solid #f1f5f9;background:linear-gradient(180deg,#fafbff,#f8fafc); }
                .pf-card-icon { width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
                .pf-card-icon.blue   { background:linear-gradient(135deg,#eff6ff,#dbeafe);color:#2563eb; }
                .pf-card-icon.purple { background:linear-gradient(135deg,#f5f3ff,#ede9fe);color:#7c3aed; }
                .pf-card-icon.green  { background:linear-gradient(135deg,#f0fdf4,#dcfce7);color:#16a34a; }
                .pf-card-icon.orange { background:linear-gradient(135deg,#fff7ed,#ffedd5);color:#ea580c; }
                .pf-card-icon.indigo { background:linear-gradient(135deg,#eef2ff,#e0e7ff);color:#4f46e5; }
                .pf-card-title { font-size:.8rem;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:.04em; }
                .pf-card-body { padding:1.5rem; }

                .pf-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1.1rem; }
                @media(max-width:580px){ .pf-grid-2{grid-template-columns:1fr;} }

                .pf-field { display:flex;flex-direction:column;gap:.4rem; }
                .pf-field + .pf-field { margin-top:1.1rem; }
                .pf-label { font-size:.72rem;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.07em; }
                .pf-label .req { color:#ef4444; }
                .pf-hint  { font-size:.72rem;color:#94a3b8;line-height:1.5; }
                .pf-error { font-size:.75rem;color:#ef4444; }

                .pf-textarea { width:100%;padding:.75rem 1rem;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.875rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;box-sizing:border-box;transition:border-color .15s,box-shadow .15s;resize:vertical;line-height:1.65; }
                .pf-textarea:focus { border-color:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.1); }
                .pf-textarea.tall { min-height:200px; }

                input:focus, select:focus { border-color:#3b82f6 !important;box-shadow:0 0 0 4px rgba(59,130,246,.1) !important; }

                .pf-char-count { font-size:.7rem;color:#cbd5e1;font-weight:500; }
                .pf-char-count.warn { color:#f59e0b; }
                .pf-char-count.over { color:#ef4444; }
                .pf-field-meta { display:flex;justify-content:space-between;align-items:center; }

                .pf-img-preview { margin-top:.75rem;border-radius:10px;overflow:hidden;border:1.5px solid #e2e8f0;background:#f8fafc;max-height:160px;display:flex;align-items:center;justify-content:center; }
                .pf-img-preview img { max-height:160px;max-width:100%;object-fit:contain; }

                .pf-status-wrap { display:flex;align-items:center;justify-content:space-between;padding:1rem 1.1rem;border-radius:12px;border:1.5px solid #e2e8f0;background:#f8fafc;transition:border-color .2s,background .2s;margin-bottom:1rem; }
                .pf-status-wrap.active { border-color:rgba(34,197,94,.35);background:linear-gradient(135deg,#f0fdf4,#dcfce7); }
                .pf-status-text { font-size:.875rem;font-weight:600;color:#374151; }
                .pf-status-sub  { font-size:.75rem;color:#94a3b8;margin-top:.15rem; }
                .pf-toggle { position:relative;width:46px;height:26px;flex-shrink:0; }
                .pf-toggle input { opacity:0;width:0;height:0; }
                .pf-toggle-track { position:absolute;cursor:pointer;inset:0;background:#cbd5e1;border-radius:26px;transition:background .25s; }
                .pf-toggle-track::before { content:'';position:absolute;height:20px;width:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .25s;box-shadow:0 1px 4px rgba(0,0,0,.2); }
                .pf-toggle input:checked + .pf-toggle-track { background:#22c55e; }
                .pf-toggle input:checked + .pf-toggle-track::before { transform:translateX(20px); }

                .pf-bottom-bar { display:flex;align-items:center;justify-content:flex-end;gap:.75rem;margin-top:1.5rem;padding:1.25rem 1.5rem;background:#fff;border-radius:16px;border:1px solid #eef2f7;box-shadow:0 1px 3px rgba(15,23,42,.04);animation:pfFadeUp .5s ease .3s both; }
                .pf-btn-save { display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.75rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;font-size:.875rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(37,99,235,.4);transition:transform .15s,box-shadow .15s; }
                .pf-btn-save:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,.5); }
                .pf-btn-save:disabled { opacity:.65;cursor:not-allowed;transform:none;box-shadow:none; }
            `}</style>

            <div className="pf-page">

                {/* Breadcrumb */}
                <div className="pf-breadcrumb">
                    <IconHome /> Admin <IconChevron />
                    <Link href="/admin/portfolio" style={{ color:'#94a3b8', textDecoration:'none' }}>Portfolio</Link>
                    <IconChevron />
                    <span className="bc-active">Create Item</span>
                </div>

                {/* Page header */}
                <div className="pf-page-header">
                    <div>
                        <h1>Create Portfolio Item</h1>
                        <p className="pf-subtitle">Add a new project to your portfolio</p>
                    </div>
                    <div className="pf-header-actions">
                        <Link href="/admin/portfolio" className="pf-btn-back">
                            <IconBack /> Back to Portfolio
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pf-layout">

                        {/* ── Left / Main ── */}
                        <div>

                            {/* Basic Info */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon blue"><IconInfo /></div>
                                    <span className="pf-card-title">Basic Information</span>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-field">
                                        <label className="pf-label">Title <span className="req">*</span></label>
                                        <input style={inp('title')} value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="e.g. E-commerce Website for XYZ" />
                                        {errors.title && <span className="pf-error">{errors.title}</span>}
                                    </div>

                                    <div className="pf-field">
                                        <label className="pf-label">Short Description</label>
                                        <input style={inp('short_description')} value={data.short_description}
                                            onChange={e => setData('short_description', e.target.value)}
                                            placeholder="One-line summary of this project" />
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon indigo"><IconProject /></div>
                                    <span className="pf-card-title">Project Details</span>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-grid-2">
                                        <div className="pf-field">
                                            <label className="pf-label">Client Name</label>
                                            <input style={inp('clint_name')} value={data.clint_name}
                                                onChange={e => setData('clint_name', e.target.value)}
                                                placeholder="Client / Company name" />
                                        </div>
                                        <div className="pf-field">
                                            <label className="pf-label">Project Date</label>
                                            <input type="date" style={inp('date')} value={data.date}
                                                onChange={e => setData('date', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="pf-field">
                                        <label className="pf-label">Website Link</label>
                                        <input style={inp('website_link')} value={data.website_link}
                                            onChange={e => setData('website_link', e.target.value)}
                                            placeholder="https://example.com" />
                                    </div>

                                    <div className="pf-field">
                                        <label className="pf-label">Category</label>
                                        <select style={selectInp('category_id')} value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}>
                                            <option value="">— Select Category —</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Full Description */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon green"><IconContent /></div>
                                    <span className="pf-card-title">Full Description</span>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-field">
                                        <textarea className="pf-textarea tall" rows={9}
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Detailed description of the project — technologies used, challenges, outcomes…" />
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon purple"><IconSEO /></div>
                                    <span className="pf-card-title">SEO &amp; Meta</span>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-field">
                                        <div className="pf-field-meta">
                                            <label className="pf-label">Meta Description</label>
                                            <span className={`pf-char-count${data.meta_description.length > 160 ? ' over' : data.meta_description.length > 130 ? ' warn' : ''}`}>
                                                {data.meta_description.length}/160
                                            </span>
                                        </div>
                                        <textarea className="pf-textarea" rows={3}
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            placeholder="Concise description for search engines (max 160 chars)…" />
                                    </div>
                                    <div className="pf-field">
                                        <label className="pf-label">Meta Keywords</label>
                                        <input style={inp('meta_keyword')} value={data.meta_keyword}
                                            onChange={e => setData('meta_keyword', e.target.value)}
                                            placeholder="keyword1, keyword2, keyword3" />
                                        <span className="pf-hint">Comma-separated keywords</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ── Right / Sidebar ── */}
                        <div>

                            {/* Publish */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon green">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <span className="pf-card-title">Publish Settings</span>
                                </div>
                                <div className="pf-card-body">
                                    {/* Published toggle */}
                                    <div className={`pf-status-wrap${data.is_publish === 1 ? ' active' : ''}`}>
                                        <div>
                                            <div className="pf-status-text">{data.is_publish === 1 ? '✓ Published' : '○ Draft'}</div>
                                            <div className="pf-status-sub">{data.is_publish === 1 ? 'Visible on website' : 'Not visible yet'}</div>
                                        </div>
                                        <label className="pf-toggle">
                                            <input type="checkbox" checked={data.is_publish === 1}
                                                onChange={e => setData('is_publish', e.target.checked ? 1 : 0)} />
                                            <span className="pf-toggle-track" />
                                        </label>
                                    </div>

                                    {/* Status */}
                                    <div className="pf-field">
                                        <label className="pf-label">Status</label>
                                        <select style={selectInp('status')} value={data.status}
                                            onChange={e => setData('status', e.target.value)}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="pf-card">
                                <div className="pf-card-head">
                                    <div className="pf-card-icon orange"><IconImage /></div>
                                    <span className="pf-card-title">Featured Image</span>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-field">
                                        <label className="pf-label">Image (filename or URL)</label>
                                        <input style={inp('image')} value={data.image}
                                            onChange={e => setData('image', e.target.value)}
                                            placeholder="e.g. project.jpg or https://…" />
                                        <span className="pf-hint">Filename from uploads or a full URL</span>
                                    </div>
                                    {data.image && data.image.startsWith('http') && (
                                        <div className="pf-img-preview">
                                            <img src={data.image} alt="preview"
                                                onError={e => e.currentTarget.parentElement.style.display='none'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pf-bottom-bar">
                        <Link href="/admin/portfolio" className="pf-btn-back">
                            <IconBack /> Cancel
                        </Link>
                        <button type="submit" className="pf-btn-save" disabled={processing}>
                            {processing ? <><IconSpinner />Creating…</> : <><IconSave />Create Portfolio Item</>}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
