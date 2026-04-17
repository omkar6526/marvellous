// RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address
            });
            toast.success('Registration successful! Please login. 🎉');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data || 'Registration failed');
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
            padding: '40px 20px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '1100px',
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
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>🍕</div>
                    <h2 style={{ fontSize: '28px', marginBottom: '10px', textAlign: 'center' }}>
                        Join Marvel Kitchen!
                    </h2>
                    <p style={{ textAlign: 'center', opacity: 0.9, lineHeight: '1.6' }}>
                        Create an account to order delicious food and get exclusive offers
                    </p>
                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>Already have an account?</div>
                        <Link to="/login" style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderBottom: '2px solid white',
                            paddingBottom: '2px'
                        }}>
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div style={{
                    flex: 1,
                    padding: '40px',
                    backgroundColor: 'white',
                    maxHeight: '600px',
                    overflowY: 'auto'
                }}>
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>
                            Create Account
                        </h2>
                        <p style={{ color: '#666' }}>Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Full Name *
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px',
                                transition: 'all 0.3s'
                            }}>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Email Address *
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px'
                            }}>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Password *
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px'
                            }}>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Min 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Confirm Password *
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px'
                            }}>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>✓</span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Phone Number
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px'
                            }}>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>📞</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                Delivery Address
                            </label>
                            <div style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '0 12px'
                            }}>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Enter your delivery address"
                                />
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
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        fontSize: '12px',
                        color: '#999'
                    }}>
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;