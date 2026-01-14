import { useState } from "react";
import "../Styles/Provider.css";

function Provider() {
  const [formData, setFormData] = useState({
    profileName: "",
    service: "",
    city: "",
    country: "Morocco",
    phoneNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Here you can add your submission logic
    alert(`Profil créé avec succès!
Nom: ${formData.profileName}
Service: ${formData.service}
Ville: ${formData.city}
Pays: ${formData.country}
Téléphone: ${formData.phoneNumber}`);
  };

  return (
    <div className="provider-page">
      <div className="provider-header">
        <h1 className="provider-title">Espace Provider</h1>
        <p className="provider-subtitle">
          Créez votre profil professionnel et commencez à offrir vos services
        </p>
      </div>

      <div className="provider-form-container">
        <form className="provider-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Créer votre profil</h2>

          <div className="form-group">
            <label htmlFor="profileName">👤 Nom du Profil</label>
            <input
              type="text"
              id="profileName"
              name="profileName"
              placeholder="Ex: Studio Photo Marrakech"
              className="form-input"
              value={formData.profileName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">💍 Type de Service</label>
            <select
              id="service"
              name="service"
              className="form-select"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un service</option>
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
            <label htmlFor="city">🏛️ Ville</label>
            <select
              id="city"
              name="city"
              className="form-select"
              value={formData.city}
              onChange={handleChange}
              required
            >
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
            <label htmlFor="country">🌍 Pays</label>
            <select
              id="country"
              name="country"
              className="form-select"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="Morocco">Maroc</option>
              <option value="Algeria">Algérie</option>
              <option value="Tunisia">Tunisie</option>
              <option value="France">France</option>
              <option value="Belgium">Belgique</option>
              <option value="Spain">Espagne</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">📞 Numéro de Téléphone</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Ex: +212 6XX XXX XXX"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[+]?[0-9\s-]+"
            />
          </div>

          <button type="submit" className="btn-submit">
            ✔️ Créer mon profil
          </button>
        </form>

        <div className="info-card">
          <h3>🌟 Pourquoi rejoindre AARSSI?</h3>
          <ul>
            <li>✅ Accès à des milliers de clients potentiels</li>
            <li>✅ Gestion facile de vos services</li>
            <li>✅ Visibilité accrue pour votre business</li>
            <li>✅ Système d'avis et de notation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Provider;