import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Services.css";

function PrestataireCard({
  nomEntreprise,
  adresse,
  categorie,
  primaryService,
  rating,
  reviews = 0,
  image,
}) {
  const targetPath = primaryService?.id ? `/service/${primaryService.id}` : "/services";
  const ratingValue = Number(rating || 0);
  const filledStars = Math.max(1, Math.min(5, Math.round(ratingValue)));

  return (
    <Link to={targetPath} className="service-card-link">
      <article className="service-card prestataire-card">
        <div className="card-image">
          {image ? (
            <img src={image} alt={nomEntreprise} className="gallery-img" loading="lazy" />
          ) : (
            <div className="gallery-img gallery-img-empty" aria-hidden="true" />
          )}
          <span className="category-tag">
            {categorie || primaryService?.category || "Service"}
          </span>
        </div>

        <div className="card-content">
          <h3 className="card-title">{nomEntreprise}</h3>
          <p className="card-location">📍 {adresse}</p>

          <div className="card-rating">
            <span className="stars">{"★".repeat(filledStars)}</span>
            <span className="rating-value">{ratingValue.toFixed(1)}</span>
            <span className="rating-count">({reviews}+ Avis)</span>
          </div>

          <div className="card-footer">
            <div className="price-container">
              <span className="price-label">A partir de</span>
              <span className="price-tag">
                {Number(primaryService?.price || 0).toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="view-details-btn">Voir</div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PrestataireCard;
