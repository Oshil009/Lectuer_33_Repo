import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Cart from './components/Cart'
import Orders from './components/Orders'
import ProductDetail from './components/ProductDetail'
import AdminDashboard from './components/AdminDashboard'
import ResetPassword from './components/ResetPassword'
import Favorites from './components/Favorites'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div>
      <Helmet>
        <title>E-Commerce Store</title>
        <meta name="description" content="Browse our wide selection of products. Shop online with fast delivery." />
      </Helmet>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute><Favorites /></ProtectedRoute>
        } />
        <Route path="/resetPassword" element={
          <ProtectedRoute><ResetPassword /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
export default App
