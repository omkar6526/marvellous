import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import './index.css';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';


function App() {
    const isLoggedIn = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <CartProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><HomePage /></Layout>} />
                    <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
                    <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                    <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" />} />
                    
                    {/* Protected User Routes */}
                    <Route path="/checkout" element={isLoggedIn ? <Layout><CheckoutPage /></Layout> : <Navigate to="/login" />} />
                    <Route path="/my-orders" element={isLoggedIn ? <Layout><MyOrdersPage /></Layout> : <Navigate to="/login" />} />
                    <Route path="/profile" element={isLoggedIn ? <Layout><ProfilePage /></Layout> : <Navigate to="/login" />} />
                    
                    {/* Admin Route - Only for ADMIN role */}
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            isLoggedIn && userRole === 'ADMIN' ? 
                            <Layout><AdminDashboard /></Layout> : 
                            <Navigate to="/" />
                        } 
                    />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;