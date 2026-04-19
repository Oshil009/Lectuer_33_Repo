import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductBySlugQuery } from '../services/productApiSlice'
import { useGetProductReviewsQuery, useAddReviewMutation, useDeleteReviewMutation } from '../services/reviewApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useToggleFavoriteMutation, useGetProfileQuery } from '../services/userApiSlice'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'
import { toast, confirm } from '../utils/swal'

function StarDisplay({ rating, max = 5 }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                        d="M6.5 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6.5 9.1 3.3 10.9l.6-3.6L1.3 4.8l3.6-.5z"
                        fill={i < Math.round(rating) ? '#f59e0b' : 'none'}
                        stroke={i < Math.round(rating) ? '#f59e0b' : '#d1d5db'}
                        strokeWidth="1" strokeLinejoin="round"
                    />
                </svg>
            ))}
        </div>
    )
}

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(null)
    const active = hovered ?? value
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n} type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                    className="p-0.5 border-none bg-transparent cursor-pointer transition-transform"
                    style={{ transform: hovered === n ? 'scale(1.2)' : 'scale(1)' }}
                    aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                >
                    <svg width="22" height="22" viewBox="0 0 13 13" fill="none">
                        <path
                            d="M6.5 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6.5 9.1 3.3 10.9l.6-3.6L1.3 4.8l3.6-.5z"
                            fill={n <= active ? '#f59e0b' : 'none'}
                            stroke={n <= active ? '#f59e0b' : '#d1d5db'}
                            strokeWidth="1" strokeLinejoin="round"
                        />
                    </svg>
                </button>
            ))}
        </div>
    )
}

