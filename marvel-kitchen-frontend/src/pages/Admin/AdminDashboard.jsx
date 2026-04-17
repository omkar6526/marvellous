// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addProduct, deleteProduct, getAdminStats, getAllOrders, getAllProducts, getAllUsers, updateOrderStatus } from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalOrders: 0, pendingOrders: 0, totalRevenue: 0,
        totalUsers: 0, totalProducts: 0, todayOrders: 0, todayRevenue: 0
    });
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        isVeg: true,
        category: { id: 1 }
    });

    useEffect(() => {
        checkAdminAccess();
        loadDashboardData();
    }, []);

    const checkAdminAccess = () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        
        if (!token || role !== 'ADMIN') {
            navigate('/');
            return;
        }
    };

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
                getAdminStats(),
                getAllOrders(),
                getAllProducts(),
                getAllUsers()
            ]);
            
            setStats(statsRes.data);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatusHandler = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success(`Order #${orderId} status updated to ${status}`);
            loadDashboardData(); // Refresh data
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteProductHandler = async (productId) => {
        if (window.confirm('Delete this product?')) {
            try {
                await deleteProduct(productId);
                toast.success('Product deleted');
                loadDashboardData();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const addProductHandler = async () => {
        if (!newProduct.name || !newProduct.price) {
            toast.error('Please fill required fields');
            return;
        }
        
        try {
            await addProduct({
                ...newProduct,
                price: parseFloat(newProduct.price)
            });
            toast.success('Product added successfully');
            setShowAddProduct(false);
            setNewProduct({ name: '', price: '', description: '', isVeg: true, category: { id: 1 } });
            loadDashboardData();
        } catch (error) {
            toast.error('Failed to add product');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f59e0b',
            'CONFIRMED': '#3b82f6',
            'PREPARING': '#8b5cf6',
            'OUT_FOR_DELIVERY': '#06b6d4',
            'DELIVERED': '#10b981',
            'CANCELLED': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #667eea', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <h3>Loading Dashboard...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
            {/* Admin Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', margin: 0 }}>🛒 Marvel Kitchen - Admin Panel</h1>
                        <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                            Welcome, {localStorage.getItem('name')}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'orders', label: '📦 Orders' },
                        { id: 'products', label: '🍕 Products' },
                        { id: 'users', label: '👥 Users' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 25px',
                                backgroundColor: activeTab === tab.id ? '#667eea' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>📦</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalOrders}</div>
                                <div>Total Orders</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>⏰</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingOrders}</div>
                                <div>Pending Orders</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>💰</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>₹{stats.totalRevenue}</div>
                                <div>Total Revenue</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>👥</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.totalUsers}</div>
                                <div>Total Users</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>🍕</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4' }}>{stats.totalProducts}</div>
                                <div>Total Products</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px' }}>📅</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.todayOrders}</div>
                                <div>Today's Orders</div>
                            </div>
                        </div>

                        <div style={{ background: 'white', borderRadius: '15px', padding: '20px' }}>
                            <h3>Recent Orders</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr style={{ borderBottom: '2px solid #f3f4f6' }}><th style={{ padding: '12px' }}>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                                    <tbody>{orders.slice(0, 5).map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px' }}>#{order.id}</td>
                                            <td>{order.user?.name || 'Guest'}</td>
                                            <td>₹{order.grandTotal}</td>
                                            <td><span style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), padding: '4px 10px', borderRadius: '12px' }}>{order.status}</span></td>
                                            <td><select value={order.status} onChange={(e) => updateOrderStatusHandler(order.id, e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}><option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="PREPARING">Preparing</option><option value="OUT_FOR_DELIVERY">Out for Delivery</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab - Full Table */}
                {activeTab === 'orders' && (
                    <div style={{ background: 'white', borderRadius: '15px', padding: '20px' }}>
                        <h3>All Orders</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr style={{ borderBottom: '2px solid #f3f4f6' }}><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                                <tbody>{orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '12px' }}>#{order.id}</td>
                                        <td>{order.user?.name || 'Guest'}</td>
                                        <td>₹{order.grandTotal}</td>
                                        <td><span style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), padding: '4px 10px', borderRadius: '12px' }}>{order.status}</span></td>
                                        <td>{new Date(order.orderedAt).toLocaleDateString()}</td>
                                        <td><select value={order.status} onChange={(e) => updateOrderStatusHandler(order.id, e.target.value)}><option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="PREPARING">Preparing</option><option value="OUT_FOR_DELIVERY">Out for Delivery</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div style={{ background: 'white', borderRadius: '15px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3>Products</h3>
                            <button onClick={() => setShowAddProduct(!showAddProduct)} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>+ Add Product</button>
                        </div>
                        {showAddProduct && (
                            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                <h4>New Product</h4>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <button onClick={addProductHandler} style={{ backgroundColor: '#667eea', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                                </div>
                            </div>
                        )}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
                                <tbody>{products.map(product => (
                                    <tr key={product.id}><td>{product.id}</td><td>{product.name}</td><td>₹{product.price}</td><td><button onClick={() => deleteProductHandler(product.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div style={{ background: 'white', borderRadius: '15px', padding: '20px' }}>
                        <h3>Users</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                                <tbody>{users.map(user => (
                                    <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.phone || '-'}</td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AdminDashboard;