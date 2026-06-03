import AdminLayout from '../layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSettingsPlugin() {
    const [plugins, setPlugins] = useState([
        { id: 2, name: 'Contact Form', description: 'Add contact forms to your website', active: false },
        { id: 3, name: 'Analytics', description: 'Track website visitors and analytics', active: true },
        { id: 4, name: 'Social Media', description: 'Integrate social media sharing', active: false },
    ]);

    const togglePlugin = (id) => {
        setPlugins(plugins.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    return (
        <AdminLayout title="Plugins">
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

                .plugin-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 0.75rem;
                    transition: all 0.2s;
                }
                .plugin-item:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 2px 8px rgba(59,130,246,0.1);
                }
                .plugin-info {
                    flex: 1;
                }
                .plugin-name {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 0.25rem;
                }
                .plugin-desc {
                    font-size: 0.8rem;
                    color: #64748b;
                }
                .toggle-switch {
                    position: relative;
                    width: 48px;
                    height: 26px;
                    background: #e5e7eb;
                    border-radius: 13px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .toggle-switch.active {
                    background: #3b82f6;
                }
                .toggle-knob {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                .toggle-switch.active .toggle-knob {
                    transform: translateX(22px);
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="gs-page-header">
                <div>
                    <div className="gs-title">Plugins</div>
                    <div className="gs-subtitle">Manage your website plugins</div>
                </div>
            </div>

            <div className="gs-card">
                <div className="gs-section-label">
                    <span className="pink">AVAILABLE</span>{' '}
                    <span className="gray">PLUGINS</span>
                </div>

                {plugins.map(plugin => (
                    <div key={plugin.id} className="plugin-item">
                        <div className="plugin-info">
                            <div className="plugin-name">{plugin.name}</div>
                            <div className="plugin-desc">{plugin.description}</div>
                        </div>
                        <div
                            className={`toggle-switch ${plugin.active ? 'active' : ''}`}
                            onClick={() => togglePlugin(plugin.id)}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
