import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsFooter({ footer }) {
    const [form, setForm] = useState({
        facebook: footer?.facebook ?? '',
        twitter: footer?.twitter ?? '',
        linkedin: footer?.linkedin ?? '',
        youtube: footer?.youtube ?? '',
        instagram: footer?.instagram ?? '',
        footer_text: footer?.footer_text ?? '',
        terms_condition: footer?.terms_condition ?? '',
        impressum: footer?.impressum ?? '',
        privacy_policy: footer?.privacy_policy ?? '',
        footer_logo: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(footer?.footer_logo ? `/uploads/settings/${footer.footer_logo}` : null);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleAssetChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setLogoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
        set('footer_logo', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('facebook', form.facebook);
        formData.append('twitter', form.twitter);
        formData.append('linkedin', form.linkedin);
        formData.append('youtube', form.youtube);
        formData.append('instagram', form.instagram);
        formData.append('footer_text', form.footer_text);
        formData.append('terms_condition', form.terms_condition);
        formData.append('impressum', form.impressum);
        formData.append('privacy_policy', form.privacy_policy);
        if (form.footer_logo) {
            formData.append('footer_logo', form.footer_logo);
        }

        router.post('/admin/footer', formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setLoading(false);
                router.reload({ preserveScroll: true });
            },
            onError: (err) => {
                setErrors(err);
                setLoading(false);
            },
        });
    };

    return (
        <AdminLayout title="Footer Setting">
            <style>{`
                .page-container { max-width: 1140px; width: 100%; margin: 0 auto; padding: 1.8rem 1rem 2.5rem; }
                .page-panel { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 18px 60px rgba(15,23,42,0.06); border: 1px solid #e5e7eb; }
                .page-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .page-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.25rem;
                }
                .page-subtitle {
                    font-size: 0.95rem;
                    color: #2563eb;
                }
                .card {
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 12px 40px rgba(15,23,42,0.04);
                    border: 1px solid #f1f5f9;
                }
                .section-label {
                    padding: 1.5rem 1.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #94a3b8;
                }
                .section-label .pink {
                    color: #e53e3e;
                }
                .form-container {
                    padding: 0 1.5rem 1.5rem;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    color: #0f172a;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    background: #f8fafc;
                }
                .form-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
                }
                .form-textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                .asset-box {
                    width: 90px;
                    height: 90px;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    margin-top: 0.5rem;
                    cursor: pointer;
                }
                .asset-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 6px;
                }
                .asset-edit {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.9);
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 0.7rem;
                    color: #64748b;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                }
                .asset-placeholder {
                    color: #d1d5db;
                    font-size: 2rem;
                }
                .btn-submit {
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    padding: 0.85rem 1.65rem;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
                }
                .btn-submit:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(37,99,235,0.22);
                }
                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .form-error {
                    font-size: 0.8rem;
                    color: #dc2626;
                    margin-top: 0.35rem;
                }
            `}</style>

            <div className="page-container">
                <div className="page-panel">
                    <div className="page-header">
                        <div>
                            <div className="page-title">Footer Setting</div>
                            <div className="page-subtitle">Add Footer Settings</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-label">
                            <span className="pink">FOOTER</span> SETTING
                        </div>

                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Footer Logo</label>
                                    <div 
                                        className="asset-box" 
                                        onClick={() => document.getElementById('footer-logo-file').click()}
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Footer Logo Preview" />
                                        ) : (
                                            <span className="asset-placeholder">🖼</span>
                                        )}
                                        <span className="asset-edit" title="Upload Footer Logo">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </span>
                                        <input
                                            id="footer-logo-file"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAssetChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Facebook URL</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.facebook}
                                            onChange={e => set('facebook', e.target.value)}
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Twitter URL</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.twitter}
                                            onChange={e => set('twitter', e.target.value)}
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.linkedin}
                                            onChange={e => set('linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">YouTube URL</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.youtube}
                                            onChange={e => set('youtube', e.target.value)}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Instagram URL</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.instagram}
                                            onChange={e => set('instagram', e.target.value)}
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Footer Text</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={form.footer_text}
                                        onChange={e => set('footer_text', e.target.value)}
                                        placeholder="Footer description..."
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Terms & Conditions</label>
                                        <textarea
                                            className="form-input form-textarea"
                                            value={form.terms_condition}
                                            onChange={e => set('terms_condition', e.target.value)}
                                            placeholder="Terms & conditions..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Impressum</label>
                                        <textarea
                                            className="form-input form-textarea"
                                            value={form.impressum}
                                            onChange={e => set('impressum', e.target.value)}
                                            placeholder="Impressum..."
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Privacy Policy</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={form.privacy_policy}
                                        onChange={e => set('privacy_policy', e.target.value)}
                                        placeholder="Privacy policy..."
                                    />
                                </div>

                                <div style={{ marginTop: '0.5rem' }}>
                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'SUBMIT'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
