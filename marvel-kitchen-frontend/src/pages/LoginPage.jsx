// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Check if already logged in and token is valid
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token) {
            // ✅ Verify if token is still valid by making a test API call
            fetch('http://localhost:8080/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (res.status === 403 || res.status === 401) {
                    // Token expired, clear it
                    localStorage.clear();
                    console.log('Token expired. Please login again.');
                } else {
                    // Token valid, redirect
                    if (role === 'ADMIN') {
                        window.location.href = '/admin/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                }
            })
            .catch(() => {
                // On error, don't redirect
                console.log('Error checking token');
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await login(email, password);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);
            localStorage.setItem('phone', data.phone || '');
            localStorage.setItem('address', data.address || '');
            localStorage.setItem('userId', data.id || '');
            
            toast.success(`Welcome back, ${data.name}! 🎉`);
            
            // ✅ FULL PAGE REFRESH - Force reload for both admin and user
            if (data.role === 'ADMIN') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/';
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            // ✅ Handle different error cases
            if (error.response?.status === 403 || error.response?.status === 401) {
                toast.error('Invalid email or password');
            } else if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f23',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '1000px',
                width: '100%',
                background: '#1a1a3e',
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
                {/* Left Side - Illustration */}
                <div style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>🍔</div>
                    <h2 style={{ fontSize: '28px', marginBottom: '10px', textAlign: 'center' }}>
                        Welcome Back!
                    </h2>
                    <p style={{ textAlign: 'center', opacity: 0.9, lineHeight: '1.6' }}>
                        Login to continue your delicious journey with Marvel Kitchen
                    </p>
                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>New here?</div>
                        <Link to="/register" style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderBottom: '2px solid white',
                            paddingBottom: '2px'
                        }}>
                            Create an Account
                        </Link>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div style={{
                    flex: 1,
                    padding: '50px',
                    background: '#1a1a3e'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '28px',
                            marginBottom: '8px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Sign In
                        </h2>
                        <p style={{ color: '#a0a0c0' }}>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#c0c0e0',
                                fontWeight: '500'
                            }}>
                                Email Address
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#2a2a5e',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '12px',
                                padding: '0 15px',
                                transition: 'all 0.3s'
                            }}>
                                <span style={{ fontSize: '20px', marginRight: '10px' }}>📧</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '15px',
                                        background: 'transparent',
                                        color: 'white'
                                    }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#c0c0e0',
                                fontWeight: '500'
                            }}>
                                Password
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#2a2a5e',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '12px',
                                padding: '0 15px',
                                transition: 'all 0.3s'
                            }}>
                                <span style={{ fontSize: '20px', marginRight: '10px' }}>🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '15px',
                                        background: 'transparent',
                                        color: 'white'
                                    }}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        padding: '5px',
                                        color: '#a0a0c0'
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, opacity 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            {loading ? (
                                <span>⏳ Logging in...</span>
                            ) : (
                                <span>🔐 Login</span>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div style={{
                        marginTop: '25px',
                        padding: '15px',
                        background: '#2a2a5e',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <p style={{ fontSize: '12px', color: '#a0a0c0', marginBottom: '8px' }}>
                            <strong>Demo Credentials:</strong>
                        </p>
                        <div style={{ fontSize: '11px', color: '#c0c0e0' }}>
                            <div>👤 User: user@test.com / password</div>
                            <div>👨‍💼 Admin: admin@marvelkitchen.com / admin123</div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '15px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#a0a0c0'
                    }}>
                        <Link to="/forgot-password" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;