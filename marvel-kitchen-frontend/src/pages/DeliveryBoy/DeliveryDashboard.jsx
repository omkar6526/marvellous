// src/pages/DeliveryBoy/DeliveryDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [client, setClient] = useState(null);
    
    const deliveryBoyId = localStorage.getItem('deliveryBoyId') || 1;
    
    useEffect(() => {
        loadAssignedOrders();
        
        // Setup WebSocket
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                setClient(stompClient);
                
                // Subscribe to new order assignments
                stompClient.subscribe(`/topic/delivery/${deliveryBoyId}/new-order`, (message) => {
                    const newOrder = JSON.parse(message.body);
                    toast.success(`New order #${newOrder.id} assigned!`);
                    loadAssignedOrders();
                });
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
            }
        });
        stompClient.activate();
        
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, []);
    
    // Share live location every 5 seconds
    useEffect(() => {
        if (!isOnline || !client || !client.connected) return;
        
        const interval = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Send location for all active orders
                        assignedOrders.forEach(order => {
                            if (order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
                                client.publish({
                                    destination: '/app/location/update',
                                    body: JSON.stringify({
                                        orderId: order.id,
                                        deliveryBoyId: deliveryBoyId,
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude
                                    })
                                });
                            }
                        });
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isOnline, client, assignedOrders]);
    
    const loadAssignedOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/delivery/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignedOrders(response.data);
            
            // Set current order if any active order exists
            const activeOrder = response.data.find(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
            if (activeOrder) setCurrentOrderId(activeOrder.id);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load orders');
        }
    };
    
    const updateStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/orders/${orderId}/delivery-status?status=${status}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Order #${orderId} marked as ${status}`);
            loadAssignedOrders();
            if (status === 'DELIVERED') {
                toast.success('🎉 Order delivered successfully!');
            }
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update status');
        }
    };
    
    const getStatusButton = (order) => {
        switch(order.status) {
            case 'PENDING':
                return null;
            case 'CONFIRMED':
                return (
                    <button
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        style={styles.buttonPrimary}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        🍳 Confirm Pickup
                    </button>
                );
            case 'PREPARING':
                return (
                    <button
                        onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                        style={styles.buttonWarning}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        🚚 Start Delivery
                    </button>
                );
            case 'OUT_FOR_DELIVERY':
                return (
                    <button
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        style={styles.buttonSuccess}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        ✅ Mark Delivered
                    </button>
                );
            case 'DELIVERED':
                return (
                    <span style={styles.deliveredBadge}>
                        ✅ Delivered
                    </span>
                );
            default:
                return null;
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.innerContainer}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>🛵 Delivery Dashboard</h1>
                        <p style={styles.subtitle}>Manage your deliveries in real-time</p>
                    </div>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        style={{
                            ...styles.onlineButton,
                            background: isOnline ? '#10b981' : '#ef4444'
                        }}
                    >
                        {isOnline ? '🟢 Online' : '🔴 Offline'}
                    </button>
                </div>
                
                {/* Stats Cards */}
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>📦</div>
                        <div style={styles.statValue}>{assignedOrders.length}</div>
                        <div style={styles.statLabel}>Total Orders</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>🔄</div>
                        <div style={styles.statValue}>
                            {assignedOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}
                        </div>
                        <div style={styles.statLabel}>Active Orders</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>✅</div>
                        <div style={styles.statValue}>
                            {assignedOrders.filter(o => o.status === 'DELIVERED').length}
                        </div>
                        <div style={styles.statLabel}>Completed</div>
                    </div>
                </div>
                
                {/* Orders List */}
                <div style={styles.ordersContainer}>
                    <h3 style={styles.sectionTitle}>📋 Assigned Orders</h3>
                    <div style={styles.ordersList}>
                        {assignedOrders.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>📦</div>
                                <h3 style={styles.emptyTitle}>No orders assigned</h3>
                                <p style={styles.emptyText}>Stay online to receive orders</p>
                            </div>
                        ) : (
                            assignedOrders.map(order => (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <div>
                                            <div style={styles.orderId}>Order #{order.id}</div>
                                            <div style={styles.orderAmount}>₹{order.grandTotal}</div>
                                        </div>
                                        <div style={{
                                            ...styles.statusBadge,
                                            background: getStatusBgColor(order.status)
                                        }}>
                                            <span style={{ color: getStatusColor(order.status) }}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.orderDetails}>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>📍 Delivery Address:</span>
                                            <span style={styles.detailValue}>{order.deliveryAddress}</span>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>📞 Customer Phone:</span>
                                            <span style={styles.detailValue}>{order.phoneNumber}</span>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>💰 Payment:</span>
                                            <span style={styles.detailValue}>{order.paymentMethod}</span>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>📅 Ordered:</span>
                                            <span style={styles.detailValue}>
                                                {new Date(order.orderedAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.orderActions}>
                                        {getStatusButton(order)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        background: '#0f0f23',
        padding: '20px'
    },
    innerContainer: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
    },
    subtitle: {
        color: '#a0a0c0',
        fontSize: '14px',
        marginTop: '8px'
    },
    onlineButton: {
        color: 'white',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        background: '#1a1a3e',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid rgba(102,126,234,0.2)'
    },
    statIcon: {
        fontSize: '32px',
        marginBottom: '8px'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#667eea'
    },
    statLabel: {
        color: '#a0a0c0',
        fontSize: '12px',
        marginTop: '4px'
    },
    ordersContainer: {
        background: '#1a1a3e',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(102,126,234,0.2)'
    },
    sectionTitle: {
        color: 'white',
        fontSize: '18px',
        marginBottom: '20px'
    },
    ordersList: {
        display: 'grid',
        gap: '16px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '16px'
    },
    emptyTitle: {
        color: 'white',
        marginBottom: '8px'
    },
    emptyText: {
        color: '#a0a0c0'
    },
    orderCard: {
        background: '#2a2a5e',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(102,126,234,0.3)',
        transition: 'transform 0.3s ease'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px'
    },
    orderId: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px'
    },
    orderAmount: {
        color: '#10b981',
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '4px'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px'
    },
    orderDetails: {
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    detailRow: {
        display: 'flex',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    detailLabel: {
        color: '#a0a0c0',
        fontSize: '13px',
        minWidth: '130px'
    },
    detailValue: {
        color: 'white',
        fontSize: '13px',
        flex: 1
    },
    orderActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    buttonPrimary: {
        background: '#667eea',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    buttonWarning: {
        background: '#f59e0b',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    buttonSuccess: {
        background: '#10b981',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    deliveredBadge: {
        background: '#10b98120',
        color: '#10b981',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500'
    }
};

// Helper functions
const getStatusColor = (status) => {
    switch(status) {
        case 'PENDING': return '#f59e0b';
        case 'CONFIRMED': return '#3b82f6';
        case 'PREPARING': return '#8b5cf6';
        case 'OUT_FOR_DELIVERY': return '#06b6d4';
        case 'DELIVERED': return '#10b981';
        case 'CANCELLED': return '#ef4444';
        default: return '#a0a0c0';
    }
};

const getStatusBgColor = (status) => {
    switch(status) {
        case 'PENDING': return '#f59e0b20';
        case 'CONFIRMED': return '#3b82f620';
        case 'PREPARING': return '#8b5cf620';
        case 'OUT_FOR_DELIVERY': return '#06b6d420';
        case 'DELIVERED': return '#10b98120';
        case 'CANCELLED': return '#ef444420';
        default: return '#a0a0c020';
    }
};

const getStatusIcon = (status) => {
    switch(status) {
        case 'PENDING': return '⏰';
        case 'CONFIRMED': return '✓';
        case 'PREPARING': return '🍳';
        case 'OUT_FOR_DELIVERY': return '🚚';
        case 'DELIVERED': return '✅';
        case 'CANCELLED': return '❌';
        default: return '📦';
    }
};

export default DeliveryDashboard;