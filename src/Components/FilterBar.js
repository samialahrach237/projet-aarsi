import React from 'react';
import '../Styles/Services.css';

function FilterBar() {
  return (
    <div className="filter-bar-container">
      <div className="filter-group">
        <select className="filter-select">
          <option>📍 Ville (City)</option>
          <option>Casablanca</option>
          <option>Marrakech</option>
          <option>Rabat</option>
          <option>Tanger</option>
        </select>
        
        <select className="filter-select">
          <option>💍 Type de Service</option>
          <option>Negafa</option>
          <option>Traiteur</option>
          <option>Photographe</option>
          <option>Salles</option>
        </select>

        <select className="filter-select">
          <option>💰 Prix (Price Range)</option>
          <option>€ - Économique</option>
          <option>€€ - Standard</option>
          <option>€€€ - Luxe</option>
        </select>
        
        <select className="filter-select">
          <option>⭐ Évaluation</option>
          <option>5 Étoiles</option>
          <option>4 Étoiles & plus</option>
        </select>
      </div>

      <div className="search-group">
        <input type="text" placeholder="Rechercher..." className="search-input" />
        <button className="search-btn">🔍</button>
      </div>
    </div>
  );
}

export default FilterBar;