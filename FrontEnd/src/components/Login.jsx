import { useState } from 'react'
import { useLoginMutation } from '../services/userApiSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loginMutation, { isLoading, error }] = useLoginMutation()
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await loginMutation(form).unwrap()
            login(result.token, result.data)
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Helmet>
                <title>Login ShopNow</title>
                <meta name="description" content="Sign in to your ShopNow account to access your cart, orders and favorites." />
            </Helmet>
            <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required
                        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                    {error && <p style={{ color: 'red' }}>{error.data?.message || 'Login failed'}</p>}
                    <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </>
    )
}
