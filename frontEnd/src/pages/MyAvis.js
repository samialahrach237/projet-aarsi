import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserAccountLayout from "../Components/UserAccountLayout";
import {
  createAvis,
  deleteAvis as deleteAvisRequest,
  fetchClientReservations,
  fetchUserAvis,
  updateAvis as updateAvisRequest,
} from "../services/api";
import { getStoredToken } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrors";
import "../Styles/Avis.css";
import "../Styles/UserDashboard.css";

function MyAvis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [reviewableReservations, setReviewableReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const hasLoadedAvis = useRef(false);
  const [modalState, setModalState] = useState({
    mode: null,
    avisId: null,
    serviceId: null,
    service: "",
    prestataire: "",
    rating: 5,
    comment: "",
  });

  const emitToast = (type, message) => {
    window.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message } }));
  };

  const loadAvis = async () => {
    setLoading(true);
    setError("");

    try {
      const [avisResponse, reservationsResponse] = await Promise.all([
        fetchUserAvis(),
        fetchClientReservations(),
      ]);
      const avisItems = avisResponse?.data || avisResponse || [];
      const reservations = Array.isArray(reservationsResponse) ? reservationsResponse : [];

      setReviews(Array.isArray(avisItems) ? avisItems : []);
      setReviewableReservations(
        reservations.filter(
          (reservation) => reservation.status === "accepted" && !reservation.has_avis
        )
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger vos avis."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedAvis.current) {
      return;
    }

    const token = getStoredToken();

    if (!token) {
      setLoading(false);
      return;
    }

    hasLoadedAvis.current = true;
    loadAvis();
  }, []);

  useEffect(() => {
    const serviceId = location.state?.serviceId;

    if (location.state?.openCreate && serviceId && reviewableReservations.length) {
      const reservation = reviewableReservations.find(
        (item) => String(item.service_id) === String(serviceId)
      );

      if (!reservation) {
        navigate(location.pathname, { replace: true, state: null });
        return;
      }

      setModalState({
        mode: "create",
        avisId: null,
        serviceId: reservation.service_id,
        service: reservation.service || "Service",
        prestataire: reservation.prestataire || "Prestataire",
        rating: 5,
        comment: "",
      });

      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, reviewableReservations]);

  const renderStars = (rating, clickable = false, onChange = null) =>
    [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star ${star <= rating ? "selected" : ""}`}
        onClick={clickable ? () => onChange?.(star) : undefined}
        disabled={!clickable}
      >
        *
      </button>
    ));

  const openEditModal = (review) => {
    setModalState({
      mode: "edit",
      avisId: review.id,
      serviceId: review.service_id,
      service: review.service || "Service",
      prestataire: review.prestataire || "Prestataire",
      rating: review.rating,
      comment: review.comment || "",
    });
  };

  const openCreateModal = (reservation) => {
    setModalState({
      mode: "create",
      avisId: null,
      serviceId: reservation.service_id,
      service: reservation.service || "Service",
      prestataire: reservation.prestataire || "Prestataire",
      rating: 5,
      comment: "",
    });
  };

  const closeModal = () => {
    setModalState({
      mode: null,
      avisId: null,
      serviceId: null,
      service: "",
      prestataire: "",
      rating: 5,
      comment: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (modalState.mode === "create") {
        await createAvis({
          service_id: modalState.serviceId,
          rating: modalState.rating,
          comment: modalState.comment,
        });
        emitToast("success", "Avis ajoute avec succes.");
      } else if (modalState.mode === "edit" && modalState.avisId) {
        await updateAvisRequest(modalState.avisId, {
          rating: modalState.rating,
          comment: modalState.comment,
        });
        emitToast("success", "Avis mis a jour avec succes.");
      }

      closeModal();
      await loadAvis();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible d'enregistrer cet avis."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (avisId) => {
    setDeletingId(avisId);

    try {
      await deleteAvisRequest(avisId);
      emitToast("success", "Avis supprime avec succes.");
      await loadAvis();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de supprimer cet avis."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <UserAccountLayout activeTab="avis">
      <div className="tab-content">
        <div className="form-section">
          <h2 className="content-title">Mes Avis</h2>
        </div>

        {loading ? (
          <p>Chargement de vos avis...</p>
        ) : error ? (
          <>
            <p>{error}</p>
            <button className="save-btn" onClick={loadAvis}>
              Reessayer
            </button>
          </>
        ) : (
          <>
            <div className="avis-section-block">
              <div className="avis-section-header">
                <h3>Avis a laisser</h3>
                <span>{reviewableReservations.length} service(s) a evaluer</span>
              </div>
              <div className="reservations-grid avis-dashboard-grid">
                {reviewableReservations.length ? (
                  reviewableReservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-card avis-card avis-card-pending">
                      <div className="card-header">
                        <h3 className="service-name">{reservation.service || "Service"}</h3>
                        <span className="avis-date">
                          {reservation.date
                            ? new Date(reservation.date).toLocaleDateString("fr-FR")
                            : "-"}
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="provider-name">{reservation.prestataire || "Prestataire"}</p>
                        <p className="avis-commentaire">
                          Votre reservation a ete acceptee. Partagez votre experience
                          pour aider les prochains clients.
                        </p>
                        <div className="reservation-actions">
                          <button
                            className="review-btn-small"
                            onClick={() => openCreateModal(reservation)}
                          >
                            Laisser un avis
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-card">
                    <p>Aucune reservation acceptee en attente d'avis.</p>
                    <button className="review-btn-small" onClick={() => navigate("/user-dashboard")}>
                      Voir mes reservations
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="avis-section-block">
              <div className="avis-section-header">
                <h3>Mes avis publies</h3>
                <span>{reviews.length} avis</span>
              </div>
              <div className="reservations-grid avis-dashboard-grid">
                {reviews.length ? (
                  reviews.map((review) => (
                    <div key={review.id} className="reservation-card avis-card">
                      <div className="card-header">
                        <h3 className="service-name">{review.service || "Service"}</h3>
                        <span className="avis-date">
                          {review.date
                            ? new Date(review.date).toLocaleDateString("fr-FR")
                            : "-"}
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="provider-name">{review.prestataire || "Prestataire"}</p>
                        <div className="star-rating static-stars">{renderStars(review.rating)}</div>
                        <p className="avis-commentaire">{review.comment || "Aucun commentaire."}</p>
                        <div className="reservation-actions">
                          <button className="review-btn-small" onClick={() => openEditModal(review)}>
                            Modifier
                          </button>
                          <button
                            className="cancel-action-btn"
                            onClick={() => handleDelete(review.id)}
                            disabled={deletingId === review.id}
                          >
                            {deletingId === review.id ? "Suppression..." : "Supprimer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-card">
                    <p>Vous n'avez pas encore laisse d'avis.</p>
                    <button className="review-btn-small" onClick={() => navigate("/user-dashboard")}>
                      Voir mes reservations
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {modalState.mode && (
          <div className="review-modal" onMouseDown={closeModal}>
            <form className="review-form" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
              <h3 className="review-form-title">
                {modalState.mode === "create" ? "Laisser un avis" : "Modifier mon avis"}
              </h3>
              <div className="form-group">
                <label className="form-label">Service</label>
                <input type="text" className="form-input" value={modalState.service} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Prestataire</label>
                <input type="text" className="form-input" value={modalState.prestataire} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <div className="star-rating">
                  {renderStars(modalState.rating, true, (rating) =>
                    setModalState((current) => ({ ...current, rating }))
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Commentaire</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={modalState.comment}
                  onChange={(event) =>
                    setModalState((current) => ({ ...current, comment: event.target.value }))
                  }
                  placeholder="Partagez votre experience..."
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="submit-review-btn" disabled={submitting}>
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </UserAccountLayout>
  );
}

export default MyAvis;
