import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAccountLayout from "../Components/UserAccountLayout";
import {
  cancelReservation,
  fetchClientAvis,
  fetchClientProfile,
  fetchClientReservations,
} from "../services/api";
import { getApiErrorMessage } from "../utils/apiErrors";
import "../Styles/UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [avis, setAvis] = useState([]);
  const [cancellingReservationId, setCancellingReservationId] = useState(null);

  const emitToast = (type, message) => {
    window.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message } }));
  };

  const loadClientData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [profileData, reservationsData, avisData] = await Promise.all([
        fetchClientProfile(),
        fetchClientReservations(),
        fetchClientAvis(),
      ]);

      setProfile(profileData);
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setAvis(Array.isArray(avisData) ? avisData : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger votre espace client."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, []);

  const handleCancel = async (reservationId) => {
    setCancellingReservationId(reservationId);

    try {
      await cancelReservation(reservationId);
      emitToast("success", "Reservation annulee avec succes.");
      await loadClientData(true);
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible d'annuler cette reservation."));
    } finally {
      setCancellingReservationId(null);
    }
  };

  const openAvisPage = (reservation) => {
    navigate("/mes-avis", {
      state: {
        openCreate: true,
        serviceId: reservation.service_id,
      },
    });
  };

  const openProfilePage = () => {
    navigate("/profile");
  };

  const formatReservationDate = (reservation) => {
    const value = reservation?.reservation_date || reservation?.date;
    return value ? new Date(value).toLocaleDateString("fr-FR") : "-";
  };

  if (loading) {
    return (
      <UserAccountLayout activeTab="reservations">
        <div className="tab-content">
          <p>Chargement de votre espace client...</p>
        </div>
      </UserAccountLayout>
    );
  }

  if (error) {
    return (
      <UserAccountLayout activeTab="reservations">
        <div className="tab-content">
          <p>{error}</p>
          <button className="save-btn" onClick={() => loadClientData()}>
            Reessayer
          </button>
        </div>
      </UserAccountLayout>
    );
  }

  return (
    <UserAccountLayout activeTab="reservations">
      <div className="tab-content user-dashboard-shell">
        <section className="dashboard-panel">
          <div className="panel-head">
            <h2>Mes reservations</h2>
            <button className="save-btn" onClick={() => loadClientData(true)} disabled={refreshing}>
              {refreshing ? "Actualisation..." : "Actualiser"}
            </button>
          </div>
          <div className="dashboard-card-grid">
            {reservations.length ? (
              reservations.map((reservation) => (
                <article key={reservation.id} className="dashboard-reservation-card">
                  <div className="reservation-card-head">
                    <h3>{reservation.service}</h3>
                    <span className={`status-badge status-${reservation.status}`}>{reservation.status}</span>
                  </div>
                  <p>{reservation.prestataire}</p>
                  <p>
                    {formatReservationDate(reservation)} | {reservation.start_time} - {reservation.end_time}
                  </p>
                  <p>{Number(reservation.price || 0).toLocaleString("fr-FR")} MAD</p>
                  <div className="reservation-actions">
                    {reservation.status === "pending" ? (
                      <button
                        className="cancel-action-btn"
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancellingReservationId === reservation.id}
                      >
                        {cancellingReservationId === reservation.id ? "Annulation..." : "Annuler"}
                      </button>
                    ) : null}
                    {reservation.status === "accepted" && !reservation.has_avis ? (
                      <button className="review-btn-small" onClick={() => openAvisPage(reservation)}>
                        Laisser un avis
                      </button>
                    ) : null}
                    {reservation.status === "accepted" && reservation.has_avis ? (
                      <button className="review-btn-small" onClick={() => navigate("/mes-avis")}>
                        Voir mon avis
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <p>Aucune reservation disponible.</p>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-head">
            <h2>Mes avis</h2>
          </div>
          <div className="dashboard-card-grid">
            {avis.length ? (
              avis.map((review) => (
                <article key={review.id} className="dashboard-reservation-card">
                  <div className="reservation-card-head">
                    <h3>{review.service || "Service"}</h3>
                    <span className="status-badge status-accepted">{review.rating}/5</span>
                  </div>
                  <p>{review.prestataire || "Prestataire"}</p>
                  <p>{review.comment || "Aucun commentaire."}</p>
                  <div className="reservation-actions">
                    <button className="review-btn-small" onClick={() => navigate("/mes-avis")}>
                      Gerer mes avis
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p>Vous n'avez pas encore laisse d'avis.</p>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-head">
            <h2>Profil</h2>
          </div>
          <div className="dashboard-card-grid">
            <article className="dashboard-reservation-card">
              <h3>{profile?.name || "Utilisateur"}</h3>
              <p>{profile?.email || "-"}</p>
              <p>{profile?.phone || "Telephone non renseigne"}</p>
              <p>{profile?.city || profile?.client?.address || "Ville non renseignee"}</p>
              <div className="reservation-actions">
                <button className="review-btn-small" onClick={openProfilePage}>
                  Modifier mon profil
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </UserAccountLayout>
  );
}

export default UserDashboard;
