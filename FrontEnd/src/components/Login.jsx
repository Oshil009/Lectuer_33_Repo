import { useState } from 'react'
import { useLoginMutation } from '../services/userApiSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'
import { toast } from '../utils/swal'
const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL}/user/auth/google`
export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loginMutation, { isLoading }] = useLoginMutation()
    const navigate = useNavigate()
    const { login } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await loginMutation(form).unwrap()
            login(result.token, result.data)
            toast(`Welcome back, ${result.data.name}!`)
            navigate('/')
        } catch (err) {
            toast(err.data?.message || 'Invalid email or password', 'error')
        }
    }
    return (
        <>
            <Helmet>
                <title>Login — ShopNow</title>
                <meta name="description" content="Sign in to your ShopNow account." />
            </Helmet>
            <div className="auth-page">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
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
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>
                    <div className="auth-card">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="email" className="field-label">Email address</label>
                                <div className="relative">
                                    <div className="field-icon">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <path d="M1 4l6 4 6-4M1 4v7a1 1 0 001 1h10a1 1 0 001-1V4M1 4a1 1 0 011-1h10a1 1 0 011 1"
                                                stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <input id="email" name="email" type="email" required
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="field field--icon-left" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="field-label mb-0">Password</label>
                                <div className="relative mt-1.5">
                                    <div className="field-icon">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <rect x="2" y="7" width="11" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
                                            <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <input id="password" name="password" required
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="field field--icon-both" />
                                    <button type="button"
                                        onClick={(e) => { e.preventDefault(); setShowPassword(v => !v) }}
                                        className="field-icon field-icon--right"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? (
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M2 2l11 11M6.5 6.7A2 2 0 008.3 8.5M4.2 4.4C2.8 5.3 1.8 6.4 1 7.5c1.5 3.5 4 5.5 6.5 5.5 1.1 0 2.2-.4 3.1-1M7.5 2C5 2 2.5 4 1 7.5c.5 1.1 1.1 2 1.9 2.8"
                                                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M1 7.5C2.5 4 5 2 7.5 2S12.5 4 14 7.5C12.5 11 10 13 7.5 13S2.5 11 1 7.5z" stroke="currentColor" strokeWidth="1.2" />
                                                <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="btn btn--primary btn--primary-full flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                            <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                        <div className="auth-divider">
                            <span>or sign in with email</span>
                        </div>
                        <a href={GOOGLE_AUTH_URL} className="google-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </a>
                    </div>
                    <p className="auth-footer-text">
                        Don't have an account?
                        <Link to="/register" className="auth-footer-link">Create one</Link>
                    </p>
                </div>
            </div>
        </>
    )
}
