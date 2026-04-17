import { useGetMyOrdersQuery } from '../services/orderApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const STATUS_COLORS = {
    pending: '#f39c12',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#27ae60',
    cancelled: '#e74c3c',
}

export default function Orders() {
    const { data, isLoading, error } = useGetMyOrdersQuery()
    const navigate = useNavigate()

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading orders...</p>
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>Error loading orders</p>

    const orders = data?.data || []

    if (orders.length === 0) return (
        <>
            <Helmet><title>My Orders — ShopNow</title></Helmet>
            <div style={{ textAlign: 'center', marginTop: 60 }}>
                <h2>No orders yet</h2>
                <button onClick={() => navigate('/')} style={{ padding: '10px 24px', marginTop: 16, cursor: 'pointer', borderRadius: 6 }}>Start Shopping</button>
            </div>
        </>
    )

    return (
        <>
            <Helmet>
                <title>My Orders ShopNow</title>
                <meta name="description" content="Track all your orders and their delivery status." />
            </Helmet>
            <div style={{ maxWidth: 820, margin: '40px auto', padding: 24 }}>
                <h2>My Orders <span style={{ fontSize: 15, fontWeight: 'normal', color: '#888' }}>({orders.length})</span></h2>

                {orders.map(order => (
                    <div key={order._id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 20, marginBottom: 20, background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#888' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <span style={{ background: STATUS_COLORS[order.status] || '#888', color: '#fff', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {order.status}
                            </span>
                        </div>

                        {order.items.map(item => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                {item.productId?.imagesUrl?.[0] && (
                                    <img src={item.productId.imagesUrl[0]} alt={item.productId.name}
                                        style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6 }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, textTransform: 'capitalize', fontSize: 14 }}>{item.productId?.name || 'Product deleted'}</p>
                                    <p style={{ margin: '2px 0', fontSize: 12, color: '#888' }}>Qty: {item.quantity} × ${item.price}</p>
                                </div>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: 14 }}>${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                        ))}

                        <div style={{ borderTop: '1px solid #eee', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                                {order.shippingAddress?.street}, {order.shippingAddress?.city} &nbsp;{order.shippingAddress?.phone}
                            </p>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: 16 }}>Total: ${order.totalPrice?.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
