import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, totalAmount, removeItemFromCart } = useCart();

    const handleRemoveItem = (productId) => {
        removeItemFromCart(productId);
    };

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
                    <p style={{ color: '#a0a0c0', marginBottom: '30px' }}>Looks like you haven't added any items to your cart yet.</p>
                    <Link to="/menu" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '12px 32px',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontWeight: '600',
                        transition: 'transform 0.3s ease'
                    }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                       onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                        Browse Menu 🍕
                    </Link>
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
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        Your Cart
                    </h1>
                    <p style={{ color: '#a0a0c0' }}>
                        You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {/* Cart Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 320px',
                    gap: '30px'
                }}>
                    {/* Cart Items */}
                    <div style={{
                        background: '#1a1a3e',
                        borderRadius: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
                            gap: '15px',
                            color: '#a0a0c0',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            <div>Product</div>
                            <div style={{ textAlign: 'center' }}>Quantity</div>
                            <div style={{ textAlign: 'right' }}>Price</div>
                            <div></div>
                        </div>

                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{
                                    padding: '20px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
                                    gap: '15px',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease'
                                }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)'}
                                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    {/* Product Info with Image */}
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        {/* Product Image */}
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#2a2a5e',
                                            flexShrink: 0
                                        }}>
                                            {item.product.image_url ? (
                                                <img 
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const parent = e.target.parentElement;
                                                        if (parent) {
                                                            parent.style.display = 'flex';
                                                            parent.style.alignItems = 'center';
                                                            parent.style.justifyContent = 'center';
                                                            parent.style.fontSize = '30px';
                                                            parent.innerHTML = item.product.isVeg ? '🌱' : '🍖';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '30px'
                                                }}>
                                                    {item.product.isVeg ? '🌱' : '🍖'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'white', marginBottom: '4px', fontSize: '16px' }}>{item.product.name}</h4>
                                            <p style={{ color: '#a0a0c0', fontSize: '12px' }}>₹{item.product.price} each</p>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{
                                            background: '#2a2a5e',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            × {item.quantity}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#10b981', fontSize: '18px' }}>
                                        ₹{item.product.price * item.quantity}
                                    </div>

                                    {/* Remove Button */}
                                    <div style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleRemoveItem(item.product.id)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                fontSize: '18px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#ef4444';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                                e.target.style.color = '#ef4444';
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
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
                        
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0' }}>
                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0' }}>
                                <span>Delivery Charge</span>
                                <span>{totalAmount > 200 ? 'Free' : '₹40'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c0c0e0' }}>
                                <span>Tax (5%)</span>
                                <span>₹{(totalAmount * 0.05).toFixed(0)}</span>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Total Amount</span>
                                <span style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '24px'
                                }}>
                                    ₹{(totalAmount + (totalAmount > 200 ? 0 : 40) + (totalAmount * 0.05)).toFixed(0)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '30px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginBottom: '12px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Proceed to Checkout →
                        </button>

                        <button
                            onClick={() => navigate('/menu')}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: '1px solid #667eea',
                                color: '#667eea',
                                padding: '12px',
                                borderRadius: '30px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;