import { useState } from "react";
import { useNavigate } from "react-router-dom";
import providerService from "../services/providerService";
import "../Styles/Provider.css";

function Provider() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
    phoneNumber: "",
    service: "",
    city: "",
    images: [], // Array for multiple images
    imagePreviews: [] // Array for multiple previews
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
    if (step === 1 && formData.profileName && formData.email && formData.phoneNumber) {
      setStep(2);
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  };

  const prevStep = () => setStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create provider with pending status
      providerService.createProvider({
        name: formData.profileName,
        email: formData.email,
        service: formData.service,
        city: formData.city,
        phone: formData.phoneNumber,
        images: formData.imagePreviews // Send all image previews
      });
      
      alert(`\u2705 Profil cr\u00e9\u00e9 avec succ\u00e8s! Il est en attente d'approbation.`);
      navigate('/');
    } catch (error) {
      console.error("Error creating provider:", error);
      alert("❌ Erreur lors de la cr\u00e9ation.");
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
                <label>👤 Nom du Profil</label>
                <input 
                  type="text" 
                  name="profileName" 
                  value={formData.profileName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ex: Studio Photo Prestige" 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label>📧 Email Professionnel</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="contact@votreentreprise.com" 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label>📞 Téléphone</label>
                <input 
                  type="tel" 
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
                <label>💍 Type de Service</label>
                <select name="service" value={formData.service} onChange={handleChange} required className="form-select">
                  <option value="">Sélectionnez</option>
                  <option value="Negafa">Negafa</option>
                  <option value="Traiteur">Traiteur</option>
                  <option value="Photographe">Photographe</option>
                  <option value="Salles">Salles de réception</option>
                  <option value="Musique">Musique & Orchestre</option>
                  <option value="Coiffure">Coiffure & Maquillage</option>
                  <option value="Decoration">Décoration</option>
                  <option value="Patisserie">Pâtisserie</option>
                </select>
              </div>

              <div className="form-group">
                <label>🏛️ Ville</label>
                <select name="city" value={formData.city} onChange={handleChange} required className="form-select">
                  <option value="">Sélectionnez une ville</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Fès">Fès</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Meknès">Meknès</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Kenitra">Kenitra</option>
                  <option value="Tétouan">Tétouan</option>
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
    </div>
  );
}

export default Provider;