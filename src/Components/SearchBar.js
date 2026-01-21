import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
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
    <div className="premium-search-wrapper">
      <form className="search-bar-container" onSubmit={(e) => e.preventDefault()}>
        <div className="search-inputs-wrapper">
          <div className="search-dropdown-wrapper">
            <select 
              className="search-select"
              value={categoryValue}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">Catégorie de service</option>
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

          <div className="search-spacing"></div>

          <div className="search-dropdown-wrapper">
            <select 
              className="search-select"
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
            >
              <option value="">Ville</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="search-submit-button">
            <FiSearch className="search-icon" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
