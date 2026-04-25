import React, { useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaCalendar,
  FaCalendarAlt,
  FaHistory,
  FaRegClock,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { createAvis, fetchMyReservations } from "../services/api";
import { getStoredUser, logoutUser } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrors";
import "../Styles/UserDashboard.css";

function UserDashboard() {
  const storedUser = getStoredUser();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState("");

  const user = useMemo(
    () => ({
      name: storedUser?.name || "Utilisateur AARSSI",
      city: storedUser?.client?.address || "Casablanca",
      email: storedUser?.email || "client@example.com",
    }),
    [storedUser]
  );

  const menuItems = [
    { id: "upcoming", label: "Mes reservations", icon: <FaCalendarAlt /> },
    { id: "history", label: "Mes avis", icon: <FaHistory /> },
    { id: "profile", label: "Profil", icon: <FaUser /> },
  ];

  const emitToast = (type, message) => {
    window.dispatchEvent(
      new CustomEvent("toast:add", {
        detail: { type, message },
      })
    );
  };

  const loadReservations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchMyReservations();
      const reservationItems = response?.data?.data || response?.data || [];
      setReservations(Array.isArray(reservationItems) ? reservationItems : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger vos reservations."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const upcomingReservations = reservations.filter((reservation) =>
    ["pending", "accepted"].includes(reservation.status)
  );

  const reviewableReservations = reservations.filter((reservation) => reservation.status === "accepted");

  const filteredUpcomingReservations =
    filterStatus === "all"
      ? upcomingReservations
      : upcomingReservations.filter((reservation) => reservation.status === filterStatus);

  const handleLogout = async () => {
    await logoutUser();
    window.location.assign("/connexion");
  };

  const handleReviewSubmit = async () => {
    if (!showReviewForm) {
      return;
    }

    setSubmittingReview(true);

    try {
      await createAvis({
        service_id: showReviewForm.service.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      emitToast("success", "Votre avis a ete publie avec succes.");
      setShowReviewForm(null);
      setReviewForm({ rating: 5, comment: "" });
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de publier votre avis."));
    } finally {
      setSubmittingReview(false);
    }
  };

  const openReviewModal = (reservation) => {
    setShowReviewForm(reservation);
    setReviewForm({ rating: 5, comment: "" });
  };

  const renderReservationCard = (reservation, showReviewButton = false) => (
    <div key={reservation.id} className="reservation-card">
      <div className="card-header">
        <h3 className="service-name">{reservation.service?.name || "Service"}</h3>
        {showReviewButton ? (
          <div className="review-btn-container">
            <button className="review-btn-small" onClick={() => openReviewModal(reservation)}>
              Laisser un avis
            </button>
          </div>
        ) : (
          <span className={`status-badge status-${reservation.status}`}>
            {reservation.status}
          </span>
        )}
      </div>
      <div className="card-body">
        <p className="provider-name">
          {reservation.service?.prestataire?.nomEntreprise ||
            reservation.service?.prestataire?.user?.name ||
            "Prestataire"}
        </p>
        <div className="reservation-details">
          <span className="date">
            <FaCalendar className="detail-icon" />{" "}
            {new Date(reservation.date).toLocaleDateString("fr-FR")}
          </span>
          <span className="time">
            <FaRegClock className="detail-icon" /> {reservation.start_time} - {reservation.end_time}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {isDrawerOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setIsDrawerOpen(false)}></div>
      )}

      <aside className={`sidebar ${isDrawerOpen ? "open" : ""}`}>
        <div className="sidebar-header"></div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsDrawerOpen(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button className="nav-item logout-btn-inline" onClick={handleLogout}>
                <span className="nav-icon">
                  <FaSignOutAlt />
                </span>
                <span className="nav-label">Deconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="user-header">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsDrawerOpen((current) => !current)}
            aria-label="Ouvrir le menu"
          >
            <FaBars size={24} />
          </button>

          <div className="user-info">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-city">{user.city}</p>
          </div>
        </header>

        <div className="content-area">
          {loading ? (
            <div className="tab-content">
              <p>Chargement de vos donnees...</p>
            </div>
          ) : error ? (
            <div className="tab-content">
              <p>{error}</p>
              <button className="save-btn" onClick={loadReservations}>
                Reessayer
              </button>
            </div>
          ) : (
            <>
              {activeTab === "upcoming" && (
                <div className="tab-content">
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                      onClick={() => setFilterStatus("all")}
                    >
                      Tous
                    </button>
                    <button
                      className={`filter-btn ${filterStatus === "accepted" ? "active" : ""}`}
                      onClick={() => setFilterStatus("accepted")}
                    >
                      Acceptees
                    </button>
                    <button
                      className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
                      onClick={() => setFilterStatus("pending")}
                    >
                      En attente
                    </button>
                  </div>

                  <div className="reservations-grid">
                    {filteredUpcomingReservations.length ? (
                      filteredUpcomingReservations.map((reservation) => renderReservationCard(reservation))
                    ) : (
                      <p>Aucune reservation a afficher.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="tab-content">
                  <div className="reservations-grid">
                    {reviewableReservations.length ? (
                      reviewableReservations.map((reservation) => renderReservationCard(reservation, true))
                    ) : (
                      <p>Aucune reservation eligible aux avis pour le moment.</p>
                    )}
                  </div>

                  {showReviewForm && (
                    <div className="review-modal">
                      <div className="review-form">
                        <h3 className="review-form-title">Laissez votre avis</h3>
                        <div className="form-group">
                          <label className="form-label">Prestataire</label>
                          <input
                            type="text"
                            className="form-input"
                            value={
                              showReviewForm.service?.prestataire?.nomEntreprise ||
                              showReviewForm.service?.prestataire?.user?.name ||
                              "Prestataire"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Note</label>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`star ${star <= reviewForm.rating ? "selected" : ""}`}
                                onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Commentaire</label>
                          <textarea
                            className="form-textarea"
                            rows="4"
                            value={reviewForm.comment}
                            onChange={(event) =>
                              setReviewForm((current) => ({ ...current, comment: event.target.value }))
                            }
                            placeholder="Partagez votre experience..."
                          ></textarea>
                        </div>
                        <div className="form-actions">
                          <button className="cancel-btn" onClick={() => setShowReviewForm(null)}>
                            Annuler
                          </button>
                          <button
                            className="submit-review-btn"
                            onClick={handleReviewSubmit}
                            disabled={submittingReview}
                          >
                            {submittingReview ? "Publication..." : "Publier"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="tab-content">
                  <div className="profile-form">
                    <div className="form-section">
                      <h2 className="content-title">Mon Profil</h2>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Nom complet</label>
                        <input type="text" className="form-input" value={user.name} readOnly />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ville</label>
                        <input type="text" className="form-input" value={user.city} readOnly />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" value={user.email} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-mobile ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon-mobile">{item.icon}</span>
            <span className="nav-label-mobile">{item.label}</span>
          </button>
        ))}
        <button className="nav-item-mobile logout-btn-mobile" onClick={handleLogout}>
          <span className="nav-icon-mobile">
            <FaSignOutAlt />
          </span>
          <span className="nav-label-mobile">Deconnexion</span>
        </button>
      </nav>
    </div>
  );
}

export default UserDashboard;
