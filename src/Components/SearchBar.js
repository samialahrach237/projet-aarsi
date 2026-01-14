import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SearchBar.css";

function SearchBar() {
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query parameters based on input
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (service) params.append('service', service);
    
    // Navigate to services page with query parameters
    navigate(`/services?${params.toString()}`);
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="City or Location" 
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Service Type" 
        value={service}
        onChange={(e) => setService(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
}

export default SearchBar;
