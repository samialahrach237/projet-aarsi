import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../Components/FilterBar';
import ServiceCard from '../Components/ServiceCard';
import '../Styles/Services.css';

// بيانات تجريبية (يجب استبدالها لاحقاً ببيانات حقيقية أو صور من Assets)
const servicesData = [
  { id: 1, title: "Zaineb Negafa Exclusive", category: "Negafa", location: "Marrakech", rating: 4.9, price: 5000, image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800" },
  { id: 2, title: "Palais des Roses", category: "Salles", location: "Casablanca", rating: 4.8, price: 15000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800" },
  { id: 3, title: "Traiteur Royal", category: "Traiteur", location: "Rabat", rating: 4.7, price: 3500, image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800" },
  { id: 4, title: "Simo Photography", category: "Photographe", location: "Tanger", rating: 4.9, price: 2000, image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800" },
  { id: 5, title: "Orchestre Andalou", category: "Musique", location: "Fès", rating: 4.6, price: 8000, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800" },
  { id: 6, title: "Makeup by Sara", category: "Coiffure", location: "Casablanca", rating: 4.8, price: 1500, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800" },
  { id: 7, title: "La Belle Negafa", category: "Negafa", location: "Casablanca", rating: 4.7, price: 4500, image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800" },
  { id: 8, title: "Salon Majestic", category: "Salles", location: "Marrakech", rating: 4.9, price: 20000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800" },
];

function Services() {
  const location = useLocation();
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    priceRange: '',
    rating: '',
    searchQuery: ''
  });

  // Read URL parameters and set initial filters
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

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Filter services based on all criteria
  const filteredServices = servicesData.filter(service => {
    // City filter (support partial matching)
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      const locationLower = service.location.toLowerCase();
      if (!locationLower.includes(cityLower)) {
        return false;
      }
    }

    // Category filter (support partial matching)
    if (filters.category) {
      const categoryLower = filters.category.toLowerCase();
      const serviceCategoryLower = service.category.toLowerCase();
      if (!serviceCategoryLower.includes(categoryLower)) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === 'low' && service.price > 5000) return false;
      if (filters.priceRange === 'medium' && (service.price <= 5000 || service.price > 10000)) return false;
      if (filters.priceRange === 'high' && service.price <= 10000) return false;
    }

    // Rating filter
    if (filters.rating) {
      if (filters.rating === '5' && service.rating < 5) return false;
      if (filters.rating === '4' && service.rating < 4) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        service.title.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="services-page">
      {/* Header Section */}
      <div className="services-header">
        <h1 className="page-title">Catalogue des Services</h1>
        <p className="page-subtitle">Découvrez les meilleurs prestataires pour votre mariage</p>
      </div>

      {/* Filter Bar */}
      <section className="filter-section">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </section>

      {/* Services Grid */}
      <section className="services-grid-container">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))
        ) : (
          <div className="no-results">
            <p>Aucun service trouvé. Essayez de modifier vos filtres.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Services;