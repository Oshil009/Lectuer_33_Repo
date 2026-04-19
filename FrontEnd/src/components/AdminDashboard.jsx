import { useState } from 'react'
import { useGetAllUsersQuery, useDeleteUserMutation } from '../services/userApiSlice'
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../services/categoryApiSlice'
import { useGetAllProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../services/productApiSlice'
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../services/orderApiSlice'
import { useGetAllRolesQuery, useCreateRoleMutation } from '../services/roleApiSlice'
import { Helmet } from 'react-helmet-async'
import { toast, confirm } from '../utils/swal'

const TABS = ['Products', 'Orders', 'Categories', 'Users', 'Roles']

const STATUS = {
    pending:    { bg: '#fef9ec', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
    processing: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' },
    shipped:    { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe', dot: '#8b5cf6' },
    delivered:  { bg: '#f0fdf4', color: '#14532d', border: '#bbf7d0', dot: '#22c55e' },
    cancelled:  { bg: '#fef2f2', color: '#7f1d1d', border: '#fecaca', dot: '#e94560' },
}

function TabLoader() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="state-center__inner">
                <svg className="animate-spin" width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Loading...</p>
            </div>
        </div>
    )
}

function BtnPrimary({ children, disabled, onClick, type = 'button' }) {
    return (
        <button type={type} disabled={disabled} onClick={onClick}
            className="btn btn--primary flex items-center gap-1.5"
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
            {children}
        </button>
    )
}

function BtnSecondary({ children, onClick, type = 'button' }) {
    return (
        <button type={type} onClick={onClick} className="btn btn--secondary">{children}</button>
    )
}

function BtnEdit({ onClick }) {
    return (
        <button onClick={onClick} className="btn--ghost-edit">
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                <path d="M9 2l2 2-7 7H2V9l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit
        </button>
    )
}

function BtnDelete({ onClick }) {
    return (
        <button onClick={onClick} className="btn--ghost-danger flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 2.5h8M4 2.5V1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M2.5 2.5l.5 7h5.5l.5-7"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete
        </button>
    )
}

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative mb-4">
            <div className="field-icon">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#9ca3af" strokeWidth="1.3" />
                    <path d="M10 10l2.5 2.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
            </div>
            <input type="search" placeholder={placeholder} value={value} onChange={onChange}
                className="field field--icon-left" />
        </div>
    )
}

function Table({ headers, children }) {
    return (
        <div className="admin-table-wrap">
            <div className="overflow-x-auto">
                <table className="admin-table">
                    <thead>
                        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            </div>
        </div>
    )
}

function Td({ children, mono = false }) {
    return <td className={mono ? 'font-mono text-xs' : ''}>{children}</td>
}

function FormCard({ title, onSubmit, children }) {
    return (
        <div className="card p-5 mb-5">
            <h3 className="text-sm font-semibold mt-0 mb-4 text-[var(--text-primary)]">{title}</h3>
            <form onSubmit={onSubmit}>{children}</form>
        </div>
    )
}

