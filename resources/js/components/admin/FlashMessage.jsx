import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import './FlashMessage.css'

export default function FlashMessage() {
  const { flash } = usePage().props
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    }
  }, [flash])

  if (!visible || (!flash?.success && !flash?.error)) return null

  const isSuccess = !!flash.success
  
  return (
    <div className={`flash-message ${isSuccess ? 'flash-success' : 'flash-error'}`}>
      <div className="flash-icon">
        {isSuccess ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>
      <div className="flash-content">
        <div className="flash-title">{isSuccess ? 'Success' : 'Error'}</div>
        <div className="flash-text">{flash.success || flash.error}</div>
      </div>
      <button 
        onClick={() => setVisible(false)} 
        className="flash-close"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
