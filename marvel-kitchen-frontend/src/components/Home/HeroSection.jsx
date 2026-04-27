// src/components/Home/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
            title: "Artisan Pizza",
            subtitle: "Handcrafted with love",
            description: "Authentic Italian recipes, fresh ingredients, baked to perfection."
        },
        {
            image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
            title: "Gourmet Burgers",
            subtitle: "100% Premium Quality",
            description: "Juicy, flavorful burgers made with locally sourced ingredients."
        },
        {
            image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
            title: "Pasta Delights",
            subtitle: "Authentic Italian",
            description: "Homemade pasta cooked al dente, served with signature sauces."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div style={{ position: 'relative', height: '85vh', overflow: 'hidden' }}>
            {slides.map((slide, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: currentSlide === index ? 1 : 0,
                    transition: 'opacity 1s ease',
                    filter: 'brightness(0.65)'
                }} />
            ))}
            
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)'
            }} />
            
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
                zIndex: 10,
                width: '90%',
                maxWidth: '800px'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '2px',
                    color: '#FFD700',
                    marginBottom: '20px'
                }}>
                    WELCOME TO MARVEL KITCHEN
                </div>
                
                <h1 style={{
                    fontSize: 'clamp(40px, 8vw, 70px)',
                    fontWeight: '800',
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {slides[currentSlide].title}
                </h1>
                
                <p style={{
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    marginBottom: '30px',
                    color: 'rgba(255,255,255,0.9)'
                }}>
                    {slides[currentSlide].description}
                </p>
                
                <Link to="/menu" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '14px 40px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                   onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                    Order Now 🚀
                </Link>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                zIndex: 10
            }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                            width: currentSlide === index ? '40px' : '10px',
                            height: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: currentSlide === index ? '#FFD700' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;