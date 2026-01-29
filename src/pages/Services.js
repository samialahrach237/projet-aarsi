import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaGlobe, FaHome, FaUtensils, FaCrown, FaCamera, FaMusic, FaGem, FaGift } from 'react-icons/fa';
import SearchBar from '../Components/SearchBar';
import ServiceCard from '../Components/ServiceCard';
import { getAllServices, getAllCategories, getUniqueCities } from '../data/serviceRepo';
import '../Styles/Services.css';

function Services() {
  const location = useLocation();
  const [services] = useState(getAllServices());
  const [categories] = useState(getAllCategories());
  const [cities] = useState(getUniqueCities());
  const [showRightArrow, setShowRightArrow] = useState(true);
  const categoryContainerRef = useRef(null);

  // Check scroll position for arrow visibility
  const checkScrollPosition = () => {
    const container = categoryContainerRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;
    setShowRightArrow(!isAtEnd);
  };

  // Handle scroll events
  useEffect(() => {
    const container = categoryContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);
  
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    priceRange: '',
    rating: '',
    searchQuery: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get('city');
    const serviceParam = params.get('service');
    
    if (cityParam || serviceParam) {
      setFilters(prev => ({
        ...prev,
        city: cityParam || '',
        category: serviceParam || ''
      }));
    }
  }, [location.search]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 'all':
        return <FaGlobe className="category-icon" />;
      case 'Salle':
        return <FaHome className="category-icon" />;
      case 'Traiteur':
        return <FaUtensils className="category-icon" />;
      case 'Negafa':
        return <FaCrown className="category-icon" />;
      case 'Photographe':
        return <FaCamera className="category-icon" />;
      case 'DJ':
        return <FaMusic className="category-icon" />;
      case 'Bijoux':
        return <FaGem className="category-icon" />;
      case 'Tyafer':
        return <FaGift className="category-icon" />;
      default:
        return <FaGlobe className="category-icon" />;
    }
  };

  const filteredServices = services.filter(service => {
    // ID-based City Filter
    if (filters.city) {
      if (service.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }
    
    // ID-based Category Filter
    if (filters.category && filters.category !== 'all') {
      if (service.categoryId !== filters.category) {
        return false;
      }
    }

    if (filters.priceRange) {
      if (filters.priceRange === 'low' && service.price > 5000) return false;
      if (filters.priceRange === 'medium' && (service.price <= 5000 || service.price > 10000)) return false;
      if (filters.priceRange === 'high' && service.price <= 10000) return false;
    }

    if (filters.rating) {
      if (filters.rating === '5' && service.rating < 5) return false;
      if (filters.rating === '4' && service.rating < 4) return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(query) ||
        service.categoryId.toLowerCase().includes(query) ||
        service.city.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="services-page">
      <div className="services-header-premium">
        <h1 className="page-title-premium">Trouvez vos prestataires</h1>
        
        <div className="search-bar-container-premium">
          <SearchBar 
            cityValue={filters.city}
            categoryValue={filters.category}
            onCityChange={(val) => handleFilterChange('city', val)}
            onCategoryChange={(val) => handleFilterChange('category', val)}
            cities={cities}
            categories={categories}
            dynamicMode={true}
          />
        </div>

        <div className="category-bar-premium">
          <div className="category-scroll-wrapper">
            <div 
              className="category-scroll-container" 
              ref={categoryContainerRef}
              onScroll={checkScrollPosition}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn-premium ${filters.category === (cat.id === 'all' ? '' : cat.id) ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', cat.id === 'all' ? '' : cat.id)}
                >
                  <span className="category-icon-premium">{getCategoryIcon(cat.id)}</span>
                  <span className="category-text-premium">{cat.title}</span>
                  {filters.category === (cat.id === 'all' ? '' : cat.id) && <div className="active-indicator"></div>}
                </button>
              ))}
            </div>
            {showRightArrow && (
              <div className="scroll-right-indicator">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#9c7c3a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="services-grid-container">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard 
              key={service.id}
              id={service.id}
              title={service.name}
              category={service.categoryId}
              location={service.city}
              rating={service.rating}
              price={service.price}
              image={service.image}
            />
          ))
        ) : (
          <div className="no-results-premium">
            <div className="no-results-icon">🕊️</div>
            <h3>Aucun service trouvé</h3>
            <p>Nous n'avons pas trouvé de prestataires correspondant à votre recherche.</p>
            <button 
              className="reset-btn-premium"
              onClick={() => setFilters({
                city: '',
                category: '',
                priceRange: '',
                rating: '',
                searchQuery: ''
              })}
            >
              Voir tous les services
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Services;
