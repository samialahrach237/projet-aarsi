import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Services.css";

const FALLBACK_IMAGE = "https://via.placeholder.com/300";

function PrestataireCard({
  id,
  nomEntreprise,
  adresse,
  description,
  primaryService,
  rating,
  reviews = 0,
  image = FALLBACK_IMAGE,
}) {
  const targetPath = primaryService?.id ? `/service/${primaryService.id}` : `/services`;
  const categoryLabel =
    typeof primaryService?.category === "object"
      ? primaryService?.category?.name || primaryService?.category?.title || primaryService?.category?.slug || "Prestataire"
      : primaryService?.category || "Prestataire";

  return (
    <Link to={targetPath} className="service-card-link">
      <article className="service-card prestataire-card">
        <div className="card-image">
          <img
            src={image || FALLBACK_IMAGE}
            alt={nomEntreprise}
            className="gallery-img"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <span className="category-tag">{categoryLabel}</span>
        </div>

        <div className="card-content">
          <h3 className="card-title">{nomEntreprise}</h3>
          <p className="card-location">📍 {adresse}</p>
          <p className="prestataire-description">
            {description || "Prestataire verifie pour vos evenements et mariages."}
          </p>

          <div className="prestataire-service-row">
            <span className="prestataire-service-name">
              {primaryService?.name || "Service sur demande"}
            </span>
            <span className="prestataire-service-count">
              {primaryService?.totalServices || 1} service
              {(primaryService?.totalServices || 1) > 1 ? "s" : ""}
            </span>
          </div>

          <div className="card-rating">
            <span className="stars">
              {"★".repeat(Math.max(1, Math.floor(Number(rating || 0))))}
            </span>
            <span className="rating-value">{Number(rating || 0).toFixed(1)}</span>
            <span className="rating-count">({reviews} Avis)</span>
          </div>

          <div className="card-footer">
            <div className="price-container">
              <span className="price-label">A partir de</span>
              <span className="price-tag">
                {Number(primaryService?.price || 0).toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="view-details-btn">Voir ↗</div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PrestataireCard;
