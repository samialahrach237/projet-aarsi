<<<<<<< HEAD
import React, { useState } from "react";
=======
import { useState } from "react";
>>>>>>> 18cd2ca8d8b197595f102e1a488b60b248518887
import { useNavigate } from "react-router-dom";
import providerService from "../services/providerService";
import "../Styles/Provider.css";

function Provider() {
<<<<<<< HEAD
  const [categories] = useState(getAllCategories());
  const [cities] = useState(getUniqueCities());
=======
>>>>>>> 18cd2ca8d8b197595f102e1a488b60b248518887
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
    phoneNumber: "",
    service: "",
    city: "",
    images: [],
    imagePreviews: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      alert("Vous pouvez ajouter un maximum de 3 images.");
      return;
    }

    const newImages = [...formData.images, ...files];
    const newPreviews = [...formData.imagePreviews, ...files.map(file => URL.createObjectURL(file))];

    setFormData(prev => ({
      ...prev,
      images: newImages,
      imagePreviews: newPreviews
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      imagePreviews: newPreviews
    }));
  };

  const nextStep = () => {
    if (formData.profileName && formData.email && formData.phoneNumber) {
      setStep(2);
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  };

  const prevStep = () => setStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.service || !formData.city) {
        alert("Veuillez sélectionner un service et une ville.");
        return;
    }
    setIsSubmitting(true);
    
    try {
      providerService.createProvider({
        name: formData.profileName,
        email: formData.email,
        service: formData.service,
        city: formData.city,
        phone: formData.phoneNumber,
        images: formData.imagePreviews
      });
      
      alert(`✅ Profil créé avec succès! Il est en attente d'approbation.`);
      navigate('/');
    } catch (error) {
      console.error("Error creating provider:", error);
      alert("❌ Erreur lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="provider-page">
      <div className="provider-header">
        <h1 className="provider-title">Espace Provider</h1>
        <p className="provider-subtitle">Rejoignez l'élite du mariage en quelques clics</p>
      </div>

<<<<<<< HEAD
      <div className="provider-form-container">
        <div className="multi-step-container">
          {/* Progress Bar */}
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1. Informations</div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2. Détails & Media</div>
          </div>

          <form className="provider-form-multi" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step-content animation-slide-in">
                <h2 className="form-step-title">Coordonnées</h2>
                
                <div className="form-group">
                  <label htmlFor="profileName">👤 Nom du Profil</label>
                  <input 
                    type="text" 
                    id="profileName"
                    name="profileName" 
                    value={formData.profileName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ex: Studio Photo Prestige" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">📧 Email Professionnel</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="contact@votreentreprise.com" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">📞 Téléphone</label>
                  <input 
                    type="tel" 
                    id="phoneNumber"
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                    placeholder="+212 6XX XXX XXX" 
                    className="form-input" 
                  />
                </div>

                <div className="form-navigation">
                  <button type="button" onClick={nextStep} className="btn-next">Suivant ➔</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step-content animation-slide-in">
                <h2 className="form-step-title">Détails du Service</h2>

                <div className="form-group">
                  <label htmlFor="service">💍 Type de Service</label>
                  <select 
                    id="service"
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange} 
                    required 
                    className="form-select"
                  >
                    <option value="">Sélectionnez un service</option>
                    {categories.filter(cat => cat.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">🏛️ Ville</label>
                  <select 
                    id="city"
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    className="form-select"
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>📸 Photos du Service</label>
                  <div className="images-grid">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-container">
                        <img src={preview} alt={`Preview ${index}`} className="image-preview-item" />
                        <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>×</button>
                      </div>
                    ))}
                    
                    {formData.imagePreviews.length < 3 && (
                      <div className="image-upload-wrapper">
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleImageChange} 
                          className="image-input" 
                          id="image-upload" 
                        />
                        <label htmlFor="image-upload" className="image-label">
                          <div className="upload-placeholder">
                            <span>📷 +</span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" onClick={prevStep} className="btn-prev">⬅ Retour</button>
                  <button type="submit" className="btn-submit-final" disabled={isSubmitting}>
                    {isSubmitting ? "⏳..." : "✔️ Créer Profil"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="info-card">
          <h3>🌟 Pourquoi rejoindre AARSSI?</h3>
          <ul>
            <li>✅ Accès à des milliers de clients potentiels</li>
            <li>✅ Gestion facile de vos services</li>
            <li>✅ Visibilité accrue pour votre business</li>
            <li>✅ Système d'avis et de notation</li>
          </ul>
=======
      <div className="multi-step-container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1. Informations</div>
          <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2. Détails & Media</div>
>>>>>>> 18cd2ca8d8b197595f102e1a488b60b248518887
        </div>
      </div>
    </div>
  );
}

export default Provider;
