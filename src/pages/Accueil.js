import { Link } from "react-router-dom";
import "../Styles/Accueil.css";

function Accueil() {
  return (
    <div className="home-wrapper">
      {/* Organizer Section - Matching the reference image */}
      <section className="organizer-section">
        <div className="organizer-container">
          <div className="organizer-content">
            <h2 className="organizer-title">Ghir B'click un marriage magic  </h2>
            <p className="organizer-description">
               Découvrez une plateforme unique dédiée aux futurs mariés. 
               Accédez à une sélection exclusive de prestataires de confiance et organisez 
               chaque détail de votre cérémonie avec clarté et professionnalisme
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
              <div className="collage-item">
                <img src="/images/photographie7.jpg" alt="Photographe professionnel" />
              </div>
              <div className="collage-item">
                <img src="/images/Traiteur3.jpg" alt="Traiteur gastronomique" />
              </div>
              <div className="collage-item">
                <img src="/images/image6.jpg" alt="Salon de réception" />
              </div>
              <div className="collage-item">
                <img src="/images/image2.jpg" alt="Tyafer traditionnel" />
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

    </div>
  );
}

export default Accueil;