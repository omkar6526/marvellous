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
                background: '#0f0f23',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #667eea',
                        borderTop: '4px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3 style={{ color: '#667eea' }}>Loading profile...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f23',
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
                            fontSize: '36px',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <span>👤</span>
                            My Profile
                        </h1>
                        <p style={{ color: '#a0a0c0', marginTop: '10px' }}>
                            Manage your account information
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/menu')}
                        style={{
                            background: '#1a1a3e',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#2a2a5e';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#1a1a3e';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        ← Back to Menu
                    </button>
                </div>

                {/* Two Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr',
                    gap: '30px'
                }}>
                    {/* Left Column - Profile Info */}
                    <div>
                        {/* Profile Card */}
                        <div style={{
                            background: '#1a1a3e',
                            borderRadius: '20px',
                            padding: '30px',
                            border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px'
                                }}>
                                    <span style={{ fontSize: '48px' }}>👨‍🍳</span>
                                </div>
                                <h2 style={{ color: 'white', marginBottom: '5px' }}>{user?.name}</h2>
                                <p style={{ color: '#a0a0c0' }}>{user?.email}</p>
                                <p style={{ 
                                    display: 'inline-block',
                                    background: 'rgba(102, 126, 234, 0.2)',
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
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                        paddingTop: '20px'
                                    }}>
                                        <h3 style={{ marginBottom: '15px', color: 'white' }}>Contact Information</h3>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#a0a0c0', marginBottom: '5px' }}>
                                                📞 Phone Number
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#c0c0e0' }}>
                                                {user?.phone || 'Not provided'}
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#a0a0c0', marginBottom: '5px' }}>
                                                📍 Delivery Address
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#c0c0e0' }}>
                                                {user?.address || 'Not provided'}
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#a0a0c0', marginBottom: '5px' }}>
                                                🗓️ Member Since
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#c0c0e0' }}>
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#c0c0e0' }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: '#2a2a5e',
                                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                color: 'white'
                                            }}
                                            required
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#c0c0e0' }}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: '#2a2a5e',
                                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', color: '#c0c0e0' }}>
                                            Delivery Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            rows="3"
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: '#2a2a5e',
                                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                                                background: '#6b7280',
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
                            background: '#1a1a3e',
                            borderRadius: '20px',
                            padding: '30px',
                            border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ color: 'white' }}>📦 Recent Orders</h3>
                                <button
                                    onClick={() => navigate('/my-orders')}
                                    style={{
                                        background: '#2a2a5e',
                                        border: 'none',
                                        padding: '5px 12px',
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        color: '#667eea',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#3a3a6e'}
                                    onMouseLeave={(e) => e.target.style.background = '#2a2a5e'}
                                >
                                    View All
                                </button>
                            </div>
                            
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <span style={{ fontSize: '48px' }}>🍕</span>
                                    <p style={{ color: '#a0a0c0', marginTop: '10px' }}>No orders yet</p>
                                    <button
                                        onClick={() => navigate('/menu')}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                                borderRadius: '12px',
                                                padding: '15px',
                                                marginBottom: '15px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                background: '#1a1a3e'
                                            }}
                                            onClick={() => navigate('/my-orders')}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#2a2a5e';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#1a1a3e';
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
                                                    <div style={{ fontWeight: 'bold', color: 'white' }}>
                                                        Order #{order.orderId || order.id}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#a0a0c0' }}>
                                                        {new Date(order.orderedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    background: `${getStatusColor(order.status)}20`,
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    color: getStatusColor(order.status),
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {order.status}
                                                </div>
                                            </div>
                                            
                                            <div style={{ fontSize: '14px', color: '#a0a0c0', marginBottom: '10px' }}>
                                                {order.items?.length} items • ₹{order.grandTotal}
                                            </div>
                                            
                                            <div style={{ fontSize: '12px', color: '#c0c0e0' }}>
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
                                background: '#1a1a3e',
                                borderRadius: '20px',
                                padding: '20px',
                                marginTop: '20px',
                                border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                                <h3 style={{ marginBottom: '15px', color: 'white' }}>📊 Order Statistics</h3>
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
                                        <div style={{ fontSize: '12px', color: '#a0a0c0' }}>Total Orders</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                            ₹{orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#a0a0c0' }}>Total Spent</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                                            {orders.filter(o => o.status === 'DELIVERED').length}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#a0a0c0' }}>Delivered</div>
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