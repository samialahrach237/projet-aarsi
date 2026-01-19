import { Link } from "react-router-dom";
import "../Styles/Accueil.css";
import ServiceCategories from "../Components/ServiceCategories";

function Accueil() {
  return (
    <div className="home-wrapper">
      {/* Organizer Section - Matching the reference image */}
      <section className="organizer-section">
        <div className="organizer-container">
          <div className="organizer-content">
            <h2 className="organizer-title">Tout pour organiser votre événement</h2>
            <p className="organizer-description">
              Aarsi réunit des prestataires fiables pour tous vos événements. 
              Parcourez des photos, infos et demandez un devis, le tout au même endroit.
            </p>
            <Link to="/services" className="organizer-btn">
              Lancez une recherche
            </Link>
            <p className="organizer-subtext">
              Êtes-vous un prestataire? <Link to="/contact">Rejoignez-nous ici!</Link>
            </p>
          </div>

          <div className="organizer-gallery">
            <div className="collage-grid">
              <div className="collage-item vertical">
                <img src="/images/salle2.jpg" alt="Salle de mariage" />
              </div>
              <div className="collage-item horizontal">
                <img src="/images/Traiteur3.jpg" alt="Traiteur marocain" />
              </div>
              <div className="collage-item large">
                <img src="/images/La Mariée Marocaine.jpg" alt="Mariée marocaine" />
              </div>
              <div className="collage-item small">
                <img src="/images/nagafa3.jpg" alt="Negafa et bijoux" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🕸️</span>
            <div className="stat-info">
              <h3 className="stat-number">2037</h3>
              <p className="stat-label">Services</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📂</span>
            <div className="stat-info">
              <h3 className="stat-number">32</h3>
              <p className="stat-label">Catégories</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <div className="stat-info">
              <h3 className="stat-number">25</h3>
              <p className="stat-label">Villes</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✨</span>
            <div className="stat-info">
              <h3 className="stat-number">10</h3>
              <p className="stat-label">Types d'événements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <ServiceCategories />
      
    </div>
  );
}

export default Accueil;