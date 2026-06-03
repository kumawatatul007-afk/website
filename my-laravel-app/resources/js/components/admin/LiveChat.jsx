import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

/* ── Floating Live Chat Widget ─────────────────────────────────────────── */
export default function LiveChat() {
    const [open,      setOpen]      = useState(false);
    const [messages,  setMessages]  = useState([]);
    const [unread,    setUnread]    = useState(0);
    const [loading,   setLoading]   = useState(false);
    const [reply,     setReply]     = useState('');
    const [sending,   setSending]   = useState(false);
    const [mounted,   setMounted]   = useState(false);
    const bodyRef  = useRef(null);
    const inputRef = useRef(null);

    /* Initial mount animation */
    useEffect(() => { setTimeout(() => setMounted(true), 600); }, []);

    /* Fetch messages */
    const fetchMsgs = () => {
        setLoading(true);
        fetch('/admin/notifications')
            .then(r => r.json())
            .then(data => {
                setMessages(data.notifications || []);
                setUnread(data.unread_count || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMsgs();
        const t = setInterval(fetchMsgs, 45000);
        return () => clearInterval(t);
    }, []);

    /* Scroll to bottom when opened */
    useEffect(() => {
        if (open && bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
        if (open) { setTimeout(() => inputRef.current?.focus(), 100); }
    }, [open, messages]);

    const handleSend = () => {
        if (!reply.trim()) return;
        setSending(true);
        setTimeout(() => {
            setReply('');
            setSending(false);
        }, 900);
    };

    const fmtTime = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const fmtDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <>
            <style>{`
                /* ── Live Chat Widget ─────────────────────── */
                @keyframes lcBounceIn {
                    0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
                    60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes lcSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes lcPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
                    50%      { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
                }
                @keyframes lcBadge {
                    0%,100% { transform: scale(1); }
                    50%      { transform: scale(1.25); }
                }
                @keyframes lcSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes lcDotPulse {
                    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
                }

                .lc-fab {
                    position: fixed;
                    bottom: 1.75rem;
                    right: 1.75rem;
                    z-index: 8888;
                    animation: ${mounted ? 'lcBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none'};
                }
                .lc-btn {
                    width: 56px; height: 56px;
                    border-radius: 18px;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff;
                    box-shadow: 0 8px 28px rgba(99,102,241,0.48), 0 2px 8px rgba(0,0,0,0.12);
                    transition: transform 0.18s, box-shadow 0.18s;
                    animation: lcPulse 2.5s ease infinite;
                    position: relative;
                }
                .lc-btn:hover {
                    transform: translateY(-3px) scale(1.06);
                    box-shadow: 0 14px 38px rgba(99,102,241,0.6), 0 4px 12px rgba(0,0,0,0.14);
                }
                .lc-btn-open { animation: none; }

                .lc-badge {
                    position: absolute;
                    top: -6px; right: -6px;
                    min-width: 20px; height: 20px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: #fff; font-size: 0.65rem; font-weight: 800;
                    display: flex; align-items: center; justify-content: center;
                    padding: 0 5px;
                    border: 2px solid #fff;
                    animation: lcBadge 1.5s ease infinite;
                }

                .lc-panel {
                    position: fixed;
                    bottom: 5.5rem;
                    right: 1.75rem;
                    z-index: 8887;
                    width: 360px;
                    max-height: 520px;
                    border-radius: 22px;
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    background: #fff;
                    box-shadow:
                        0 0 0 1px rgba(15,23,42,0.06),
                        0 8px 32px rgba(15,23,42,0.12),
                        0 32px 80px rgba(15,23,42,0.1);
                    animation: lcSlideUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
                }

                .lc-header {
                    padding: 1.1rem 1.25rem;
                    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
                    display: flex; align-items: center; gap: 0.875rem;
                    flex-shrink: 0;
                }
                .lc-avatar {
                    width: 40px; height: 40px; border-radius: 13px;
                    background: rgba(255,255,255,0.22);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem; font-weight: 800; color: #fff;
                    flex-shrink: 0;
                    border: 1.5px solid rgba(255,255,255,0.3);
                }
                .lc-header-info { flex: 1; min-width: 0; }
                .lc-header-name { font-size: 0.9rem; font-weight: 800; color: #fff; }
                .lc-header-status {
                    display: flex; align-items: center; gap: 0.35rem;
                    font-size: 0.7rem; color: rgba(255,255,255,0.7); margin-top: 2px;
                }
                .lc-status-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #4ade80;
                    animation: lcDotPulse 2s ease infinite;
                }
                .lc-close-btn {
                    width: 30px; height: 30px; border-radius: 9px;
                    background: rgba(255,255,255,0.18); border: none; cursor: pointer;
                    color: rgba(255,255,255,0.8);
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s;
                    flex-shrink: 0;
                }
                .lc-close-btn:hover { background: rgba(255,255,255,0.3); color: #fff; }

                .lc-body {
                    flex: 1; overflow-y: auto; padding: 1rem;
                    display: flex; flex-direction: column; gap: 0.75rem;
                    background: #fafbff;
                    min-height: 0;
                }
                .lc-body::-webkit-scrollbar { width: 4px; }
                .lc-body::-webkit-scrollbar-track { background: transparent; }
                .lc-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }

                .lc-empty {
                    text-align: center; padding: 2.5rem 1rem;
                    color: #94a3b8;
                }
                .lc-empty-ico { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5; }
                .lc-empty-txt { font-size: 0.82rem; font-weight: 500; }

                .lc-msg {
                    display: flex; gap: 0.6rem; align-items: flex-start;
                }
                .lc-msg-av {
                    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 800; color: #fff;
                }
                .lc-msg-body { flex: 1; min-width: 0; }
                .lc-msg-meta {
                    display: flex; align-items: center; gap: 0.5rem;
                    margin-bottom: 4px;
                }
                .lc-msg-name { font-size: 0.78rem; font-weight: 700; color: #0f172a; }
                .lc-msg-time { font-size: 0.65rem; color: #b0bec8; font-weight: 500; }
                .lc-msg-unread {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #6366f1; flex-shrink: 0;
                }
                .lc-msg-bubble {
                    background: #fff; border: 1px solid #f1f5f9;
                    border-radius: 4px 12px 12px 12px;
                    padding: 0.65rem 0.875rem;
                    font-size: 0.8rem; color: #475569; line-height: 1.55;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.06);
                }
                .lc-msg-link {
                    display: inline-flex; align-items: center; gap: 4px;
                    margin-top: 5px; font-size: 0.72rem; font-weight: 600;
                    color: #6366f1; text-decoration: none;
                    transition: color 0.15s;
                }
                .lc-msg-link:hover { color: #4f46e5; }

                .lc-loader {
                    display: flex; justify-content: center; padding: 1.25rem;
                }
                .lc-spin {
                    width: 22px; height: 22px;
                    border: 2.5px solid #e2e8f0;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: lcSpin 0.7s linear infinite;
                }

                .lc-tabs {
                    display: flex; gap: 0; flex-shrink: 0;
                    border-bottom: 1px solid #f1f5f9;
                    background: #fff;
                }
                .lc-tab {
                    flex: 1; padding: 0.7rem 1rem;
                    font-size: 0.75rem; font-weight: 700;
                    color: #94a3b8; background: none; border: none;
                    cursor: pointer; text-align: center;
                    border-bottom: 2px solid transparent;
                    transition: all 0.15s;
                    letter-spacing: 0.04em;
                }
                .lc-tab.active { color: #6366f1; border-bottom-color: #6366f1; }

                .lc-footer {
                    padding: 0.875rem 1rem;
                    border-top: 1px solid #f1f5f9;
                    display: flex; gap: 0.5rem; align-items: center;
                    background: #fff; flex-shrink: 0;
                }
                .lc-input {
                    flex: 1; padding: 0.65rem 0.875rem;
                    border: 1.5px solid #e8ecf2; border-radius: 12px;
                    font-size: 0.82rem; font-family: inherit;
                    color: #0f172a; background: #fafbff;
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s;
                }
                .lc-input::placeholder { color: #c8d1dc; }
                .lc-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .lc-send-btn {
                    width: 38px; height: 38px; border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.35);
                    transition: all 0.15s;
                }
                .lc-send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.5); }
                .lc-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                .lc-view-all {
                    display: flex; align-items: center; justify-content: center;
                    padding: 0.65rem; border-top: 1px solid #f1f5f9;
                    background: linear-gradient(180deg, transparent 0%, #fafbff 100%);
                    flex-shrink: 0;
                }
                .lc-view-link {
                    font-size: 0.75rem; font-weight: 700; color: #6366f1;
                    text-decoration: none; display: flex; align-items: center; gap: 0.3rem;
                    transition: color 0.15s;
                }
                .lc-view-link:hover { color: #4f46e5; }

                @media (max-width: 480px) {
                    .lc-panel { width: calc(100vw - 2rem); right: 1rem; }
                    .lc-fab   { bottom: 1.25rem; right: 1.25rem; }
                }
            `}</style>

            {/* ── FAB button ── */}
            <div className="lc-fab">
                <button
                    className={`lc-btn ${open ? 'lc-btn-open' : ''}`}
                    onClick={() => setOpen(o => !o)}
                    title={open ? 'Close messages' : 'View messages'}
                >
                    {open ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    )}
                    {!open && unread > 0 && (
                        <span className="lc-badge">{unread > 9 ? '9+' : unread}</span>
                    )}
                </button>
            </div>

            {/* ── Chat Panel ── */}
            {open && (
                <div className="lc-panel">

                    {/* Header */}
                    <div className="lc-header">
                        <div className="lc-avatar">N</div>
                        <div className="lc-header-info">
                            <div className="lc-header-name">Live Messages</div>
                            <div className="lc-header-status">
                                <div className="lc-status-dot" />
                                {unread > 0 ? `${unread} unread` : 'All caught up'}
                            </div>
                        </div>
                        <button className="lc-close-btn" onClick={() => setOpen(false)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>

                    {/* Message list */}
                    <div className="lc-body" ref={bodyRef}>
                        {loading ? (
                            <div className="lc-loader">
                                <div className="lc-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="lc-empty">
                                <div className="lc-empty-ico">💬</div>
                                <div className="lc-empty-txt">No messages yet</div>
                            </div>
                        ) : (
                            messages.slice(0, 8).map((m, i) => {
                                const colors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6'];
                                const col = colors[i % colors.length];
                                return (
                                    <div key={m.id} className="lc-msg">
                                        <div className="lc-msg-av" style={{ background: col }}>
                                            {m.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="lc-msg-body">
                                            <div className="lc-msg-meta">
                                                <span className="lc-msg-name">{m.name}</span>
                                                <span className="lc-msg-time">{fmtTime(m.created_at)}</span>
                                                {!m.is_read && <div className="lc-msg-unread" />}
                                            </div>
                                            <div className="lc-msg-bubble">
                                                {m.message
                                                    ? m.message.slice(0, 120) + (m.message.length > 120 ? '…' : '')
                                                    : <span style={{ color: '#c8d1dc' }}>No message</span>}
                                                <div>
                                                    <Link
                                                        href={`/admin/messages/${m.id}`}
                                                        className="lc-msg-link"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        View full message
                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* View all link */}
                    <div className="lc-view-all">
                        <Link href="/admin/messages" className="lc-view-link" onClick={() => setOpen(false)}>
                            View all messages
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </div>

                    {/* Quick reply */}
                    <div className="lc-footer">
                        <input
                            ref={inputRef}
                            className="lc-input"
                            placeholder="Quick reply…"
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className="lc-send-btn"
                            onClick={handleSend}
                            disabled={sending || !reply.trim()}
                            title="Send"
                        >
                            {sending ? (
                                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'lcSpin 0.65s linear infinite' }} />
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
