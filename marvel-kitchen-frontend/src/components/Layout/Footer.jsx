// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: '#0f0f23',
            borderTop: '1px solid rgba(102, 126, 234, 0.2)',
            marginTop: 'auto'
        }}>
            {/* Main Footer */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '60px 20px 40px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px'
            }}>
                {/* About Section */}
                <div>
                    <h3 style={{
                        color: 'white',
                        fontSize: '20px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '28px' }}>🍔</span>
                        Marvel Kitchen
                    </h3>
                    <p style={{ color: '#a0a0c0', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Delicious food delivered to your doorstep. Fresh ingredients, best prices, fast delivery.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                            color: '#a0a0c0',
                            fontSize: '24px',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.target.style.color = '#E4405F'}
                           onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{
                            color: '#a0a0c0',
                            fontSize: '24px',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.target.style.color = '#25D366'}
                           onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                            <FaWhatsapp />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                            color: '#a0a0c0',
                            fontSize: '24px',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.target.style.color = '#1877F2'}
                           onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                            <FaFacebook />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                            color: '#a0a0c0',
                            fontSize: '24px',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.target.style.color = '#1DA1F2'}
                           onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                            <FaTwitter />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
                            color: '#a0a0c0',
                            fontSize: '24px',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => e.target.style.color = '#FF0000'}
                           onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>Quick Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '12px' }}>
                            <Link to="/" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                                   onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                   onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                                 Home
                            </Link>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            <Link to="/menu" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                                   onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                   onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                                 Menu
                            </Link>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            <Link to="/about" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                                   onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                   onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                                 About Us
                            </Link>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            <Link to="/contact" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                                   onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                   onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                                 Contact
                            </Link>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            <Link to="/faq" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                                   onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                   onMouseLeave={(e) => e.target.style.color = '#a0a0c0'}>
                                 FAQ
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>Contact Us</h3>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#a0a0c0', fontSize: '14px' }}>
                        <FaMapMarkerAlt style={{ color: '#667eea', fontSize: '18px' }} />
                        <span>Pune, Maharashtra, India</span>
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#a0a0c0', fontSize: '14px' }}>
                        <FaPhone style={{ color: '#667eea', fontSize: '16px' }} />
                        <span>+91 98765 43210</span>
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#a0a0c0', fontSize: '14px' }}>
                        <FaEnvelope style={{ color: '#667eea', fontSize: '16px' }} />
                        <span>info@marvelkitchen.com</span>
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#a0a0c0', fontSize: '14px' }}>
                        <FaClock style={{ color: '#667eea', fontSize: '16px' }} />
                        <span>10:00 AM - 11:00 PM (Daily)</span>
                    </div>
                </div>

                {/* Opening Hours / Newsletter */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>Delivery Hours</h3>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#a0a0c0', fontSize: '14px' }}>
                        <div>
                            <div>Free delivery on orders above ₹200</div>
                            <div style={{ fontSize: '12px', marginTop: '5px' }}>Delivery within 30-45 minutes</div>
                        </div>
                    </div>
                    <div style={{
                        background: '#1a1a3e',
                        borderRadius: '12px',
                        padding: '15px',
                        marginTop: '20px'
                    }}>
                        <p style={{ color: '#a0a0c0', fontSize: '13px', marginBottom: '10px' }}>
                            <strong>⭐ 4.8/5 Rating</strong> from 5000+ customers
                        </p>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '18px' }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: '#FFD700' }}>★</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ color: '#a0a0c0', fontSize: '13px' }}>
                        &copy; {currentYear} Marvel Kitchen. All rights reserved. | Designed with ❤️ for food lovers
                    </p>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px' }}>
                        <Link to="/privacy" style={{ color: '#a0a0c0', textDecoration: 'none' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ color: '#a0a0c0', textDecoration: 'none' }}>Terms of Service</Link>
                        <Link to="/refund" style={{ color: '#a0a0c0', textDecoration: 'none' }}>Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;