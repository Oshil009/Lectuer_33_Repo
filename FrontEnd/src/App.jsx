import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import './App.css'
import Footer from './components/Footer'

const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const AuthCallback = lazy(() => import('./components/AuthCallback'))
const Cart = lazy(() => import('./components/Cart'))
const Orders = lazy(() => import('./components/Orders'))
const ProductDetail = lazy(() => import('./components/ProductDetail'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const ResetPassword = lazy(() => import('./components/ResetPassword'))
const Favorites = lazy(() => import('./components/Favorites'))
const Profile = lazy(() => import('./components/Profile'))

function PageLoader() {
  return (
    <div className="page-loader">
      <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="rgba(233,69,96,0.2)" strokeWidth="2.5" />
        <path d="M10 2a8 8 0 018 8" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      Loading...
    </div>
  )
}

function App() {
  const { isAdmin } = useAuth()

  return (
    <div>
      <Helmet>
        <title>ShopNow</title>
        <meta name="description" content="Browse our wide selection of products. Shop online with fast delivery." />
      </Helmet>
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/resetPassword" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App