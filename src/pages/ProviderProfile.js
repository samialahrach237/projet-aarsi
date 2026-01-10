import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/ProviderProfile.css';

function ProviderProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('packages');

  // هذا السطر يحل مشكلة التحذير (ESLint Warning) وأيضاً يساعدك في التأكد من أن الرابط يعمل
  useEffect(() => {
    console.log("Current Provider ID:", id);
  }, [id]);

  // بيانات وهمية تحاكي التصميم في الشريحة 6 و 7
  const provider = {
    name: "Zaineb Negafa Exclusive",
    location: "Marrakech, Morocco",
    rating: 4.9,
    reviews: 120,
    bookings: "250+",
    // صورة زفاف مغربي فاخر للخلفية
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920", 
    packages: [
      {
        id: 1,
        title: "Royal Caftan Rental & Styling",
        price: "5,000 MAD",
        features: ["Premium Caftan Collection", "Professional Styling Session", "Accessories Included (Belt, Jewelry)", "On-site Assistance"]
      },
      {
        id: 2,
        title: "Deluxe Nekkacha Package",
        price: "3,000 MAD",
        features: ["Bridal Henna", "Hand & Foot Care", "Traditional Setup"]
      },
      {
        id: 3,
        title: "Traditional Music & DJ",
        price: "7,500 MAD",
        features: ["Live Band (4 Pax)", "DJ Set for Party", "High Quality Sound System"]
      }
    ]
  };

  return (
    <div className="profile-page">
      {/* 1. Hero Section (Slide 6) */}
      <div className="profile-hero" style={{ backgroundImage: `url(${provider.coverImage})` }}>
        <div className="hero-overlay"></div>
      </div>

      {/* 2. Floating Info Card (Slide 6) */}
      <div className="profile-info-card">
        <div className="info-main">
          <h1 className="provider-name">{provider.name}</h1>
          <p className="provider-location">📍 {provider.location}</p>
        </div>
        
        <div className="info-stats">
          <div className="stat-item">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-text">{provider.rating} ({provider.reviews} Reviews)</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="booking-count">{provider.bookings}</span>
            <span className="booking-label">BOOKINGS</span>
          </div>
        </div>

        <button className="book-now-btn">BOOK NOW</button>
      </div>

      {/* 3. Content Tabs & Packages (Slide 7) */}
      <div className="profile-content-container">
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`} 
            onClick={() => setActiveTab('packages')}
          >
            PACKAGES & AVAILABILITY
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gallery')}
          >
            GALLERY
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
            onClick={() => setActiveTab('reviews')}
          >
            REVIEWS
          </button>
        </div>

        {/* Packages List (Matching Slide 7 Design) */}
        {activeTab === 'packages' && (
          <div className="packages-list">
            <h2 className="section-title">Select your perfect package</h2>
            
            {provider.packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-header">
                  <h3 className="package-title">{pkg.title}</h3>
                  <span className="package-price">{pkg.price}</span>
                </div>
                
                <ul className="package-features">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>

                <button className="select-package-btn">SELECT</button>
              </div>
            ))}
          </div>
        )}

        {/* محتوى إضافي لتبويبات أخرى (فارغ حالياً) */}
        {activeTab === 'gallery' && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Gallery content goes here...</p>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Reviews content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderProfile;