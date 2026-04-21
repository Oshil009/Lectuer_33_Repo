import { useState } from 'react'
import { useGetCartQuery, useRemoveFromCartMutation, useAddToCartMutation, useClearCartMutation } from '../services/cartApiSlice'
import { useCreateOrderMutation } from '../services/orderApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast, confirm } from '../utils/swal'

const FIELDS = [
    { key: 'city', placeholder: 'City', icon: <path d="M7 2C4.2 2 2 4.2 2 7c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5zm0 6.5A1.5 1.5 0 117 5a1.5 1.5 0 010 3z" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
    { key: 'street', placeholder: 'Street address', icon: <path d="M1 11h12M3 11V5l4-3 4 3v6M5 11V8h4v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
    { key: 'phone', placeholder: 'Phone number', icon: <path d="M9.5 1h-5A1.5 1.5 0 003 2.5v9A1.5 1.5 0 004.5 13h5A1.5 1.5 0 0011 11.5v-9A1.5 1.5 0 009.5 1zM7 11.5h.01" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
]

export default function Cart() {
    const { data, isLoading, error } = useGetCartQuery()
    const [removeFromCart] = useRemoveFromCartMutation()
    const [addToCart] = useAddToCartMutation()
    const [clearCart] = useClearCartMutation()
    const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation()
    const navigate = useNavigate()

    const [shippingAddress, setShippingAddress] = useState({ city: '', street: '', phone: '' })
    const [showCheckout, setShowCheckout] = useState(false)
    const [orderError, setOrderError] = useState('')

    if (isLoading) return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading cart...</p>
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
                <p className="text-sm font-semibold text-[var(--text-primary)]">Error loading cart</p>
            </div>
        </div>
    )

    const items = data?.data?.items || []
    const totalPrice = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0)

    const handleRemove = async (productId, name) => {
        const result = await confirm(`Remove "${name}" from cart?`, '', 'Remove')
        if (!result.isConfirmed) return
        try { await removeFromCart({ productId }).unwrap(); toast('Item removed', 'info') }
        catch (err) { toast(err.data?.message || 'Failed to remove', 'error') }
    }

    const handleQtyChange = async (productId, delta, currentQty, stock) => {
        const newQty = currentQty + delta
        if (newQty < 1) {
            const result = await confirm('Remove this item from cart?', '', 'Remove')
            if (!result.isConfirmed) return
            try { await removeFromCart({ productId }).unwrap(); toast('Item removed', 'info') }
            catch (err) { toast(err.data?.message || 'Failed', 'error') }
            return
        }
        if (newQty > stock) { toast('Not enough stock', 'warning'); return }
        try { await addToCart({ productId, quantity: delta }).unwrap() }
        catch (err) { toast(err.data?.message || 'Failed to update', 'error') }
    }

    const handleClearCart = async () => {
        const result = await confirm('Clear entire cart?', 'All items will be removed.', 'Clear Cart')
        if (!result.isConfirmed) return
        try { await clearCart().unwrap(); toast('Cart cleared', 'info') }
        catch (err) {
            toast('Failed to clear cart', 'error');
            console.log(err.message);
        }
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setOrderError('')
        const orderItems = items.map(item => ({ productId: item.productId._id, quantity: item.quantity }))
        try {
            await createOrder({ items: orderItems, shippingAddress }).unwrap()
            try { await clearCart().unwrap() } catch (err) {
                toast('Order placed successfully! 🎉', 'success')
                console.log(err.message);
                setTimeout(() => navigate('/orders'), 1500)
            }

        } catch (err) {
            setOrderError(err.data?.message || 'Failed to place order')
        }
    }

    if (items.length === 0) return (
        <>
            <Helmet><title>Cart — ShopNow</title></Helmet>
            <div className="state-center">
                <div className="empty-state">
                    <div className="empty-state__icon-wrap bg-[var(--bg-page)] border border-[var(--border-card)]">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M2 2h5l3 14h12l3-10H8" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="11" cy="23" r="1.5" fill="#d1d5db" />
                            <circle cx="21" cy="23" r="1.5" fill="#d1d5db" />
                        </svg>
                    </div>
                    <p className="empty-state__title">Your cart is empty</p>
                    <p className="empty-state__text">Add some products to get started</p>
                    <button onClick={() => navigate('/')} className="btn btn--primary">Browse Products</button>
                </div>
            </div>
        </>
    )

    return (
        <>
            <Helmet><title>{`My Cart (${items.length}) — ShopNow`}</title></Helmet>

            <div className="page">
                <div className="page-inner" style={{ maxWidth: 740 }}>

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="home-title">My Cart</h1>
                            <p className="home-count">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button onClick={handleClearCart} className="btn--ghost-danger flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Clear Cart
                        </button>
                    </div>

                    <div className="card overflow-hidden mb-4">
                        {items.map((item, i) => (
                            <div key={item._id}
                                className={`flex items-center gap-4 px-5 py-4 ${i < items.length - 1 ? 'border-b border-[var(--border-row)]' : ''}`}>

                                <div className="cart-item-img"
                                    onClick={() => navigate(`/products/${item.productId.slug || item.productId._id}`)}>
                                    {item.productId?.imagesUrl?.[0] ? (
                                        <img src={item.productId.imagesUrl[0]} alt={item.productId.name}
                                            className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                <rect x="2" y="6" width="18" height="12" rx="2" stroke="#d1d5db" strokeWidth="1.2" />
                                                <circle cx="8" cy="11" r="2" stroke="#d1d5db" strokeWidth="1.2" />
                                                <path d="M2 16l5-4 4 3 3-2.5 6 4" stroke="#d1d5db" strokeWidth="1.2" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="cart-item-name"
                                        onClick={() => navigate(`/products/${item.productId.slug || item.productId._id}`)}>
                                        {item.productId?.name}
                                    </h4>
                                    <p className="cart-item-price-each">${item.productId?.price} each</p>
                                    <div className="qty-control qty-control--small">
                                        <button onClick={() => handleQtyChange(item.productId._id, -1, item.quantity, item.productId?.stock)}
                                            aria-label="Decrease quantity" className="qty-control__btn">−</button>
                                        <span className="qty-control__val">{item.quantity}</span>
                                        <button onClick={() => handleQtyChange(item.productId._id, 1, item.quantity, item.productId?.stock)}
                                            aria-label="Increase quantity" className="qty-control__btn">+</button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <p className="cart-total-price">${(item.productId?.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => handleRemove(item.productId._id, item.productId?.name)}
                                        className="btn--ghost-danger flex items-center gap-1">
                                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                            <path d="M1.5 2.5h8M4 2.5V1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M2.5 2.5l.5 7h5.5l.5-7"
                                                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-row)]">
                            <span className="text-sm font-medium text-[var(--text-muted)]">Subtotal</span>
                            <span className="text-xl font-bold text-[var(--text-primary)]">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        {!showCheckout ? (
                            <button onClick={() => setShowCheckout(true)}
                                className="btn btn--success btn--primary-full flex items-center justify-center gap-2 tracking-wide">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <path d="M2 7.5h11M8.5 3l4.5 4.5-4.5 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Proceed to Checkout
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-sm font-semibold mt-0 mb-4 text-[var(--text-primary)]">
                                    Shipping Address
                                </h3>
                                <form onSubmit={handlePlaceOrder}>
                                    {FIELDS.map(({ key, placeholder, icon }) => (
                                        <div key={key} className="relative mb-3">
                                            <div className="field-icon">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">{icon}</svg>
                                            </div>
                                            <input
                                                type={key === 'phone' ? 'tel' : 'text'}
                                                placeholder={placeholder}
                                                value={shippingAddress[key]}
                                                onChange={e => setShippingAddress({ ...shippingAddress, [key]: e.target.value })}
                                                required
                                                className="field field--icon-left"
                                            />
                                        </div>
                                    ))}

                                    {orderError && (
                                        <div className="auth-error">
                                            <p className="auth-error__text">{orderError}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2.5 mt-4">
                                        <button type="button" onClick={() => setShowCheckout(false)}
                                            className="btn btn--secondary flex items-center gap-1.5">
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                <path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Back
                                        </button>
                                        <button type="submit" disabled={isOrdering}
                                            className="btn btn--success flex-1 flex items-center justify-center gap-2">
                                            {isOrdering ? (
                                                <>
                                                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none">
                                                        <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                                                        <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    Placing Order...
                                                </>
                                            ) : (
                                                <>
                                                    Place Order
                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                        <path d="M2 6.5h9M7.5 3l3.5 3.5-3.5 3.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
