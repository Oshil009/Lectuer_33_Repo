import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductByIdQuery } from '../services/productApiSlice'
import { useGetProductReviewsQuery, useAddReviewMutation, useDeleteReviewMutation } from '../services/reviewApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useToggleFavoriteMutation, useGetProfileQuery } from '../services/userApiSlice'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const { data: productData, isLoading, error } = useGetProductByIdQuery(id)
    const { data: reviewsData, refetch: refetchReviews } = useGetProductReviewsQuery(id)
    const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(undefined, { skip: !user })
    const [addToCart] = useAddToCartMutation()
    const [toggleFavorite, { isLoading: isFavLoading }] = useToggleFavoriteMutation()
    const [addReview, { isLoading: isReviewing }] = useAddReviewMutation()
    const [deleteReview] = useDeleteReviewMutation()

    const [quantity, setQuantity] = useState(1)
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
    const [reviewError, setReviewError] = useState('')
    const [cartMsg, setCartMsg] = useState('')

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading product...</p>
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>Product not found</p>

    const product = productData?.data
    const reviews = reviewsData?.data || []

    const favorites = profileData?.data?.favorites || []
    const isFavorited = favorites.some(fav => (typeof fav === 'object' ? fav._id : fav) === id)

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return }
        try {
            await addToCart({ productId: id, quantity }).unwrap()
            setCartMsg(`${quantity} item(s) added to cart!`)
            setTimeout(() => setCartMsg(''), 3000)
        } catch (err) {
            alert(err.data?.message || 'Failed to add to cart')
        }
    }

    const handleToggleFavorite = async () => {
        if (!user) { navigate('/login'); return }
        try {
            await toggleFavorite(id).unwrap()
            refetchProfile()
        } catch (err) {
            alert(err.data?.message || 'Failed to toggle favorite')
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!user) { navigate('/login'); return }
        setReviewError('')
        try {
            await addReview({ productId: id, ...reviewForm }).unwrap()
            setReviewForm({ rating: 5, comment: '' })
            refetchReviews()
        } catch (err) {
            setReviewError(err.data?.message || 'Failed to submit review')
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return
        try {
            await deleteReview(reviewId).unwrap()
            refetchReviews()
        } catch (err) {
            alert(err.data?.message || 'Failed to delete review')
        }
    }

    return (
        <>
            <Helmet>
                <title>{product.name ? `${product.name} — ShopNow` : 'Product — ShopNow'}</title>
                <meta name="description" content={product.description?.slice(0, 150) || 'Product details'} />
            </Helmet>
            <div style={{ maxWidth: 860, margin: '40px auto', padding: 24 }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: 20, cursor: 'pointer', padding: '6px 14px' }}>Back</button>
                <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 320px' }}>
                        {product.imagesUrl?.[0] ? (
                            <img src={product.imagesUrl[0]} alt={product.name} style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: 280, background: '#f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>No Image</div>
                        )}
                        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            {product.imagesUrl?.slice(1).map((img, i) => (
                                <img key={i} src={img} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 260 }}>
                        <p style={{ margin: '0 0 4px', color: '#888', fontSize: 13 }}>{product.categoryId?.title}</p>
                        <h2 style={{ textTransform: 'capitalize', marginTop: 0, marginBottom: 8 }}>{product.name}</h2>
                        {avgRating && (
                            <p style={{ margin: '0 0 8px' }}>⭐ <strong>{avgRating}</strong> <span style={{ color: '#888', fontSize: 13 }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span></p>
                        )}
                        <p style={{ fontSize: 30, fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>${product.price}</p>
                        <p style={{ color: product.stock > 0 ? 'green' : 'red', margin: '0 0 12px' }}>
                            {product.stock > 0 ? `In stock (${product.stock} left)` : 'Out of stock'}
                        </p>
                        <p style={{ color: '#555', lineHeight: 1.6, margin: '0 0 20px' }}>{product.description}</p>

                        {product.stock > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <span style={{ fontSize: 14 }}>Quantity:</span>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    style={{ width: 32, height: 32, fontSize: 18, cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd' }}>−</button>
                                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    style={{ width: 32, height: 32, fontSize: 18, cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd' }}>+</button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                            <button onClick={handleAddToCart} disabled={product.stock === 0}
                                style={{ flex: 1, padding: 13, background: product.stock === 0 ? '#ccc' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 6, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}>
                                Add to Cart
                            </button>
                            <button onClick={handleToggleFavorite} disabled={isFavLoading} title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                style={{ padding: '13px 18px', background: isFavorited ? '#ffe4e4' : '#fff', border: `2px solid ${isFavorited ? '#e74c3c' : '#ddd'}`, borderRadius: 6, cursor: 'pointer', fontSize: 20, transition: 'all 0.2s' }}>
                                {isFavorited ? '❤️' : '🤍'}
                            </button>
                        </div>
                        {cartMsg && <p style={{ color: 'green', margin: 0, fontSize: 14 }}>{cartMsg}</p>}
                        {user && (
                            <p style={{ color: '#888', fontSize: 12, margin: '4px 0 0' }}>{isFavorited ? '❤️ Saved to favorites' : '🤍 Not in favorites'}</p>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 52 }}>
                    <h3>Customer Reviews {reviews.length > 0 && <span style={{ fontSize: 15, fontWeight: 'normal', color: '#888' }}>({reviews.length})</span>}</h3>

                    {user && (
                        <form onSubmit={handleSubmitReview} style={{ background: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 28 }}>
                            <h4 style={{ marginTop: 0 }}>Write a Review</h4>
                            <div style={{ marginBottom: 12 }}>
                                <label>Rating: </label>
                                <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                    style={{ marginLeft: 8, padding: 6 }}>
                                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                                </select>
                            </div>
                            <textarea placeholder="Share your experience..." value={reviewForm.comment}
                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required
                                style={{ display: 'block', width: '100%', padding: 9, minHeight: 80, marginBottom: 10, boxSizing: 'border-box', borderRadius: 6, border: '1px solid #ddd' }} />
                            {reviewError && <p style={{ color: 'red', margin: '0 0 8px' }}>{reviewError}</p>}
                            <button type="submit" disabled={isReviewing} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: 6 }}>
                                {isReviewing ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {reviews.length === 0 ? (
                        <p style={{ color: '#888' }}>No reviews yet. Be the first</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} style={{ borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{review.userId?.name || 'User'}</strong>
                                        <span style={{ marginLeft: 10, color: '#f39c12' }}>{'⭐'.repeat(review.rating)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <span style={{ color: '#aaa', fontSize: 12 }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        {(user?._id === review.userId?._id || user?.role?.role === 'admin') && (
                                            <button onClick={() => handleDeleteReview(review._id)}
                                                style={{ background: 'none', color: '#e74c3c', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p style={{ margin: '8px 0 0', color: '#555' }}>{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
