import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

function makeSlug(value) {
    return value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const TYPE_OPTIONS = ['blog', 'service'];

export default function AdminCategoryEdit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name:     category.name     ?? '',
        text_for: category.text_for ?? 'blog',
        slug:     category.slug     ?? '',
    });

    const [clientErrors, setClientErrors] = useState({});
    const [autoSlug, setAutoSlug]         = useState(category.slug ?? '');

    const nameRef    = useRef(null);
    const typeRef    = useRef(null);

    // Merge server + client errors
    const allErrors = { ...clientErrors, ...errors };

    // Auto-generate slug from name
    useEffect(() => {
        const nextSlug = makeSlug(data.name);
        if (nextSlug && (!data.slug || data.slug === autoSlug)) {
            setData('slug', nextSlug);
            setAutoSlug(nextSlug);
        }
    }, [data.name]);

    // Scroll to first server-side error
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setTimeout(() => {
                if (errors.name && nameRef.current) {
                    nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    nameRef.current.focus();
                } else if (errors.text_for && typeRef.current) {
                    typeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    typeRef.current.focus();
                }
            }, 200);
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation
        const newErrors = {};
        if (!data.name || !data.name.trim()) {
            newErrors.name = 'Name is required.';
        }
        if (!data.text_for) {
            newErrors.text_for = 'Type is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            setTimeout(() => {
                if (newErrors.name && nameRef.current) {
                    nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    nameRef.current.focus();
                } else if (newErrors.text_for && typeRef.current) {
                    typeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    typeRef.current.focus();
                }
            }, 50);
            return;
        }

        setClientErrors({});
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AdminLayout title="Edit Category">
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .form-card {
                    background: #fff; border-radius: 16px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.06);
                    border: 1px solid #f1f5f9;
                    padding: 2rem; max-width: 640px;
                    animation: fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
                }
                .form-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;
                }
                .form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
                .id-badge {
                    display: inline-block; background: #f1f5f9; color: #64748b;
                    font-size: 0.72rem; font-weight: 600;
                    padding: 0.2rem 0.6rem; border-radius: 6px;
                    margin-top: 0.25rem;
                }
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
                label {
                    font-size: 0.78rem; font-weight: 600; color: #374151;
                    letter-spacing: 0.04em; text-transform: uppercase;
                }
                .form-input, .form-select {
                    padding: 0.7rem 0.875rem; border: 1.5px solid #e2e8f0;
                    border-radius: 10px; font-size: 0.875rem; color: #374151;
                    background: #fff; outline: none; font-family: inherit;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .form-input:focus, .form-select:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .form-input.err, .form-select.err {
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220,38,38,0.10);
                }
                .form-select { appearance: none; -webkit-appearance: none; cursor: pointer; }
                .hint { font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem; }
                .error { font-size: 0.75rem; color: #dc2626; margin-top: 0.25rem; }
                .form-actions { display: flex; gap: 0.75rem; margin-top: 1.75rem; flex-wrap: wrap; }
                .btn-primary {
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: #fff; border: none; padding: 0.75rem 1.75rem;
                    border-radius: 10px; font-size: 0.875rem; font-weight: 600;
                    cursor: pointer; font-family: inherit;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.5);
                }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel {
                    background: #f1f5f9; color: #374151; border: none;
                    padding: 0.75rem 1.5rem; border-radius: 10px;
                    font-size: 0.875rem; font-weight: 600; cursor: pointer;
                    text-decoration: none; display: inline-flex; align-items: center;
                    font-family: inherit; transition: background 0.15s;
                }
                .btn-cancel:hover { background: #e2e8f0; }
            `}</style>

            <div className="form-card">
                <div className="form-header">
                    <div>
                        <h2 className="form-title">Edit Category</h2>
                        <div className="id-badge">ID: {category.id}</div>
                    </div>
                    <Link href="/admin/categories" className="btn-cancel">← Back</Link>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    {/* Name */}
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            ref={nameRef}
                            className={`form-input ${allErrors.name ? 'err' : ''}`}
                            value={data.name}
                            onChange={e => {
                                setData('name', e.target.value);
                                if (clientErrors.name) setClientErrors(prev => ({ ...prev, name: '' }));
                            }}
                            placeholder="e.g. Web Development"
                        />
                        {allErrors.name && <span className="error">{allErrors.name}</span>}
                    </div>

                    {/* Type */}
                    <div className="form-group">
                        <label>Type *</label>
                        <select
                            ref={typeRef}
                            className={`form-select ${allErrors.text_for ? 'err' : ''}`}
                            value={data.text_for}
                            onChange={e => {
                                setData('text_for', e.target.value);
                                if (clientErrors.text_for) setClientErrors(prev => ({ ...prev, text_for: '' }));
                            }}
                            style={{
                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                paddingRight: '2.5rem',
                            }}
                        >
                            <option value="">— Select type —</option>
                            {TYPE_OPTIONS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <span className="hint">Which section does this category belong to?</span>
                        {allErrors.text_for && <span className="error">{allErrors.text_for}</span>}
                    </div>

                    {/* Slug */}
                    <div className="form-group">
                        <label>Slug (URL)</label>
                        <input
                            className={`form-input ${allErrors.slug ? 'err' : ''}`}
                            value={data.slug}
                            onChange={e => {
                                setData('slug', e.target.value);
                                setAutoSlug('');
                            }}
                            placeholder="e.g. web-development"
                        />
                        <span className="hint">Leave empty to auto-generate from name</span>
                        {allErrors.slug && <span className="error">{allErrors.slug}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving…' : 'Update Category'}
                        </button>
                        <Link href="/admin/categories" className="btn-cancel">Cancel</Link>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}