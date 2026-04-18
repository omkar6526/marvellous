import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { cartItems } = useCart();
    const isLoggedIn = localStorage.getItem('token');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged out successfully!');
        
        // ✅ FULL PAGE REFRESH - Force reload to login page
        window.location.href = '/login';
    };

    const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <nav style={{
            background: '#0f0f23',
            borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '16px 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '28px' }}>🍔</span>
                    Marvel Kitchen
                </Link>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{
                        color: '#c0c0e0',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        fontSize: '14px',
                        fontWeight: '500'
                    }} onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                    }}
                       onMouseLeave={(e) => {
                        e.target.style.color = '#c0c0e0';
                        e.target.style.background = 'transparent';
                    }}>
                        🏠 Home
                    </Link>
                    
                    <Link to="/menu" style={{
                        color: '#c0c0e0',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        fontSize: '14px',
                        fontWeight: '500'
                    }} onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                    }}
                       onMouseLeave={(e) => {
                        e.target.style.color = '#c0c0e0';
                        e.target.style.background = 'transparent';
                    }}>
                        🍕 Menu
                    </Link>
                    
                    {isLoggedIn && userRole !== 'ADMIN' && (
                        <Link to="/my-orders" style={{
                            color: '#c0c0e0',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            fontSize: '14px',
                            fontWeight: '500'
                        }} onMouseEnter={(e) => {
                            e.target.style.color = 'white';
                            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                        }}
                           onMouseLeave={(e) => {
                            e.target.style.color = '#c0c0e0';
                            e.target.style.background = 'transparent';
                        }}>
                            📦 My Orders
                        </Link>
                    )}
                    
                    <Link to="/cart" style={{
                        color: '#c0c0e0',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }} onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                    }}
                       onMouseLeave={(e) => {
                        e.target.style.color = '#c0c0e0';
                        e.target.style.background = 'transparent';
                    }}>
                        🛒 Cart
                        {cartCount > 0 && (
                            <span style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '2px 8px',
                                fontSize: '11px',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '8px 24px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                marginLeft: '8px'
                            }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                               onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                                Login
                            </Link>
                            
                            <Link to="/register" style={{
                                border: '2px solid #667eea',
                                color: '#667eea',
                                background: 'transparent',
                                padding: '8px 24px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                               onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Profile Dropdown */}
                            <div style={{ position: 'relative', marginLeft: '8px' }} className="dropdown">
                                <button style={{
                                    background: 'linear-gradient(135deg, #1a1a3e 0%, #1e1e4a 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.3)',
                                    padding: '8px 20px',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'white',
                                    transition: 'all 0.3s ease'
                                }} onMouseEnter={(e) => {
                                    e.target.style.background = '#2a2a5e';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                   onMouseLeave={(e) => {
                                    e.target.style.background = '#1a1a3e';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                    <span style={{ fontSize: '16px' }}>👤</span>
                                    <span>{userName || 'User'}</span>
                                    <span style={{ fontSize: '12px' }}>▼</span>
                                </button>
                                
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    background: '#1a1a3e',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    minWidth: '240px',
                                    display: 'none',
                                    zIndex: 1000,
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                    overflow: 'hidden'
                                }} className="dropdown-menu">
                                    <div style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        background: 'linear-gradient(135deg, #1e1e4a 0%, #1a1a3e 100%)'
                                    }}>
                                        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{userName}</div>
                                        <div style={{ fontSize: '12px', color: '#a0a0c0' }}>{localStorage.getItem('email')}</div>
                                    </div>
                                    
                                    <Link to="/profile" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        color: '#c0c0e0',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        fontSize: '14px'
                                    }} onMouseEnter={(e) => {
                                        e.target.style.background = '#2a2a5e';
                                        e.target.style.color = 'white';
                                    }}
                                       onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#c0c0e0';
                                    }}>
                                        <span>👤</span> My Profile
                                    </Link>
                                    
                                    {userRole === 'ADMIN' && (
                                        <Link to="/admin/dashboard" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 20px',
                                            color: '#c0c0e0',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            fontSize: '14px'
                                        }} onMouseEnter={(e) => {
                                            e.target.style.background = '#2a2a5e';
                                            e.target.style.color = 'white';
                                        }}
                                           onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#c0c0e0';
                                        }}>
                                            <span>⚙️</span> Admin Dashboard
                                        </Link>
                                    )}
                                    
                                    <Link to="/my-orders" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        color: '#c0c0e0',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        fontSize: '14px'
                                    }} onMouseEnter={(e) => {
                                        e.target.style.background = '#2a2a5e';
                                        e.target.style.color = 'white';
                                    }}
                                       onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#c0c0e0';
                                    }}>
                                        <span>📦</span> My Orders
                                    </Link>
                                    
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                                    
                                    <button onClick={handleLogout} style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        color: '#ef4444',
                                        fontSize: '14px',
                                        transition: 'all 0.2s ease'
                                    }} onMouseEnter={(e) => {
                                        e.target.style.background = '#2a2a5e';
                                    }}
                                       onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                    }}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Dropdown CSS */}
            <style>{`
                .dropdown:hover .dropdown-menu {
                    display: block !important;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .dropdown-menu {
                        position: fixed !important;
                        top: auto !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        width: 90% !important;
                        max-width: 320px !important;
                    }
                    
                    nav > div {
                        padding: 15px 20px !important;
                    }
                }
                
                @media (max-width: 640px) {
                    nav > div {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .nav-links {
                        justify-content: center;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;