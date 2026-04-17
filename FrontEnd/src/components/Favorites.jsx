import { useGetProfileQuery } from '../services/userApiSlice'
import { useToggleFavoriteMutation } from '../services/userApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Favorites() {
    const navigate = useNavigate()
    const { data: profileData, isLoading, refetch } = useGetProfileQuery()
    const [toggleFavorite] = useToggleFavoriteMutation()
    const [addToCart] = useAddToCartMutation()

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading favorites...</p>

    const favorites = profileData?.data?.favorites || []

    const handleRemove = async (e, productId) => {
        e.stopPropagation()
        try {
            await toggleFavorite(productId).unwrap()
            refetch()
        } catch (err) {
            alert(err.data?.message || 'Failed to remove')
        }
    }

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation()
        try {
            await addToCart({ productId, quantity: 1 }).unwrap()
            alert('Added to cart!')
        } catch (err) {
            alert(err.data?.message || 'Failed to add to cart')
        }
    }

    return (
        <>
            <Helmet>
                <title>My Favorites ShopNow</title>
                <meta name="description" content="View and manage your favorite products on ShopNow." />
            </Helmet>
            <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
                <h2>My Favorites</h2>

                {favorites.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 60 }}>
                        <p style={{ color: '#888', fontSize: 16 }}>You haven't saved any favorites yet.</p>
                        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', marginTop: 16, cursor: 'pointer', borderRadius: 6 }}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={{ color: '#888', marginBottom: 20 }}>{favorites.length} saved item{favorites.length !== 1 ? 's' : ''}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                            {favorites.map(product => {
                                if (typeof product === 'string') return null
                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => navigate(`/products/${product._id}`)}
                                        style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 16, cursor: 'pointer', background: '#fff', position: 'relative' }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                    >
                                        <button
                                            onClick={(e) => handleRemove(e, product._id)}
                                            title="Remove from favorites"
                                            style={{ position: 'absolute', top: 10, right: 10, background: '#ffe4e4', border: '1px solid #e74c3c', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                                            ❤️
                                        </button>

                                        {product.imagesUrl?.[0] ? (
                                            <img src={product.imagesUrl[0]} alt={product.name}
                                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />
                                        ) : (
                                            <div style={{ width: '100%', height: 160, background: '#f0f0f0', borderRadius: 6, marginBottom: 10 }} />
                                        )}

                                        <h4 style={{ textTransform: 'capitalize', margin: '0 0 4px', fontSize: 14, paddingRight: 24 }}>{product.name}</h4>
                                        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>{product.categoryId?.title}</p>
                                        <p style={{ fontWeight: 'bold', fontSize: 17, margin: '0 0 8px' }}>${product.price}</p>
                                        <p style={{ color: product.stock > 0 ? 'green' : 'red', fontSize: 12, margin: '0 0 10px' }}>
                                            {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                                        </p>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product._id)}
                                            disabled={product.stock === 0}
                                            style={{ width: '100%', padding: 8, background: product.stock === 0 ? '#ccc' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 6, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>
                                            Add to Cart
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
