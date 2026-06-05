import React from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   ShimmerLoader — Reusable shimmer / skeleton components
   Usage:
     <ShimmerCard />                  — generic card skeleton
     <ShimmerBlogCard />              — blog card skeleton (image + text)
     <ShimmerPortfolioCard />         — portfolio image card skeleton
     <ShimmerServiceCard />           — service list-card skeleton
     <ShimmerTableRows count={5} cols={4} />  — admin table row skeletons
     <ShimmerDashboardTable cols={3} count={4} />
     <ShimmerStatCard />              — stat number card skeleton
───────────────────────────────────────────────────────────────────────────── */

const SHIMMER_CSS = `
  @keyframes shimmer-sweep {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .shimmer-base {
    background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
    background-size: 800px 100%;
    animation: shimmer-sweep 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
  .shimmer-card-wrap {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    padding: 0;
  }
  .shimmer-img-block {
    width: 100%;
    height: 220px;
  }
  .shimmer-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .shimmer-line {
    height: 14px;
    border-radius: 6px;
  }
  .shimmer-line-sm {
    height: 11px;
    border-radius: 6px;
  }
  .shimmer-circle {
    border-radius: 50%;
    flex-shrink: 0;
  }
  .shimmer-table-row td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .shimmer-table-row:last-child td {
    border-bottom: none;
  }
`;

/* ── Inline style helper ── */
const s = (extra = {}) => ({
  background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer-sweep 1.4s ease-in-out infinite',
  borderRadius: 6,
  ...extra,
});

/* ── Blog Card Skeleton ── */
export function ShimmerBlogCard() {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div className="shimmer-card-wrap">
        <div className="shimmer-base shimmer-img-block" />
        <div className="shimmer-body">
          <div className="shimmer-base shimmer-line" style={{ width: '85%' }} />
          <div className="shimmer-base shimmer-line" style={{ width: '65%' }} />
          <div className="shimmer-base shimmer-line-sm" style={{ width: '90%' }} />
          <div className="shimmer-base shimmer-line-sm" style={{ width: '75%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem' }}>
            <div className="shimmer-base shimmer-circle" style={{ width: 32, height: 32 }} />
            <div className="shimmer-base shimmer-line-sm" style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Portfolio Card Skeleton ── */
export function ShimmerPortfolioCard() {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div style={{ borderRadius: 12, overflow: 'hidden', background: '#e5e7eb' }}>
        <div className="shimmer-base" style={{ width: '100%', height: 260 }} />
      </div>
    </>
  );
}

/* ── Service Card Skeleton (horizontal split card) ── */
export function ShimmerServiceCard() {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 280,
      }}>
        {/* Left info panel */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="shimmer-base" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="shimmer-base shimmer-line-sm" style={{ width: '40%' }} />
              <div className="shimmer-base shimmer-line" style={{ width: '70%', height: 20 }} />
            </div>
          </div>
          <div className="shimmer-base shimmer-line-sm" style={{ width: '100%' }} />
          <div className="shimmer-base shimmer-line-sm" style={{ width: '90%' }} />
          <div className="shimmer-base shimmer-line-sm" style={{ width: '80%' }} />
          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
            <div className="shimmer-base" style={{ width: 90, height: 32, borderRadius: 100 }} />
            <div className="shimmer-base" style={{ width: 110, height: 32, borderRadius: 8 }} />
          </div>
        </div>
        {/* Right aside panel */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafafa' }}>
          <div className="shimmer-base shimmer-line-sm" style={{ width: '50%' }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <div className="shimmer-base shimmer-circle" style={{ width: 18, height: 18 }} />
              <div className="shimmer-base shimmer-line-sm" style={{ width: `${60 + i * 5}%` }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Admin Table Row Skeletons ── */
export function ShimmerTableRows({ count = 5, cols = 4 }) {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="shimmer-table-row">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <div
                className="shimmer-base"
                style={{
                  height: 14,
                  width: j === 0 ? '30px' : j === cols - 1 ? '80px' : `${55 + Math.random() * 30}%`,
                  borderRadius: 6,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ── Admin Dashboard Table Skeleton (with avatar in first col) ── */
export function ShimmerDashboardTable({ cols = 3, count = 4 }) {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
          <td style={{ padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="shimmer-base shimmer-circle" style={{ width: 36, height: 36 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="shimmer-base" style={{ width: 100, height: 13 }} />
                <div className="shimmer-base" style={{ width: 70, height: 11 }} />
              </div>
            </div>
          </td>
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <td key={j} style={{ padding: '1rem 1.5rem' }}>
              <div className="shimmer-base" style={{ height: 13, width: j === 0 ? 60 : 80, borderRadius: 100 }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ── Generic Card Skeleton ── */
export function ShimmerCard({ height = 200 }) {
  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <div className="shimmer-base" style={{ width: '100%', height, borderRadius: 10 }} />
        <div className="shimmer-base shimmer-line" style={{ width: '70%' }} />
        <div className="shimmer-base shimmer-line-sm" style={{ width: '50%' }} />
      </div>
    </>
  );
}

/* ── Default export: all-in-one ── */
export default {
  BlogCard: ShimmerBlogCard,
  PortfolioCard: ShimmerPortfolioCard,
  ServiceCard: ShimmerServiceCard,
  TableRows: ShimmerTableRows,
  DashboardTable: ShimmerDashboardTable,
  Card: ShimmerCard,
};
