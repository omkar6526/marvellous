// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN';
    
    // Agar admin hai to sirf children return karo (navbar mat dikhao)
    if (isAdmin) {
        return <>{children}</>;
    }
    
    // Normal user ke liye navbar ke saath
    return (
        <div>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 160px)' }}>
                {children}
            </main>
            <footer style={{
                backgroundColor: '#333',
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                marginTop: '40px'
            }}>
                <p>&copy; 2024 Marvel Kitchen. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;