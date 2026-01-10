import React from 'react';
import FilterBar from '../Components/FilterBar';
import ServiceCard from '../Components/ServiceCard';
import '../Styles/Services.css';

// بيانات تجريبية (يجب استبدالها لاحقاً ببيانات حقيقية أو صور من Assets)
const servicesData = [
  { id: 1, title: "Zaineb Negafa Exclusive", category: "Negafa", location: "Marrakech", rating: 4.9, price: "5000", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800" },
  { id: 2, title: "Palais des Roses", category: "Salles", location: "Casablanca", rating: 4.8, price: "15000", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800" },
  { id: 3, title: "Traiteur Royal", category: "Traiteur", location: "Rabat", rating: 4.7, price: "3500", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800" },
  { id: 4, title: "Simo Photography", category: "Photographe", location: "Tanger", rating: 4.9, price: "2000", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800" },
  { id: 5, title: "Orchestre Andalou", category: "Musique", location: "Fès", rating: 4.6, price: "8000", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800" },
  { id: 6, title: "Makeup by Sara", category: "Coiffure", location: "Casablanca", rating: 4.8, price: "1500", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800" },
];

function Services() {
  return (
    <div className="services-page">
      {/* Header Section */}
      <div className="services-header">
        <h1 className="page-title">Catalogue des Services</h1>
        <p className="page-subtitle">Découvrez les meilleurs prestataires pour votre mariage</p>
      </div>

      {/* Filter Bar */}
      <section className="filter-section">
        <FilterBar />
      </section>

      {/* Services Grid */}
      <section className="services-grid-container">
        {servicesData.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </section>
    </div>
  );
}

export default Services;