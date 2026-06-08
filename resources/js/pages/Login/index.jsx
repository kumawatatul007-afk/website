import { useForm, Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-[#f7f9fc] px-4 py-8"
      style={{
        backgroundImage: `radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.14), transparent 22%), url('https://www.thenikhilsharma.in/public/admin/images/signin.svg')`,
        backgroundPosition: 'top left, bottom left, right 10% center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        backgroundSize: '38%, 32%, 36%',
      }}
    >
      <div className="w-full max-w-md ml-4 md:ml-12 lg:ml-20 xl:ml-28">
        <div style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.07)',
          border: '1px solid rgba(15, 23, 42, 0.08)'
        }}>
          <div style={{
            height: '4px',
            width: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #2563eb, #0ea5e9, #22d3ee)'
          }}/>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <img
              src="http://127.0.0.1:8000/images/logo.png"
              alt="Logo"
              style={{ width: '100px', maxWidth: '100%', height: 'auto', filter: 'grayscale(1) brightness(0)'}}
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-950 mb-1 text-center">
            Welcome back
          </h1>
          <p className="text-sm text-slate-600 text-center mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => !errors.email && (e.target.style.borderColor = '#4f46e5')}
                onBlur={(e) => !errors.email && (e.target.style.borderColor = '#d1d5db')}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.625rem 2.5rem 0.625rem 0.75rem',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => !errors.password && (e.target.style.borderColor = '#4f46e5')}
                  onBlur={(e) => !errors.password && (e.target.style.borderColor = '#d1d5db')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  style={{
                    marginRight: '0.5rem',
                    width: '1rem',
                    height: '1rem',
                    cursor: 'pointer',
                    accentColor: '#4f46e5'
                  }}
                />
                Remember me
              </label>

              <a
                href="/forgot-password"
                style={{
                  fontSize: '0.875rem',
                  color: '#4f46e5',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: processing ? '#64748b' : 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: processing ? 'not-allowed' : 'pointer',
                marginTop: '1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: processing ? 'none' : '0 18px 50px rgba(56, 189, 248, 0.18)',
                letterSpacing: '0.02em',
                transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s'
              }}
              onMouseOver={(e) => {
                if (!processing) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.filter = 'brightness(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (!processing) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.filter = 'none';
                }
              }}
            >
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    style={{
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.5rem',
                      width: '1rem',
                      height: '1rem'
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Don't have an account?{' '}
            <Link
              href="/register"
              style={{
                color: '#4f46e5',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign up
            </Link>
          </p>
        </div>


      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

Login.layout = page => page;
