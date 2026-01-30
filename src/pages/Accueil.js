import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../Components/ServiceCard";
import { getAllServices } from "../data/serviceRepo";
import "../Styles/Accueil.css";

function Accueil() {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const isPaused = useRef(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Check if we're on mobile screen
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // For mobile - manual scroll with arrows
      const updateArrowsVisibility = () => {
        if (container) {
          const { scrollLeft, scrollWidth, clientWidth } = container;
          setShowLeftArrow(scrollLeft > 5);
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
      };
      
      // Initial check
      updateArrowsVisibility();
      
      // Add scroll listener
      container.addEventListener('scroll', updateArrowsVisibility);
      
      // Clean up
      return () => {
        container.removeEventListener('scroll', updateArrowsVisibility);
      };
    } else {
      // For desktop - auto-scroll logic
      const startAutoScroll = () => {
        if (isPaused.current) return;
        
        const scrollAmount = container.offsetWidth;
        const maxScroll = container.scrollWidth - container.offsetWidth;
        
        if (container.scrollLeft >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };

      // Start auto-scroll
      intervalRef.current = setInterval(startAutoScroll, 4000); // Normal speed for smooth scrolling

      // Pause on touch/mouse
      const pauseOnInteraction = () => {
        isPaused.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      // Resume after delay
      const resumeAfterDelay = () => {
        setTimeout(() => {
          isPaused.current = false;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = setInterval(startAutoScroll, 4000); // Normal speed for smooth scrolling
        }, 5000);
      };

      container.addEventListener('touchstart', pauseOnInteraction);
      container.addEventListener('mousedown', pauseOnInteraction);
      container.addEventListener('touchend', resumeAfterDelay);
      container.addEventListener('mouseup', resumeAfterDelay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        container.removeEventListener('touchstart', pauseOnInteraction);
        container.removeEventListener('mousedown', pauseOnInteraction);
        container.removeEventListener('touchend', resumeAfterDelay);
        container.removeEventListener('mouseup', resumeAfterDelay);
      };
    }
  }, []);

  // Scroll functions for mobile - scroll by card width
  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = document.querySelector('.autoscroll-item')?.offsetWidth || containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = document.querySelector('.autoscroll-item')?.offsetWidth || containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-wrapper">
      {/* Organizer Section - Matching the reference image */}
      <section className="organizer-section">
        <div className="organizer-container">
          <div className="organizer-content">
            <h2 className="organizer-title">Ghir B'click un mariage magic  </h2>
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
        <div className="autoscroll-container-wrapper">
          <div className={`scroll-arrow left ${showLeftArrow ? 'visible' : 'hidden'}`} onClick={scrollLeft}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="autoscroll-container" ref={containerRef}>
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
          <div className={`scroll-arrow right ${showRightArrow ? 'visible' : 'hidden'}`} onClick={scrollRight}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

</div>
  );
}

export default Accueil;