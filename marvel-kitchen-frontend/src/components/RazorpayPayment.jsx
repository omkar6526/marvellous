// src/components/RazorpayPayment.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RazorpayPayment = ({ amount, orderId, onSuccess, onFailure }) => {
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        
        // Load Razorpay script
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            toast.error('Payment gateway failed to load');
            setProcessing(false);
            return;
        }

        try {
            // Create order on your backend
            const response = await axios.post('http://localhost:8080/api/payments/create-order', {
                amount: amount
            });

            const order = response.data;

            const options = {
                key: 'rzp_test_SerDMSkbkHt3Ib', // ✅ Tera Test Key ID
                amount: order.amount,
                currency: order.currency,
                name: 'Marvel Kitchen',
                description: `Order #${orderId}`,
                image: '/logo.png',
                order_id: order.id,
                prefill: {
                    name: localStorage.getItem('name') || '',
                    email: localStorage.getItem('email') || '',
                    contact: localStorage.getItem('phone') || ''
                },
                notes: {
                    address: localStorage.getItem('address') || ''
                },
                theme: {
                    color: '#667eea'
                },
                handler: async (response) => {
                    // Verify payment
                    const verifyRes = await axios.post('http://localhost:8080/api/payments/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.data.success) {
                        toast.success('Payment successful!');
                        onSuccess(response);
                    } else {
                        toast.error('Payment verification failed');
                        onFailure();
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                        toast.error('Payment cancelled');
                        onFailure();
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={processing}
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.7 : 1
            }}
        >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
        </button>
    );
};

export default RazorpayPayment;