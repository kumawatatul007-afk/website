import { Link } from '@inertiajs/react'

const IconChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
)

const IconChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
)

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null

    const prev  = links[0]
    const next  = links[links.length - 1]
    const pages = links.slice(1, -1)

    const btnBase = {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.35rem',
        height: '36px',
        padding: '0 0.9rem',
        borderRadius: '10px',
        fontSize: '0.8rem', fontWeight: 600,
        fontFamily: 'inherit',
        border: '1.5px solid #e2e8f0',
        background: '#fff',
        color: '#475569',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        userSelect: 'none',
    }

    const btnDisabled = {
        ...btnBase,
        background: '#f8fafc',
        color: '#c8d1dc',
        borderColor: '#f1f5f9',
        cursor: 'not-allowed',
        pointerEvents: 'none',
    }

    const btnActive = {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px',
        borderRadius: '10px',
        fontSize: '0.82rem', fontWeight: 800,
        fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
        cursor: 'default',
        flexShrink: 0,
    }

    const btnPage = {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px',
        borderRadius: '10px',
        fontSize: '0.82rem', fontWeight: 600,
        fontFamily: 'inherit',
        background: '#fff',
        color: '#475569',
        border: '1.5px solid #e2e8f0',
        textDecoration: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>

            {/* ← Previous */}
            {prev.url ? (
                <Link
                    href={prev.url}
                    style={btnBase}
                    onMouseEnter={e => {
                        e.currentTarget.style.background    = '#f1f5f9'
                        e.currentTarget.style.borderColor   = '#cbd5e1'
                        e.currentTarget.style.color         = '#0f172a'
                        e.currentTarget.style.transform     = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow     = '0 4px 10px rgba(15,23,42,0.08)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background    = '#fff'
                        e.currentTarget.style.borderColor   = '#e2e8f0'
                        e.currentTarget.style.color         = '#475569'
                        e.currentTarget.style.transform     = 'translateY(0)'
                        e.currentTarget.style.boxShadow     = 'none'
                    }}
                >
                    <IconChevronLeft />
                    Prev
                </Link>
            ) : (
                <span style={btnDisabled}>
                    <IconChevronLeft />
                    Prev
                </span>
            )}

            {/* Page numbers */}
            {pages.map((link, i) => {
                if (link.label === '...' || !link.url) {
                    return (
                        <span key={i} style={{
                            width: '36px', height: '36px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: '#94a3b8', fontSize: '0.9rem', fontWeight: 700,
                            userSelect: 'none',
                        }}>
                            …
                        </span>
                    )
                }

                if (link.active) {
                    return (
                        <span key={i} style={btnActive}>
                            {link.label}
                        </span>
                    )
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        style={btnPage}
                        onMouseEnter={e => {
                            e.currentTarget.style.background   = '#eef2ff'
                            e.currentTarget.style.borderColor  = '#a5b4fc'
                            e.currentTarget.style.color        = '#4f46e5'
                            e.currentTarget.style.transform    = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow    = '0 4px 10px rgba(99,102,241,0.12)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background   = '#fff'
                            e.currentTarget.style.borderColor  = '#e2e8f0'
                            e.currentTarget.style.color        = '#475569'
                            e.currentTarget.style.transform    = 'translateY(0)'
                            e.currentTarget.style.boxShadow    = 'none'
                        }}
                    >
                        {link.label}
                    </Link>
                )
            })}

            {/* Next → */}
            {next.url ? (
                <Link
                    href={next.url}
                    style={{
                        ...btnBase,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#fff',
                        borderColor: 'transparent',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'
                        e.currentTarget.style.transform = 'translateY(0)'
                    }}
                >
                    Next
                    <IconChevronRight />
                </Link>
            ) : (
                <span style={btnDisabled}>
                    Next
                    <IconChevronRight />
                </span>
            )}

        </div>
    )
}
