import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useGetCartQuery } from '../services/cartApiSlice'
import { useDispatch } from 'react-redux';
import { userApiSlice } from '../services/userApiSlice';

export default function Navbar() {
    const navigate = useNavigate()
    const { user, logout, isAdmin } = useAuth()
    const { data: cartData } = useGetCartQuery(undefined, { skip: !user || isAdmin })
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch = useDispatch();
    const cartCount = cartData?.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
    const handleLogout = useCallback(() => {
        logout()
        dispatch(userApiSlice.util.resetApiState());
        navigate('/login')
        setMenuOpen(false)
    }, [logout, navigate, dispatch])

    const close = () => setMenuOpen(false)

    return (
        <nav aria-label="Main navigation" className="navbar sticky top-0 z-50">
            <div className="flex items-center justify-between px-5 h-14">
                <Link to="/" className="flex items-center gap-2 no-underline" onClick={close}>
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
                <div className="hidden-mobile flex items-center gap-1.5">
                    {user ? (
                        <>
                            {isAdmin ? (
                                <>
                                    <Link to="/admin" className="navbar__admin-link" onClick={close}>Admin</Link>
                                    <NavLink to="/profile" onClick={close}>Profile</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/" onClick={close}>Home</NavLink>
                                    <CartLink cartCount={cartCount} onClick={close} />
                                    <NavLink to="/favorites" onClick={close}>Favorites</NavLink>
                                    <NavLink to="/orders" onClick={close}>Orders</NavLink>
                                    <NavLink to="/profile" onClick={close}>Profile</NavLink>
                                </>
                            )}
                            <div className="navbar__divider" />
                            <div className="navbar__avatar-pill">
                                <div className="navbar__avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                <span className="navbar__username">{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="navbar__btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" onClick={close}>Home</NavLink>
                            <div className="navbar__divider" />
                            <Link to="/login" className="navbar__btn-login" onClick={close}>Login</Link>
                            <Link to="/register" className="navbar__btn-register" onClick={close}>Register</Link>
                        </>
                    )}
                </div>
                <div className="show-mobile flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            className="navbar__hamburger"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3 3l12 12M15 3L3 15" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M2 4h14M2 9h14M2 14h14" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>

                        {menuOpen && (
                            <>
                                <div className="navbar__backdrop" onClick={close} />
                                <div className="navbar__dropdown">
                                    {user && (
                                        <div className="navbar__dropdown-user">
                                            <div className="navbar__avatar navbar__avatar--lg">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="navbar__mobile-name">{user.name}</p>
                                                {isAdmin && <span className="admin-badge">Admin</span>}
                                            </div>
                                        </div>
                                    )}

                                    {user ? (
                                        <>
                                            {isAdmin ? (
                                                <>
                                                    <MobileLink to="/admin" onClick={close}>Admin</MobileLink>
                                                    <MobileLink to="/profile" onClick={close}>Profile</MobileLink>
                                                </>
                                            ) : (
                                                <>
                                                    <MobileLink to="/" onClick={close}>Home</MobileLink>
                                                    <MobileLink to="/cart" onClick={close}>
                                                        Cart {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
                                                    </MobileLink>
                                                    <MobileLink to="/favorites" onClick={close}>Favorites</MobileLink>
                                                    <MobileLink to="/orders" onClick={close}>Orders</MobileLink>
                                                    <MobileLink to="/profile" onClick={close}>Profile</MobileLink>
                                                </>
                                            )}
                                            <div className="navbar__mobile-divider" />
                                            <button onClick={handleLogout} className="navbar__mobile-logout">Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <MobileLink to="/" onClick={close}>Home</MobileLink>
                                            <div className="navbar__mobile-divider" />
                                            <Link to="/login" className="navbar__mobile-auth-btn navbar__mobile-auth-btn--outline" onClick={close}>Login</Link>
                                            <Link to="/register" className="navbar__mobile-auth-btn navbar__mobile-auth-btn--fill" onClick={close}>Register</Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    )
}

function NavLink({ to, children, onClick }) {
    return <Link to={to} className="navbar__link" onClick={onClick}>{children}</Link>
}

function CartLink({ cartCount, onClick }) {
    return (
        <Link to="/cart" aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
            className="navbar__link flex items-center gap-1.5" onClick={onClick}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 1h2.5l1.6 7.4a1 1 0 00.98.8h5.84a1 1 0 00.97-.76L13.5 5H4"
                    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5.5" cy="12.5" r="1" fill="currentColor" />
                <circle cx="11.5" cy="12.5" r="1" fill="currentColor" />
            </svg>
            Cart
            {cartCount > 0 && <span aria-hidden="true" className="navbar__cart-badge">{cartCount}</span>}
        </Link>
    )
}

function MobileLink({ to, children, onClick }) {
    return (
        <Link to={to} className="navbar__mobile-link" onClick={onClick}>
            {children}
        </Link>
    )
}