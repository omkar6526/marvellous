import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add token to every request - FIXED
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // 👈 YAHAN "Bearer " add karo
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token added to request:', config.url);
    } else {
        console.log('No token found for:', config.url);
    }
    return config;
});

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

export default api;