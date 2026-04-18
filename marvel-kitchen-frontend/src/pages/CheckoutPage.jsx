import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { totalAmount, cartItems, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    // Calculate final amount
    const deliveryCharge = totalAmount > 200 ? 0 : 40;
    const tax = totalAmount * 0.05;
    const grandTotal = totalAmount + deliveryCharge + tax;

    // Agar cart empty hai to redirect
    if (cartItems.length === 0) {
        return (
            <div style={{
                minHeight: '80vh',
                background: '#0f0f23',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    background: '#1a1a3e',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    maxWidth: '500px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
                    <h2 style={{ color: 'white', marginBottom: '16px' }}>Your cart is empty</h2>
                    <p style={{ color: '#a0a0c0', marginBottom: '30px' }}>Add some items to your cart before checkout.</p>
                    <button 
                        onClick={() => navigate('/menu')} 
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Browse Menu 🍕
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!address || !phone) {
            toast.error('Please fill all fields');
            return;
        }
        
        const orderData = {
            deliveryAddress: address,
            phoneNumber: phone,
            paymentMethod: paymentMethod
        };
        
        console.log('Sending order data:', orderData);
        
        setLoading(true);
        
        try {
            const response = await placeOrder(orderData);
            console.log('Order response:', response.data);
            
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate('/my-orders');
            
        } catch (error) {
            console.error('Order error:', error);
            const errorMsg = typeof error.response?.data === 'string' 
                ? error.response.data 
                : error.response?.data?.error || 'Failed to place order';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f23',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        Checkout
                    </h1>
                    <p style={{ color: '#a0a0c0' }}>
                        Complete your order to enjoy delicious food
                    </p>
                </div>

                {/* Main Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '30px',
                    '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr'
                    }
                }}>
                    {/* Left Side - Form */}
                    <div style={{
                        background: '#1a1a3e',
                        borderRadius: '20px',
                        padding: '30px',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <form onSubmit={handleSubmit}>
                            {/* Delivery Address */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    color: 'white',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}>
                                    📍 Delivery Address
                                </label>
                                <textarea
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full delivery address"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: '#2a2a5e',
                                        border: '1px solid rgba(102, 126, 234, 0.3)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                                />
                            </div>

                            {/* Phone Number */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    color: 'white',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}>
                                    📞 Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: '#2a2a5e',
                                        border: '1px solid rgba(102, 126, 234, 0.3)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                                />
                            </div>

                            {/* Payment Method */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    color: 'white',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}>
                                    💳 Payment Method
                                </label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px'
                                }}>
                                    {[
                                        { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
                                        { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
                                        { value: 'UPI', label: 'UPI / Wallet', icon: '📱' }
                                    ].map(method => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.value)}
                                            style={{
                                                padding: '12px',
                                                background: paymentMethod === method.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#2a2a5e',
                                                border: paymentMethod === method.value ? 'none' : '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (paymentMethod !== method.value) {
                                                    e.target.style.background = '#3a3a6e';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (paymentMethod !== method.value) {
                                                    e.target.style.background = '#2a2a5e';
                                                }
                                            }}
                                        >
                                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{method.icon}</div>
                                            <div>{method.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '30px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: loading ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                                onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                            >
                                {loading ? (
                                    <span>⏳ Processing...</span>
                                ) : (
                                    <span>Place Order →</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div style={{
                        background: '#1a1a3e',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        position: 'sticky',
                        top: '100px',
                        height: 'fit-content'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Order Summary</h3>
                        
                        {/* Items List */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                            {cartItems.slice(0, 5).map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div>
                                        <div style={{ color: 'white', fontSize: '14px' }}>{item.product.name}</div>
                                        <div style={{ color: '#a0a0c0', fontSize: '12px' }}>× {item.quantity}</div>
                                    </div>
                                    <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
                                        ₹{item.product.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                            {cartItems.length > 5 && (
                                <div style={{ color: '#a0a0c0', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
                                    +{cartItems.length - 5} more items
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0', fontSize: '14px' }}>
                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0', fontSize: '14px' }}>
                                <span>Delivery Charge</span>
                                <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0', fontSize: '14px' }}>
                                <span>Tax (5%)</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '16px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Grand Total</span>
                                <span style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '24px'
                                }}>
                                    ₹{grandTotal.toFixed(0)}
                                </span>
                            </div>
                        </div>

                        {/* Delivery Info Note */}
                        <div style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '12px',
                            padding: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚚</div>
                            <div style={{ color: '#a0a0c0', fontSize: '12px' }}>
                                Free delivery on orders above ₹200
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;