import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const { addItemToCart } = useCart();

    useEffect(() => {
        getProducts().then(res => setProducts(res.data)).catch(err => console.log(err));
    }, []);

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', margin: '32px 0' }}>Our Menu</h1>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="product-price">₹{product.price}</div>
                        <button onClick={() => addItemToCart(product.id, 1)} className="btn btn-primary">Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;