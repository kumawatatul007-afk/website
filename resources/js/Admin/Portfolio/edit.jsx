import AdminLayout from '../layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

export default function AdminPortfolioEdit({ item, categories = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        title: item?.title || '',
        category_id: item?.category_id || '',
        image: '', // Changed from null to empty string
        clint_name: item?.clint_name || '',
        status: item?.status || 'Active',
        date: item?.date || '',
        website_link: item?.website_link || '',
        short_description: item?.short_description || '',
        description: item?.description || '',
        meta_keyword: item?.meta_keyword || '',
        meta_description: item?.meta_description || '',
        is_publish: item?.is_publish ?? 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Debug: Check what data we're sending
        console.log('Form data being submitted:', data);
        console.log('Title value:', data.title);
        console.log('Errors before submit:', errors);

        // Ensure title is not empty or just whitespace
        if (!data.title || data.title.trim() === '') {
            alert('Please enter a title');
            return;
        }

        // When uploading files with PUT, we need to use POST with _method=PUT
        // Inertia handles this automatically with forceFormData
        put(`/admin/portfolio/${item.id}`, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onError: (err) => {
                console.log('Submission errors:', err);
            },
            onSuccess: () => {
                console.log('Portfolio updated successfully');
            }
        });
    };

    return (
        <AdminLayout title="Edit Portfolio Item">
            <style>{`
                .form-card {
                    background:#fff;
                    border-radius:12px;
                    padding:2rem;
                    box-shadow:0 1px 4px rgba(0,0,0,0.06);
                    border:1px solid #f1f5f9;
                    width:100%;
                }

                .form-group {
                    margin-bottom:1.25rem;
                }

                .form-label {
                    display:block;
                    font-size:0.72rem;
                    font-weight:700;
                    color:#64748b;
                    text-transform:uppercase;
                    letter-spacing:0.08em;
                    margin-bottom:0.45rem;
                }

                .form-input {
                    width:100%;
                    padding:0.7rem 0.875rem;
                    border:1px solid #e2e8f0;
                    border-radius:8px;
                    font-size:0.875rem;
                    color:#0f172a;
                    outline:none;
                    transition:all .2s ease;
                    background:#fff;
                    box-sizing:border-box;
                }

                .form-input:focus {
                    border-color:#3b82f6;
                    box-shadow:0 0 0 3px rgba(59,130,246,0.1);
                }

                .form-input.err {
                    border-color:#ef4444;
                }

                .form-error {
                    color:#ef4444;
                    font-size:0.78rem;
                    margin-top:0.3rem;
                }

                .form-row {
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:1rem;
                }

                .section-label {
                    font-size:0.72rem;
                    font-weight:800;
                    color:#64748b;
                    text-transform:uppercase;
                    letter-spacing:0.12em;
                    margin:1.5rem 0 0.875rem;
                    padding-bottom:0.5rem;
                    border-bottom:1px solid #e2e8f0;
                }

                .btn-primary {
                    background:#2563eb;
                    color:#fff;
                    border:none;
                    padding:0.7rem 1.5rem;
                    border-radius:8px;
                    font-size:0.875rem;
                    font-weight:600;
                    cursor:pointer;
                }

                .btn-primary:hover:not(:disabled) {
                    background:#1d4ed8;
                }

                .btn-primary:disabled {
                    opacity:.6;
                    cursor:not-allowed;
                }

                .btn-cancel {
                    background:#f8fafc;
                    color:#374151;
                    border:1px solid #e2e8f0;
                    padding:0.7rem 1.5rem;
                    border-radius:8px;
                    font-size:0.875rem;
                    font-weight:600;
                    cursor:pointer;
                    text-decoration:none;
                }

                .btn-cancel:hover {
                    background:#f1f5f9;
                }

                .page-header {
                    display:flex;
                    align-items:center;
                    gap:1rem;
                    margin-bottom:1.5rem;
                }

                .image-preview {
                    width:160px;
                    height:100px;
                    object-fit:cover;
                    border-radius:10px;
                    border:1px solid #e5e7eb;
                    margin-bottom:10px;
                }

                @media (max-width:600px) {
                    .form-row {
                        grid-template-columns:1fr;
                    }
                }
            `}</style>

            <div className="page-header">
                <Link href="/admin/portfolio" className="btn-cancel">
                    ← Back
                </Link>

                <h2
                    style={{
                        fontSize:'1.1rem',
                        fontWeight:700,
                        color:'#0f172a'
                    }}
                >
                    Edit Portfolio Item
                </h2>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">
                            Title *
                        </label>

                        <input
                            type="text"
                            name="title"
                            required
                            className={`form-input ${errors.title ? 'err' : ''}`}
                            value={data.title}
                            onChange={(e)=>setData('title',e.target.value)}
                        />

                        {errors.title &&
                            <p className="form-error">
                                {errors.title}
                            </p>
                        }
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Category
                            </label>

                            <select
                                name="category_id"
                                className={`form-input ${errors.category_id ? 'err' : ''}`}
                                value={data.category_id}
                                onChange={(e)=>setData('category_id',e.target.value)}
                            >
                                <option value="">
                                    — Select Category —
                                </option>

                                {categories.map(category => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {errors.category_id &&
                                <p className="form-error">
                                    {errors.category_id}
                                </p>
                            }
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Status
                            </label>

                            <select
                                name="status"
                                className={`form-input ${errors.status ? 'err' : ''}`}
                                value={data.status}
                                onChange={(e)=>setData('status',e.target.value)}
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>

                            {errors.status &&
                                <p className="form-error">
                                    {errors.status}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">

                            <label className="form-label">
                                Portfolio Image
                            </label>

                            {item?.image && (
                                <img
                                    src={`/storage/uploads/portfolio/${item.image}`}
                                    alt="Portfolio"
                                    className="image-preview"
                                    onError={(e) => {
                                        // Try alternative path if first one fails
                                        e.target.onerror = null;
                                        e.target.src = `/uploads/portfolio/${item.image}`;
                                    }}
                                />
                            )}

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className={`form-input ${errors.image ? 'err' : ''}`}
                                onChange={(e)=>
                                    setData(
                                        'image',
                                        e.target.files[0]
                                    )
                                }
                            />

                            {errors.image &&
                                <p className="form-error">
                                    {errors.image}
                                </p>
                            }

                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Client Name
                            </label>

                            <input
                                type="text"
                                name="clint_name"
                                className={`form-input ${errors.clint_name ? 'err' : ''}`}
                                value={data.clint_name}
                                onChange={(e)=>setData('clint_name',e.target.value)}
                            />

                            {errors.clint_name &&
                                <p className="form-error">
                                    {errors.clint_name}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Website Link
                            </label>

                            <input
                                type="url"
                                name="website_link"
                                className={`form-input ${errors.website_link ? 'err' : ''}`}
                                placeholder="https://example.com"
                                value={data.website_link}
                                onChange={(e)=>setData('website_link',e.target.value)}
                            />

                            {errors.website_link &&
                                <p className="form-error">
                                    {errors.website_link}
                                </p>
                            }
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                className={`form-input ${errors.date ? 'err' : ''}`}
                                value={data.date ? data.date.split('T')[0] : ''}
                                onChange={(e)=>setData('date',e.target.value)}
                            />

                            {errors.date &&
                                <p className="form-error">
                                    {errors.date}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Short Description
                        </label>

                        <input
                            type="text"
                            name="short_description"
                            className={`form-input ${errors.short_description ? 'err' : ''}`}
                            value={data.short_description}
                            onChange={(e)=>setData('short_description',e.target.value)}
                        />

                        {errors.short_description &&
                            <p className="form-error">
                                {errors.short_description}
                            </p>
                        }
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Full Description
                        </label>

                        <textarea
                            name="description"
                            rows="5"
                            className={`form-input ${errors.description ? 'err' : ''}`}
                            value={data.description}
                            onChange={(e)=>setData('description',e.target.value)}
                        />

                        {errors.description &&
                            <p className="form-error">
                                {errors.description}
                            </p>
                        }
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Published
                        </label>

                        <select
                            name="is_publish"
                            className={`form-input ${errors.is_publish ? 'err' : ''}`}
                            value={data.is_publish}
                            onChange={(e)=>
                                setData(
                                    'is_publish',
                                    Number(e.target.value)
                                )
                            }
                        >
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>

                        {errors.is_publish &&
                            <p className="form-error">
                                {errors.is_publish}
                            </p>
                        }
                    </div>

                    <div className="section-label">
                        SEO / Meta
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Meta Description
                        </label>

                        <input
                            type="text"
                            name="meta_description"
                            className={`form-input ${errors.meta_description ? 'err' : ''}`}
                            value={data.meta_description}
                            onChange={(e)=>setData('meta_description',e.target.value)}
                        />

                        {errors.meta_description &&
                            <p className="form-error">
                                {errors.meta_description}
                            </p>
                        }
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Meta Keywords
                        </label>

                        <input
                            type="text"
                            name="meta_keyword"
                            className={`form-input ${errors.meta_keyword ? 'err' : ''}`}
                            value={data.meta_keyword}
                            onChange={(e)=>setData('meta_keyword',e.target.value)}
                        />

                        {errors.meta_keyword &&
                            <p className="form-error">
                                {errors.meta_keyword}
                            </p>
                        }
                    </div>

                    <div
                        style={{
                            display:'flex',
                            gap:'12px',
                            marginTop:'20px'
                        }}
                    >
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={processing}
                        >
                            {processing
                                ? 'Updating...'
                                : 'Update Portfolio'}
                        </button>

                        <Link
                            href="/admin/portfolio"
                            className="btn-cancel"
                        >
                            Cancel
                        </Link>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}