// src/components/Home/FeaturesSection.jsx
import React from 'react';
import { FaPizzaSlice, FaTruck, FaMoneyBillWave, FaStar, FaHamburger, FaCheckCircle } from 'react-icons/fa';
import { GiChefToque } from 'react-icons/gi';

const FeaturesSection = () => {
    const features = [
        { icon: <FaPizzaSlice />, title: "Fresh Ingredients", desc: "100% fresh and quality ingredients" },
        { icon: <FaTruck />, title: "Fast Delivery", desc: "Delivery within 30 minutes" },
        { icon: <FaMoneyBillWave />, title: "Best Prices", desc: "Affordable rates, great value" },
        { icon: <FaStar />, title: "Premium Quality", desc: "Top-notch food quality" },
        { icon: <FaHamburger />, title: "Variety Menu", desc: "Wide range of delicious items" },
        { icon: <GiChefToque />, title: "Expert Chefs", desc: "Professionally trained chefs" }
    ];

    return (
        <div style={{ padding: '80px 20px', background: '#0f0f23' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(102, 126, 234, 0.2)',
                    padding: '6px 20px',
                    borderRadius: '50px',
                    marginBottom: '20px'
                }}>
                    <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '600' }}>Why Choose Us</span>
                </div>
                
                <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px'
                }}>
                    What Makes Us Special?
                </h2>
                
                <p style={{ color: '#a0a0c0', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
                    We take pride in serving the best quality food with exceptional service
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {features.map((feature, index) => (
                        <div key={index} style={{
                            background: '#1a1a3e',
                            borderRadius: '20px',
                            padding: '30px',
                            textAlign: 'center',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            transition: 'transform 0.3s ease'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '50px', marginBottom: '16px', color: '#667eea' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '20px' }}>{feature.title}</h3>
                            <p style={{ color: '#a0a0c0', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;