import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Avis.css";

function Avis() {
  const [expandedReviews, setExpandedReviews] = useState({});
  
  // Load initial reviews from state/data
  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      name: "Salma & Ahmed", 
      city: "Casablanca",
      profile: "Mariée",
      comment: "Un service impeccable ! Merci AARSSI pour l'organisation parfaite de notre mariage. L'équipe a été professionnelle du début à la fin. Les prestataires étaient ponctuels et de qualité exceptionnelle.", 
      rating: 5,
      profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    { 
      id: 2, 
      name: "Fatima E.", 
      city: "Rabat",
      profile: "Marié",
      comment: "J'ai trouvé la meilleure Negafa grâce à vous. Le processus était simple et efficace. Je recommande vivement cette plateforme ! Le service client est exceptionnel et les prestataires sont fiables.", 
      rating: 5,
      profilePhoto: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    { 
      id: 3, 
      name: "Karim T.", 
      city: "Marrakech",
      profile: "Famille des mariés",
      comment: "Facile à utiliser et très professionnel. J'ai pu comparer plusieurs prestataires et choisir le meilleur pour mon événement. La plateforme offre une grande transparence sur les prix et les services.", 
      rating: 4,
      profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    { 
      id: 4, 
      name: "Amal B.", 
      city: "Fès",
      profile: "Invité(e)",
      comment: "Plateforme excellente avec une grande variété de services. La qualité des prestataires est remarquable. Expérience 5 étoiles ! J'ai adoré la facilité de recherche et la qualité des résultats.", 
      rating: 5,
      profilePhoto: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    { 
      id: 5, 
      name: "Youssef M.", 
      city: "Tanger",
      profile: "Organisateur",
      comment: "Très satisfait du service.", 
      rating: 4,
      profilePhoto: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    { 
      id: 6, 
      name: "Nadia K.", 
      city: "Agadir",
      profile: "Prestataire",
      comment: "Service client exceptionnel et prestataires de haute qualité. AARSSI m'a vraiment facilité la vie pour mon mariage. La visibilité offerte aux prestataires est formidable et les clients sont satisfaits.", 
      rating: 5,
      profilePhoto: "https://randomuser.me/api/portraits/women/6.jpg"
    }
  ]);
  

  
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };
  
  const toggleExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  
  const truncateComment = (comment, maxLength = 100) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + '...';
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    platform: 'platform-AARSSI',
    rating: 5,
    review: ''
  });
  
  const handleLeaveReview = () => {
    // Check if user is logged in (using localStorage for testing)
    const isLoggedIn = localStorage.getItem('userToken') !== null;
    
    if (!isLoggedIn) {
      // Redirect to login page
      navigate('/connexion');
      return;
    }
    
    // Show review modal
    setShowReviewModal(true);
  };
  
  const handleFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // Validation
    if (!reviewForm.rating) {
      alert('Veuillez donner une note');
      return;
    }
    
    if (!reviewForm.review.trim()) {
      alert('Veuillez écrire votre avis');
      return;
    }
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Create new review object
    const newReview = {
      id: Date.now(), // Use timestamp for unique ID
      name: userData.email ? userData.email.split('@')[0] : 'Utilisateur', // Extract name from email
      city: "Maroc", // Default city, could be enhanced later
      profile: "Client", // Default profile
      comment: reviewForm.review,
      rating: reviewForm.rating,
      profilePhoto: "https://randomuser.me/api/portraits/lego/1.jpg" // Default profile photo
    };
    
    // Add the new review to the reviews array
    setReviews(prevReviews => [newReview, ...prevReviews]);
    
    // Handle form submission
    console.log('Review submitted:', reviewForm);
    // Reset form and close modal
    setReviewForm({ platform: 'platform-AARSSI', rating: 5, review: '' });
    setShowReviewModal(false);
    
    alert('Votre avis a été soumis avec succès !');
  };
  
  const handleCloseModal = () => {
    setReviewForm({ platform: 'platform-AARSSI', rating: 5, review: '' });
    setShowReviewModal(false);
  };

  return (
    <div className="avis-page">
      <div className="avis-header">
        <h1 className="avis-title">Ce que nos clients disent de l'expérience AARSSI</h1>
        <p className="avis-subtitle">Plus de 500 mariages et événements réussis grâce 
          à nos prestataires certifiés</p>
      </div>

      <div className="reviews-container">
        <div className="reviews-scroll-wrapper">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-profile-section">
                <div className="reviewer-avatar-centered">
                  <img src={review.profilePhoto} alt={review.name} className="profile-photo" />
                </div>
                <div className="reviewer-info-centered">
                  <h3 className="reviewer-name">{review.name}</h3>
                  <div className="reviewer-meta">
                    <span className="reviewer-profile">{review.profile}</span>
                    <span className="reviewer-city">• {review.city}</span>
                  </div>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              <div className="review-content">
                <p className="review-comment">"{expandedReviews[review.id] ? review.comment : truncateComment(review.comment)}"</p>
              </div>
              <button className="voir-details-btn" onClick={() => toggleExpand(review.id)}>
                {expandedReviews[review.id] ? "Réduire" : "Voir détails"}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="avis-action">
        <button className="donner-avis-btn" onClick={() => navigate('/services')}>
          Trouver Mon Prestataire 
        </button>
        <p className="avis-footer-text">
          vous avez déjà utiliser AARSSI ?<a href="#" className="avis-link" onClick={(e) => {
            e.preventDefault();
            handleLeaveReview();
          }}>laissez un avis</a>
        </p>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={handleCloseModal}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        
            
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                    <div className="form-header">
              <div className="form-title">
                <h2>Laisser un avis</h2>
              </div>
              <button type="button" className="form-reduire-icon" onClick={handleCloseModal} aria-label="Fermer">×</button>
            </div>
                <label htmlFor="platform">Plateforme:</label>
                <input
                  type="text"
                  id="platform"
                  value={reviewForm.platform}
                  readOnly
                  className="form-input-read-only"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rating">Votre avis (Notez sur 5 étoiles):</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star}
                      className={`star ${star <= reviewForm.rating ? 'filled' : ''}`}
                      onClick={() => handleFormChange('rating', star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="review">Votre avis:</label>
                <textarea 
                  id="review"
                  placeholder="Racontez-nous votre expérience..."
                  value={reviewForm.review}
                  onChange={(e) => handleFormChange('review', e.target.value)}
                  maxLength="500"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  Publiée
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Avis;