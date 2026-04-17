import { useState } from 'react'
import { useChangePasswordMutation } from '../services/userApiSlice'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function ResetPassword() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [changePassword, { isLoading }] = useChangePasswordMutation()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match'); return }
        if (form.newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
        try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }).unwrap()
            setSuccess(true)
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setError(err.data?.message || 'Failed to change password')
        }
    }

    return (
        <>
            <Helmet>
                <title>Change Password ShopNow</title>
            </Helmet>
            <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
                <h2>Change Password</h2>
                {success ? (
                    <p style={{ color: 'green' }}>Password changed successfully! Redirecting...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>Current Password</label>
                        <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                        <label>New Password</label>
                        <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                        <label>Confirm New Password</label>
                        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                )}
                <p style={{ marginTop: 16 }}><Link to="/">Back to Home</Link></p>
            </div>
        </>
    )
}
