import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 160px)' }}>
                {children}
            </main>
            <footer>
                <p>&copy; 2024 Marvel Kitchen. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;