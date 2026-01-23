import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdDashboard, MdPhotoLibrary, MdLayers, MdCalendarMonth, 
  MdAssignment, MdPayments, MdAccountCircle, MdCloudUpload, MdStar, MdDelete, MdSave
} from "react-icons/md";
import "../Styles/ProviderDashboard.css";

function ProviderDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Photos");
  const [images, setImages] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1594463750939-ebb6bca669b6?auto=format&fit=crop&q=80&w=400", isPrimary: true },
    { id: 2, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400", isPrimary: false },
    { id: 3, url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400", isPrimary: false },
    { id: 4, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400", isPrimary: false },
  ]);

  const [profileData, setProfileData] = useState({
    name: "Studio Photo Marrakech",
    email: "contact@studiophoto.ma",
    phone: "+212 600 000 000",
    city: "Marrakech",
    service: "Photographe",
    description: "Spécialiste de la photographie de mariage avec plus de 10 ans d'expérience.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Authentication check (simulated)
  useEffect(() => {
    // In a real app, we would check if a provider is logged in
    // const isAuthenticated = sessionStorage.getItem("isProviderAuthenticated");
    // if (!isAuthenticated) navigate("/connexion");
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isProviderAuthenticated");
    navigate("/connexion");
  };

  const setPrimary = (id) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const deleteImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Photos":
        return (
          <div className="dashboard-view-content animate-fade-in">
            <div className="upload-section" onClick={triggerFileInput}>
              <div className="upload-box">
                <div className="upload-circle">
                    <MdCloudUpload className="upload-icon" />
                </div>
                <p>Drag & Drop Photos Here or Click to Upload</p>
                <input 
                  type="file" 
                  multiple 
                  className="file-input" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="gallery-header">
              <p>Primary image will be featured first on your public profile carousel. Changes are immediately reflected via API.</p>
            </div>

            <div className="photos-grid">
              {images.map((img) => (
                <div key={img.id} className={`photo-card ${img.isPrimary ? "primary" : ""}`}>
                  <img src={img.url} alt="Service" />
                  <div className="photo-actions">
                    <button 
                      className={`action-btn star ${img.isPrimary ? "active" : ""}`}
                      onClick={() => setPrimary(img.id)}
                      title="Set as Primary"
                    >
                      <MdStar />
                    </button>
                    {!img.isPrimary && (
                      <button 
                        className="action-btn delete" 
                        onClick={() => deleteImage(img.id)}
                        title="Delete Image"
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                  {img.isPrimary && <div className="primary-label">Primary Image</div>}
                </div>
              ))}
            </div>
          </div>
        );
      case "Profile":
        return (
          <div className="dashboard-view-content animate-fade-in">
            <div className="profile-edit-container card-box">
              <div className="card-header">
                <h2>Modifier le Profil</h2>
                <p>Gérez les informations publiques de votre service</p>
              </div>
              <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
                <div className="profile-image-upload-section">
                  <div className="profile-image-wrapper">
                    <img src={profileData.profileImage} alt="Profile" className="profile-edit-avatar" />
                    <label htmlFor="profile-upload" className="profile-upload-btn">
                      <MdCloudUpload />
                      <input 
                        type="file" 
                        id="profile-upload" 
                        hidden 
                        accept="image/*" 
                        onChange={handleProfileImageUpload}
                      />
                    </label>
                  </div>
                  <div className="profile-image-text">
                    <h3>Photo de profil</h3>
                    <p>Cette image sera visible par vos clients.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nom du Profil</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Email Professionnel</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    <select name="city" value={profileData.city} onChange={handleProfileChange}>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Fès">Fès</option>
                      <option value="Tanger">Tanger</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea name="description" rows="4" value={profileData.description} onChange={handleProfileChange}></textarea>
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className={`btn-save-profile ${isSaving ? 'saving' : ''} ${saveSuccess ? 'success' : ''}`}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="btn-spinner"></span>
                    ) : saveSuccess ? (
                      <>✔️ Enregistré</>
                    ) : (
                      <><MdSave /> Enregistrer les modifications</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="dashboard-placeholder animate-fade-in">
            <div className="placeholder-content">
                <h2>{activeTab} View</h2>
                <p>This section is currently being implemented. Check back soon for more features!</p>
                <div className="maintenance-icon">🛠️</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="provider-dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo-container">
          <h1 className="logo-text">AARSSI<span>*</span></h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "Overview" ? "active" : ""}`}
            onClick={() => setActiveTab("Overview")}
          >
            <MdDashboard /> Overview
          </button>
          <button 
            className={`nav-item ${activeTab === "Photos" ? "active" : ""}`}
            onClick={() => setActiveTab("Photos")}
          >
            <MdPhotoLibrary /> Photos
          </button>
          <button 
            className={`nav-item ${activeTab === "Packages" ? "active" : ""}`}
            onClick={() => setActiveTab("Packages")}
          >
            <MdLayers /> Packages
          </button>
          <button 
            className={`nav-item ${activeTab === "Calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("Calendar")}
          >
            <MdCalendarMonth /> Calendar
          </button>
          <button 
            className={`nav-item ${activeTab === "Bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("Bookings")}
          >
            <MdAssignment /> Bookings
          </button>
          <button 
            className={`nav-item ${activeTab === "Earnings" ? "active" : ""}`}
            onClick={() => setActiveTab("Earnings")}
          >
            <MdPayments /> Earnings
          </button>
          <button 
            className={`nav-item ${activeTab === "Profile" ? "active" : ""}`}
            onClick={() => setActiveTab("Profile")}
          >
            <MdAccountCircle /> Profile
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-right">
            <div className="user-profile-summary">
              <span className="user-name">{profileData.name}</span>
              <img src={profileData.profileImage} alt="Avatar" className="user-avatar" />
            </div>
            <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
          </div>
        </header>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default ProviderDashboard;
