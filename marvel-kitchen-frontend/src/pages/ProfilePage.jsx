import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getMyOrders } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data } = await getUserProfile();
            setUser(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            setUser({ ...user, ...formData });
            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING': return '#f59e0b';
            case 'CONFIRMED': return '#3b82f6';
            case 'PREPARING': return '#8b5cf6';
            case 'OUT_FOR_DELIVERY': return '#06b6d4';
            case 'DELIVERED': return '#10b981';
            case 'CANCELLED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div className="spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3>Loading profile...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{
                            color: 'white',
                            fontSize: '36px',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span>👤</span>
                            My Profile
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '10px' }}>
                            Manage your account information
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/menu')}
                        style={{
                            backgroundColor: 'white',
                            color: '#667eea',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        ← Back to Menu
                    </button>
                </div>

                {/* Two Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr',
                    gap: '30px',
                    '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr'
                    }
                }}>
                    {/* Left Column - Profile Info */}
                    <div>
                        {/* Profile Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}>
                                    <span style={{ fontSize: '48px' }}>👨‍🍳</span>
                                </div>
                                <h2 style={{ color: '#333', marginBottom: '5px' }}>{user?.name}</h2>
                                <p style={{ color: '#666' }}>{user?.email}</p>
                                <p style={{ 
                                    display: 'inline-block',
                                    backgroundColor: '#e0e7ff',
                                    color: '#667eea',
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    marginTop: '10px'
                                }}>
                                    {user?.role || 'USER'}
                                </p>
                            </div>

                            {!editing ? (
                                <>
                                    <div style={{
                                        borderTop: '1px solid #eee',
                                        paddingTop: '20px'
                                    }}>
                                        <h3 style={{ marginBottom: '15px', color: '#333' }}>Contact Information</h3>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                                📞 Phone Number
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#333' }}>
                                                {user?.phone || 'Not provided'}
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                                📍 Delivery Address
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#333' }}>
                                                {user?.address || 'Not provided'}
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                                🗓️ Member Since
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#333' }}>
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            marginTop: '20px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        ✏️ Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdate}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                            required
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                                            Delivery Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            rows="3"
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            💾 Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            style={{
                                                flex: 1,
                                                backgroundColor: '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Recent Orders */}
                    <div>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ color: '#333' }}>📦 Recent Orders</h3>
                                <button
                                    onClick={() => navigate('/my-orders')}
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        border: 'none',
                                        padding: '5px 12px',
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        color: '#667eea'
                                    }}
                                >
                                    View All
                                </button>
                            </div>
                            
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <span style={{ fontSize: '48px' }}>🍕</span>
                                    <p style={{ color: '#666', marginTop: '10px' }}>No orders yet</p>
                                    <button
                                        onClick={() => navigate('/menu')}
                                        style={{
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Order Now
                                    </button>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {orders.slice(0, 5).map((order) => (
                                        <div
                                            key={order.id}
                                            style={{
                                                border: '1px solid #eee',
                                                borderRadius: '12px',
                                                padding: '15px',
                                                marginBottom: '15px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => navigate('/my-orders')}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '10px'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                                                        Order #{order.orderId || order.id}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {new Date(order.orderedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    backgroundColor: `${getStatusColor(order.status)}15`,
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    color: getStatusColor(order.status),
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {order.status}
                                                </div>
                                            </div>
                                            
                                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                                                {order.items?.length} items • ₹{order.grandTotal}
                                            </div>
                                            
                                            <div style={{ fontSize: '12px', color: '#999' }}>
                                                {order.items?.slice(0, 2).map(item => item.productName).join(', ')}
                                                {order.items?.length > 2 && '...'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        {orders.length > 0 && (
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '20px',
                                marginTop: '20px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 Order Statistics</h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    textAlign: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                            {orders.length}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Total Orders</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                            ₹{orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Total Spent</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                                            {orders.filter(o => o.status === 'DELIVERED').length}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Delivered</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;