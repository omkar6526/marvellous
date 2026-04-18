import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart, removeFromCart } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const loadCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCartItems([]);
            setTotalAmount(0);
            return;
        }
        try {
            const { data } = await getCart();
            setCartItems(data || []);
            const total = (data || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            setTotalAmount(total);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
            setTotalAmount(0);
        }
    };

    const addItemToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
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

    // ✅ Listen for storage events (when logout happens in another tab or window)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                if (!e.newValue) {
                    // Token removed - logout
                    setCartItems([]);
                    setTotalAmount(0);
                } else {
                    // Token added - login
                    loadCart();
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // ✅ Listen for page visibility (when user comes back to tab)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && localStorage.getItem('token')) {
                loadCart();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Initial load
    useEffect(() => {
        loadCart();
    }, []);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            totalAmount, 
            addItemToCart, 
            removeItemFromCart,
            loadCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};