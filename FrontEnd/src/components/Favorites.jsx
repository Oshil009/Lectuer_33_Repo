import { useGetProfileQuery, useToggleFavoriteMutation } from '../services/userApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast, confirm } from '../utils/swal'

export default function Favorites() {
    const navigate = useNavigate()
    const { data: profileData, isLoading, refetch } = useGetProfileQuery()
    const [toggleFavorite] = useToggleFavoriteMutation()
    const [addToCart] = useAddToCartMutation()

    if (isLoading) return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading favorites...</p>
            </div>
        </div>
    )

    const favorites = (profileData?.data?.favorites || []).filter(p => typeof p === 'object')

    const handleRemove = async (e, productId, name) => {
        e.stopPropagation()
        const result = await confirm(`Remove "${name}" from favorites?`, '', 'Remove')
        if (!result.isConfirmed) return
        try { await toggleFavorite(productId).unwrap(); refetch(); toast('Removed from favorites', 'info') }
        catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation()
        try { await addToCart({ productId, quantity: 1 }).unwrap(); toast('Added to cart!') }
        catch (err) { toast(err.data?.message || 'Failed to add to cart', 'error') }
    }

    return (
        <>
            <Helmet>
                <title>My Favorites — ShopNow</title>
                <meta name="description" content="View and manage your favorite products on ShopNow." />
            </Helmet>

            <div className="page">
                <div className="page-inner" style={{ maxWidth: 960 }}>

                    <div className="home-header">
                        <div>
                            <h1 className="home-title">My Favorites</h1>
                            {favorites.length > 0 && (
                                <p className="home-count">{favorites.length} saved item{favorites.length !== 1 ? 's' : ''}</p>
                            )}
                        </div>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="card card--xl empty-state">
                            <div className="empty-state__icon-wrap bg-[var(--brand-light)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 21S4 15 4 9a5 5 0 0110 0 5 5 0 0110 0c0 6-8 12-8 12z"
                                        stroke="#e94560" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="empty-state__title">No favorites saved yet</p>
                            <p className="empty-state__text">Browse products and tap the heart to save them here</p>
                            <button onClick={() => navigate('/')} className="btn btn--primary">Browse Products</button>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {favorites.map(product => (
                                <article
                                    key={product._id}
                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                    className="product-card relative">

                                    <button
                                        onClick={e => handleRemove(e, product._id, product.name)}
                                        title="Remove from favorites"
                                        className="fav-remove-btn">
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="#e94560">
                                            <path d="M6.5 11S1.5 7.5 1.5 4.5a2.5 2.5 0 015-1 2.5 2.5 0 015 1C11.5 7.5 6.5 11 6.5 11z" />
                                        </svg>
                                    </button>

                                    <div className="product-card__img-wrap">
                                        {product.imagesUrl?.[0] ? (
                                            <img src={product.imagesUrl[0]} alt={product.name}
                                                loading="lazy" className="product-card__img" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                    <rect x="2" y="8" width="28" height="16" rx="2.5" stroke="#d1d5db" strokeWidth="1.3" />
                                                    <circle cx="12" cy="14" r="2.5" stroke="#d1d5db" strokeWidth="1.3" />
                                                    <path d="M2 21l8-5 5 3.5 5-4 10 6" stroke="#d1d5db" strokeWidth="1.3" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {product.categoryId?.title && (
                                        <span className="product-card__category">{product.categoryId.title}</span>
                                    )}

                                    <h4 className="product-card__name pr-7">{product.name}</h4>

                                    <div className="flex items-center justify-between mb-3">
                                        <p className="product-card__price">${product.price}</p>
                                        <div className="flex items-center gap-1">
                                            <span className="product-card__stock-dot"
                                                style={{ background: product.stock > 0 ? '#22c55e' : 'var(--brand)' }} />
                                            <span className="product-card__stock-text"
                                                style={{ color: product.stock > 0 ? '#15803d' : '#b91c1c' }}>
                                                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={e => handleAddToCart(e, product._id)}
                                        disabled={product.stock === 0}
                                        aria-label={`Add ${product.name} to cart`}
                                        className={`btn w-full py-2 text-sm tracking-wide flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border-none ${product.stock === 0 ? 'bg-[var(--bg-muted)] text-[var(--text-hint)] cursor-not-allowed' : 'bg-[var(--brand)] text-white cursor-pointer'}`}>
                                        <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                                            <path d="M1 1h2.5l1.6 7.4a1 1 0 00.98.8h5.84a1 1 0 00.97-.76L13.5 5H4"
                                                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="5.5" cy="12.5" r="1" fill="currentColor" />
                                            <circle cx="11.5" cy="12.5" r="1" fill="currentColor" />
                                        </svg>
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
