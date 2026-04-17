import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart, removeFromCart } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const loadCart = async () => {
        if (!localStorage.getItem('token')) return;
        try {
            const { data } = await getCart();
            setCartItems(data);
            const total = data.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            setTotalAmount(total);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const addItemToCart = async (productId, quantity = 1) => {
        if (!localStorage.getItem('token')) {
            toast.error('Please login first');
            return;
        }
        try {
            await addToCart(productId, quantity);
            await loadCart();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add');
        }
    };

    const removeItemFromCart = async (productId) => {
        try {
            await removeFromCart(productId);
            await loadCart();
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
    };

    useEffect(() => {
        loadCart();
    }, []);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            totalAmount, 
            addItemToCart, 
            removeItemFromCart,
            loadCart,      // ← ADD THIS
            clearCart      // ← ADD THIS
        }}>
            {children}
        </CartContext.Provider>
    );
};