import React, { useState } from 'react';
import { FaHome, FaHistory, FaUser, FaSignOutAlt, FaCamera, FaEdit, FaCalendarAlt, FaClock, FaCheck, FaEllipsisH, FaTimes, FaCalendar, FaRegClock } from 'react-icons/fa';
import '../Styles/UserDashboard.css';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [user, setUser] = useState({
    name: 'Samia Lahrach',
    city: 'Casablanca',
    avatar: null
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [rating, setRating] = useState(5);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock data for reservations
  const upcomingReservations = [
    { id: 1, service: "Salle de Réception", provider: "Palais des Mille et Une Nuits", date: "15 Mars 2024", time: "19:00", status: "Confirmé" },
    { id: 2, service: "Photographe", provider: "Studio Lumière", date: "22 Mars 2024", time: "10:00", status: "Confirmé" },
    { id: 3, service: "Traiteur", provider: "Saveurs Marocaines", date: "05 Avril 2024", time: "18:00", status: "En attente" }
  ];

  const pastReservations = [
    { id: 1, service: "Coiffeur", provider: "Salon Zineb", date: "10 Février 2024", status: "Terminé" },
    { id: 2, service: "DJ", provider: "Sound Morocco", date: "15 Janvier 2024", status: "Terminé" }
  ];

  const menuItems = [
    { id: 'upcoming', label: 'À Venir', icon: <FaCalendarAlt /> },
    { id: 'history', label: 'Historique', icon: <FaHistory /> },
    { id: 'profile', label: 'Profil', icon: <FaUser /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <span className="success-icon">✓</span>
          <span className="success-message">{successMessage}</span>
        </div>
      )}
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">AAR<span className="green-text">SSI</span></h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map(item => {
              const isLastItem = item.id === 'profile';
              return (
                <React.Fragment key={item.id}>
                  <li>
                    <button
                      className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </button>
                  </li>
                  {isLastItem && (
                    <li>
                      <button 
                        className="nav-item logout-btn-inline"
                        onClick={() => {
                          localStorage.removeItem('userToken');
                          window.location.href = '/';
                        }}
                      >
                        <span className="nav-icon"><FaSignOutAlt /></span>
                        <span className="nav-label">Déconnexion</span>
                      </button>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* User Info Header */}
        <header className="user-header">
          <div className="user-avatar-container">
            <div className="avatar-wrapper">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar utilisateur" 
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  <span className="placeholder-initials-header">SL</span>
                </div>
              )}
              <label htmlFor="avatar-upload" className="avatar-overlay">
                <span className="camera-icon"><FaCamera /></span>
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
            </div>
          </div>
          <div className="user-info">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-city">{user.city}</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'upcoming' && (
            <div className="tab-content">
            {/* Filter Buttons */}
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tous
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'Confirmé' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('Confirmé')}
                >
                  Confirmé
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'En attente' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('En attente')}
                >
                  En attente
                </button>
              </div>
              
              <div className="reservations-grid">
                {upcomingReservations
                  .filter(reservation => filterStatus === 'all' || reservation.status === filterStatus)
                  .map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                    <div className="card-header">
                      <h3 className="service-name">{reservation.service}</h3>
                      <span className={`status-badge status-${reservation.status.toLowerCase().replace(' ', '-')}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="provider-name">{reservation.provider}</p>
                      <div className="reservation-details">
                        <span className="date"><FaCalendar className="detail-icon" /> {reservation.date}</span>
                        <span className="time"><FaRegClock className="detail-icon" /> {reservation.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-content">
  
              
              <div className="reservations-grid">
                {pastReservations.map(reservation => (
                  <div key={reservation.id} className="reservation-card">
                    <div className="card-header">
                      <h3 className="service-name">{reservation.service}</h3>
                      <div className="review-btn-container">
                        <button 
                          className="review-btn-small"
                          onClick={() => setShowReviewForm(reservation.id)}
                        >
                          Laissez un avis
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="provider-name">{reservation.provider}</p>
                      <div className="reservation-details">
                        <span className="date"><FaCalendar className="detail-icon" /> {reservation.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Review Form Modal - Outside the loop */}
              {showReviewForm && (
                <div className="review-modal">
                  <div className="review-form">
                    <h3 className="review-form-title">Laissez votre avis</h3>
                    <div className="form-group">
                      <label className="form-label">Nom du prestataire</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        defaultValue={pastReservations.find(r => r.id === showReviewForm)?.provider || ''}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Note</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            className={`star ${star <= rating ? 'selected' : ''}`}
                            onClick={() => setRating(star)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Commentaire</label>
                      <textarea 
                        className="form-textarea"
                        placeholder="Partagez votre expérience..."
                        rows="4"
                      ></textarea>
                    </div>
                    <div className="form-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => {
                          setShowReviewForm(null);
                          setRating(5);
                        }}
                      >
                        Annuler
                      </button>
                      <button 
                        className="submit-review-btn"
                        onClick={() => {
                          setShowReviewForm(null);
                          setRating(5);
                          setSuccessMessage('Votre avis est publié !');
                          setShowSuccess(true);
                          setTimeout(() => setShowSuccess(false), 3000);
                        }}
                      >
                        Publier
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              
              <div className="profile-form">
                <div className="form-section">
                  <h2 className="content-title">Mon Profil</h2>
                  <div className="photo-upload-section">
                    <div className="avatar-wrapper-large">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Photo de profil" 
                          className="profile-photo-large"
                        />
                      ) : (
                        <div className="profile-photo-placeholder">
                          <span className="placeholder-initials">SL</span>
                        </div>
                      )}
                      <label htmlFor="avatar-upload-profile" className="avatar-overlay-large">
                        <span className="camera-icon"><FaCamera /></span>
                      </label>
                      <input 
                        type="file" 
                        id="avatar-upload-profile" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{display: 'none'}}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom Complet</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      defaultValue={user.name}
                      onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Ville</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      defaultValue={user.city}
                      onChange={(e) => setUser(prev => ({...prev, city: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      defaultValue="samia@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      defaultValue="06 12 34 56 78"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fonction</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      defaultValue="Mariée"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Date du mariage</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      defaultValue="2024-06-15"
                    />
                  </div>
                </div>
                
                <button 
                  className="save-btn"
                  onClick={() => {
                    setSuccessMessage('Vos modifications sont enregistrées !');
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;