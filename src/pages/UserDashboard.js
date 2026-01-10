import React, { useState } from 'react';
import '../Styles/UserDashboard.css';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // بيانات وهمية تحاكي الشريحة 11
  const bookings = [
    { id: 1, service: "Bridal Makeup Package", provider: "Zhor Makeup", date: "25 Oct 2025", time: "10:00 AM", status: "confirmed", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300" },
    { id: 2, service: "Wedding Photography", provider: "Simo Photo", date: "12 Nov 2025", time: "14:00 PM", status: "pending", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300" }
  ];

  const pastBookings = [
     { id: 3, service: "Caftan Rental", provider: "Fatima Caftan", date: "10 Jan 2024", status: "completed", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300" }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Mon Tableau de Bord</h1>
      
      {/* Tabs Navigation (Slide 11) */}
      <div className="dashboard-tabs">
        <button 
          className={`dash-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 À Venir
        </button>
        <button 
          className={`dash-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          📜 Historique
        </button>
        <button 
          className={`dash-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favoris
        </button>
        <button 
          className={`dash-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Paramètres
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        
        {/* Upcoming Bookings Tab */}
        {activeTab === 'upcoming' && (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <img src={booking.image} alt={booking.service} className="booking-img" />
                <div className="booking-info">
                  <h3>{booking.service}</h3>
                  <p className="provider-name">Avec: {booking.provider}</p>
                  <div className="booking-meta">
                    <span>📅 {booking.date}</span>
                    <span>⏰ {booking.time}</span>
                  </div>
                  <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                </div>
                <button className="action-btn">Voir Détails</button>
              </div>
            ))}
          </div>
        )}

        {/* Past Bookings Tab */}
        {activeTab === 'past' && (
          <div className="bookings-grid">
            {pastBookings.map(booking => (
              <div key={booking.id} className="booking-card past">
                <img src={booking.image} alt={booking.service} className="booking-img" />
                <div className="booking-info">
                  <h3>{booking.service}</h3>
                  <p className="provider-name">{booking.provider}</p>
                  <span className="status-badge completed">Terminé</span>
                </div>
                <button className="review-btn">⭐ Laisser un avis</button>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab (Slide 12 Profile Form) */}
        {activeTab === 'settings' && (
          <div className="settings-form">
            <h2>Mon Profil</h2>
            <div className="form-group">
              <label>Nom Complet</label>
              <input type="text" defaultValue="Ayoub Touati" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="ayoub@example.com" />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input type="tel" defaultValue="0600000000" />
            </div>
            <button className="save-btn">Enregistrer les modifications</button>
          </div>
        )}

        {activeTab === 'favorites' && (
             <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                 <p>Vous n'avez pas encore de favoris.</p>
                 <button className="action-btn" style={{marginTop: '10px'}}>Explorer les services</button>
             </div>
        )}

      </div>
    </div>
  );
}

export default UserDashboard;