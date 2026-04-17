import { useMemo } from 'react'
import { useGetAllProductsQuery } from '../services/productApiSlice'
import { useGetAllCategoriesQuery } from '../services/categoryApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'
const EMPTY_ARRAY = [];
export default function Home() {
    const { data: productsData, isLoading, error } = useGetAllProductsQuery()
    const { data: categoriesData } = useGetAllCategoriesQuery()
    const [addToCart] = useAddToCartMutation()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get('search') || ''
    const selectedCategory = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const PAGE_SIZE = 12

    const setSearch = (val) => setSearchParams(p => { val ? p.set('search', val) : p.delete('search'); p.delete('page'); return p })
    const setCategory = (val) => setSearchParams(p => { val ? p.set('category', val) : p.delete('category'); p.delete('page'); return p })
    const setPage = (val) => setSearchParams(p => { p.set('page', val); return p })

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            await addToCart({ productId, quantity: 1 }).unwrap()
            alert('Added to cart!')
        } catch (err) {
            alert(err.data?.message || 'Failed to add to cart')
        }
    }

    const products = productsData?.data || EMPTY_ARRAY;
    const categories = categoriesData?.data || EMPTY_ARRAY;

    const filtered = useMemo(() => {
        let list = products
        if (selectedCategory) list = list.filter(p => p.categoryId?._id === selectedCategory)
        if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        return list
    }, [products, selectedCategory, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading products...</p>
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>Error loading products</p>

    return (
        <>
            <Helmet>
                <title>ShopNow Explore Products</title>
                <meta name="description" content="Browse hundreds of products. Filter by category, search by name, and add to cart instantly." />
            </Helmet>

            <div style={{ padding: '24px 24px 40px' }}>
                <h2 style={{ marginBottom: 20 }}>Products</h2>

                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: '9px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 6, minWidth: 220, flex: 1 }}
                    />
                    <select
                        value={selectedCategory}
                        onChange={e => setCategory(e.target.value)}
                        style={{ padding: '9px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 6 }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                        ))}
                    </select>
                    {(search || selectedCategory) && (
                        <button onClick={() => setSearchParams({})} style={{ padding: '9px 14px', cursor: 'pointer', borderRadius: 6, border: '1px solid #ddd', background: '#f5f5f5' }}>
                            Clear
                        </button>
                    )}
                    <span style={{ color: '#888', fontSize: 13 }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {paginated.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', marginTop: 60 }}>No products found.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                        {paginated.map(product => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/products/${product._id}`)}
                                style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 16, cursor: 'pointer', transition: 'box-shadow 0.2s', background: '#fff' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                {product.imagesUrl?.[0] ? (
                                    <img src={product.imagesUrl[0]} alt={product.name}
                                        style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />
                                ) : (
                                    <div style={{ width: '100%', height: 180, background: '#f0f0f0', borderRadius: 6, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>No Image</div>
                                )}
                                <h3 style={{ textTransform: 'capitalize', margin: '0 0 6px', fontSize: 15 }}>{product.name}</h3>
                                {product.categoryId?.title && (
                                    <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>{product.categoryId.title}</p>
                                )}
                                <p style={{ margin: '0 0 6px', color: '#666', fontSize: 13 }}>{product.description?.slice(0, 70)}...</p>
                                <p style={{ fontWeight: 'bold', fontSize: 18, margin: '0 0 6px', color: '#1a1a2e' }}>${product.price}</p>
                                <p style={{ color: product.stock > 0 ? 'green' : 'red', fontSize: 13, margin: '0 0 12px' }}>
                                    {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                                </p>
                                <button
                                    onClick={(e) => handleAddToCart(e, product._id)}
                                    disabled={product.stock === 0}
                                    style={{ width: '100%', padding: 9, background: product.stock === 0 ? '#ccc' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 6, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontSize: 14 }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '7px 14px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd' }}>Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={n} onClick={() => setPage(n)}
                                style={{ padding: '7px 12px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd', background: n === page ? '#1a1a2e' : '#fff', color: n === page ? '#fff' : '#333', fontWeight: n === page ? 'bold' : 'normal' }}>
                                {n}
                            </button>
                        ))}
                        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '7px 14px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ddd' }}>Next</button>
                    </div>
                )}
            </div>
        </>
    )
}
