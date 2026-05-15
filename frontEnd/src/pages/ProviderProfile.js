import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchServiceById } from "../services/api";
import "../Styles/ProviderProfile.css";

const getCategoryLabel = (category) => {
  if (typeof category === "object") {
    return category?.name || category?.title || category?.slug || "Service";
  }

  return category || "Service";
};

const getLocationLabel = (service) =>
  service?.provider?.city || service?.provider?.address || "Maroc";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
      setLoading(true);

      try {
        const serviceData = await fetchServiceById(id);

        if (!serviceData) {
          navigate("/services");
          return;
        }

        if (isMounted) {
          setService(serviceData);
          setSelectedImage(serviceData?.gallery?.[0] || serviceData?.image || "");
        }
      } catch (error) {
        navigate("/services");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleReservation = () => {
    navigate(`/reservation/${id}`);
  };

  const galleryImages = useMemo(() => {
    if (!service) {
      return [];
    }

    return Array.from(new Set([...(service.gallery || []), service.image].filter(Boolean)));
  }, [service]);

  const locationLabel = getLocationLabel(service);
  const categoryLabel = getCategoryLabel(service?.category);
  const reviews = Array.isArray(service?.reviews) ? service.reviews : [];
  const unavailableDates = service?.availability?.unavailable_dates || [];
  const ratingValue = Number(service?.rating || 0).toFixed(1);
  const ratingStars = "★".repeat(Math.max(1, Math.round(Number(service?.rating || 0))));
  const reviewCount = Number(service?.reviews_count || reviews.length || 0);
  const heroImage =
    selectedImage ||
    galleryImages[0] ||
    "https://images.unsplash.com/flagged/photo-1576485436509-a7d286952b65?q=80&w=1600&auto=format&fit=crop";

  if (loading || !service) {
    return (
      <div className="profile-page">
        <div className="profile-loading-state">
          <div className="profile-loading-spinner" />
          <p>Chargement du service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div
          className="profile-hero-media"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(22, 17, 10, 0.22) 0%, rgba(22, 17, 10, 0.68) 100%), url(${heroImage})`,
          }}
        />
      </section>

      <div className="profile-shell">
        <section className="profile-info-card">
          <div className="profile-info-main">
            <h1 className="profile-service-title">{service.name}</h1>
            <p className="profile-service-location">📍 {locationLabel}</p>
           
            <button className="profile-reserve-btn" onClick={handleReservation}>
              RÉSERVER MAINTENANT
            </button>
          </div>

          <div className="profile-info-stats">
            <div className="profile-stat-box">
              <span className="profile-stat-stars">{ratingStars}</span>
              <strong>{ratingValue}</strong>
              <span>{reviewCount} Avis</span>
            </div>

            <div className="profile-stat-divider" />

            <div className="profile-stat-box profile-price-box">
              <strong>{Number(service.price || 0).toLocaleString("fr-FR")} MAD</strong>
              <span>À PARTIR DE</span>
            </div>
          </div>
        </section>

        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            DÉTAILS
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            GALERIE
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "location" ? "active" : ""}`}
            onClick={() => setActiveTab("location")}
          >
            LOCALISATION
          </button>
        </div>

        {activeTab === "details" ? (
          <section className="profile-content-stack">
            <div className="profile-panel profile-about-card">
              <h2>À propos de ce service</h2>
              <p>
                {service.description ||
                  "Découvrez une prestation pensée pour sublimer votre événement avec élégance, raffinement et une exécution soignée jusque dans les moindres détails."}
              </p>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span>TYPE DE SERVICE</span>
                <strong>{categoryLabel}</strong>
              </div>
              <div className="profile-info-item">
                <span>VILLE</span>
                <strong>{locationLabel}</strong>
              </div>
              <div className="profile-info-item">
                <span>DISPONIBILITÉ</span>
                <strong>{unavailableDates.length ? "Sur rendez-vous uniquement" : "Flexible"}</strong>
              </div>
              <div className="profile-info-item">
                <span>PRIX DE BASE</span>
                <strong>{Number(service.price || 0).toLocaleString("fr-FR")} MAD</strong>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "gallery" ? (
          <section className="profile-content-stack">
            <div className="profile-panel profile-gallery-card">
              <div className="profile-gallery-featured">
                {heroImage ? (
                  <img src={heroImage} alt={service.name} className="profile-gallery-main-image" />
                ) : (
                  <div className="profile-gallery-empty" aria-hidden="true" />
                )}
              </div>

              <div className="profile-gallery-thumbs">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`profile-gallery-thumb ${selectedImage === image ? "active" : ""}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${service.name} ${index + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "location" ? (
          <section className="profile-content-stack">
            <div className="profile-panel profile-location-card">
              <h2>Localisation</h2>
              <p className="profile-location-text">{service?.provider?.address || locationLabel}</p>

              <div className="profile-location-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846363523414!2d-7.632562!3d33.57311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2927d0357b5%3A0x3ea250ecf488774a!2sCasablanca!5e0!3m2!1sen!2sma!4v1642250000000!5m2!1sen!2sma"
                  title="Localisation du service"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default ProviderProfile;
