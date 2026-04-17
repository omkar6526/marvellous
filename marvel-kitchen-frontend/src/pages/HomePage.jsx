import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <div className="hero">
                <h1>Marvel Kitchen</h1>
                <p>Delicious food delivered to your doorstep</p>
                <Link to="/menu" className="btn btn-secondary">Order Now 🚀</Link>
            </div>
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <h2>Welcome to Marvel Kitchen</h2>
                <p>Fresh ingredients | Fast delivery | Best prices</p>
            </div>
        </div>
    );
};

export default HomePage;