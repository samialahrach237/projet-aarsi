import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaGlobe, FaHome, FaUtensils, FaCrown, FaCamera, FaMusic, FaGem, FaGift, FaSpa, FaPalette } from 'react-icons/fa';
import SearchBar from '../Components/SearchBar';
import PrestataireCard from '../Components/PrestataireCard';
import { fetchPrestataires } from '../services/api';
import '../Styles/Services.css';

const categoryIconMap = {
  Salle: FaHome,
  Traiteur: FaUtensils,
  Negafa: FaCrown,
  Photographe: FaCamera,
  DJ: FaMusic,
  Bijoux: FaGem,
  Tyafer: FaGift,
  Henna: FaSpa,
  Maquillage: FaPalette,
};

const placeholderImage = "https://via.placeholder.com/300";

function Services() {
  const location = useLocation();
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRightArrow, setShowRightArrow] = useState(true);
  const categoryContainerRef = useRef(null);

  // Check scroll position for arrow visibility
  const checkScrollPosition = useCallback(() => {
    const container = categoryContainerRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;
    setShowRightArrow(!isAtEnd);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = categoryContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    const loadPrestataires = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchPrestataires();
        setPrestataires(Array.isArray(response) ? response : []);
      } catch (err) {
        const message =
          err?.response?.data?.message || "Erreur lors du chargement des prestataires.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPrestataires();
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
      default: {
        const IconComponent = categoryIconMap[categoryId] || FaGlobe;
        return <IconComponent className="category-icon" />;
      }
    }
  };

  const marketplaceCategories = [
    { id: 'all', title: 'Tous' },
    ...Array.from(
      new Set(
        prestataires.flatMap((prestataire) =>
          (prestataire.services || []).map((service) => service.category).filter(Boolean)
        )
      )
    )
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        id: category,
        title: category,
      })),
  ];

  const cities = Array.from(
    new Set(prestataires.map((prestataire) => prestataire.adresse).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const normalizedPrestataires = prestataires.map((prestataire, index) => {
    const services = Array.isArray(prestataire.services) ? prestataire.services : [];
    const primaryService = services[0] || null;
    const rating = 4.1 + ((index % 8) * 0.1);

    return {
      ...prestataire,
      primaryService: primaryService
        ? { ...primaryService, totalServices: services.length }
        : null,
      rating: Number(rating.toFixed(1)),
      image: prestataire.image || placeholderImage,
    };
  });

  const filteredPrestataires = normalizedPrestataires.filter((prestataire) => {
    const address = prestataire?.adresse || '';
    const services = prestataire?.services || [];
    const categories = services.map((service) => service.category || '');
    const firstServiceName = prestataire?.primaryService?.name || '';

    if (filters.city && !address.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    if (filters.category && filters.category !== 'all' && !categories.includes(filters.category)) {
      return false;
    }

    if (filters.priceRange) {
      const startingPrice = Number(prestataire?.primaryService?.price || 0);

      if (filters.priceRange === 'low' && startingPrice > 500) return false;
      if (filters.priceRange === 'medium' && (startingPrice <= 500 || startingPrice > 3000)) return false;
      if (filters.priceRange === 'high' && startingPrice <= 3000) return false;
    }

    if (filters.rating) {
      if (filters.rating === '5' && prestataire.rating < 5) return false;
      if (filters.rating === '4' && prestataire.rating < 4) return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        prestataire.nomEntreprise.toLowerCase().includes(query) ||
        address.toLowerCase().includes(query) ||
        firstServiceName.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const emptyMessage = error || "Aucun prestataire trouve.";

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
            categories={marketplaceCategories}
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
              {marketplaceCategories.map((cat) => (
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
        {loading ? (
          <div className="no-results-premium">
            <h3>Chargement des prestataires...</h3>
          </div>
        ) : error ? (
          <div className="no-results-premium">
            <h3>{emptyMessage}</h3>
          </div>
        ) : filteredPrestataires.length > 0 ? (
          filteredPrestataires.map((prestataire) => (
            <PrestataireCard
              key={prestataire.id}
              id={prestataire.id}
              nomEntreprise={prestataire.nomEntreprise}
              adresse={prestataire.adresse}
              description={prestataire.description}
              primaryService={prestataire.primaryService}
              rating={prestataire.rating}
              image={prestataire.image}
            />
          ))
        ) : (
          <div className="no-results-premium">
            <div className="no-results-icon">🕊️</div>
            <h3>Aucun prestataire trouvé</h3>
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
              Voir tous les prestataires
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Services;
