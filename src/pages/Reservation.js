import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../data/serviceRepo';
import '../Styles/Reservation.css';

function Reservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const serviceData = getServiceById(id);
    if (serviceData) {
      setService(serviceData);
    } else {
      navigate('/services'); // Redirect if service not found
    }
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[\+]?[0-9\s\-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'La date ne peut pas être dans le passé';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'L\'heure est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store reservation data (in real app, this would be an API call)
      const reservationData = {
        id: Date.now().toString(),
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Save to localStorage for demo purposes
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      existingReservations.push(reservationData);
      localStorage.setItem('reservations', JSON.stringify(existingReservations));
      
      // Show success and redirect
      alert('✅ Réservation envoyée avec succès! Nous vous contacterons bientôt.');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="reservation-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du service...</p>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-header">
          <h1>Réserver {service.name}</h1>
          <p className="service-category">{service.categoryId} • {service.city}</p>
        </div>

        <div className="reservation-content">
          {/* Service Preview */}
          <div className="service-preview">
            <div className="service-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="service-details">
              <h3>{service.name}</h3>
              <p className="service-price">{service.price.toLocaleString()} MAD</p>
              <div className="service-rating">
                <span className="stars">{"★".repeat(Math.floor(service.rating))}</span>
                <span className="rating-value">{service.rating}</span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="reservation-form-container">
            <h2>Informations de réservation</h2>
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Nom complet *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Votre nom complet"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Téléphone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+212 6 XX XX XX XX"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="votre@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">Heure *</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={errors.time ? 'error' : ''}
                  >
                    <option value="">Sélectionnez une heure</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Nombre de personnes</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes supplémentaires</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Précisions sur votre demande, préférences spéciales, etc."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-reserve"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;