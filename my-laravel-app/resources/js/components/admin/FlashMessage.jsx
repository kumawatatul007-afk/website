import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function FlashMessage() {
  const { flash } = usePage().props
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(t)
    }
  }, [flash])

  if (!visible || (!flash?.success && !flash?.error)) return null

  const isSuccess = !!flash.success
  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
      padding: '0.875rem 1.25rem', borderRadius: '10px', maxWidth: '360px',
      background: isSuccess ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
      color: isSuccess ? '#15803d' : '#dc2626',
      fontSize: '0.875rem', fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      animation: 'slideIn 0.2s ease',
    }}>
      <span style={{ fontSize: '1.1rem' }}>{isSuccess ? '✅' : '❌'}</span>
      {flash.success || flash.error}
      <button onClick={() => setVisible(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1rem', lineHeight: 1 }}>×</button>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  )
}
