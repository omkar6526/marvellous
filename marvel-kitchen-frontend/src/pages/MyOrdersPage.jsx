import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import toast from 'react-hot-toast';
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    Truck, 
    Package, 
    XCircle,
    ChevronRight,
    MapPin,
    Phone,
    CreditCard,
    Calendar,
    ArrowLeft
} from 'lucide-react';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'PENDING': return <Clock size={20} color="#f59e0b" />;
            case 'CONFIRMED': return <Package size={20} color="#3b82f6" />;
            case 'PREPARING': return <Package size={20} color="#8b5cf6" />;
            case 'OUT_FOR_DELIVERY': return <Truck size={20} color="#06b6d4" />;
            case 'DELIVERED': return <CheckCircle size={20} color="#10b981" />;
            case 'CANCELLED': return <XCircle size={20} color="#ef4444" />;
            default: return <Clock size={20} color="#6b7280" />;
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

    const getStatusText = (status) => {
        switch(status) {
            case 'PENDING': return 'Order Placed';
            case 'CONFIRMED': return 'Confirmed';
            case 'PREPARING': return 'Being Prepared';
            case 'OUT_FOR_DELIVERY': return 'On the Way';
            case 'DELIVERED': return 'Delivered';
            case 'CANCELLED': return 'Cancelled';
            default: return status;
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
                    <h3 style={{ color: '#667eea' }}>Loading your orders...</h3>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0f0f23',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    background: '#1a1a3e',
                    borderRadius: '20px',
                    padding: '50px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: '20px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                    <ShoppingBag size={80} color="#667eea" style={{ marginBottom: '20px' }} />
                    <h2 style={{ color: 'white', marginBottom: '10px' }}>No Orders Yet</h2>
                    <p style={{ color: '#a0a0c0', marginBottom: '30px' }}>
                        Looks like you haven't placed any orders yet. Start exploring our delicious menu!
                    </p>
                    <button 
                        onClick={() => navigate('/menu')} 
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '25px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Browse Menu
                    </button>
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
                            <ShoppingBag size={36} color="#667eea" />
                            My Orders
                        </h1>
                        <p style={{ color: '#a0a0c0', marginTop: '10px' }}>
                            You have {orders.length} {orders.length === 1 ? 'order' : 'orders'}
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
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </button>
                </div>

                {/* Orders Grid */}
                <div style={{ display: 'grid', gap: '25px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            background: '#1a1a3e',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        >
                            {/* Order Header */}
                            <div style={{
                                background: `linear-gradient(135deg, ${getStatusColor(order.status)}20, #1a1a3e)`,
                                padding: '20px',
                                borderBottom: `3px solid ${getStatusColor(order.status)}`
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '15px'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#a0a0c0',
                                            marginBottom: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <Calendar size={14} />
                                            {new Date(order.orderedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                            <span style={{ marginLeft: '10px' }}>
                                                {new Date(order.orderedAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            Order #{order.orderId || order.id}
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: `${getStatusColor(order.status)}20`,
                                        padding: '8px 15px',
                                        borderRadius: '20px'
                                    }}>
                                        {getStatusIcon(order.status)}
                                        <span style={{
                                            color: getStatusColor(order.status),
                                            fontWeight: 'bold'
                                        }}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Summary */}
                            <div style={{ padding: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <strong style={{ color: '#c0c0e0' }}>{order.items?.length || 0} items</strong>
                                    </div>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        ₹{order.grandTotal}
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginBottom: '15px'
                                }}>
                                    {order.items?.slice(0, 3).map((item, idx) => (
                                        <span key={idx} style={{
                                            background: '#2a2a5e',
                                            padding: '5px 12px',
                                            borderRadius: '15px',
                                            fontSize: '13px',
                                            color: '#c0c0e0'
                                        }}>
                                            {item.quantity}x {item.productName}
                                        </span>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <span style={{
                                            background: '#2a2a5e',
                                            padding: '5px 12px',
                                            borderRadius: '15px',
                                            fontSize: '13px',
                                            color: '#c0c0e0'
                                        }}>
                                            +{order.items.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Expand/Collapse Indicator */}
                                <div style={{
                                    textAlign: 'center',
                                    color: '#667eea',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px'
                                }}>
                                    <ChevronRight size={16} style={{
                                        transform: selectedOrder === order.id ? 'rotate(90deg)' : 'rotate(0)',
                                        transition: 'transform 0.3s'
                                    }} />
                                    {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedOrder === order.id && (
                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    padding: '20px',
                                    background: '#2a2a5e'
                                }}>
                                    {/* All Items */}
                                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Order Items</h4>
                                    <div style={{ marginBottom: '20px' }}>
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '10px 0',
                                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: 'white' }}>{item.productName}</div>
                                                    <div style={{ fontSize: '12px', color: '#a0a0c0' }}>
                                                        Quantity: {item.quantity}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                                                    ₹{item.price * item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div style={{
                                        background: '#1a1a3e',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        marginBottom: '20px'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', color: 'white' }}>Price Details</h4>
                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0' }}>
                                                <span>Subtotal:</span>
                                                <span>₹{order.totalAmount}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0' }}>
                                                <span>Delivery Charge:</span>
                                                <span>₹{order.deliveryCharge}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0' }}>
                                                <span>Tax (5%):</span>
                                                <span>₹{order.tax}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                borderTop: '1px solid rgba(255,255,255,0.2)',
                                                paddingTop: '10px',
                                                marginTop: '5px'
                                            }}>
                                                <span style={{ color: 'white' }}>Grand Total:</span>
                                                <span style={{ color: '#10b981' }}>₹{order.grandTotal}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div style={{
                                        background: '#1a1a3e',
                                        borderRadius: '10px',
                                        padding: '15px'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', color: 'white' }}>Delivery Information</h4>
                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c0c0e0' }}>
                                                <MapPin size={16} />
                                                <span>{order.deliveryAddress}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c0c0e0' }}>
                                                <Phone size={16} />
                                                <span>{order.phoneNumber}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c0c0e0' }}>
                                                <CreditCard size={16} />
                                                <span>{order.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MyOrdersPage;