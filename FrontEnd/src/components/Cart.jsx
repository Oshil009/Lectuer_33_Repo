import { useState } from 'react'
import { useGetCartQuery, useRemoveFromCartMutation, useAddToCartMutation } from '../services/cartApiSlice'
import { useCreateOrderMutation } from '../services/orderApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
    const { data, isLoading, error } = useGetCartQuery()
    const [removeFromCart] = useRemoveFromCartMutation()
    const [addToCart] = useAddToCartMutation()
    const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation()
    const navigate = useNavigate()

    const [shippingAddress, setShippingAddress] = useState({ city: '', street: '', phone: '' })
    const [showCheckout, setShowCheckout] = useState(false)
    const [orderError, setOrderError] = useState('')

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading cart...</p>
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>Error loading cart</p>

    const items = data?.data?.items || []
    const totalPrice = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0)

    const handleRemove = async (productId) => {
        try { await removeFromCart({ productId }).unwrap() }
        catch (err) { alert(err.data?.message || 'Failed to remove item') }
    }

    const handleQtyChange = async (productId, delta, currentQty, stock) => {
        const newQty = currentQty + delta
        if (newQty < 1) { handleRemove(productId); return }
        if (newQty > stock) return
        try { await addToCart({ productId, quantity: delta }).unwrap() }
        catch (err) { alert(err.data?.message || 'Failed to update quantity') }
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setOrderError('')
        const orderItems = items.map(item => ({ productId: item.productId._id, quantity: item.quantity }))
        try {
            await createOrder({ items: orderItems, shippingAddress }).unwrap()
            navigate('/orders')
        } catch (err) {
            setOrderError(err.data?.message || 'Failed to place order')
        }
    }

    if (items.length === 0) return (
        <>
            <Helmet>
                <title>{"Cart ShopNow"}</title>
            </Helmet>
            <div style={{ textAlign: 'center', marginTop: 60 }}>
                <h2> Your cart is empty</h2>
                <button onClick={() => navigate('/')} style={{ padding: '10px 24px', marginTop: 16, cursor: 'pointer', borderRadius: 6 }}>Browse Products</button>
            </div>
        </>
    )

    return (
        <>
            <Helmet>
                <title>{`My Cart (${items.length}) ShopNow`}</title>
            </Helmet>
            <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
                <h2>My Cart <span style={{ fontSize: 16, color: '#888', fontWeight: 'normal' }}>({items.length} item{items.length !== 1 ? 's' : ''})</span></h2>

                {items.map(item => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 16 }}>
                        {item.productId?.imagesUrl?.[0] && (
                            <img src={item.productId.imagesUrl[0]} alt={item.productId.name}
                                onClick={() => navigate(`/products/${item.productId._id}`)}
                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }} />
                        )}
                        <div style={{ flex: 1 }}>
                            <h4 onClick={() => navigate(`/products/${item.productId._id}`)}
                                style={{ margin: 0, textTransform: 'capitalize', cursor: 'pointer', textDecoration: 'underline', color: '#1a1a2e' }}>
                                {item.productId?.name}
                            </h4>
                            <p style={{ margin: '4px 0', color: '#888', fontSize: 13 }}>${item.productId?.price} each</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                <button onClick={() => handleQtyChange(item.productId._id, -1, item.quantity, item.productId?.stock)}
                                    style={{ width: 28, height: 28, cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd', fontSize: 16 }}>−</button>
                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                <button onClick={() => handleQtyChange(item.productId._id, 1, item.quantity, item.productId?.stock)}
                                    style={{ width: 28, height: 28, cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd', fontSize: 16 }}>+</button>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 8px', fontWeight: 'bold', fontSize: 16 }}>${(item.productId?.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => handleRemove(item.productId._id)}
                                style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div style={{ textAlign: 'right', fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#1a1a2e' }}>
                    Total: ${totalPrice.toFixed(2)}
                </div>

                {!showCheckout ? (
                    <button onClick={() => setShowCheckout(true)}
                        style={{ width: '100%', padding: 13, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}>
                        Proceed to Checkout
                    </button>
                ) : (
                    <form onSubmit={handlePlaceOrder} style={{ background: '#f9f9f9', padding: 24, borderRadius: 10 }}>
                        <h3 style={{ marginTop: 0 }}>Shipping Address</h3>
                        <input placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 9, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
                        <input placeholder="Street" value={shippingAddress.street} onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 9, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
                        <input placeholder="Phone" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} required
                            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 9, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
                        {orderError && <p style={{ color: 'red' }}>{orderError}</p>}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="button" onClick={() => setShowCheckout(false)}
                                style={{ flex: 1, padding: 10, cursor: 'pointer', borderRadius: 6, border: '1px solid #ddd' }}>Back</button>
                            <button type="submit" disabled={isOrdering}
                                style={{ flex: 2, padding: 10, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
                                {isOrdering ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    )
}
