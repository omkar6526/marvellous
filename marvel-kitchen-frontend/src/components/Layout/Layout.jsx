// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; 

const Layout = ({ children }) => {
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN';
    
    // Agar admin hai to sirf children return karo (navbar mat dikhao)
    if (isAdmin) {
        return <>{children}</>;
    }
    
    // Normal user ke liye navbar ke saath
    return (
        <div style={{ background: '#0f0f23', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, minHeight: 'calc(100vh - 160px)' }}>
                {children}
            </main>
            <Footer />  
        </div>
    );
};

export default Layout;