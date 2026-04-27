// src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import PopularItems from '../components/Home/PopularItems';

const HomePage = () => {
    return (
        <div style={{ background: '#0f0f23' }}>
            <HeroSection />
            <FeaturesSection />
            <PopularItems />
        </div>
    );
};

export default HomePage;