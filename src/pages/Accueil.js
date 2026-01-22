import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../Components/ServiceCard";
import { getAllServices } from "../data/serviceRepo";
import "../Styles/Accueil.css";

function Accueil() {
  return (
    <div className="home-wrapper">
      {/* Organizer Section - Matching the reference image */}
      <section className="organizer-section">
        <div className="organizer-container">
          <div className="organizer-content">
            <h2 className="organizer-title">Rir B'click un mariage magic  </h2>
            <p className="organizer-description">
               Découvrez une plateforme unique dédiée aux futurs mariés. 
               Accédez à une sélection exclusive de prestataires de confiance et organisez 
               chaque détail de votre cérémonie avec clarté et professionnalisme
            </p>
            <Link to="/services" className="organizer-btn">
              Lancez une recherche
            </Link>
            <p className="organizer-subtext">
              Êtes-vous un prestataire? <Link to="/connexion">Rejoignez-nous ici!</Link>
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
            <span className="stat-icon" style={{color: '#9c7c3a'}}><i className="fas fa-layer-group"></i></span>
            <div className="stat-info">
              <h3 className="stat-number">2037</h3>
              <p className="stat-label">Services</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{color: '#9c7c3a'}}><i className="fas fa-list"></i></span>
            <div className="stat-info">
              <h3 className="stat-number">32</h3>
              <p className="stat-label">Catégories</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{color: '#9c7c3a'}}><i className="fas fa-map-marker-alt"></i></span>
            <div className="stat-info">
              <h3 className="stat-number">25</h3>
              <p className="stat-label">Villes</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{color: '#9c7c3a'}}><i className="fas fa-star"></i></span>
            <div className="stat-info">
              <h3 className="stat-number">10</h3>
              <p className="stat-label">Types d'événements</p>
            </div>
          </div>
        </div>
      </section>

    {/* Auto-Scrolling Horizontal Card Section */}
    <section className="autoscroll-services-section">
      <div className="container">
        <h2 className="section-title">Nos Prestataires Populaires</h2>
        <div className="autoscroll-container">
          <div className="autoscroll-content">
            {[...Array(2)].map((_, index) => (
              <React.Fragment key={index}>
                {getAllServices().map((service) => (
                  <div key={`${service.id}-${index}`} className="autoscroll-item">
                    <ServiceCard 
                      id={service.id}
                      title={service.name}
                      category={service.categoryId}
                      location={service.city}
                      rating={service.rating}
                      price={service.price}
                      image={service.image}
                      reviews={service.reviews}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>

</div>
  );
}

export default Accueil;