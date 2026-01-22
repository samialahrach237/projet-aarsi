import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SearchBar.css";

function SearchBar({ 
  cityValue, 
  categoryValue, 
  onCityChange, 
  onCategoryChange,
  cities = [],
  categories = [],
  dynamicMode = false
}) {
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to services page with city filter only
    if (cityValue) {
      navigate(`/services?city=${encodeURIComponent(cityValue)}`);
    } else {
      navigate('/services');
    }
  };
  
  return (
    <div className="modern-search-wrapper">
      <form className="modern-search-bar" onSubmit={handleSearch}>
        <div className="search-fields-container">
          <div className="search-field-group">
            <div className="field-icon">📋</div>
            <select 
              className="modern-search-select"
              value={categoryValue}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">Type de service</option>
              {categories.map(cat => {
                const id = typeof cat === 'object' ? cat.id : cat;
                const title = typeof cat === 'object' ? cat.title : cat;
                if (id === 'all') return null;
                return (
                  <option key={id} value={id}>{title}</option>
                );
              })}
            </select>
          </div>

          <div className="search-field-separator">|</div>

          <div className="search-field-group">
            <div className="field-icon">📍</div>
            <select 
              className="modern-search-select"
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
            >
              <option value="">Ville ou région</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="search-submit-button">
          <span className="search-icon">🔍</span>
          <span className="search-text">Rechercher</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;