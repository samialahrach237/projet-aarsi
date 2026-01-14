import React from 'react';
import '../Styles/Services.css';

function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar-container">
      <div className="filter-group">
        <select 
          className="filter-select"
          value={filters.city}
          onChange={(e) => onFilterChange('city', e.target.value)}
        >
          <option value="">📍 Ville (City)</option>
          <option value="Casablanca">Casablanca</option>
          <option value="Marrakech">Marrakech</option>
          <option value="Rabat">Rabat</option>
          <option value="Tanger">Tanger</option>
          <option value="Fès">Fès</option>
        </select>
        
        <select 
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">💍 Type de Service</option>
          <option value="Negafa">Negafa</option>
          <option value="Traiteur">Traiteur</option>
          <option value="Photographe">Photographe</option>
          <option value="Salles">Salles</option>
          <option value="Musique">Musique</option>
          <option value="Coiffure">Coiffure</option>
        </select>

        <select 
          className="filter-select"
          value={filters.priceRange}
          onChange={(e) => onFilterChange('priceRange', e.target.value)}
        >
          <option value="">💰 Prix (Price Range)</option>
          <option value="low">€ - Économique (0 - 5000 MAD)</option>
          <option value="medium">€€ - Standard (5000 - 10000 MAD)</option>
          <option value="high">€€€ - Luxe (10000+ MAD)</option>
        </select>
        
        <select 
          className="filter-select"
          value={filters.rating}
          onChange={(e) => onFilterChange('rating', e.target.value)}
        >
          <option value="">⭐ Évaluation</option>
          <option value="5">5 Étoiles</option>
          <option value="4">4 Étoiles & plus</option>
        </select>
      </div>

      <div className="search-group">
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="search-input"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
        />
        <button className="search-btn">🔍</button>
      </div>
    </div>
  );
}

export default FilterBar;