function ImagePreview({ imagesUrl, onChange }) {
    const urls = imagesUrl.split(',').map(u => u.trim()).filter(Boolean)

    const removeUrl = (i) => {
        const next = [...urls]
        next.splice(i, 1)
        onChange(next.join(', '))
    }

    return (
        <div className="mb-4">
            <input
                placeholder="Image URLs (comma separated)"
                value={imagesUrl}
                onChange={e => onChange(e.target.value)}
                className="field"
            />
            {urls.length > 0 && (
                <div className="img-preview-wrap">
                    {urls.map((url, i) => (
                        <div key={i} className="img-preview-item">
                            <img
                                src={url}
                                alt={`Preview ${i + 1}`}
                                className="img-preview-thumb"
                                onError={e => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                            <div className="img-preview-error" style={{ display: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#d1d5db" strokeWidth="1.1" />
                                    <path d="M1 9l3-3 2.5 2 2.5-2 3 3" stroke="#d1d5db" strokeWidth="1" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <button type="button" className="img-preview-remove" onClick={() => removeUrl(i)}>
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function OrderDetailModal({ order, onClose, onStatusChange, statuses }) {
    const s = STATUS[order.status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb', dot: '#9ca3af' }

    return (
        <div className="order-modal-backdrop" onClick={onClose}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>

                <div className="order-modal__header">
                    <div>
                        <p className="order-modal__id">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="order-modal__date">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                            <span className="status-badge__dot" style={{ background: s.dot }} />
                            {order.status}
                        </span>
                        <button onClick={onClose} className="order-modal__close">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="order-modal__body">

                    <div className="order-modal__section">
                        <p className="order-modal__section-label">Customer</p>
                        <div className="flex items-center gap-2">
                            <div className="admin-user-avatar">{order.user?.name?.[0]?.toUpperCase() ?? '?'}</div>
                            <div>
                                <p className="order-modal__customer-name">{order.user?.name || '—'}</p>
                                {order.user?.email && (
                                    <p className="order-modal__customer-email">{order.user.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="order-modal__section">
                        <p className="order-modal__section-label">Shipping address</p>
                        <p className="order-modal__address">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}
                            {order.shippingAddress?.phone && (
                                <span className="order-modal__phone"> · {order.shippingAddress.phone}</span>
                            )}
                        </p>
                    </div>

                    <div className="order-modal__section">
                        <p className="order-modal__section-label">Items ({order.items?.length})</p>
                        <div className="order-modal__items">
                            {order.items?.map(item => (
                                <div key={item._id} className="order-modal__item">
                                    <div className="order-thumb">
                                        {item.productId?.imagesUrl?.[0] ? (
                                            <img src={item.productId.imagesUrl[0]} alt={item.productId?.name}
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <rect x="1" y="5" width="16" height="10" rx="1.5" stroke="#d1d5db" strokeWidth="1.2" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="order-modal__item-name">
                                            {item.productId?.name || 'Product deleted'}
                                        </p>
                                        <p className="order-modal__item-meta">
                                            {item.quantity} × ${item.price}
                                        </p>
                                    </div>
                                    <p className="order-modal__item-total">
                                        ${(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-modal__footer">
                        <div className="order-modal__total-row">
                            <span className="order-modal__total-label">Total</span>
                            <span className="order-modal__total-value">${order.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="order-modal__status-update">
                            <p className="order-modal__section-label" style={{ margin: 0 }}>Update status</p>
                            <div className="relative">
                                <select
                                    value={order.status}
                                    onChange={e => onStatusChange(order._id, e.target.value)}
                                    className="field appearance-none cursor-pointer text-sm pr-8"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                                        <path d="M2 4l3.5 3.5L9 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Products')

    return (
        <>
            <Helmet><title>Admin Dashboard — ShopNow</title></Helmet>
            <div className="page">
                <div className="page-inner admin-page">

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="admin-star-icon">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"
                                        stroke="#e94560" strokeWidth="1.2" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <h1 className="home-title">Admin Dashboard</h1>
                        </div>
                        <p className="home-count">Manage your store</p>
                    </div>

                    <div className="tab-bar card mb-6 flex w-fit">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`tab-btn ${activeTab === tab ? 'tab-btn--active' : ''}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'Products'   && <ProductsTab />}
                    {activeTab === 'Orders'     && <OrdersTab />}
                    {activeTab === 'Categories' && <CategoriesTab />}
                    {activeTab === 'Users'      && <UsersTab />}
                    {activeTab === 'Roles'      && <RolesTab />}
                </div>
            </div>
        </>
    )
}

function UsersTab() {
    const { data, isLoading } = useGetAllUsersQuery()
    const [deleteUser] = useDeleteUserMutation()

    const handleDelete = async (id, name) => {
        const result = await confirm(`Delete user "${name}"?`, 'This cannot be undone.', 'Delete')
        if (!result.isConfirmed) return
        try { await deleteUser(id).unwrap(); toast('User deleted', 'info') }
        catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    if (isLoading) return <TabLoader />
    const users = data?.data || []

    return (
        <div>
            <p className="text-sm mb-4 text-[var(--text-hint)]">{users.length} registered users</p>
            <Table headers={['User', 'Email', 'Role', 'Joined', 'Action']}>
                {users.map(u => (
                    <tr key={u._id}>
                        <Td>
                            <div className="flex items-center gap-2">
                                <div className="admin-user-avatar">{u.name?.[0]?.toUpperCase()}</div>
                                <span className="font-medium text-[var(--text-primary)]">{u.name}</span>
                            </div>
                        </Td>
                        <Td><span className="text-[var(--text-muted)]">{u.email}</span></Td>
                        <Td>
                            <span className={u.role?.role === 'admin' ? 'user-role-badge--admin' : 'user-role-badge--user'}>
                                {u.role?.role || 'user'}
                            </span>
                        </Td>
                        <Td><span className="text-[var(--text-hint)]">{new Date(u.createdAt).toLocaleDateString()}</span></Td>
                        <Td><BtnDelete onClick={() => handleDelete(u._id, u.name)} /></Td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}

function CategoriesTab() {
    const { data, isLoading } = useGetAllCategoriesQuery()
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()
    const [form, setForm] = useState({ title: '', description: '', imageUrl: '' })
    const [editId, setEditId] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editId) { await updateCategory({ id: editId, ...form }).unwrap(); setEditId(null); toast('Category updated!') }
            else { await createCategory(form).unwrap(); toast('Category created!') }
            setForm({ title: '', description: '', imageUrl: '' })
        } catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    const handleDelete = async (id, title) => {
        const result = await confirm(`Delete category "${title}"?`, '', 'Delete')
        if (!result.isConfirmed) return
        try { await deleteCategory(id).unwrap(); toast('Category deleted', 'info') }
        catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    if (isLoading) return <TabLoader />
    const categories = data?.data || []

    return (
        <div>
            <FormCard title={editId ? 'Edit Category' : 'Add Category'} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 mb-4">
                    {[
                        { key: 'title',       placeholder: 'Title',                required: true  },
                        { key: 'description', placeholder: 'Description',           required: true  },
                        { key: 'imageUrl',    placeholder: 'Image URL (optional)',  required: false },
                    ].map(({ key, placeholder, required }) => (
                        <input key={key} placeholder={placeholder} value={form[key]}
                            onChange={e => setForm({ ...form, [key]: e.target.value })}
                            required={required} className="field" />
                    ))}
                </div>
                <div className="flex gap-2.5">
                    <BtnPrimary type="submit" disabled={isCreating}>
                        {isCreating ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
                    </BtnPrimary>
                    {editId && (
                        <BtnSecondary onClick={() => { setEditId(null); setForm({ title: '', description: '', imageUrl: '' }) }}>
                            Cancel
                        </BtnSecondary>
                    )}
                </div>
            </FormCard>

            <p className="text-sm mb-3 text-[var(--text-hint)]">{categories.length} categories</p>
            <Table headers={['Title', 'Description', 'Actions']}>
                {categories.map(cat => (
                    <tr key={cat._id}>
                        <Td><span className="font-medium text-[var(--text-primary)]">{cat.title}</span></Td>
                        <Td><span className="text-[var(--text-muted)]">{cat.description}</span></Td>
                        <Td>
                            <div className="flex items-center gap-2">
                                <BtnEdit onClick={() => { setEditId(cat._id); setForm({ title: cat.title, description: cat.description || '', imageUrl: cat.imageUrl || '' }) }} />
                                <BtnDelete onClick={() => handleDelete(cat._id, cat.title)} />
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}

function ProductsTab() {
    const { data: productsData, isLoading } = useGetAllProductsQuery()
    const { data: categoriesData } = useGetAllCategoriesQuery()
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '', imagesUrl: '' }
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [search, setSearch] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            imagesUrl: form.imagesUrl.split(',').map(u => u.trim()).filter(Boolean)
        }
        try {
            if (editId) { await updateProduct({ id: editId, ...payload }).unwrap(); setEditId(null); toast('Product updated!') }
            else { await createProduct(payload).unwrap(); toast('Product created!') }
            setForm(emptyForm)
        } catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    const handleDelete = async (id, name) => {
        const result = await confirm(`Delete "${name}"?`, 'This cannot be undone.', 'Delete')
        if (!result.isConfirmed) return
        try { await deleteProduct(id).unwrap(); toast('Product deleted', 'info') }
        catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    const startEdit = (p) => {
        setEditId(p._id)
        setForm({
            name: p.name,
            description: p.description || '',
            price: p.price,
            stock: p.stock,
            categoryId: p.categoryId?._id || '',
            imagesUrl: p.imagesUrl?.join(', ') || ''
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isLoading) return <TabLoader />
    const products   = productsData?.data || []
    const categories = categoriesData?.data || []
    const filtered   = search ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : products

    return (
        <div>
            <FormCard title={editId ? 'Edit Product' : 'Add Product'} onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                    {[
                        { key: 'name',  placeholder: 'Product name',   type: 'text'   },
                        { key: 'price', placeholder: 'Price',           type: 'number', min: '0', step: '0.01' },
                        { key: 'stock', placeholder: 'Stock quantity',  type: 'number', min: '0' },
                    ].map(({ key, placeholder, type, ...rest }) => (
                        <input key={key} placeholder={placeholder} type={type} value={form[key]}
                            onChange={e => setForm({ ...form, [key]: e.target.value })}
                            required className="field" {...rest} />
                    ))}
                    <div className="relative">
                        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                            required className="field appearance-none pr-8">
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.title}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                                <path d="M2 4l3.5 3.5L9 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <textarea placeholder="Description" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required rows={3} className="field resize-none mb-2.5" />

                <ImagePreview
                    imagesUrl={form.imagesUrl}
                    onChange={val => setForm({ ...form, imagesUrl: val })}
                />

                <div className="flex gap-2.5">
                    <BtnPrimary type="submit" disabled={isCreating}>
                        {isCreating ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                    </BtnPrimary>
                    {editId && <BtnSecondary onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</BtnSecondary>}
                </div>
            </FormCard>

            <p className="text-sm m-0 mb-3 text-[var(--text-hint)]">
                {filtered.length} of {products.length} products
            </p>

            <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />

            <Table headers={['Product', 'Slug', 'Price', 'Stock', 'Category', 'Actions']}>
                {filtered.map(p => (
                    <tr key={p._id}>
                        <Td>
                            <div className="flex items-center gap-2">
                                {p.imagesUrl?.[0] ? (
                                    <img src={p.imagesUrl[0]} alt={p.name} className="admin-product-thumb" />
                                ) : (
                                    <div className="admin-product-thumb-placeholder">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#d1d5db" strokeWidth="1.1" />
                                        </svg>
                                    </div>
                                )}
                                <span className="capitalize font-medium text-[var(--text-primary)]">{p.name}</span>
                            </div>
                        </Td>
                        <Td mono>{p.slug}</Td>
                        <Td><span className="font-semibold text-[var(--brand)]">${p.price}</span></Td>
                        <Td>
                            <span className={p.stock > 0 ? 'stock-badge--in' : 'stock-badge--out'}>{p.stock}</span>
                        </Td>
                        <Td><span className="text-[var(--text-muted)]">{p.categoryId?.title || '—'}</span></Td>
                        <Td>
                            <div className="flex items-center gap-2">
                                <BtnEdit onClick={() => startEdit(p)} />
                                <BtnDelete onClick={() => handleDelete(p._id, p.name)} />
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}
function OrdersTab() {
    const { data, isLoading } = useGetAllOrdersQuery()
    const [updateOrderStatus] = useUpdateOrderStatusMutation()
    const [search, setSearch] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    const handleStatusChange = async (id, status) => {
        try { await updateOrderStatus({ id, status }).unwrap(); toast(`Status updated to "${status}"`, 'success') }
        catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    if (isLoading) return <TabLoader />
    const orders = data?.data || []
    const filtered = search
        ? orders.filter(o => o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o._id.includes(search))
        : orders

    const currentOrder = selectedOrder
        ? orders.find(o => o._id === selectedOrder._id) || selectedOrder
        : null

    return (
        <div>
            {currentOrder && (
                <OrderDetailModal
                    order={currentOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                    statuses={statuses}
                />
            )}

            <p className="text-sm mb-3 text-[var(--text-hint)]">{orders.length} total orders</p>
            <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or order ID..." />

            <Table headers={['Order ID', 'Customer', 'Total', 'Date', 'Status', 'Update']}>
                {filtered.map(order => {
                    const s = STATUS[order.status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb', dot: '#9ca3af' }
                    return (
                        <tr key={order._id} className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <Td mono>
                                <span className="font-bold text-[var(--text-primary)]">
                                    #{order._id.slice(-8).toUpperCase()}
                                </span>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-2">
                                    <div className="admin-user-avatar w-6 h-6 text-[9px]">
                                        {order.user?.name?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <span className="text-[var(--text-primary)]">{order.user?.name || '—'}</span>
                                </div>
                            </Td>
                            <Td>
                                <span className="font-bold text-[var(--brand)]">${order.totalPrice?.toFixed(2)}</span>
                            </Td>
                            <Td>
                                <span className="text-[var(--text-hint)]">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </Td>
                            <Td>
                                <span className="status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                    <span className="status-badge__dot" style={{ background: s.dot }} />
                                    {order.status}
                                </span>
                            </Td>
                            <Td>
                                <div className="relative" onClick={e => e.stopPropagation()}>
                                    <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                                        className="field appearance-none cursor-pointer text-xs py-1.5 pl-2.5 pr-6">
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
                                            <path d="M2 4l3.5 3.5L9 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </Td>
                        </tr>
                    )
                })}
            </Table>
        </div>
    )
}
function RolesTab() {
    const { data, isLoading } = useGetAllRolesQuery()
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
    const [form, setForm] = useState({ role: '', permissions: '' })

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await createRole({
                role: form.role,
                permissions: form.permissions.split(',').map(p => p.trim()).filter(Boolean)
            }).unwrap()
            setForm({ role: '', permissions: '' })
            toast('Role created!')
        } catch (err) { toast(err.data?.message || 'Failed', 'error') }
    }

    if (isLoading) return <TabLoader />
    const roles = data?.data || []

    return (
        <div>
            <FormCard title="Add Role" onSubmit={handleCreate}>
                <div className="flex flex-col gap-3 mb-4">
                    <input placeholder="Role name (e.g. moderator)" value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                        required className="field" />
                    <input placeholder="Permissions (comma separated)" value={form.permissions}
                        onChange={e => setForm({ ...form, permissions: e.target.value })}
                        className="field" />
                </div>
                <BtnPrimary type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Role'}
                </BtnPrimary>
            </FormCard>

            <p className="text-sm mb-3 text-[var(--text-hint)]">{roles.length} roles</p>
            <div className="flex flex-col gap-3">
                {roles.map(role => (
                    <div key={role._id} className="card admin-role-card">
                        <div>
                            <p className="text-sm font-bold capitalize m-0 mb-1.5 text-[var(--text-primary)]">
                                {role.role}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {role.permissions.length > 0 ? role.permissions.map(perm => (
                                    <span key={perm} className="perm-badge">{perm}</span>
                                )) : (
                                    <span className="text-xs text-[var(--text-hint)]">No permissions</span>
                                )}
                            </div>
                        </div>
                        <span className="role-badge">Role</span>
                    </div>
                ))}
            </div>
        </div>
    )
}