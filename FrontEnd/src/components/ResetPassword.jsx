import { useState } from 'react'
import { useChangePasswordMutation } from '../services/userApiSlice'
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

function PasswordInput({ id, value, onChange, placeholder }) {
    const [show, setShow] = useState(false)

    return (
        <div className="relative">
            <div className="field-icon">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="2" y="7" width="11" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            </div>
            <input
                id={id}
                type={show ? 'text' : 'password'}
                required
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="field field--icon-both"
            />
            <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="field-icon field-icon--right"
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show ? (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1 1l13 13M6.5 6.6A2 2 0 007.5 10a2 2 0 002-1.5M4 4.2C2.3 5.3 1.2 6.6 1 7.5c.8 3 3.5 5 6.5 5 1.5 0 2.8-.5 3.9-1.3M3.5 2.5C4.7 2 6 1.5 7.5 1.5c3 0 5.7 2 6.5 6-.3 1.2-.9 2.3-1.8 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1 7.5C2.5 4 5 2 7.5 2S12.5 4 14 7.5C12.5 11 10 13 7.5 13S2.5 11 1 7.5z"
                            stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default function ResetPassword() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [changePassword, { isLoading }] = useChangePasswordMutation()
    const navigate = useNavigate()

    const strength = getStrength(form.newPassword)
    const strengthColor = form.newPassword.length === 0 ? null : STRENGTH_COLORS[strength - 1]
    const strengthLabel = form.newPassword.length === 0
        ? 'Enter a password'
        : STRENGTH_LABELS[strength - 1] || 'Too short'

    const passwordsMatch = form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword
    const passwordsMismatch = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return }
        if (form.newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
        try {
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            }).unwrap()
            toast('Password changed successfully!', 'success')
            setTimeout(() => navigate('/profile'), 1500)
        } catch (err) {
            setError(err.data?.message || 'Failed to change password')
        }
    }

    return (
        <>
            <Helmet><title>Change Password — ShopNow</title></Helmet>

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

                        <div className="reset-icon-wrap">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="9" width="14" height="10" rx="2" stroke="#e94560" strokeWidth="1.5" />
                                <path d="M7 9V6a3 3 0 016 0v3" stroke="#e94560" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="10" cy="14" r="1.5" fill="#e94560" />
                            </svg>
                        </div>

                        <h1 className="auth-title">Change password</h1>
                        <p className="auth-subtitle">Keep your account secure with a strong password</p>
                    </div>

                    <div className="auth-card">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-5">
                                <label htmlFor="currentPassword" className="field-label">Current password</label>
                                <PasswordInput
                                    id="currentPassword"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="reset-divider" />

                            <div className="mb-2">
                                <label htmlFor="newPassword" className="field-label">New password</label>
                                <PasswordInput
                                    id="newPassword"
                                    value={form.newPassword}
                                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                    placeholder="Min. 6 characters"
                                />
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

                            <div className="mb-5">
                                <label htmlFor="confirmPassword" className="field-label">Confirm new password</label>

                                <PasswordInput
                                    id="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    placeholder="Repeat new password"
                                />
                                {passwordsMatch && (
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7l4 4 6-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span style={{ fontSize: 11, color: '#22c55e' }}>Passwords match</span>
                                    </div>
                                )}
                                {passwordsMismatch && (
                                    <p className="mismatch-text">Passwords do not match</p>
                                )}
                            </div>

                            {error && (
                                <div className="auth-error">
                                    <p className="auth-error__text">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn--primary btn--primary-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                            <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update password
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <Link to="/profile" className="back-link">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to profile
                    </Link>
                </div>
            </div>
        </>
    )
}