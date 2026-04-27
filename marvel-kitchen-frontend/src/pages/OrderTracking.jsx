import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('PENDING');
    const [deliveryBoy, setDeliveryBoy] = useState(null);
    const [location, setLocation] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    
    const stages = [
        { key: 'PENDING', label: 'Order Placed', icon: '📝', color: '#f59e0b' },
        { key: 'CONFIRMED', label: 'Confirmed', icon: '✓', color: '#3b82f6' },
        { key: 'PREPARING', label: 'Preparing', icon: '🍳', color: '#8b5cf6' },
        { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: '🚚', color: '#06b6d4' },
        { key: 'DELIVERED', label: 'Delivered', icon: '✅', color: '#10b981' }
    ];
    
    useEffect(() => {
        fetchOrderDetails();
        
        // WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                
                // Subscribe to status updates
                client.subscribe(`/topic/orders/${orderId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setStatus(data.status);
                    toast.success(`Order ${data.status.toLowerCase().replace('_', ' ')}!`);
                });
                
                // Subscribe to delivery boy info
                client.subscribe(`/topic/orders/${orderId}/delivery-boy`, (message) => {
                    const data = JSON.parse(message.body);
                    setDeliveryBoy(data);
                    toast.success(`Delivery partner assigned: ${data.name}`);
                });
                
                // Subscribe to location updates
                client.subscribe(`/topic/orders/${orderId}/location`, (message) => {
                    const data = JSON.parse(message.body);
                    setLocation({ lat: data.lat, lng: data.lng });
                });
            }
        });
        
        client.activate();
        
        return () => client.deactivate();
    }, [orderId]);
    
    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/orders/${orderId}/track`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data.order);
            setStatus(response.data.status);
            setStatusHistory(response.data.statusHistory || []);
            if (response.data.deliveryBoy) setDeliveryBoy(response.data.deliveryBoy);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        }
    };
    
    const getCurrentStageIndex = () => {
        return stages.findIndex(s => s.key === status);
    };
    
    if (!order) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f0f23', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #667eea', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <h3 style={{ color: '#667eea' }}>Loading tracking info...</h3>
                </div>
            </div>
        );
    }
    
    return (
        <div style={{ minHeight: '100vh', background: '#0f0f23', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Order Header */}
                <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h2 style={{ color: 'white', marginBottom: '8px' }}>Order #{order.id}</h2>
                            <p style={{ color: '#a0a0c0', fontSize: '14px' }}>
                                Placed on {new Date(order.orderedAt).toLocaleString()}
                            </p>
                        </div>
                        <div style={{
                            background: `${stages.find(s => s.key === status)?.color}20`,
                            padding: '8px 16px',
                            borderRadius: '30px'
                        }}>
                            <span style={{ color: stages.find(s => s.key === status)?.color, fontWeight: 'bold' }}>
                                {stages.find(s => s.key === status)?.icon} {status}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Stepper */}
                <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '30px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '30px',
                            left: '10%',
                            right: '10%',
                            height: '3px',
                            background: '#2a2a5e',
                            zIndex: 0
                        }}>
                            <div style={{
                                width: `${(getCurrentStageIndex() / (stages.length - 1)) * 100}%`,
                                height: '100%',
                                background: '#10b981',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                        
                        {stages.map((stage, index) => (
                            <div key={stage.key} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: index <= getCurrentStageIndex() ? stage.color : '#2a2a5e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 12px',
                                    fontSize: '28px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {stage.icon}
                                </div>
                                <div style={{ color: index <= getCurrentStageIndex() ? stage.color : '#a0a0c0', fontSize: '12px', fontWeight: index === getCurrentStageIndex() ? 'bold' : 'normal' }}>
                                    {stage.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* ETA Card (when out for delivery) */}
                {status === 'OUT_FOR_DELIVERY' && (
                    <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '24px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚚</div>
                        <h3 style={{ color: '#06b6d4', fontSize: '28px', marginBottom: '8px' }}>15-20 min</h3>
                        <p style={{ color: '#a0a0c0' }}>Estimated delivery time</p>
                    </div>
                )}
                
                {/* Live Location Map */}
                {location && status === 'OUT_FOR_DELIVERY' && (
                    <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '16px', marginBottom: '24px' }}>
                        <h4 style={{ color: 'white', marginBottom: '12px' }}>📍 Live Location</h4>
                        <div style={{
                            height: '300px',
                            background: '#2a2a5e',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#a0a0c0'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                            <p>Google Maps will show here</p>
                            <p style={{ fontSize: '12px', marginTop: '8px' }}>Lat: {location.lat?.toFixed(4)}, Lng: {location.lng?.toFixed(4)}</p>
                        </div>
                    </div>
                )}
                
                {/* Delivery Boy Info */}
                {deliveryBoy && (
                    <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '24px' }}>
                        <h4 style={{ color: 'white', marginBottom: '16px' }}>🛵 Delivery Partner</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#2a2a5e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px'
                            }}>
                                🛵
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{deliveryBoy.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                    <span style={{ color: '#f59e0b' }}>⭐ {deliveryBoy.rating || '4.8'}</span>
                                    <span style={{ color: '#a0a0c0' }}>{deliveryBoy.totalDeliveries || '100'}+ deliveries</span>
                                </div>
                            </div>
                            <a href={`tel:${deliveryBoy.phone}`} style={{
                                background: '#667eea',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                📞 Contact
                            </a>
                        </div>
                    </div>
                )}
                
                {/* Order Items Summary */}
                <div style={{ background: '#1a1a3e', borderRadius: '20px', padding: '24px', marginTop: '24px' }}>
                    <h4 style={{ color: 'white', marginBottom: '16px' }}>🍽️ Order Summary</h4>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0', marginBottom: '8px' }}>
                            <span>Items Total</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0', marginBottom: '8px' }}>
                            <span>Delivery Charge</span>
                            <span>₹{order.deliveryCharge}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0c0e0' }}>
                            <span>Tax (5%)</span>
                            <span>₹{order.tax}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>Grand Total</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '20px' }}>₹{order.grandTotal}</span>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OrderTracking;