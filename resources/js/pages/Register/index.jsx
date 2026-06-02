import { useForm, Link } from '@inertiajs/react'

export default function RegisterPage() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Join us today
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name">Full name</label>
              <input
                id="name" name="name" type="text" autoComplete="name"
                value={data.name} onChange={(e) => setData('name', e.target.value)}
                placeholder="John Doe"
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginTop: '0.25rem' }}
              />
              {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                value={data.email} onChange={(e) => setData('email', e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginTop: '0.25rem' }}
              />
              {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password" autoComplete="new-password"
                value={data.password} onChange={(e) => setData('password', e.target.value)}
                placeholder="Min. 8 characters"
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginTop: '0.25rem' }}
              />
              {errors.password && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation">Confirm password</label>
              <input
                id="password_confirmation" name="password_confirmation" type="password"
                value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginTop: '0.25rem' }}
              />
              {errors.password_confirmation && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password_confirmation}</p>}
            </div>

            <button
              type="submit" disabled={processing}
              style={{ width: '100%', padding: '0.6rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              {processing ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
