import { useState } from 'react'
import { useCreateUserMutation } from '../services/userApiSlice'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from '../utils/swal'

function getStrength(val) {
    let score = 0
    if (val.length >= 6) score++
    if (val.length >= 10) score++
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
}

const STRENGTH_COLORS = ['#e94560', '#f97316', '#eab308', '#22c55e']
const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong']

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [createUser, { isLoading }] = useCreateUserMutation()
    const navigate = useNavigate()

    const strength = getStrength(form.password)
    const strengthColor = form.password.length === 0 ? null : STRENGTH_COLORS[strength - 1]
    const strengthLabel = form.password.length === 0
        ? 'Enter a password to see its strength'
        : STRENGTH_LABELS[strength - 1] || 'Too short'

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createUser(form).unwrap()
            toast('Account created! Please login.', 'success')
            navigate('/login')
        } catch (err) {
            toast(err.data?.message || 'Registration failed', 'error')
        }
    }

    return (
        <>
            <Helmet>
                <title>Create Account — ShopNow</title>
                <meta name="description" content="Create a free ShopNow account and start shopping today." />
            </Helmet>

            <div className="auth-page">
                <div className="w-full max-w-sm">

                    <div className="text-center mb-7">
                        <Link to="/" className="inline-flex items-center gap-2 no-underline mb-5">
                            <span className="auth-logo-icon">
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 3h10M4 3V2a1 1 0 012 0v1M8 3V2a1 1 0 012 0v1M2 3l1 8h8l1-8"
                                        stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="auth-logo-text">
                                Shop<span className="auth-logo-accent">Now</span>
                            </span>
                        </Link>
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Start shopping in seconds — it's free</p>
                    </div>

                    <div className="auth-card">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">
                                <label htmlFor="name" className="field-label">Full name</label>
                                <div className="relative">
                                    <div className="field-icon">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <circle cx="7.5" cy="5" r="2.5" stroke="#9ca3af" strokeWidth="1.2" />
                                            <path d="M2 13c0-3.31 2.46-5.5 5.5-5.5S13 9.69 13 13"
                                                stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <input id="name" name="name" type="text" required placeholder="John Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="field field--icon-left"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="field-label">Email address</label>
                                <div className="relative">
                                    <div className="field-icon">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <path d="M1 4l6 4 6-4M1 4v7a1 1 0 001 1h10a1 1 0 001-1V4M1 4a1 1 0 011-1h10a1 1 0 011 1"
                                                stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <input id="email" name="email" type="email" required placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="field field--icon-left"
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="password" className="field-label">Password</label>
                                <div className="relative">
                                    <div className="field-icon">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <rect x="2" y="7" width="11" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
                                            <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <input id="password" name="password" required minLength={6}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="field field--icon-both"
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="field-icon field-icon--right"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <path d="M1 7.5C2.5 4 5 2 7.5 2S12.5 4 14 7.5C12.5 11 10 13 7.5 13S2.5 11 1 7.5z"
                                                stroke="currentColor" strokeWidth="1.2" />
                                            <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-5">
                                <div className="strength-bars">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="strength-bar"
                                            style={{ background: i < strength && strengthColor ? strengthColor : '#e5e7eb' }} />
                                    ))}
                                </div>
                                <p className="strength-label" style={{ color: strengthColor || undefined }}>
                                    {strengthLabel}
                                </p>
                            </div>

                            <div className="auth-terms">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
                                    <circle cx="7" cy="7" r="6" stroke="#9ca3af" strokeWidth="1.2" />
                                    <path d="M7 6v4M7 4.5v.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <p className="auth-terms__text">
                                    By creating an account you agree to our{' '}
                                    <a href="#" className="auth-terms__link">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="auth-terms__link">Privacy Policy</a>.
                                </p>
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="btn btn--primary btn--primary-full flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                            <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="auth-footer-text">
                        Already have an account?
                        <Link to="/login" className="auth-footer-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </>
    )
}