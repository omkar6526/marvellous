import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { totalAmount, cartItems, clearCart } = useCart();  // ← clearCart use karo
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // Agar cart empty hai to redirect
    if (cartItems.length === 0) {
        return (
            <div className="form-container">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/menu')} className="btn btn-primary">
                    Browse Menu
                </button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!address || !phone) {
            toast.error('Please fill all fields');
            return;
        }
        
        const orderData = {
            deliveryAddress: address,
            phoneNumber: phone,
            paymentMethod: 'COD'
        };
        
        console.log('Sending order data:', orderData);
        
        setLoading(true);
        
        try {
            const response = await placeOrder(orderData);
            console.log('Order response:', response.data);
            
            // Clear cart from frontend (backend already cleared)
            clearCart();
            
            toast.success('Order placed successfully!');
            
            // Navigate to orders page
            navigate('/my-orders');
            
        } catch (error) {
            console.error('Order error:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMsg = typeof error.response?.data === 'string' 
                ? error.response.data 
                : error.response?.data?.error || 'Failed to place order';
            
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Checkout</h2>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                Total Amount: ₹{totalAmount}
            </p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea 
                        rows="3" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Enter your full address" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="Enter your phone number" 
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading} 
                    style={{ width: '100%' }}
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;