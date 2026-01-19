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
  return (
    <form className="wedding-search-bar" onSubmit={(e) => e.preventDefault()}>
      <div className="search-group">
        <select 
          className="search-select"
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Catégorie de service</option>
          {categories.map(cat => {
            // Handle both simple string array and object array
            const id = typeof cat === 'object' ? cat.id : cat;
            const title = typeof cat === 'object' ? cat.title : cat;
            if (id === 'all') return null;
            return (
              <option key={id} value={id}>{title}</option>
            );
          })}
        </select>
      </div>

      <div className="search-divider"></div>

      <div className="search-group">
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

      <button type="submit" className="search-submit-circle">
        <span className="search-icon-glass">🔍</span>
      </button>
    </form>
  );
}

export default SearchBar;
