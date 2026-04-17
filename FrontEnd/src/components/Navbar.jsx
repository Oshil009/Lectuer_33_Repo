import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
    const navigate = useNavigate()
    const { user, logout, isAdmin } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{ background: '#1a1a2e', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <Link to="/" style={{ color: '#e94560', fontWeight: 'bold', fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>
                ShopNow
            </Link>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Home</Link>
                {user ? (
                    <>
                        <Link to="/cart" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Cart</Link>
                        <Link to="/favorites" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Favorites</Link>
                        <Link to="/orders" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Orders</Link>
                        <Link to="/resetPassword" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Password</Link>
                        {isAdmin && (
                            <Link to="/admin" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: 'bold', fontSize: 14 }}>Admin</Link>
                        )}
                        <span style={{ color: '#aaa', fontSize: 13 }}>Hi, {user.name}</span>
                        <button onClick={handleLogout} style={{ color: '#fff', background: '#e94560', border: 'none', padding: '5px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#ccc', textDecoration: 'none', fontSize: 14 }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', background: '#e94560', textDecoration: 'none', fontSize: 14, padding: '5px 14px', borderRadius: 4 }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
