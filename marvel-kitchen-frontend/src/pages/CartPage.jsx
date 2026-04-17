import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, totalAmount, removeItemFromCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <h2>Your cart is empty</h2>
                <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1>Your Cart</h1>
            {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                    <div>
                        <h4>{item.product.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                    <div>₹{item.product.price * item.quantity}</div>
                    <button onClick={() => removeItemFromCart(item.product.id)} className="btn btn-primary">Remove</button>
                </div>
            ))}
            <div className="cart-total">
                Total: ₹{totalAmount}
                <Link to="/checkout" className="btn btn-primary">Checkout</Link>
            </div>
        </div>
    );
};

export default CartPage;