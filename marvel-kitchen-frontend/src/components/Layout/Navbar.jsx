import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const isLoggedIn = localStorage.getItem('token');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <nav style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '15px 20px',
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
                    color: '#667eea',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    🍔 Marvel Kitchen
                </Link>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.color = '#667eea'}
                       onMouseLeave={(e) => e.target.style.color = '#333'}>
                        Home
                    </Link>
                    
                    <Link to="/menu" style={{
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.color = '#667eea'}
                       onMouseLeave={(e) => e.target.style.color = '#333'}>
                        Menu
                    </Link>
                    
                    {isLoggedIn && (
                        <Link to="/my-orders" style={{
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }} onMouseEnter={(e) => e.target.style.color = '#667eea'}
                           onMouseLeave={(e) => e.target.style.color = '#333'}>
                            My Orders
                        </Link>
                    )}
                    
                    <Link to="/cart" style={{
                        color: '#333',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.color = '#667eea'}
                       onMouseLeave={(e) => e.target.style.color = '#333'}>
                        🛒 Cart
                        {cartCount > 0 && (
                            <span style={{
                                backgroundColor: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '12px',
                                marginLeft: '5px'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" style={{
                                backgroundColor: '#667eea',
                                color: 'white',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                transition: 'transform 0.2s'
                            }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                               onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                Login
                            </Link>
                            
                            <Link to="/register" style={{
                                border: '2px solid #667eea',
                                color: '#667eea',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                transition: 'transform 0.2s'
                            }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                               onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Profile Dropdown */}
                            <div style={{ position: 'relative' }} className="dropdown">
                                <button style={{
                                    backgroundColor: '#f3f4f6',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    transition: 'background-color 0.2s'
                                }} onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                                   onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
                                    <span>👤</span>
                                    <span>Hi, {userName || 'User'}</span>
                                    <span>▼</span>
                                </button>
                                
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    minWidth: '200px',
                                    display: 'none',
                                    zIndex: 1000
                                }} className="dropdown-menu">
                                    <Link to="/profile" style={{
                                        display: 'block',
                                        padding: '12px 20px',
                                        color: '#333',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #eee',
                                        transition: 'background-color 0.2s'
                                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
                                        👤 My Profile
                                    </Link>
                                    
                                    {userRole === 'ADMIN' && (
                                        <Link to="/admin/dashboard" style={{
                                            display: 'block',
                                            padding: '12px 20px',
                                            color: '#333',
                                            textDecoration: 'none',
                                            borderBottom: '1px solid #eee',
                                            transition: 'background-color 0.2s'
                                        }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                           onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
                                            ⚙️ Admin Dashboard
                                        </Link>
                                    )}
                                    
                                    <Link to="/my-orders" style={{
                                        display: 'block',
                                        padding: '12px 20px',
                                        color: '#333',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #eee',
                                        transition: 'background-color 0.2s'
                                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
                                        📦 My Orders
                                    </Link>
                                    
                                    <button onClick={handleLogout} style={{
                                        width: '100%',
                                        padding: '12px 20px',
                                        backgroundColor: 'white',
                                        border: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        color: '#ef4444',
                                        borderBottomLeftRadius: '10px',
                                        borderBottomRightRadius: '10px',
                                        transition: 'background-color 0.2s'
                                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
                                        🚪 Logout
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
                }
                
                @media (max-width: 768px) {
                    .dropdown-menu {
                        position: fixed !important;
                        top: auto !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        width: 90% !important;
                        max-width: 300px !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;