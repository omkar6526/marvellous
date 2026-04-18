import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
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

    const features = [
        { icon: "🍕", title: "Fresh Ingredients", desc: "100% fresh and quality ingredients" },
        { icon: "🚚", title: "Fast Delivery", desc: "Delivery within 30 minutes" },
        { icon: "💰", title: "Best Prices", desc: "Affordable rates, great value" },
        { icon: "🌟", title: "Premium Quality", desc: "Top-notch food quality" },
        { icon: "🍔", title: "Variety Menu", desc: "Wide range of delicious items" },
        { icon: "🧑‍🍳", title: "Expert Chefs", desc: "Professionally trained chefs" }
    ];

    const popularItems = [
        { name: "Margherita Pizza", price: 299, icon: "🍕", isVeg: true },
        { name: "Cheese Burger", price: 199, icon: "🍔", isVeg: false },
        { name: "Garlic Bread", price: 99, icon: "🥖", isVeg: true },
        { name: "Pasta Alfredo", price: 249, icon: "🍝", isVeg: true }
    ];

    return (
        <div style={{ background: '#0f0f23' }}>
            {/* Hero Section with Carousel */}
            <div style={{
                position: 'relative',
                height: '85vh',
                overflow: 'hidden'
            }}>
                {/* Carousel Images */}
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
                
                {/* Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)'
                }} />
                
                {/* Hero Content */}
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

                {/* Slide Indicators */}
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

            {/* Features Section */}
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                                <div style={{ fontSize: '50px', marginBottom: '16px' }}>{feature.icon}</div>
                                <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '20px' }}>{feature.title}</h3>
                                <p style={{ color: '#a0a0c0', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Items Section */}
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
                                <div style={{ fontSize: '60px', marginBottom: '16px' }}>{item.icon}</div>
                                <div style={{
                                    display: 'inline-block',
                                    background: item.isVeg ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    padding: '4px 8px',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    color: item.isVeg ? '#10b981' : '#ef4444',
                                    marginBottom: '12px'
                                }}>
                                    {item.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
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
                                    transition: 'all 0.3s ease'
                                }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                    Order Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 42px)',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '16px'
                    }}>
                        Ready to Order?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontSize: '18px' }}>
                        Get your favorite food delivered right to your doorstep
                    </p>
                    <Link to="/menu" style={{
                        background: 'white',
                        color: '#667eea',
                        padding: '14px 40px',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'transform 0.3s ease'
                    }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                       onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                        Browse Full Menu 🍕
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;