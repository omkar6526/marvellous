import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const { addItemToCart } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);
            const uniqueCategories = ['all', ...new Set(res.data.map(p => p.category?.name || 'Uncategorized'))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Error loading products:', err);
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        await addItemToCart(product.id, 1);
    };

    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(p => (p.category?.name || 'Uncategorized') === selectedCategory);

    if (loading) {
        return (
            <div style={{
                minHeight: '80vh',
                background: '#0f0f23',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #667eea',
                        borderTop: '4px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3 style={{ color: '#667eea' }}>Loading Menu...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f23',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px'
                    }}>
                        Our Menu
                    </h1>
                    <p style={{ color: '#a0a0c0', maxWidth: '600px', margin: '0 auto' }}>
                        Discover our delicious selection of freshly prepared dishes made with love
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '40px'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '8px 24px',
                                background: selectedCategory === cat 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                    : '#1a1a3e',
                                border: selectedCategory === cat 
                                    ? 'none' 
                                    : '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '30px',
                                color: selectedCategory === cat ? 'white' : '#c0c0e0',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedCategory !== cat) {
                                    e.target.style.background = '#2a2a5e';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedCategory !== cat) {
                                    e.target.style.background = '#1a1a3e';
                                }
                            }}
                        >
                            {cat === 'all' ? 'All Items' : cat}
                        </button>
                    ))}
                </div>

                {filteredProducts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px',
                        background: '#1a1a3e',
                        borderRadius: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
                        <h3 style={{ color: 'white', marginBottom: '8px' }}>No items found</h3>
                        <p style={{ color: '#a0a0c0' }}>Try selecting a different category</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    background: '#1a1a3e',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Product Image with local URL */}
                                <div style={{
                                    height: '200px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: '#2a2a5e'
                                }}>
                                    {product.image_url ? (
                                        <img 
                                            src={product.image_url}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                // If image fails to load, show emoji fallback
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentElement;
                                                if (parent) {
                                                    const fallbackDiv = document.createElement('div');
                                                    fallbackDiv.style.height = '100%';
                                                    fallbackDiv.style.display = 'flex';
                                                    fallbackDiv.style.alignItems = 'center';
                                                    fallbackDiv.style.justifyContent = 'center';
                                                    fallbackDiv.style.background = `linear-gradient(135deg, ${product.isVeg ? '#10b981' : '#ef4444'}20, #2a2a5e)`;
                                                    fallbackDiv.style.fontSize = '80px';
                                                    fallbackDiv.innerHTML = product.isVeg ? '🌱' : '🍖';
                                                    parent.appendChild(fallbackDiv);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: `linear-gradient(135deg, ${product.isVeg ? '#10b981' : '#ef4444'}20, #2a2a5e)`
                                        }}>
                                            <div style={{ fontSize: '80px' }}>
                                                {product.isVeg ? '🌱' : '🍖'}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Veg/Non-Veg Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: product.isVeg ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: 'white',
                                        zIndex: 1
                                    }}>
                                        {product.isVeg ? 'VEG' : 'NON-VEG'}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '12px'
                                    }}>
                                        <h3 style={{
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            margin: 0
                                        }}>
                                            {product.name}
                                        </h3>
                                        <div style={{
                                            background: 'rgba(16, 185, 129, 0.15)',
                                            padding: '4px 10px',
                                            borderRadius: '20px'
                                        }}>
                                            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>
                                                ₹{product.price}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{
                                        color: '#a0a0c0',
                                        fontSize: '13px',
                                        lineHeight: '1.5',
                                        marginBottom: '16px',
                                        minHeight: '60px'
                                    }}>
                                        {product.description || 'Delicious food made with fresh ingredients.'}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            color: '#f59e0b',
                                            fontSize: '13px'
                                        }}>
                                            <span>⭐</span>
                                            <span>{product.rating || '4.5'}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 20px',
                                                borderRadius: '25px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            🛒 Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default MenuPage;