import { Link } from '@inertiajs/react'

export default function Pagination({ links }) {
  if (!links || links.length <= 3) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
      {links.map((link, i) => {
        if (!link.url) {
          return (
            <span key={i} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#94a3b8', background: '#f8fafc' }}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          )
        }
        return (
          <Link
            key={i}
            href={link.url}
            style={{
              padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem',
              background: link.active ? '#4f46e5' : '#fff',
              color: link.active ? '#fff' : '#374151',
              border: '1px solid #e2e8f0',
              textDecoration: 'none', fontWeight: link.active ? 600 : 400,
            }}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        )
      })}
    </div>
  )
}
