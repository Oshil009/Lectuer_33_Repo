import { useState, useMemo } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation, useToggleFavoriteMutation } from '../services/userApiSlice'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast, confirm } from '../utils/swal'

const TABS = [
    { key: 'info',      label: 'Account Info' },
    { key: 'favorites', label: (n) => `Favorites (${n})` },
    { key: 'stats',     label: 'Stats' },
]

export default function Profile() {
    const { login, token } = useAuth()
    const navigate = useNavigate()
    const { data: profileData, isLoading, refetch } = useGetProfileQuery()
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
    const [toggleFavorite] = useToggleFavoriteMutation()

    const [editMode, setEditMode]   = useState(false)
    const [form, setForm]           = useState(null)
    const [errorMsg, setErrorMsg]   = useState('')
    const [activeTab, setActiveTab] = useState('info')

    const profile = profileData?.data

    const daysAsMember = useMemo(() => {
        if (!profile) return 0
        return Math.floor((new Date() - new Date(profile.createdAt)) / 86400000)
    }, [profile])

    if (isLoading) return <p className="text-center mt-10 text-[var(--text-muted)]">Loading profile...</p>
    if (!profile)  return <p className="text-center mt-10 text-[var(--brand)]">Failed to load profile</p>

    const favorites = profile.favorites || []
    const initials  = profile.name?.[0]?.toUpperCase() ?? '?'
    const isAdmin   = profile.role?.role === 'admin'

    const handleEditClick = () => {
        setForm({ name: profile.name || '', email: profile.email || '' })
        setEditMode(v => !v)
        setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        if (!form.name.trim())  { setErrorMsg('Name is required');  return }
        if (!form.email.trim()) { setErrorMsg('Email is required'); return }
        try {
            const result = await updateProfile(form).unwrap()
            login(token, result.data)
            setEditMode(false)
            setForm(null)
            refetch()
            toast('Profile updated successfully!')
        } catch (err) {
            setErrorMsg(err.data?.message || 'Failed to update profile')
        }
    }

    const handleRemoveFavorite = async (productId, name) => {
        const result = await confirm(`Remove "${name}" from favorites?`, '', 'Remove')
        if (!result.isConfirmed) return
        try {
            await toggleFavorite(productId).unwrap()
            refetch()
            toast('Removed from favorites', 'info')
        } catch (err) {
            toast(err.data?.message || 'Failed', 'error')
        }
    }

    const INFO_ROWS = [
        { label: 'Full Name',       value: profile.name },
        { label: 'Email Address',   value: profile.email },
        { label: 'Account Role',    value: profile.role?.role || 'user', accent: true },
        { label: 'Member Since',    value: new Date(profile.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Last Updated',    value: new Date(profile.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Saved Favorites', value: `${favorites.length} product${favorites.length !== 1 ? 's' : ''}` },
    ]

    const STAT_CARDS = [
        { label: 'Saved Favorites',  value: favorites.length, colorClass: 'text-[var(--brand)]',        bgClass: 'bg-[var(--brand-light)]' },
        { label: 'Account Type',     value: profile.role?.role || 'user', colorClass: 'text-[var(--text-primary)]', bgClass: 'bg-[var(--bg-page)]' },
        { label: 'Profile Complete', value: profile.name && profile.email ? '100%' : '50%', colorClass: 'text-green-500', bgClass: 'bg-green-50' },
        { label: 'Days as Member',   value: daysAsMember, colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
    ]

    return (
        <>
            <Helmet>
                <title>My Profile — ShopNow</title>
                <meta name="description" content="Manage your ShopNow profile, favorites and account settings." />
            </Helmet>

            <div className="page">
                <div className="page-inner profile-page">

                    <div className="card profile-hero mb-5">
                        <div className="profile-avatar">{initials}</div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="profile-name">{profile.name}</h2>
                                {isAdmin && <span className="admin-badge">Admin</span>}
                            </div>
                            <p className="profile-email">{profile.email}</p>
                            <p className="profile-meta">
                                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                &nbsp;·&nbsp;{daysAsMember} days
                            </p>
                        </div>

                        <button onClick={handleEditClick} className="profile-edit-btn">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M9 2l2 2-7 7H2V9l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {editMode ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {editMode && (
                        <div className="card p-6 mb-5">
                            <h3 className="text-sm font-semibold mt-0 mb-5 text-[var(--text-primary)]">Edit Profile</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="field-label">Full name</label>
                                    <input type="text" required value={form?.name ?? ''}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="field" />
                                </div>
                                <div className="mb-5">
                                    <label className="field-label">Email address</label>
                                    <input type="email" required value={form?.email ?? ''}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="field" />
                                </div>
                                {errorMsg && (
                                    <div className="auth-error">
                                        <p className="auth-error__text">{errorMsg}</p>
                                    </div>
                                )}
                                <div className="flex gap-2.5">
                                    <button type="submit" disabled={isSaving} className="btn btn--primary flex-1">
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={() => navigate('/resetPassword')} className="btn btn--secondary flex-1">
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="card tab-bar mb-5">
                        {TABS.map(({ key, label }) => {
                            const lbl = typeof label === 'function' ? label(favorites.length) : label
                            return (
                                <button key={key} onClick={() => setActiveTab(key)}
                                    className={`tab-btn ${activeTab === key ? 'tab-btn--active' : ''}`}>
                                    {lbl}
                                </button>
                            )
                        })}
                    </div>

                    {activeTab === 'info' && (
                        <div className="card overflow-hidden">
                            {INFO_ROWS.map(({ label, value, accent }, i) => (
                                <div key={label}
                                    className={`info-row ${i < INFO_ROWS.length - 1 ? 'border-b border-[var(--border-row)]' : ''}`}>
                                    <span className="info-row__label">{label}</span>
                                    <span className={accent ? 'info-row__value--accent' : 'info-row__value'}>{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <>
                            {favorites.filter(p => typeof p === 'object').length === 0 ? (
                                <div className="card empty-state">
                                    <div className="empty-state__icon-wrap bg-[var(--brand-light)]">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 17S3 12 3 7a4 4 0 018-1.6A4 4 0 0117 7c0 5-7 10-7 10z"
                                                stroke="#e94560" strokeWidth="1.5" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="empty-state__title">No favorites yet</p>
                                    <button onClick={() => navigate('/')} className="btn btn--primary">
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))' }}>
                                    {favorites.filter(p => typeof p === 'object').map(product => (
                                        <div key={product._id}
                                            onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                            className="fav-card">
                                            <button
                                                onClick={e => { e.stopPropagation(); handleRemoveFavorite(product._id, product.name) }}
                                                className="fav-remove-btn"
                                                title="Remove from favorites">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="#e94560">
                                                    <path d="M6 10.5S1 7 1 3.5A2.5 2.5 0 016 2.1 2.5 2.5 0 0111 3.5C11 7 6 10.5 6 10.5z" />
                                                </svg>
                                            </button>

                                            {product.imagesUrl?.[0] ? (
                                                <img src={product.imagesUrl[0]} alt={product.name}
                                                    width="200" height="120"
                                                    className="fav-card__img" loading="lazy" />
                                            ) : (
                                                <div className="fav-card__img-placeholder">
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                                        <rect x="3" y="7" width="22" height="14" rx="2" stroke="#d1d5db" strokeWidth="1.3" />
                                                        <path d="M8 21v2M20 21v2" stroke="#d1d5db" strokeWidth="1.3" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            )}

                                            <h4 className="capitalize text-xs font-semibold m-0 mb-1 text-[var(--text-primary)] pr-6">
                                                {product.name}
                                            </h4>
                                            <p className="font-bold m-0 mb-1 text-sm text-[var(--brand)]">${product.price}</p>
                                            <p className={`m-0 text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-[var(--brand)]'}`}>
                                                {product.stock > 0 ? 'In stock' : 'Out of stock'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))' }}>
                            {STAT_CARDS.map(({ label, value, colorClass, bgClass }) => (
                                <div key={label} className="card stat-card">
                                    <div className={`stat-card__icon-wrap ${bgClass}`}>
                                        <p className={`stat-card__value ${colorClass}`}>{value}</p>
                                    </div>
                                    <p className="stat-card__label">{label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
