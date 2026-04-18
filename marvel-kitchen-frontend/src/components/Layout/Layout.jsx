// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN';
    
    // Agar admin hai to sirf children return karo (navbar mat dikhao)
    if (isAdmin) {
        return <>{children}</>;
    }
    
    // Normal user ke liye navbar ke saath
    return (
        <div style={{ background: '#0f0f23', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 160px)' }}>
                {children}
            </main>
            <footer style={{
                background: '#1a1a3e',
                color: '#a0a0c0',
                textAlign: 'center',
                padding: '30px 20px',
                marginTop: '40px',
                borderTop: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        marginBottom: '20px',
                        textAlign: 'left'
                    }}>
                        {/* About Section */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Marvel Kitchen</h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                Delicious food delivered to your doorstep. Fresh ingredients, best prices, fast delivery.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Quick Links</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="/menu" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '13px' }}>Menu</a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="/about" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '13px' }}>About Us</a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="/contact" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '13px' }}>Contact</a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Contact Us</h3>
                            <p style={{ fontSize: '13px', marginBottom: '8px' }}>📞 +91 98765 43210</p>
                            <p style={{ fontSize: '13px', marginBottom: '8px' }}>✉️ info@marvelkitchen.com</p>
                            <p style={{ fontSize: '13px' }}>📍 Pune, Maharashtra, India</p>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Follow Us</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <a href="#" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '24px' }}>📘</a>
                                <a href="#" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '24px' }}>📷</a>
                                <a href="#" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '24px' }}>🐦</a>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '20px',
                        marginTop: '20px',
                        fontSize: '12px'
                    }}>
                        <p>&copy; 2024 Marvel Kitchen. All rights reserved. | Designed with ❤️ for food lovers</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;