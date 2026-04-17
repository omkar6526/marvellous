// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is admin
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (role !== 'ADMIN') {
            navigate('/');
            return;
        }
    }, [navigate]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3>Loading Dashboard...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '60px', marginBottom: '10px' }}>👨‍💼</div>
                        <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '10px' }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ color: '#666' }}>
                            Welcome back, {localStorage.getItem('name')}!
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '15px',
                            padding: '20px',
                            textAlign: 'center',
                            borderLeft: '4px solid #667eea'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>0</div>
                            <div style={{ color: '#666' }}>Total Orders</div>
                        </div>

                        <div style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '15px',
                            padding: '20px',
                            textAlign: 'center',
                            borderLeft: '4px solid #f59e0b'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏰</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>0</div>
                            <div style={{ color: '#666' }}>Pending Orders</div>
                        </div>

                        <div style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '15px',
                            padding: '20px',
                            textAlign: 'center',
                            borderLeft: '4px solid #10b981'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>₹0</div>
                            <div style={{ color: '#666' }}>Total Revenue</div>
                        </div>

                        <div style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '15px',
                            padding: '20px',
                            textAlign: 'center',
                            borderLeft: '4px solid #06b6d4'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📅</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4' }}>0</div>
                            <div style={{ color: '#666' }}>Today's Orders</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h3 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '15px',
                            padding: '25px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
                            <h3 style={{ marginBottom: '10px' }}>Manage Orders</h3>
                            <p style={{ color: '#666', fontSize: '14px' }}>View and update order status</p>
                        </div>

                        <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '15px',
                            padding: '25px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍕</div>
                            <h3 style={{ marginBottom: '10px' }}>Manage Products</h3>
                            <p style={{ color: '#666', fontSize: '14px' }}>Add, edit or remove products</p>
                        </div>

                        <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '15px',
                            padding: '25px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
                            <h3 style={{ marginBottom: '10px' }}>Manage Users</h3>
                            <p style={{ color: '#666', fontSize: '14px' }}>View and manage customers</p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div style={{
                        backgroundColor: '#e0e7ff',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>✨</div>
                        <h3 style={{ marginBottom: '10px', color: '#667eea' }}>Admin Access Granted</h3>
                        <p style={{ color: '#666' }}>
                            You have full administrative access to manage orders, products, and users.
                        </p>
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

export default AdminDashboard;