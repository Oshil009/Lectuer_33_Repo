import { useState } from 'react'
import { useGetAllUsersQuery, useDeleteUserMutation } from '../services/userApiSlice'
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../services/categoryApiSlice'
import { useGetAllProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../services/productApiSlice'
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../services/orderApiSlice'
import { useGetAllRolesQuery, useCreateRoleMutation } from '../services/roleApiSlice'
import { Helmet } from 'react-helmet-async'

const TABS = ['Users', 'Categories', 'Products', 'Orders', 'Roles']

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Products')

    return (
        <>
            <Helmet>
                <title>Admin Dashboard ShopNow</title>
            </Helmet>
            <div style={{ maxWidth: 1060, margin: '30px auto', padding: 24 }}>
                <h2>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ padding: '9px 22px', cursor: 'pointer', background: activeTab === tab ? '#1a1a2e' : '#f0f0f0', color: activeTab === tab ? '#fff' : '#333', border: 'none', borderRadius: 6, fontWeight: activeTab === tab ? 'bold' : 'normal' }}>
                            {tab}
                        </button>
                    ))}
                </div>
                {activeTab === 'Users' && <UsersTab />}
                {activeTab === 'Categories' && <CategoriesTab />}
                {activeTab === 'Products' && <ProductsTab />}
                {activeTab === 'Orders' && <OrdersTab />}
                {activeTab === 'Roles' && <RolesTab />}
            </div>
        </>
    )
}

