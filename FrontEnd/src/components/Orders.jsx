import { useGetMyOrdersQuery } from '../services/orderApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const STATUS = {
    pending:    { bg: '#fef9ec', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
    processing: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' },
    shipped:    { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe', dot: '#8b5cf6' },
    delivered:  { bg: '#f0fdf4', color: '#14532d', border: '#bbf7d0', dot: '#22c55e' },
    cancelled:  { bg: '#fef2f2', color: '#7f1d1d', border: '#fecaca', dot: '#e94560' },
}

export default function Orders() {
    const { data, isLoading, error } = useGetMyOrdersQuery()
    const navigate = useNavigate()

    if (isLoading) return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading orders...</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="state-center">
            <div className="text-center">
                <div className="error-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="9" stroke="#e94560" strokeWidth="1.5" />
                        <path d="M11 7v5M11 15v.5" stroke="#e94560" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Error loading orders</p>
            </div>
        </div>
    )

    const orders = data?.data || []

    if (orders.length === 0) return (
        <>
            <Helmet><title>My Orders — ShopNow</title></Helmet>
            <div className="state-center">
                <div className="empty-state">
                    <div className="empty-state__icon-wrap bg-[var(--bg-page)] border border-[var(--border-card)]">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect x="4" y="6" width="20" height="18" rx="2" stroke="#d1d5db" strokeWidth="1.4" />
                            <path d="M9 6V5a5 5 0 0110 0v1M9 13h10M9 17h6" stroke="#d1d5db" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="empty-state__title">No orders yet</p>
                    <p className="empty-state__text">Place your first order and track it here</p>
                    <button onClick={() => navigate('/')} className="btn btn--primary">Start Shopping</button>
                </div>
            </div>
        </>
    )

    return (
        <>
            <Helmet>
                <title>My Orders — ShopNow</title>
                <meta name="description" content="Track all your orders and delivery status." />
            </Helmet>

            <div className="page">
                <div className="page-inner" style={{ maxWidth: 780 }}>

                    <div className="mb-6">
                        <h1 className="home-title">My Orders</h1>
                        <p className="home-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {orders.map(order => {
                            const s = STATUS[order.status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb', dot: '#9ca3af' }
                            return (
                                <div key={order._id} className="order-card card">

                                    <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-[var(--border-row)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-page)]">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <rect x="2" y="3" width="11" height="10" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
                                                    <path d="M5 3V2.5a2.5 2.5 0 015 0V3M4.5 7.5h6M4.5 10h4"
                                                        stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                                                <p className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="status-badge"
                                            style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                            <span className="status-badge__dot" style={{ background: s.dot }} />
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="px-5 py-3 flex flex-col gap-3">
                                        {order.items.map(item => (
                                            <div key={item._id} className="flex items-center gap-3">
                                                <div className="order-thumb"
                                                    style={{ cursor: item.productId ? 'pointer' : 'default' }}
                                                    onClick={() => item.productId && navigate(`/products/${item.productId.slug || item.productId._id}`)}>
                                                    {item.productId?.imagesUrl?.[0] ? (
                                                        <img src={item.productId.imagesUrl[0]} alt={item.productId.name}
                                                            className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                <rect x="1" y="5" width="16" height="10" rx="1.5" stroke="#d1d5db" strokeWidth="1.2" />
                                                                <circle cx="6" cy="9" r="1.5" stroke="#d1d5db" strokeWidth="1.2" />
                                                                <path d="M1 13l4-3 3 2 3-2.5 6 4" stroke="#d1d5db" strokeWidth="1.2" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="order-item-name"
                                                        style={{ cursor: item.productId ? 'pointer' : 'default' }}
                                                        onClick={() => item.productId && navigate(`/products/${item.productId?.slug || item.productId?._id}`)}>
                                                        {item.productId?.name || 'Product deleted'}
                                                    </p>
                                                    <p className="text-xs mt-0.5 m-0 text-[var(--text-hint)]">
                                                        {item.quantity} × ${item.price}
                                                    </p>
                                                </div>

                                                <p className="text-sm font-bold m-0 flex-shrink-0 text-[var(--text-primary)]">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3 border-t border-[var(--border-row)]">
                                        <div className="flex items-center gap-1.5">
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                <path d="M6.5 1.5C4.3 1.5 2.5 3.3 2.5 5.5c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                                    stroke="#9ca3af" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            </svg>
                                            <p className="text-xs m-0 text-[var(--text-hint)]">
                                                {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                                {order.shippingAddress?.phone && ` · ${order.shippingAddress.phone}`}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold m-0 text-[var(--brand)]">
                                            ${order.totalPrice?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
