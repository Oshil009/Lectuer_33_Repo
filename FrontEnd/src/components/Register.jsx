import { useState } from 'react'
import { useCreateUserMutation } from '../services/userApiSlice'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [createUser, { isLoading, error }] = useCreateUserMutation()
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createUser(form).unwrap()
            navigate('/login')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Helmet>
                <title>Create Account ShopNow</title>
                <meta name="description" content="Create a free ShopNow account and start shopping today." />
            </Helmet>
            <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6}
                        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box' }} />
                    {error && <p style={{ color: 'red' }}>{error.data?.message || 'Registration failed'}</p>}
                    <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </>
    )
}
