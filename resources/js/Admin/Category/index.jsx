import AdminLayout from '../layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import Pagination from '../../components/admin/Pagination';
import { ShimmerTableRows } from '../../components/ShimmerLoader';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ── Type → color palette ───────────────────────────────────────────────── */
const TYPE_PALETTE = {
    blog:      { bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4f46e5', dot: '#6366f1' },
    service:   { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', color: '#16a34a', dot: '#22c55e' },
    portfolio: { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#ea580c', dot: '#f97316' },
    project:   { bg: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', color: '#0369a1', dot: '#0ea5e9' },
    news:      { bg: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', color: '#9333ea', dot: '#a855f7' },
    default:   { bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', color: '#64748b', dot: '#94a3b8' },
};
const typePalette = (type) => {
    if (!type) return TYPE_PALETTE.default;
    return TYPE_PALETTE[type.toLowerCase()] ?? TYPE_PALETTE.default;
};

/* ── SVG icon helpers ───────────────────────────────────────────────────── */
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconEdit     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconFolder   = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconAlert    = () => <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconChevron  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconHome     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

/* ── Delete confirmation modal ──────────────────────────────────────────── */
function DeleteModal({ category, onClose, onConfirm, loading }) {
    useEffect(() => {
        const handler = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, loading]);

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'modalOverlayIn 0.2s ease both',
                padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
        >
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2.25rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 32px 80px rgba(15,23,42,0.25), 0 8px 24px rgba(15,23,42,0.1)',
                border: '1px solid rgba(255,255,255,0.85)',
                animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '20px',
                    background: 'linear-gradient(135deg,#fee2e2,#fecaca)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 20px rgba(239,68,68,0.2)',
                }}>
                    <IconAlert />
                </div>

                <h3 style={{
                    fontSize: '1.2rem', fontWeight: 800, color: '#0f172a',
                    marginBottom: '0.6rem', letterSpacing: '-0.3px',
                }}>
                    Delete Category?
                </h3>
                <p style={{
                    fontSize: '0.9rem', color: '#64748b',
                    lineHeight: 1.65, marginBottom: '2rem',
                }}>
                    You're about to permanently delete{' '}
                    <strong style={{
                        color: '#0f172a',
                        background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                    }}>
                        "{category?.name}"
                    </strong>
                    . This action cannot be undone and may affect associated content.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.875rem 1.25rem',
                            borderRadius: '14px', border: '1.5px solid #e2e8f0',
                            background: '#fff', color: '#475569',
                            fontSize: '0.875rem', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s',
                            opacity: loading ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '0.875rem 1.25rem',
                            borderRadius: '14px', border: 'none',
                            background: loading
                                ? 'linear-gradient(135deg,#fca5a5,#f87171)'
                                : 'linear-gradient(135deg,#ef4444,#dc2626)',
                            color: '#fff',
                            fontSize: '0.875rem', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s',
                            boxShadow: loading ? 'none' : '0 4px 14px rgba(239,68,68,0.4)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '0.5rem',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.55)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.4)'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    width: 14, height: 14,
                                    border: '2px solid rgba(255,255,255,0.35)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'spinIcon 0.65s linear infinite',
                                    display: 'inline-block', flexShrink: 0,
                                }} />
                                Deleting…
                            </>
                        ) : 'Delete'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function AdminCategoryIndex({ categories, filters }) {
    const [search,        setSearch]        = useState(filters?.search   ?? '');
    const [perPage,       setPerPage]       = useState(filters?.per_page ?? 15);
    const [shimmer,       setShimmer]       = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [deleteModal,   setDeleteModal]   = useState(false);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setShimmer(false), 700);
        return () => clearTimeout(t);
    }, []);

    const applyFilters = (overrides = {}) =>
        router.get('/admin/categories', {
            search,
            per_page: perPage,
            ...overrides,
        }, { preserveState: true, replace: true });

    const openDelete  = (cat) => { setDeleteTarget(cat); setDeleteModal(true); };
    const closeDelete = ()    => { setDeleteModal(false); setDeleteTarget(null); };
    const confirmDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/categories/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => { closeDelete(); setDeleteLoading(false); },
            onFinish:  () => setDeleteLoading(false),
        });
    };

    const totalCount = categories?.total ?? categories?.data?.length ?? 0;

    return (
        <AdminLayout title="Categories">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

                /* ── Keyframes ─────────────────────────────────────────── */
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes rowSlideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes shimmerSweep {
                    0%   { background-position: -600px 0; }
                    100% { background-position:  600px 0; }
                }
                @keyframes modalOverlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalPanelIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes spinIcon {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.25); }
                    50%       { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
                }

                /* ── Base ──────────────────────────────────────────────── */
                .cat-page { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

                /* ── Page header ───────────────────────────────────────── */
                .cat-header {
                    display: flex; align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
                }
                .cat-breadcrumb {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.75rem; font-weight: 500; color: #94a3b8;
                    margin-bottom: 0.45rem; letter-spacing: 0.01em;
                }
                .cat-breadcrumb .bc-active { color: #6366f1; font-weight: 600; }
                .cat-title {
                    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
                    font-size: 1.65rem; font-weight: 900; color: #0f172a;
                    letter-spacing: -0.8px; line-height: 1.15;
                }
                .cat-count-chip {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
                    color: #4f46e5;
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    border: 1px solid rgba(99,102,241,0.2);
                    padding: 0.32rem 0.8rem; border-radius: 999px;
                }
                .cat-count-chip::before {
                    content: '';
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #6366f1;
                    animation: pulseGlow 2s ease infinite;
                    display: inline-block;
                }
                .cat-subtitle {
                    font-size: 0.875rem; color: #94a3b8; font-weight: 400;
                    margin-top: 0.35rem; letter-spacing: 0.01em;
                }

                /* ── Toolbar ───────────────────────────────────────────── */
                .cat-toolbar {
                    display: flex; gap: 0.875rem; margin-bottom: 1.5rem;
                    flex-wrap: wrap; align-items: center;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both;
                }
                .search-wrap { position: relative; flex: 1; min-width: 220px; }
                .search-icon-wrap {
                    position: absolute; left: 1rem; top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none; color: #cbd5e1;
                    transition: color 0.2s;
                    display: flex; align-items: center;
                }
                .search-icon-wrap.focused { color: #6366f1; }
                .cat-search {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 2.85rem;
                    border: 1.5px solid #e8ecf2;
                    border-radius: 14px;
                    font-size: 0.875rem; font-family: inherit;
                    background: #fff; color: #0f172a;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
                }
                .cat-search::placeholder { color: #c8d1dc; }
                .cat-search:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.13), 0 1px 4px rgba(15,23,42,0.05);
                }
                .cat-select {
                    padding: 0.9rem 2.75rem 0.9rem 1.1rem;
                    border: 1.5px solid #e8ecf2;
                    border-radius: 14px;
                    font-size: 0.875rem; font-family: inherit;
                    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 1.1rem center;
                    color: #475569; appearance: none; -webkit-appearance: none;
                    outline: none; cursor: pointer;
                    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
                    transition: border-color 0.2s, box-shadow 0.2s;
                    white-space: nowrap;
                }
                .cat-select:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.13);
                }
                .btn-search {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.9rem 1.65rem;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: #fff; border: none; border-radius: 14px;
                    font-size: 0.875rem; font-weight: 700; font-family: inherit;
                    cursor: pointer; white-space: nowrap;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .btn-search:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 26px rgba(99,102,241,0.55);
                }
                .btn-search:active { transform: translateY(0); }

                /* ── Card ──────────────────────────────────────────────── */
                .cat-card {
                    background: #fff;
                    border-radius: 24px;
                    border: 1px solid #eef2f7;
                    overflow: hidden;
                    box-shadow:
                        0 0 0 1px rgba(15,23,42,0.03),
                        0 2px 4px rgba(15,23,42,0.04),
                        0 8px 24px rgba(15,23,42,0.06),
                        0 24px 64px rgba(15,23,42,0.04);
                    animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both;
                }
                .cat-card-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1.1rem 1.75rem;
                    border-bottom: 1px solid #f1f5f9;
                    background: linear-gradient(180deg, #fafbff 0%, #f8fafc 100%);
                }
                .card-header-label {
                    font-size: 0.72rem; font-weight: 800; color: #94a3b8;
                    text-transform: uppercase; letter-spacing: 0.12em;
                }
                .card-header-meta {
                    font-size: 0.8rem; color: #cbd5e1; font-weight: 500;
                }

                /* ── Table ─────────────────────────────────────────────── */
                .cat-table {
                    width: 100%; border-collapse: collapse;
                    font-size: 0.875rem; table-layout: fixed;
                }
                .cat-table thead tr {
                    background: linear-gradient(180deg, #fafbff 0%, #f7f9fc 100%);
                }
                .cat-table th {
                    text-align: left;
                    padding: 1.05rem 1.5rem;
                    font-size: 0.695rem; font-weight: 800;
                    color: #b0bec8; text-transform: uppercase;
                    letter-spacing: 0.11em; white-space: nowrap;
                    border-bottom: 1px solid #f1f5f9;
                    user-select: none;
                }
                .cat-table td {
                    padding: 1.05rem 1.5rem;
                    border-bottom: 1px solid #f8fafc;
                    color: #0f172a; vertical-align: middle;
                }
                .cat-table tbody tr:last-child td { border-bottom: none; }
                .cat-table tbody tr {
                    transition: background 0.14s ease;
                    animation: rowSlideIn 0.38s cubic-bezier(0.22,1,0.36,1) both;
                }
                .cat-table tbody tr:hover td { background: #fafbff; }

                /* staggered row entrance */
                .cat-table tbody tr:nth-child(1)  { animation-delay: 0.15s; }
                .cat-table tbody tr:nth-child(2)  { animation-delay: 0.19s; }
                .cat-table tbody tr:nth-child(3)  { animation-delay: 0.23s; }
                .cat-table tbody tr:nth-child(4)  { animation-delay: 0.27s; }
                .cat-table tbody tr:nth-child(5)  { animation-delay: 0.31s; }
                .cat-table tbody tr:nth-child(6)  { animation-delay: 0.35s; }
                .cat-table tbody tr:nth-child(7)  { animation-delay: 0.39s; }
                .cat-table tbody tr:nth-child(8)  { animation-delay: 0.43s; }
                .cat-table tbody tr:nth-child(9)  { animation-delay: 0.47s; }
                .cat-table tbody tr:nth-child(10) { animation-delay: 0.51s; }

                /* ── Row index ─────────────────────────────────────────── */
                .row-num {
                    color: #dce3ed; font-size: 0.775rem; font-weight: 700;
                    font-variant-numeric: tabular-nums; letter-spacing: 0.02em;
                }

                /* ── Type badge ────────────────────────────────────────── */
                .type-badge {
                    display: inline-flex; align-items: center; gap: 0.42rem;
                    padding: 0.36rem 0.85rem; border-radius: 999px;
                    font-size: 0.715rem; font-weight: 700;
                    letter-spacing: 0.05em; text-transform: capitalize;
                    white-space: nowrap;
                }
                .type-badge-dot {
                    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
                }

                /* ── Name cell ─────────────────────────────────────────── */
                .cat-name {
                    font-weight: 700; color: #0f172a;
                    font-size: 0.875rem; line-height: 1.3;
                }

                /* ── Slug chip ─────────────────────────────────────────── */
                .slug-chip {
                    display: inline-flex; align-items: center;
                    background: #f5f7ff; border: 1px solid #e8ecff;
                    border-radius: 8px; padding: 0.28rem 0.65rem;
                    gap: 0.3rem; max-width: 100%;
                }
                .slug-chip-hash {
                    color: #a5b4fc; font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
                }
                .slug-chip-text {
                    color: #6366f1; font-size: 0.72rem; font-weight: 600;
                    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    max-width: 160px;
                }

                /* ── Date ──────────────────────────────────────────────── */
                .date-main { color: #475569; font-size: 0.83rem; font-weight: 500; }
                .date-time { color: #c8d1dc; font-size: 0.74rem; margin-top: 2px; }

                /* ── Action buttons ────────────────────────────────────── */
                .actions-cell {
                    display: flex; align-items: center; justify-content: center;
                    gap: 0.375rem;
                }
                .btn-icon {
                    width: 32px; height: 32px; border-radius: 9px;
                    display: inline-flex; align-items: center; justify-content: center;
                    border: 1.5px solid #e8ecf2; background: #fff;
                    color: #64748b; cursor: pointer;
                    transition: all 0.15s ease;
                    text-decoration: none; flex-shrink: 0;
                }
                .btn-icon:hover {
                    background: #f1f5f9; border-color: #cbd5e1;
                    color: #0f172a; transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(15,23,42,0.1);
                }
                .btn-icon-danger {
                    width: 32px; height: 32px; border-radius: 9px;
                    display: inline-flex; align-items: center; justify-content: center;
                    border: 1.5px solid #fee2e2; background: #fff5f5;
                    color: #f87171; cursor: pointer;
                    transition: all 0.15s ease; flex-shrink: 0;
                }
                .btn-icon-danger:hover {
                    background: #fef2f2; border-color: #fca5a5;
                    color: #ef4444; transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(239,68,68,0.18);
                }

                /* ── Shimmer ───────────────────────────────────────────── */
                .shimmer-cell {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
                    background-size: 800px 100%;
                    animation: shimmerSweep 1.5s ease-in-out infinite;
                    border-radius: 7px; height: 14px;
                }

                /* ── Empty state ───────────────────────────────────────── */
                .cat-empty {
                    text-align: center; padding: 5.5rem 2rem;
                    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
                }
                .cat-empty-icon-wrap {
                    width: 84px; height: 84px; border-radius: 26px;
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    border: 1px solid rgba(99,102,241,0.15);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 1.75rem;
                    box-shadow: 0 8px 24px rgba(99,102,241,0.15);
                }
                .cat-empty-title {
                    font-size: 1.1rem; font-weight: 800; color: #1e293b;
                    letter-spacing: -0.3px; margin-bottom: 0.5rem;
                }
                .cat-empty-sub {
                    font-size: 0.875rem; color: #94a3b8; font-weight: 400;
                    line-height: 1.6; max-width: 320px; margin: 0 auto;
                }

                /* ── Pagination footer ─────────────────────────────────── */
                .cat-footer {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 1.2rem 1.75rem;
                    border-top: 1px solid #f1f5f9;
                    background: linear-gradient(180deg, transparent 0%, #fafbff 100%);
                    flex-wrap: wrap; gap: 0.75rem;
                }
                .footer-info {
                    font-size: 0.8rem; color: #b0bec8; font-weight: 500;
                }
                .footer-info strong { color: #64748b; font-weight: 700; }

                /* ── Responsive breakpoints ────────────────────────────── */
                @media (max-width: 900px) {
                    .col-updated { display: none; }
                }
                @media (max-width: 700px) {
                    .col-slug { display: none; }
                    .cat-title { font-size: 1.35rem; }
                }
                @media (max-width: 520px) {
                    .col-type { display: none; }
                    .cat-footer { justify-content: center; }
                    .footer-info { display: none; }
                    .cat-table th, .cat-table td { padding: 0.875rem 1rem; }
                }
            `}</style>

            <div className="cat-page">

                {/* ═══════════ Header ═══════════ */}
                <div className="cat-header">
                    <div>
                        <div className="cat-breadcrumb">
                            <IconHome />
                            Admin
                            <IconChevron />
                            <span className="bc-active">Categories</span>
                        </div>
                        <h2 className="cat-title">
                            All Categories
                            {totalCount > 0 && (
                                <span className="cat-count-chip">{totalCount} total</span>
                            )}
                        </h2>
                        <p className="cat-subtitle">Browse and manage your content taxonomy</p>
                    </div>
                </div>

                {/* ═══════════ Toolbar ═══════════ */}
                <div className="cat-toolbar">
                    <div className="search-wrap">
                        <span className={`search-icon-wrap ${searchFocused ? 'focused' : ''}`}>
                            <IconSearch />
                        </span>
                        <input
                            ref={inputRef}
                            className="cat-search"
                            placeholder="Search by name or slug…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        />
                    </div>

                    <select
                        className="cat-select"
                        value={perPage}
                        onChange={e => {
                            const val = Number(e.target.value);
                            setPerPage(val);
                            applyFilters({ per_page: val });
                        }}
                    >
                        {[10, 15, 25, 50, 100].map(n => (
                            <option key={n} value={n}>Show {n} entries</option>
                        ))}
                    </select>

                    <button className="btn-search" onClick={() => applyFilters()}>
                        <IconSearch />
                        Search
                    </button>
                </div>

                {/* ═══════════ Data Card ═══════════ */}
                <div className="cat-card">

                    {/* Card sub-header */}
                    <div className="cat-card-header">
                        <span className="card-header-label">Categories List</span>
                        {!shimmer && (
                            <span className="card-header-meta">
                                {categories?.from ?? 0}–{categories?.to ?? 0} of {totalCount}
                            </span>
                        )}
                    </div>

                    <table className="cat-table">
                        <thead>
                            <tr>
                                <th style={{ width: '52px' }}>#</th>
                                <th style={{ width: '15%' }} className="col-type">Type</th>
                                <th>Name</th>
                                <th style={{ width: '24%' }} className="col-slug">Slug</th>
                                <th style={{ width: '17%' }}>Created</th>
                                <th style={{ width: '13%' }} className="col-updated">Updated</th>
                                <th style={{ width: '88px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shimmer ? (
                                <ShimmerTableRows count={8} cols={7} />
                            ) : categories?.data?.length > 0 ? (
                                categories.data.map((cat, i) => {
                                    const palette    = typePalette(cat.text_for);
                                    const created    = cat.created_at ? new Date(cat.created_at) : null;
                                    const updated    = cat.updated_at ? new Date(cat.updated_at) : null;
                                    const fmtDate    = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    const fmtTime    = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <tr key={cat.id}>
                                            {/* # */}
                                            <td className="row-num">
                                                {(categories.from ?? 0) + i}
                                            </td>

                                            {/* Type */}
                                            <td className="col-type">
                                                {cat.text_for ? (
                                                    <span
                                                        className="type-badge"
                                                        style={{ background: palette.bg, color: palette.color }}
                                                    >
                                                        <span className="type-badge-dot" style={{ background: palette.dot }} />
                                                        {cat.text_for}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>
                                                )}
                                            </td>

                                            {/* Name */}
                                            <td>
                                                <div className="cat-name">{cat.name}</div>
                                            </td>

                                            {/* Slug */}
                                            <td className="col-slug">
                                                {cat.slug ? (
                                                    <div className="slug-chip">
                                                        <span className="slug-chip-hash">/</span>
                                                        <span className="slug-chip-text">{cat.slug}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#dce3ed', fontSize: '0.8rem' }}>—</span>
                                                )}
                                            </td>

                                            {/* Created */}
                                            <td>
                                                {created ? (
                                                    <>
                                                        <div className="date-main">{fmtDate(created)}</div>
                                                        <div className="date-time">{fmtTime(created)}</div>
                                                    </>
                                                ) : <span style={{ color: '#dce3ed' }}>—</span>}
                                            </td>

                                            {/* Updated */}
                                            <td className="col-updated">
                                                {updated ? (
                                                    <div className="date-main">{fmtDate(updated)}</div>
                                                ) : <span style={{ color: '#dce3ed' }}>—</span>}
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="actions-cell">
                                                    <Link
                                                        href={`/admin/categories/${cat.id}/edit`}
                                                        className="btn-icon"
                                                        title="Edit"
                                                    >
                                                        <IconEdit />
                                                    </Link>
                                                    <button
                                                        className="btn-icon-danger"
                                                        title="Delete"
                                                        onClick={() => openDelete(cat)}
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ padding: 0, borderBottom: 'none' }}>
                                        <div className="cat-empty">
                                            <div className="cat-empty-icon-wrap">
                                                <IconFolder />
                                            </div>
                                            <div className="cat-empty-title">
                                                {search ? 'No results found' : 'No categories yet'}
                                            </div>
                                            <div className="cat-empty-sub">
                                                {search
                                                    ? `No categories match "${search}". Try a different keyword.`
                                                    : 'Your category data will appear here once added.'
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination footer */}
                    {!shimmer && categories?.links && (
                        <div className="cat-footer">
                            <div className="footer-info">
                                Showing{' '}
                                <strong>{categories.from ?? 0}</strong>
                                {' – '}
                                <strong>{categories.to ?? 0}</strong>
                                {' of '}
                                <strong>{totalCount}</strong>
                                {' categories'}
                            </div>
                            <Pagination links={categories.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════ Delete modal ═══════════ */}
            {deleteModal && (
                <DeleteModal
                    category={deleteTarget}
                    onClose={closeDelete}
                    onConfirm={confirmDelete}
                    loading={deleteLoading}
                />
            )}
        </AdminLayout>
    );
}