export default function ProductDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const { data: productData, isLoading, error } = useGetProductBySlugQuery(slug)
    const product = productData?.data

    const { data: reviewsData, refetch: refetchReviews } = useGetProductReviewsQuery(product?._id, { skip: !product })
    const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(undefined, { skip: !user })
    const [addToCart] = useAddToCartMutation()
    const [toggleFavorite, { isLoading: isFavLoading }] = useToggleFavoriteMutation()
    const [addReview, { isLoading: isReviewing }] = useAddReviewMutation()
    const [deleteReview] = useDeleteReviewMutation()

    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
    const [reviewError, setReviewError] = useState('')

    const reviews = reviewsData?.data || []
    const favorites = profileData?.data?.favorites || []

    const isFavorited = favorites.some(
        fav => (typeof fav === 'object' ? fav._id : fav) === product?._id
    )

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return }
        try {
            await addToCart({ productId: product._id, quantity }).unwrap()
            toast(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`)
        } catch (err) {
            toast(err.data?.message || 'Failed to add to cart', 'error')
        }
    }

    const handleToggleFavorite = async () => {
        if (!user) { navigate('/login'); return }
        try {
            await toggleFavorite(product._id).unwrap()
            refetchProfile()
            toast(
                isFavorited ? 'Removed from favorites' : 'Added to favorites',
                isFavorited ? 'info' : 'success'
            )
        } catch (err) {
            toast(err.data?.message || 'Failed', 'error')
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!user) { navigate('/login'); return }
        setReviewError('')
        try {
            await addReview({ productId: product._id, ...reviewForm }).unwrap()
            setReviewForm({ rating: 5, comment: '' })
            refetchReviews()
            toast('Review submitted!')
        } catch (err) {
            setReviewError(err.data?.message || 'Failed to submit review')
        }
    }

    const handleDeleteReview = async (reviewId) => {
        const result = await confirm('Delete this review?', 'This action cannot be undone.', 'Yes, delete')
        if (!result.isConfirmed) return
        try {
            await deleteReview(reviewId).unwrap()
            refetchReviews()
            toast('Review deleted', 'info')
        } catch (err) {
            toast(err.data?.message || 'Failed to delete', 'error')
        }
    }

    if (isLoading) return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading product...</p>
            </div>
        </div>
    )

    if (error || !product) return (
        <div className="state-center">
            <div className="text-center">
                <div className="error-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="9" stroke="#e94560" strokeWidth="1.5" />
                        <path d="M11 7v5M11 15v.5" stroke="#e94560" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <p className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Product not found</p>
                <button onClick={() => navigate('/')} className="btn btn--primary">Go Home</button>
            </div>
        </div>
    )

    const allImages = product.imagesUrl || []
    const mainImageOrigin = (() => {
        try { return allImages[0] ? new URL(allImages[0]).origin : null } catch { return null }
    })()

    return (
        <>
            <Helmet>
                <title>{`${product.name} — ShopNow`}</title>
                <meta name="description" content={product.description?.slice(0, 155)} />
                <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
                {mainImageOrigin && <link rel="preconnect" href={mainImageOrigin} crossOrigin="anonymous" />}
            </Helmet>

            <div className="page">
                <div className="page-inner detail-page">

                    <button onClick={() => navigate(-1)}
                        className="btn btn--secondary flex items-center gap-1.5 mb-6 text-sm">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>

                    <div className="card p-6 mb-5">
                        <div className="detail-main-card">

                            <div className="detail-img-col">
                                <div className="detail-main-img">
                                    {allImages[selectedImage] ? (
                                        <img
                                            src={allImages[selectedImage]}
                                            alt={product.name}
                                            fetchPriority="high"
                                            loading="eager"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                                <rect x="4" y="10" width="32" height="20" rx="3" stroke="#d1d5db" strokeWidth="1.5" />
                                                <circle cx="15" cy="18" r="3" stroke="#d1d5db" strokeWidth="1.5" />
                                                <path d="M4 27l9-6 6 4 6-5 11 7" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {allImages.length > 1 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {allImages.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`detail-thumb ${i === selectedImage ? 'detail-thumb--active' : 'detail-thumb--inactive'}`}>
                                                <img src={img} alt={`${product.name} view ${i + 1}`}
                                                    loading="lazy" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="detail-info-col">
                                {product.categoryId?.title && (
                                    <span className="detail-category-badge">{product.categoryId.title}</span>
                                )}

                                <h1 className="detail-title">{product.name}</h1>

                                {avgRating && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <StarDisplay rating={Number(avgRating)} />
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">{avgRating}</span>
                                        <span className="text-xs text-[var(--text-hint)]">
                                            ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                )}

                                <p className="detail-price">${product.price}</p>

                                <div className="flex items-center gap-1.5 mb-4">
                                    <span className="product-card__stock-dot"
                                        style={{ background: product.stock > 0 ? '#22c55e' : 'var(--brand)' }} />
                                    <p className={`text-xs font-medium m-0 ${product.stock > 0 ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
                                        {product.stock > 0 ? `In stock — ${product.stock} left` : 'Out of stock'}
                                    </p>
                                </div>

                                <p className="detail-desc">{product.description}</p>

                                {product.stock > 0 && (
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-xs font-medium text-[var(--text-muted)]">Quantity</span>
                                        <div className="qty-control">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                aria-label="Decrease quantity" className="qty-control__btn">−</button>
                                            <span className="qty-control__val" aria-live="polite">{quantity}</span>
                                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                                aria-label="Increase quantity" className="qty-control__btn">+</button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2.5">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className={`btn flex-1 py-2.5 flex items-center justify-center gap-2 tracking-wide rounded-[var(--radius-sm)] border-none ${product.stock === 0 ? 'bg-[var(--bg-muted)] text-[var(--text-hint)] cursor-not-allowed' : 'bg-[var(--brand)] text-white cursor-pointer'}`}>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <path d="M1 1h2.5l1.6 7.4a1 1 0 00.98.8h5.84a1 1 0 00.97-.76L13.5 5H4"
                                                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="5.5" cy="12.5" r="1" fill="currentColor" />
                                            <circle cx="11.5" cy="12.5" r="1" fill="currentColor" />
                                        </svg>
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>

                                    <button
                                        onClick={handleToggleFavorite}
                                        disabled={isFavLoading}
                                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                        className={`fav-btn ${isFavorited ? 'fav-btn--active' : 'fav-btn--inactive'}`}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M9 15.5S2 11 2 6a4 4 0 018-1.4A4 4 0 0118 6c0 5-7 9.5-7 9.5z"
                                                fill={isFavorited ? '#e94560' : 'none'}
                                                stroke="#e94560" strokeWidth="1.4" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section aria-label="Customer reviews" className="min-h-[200px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold m-0 text-[var(--text-primary)]">
                                Customer Reviews
                                {reviews.length > 0 && (
                                    <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)]">
                                        {reviews.length}
                                    </span>
                                )}
                            </h2>
                            {avgRating && (
                                <div className="flex items-center gap-2">
                                    <StarDisplay rating={Number(avgRating)} />
                                    <span className="text-sm font-bold text-[var(--text-primary)]">{avgRating}</span>
                                </div>
                            )}
                        </div>

                        {user && (
                            <div className="card review-form-card mb-4">
                                <h3 className="text-sm font-semibold mt-0 mb-4 text-[var(--text-primary)]">
                                    Write a Review
                                </h3>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-4">
                                        <label className="field-label">Rating</label>
                                        <StarPicker value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="review-comment" className="field-label">Your review</label>
                                        <textarea
                                            id="review-comment"
                                            placeholder="Share your experience with this product..."
                                            value={reviewForm.comment}
                                            onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                            required rows={3}
                                            className="field resize-none"
                                        />
                                    </div>
                                    {reviewError && (
                                        <div className="auth-error">
                                            <p className="auth-error__text">{reviewError}</p>
                                        </div>
                                    )}
                                    <button type="submit" disabled={isReviewing}
                                        className="btn btn--primary flex items-center gap-2">
                                        {isReviewing ? (
                                            <>
                                                <svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none">
                                                    <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                                    <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {reviews.length === 0 ? (
                            <div className="card text-center py-14">
                                <div className="no-reviews-wrap">
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                        <path d="M11 2l2.4 5 5.6.8-4 4 .9 5.5L11 15l-4.9 2.3.9-5.5-4-4 5.6-.8z"
                                            stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium m-0 mb-1 text-[var(--text-primary)]">No reviews yet</p>
                                <p className="text-xs m-0 text-[var(--text-hint)]">Be the first to share your experience!</p>
                            </div>
                        ) : (
                            <div className="card overflow-hidden">
                                {reviews.map((review, i) => (
                                    <article key={review._id} className="review-item"
                                        style={{ borderBottom: i < reviews.length - 1 ? '0.5px solid var(--border-row)' : 'none' }}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="review-avatar">
                                                    {review.userId?.name?.[0]?.toUpperCase() ?? 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold m-0 text-[var(--text-primary)]">
                                                        {review.userId?.name || 'User'}
                                                    </p>
                                                    <StarDisplay rating={review.rating} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <time dateTime={review.createdAt} className="text-xs text-[var(--text-hint)]">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </time>
                                                {(user?._id === review.userId?._id || user?.role?.role === 'admin') && (
                                                    <button onClick={() => handleDeleteReview(review._id)}
                                                        className="review-delete-btn">Delete</button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2.5 mb-0 leading-relaxed text-[#4b5563]">
                                            {review.comment}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    )
}
