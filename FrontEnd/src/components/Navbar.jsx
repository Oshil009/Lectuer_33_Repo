import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useGetCartQuery } from '../services/cartApiSlice'

export default function Navbar() {
    const navigate = useNavigate()
    const { user, logout, isAdmin } = useAuth()
    const { data: cartData } = useGetCartQuery(undefined, { skip: !user })

    const cartCount = cartData?.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

    const handleLogout = useCallback(() => {
        logout()
        navigate('/login')
    }, [logout, navigate])

    return (
        <nav aria-label="Main navigation" className="navbar flex items-center justify-between px-8 h-16 sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 no-underline">
                <span className="navbar__logo-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3h10M4 3V2a1 1 0 012 0v1M8 3V2a1 1 0 012 0v1M2 3l1 8h8l1-8"
                            stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <span className="navbar__logo-text">
                    Shop<span className="navbar__logo-accent">Now</span>
                </span>
            </Link>

            <div className="flex items-center gap-1.5">
                <NavLink to="/">Home</NavLink>

                {user ? (
                    <>
                        <Link
                            to="/cart"
                            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
                            className="navbar__link flex items-center gap-1.5"
                        >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M1 1h2.5l1.6 7.4a1 1 0 00.98.8h5.84a1 1 0 00.97-.76L13.5 5H4"
                                    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="5.5" cy="12.5" r="1" fill="currentColor" />
                                <circle cx="11.5" cy="12.5" r="1" fill="currentColor" />
                            </svg>
                            Cart
                            {cartCount > 0 && (
                                <span aria-hidden="true" className="navbar__cart-badge">{cartCount}</span>
                            )}
                        </Link>

                        <NavLink to="/favorites">Favorites</NavLink>
                        <NavLink to="/orders">Orders</NavLink>
                        <NavLink to="/profile">Profile</NavLink>

                        {isAdmin && (
                            <Link to="/admin" className="navbar__admin-link">Admin</Link>
                        )}

                        <div className="navbar__divider" />

                        <div className="navbar__avatar-pill">
                            <div className="navbar__avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="navbar__username">{user.name}</span>
                        </div>

                        <button onClick={handleLogout} className="navbar__btn-logout">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <div className="navbar__divider" />
                        <Link to="/login" className="navbar__btn-login">Login</Link>
                        <Link to="/register" className="navbar__btn-register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

function NavLink({ to, children }) {
    return (
        <Link to={to} className="navbar__link">
            {children}
        </Link>
    )
}