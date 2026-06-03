import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function AdminSettingsTags() {
    const [tags, setTags] = useState(['Design', 'Development', 'Marketing', 'Social Media']);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    const addTag = (val) => {
        const trimmed = val.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setInput('');
    };

    const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

    const handleKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <AdminLayout title="Tags">
            <style>{`
                .gs-page-header {
                    display: flex; align-items: flex-start; justify-content: space-between;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }
                .gs-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .gs-subtitle { font-size: 0.82rem; color: #2563eb; font-weight: 500; margin-top: 0.2rem; }

                .gs-card {
                    background: #fff; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
                    padding: 1.75rem 1.75rem 2rem;
                    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s both;
                }

                .gs-section-label {
                    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
                    margin-bottom: 1.5rem;
                }
                .gs-section-label .pink { color: #e91e8c; }
                .gs-section-label .gray { color: #94a3b8; }

                .tag-input-box {
                    min-height: 120px; border: 1px solid #d1d5db; border-radius: 8px;
                    padding: 0.75rem; display: flex; flex-wrap: wrap;
                    gap: 0.5rem; cursor: text; background: #fff;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    align-content: flex-start;
                }
                .tag-input-box:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .tag-chip {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.4rem 0.8rem; border-radius: 20px;
                    font-size: 0.8rem; font-weight: 600; white-space: nowrap;
                    background: linear-gradient(135deg, #2563eb, #7c3aed);
                    color: #fff;
                }
                .tag-remove {
                    background: none; border: none; cursor: pointer;
                    color: inherit; font-size: 1rem; line-height: 1;
                    padding: 0; opacity: 0.8; display: flex; align-items: center;
                }
                .tag-remove:hover { opacity: 1; }
                .tag-inner-input {
                    border: none; outline: none; font-size: 0.875rem;
                    color: #374151; background: transparent; min-width: 150px;
                    flex: 1; padding: 0.4rem; font-family: inherit;
                }
                .tag-inner-input::placeholder { color: #9ca3af; }

                .tags-list {
                    margin-top: 1.5rem;
                }
                .tags-list-title {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #64748b;
                    margin-bottom: 0.75rem;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="gs-page-header">
                <div>
                    <div className="gs-title">Tags</div>
                    <div className="gs-subtitle">Manage your content tags</div>
                </div>
            </div>

            <div className="gs-card">
                <div className="gs-section-label">
                    <span className="pink">TAGS</span>{' '}
                    <span className="gray">MANAGEMENT</span>
                </div>

                <div
                    className="tag-input-box"
                    onClick={() => inputRef.current?.focus()}
                >
                    {tags.map((tag, i) => (
                        <span key={i} className="tag-chip">
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
                        placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : ''}
                    />
                </div>

                <div className="tags-list">
                    <div className="tags-list-title">Current Tags ({tags.length})</div>
                </div>
            </div>
        </AdminLayout>
    );
}