function UsersTab() {
    const { data, isLoading } = useGetAllUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    if (isLoading) return <p>Loading users...</p>
    const users = data?.data || []
    return (
        <div>
            <h3>All Users ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            {['Name', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{u.name}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{u.email}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd', textTransform: 'capitalize' }}>{u.role?.role || '—'}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                    <button onClick={async () => { if (window.confirm('Delete user?')) await deleteUser(u._id) }}
                                        style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        try {
            if (editId) {
                await updateCategory({ id: editId, ...form }).unwrap()
                setEditId(null)
            } else {
                await createCategory(form).unwrap()
            }
            setForm({ title: '', description: '', imageUrl: '' })
        } catch (err) { setError(err.data?.message || 'Failed') }
    }

    const startEdit = (cat) => {
        setEditId(cat._id)
        setForm({ title: cat.title, description: cat.description || '', imageUrl: cat.imageUrl || '' })
    }

    if (isLoading) return <p>Loading categories...</p>
    const categories = data?.data || []

    return (
        <div>
            <h3>Categories ({categories.length})</h3>
            <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h4 style={{ marginTop: 0 }}>{editId ? 'Edit Category' : 'Add New Category'}</h4>
                <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" disabled={isCreating} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: 4 }}>
                        {editId ? 'Update' : 'Create'}
                    </button>
                    {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', imageUrl: '' }) }}
                        style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 4 }}>Cancel</button>}
                </div>
            </form>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            {['Title', 'Description', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{cat.title}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{cat.description}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                    <button onClick={() => startEdit(cat)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', marginRight: 6 }}>Edit</button>
                                    <button onClick={async () => { if (window.confirm('Delete category?')) await deleteCategory(cat._id) }}
                                        style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock), imagesUrl: form.imagesUrl.split(',').map(u => u.trim()).filter(Boolean) }
        try {
            if (editId) { await updateProduct({ id: editId, ...payload }).unwrap(); setEditId(null) }
            else { await createProduct(payload).unwrap() }
            setForm(emptyForm)
        } catch (err) { setError(err.data?.message || 'Failed') }
    }

    const startEdit = (p) => {
        setEditId(p._id)
        setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, categoryId: p.categoryId?._id || '', imagesUrl: p.imagesUrl?.join(', ') || '' })
    }

    if (isLoading) return <p>Loading products...</p>
    const products = productsData?.data || []
    const categories = categoriesData?.data || []
    const filtered = search ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : products

    return (
        <div>
            <h3>Products ({products.length})</h3>
            <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h4 style={{ marginTop: 0 }}>{editId ? 'Edit Product' : 'Add New Product'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                    <input placeholder="Price" type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                    <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.title}</option>)}
                    </select>
                </div>
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                    style={{ display: 'block', width: '100%', padding: 8, minHeight: 60, marginBottom: 10, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                <input placeholder="Image URLs (comma separated)" value={form.imagesUrl} onChange={e => setForm({ ...form, imagesUrl: e.target.value })}
                    style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" disabled={isCreating} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: 4 }}>{editId ? 'Update' : 'Create'}</button>
                    {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 4 }}>Cancel</button>}
                </div>
            </form>

            <input placeholder=" Search products..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 14px', marginBottom: 14, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }} />

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            {['Name', 'Price', 'Stock', 'Category', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p._id}>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd', textTransform: 'capitalize' }}>{p.name}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>${p.price}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{p.stock}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{p.categoryId?.title || '—'}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                    <button onClick={() => startEdit(p)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', marginRight: 6 }}>Edit</button>
                                    <button onClick={async () => { if (window.confirm('Delete product?')) await deleteProduct(p._id) }}
                                        style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function OrdersTab() {
    const { data, isLoading } = useGetAllOrdersQuery()
    const [updateOrderStatus] = useUpdateOrderStatusMutation()
    const [search, setSearch] = useState('')
    const STATUS_COLORS = { pending: '#f39c12', processing: '#3498db', shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c' }
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    if (isLoading) return <p>Loading orders...</p>
    const orders = data?.data || []
    const filtered = search ? orders.filter(o => o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o._id.includes(search)) : orders

    return (
        <div>
            <h3>All Orders ({orders.length})</h3>
            <input placeholder=" Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 14px', marginBottom: 14, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }} />
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            {['Order ID', 'Customer', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(order => (
                            <tr key={order._id}>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: 12, fontFamily: 'monospace' }}>{order._id.slice(-8).toUpperCase()}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{order.user?.name || '—'}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontWeight: 'bold' }}>${order.totalPrice?.toFixed(2)}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                    <span style={{ background: STATUS_COLORS[order.status] || '#888', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 12, textTransform: 'capitalize' }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                    <select value={order.status} onChange={e => updateOrderStatus({ id: order._id, status: e.target.value })}
                                        style={{ padding: '5px 8px', borderRadius: 4, border: '1px solid #ddd' }}>
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function RolesTab() {
    const { data, isLoading } = useGetAllRolesQuery()
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
    const [form, setForm] = useState({ role: '', permissions: '' })
    const [error, setError] = useState('')

    const handleCreate = async (e) => {
        e.preventDefault(); setError('')
        try {
            await createRole({ role: form.role, permissions: form.permissions.split(',').map(p => p.trim()).filter(Boolean) }).unwrap()
            setForm({ role: '', permissions: '' })
        } catch (err) { setError(err.data?.message || 'Failed') }
    }

    if (isLoading) return <p>Loading roles...</p>
    const roles = data?.data || []

    return (
        <div>
            <h3>Roles ({roles.length})</h3>
            <form onSubmit={handleCreate} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h4 style={{ marginTop: 0 }}>Add New Role</h4>
                <input placeholder="Role name (e.g. moderator)" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                <input placeholder="Permissions (comma separated)" value={form.permissions} onChange={e => setForm({ ...form, permissions: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ddd' }} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isCreating} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: 4 }}>
                    {isCreating ? 'Creating...' : 'Create Role'}
                </button>
            </form>
            {roles.map(role => (
                <div key={role._id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16, marginBottom: 12 }}>
                    <strong style={{ textTransform: 'capitalize' }}>{role.role}</strong>
                    <p style={{ margin: '6px 0 0', color: '#666', fontSize: 14 }}>
                        Permissions: {role.permissions.length > 0 ? role.permissions.join(', ') : 'none'}
                    </p>
                </div>
            ))}
        </div>
    )
}
