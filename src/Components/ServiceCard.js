import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Services.css';

function ServiceCard({ id, title, category, location, rating, price, image }) {
  return (
    <div className="service-card">
      <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
        <span className="category-tag">{category}</span>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-location">📍 {location}</p>
        
        <div className="card-rating">
          <span className="stars">{"⭐".repeat(Math.floor(rating))}</span>
          <span className="rating-text">{rating} (120+ Avis)</span>
        </div>

        <div className="card-footer">
          <span className="price-tag">Dès {price} MAD</span>
          <Link to={`/service/${id}`} className="view-details-btn">
            Voir Détails ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;