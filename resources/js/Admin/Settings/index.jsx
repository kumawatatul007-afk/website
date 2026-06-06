import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState, useRef } from 'react';

/* ── Tag Input Component ── */
function TagInput({ tags, onChange, placeholder, color = 'pink' }) {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    const addTag = (val) => {
        const trimmed = val.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput('');
    };

    const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx));

    const handleKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length) {
            removeTag(tags.length - 1);
        }
    };

    const chipBg   = color === 'pink' ? '#ff3d8b' : '#00bcd4';
    const chipText = '#fff';

    return (
        <div
            className="tag-input-box"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag, i) => (
                <span key={i} className="tag-chip" style={{ background: chipBg, color: chipText }}>
                    {tag}
                    <button type="button" className="tag-remove" onClick={() => removeTag(i)}>×</button>
                </span>
            ))}
            <input
                ref={inputRef}
                className="tag-inner-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                onBlur={() => input && addTag(input)}
                placeholder={tags.length === 0 ? placeholder : ''}
            />
        </div>
    );
}

/* ── Main Component ── */
export default function AdminSettingsIndex({ setting }) {
    const [form, setForm] = useState({
        website_title:    setting?.website_title ?? '',
        email:            setting?.email         ?? '',
        phone:            setting?.phone         ?? '',
        timing:           setting?.timing        ?? '',
        preloader:        setting?.preloader      ?? '0',
        address:          setting?.address       ?? '',
        logo:             setting?.logo          ?? '',
        favicon:          setting?.favicon       ?? '',
    });

    // Tags state — split comma-separated strings into arrays
    const [keywords, setKeywords] = useState(
        setting?.strating_keyword
            ? setting.strating_keyword.split(',').map(s => s.trim()).filter(Boolean)
            : []
    );
    const [serviceKeywords, setServiceKeywords] = useState(
        setting?.service_keyword
            ? setting.service_keyword.split(',').map(s => s.trim()).filter(Boolean)
            : []
    );
    const [locations, setLocations] = useState(
        setting?.locations
            ? setting.locations.split(',').map(s => s.trim()).filter(Boolean)
            : []
    );

    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview]       = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [logoFile, setLogoFile]             = useState(null);
    const [faviconFile, setFaviconFile]       = useState(null);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleAssetChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            if (type === 'logo') { setLogoPreview(ev.target.result); setLogoFile(file); }
            else                 { setFaviconPreview(ev.target.result); setFaviconFile(file); }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('website_title', form.website_title);
        formData.append('email', form.email);
        formData.append('phone', form.phone);
        formData.append('timing', form.timing);
        formData.append('preloader', form.preloader);
        formData.append('address', form.address);
        formData.append('strating_keyword', keywords.join(','));
        formData.append('service_keyword', serviceKeywords.join(','));
        formData.append('locations', locations.join(','));

        if (logoFile) {
            formData.append('logo', logoFile);
        }
        if (faviconFile) {
            formData.append('favicon', faviconFile);
        }

        router.post('/admin/settings', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError: (err) => { setErrors(err); setLoading(false); },
        });
    };

    // Image base URL for logo/favicon
    const IMG_BASE = 'https://thenikhilsharma.in/public/uploads/settings/';

    return (
        <AdminLayout title="General Setting">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-panel { background: #ffffff; border-radius: 24px; padding: 1.4rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }

                /* ── Page header ── */
                .gs-page-header {
                    display: flex; align-items: flex-start; justify-content: space-between;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }
                .gs-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .gs-subtitle { font-size: 0.82rem; color: #2563eb; font-weight: 500; margin-top: 0.2rem; }

                /* ── White card ── */
                .gs-card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
                    padding: 1.75rem 1.75rem 2rem;
                    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both;
                }

                /* ── Section label ── */
                .gs-section-label {
                    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
                    margin-bottom: 1.5rem;
                }
                .gs-section-label .pink { color: #e91e8c; }
                .gs-section-label .gray { color: #94a3b8; }

                /* ── 2-col grid ── */
                .gs-grid-2 {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
                    margin-bottom: 1.25rem;
                }
                @media (max-width: 700px) { .gs-grid-2 { grid-template-columns: 1fr; } }

                /* ── Form label ── */
                .gs-label {
                    display: block; font-size: 0.82rem; font-weight: 500;
                    color: #374151; margin-bottom: 0.45rem;
                }

                /* ── Input with icon ── */
                .gs-input-wrap {
                    display: flex; align-items: center;
                    border: 1px solid #d1d5db; border-radius: 6px;
                    overflow: hidden; background: #fff;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .gs-input-wrap:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .gs-input-icon {
                    width: 42px; display: flex; align-items: center; justify-content: center;
                    color: #9ca3af; flex-shrink: 0; border-right: 1px solid #e5e7eb;
                    background: #f9fafb; height: 42px;
                }
                .gs-input {
                    flex: 1; padding: 0.6rem 0.875rem; border: none; outline: none;
                    font-size: 0.875rem; color: #374151; background: transparent;
                    font-family: inherit;
                }
                .gs-input::placeholder { color: #9ca3af; }

                /* ── Select ── */
                .gs-select-wrap {
                    position: relative;
                    border: 1px solid #d1d5db; border-radius: 6px;
                    background: #fff; overflow: hidden;
                    transition: border-color 0.15s;
                }
                .gs-select-wrap:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .gs-select {
                    width: 100%; padding: 0.65rem 2.5rem 0.65rem 0.875rem;
                    border: none; outline: none; font-size: 0.875rem;
                    color: #374151; background: transparent; appearance: none;
                    font-family: inherit; cursor: pointer;
                }
                .gs-select-arrow {
                    position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%);
                    pointer-events: none; color: #9ca3af;
                }

                /* ── Tag input ── */
                .tag-input-box {
                    min-height: 80px; border: 1px solid #d1d5db; border-radius: 6px;
                    padding: 0.5rem 0.625rem; display: flex; flex-wrap: wrap;
                    gap: 0.4rem; cursor: text; background: #fff;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    align-content: flex-start;
                }
                .tag-input-box:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .tag-chip {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    padding: 0.25rem 0.65rem; border-radius: 20px;
                    font-size: 0.75rem; font-weight: 600; white-space: nowrap;
                }
                .tag-remove {
                    background: none; border: none; cursor: pointer;
                    color: inherit; font-size: 1rem; line-height: 1;
                    padding: 0; opacity: 0.8; display: flex; align-items: center;
                }
                .tag-remove:hover { opacity: 1; }
                .tag-inner-input {
                    border: none; outline: none; font-size: 0.8rem;
                    color: #374151; background: transparent; min-width: 120px;
                    flex: 1; padding: 0.2rem 0.25rem; font-family: inherit;
                }
                .tag-inner-input::placeholder { color: #9ca3af; }

                /* ── Textarea ── */
                .gs-textarea {
                    width: 100%; padding: 0.65rem 0.875rem;
                    border: 1px solid #d1d5db; border-radius: 6px;
                    font-size: 0.875rem; color: #374151; outline: none;
                    background: #fff; box-sizing: border-box; resize: vertical;
                    min-height: 80px; font-family: inherit; line-height: 1.5;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .gs-textarea:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }

                /* ── Logo / Favicon ── */
                .gs-assets-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
                    margin-bottom: 1.75rem;
                }
                @media (max-width: 700px) { .gs-assets-grid { grid-template-columns: 1fr; } }

                .gs-asset-box {
                    width: 90px; height: 90px; border-radius: 10px;
                    border: 1.5px solid #e2e8f0; background: #f8fafc;
                    display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden; margin-top: 0.5rem;
                }
                .gs-asset-box img {
                    width: 100%; height: 100%; object-fit: contain; padding: 6px;
                }
                .gs-asset-edit {
                    position: absolute; top: 4px; right: 4px;
                    width: 24px; height: 24px; border-radius: 50%;
                    background: rgba(255,255,255,0.9); border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; font-size: 0.7rem; color: #64748b;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                }
                .gs-asset-placeholder {
                    color: #d1d5db; font-size: 2rem;
                }

                /* ── Submit ── */
                .gs-submit-row { margin-top: 0.5rem; }
                .btn-submit {
                    background: #2563eb; color: #fff; border: none;
                    padding: 0.65rem 2rem; border-radius: 6px;
                    font-size: 0.875rem; font-weight: 700; cursor: pointer;
                    letter-spacing: 0.04em; text-transform: uppercase;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-submit:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
                .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

                .form-error { font-size: 0.72rem; color: #ef4444; margin-top: 0.3rem; }

                /* ── Divider ── */
                .gs-divider { border: none; border-top: 1px solid #f1f5f9; margin: 1.5rem 0; }

                /* ── Animations ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="page-container">
                <div className="page-panel">
                    {/* Page Header */}
                    <div className="gs-page-header">
                        <div>
                            <div className="gs-title">General Setting</div>
                            <div className="gs-subtitle">Add Settings</div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="gs-card">
                <div className="gs-section-label">
                    <span className="pink">GENERAL</span>{' '}
                    <span className="gray">SETTING</span>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Row 1: Website Title + Email */}
                    <div className="gs-grid-2">
                        <div>
                            <label className="gs-label">Website Title</label>
                            <div className="gs-input-wrap">
                                <span className="gs-input-icon">
                                    {/* credit-card icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                </span>
                                <input
                                    className="gs-input"
                                    value={form.website_title}
                                    onChange={e => set('website_title', e.target.value)}
                                    placeholder="Nikhil Sharma"
                                />
                            </div>
                            {errors.website_title && <div className="form-error">{errors.website_title}</div>}
                        </div>
                        <div>
                            <label className="gs-label">Email</label>
                            <div className="gs-input-wrap">
                                <span className="gs-input-icon">
                                    {/* mail icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    className="gs-input"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    placeholder="info@example.com"
                                />
                            </div>
                            {errors.email && <div className="form-error">{errors.email}</div>}
                        </div>
                    </div>

                    {/* Row 2: Phone + Timing */}
                    <div className="gs-grid-2">
                        <div>
                            <label className="gs-label">Phone No.</label>
                            <div className="gs-input-wrap">
                                <span className="gs-input-icon">
                                    {/* phone icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                                    </svg>
                                </span>
                                <input
                                    className="gs-input"
                                    value={form.phone}
                                    onChange={e => set('phone', e.target.value)}
                                    placeholder="+91 9999999999"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="gs-label">Timing</label>
                            <div className="gs-input-wrap">
                                <span className="gs-input-icon">
                                    {/* clock icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </span>
                                <input
                                    className="gs-input"
                                    value={form.timing}
                                    onChange={e => set('timing', e.target.value)}
                                    placeholder="Mon – Sat: 10am – 7pm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preloader */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="gs-label">Preloader</label>
                        <div className="gs-select-wrap">
                            <select
                                className="gs-select"
                                value={form.preloader}
                                onChange={e => set('preloader', e.target.value)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <span className="gs-select-arrow">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Starting Keyword + Locations — tag inputs */}
                    <div className="gs-grid-2" style={{ marginBottom: '1.25rem' }}>
                        <div>
                            <label className="gs-label">Starting Keyword</label>
                            <TagInput
                                tags={keywords}
                                onChange={setKeywords}
                                placeholder="Type keyword and press Enter..."
                                color="pink"
                            />
                        </div>
                        <div>
                            <label className="gs-label">Locations</label>
                            <TagInput
                                tags={locations}
                                onChange={setLocations}
                                placeholder="Enter Starting Keyword"
                                color="teal"
                            />
                        </div>
                    </div>

                    {/* Service Keywords — full width tag input */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="gs-label">
                            Service Keywords{' '}
                            <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.75rem' }}>
                                (shown in #SERVICES section on home page — e.g. "Best Website Design Near Me", "Top 10 Website Developer For Hire")
                            </span>
                        </label>
                        <TagInput
                            tags={serviceKeywords}
                            onChange={setServiceKeywords}
                            placeholder="Type service keyword and press Enter..."
                            color="teal"
                        />
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="gs-label">Address</label>
                        <textarea
                            className="gs-textarea"
                            rows={3}
                            value={form.address}
                            onChange={e => set('address', e.target.value)}
                            placeholder="118 Goverdhan Puri Galta gate Jaipur"
                        />
                    </div>

                    <hr className="gs-divider" />

                    {/* Logo + Favicon */}
                    <div className="gs-assets-grid">
                        <div>
                            <label className="gs-label">Logo</label>
                            <div className="gs-asset-box" onClick={() => document.getElementById('logo-file').click()} style={{ cursor: 'pointer' }}>
                                {logoPreview || form.logo ? (
                                    <img
                                        src={logoPreview || (IMG_BASE + form.logo)}
                                        alt="Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <span className="gs-asset-placeholder">🖼</span>
                                )}
                                <span className="gs-asset-edit" title="Upload logo">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </span>
                                <input
                                    id="logo-file"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={e => handleAssetChange(e, 'logo')}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="gs-label">Favicon</label>
                            <div className="gs-asset-box" onClick={() => document.getElementById('favicon-file').click()} style={{ cursor: 'pointer' }}>
                                {faviconPreview || form.favicon ? (
                                    <img
                                        src={faviconPreview || (IMG_BASE + form.favicon)}
                                        alt="Favicon"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <span className="gs-asset-placeholder">🖼</span>
                                )}
                                <span className="gs-asset-edit" title="Upload favicon">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </span>
                                <input
                                    id="favicon-file"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={e => handleAssetChange(e, 'favicon')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="gs-submit-row">
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Submit'}
                        </button>
                    </div>

                </form>
            </div>
                </div>
            </div>
        </AdminLayout>
    );
}
