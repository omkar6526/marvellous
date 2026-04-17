// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            
            // ✅ ROLE-BASED REDIRECT - FIXED
            if (data.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '1000px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
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
                    backgroundColor: 'white'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>
                            Sign In
                        </h2>
                        <p style={{ color: '#666' }}>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#333',
                                fontWeight: '500'
                            }}>
                                Email Address
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
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
                                        fontSize: '15px'
                                    }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#333',
                                fontWeight: '500'
                            }}>
                                Password
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
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
                                        fontSize: '15px'
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
                                        fontSize: '18px'
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
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
                            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
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