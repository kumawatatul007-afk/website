import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminServiceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        slug: '',
        price_range: '',
        description: '',
        features: [''],
        cta_text: '',
        sort_order: 0,
        is_active: true,
    });

    const addFeature = () => setData('features', [...data.features, '']);
    const removeFeature = (i) => setData('features', data.features.filter((_, idx) => idx !== i));
    const updateFeature = (i, val) => {
        const updated = [...data.features];
        updated[i] = val;
        setData('features', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out empty feature strings
        const cleaned = { ...data, features: data.features.filter(f => f.trim() !== '') };
        post('/admin/services', { data: cleaned });
    };

    return (
        <AdminLayout title="New Service">
            <style>{`
                .form-card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
                    padding: 2rem; max-width: 760px;
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
                .form-input, .form-textarea, .form-select {
                    padding: 0.65rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px;
                    font-size: 0.875rem; color: #374151; background: #fff; outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit;
                }
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .form-textarea { resize: vertical; min-height: 120px; }
                .error { font-size: 0.75rem; color: #dc2626; margin-top: 0.2rem; }
                .features-list { display: flex; flex-direction: column; gap: 0.6rem; }
                .feature-row { display: flex; gap: 0.5rem; align-items: center; }
                .feature-row input { flex: 1; }
                .btn-icon {
                    width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer;
                    display: inline-flex; align-items: center; justify-content: center;
                    font-size: 1rem; font-weight: 700; transition: background 0.15s;
                    flex-shrink: 0;
                }
                .btn-add-feature { background: #eff6ff; color: #2563eb; }
                .btn-add-feature:hover { background: #dbeafe; }
                .btn-remove-feature { background: #fef2f2; color: #dc2626; }
                .btn-remove-feature:hover { background: #fee2e2; }
                .btn-add-row { background: none; border: 1.5px dashed #cbd5e1; color: #64748b; border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 0.4rem; transition: border-color 0.15s, color 0.15s; }
                .btn-add-row:hover { border-color: #3b82f6; color: #2563eb; }
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
                            <input className="form-input" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Web Development" />
                            {errors.title && <span className="error">{errors.title}</span>}
                        </div>

                        {/* Slug */}
                        <div className="form-group">
                            <label>Slug (URL anchor)</label>
                            <input className="form-input" value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="auto-generated if empty" />
                            {errors.slug && <span className="error">{errors.slug}</span>}
                        </div>

                        {/* Subtitle */}
                        <div className="form-group full">
                            <label>Subtitle</label>
                            <input className="form-input" value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} placeholder="e.g. Fast, secure websites built to rank and convert" />
                            {errors.subtitle && <span className="error">{errors.subtitle}</span>}
                        </div>

                        {/* Price Range */}
                        <div className="form-group">
                            <label>Price Range</label>
                            <input className="form-input" value={data.price_range} onChange={e => setData('price_range', e.target.value)} placeholder="e.g. ₹15,000 – ₹1,50,000" />
                            {errors.price_range && <span className="error">{errors.price_range}</span>}
                        </div>

                        {/* CTA Text */}
                        <div className="form-group">
                            <label>CTA Button Text</label>
                            <input className="form-input" value={data.cta_text} onChange={e => setData('cta_text', e.target.value)} placeholder="e.g. Get a free web development quote" />
                            {errors.cta_text && <span className="error">{errors.cta_text}</span>}
                        </div>

                        {/* Description */}
                        <div className="form-group full">
                            <label>Description</label>
                            <textarea className="form-textarea" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Detailed description of this service..." rows={6} />
                            {errors.description && <span className="error">{errors.description}</span>}
                        </div>

                        {/* Features */}
                        <div className="form-group full">
                            <label>Features (What's Included)</label>
                            <div className="features-list">
                                {data.features.map((f, i) => (
                                    <div className="feature-row" key={i}>
                                        <input
                                            className="form-input"
                                            value={f}
                                            onChange={e => updateFeature(i, e.target.value)}
                                            placeholder={`Feature ${i + 1}`}
                                        />
                                        {data.features.length > 1 && (
                                            <button type="button" className="btn-icon btn-remove-feature" onClick={() => removeFeature(i)} title="Remove">×</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn-add-row" onClick={addFeature}>+ Add Feature</button>
                            </div>
                            {errors.features && <span className="error">{errors.features}</span>}
                        </div>

                        {/* Sort Order */}
                        <div className="form-group">
                            <label>Sort Order</label>
                            <input className="form-input" type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} />
                            {errors.sort_order && <span className="error">{errors.sort_order}</span>}
                        </div>

                        {/* Active toggle */}
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                            <label>Status</label>
                            <div className="toggle-row">
                                <label className="toggle">
                                    <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                    <span className="toggle-slider" />
                                </label>
                                <span className="toggle-label">{data.is_active ? 'Active (visible on site)' : 'Inactive (hidden)'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving…' : 'Create Service'}
                        </button>
                        <Link href="/admin/services" className="btn-cancel">Close</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
