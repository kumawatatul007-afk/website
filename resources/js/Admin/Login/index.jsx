import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="sl-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .sl-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                    background: #f5f6fa;
                    padding: 1rem;
                }

                /* ── Two-column layout ── */
                .sl-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3rem;
                    width: 100%;
                    max-width: 960px;
                }

                /* ── Left: Login Card ── */
                .sl-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 2.5rem 2.2rem 2rem 2.2rem;
                    width: 100%;
                    max-width: 340px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                    flex-shrink: 0;
                }

                /* Logo area */
                .sl-logo {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.4rem;
                }

                .sl-logo img {
                    width: 150px;
                    height: auto;
                    object-fit: contain;
                    filter: brightness(0);
                }

                /* Heading */
                .sl-heading {
                    font-size: 1.45rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin-bottom: 1.6rem;
                }

                /* Input group */
                .sl-field {
                    margin-bottom: 1rem;
                    position: relative;
                }

                .sl-input {
                    width: 100%;
                    padding: 0.7rem 2.6rem 0.7rem 0.9rem;
                    border: 1.5px solid #e8eaf0;
                    border-radius: 8px;
                    font-size: 0.88rem;
                    font-family: 'Inter', sans-serif;
                    color: #1a1a2e;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .sl-input::placeholder {
                    color: #b0b4c0;
                }

                .sl-input:focus {
                    border-color: #4a90e2;
                    box-shadow: 0 0 0 3px rgba(74,144,226,0.1);
                }

                .sl-input.has-error {
                    border-color: #e74c3c;
                }

                /* Right icon inside input */
                .sl-input-icon-right {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #b0b4c0;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .sl-input-icon-right svg {
                    width: 17px;
                    height: 17px;
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 1.8;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .sl-error {
                    color: #e74c3c;
                    font-size: 0.72rem;
                    margin-top: 0.3rem;
                    font-weight: 500;
                }

                /* Forgot password row */
                .sl-meta-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 0.3rem 0 1.4rem 0;
                }

                .sl-meta-label {
                    font-size: 0.82rem;
                    color: #6b7280;
                    font-weight: 500;
                }

                .sl-forgot {
                    font-size: 0.82rem;
                    color: #4a90e2;
                    font-weight: 500;
                    text-decoration: none;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }

                .sl-forgot:hover {
                    text-decoration: underline;
                }

                /* Login button */
                .sl-btn {
                    width: 100%;
                    padding: 0.72rem;
                    background: #4a90e2;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    letter-spacing: 0.01em;
                }

                .sl-btn:hover:not(:disabled) {
                    background: #357abd;
                    transform: translateY(-1px);
                }

                .sl-btn:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .sl-btn-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .sl-spinner {
                    width: 15px;
                    height: 15px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: sl-spin 0.7s linear infinite;
                }

                @keyframes sl-spin { to { transform: rotate(360deg); } }

                /* Footer copyright */
                .sl-footer {
                    text-align: center;
                    margin-top: 1.6rem;
                    font-size: 0.72rem;
                    color: #9ca3af;
                }

                .sl-footer a {
                    color: #4a90e2;
                    text-decoration: none;
                    font-weight: 600;
                }

                /* ── Right: Illustration ── */
                .sl-illustration {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 0;
                }

                .sl-illustration img {
                    width: 100%;
                    max-width: 480px;
                    height: auto;
                    display: block;
                }

                /* Responsive */
                @media (max-width: 720px) {
                    .sl-illustration { display: none; }
                    .sl-wrapper { justify-content: center; }
                    .sl-card { max-width: 100%; }
                }
            `}</style>

            <div className="sl-wrapper">
                {/* ── Left: Login Card ── */}
                <div className="sl-card">
                    {/* Logo */}
                    <div className="sl-logo">
                        <img
                            src="https://www.thenikhilsharma.in/public/admin/images/logo/GUJKF-100621-yYB.png"
                            alt="NS Logo"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    <h1 className="sl-heading">Log in</h1>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="sl-field">
                            <input
                                type="email"
                                className={`sl-input${errors.email ? ' has-error' : ''}`}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Email"
                                autoComplete="email"
                            />
                            <span className="sl-input-icon-right">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </span>
                            {errors.email && <p className="sl-error">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="sl-field">
                            <input
                                type={showPass ? 'text' : 'password'}
                                className={`sl-input${errors.password ? ' has-error' : ''}`}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="sl-input-icon-right"
                                onClick={() => setShowPass(v => !v)}
                                tabIndex={-1}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? (
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                            {errors.password && <p className="sl-error">{errors.password}</p>}
                        </div>

                        {/* Password label + Forgot link row */}
                        <div className="sl-meta-row">
                            <span className="sl-meta-label">Password</span>
                            <button type="button" className="sl-forgot">Forgot Your Password?</button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="sl-btn" disabled={processing}>
                            <span className="sl-btn-inner">
                                {processing ? (
                                    <>
                                        <span className="sl-spinner" />
                                        Logging in...
                                    </>
                                ) : 'Login'}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="sl-footer">
                        © {new Date().getFullYear()}, Designed by <a href="https://www.thenikhilsharma.in" target="_blank" rel="noreferrer">NLET</a>
                    </div>
                </div>

                {/* ── Right: Illustration ── */}
                <div className="sl-illustration">
                    <img
                        src="https://www.thenikhilsharma.in/public/admin/images/signin.svg"
                        alt="Sign in illustration"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </div>
        </div>
    );
}
    