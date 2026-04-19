import { useMemo, useCallback } from 'react'
import { useGetAllProductsQuery } from '../services/productApiSlice'
import { useGetAllCategoriesQuery } from '../services/categoryApiSlice'
import { useAddToCartMutation } from '../services/cartApiSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Helmet } from 'react-helmet-async'
import { toast } from '../utils/swal'

const EMPTY = []
const PAGE_SIZE = 12

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

    const set = useCallback((key, val) => {
        setSearchParams(p => {
            val ? p.set(key, val) : p.delete(key)
            if (key !== 'page') p.delete('page')
            return p
        })
    }, [setSearchParams])

    const handleAddToCart = useCallback(async (e, productId) => {
        e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            await addToCart({ productId, quantity: 1 }).unwrap()
            toast('Added to cart!')
        } catch (err) {
            toast(err.data?.message || 'Failed to add to cart', 'error')
        }
    }, [user, navigate, addToCart])

    const products   = productsData?.data || EMPTY
    const categories = categoriesData?.data || EMPTY

    const filtered = useMemo(() => {
        let list = products
        if (selectedCategory) list = list.filter(p => p.categoryId?._id === selectedCategory)
        if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        return list
    }, [products, selectedCategory, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (isLoading) return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading products...</p>
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
                <p className="text-sm font-semibold text-[var(--text-primary)]">Error loading products</p>
            </div>
        </div>
    )

    return (
        <>
            <Helmet>
                <title>ShopNow — Explore Products</title>
                <meta name="description" content="Browse hundreds of products. Filter by category, search by name, and add to cart instantly." />
            </Helmet>

            <div className="page">
                <div className="page-inner" style={{ maxWidth: 1100 }}>

                    <div className="home-header">
                        <div>
                            <h1 className="home-title">Products</h1>
                            <p className="home-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
                        </div>
                        {(search || selectedCategory) && (
                            <button onClick={() => setSearchParams({})} className="btn--ghost-danger flex items-center gap-1.5">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="filter-bar">
                        <label htmlFor="product-search" className="sr-only">Search products</label>
                        <div className="relative flex-1 min-w-[200px]">
                            <div className="field-icon">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="6" cy="6" r="4.5" stroke="#9ca3af" strokeWidth="1.3" />
                                    <path d="M10 10l2.5 2.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </div>
                            <input
                                id="product-search" type="search" placeholder="Search products..."
                                value={search} onChange={e => set('search', e.target.value)}
                                className="field field--icon-left"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                            <div className="field-icon">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M1 3h11M3 6.5h7M5 10h3" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            </div>
                            <select id="category-filter" value={selectedCategory}
                                onChange={e => set('category', e.target.value)}
                                className="field field--icon-left appearance-none cursor-pointer pr-8">
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <path d="M2 4l3.5 3.5L9 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {paginated.length === 0 ? (
                        <div className="card card--xl empty-state">
                            <div className="empty-state__icon-wrap bg-[var(--bg-page)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="7.5" stroke="#d1d5db" strokeWidth="1.5" />
                                    <path d="M17 17l3.5 3.5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="empty-state__title">No products found</p>
                            <p className="empty-state__text">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {paginated.map((product, idx) => (
                                <article
                                    key={product._id}
                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                    className="product-card">
                                    <div className="product-card__img-wrap">
                                        {product.imagesUrl?.[0] ? (
                                            <img
                                                src={product.imagesUrl[0]}
                                                alt={product.name}
                                                width="240" height="180"
                                                fetchPriority={idx === 0 ? 'high' : 'low'}
                                                loading={idx < 4 ? 'eager' : 'lazy'}
                                                className="product-card__img"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                                    <rect x="3" y="9" width="30" height="18" rx="2.5" stroke="#d1d5db" strokeWidth="1.3" />
                                                    <circle cx="13" cy="16" r="3" stroke="#d1d5db" strokeWidth="1.3" />
                                                    <path d="M3 24l9-6 6 4 5-4 10 6" stroke="#d1d5db" strokeWidth="1.3" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {product.categoryId?.title && (
                                        <span className="product-card__category">{product.categoryId.title}</span>
                                    )}

                                    <h2 className="product-card__name">{product.name}</h2>

                                    <p className="product-card__desc">
                                        {product.description?.slice(0, 65)}{product.description?.length > 65 ? '…' : ''}
                                    </p>

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

                    {totalPages > 1 && (
                        <nav aria-label="Products pagination" className="flex items-center justify-center gap-1.5 mt-8">
                            <button onClick={() => set('page', page - 1)} disabled={page === 1} className="pagination__btn">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M8 2.5L4.5 6.5 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => set('page', n)}
                                    aria-label={`Page ${n}`}
                                    aria-current={n === page ? 'page' : undefined}
                                    className={`pagination__page ${n === page ? 'pagination__page--active' : ''}`}>
                                    {n}
                                </button>
                            ))}

                            <button onClick={() => set('page', page + 1)} disabled={page === totalPages} className="pagination__btn">
                                Next
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M5 2.5L8.5 6.5 5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </>
    )
}
