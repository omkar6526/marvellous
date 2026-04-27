// src/components/Home/PopularItems.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPizzaSlice, FaHamburger, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { FaBreadSlice } from 'react-icons/fa';
import { GiNoodles } from 'react-icons/gi';

const PopularItems = () => {
    const navigate = useNavigate();

    const popularItems = [
        { name: "Margherita Pizza", price: 299, icon: <FaPizzaSlice />, isVeg: true },
        { name: "Cheese Burger", price: 199, icon: <FaHamburger />, isVeg: false },
        { name: "Garlic Bread", price: 99, icon: <FaBreadSlice />, isVeg: true },
        { name: "Pasta Alfredo", price: 249, icon: <GiNoodles />, isVeg: true }
    ];

    return (
        <div style={{ padding: '80px 20px', background: '#1a1a3e' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(102, 126, 234, 0.2)',
                    padding: '6px 20px',
                    borderRadius: '50px',
                    marginBottom: '20px'
                }}>
                    <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '600' }}>Popular Dishes</span>
                </div>
                
                <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px'
                }}>
                    Our Most Loved Items
                </h2>
                
                <p style={{ color: '#a0a0c0', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
                    Customer favorites that keep them coming back for more
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px'
                }}>
                    {popularItems.map((item, index) => (
                        <div key={index} style={{
                            background: '#0f0f23',
                            borderRadius: '20px',
                            padding: '30px',
                            textAlign: 'center',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                           onClick={() => navigate('/menu')}>
                            <div style={{ fontSize: '50px', marginBottom: '16px', color: '#f59e0b' }}>
                                {item.icon}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                background: item.isVeg ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                padding: '4px 8px',
                                borderRadius: '20px',
                                fontSize: '10px',
                                color: item.isVeg ? '#10b981' : '#ef4444',
                                marginBottom: '12px'
                            }}>
                                {item.isVeg ? <FaCheckCircle style={{ marginRight: '4px' }} /> : '🍖'} {item.isVeg ? 'VEG' : 'NON-VEG'}
                            </div>
                            <h3 style={{ color: 'white', marginBottom: '8px' }}>{item.name}</h3>
                            <p style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>₹{item.price}</p>
                            <button style={{
                                marginTop: '20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center'
                            }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                               onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                Order Now <FaArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularItems;