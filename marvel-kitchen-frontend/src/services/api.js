import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add token to every request - FIXED
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token added to request:', config.url);
    } else {
        console.log('No token found for:', config.url);
    }
    return config;
});

// ✅ Add response interceptor to handle token expiry
api.interceptors.response.use(
    (response) => {
        // If response is successful, just return it
        return response;
    },
    (error) => {
        // Check if error is 403 (Forbidden) or 401 (Unauthorized)
        if (error.response?.status === 403 || error.response?.status === 401) {
            const token = localStorage.getItem('token');
            
            // If token exists but got 403/401, token is expired or invalid
            if (token) {
                console.log('Token expired or invalid. Clearing localStorage...');
                localStorage.clear();
                
                // Only redirect if not already on login page
                if (window.location.pathname !== '/login' && 
                    window.location.pathname !== '/register') {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                }
            }
        }
        
        // Return error so individual calls can also handle it
        return Promise.reject(error);
    }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);

// Products
export const getProducts = () => api.get('/products');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);

// Orders
export const placeOrder = (orderData) => api.post('/orders/place', orderData);
export const getMyOrders = () => api.get('/orders/myorders');

// User Profile - ADD THESE FUNCTIONS
export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (userData) => api.put('/user/profile', userData);

//-------------------------------------Admin APIs-------------------------------------//
// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');
export const getAllOrders = () => api.get('/admin/orders');

export const updateOrderStatus = (orderId, status) => 
    api.put(`/admin/orders/${orderId}/status?status=${status}`);
export const getAllProducts = () => api.get('/admin/products');

export const addProduct = (productData) => api.post('/admin/products', productData);
export const updateProduct = (productId, productData) => 
    api.put(`/admin/products/${productId}`, productData);

export const deleteProduct = (productId) => api.delete(`/admin/products/${productId}`);
export const getAllUsers = () => api.get('/admin/users');

export const getUserOrders = (userId) => api.get(`/admin/users/${userId}/orders`);

// Toggle Product Availability
export const toggleProductAvailability = (productId) => 
    api.put(`/admin/products/${productId}/toggle`);

export default api;