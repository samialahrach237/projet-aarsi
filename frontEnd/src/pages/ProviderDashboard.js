import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, addMonths, addWeeks, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import {
  MdAdd,
  MdAssignment,
  MdCalendarMonth,
  MdCheckCircle,
  MdDelete,
  MdEdit,
  MdImage,
  MdInsights,
  MdLogout,
  MdMenu,
  MdPendingActions,
  MdRefresh,
  MdSave,
  MdStorefront,
} from "react-icons/md";
import {
  acceptProviderReservation,
  createProviderAvailability,
  createProviderService,
  deleteProviderAvailability,
  deleteProviderPhoto,
  deleteProviderService,
  fetchProviderCalendar,
  fetchProviderDashboard,
  fetchProviderPhotos,
  fetchProviderReservations,
  fetchProviderServices,
  refuseProviderReservation,
  updateProviderAvailability,
  updateProviderPhoto,
  updateProviderService,
  uploadProviderPhoto,
} from "../services/api";
import { getStoredUser, logoutUser } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrors";
import ProviderCalendar from "../Components/ProviderCalendar";
import "../Styles/ProviderDashboard.css";

const initialServiceForm = {
  name: "",
  category: "",
  price: "",
  duration: "",
  description: "",
  image: null,
};

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: <MdInsights /> },
  { id: "services", label: "Services", icon: <MdStorefront /> },
  { id: "reservations", label: "Reservations", icon: <MdAssignment /> },
  { id: "calendar", label: "Calendrier", icon: <MdCalendarMonth /> },
  { id: "photos", label: "Photos", icon: <MdImage /> },
];

const getCategoryLabel = (category) => {
  if (typeof category === "object") {
    return category?.name || category?.title || category?.slug || "";
  }

  return category || "";
};

function ProviderDashboard() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [availabilityRules, setAvailabilityRules] = useState([]);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState("month");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [savingService, setSavingService] = useState(false);
  const [changingReservationId, setChangingReservationId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingPhotoId, setUpdatingPhotoId] = useState(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const hasLoaded = useRef(false);

  const emitToast = (type, message) => {
    window.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message } }));
  };

  const formatReservationDate = (reservation) => {
    const value = reservation?.reservation_date || reservation?.date;
    return value ? new Date(value).toLocaleDateString("fr-FR") : "-";
  };

  const profileData = useMemo(() => {
    const provider = dashboard?.provider;

    return {
      name: provider?.name || storedUser?.prestataire?.nomEntreprise || storedUser?.name || "Prestataire",
      email: provider?.email || storedUser?.email || "contact@prestataire.ma",
      city: provider?.city || storedUser?.prestataire?.adresse || storedUser?.city || "Maroc",
      description: provider?.description || storedUser?.prestataire?.description || "Aucune description disponible.",
      validated: provider?.is_validated ?? storedUser?.prestataire?.is_validated ?? false,
    };
  }, [dashboard, storedUser]);

  const stats = useMemo(() => {
    const values = dashboard?.stats || {};

    return [
      {
        id: "services",
        label: "Services actifs",
        value: values.services_count ?? 0,
        helper: "Offres publiees",
        icon: <MdStorefront />,
      },
      {
        id: "total",
        label: "Reservations totales",
        value: values.total_reservations ?? 0,
        helper: `${values.pending_reservations ?? 0} en attente`,
        icon: <MdPendingActions />,
      },
      {
        id: "accepted",
        label: "Reservations confirmees",
        value: values.accepted_reservations ?? 0,
        helper: "Commandes validees",
        icon: <MdCheckCircle />,
      },
      {
        id: "revenue",
        label: "Chiffre estime",
        value: `${Number(values.estimated_revenue ?? 0).toLocaleString("fr-FR")} MAD`,
        helper: `${values.photos_count ?? 0} photos en ligne`,
        icon: <MdInsights />,
      },
    ];
  }, [dashboard]);

  const reservationCalendarEvents = useMemo(
    () =>
      calendarEvents
        .filter((event) => event.type === "reservation")
        .map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })),
    [calendarEvents]
  );

  const availabilityCalendarEvents = useMemo(
    () =>
      availabilityRules.map((item) => ({
        ...item.event,
        start: new Date(item.event.start),
        end: new Date(item.event.end),
      })),
    [availabilityRules]
  );

  const selectedAvailabilityRule = useMemo(() => {
    if (!selectedCalendarDate) {
      return null;
    }

    const selectedDateKey = selectedCalendarDate.toISOString().slice(0, 10);
    return availabilityRules.find((item) => item.date === selectedDateKey) || null;
  }, [availabilityRules, selectedCalendarDate]);

  const loadPhotos = useCallback(async () => {
    setPhotosLoading(true);
    setPhotoError("");

    try {
      const response = await fetchProviderPhotos();
      setPhotos(Array.isArray(response) ? response : []);
    } catch (requestError) {
      setPhotoError(getApiErrorMessage(requestError, "Impossible de charger vos photos."));
    } finally {
      setPhotosLoading(false);
    }
  }, []);

  const loadCalendar = useCallback(async () => {
    try {
      const response = await fetchProviderCalendar();
      const payload = response || {};
      setCalendarEvents(Array.isArray(payload.events) ? payload.events : []);
      setAvailabilityRules(Array.isArray(payload.availability) ? payload.availability : []);
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de charger le calendrier prestataire."));
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardResponse, servicesResponse, reservationsResponse] = await Promise.all([
        fetchProviderDashboard(),
        fetchProviderServices(),
        fetchProviderReservations(),
      ]);

      setDashboard(dashboardResponse || null);
      setServices(Array.isArray(servicesResponse) ? servicesResponse : []);
      setReservations(Array.isArray(reservationsResponse) ? reservationsResponse : []);
      await loadCalendar();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger votre espace prestataire."));
    } finally {
      setLoading(false);
    }
  }, [loadCalendar]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;
    loadDashboardData();
  }, [loadDashboardData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeTab === "photos" && !photos.length && !photosLoading) {
      loadPhotos();
    }
  }, [activeTab, photos.length, photosLoading, loadPhotos]);

  const setAvailabilityForDate = async (available) => {
    if (!selectedCalendarDate) {
      return;
    }

    setSavingAvailability(true);

    const payload = {
      date: selectedCalendarDate.toISOString().slice(0, 10),
      available,
    };

    try {
      if (selectedAvailabilityRule?.id) {
        await updateProviderAvailability(selectedAvailabilityRule.id, payload);
      } else {
        await createProviderAvailability(payload);
      }

      emitToast("success", available ? "Jour marque comme disponible." : "Jour marque comme indisponible.");
      await loadCalendar();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de mettre a jour la disponibilite."));
    } finally {
      setSavingAvailability(false);
    }
  };

  const clearAvailabilityOverride = async () => {
    if (!selectedAvailabilityRule?.id) {
      setSelectedCalendarEvent(null);
      setSelectedCalendarDate(null);
      setCalendarView("month");
      setCalendarDate(new Date());
      return;
    }

    setSavingAvailability(true);

    try {
      await deleteProviderAvailability(selectedAvailabilityRule.id);
      emitToast("success", "Disponibilite reinitialisee.");
      await loadCalendar();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible d'effacer cette disponibilite."));
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/connexion");
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(initialServiceForm);
  };

  const handleServiceChange = ({ target: { name, value } }) => {
    setServiceForm((current) => ({ ...current, [name]: value }));
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();

    if (savingService) {
      return;
    }

    setSavingService(true);

    try {
      const payload = {
        name: serviceForm.name.trim(),
        category: serviceForm.category.trim(),
        description: serviceForm.description.trim() || null,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
        image: serviceForm.image,
      };

      if (editingServiceId) {
        await updateProviderService(editingServiceId, payload);
        emitToast("success", "Service mis a jour avec succes.");
      } else {
        await createProviderService(payload);
        emitToast("success", "Service cree avec succes.");
      }

      resetServiceForm();
      await loadDashboardData();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible d'enregistrer ce service."));
    } finally {
      setSavingService(false);
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name || "",
      category: getCategoryLabel(service.category),
      price: service.price != null ? String(service.price) : "",
      duration: service.duration != null ? String(service.duration) : "",
      description: service.description || "",
      image: null,
    });
    setActiveTab("services");
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteProviderService(serviceId);
      emitToast("success", "Service supprime avec succes.");
      await loadDashboardData();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de supprimer ce service."));
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    setChangingReservationId(reservationId);

    try {
      if (action === "accept") {
        await acceptProviderReservation(reservationId);
        emitToast("success", "Reservation acceptee.");
      } else {
        await refuseProviderReservation(reservationId);
        emitToast("success", "Reservation refusee.");
      }

      await loadDashboardData();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de mettre a jour cette reservation."));
    } finally {
      setChangingReservationId(null);
    }
  };

  const handlePhotoUpload = async (event) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setUploadingPhoto(true);
    setPhotoError("");

    try {
      await uploadProviderPhoto(imageFile);
      emitToast("success", "Photo telechargee avec succes.");
      await Promise.all([loadPhotos(), loadDashboardData()]);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Impossible de telecharger cette photo.");
      setPhotoError(message);
      emitToast("error", message);
    } finally {
      event.target.value = "";
      setUploadingPhoto(false);
    }
  };

  const handlePhotoReplace = async (photoId, imageFile) => {
    if (!imageFile) {
      return;
    }

    setUpdatingPhotoId(photoId);
    setPhotoError("");

    try {
      await updateProviderPhoto(photoId, imageFile);
      emitToast("success", "Photo mise a jour avec succes.");
      await loadPhotos();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Impossible de remplacer cette photo.");
      setPhotoError(message);
      emitToast("error", message);
    } finally {
      setUpdatingPhotoId(null);
    }
  };

  const handlePhotoDelete = async (photoId) => {
    setDeletingPhotoId(photoId);

    try {
      await deleteProviderPhoto(photoId);
      emitToast("success", "Photo supprimee avec succes.");
      await Promise.all([loadPhotos(), loadDashboardData()]);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Impossible de supprimer cette photo.");
      setPhotoError(message);
      emitToast("error", message);
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleCalendarEventSelect = (event) => {
    setSelectedCalendarEvent(event);
    setSelectedCalendarDate(new Date(event.start));
    setCalendarDate(new Date(event.start));
  };

  const handleCalendarSlotSelect = ({ start }) => {
    setSelectedCalendarEvent(null);
    setSelectedCalendarDate(start);
    setCalendarDate(start);
  };

  const handleCalendarNavigate = (action) => {
    setSelectedCalendarEvent(null);

    setCalendarDate((current) => {
      if (action === "TODAY") {
        return new Date();
      }

      if (calendarView === "month") {
        return action === "NEXT" ? addMonths(current, 1) : subMonths(current, 1);
      }

      if (calendarView === "week" || calendarView === "agenda") {
        return action === "NEXT" ? addWeeks(current, 1) : subWeeks(current, 1);
      }

      return action === "NEXT" ? addDays(current, 1) : subDays(current, 1);
    });
  };

  const handleCalendarViewChange = (nextView) => {
    setSelectedCalendarEvent(null);
    setCalendarView(nextView);

    if (nextView === "week" || nextView === "agenda") {
      setCalendarDate((current) => startOfWeek(current, { weekStartsOn: 1 }));
    }
  };

  const renderOverview = () => (
    <div className="dashboard-view-content provider-section-stack">
      <section className="provider-hero card-box">
        <div>
          <p className="provider-eyebrow">Espace prestataire</p>
          <h1>{profileData.name}</h1>
          <p className="provider-hero-copy">{profileData.description}</p>
        </div>
        <div className="provider-hero-meta">
          <span className={`provider-status-pill ${profileData.validated ? "is-live" : "is-pending"}`}>
            {profileData.validated ? "Compte valide" : "Validation en attente"}
          </span>
          <span>{profileData.city}</span>
          <span>{profileData.email}</span>
        </div>
      </section>

      <section className="provider-stats-grid">
        {stats.map((stat) => (
          <article key={stat.id} className="provider-stat-card">
            <div className="provider-stat-icon">{stat.icon}</div>
            <div>
              <p className="provider-stat-label">{stat.label}</p>
              <h3 className="provider-stat-value">{stat.value}</h3>
              <p className="provider-stat-helper">{stat.helper}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="card-box provider-table-card">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">Recent</p>
            <h2>Dernieres reservations</h2>
          </div>
          <button className="provider-secondary-btn" onClick={() => setActiveTab("reservations")}>
            Voir tout
          </button>
        </div>
        <div className="provider-table-wrap">
          <table className="provider-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Horaire</th>
                <th>Statut</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.recent_reservations || []).length ? (
                dashboard.recent_reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.client_name || "Client"}</td>
                    <td>{reservation.service_name || "Service"}</td>
                    <td>{formatReservationDate(reservation)}</td>
                    <td>{reservation.start_time} - {reservation.end_time}</td>
                    <td><span className={`provider-badge status-${reservation.status}`}>{reservation.status}</span></td>
                    <td>{Number(reservation.amount || 0).toLocaleString("fr-FR")} MAD</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="provider-empty-cell">Aucune reservation recente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderServices = () => (
    <div className="dashboard-view-content provider-section-stack">
      <section className="card-box provider-form-card">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">CRUD</p>
            <h2>{editingServiceId ? "Modifier un service" : "Ajouter un service"}</h2>
          </div>
          {editingServiceId ? (
            <button className="provider-secondary-btn" onClick={resetServiceForm}>Annuler</button>
          ) : null}
        </div>

        <form className="provider-form-grid" onSubmit={handleServiceSubmit}>
          <label>
            <span>Nom du service</span>
            <input name="name" value={serviceForm.name} onChange={handleServiceChange} required />
          </label>
          <label>
            <span>Categorie</span>
            <input name="category" value={serviceForm.category} onChange={handleServiceChange} required />
          </label>
          <label>
            <span>Prix (MAD)</span>
            <input name="price" type="number" min="0" step="0.01" value={serviceForm.price} onChange={handleServiceChange} required />
          </label>
          <label>
            <span>Duree (minutes)</span>
            <input name="duration" type="number" min="1" value={serviceForm.duration} onChange={handleServiceChange} required />
          </label>
          <label className="full-width">
            <span>Description</span>
            <textarea name="description" rows="4" value={serviceForm.description} onChange={handleServiceChange} />
          </label>
          <label className="full-width">
            <span>Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) =>
                setServiceForm((current) => ({
                  ...current,
                  image: event.target.files?.[0] ?? null,
                }))
              }
            />
          </label>
          <div className="provider-form-actions full-width">
            <button type="submit" className="btn-save-profile" disabled={savingService}>
              {editingServiceId ? <MdSave /> : <MdAdd />}
              {savingService ? "Enregistrement..." : editingServiceId ? "Mettre a jour" : "Creer le service"}
            </button>
          </div>
        </form>
      </section>

      <section className="card-box provider-table-card">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">Catalogue</p>
            <h2>Mes services</h2>
          </div>
          <button className="provider-secondary-btn" onClick={loadDashboardData}>
            <MdRefresh /> Actualiser
          </button>
        </div>
        <div className="provider-table-wrap">
          <table className="provider-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Categorie</th>
                <th>Prix</th>
                <th>Duree</th>
                <th>Reservations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length ? (
                services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                      <p className="provider-inline-note">{service.description || "Sans description"}</p>
                    </td>
                    <td>{getCategoryLabel(service.category) || "Categorie"}</td>
                    <td>{Number(service.price || 0).toLocaleString("fr-FR")} MAD</td>
                    <td>{service.duration} min</td>
                    <td>{service.reservations_count || 0}</td>
                    <td>
                      <div className="provider-row-actions">
                        <button className="action-btn star active" onClick={() => handleEditService(service)} title="Modifier">
                          <MdEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteService(service.id)} title="Supprimer">
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="provider-empty-cell">Aucun service cree pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderReservations = () => (
    <div className="dashboard-view-content provider-section-stack">
      <section className="card-box provider-table-card">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">Demandes</p>
            <h2>Reservations clientes</h2>
          </div>
          <button className="provider-secondary-btn" onClick={loadDashboardData}>
            <MdRefresh /> Actualiser
          </button>
        </div>
        <div className="provider-table-wrap">
          <table className="provider-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Horaire</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length ? (
                reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <strong>{reservation.client_name || "Client"}</strong>
                      <p className="provider-inline-note">{reservation.client_email || "Email indisponible"}</p>
                    </td>
                    <td>
                      <strong>{reservation.service_name || "Service"}</strong>
                      <p className="provider-inline-note">{reservation.service_category || "Categorie"}</p>
                    </td>
                    <td>{formatReservationDate(reservation)}</td>
                    <td>{reservation.start_time} - {reservation.end_time}</td>
                    <td>{Number(reservation.price || 0).toLocaleString("fr-FR")} MAD</td>
                    <td><span className={`provider-badge status-${reservation.status}`}>{reservation.status}</span></td>
                    <td>
                      {reservation.status === "pending" ? (
                        <div className="provider-row-actions provider-row-actions-wide">
                          <button
                            className="provider-accept-btn"
                            onClick={() => handleReservationAction(reservation.id, "accept")}
                            disabled={changingReservationId === reservation.id}
                          >
                            {changingReservationId === reservation.id ? "..." : "Accepter"}
                          </button>
                          <button
                            className="provider-refuse-btn"
                            onClick={() => handleReservationAction(reservation.id, "refuse")}
                            disabled={changingReservationId === reservation.id}
                          >
                            Refuser
                          </button>
                        </div>
                      ) : (
                        <span className="provider-inline-note">Aucune action</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="provider-empty-cell">Aucune reservation recue pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderPhotos = () => (
    <div className="dashboard-view-content provider-section-stack">
      <section className="card-box provider-form-card">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">Galerie</p>
            <h2>Gerer les photos</h2>
          </div>
          <button className="provider-secondary-btn" onClick={loadPhotos}>
            <MdRefresh /> Actualiser
          </button>
        </div>

        <label className="provider-upload-panel">
          <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
          <span className="provider-upload-icon"><MdAdd /></span>
          <strong>{uploadingPhoto ? "Telechargement..." : "Ajouter une image"}</strong>
          <span>JPG, JPEG ou PNG, 2 MB maximum</span>
        </label>

        {photoError ? <p className="provider-error-inline">{photoError}</p> : null}
      </section>

      {photosLoading ? (
        <section className="card-box"><p>Chargement des photos...</p></section>
      ) : (
        <section className="provider-photo-grid">
          {photos.length ? (
            photos.map((photo) => (
              <article key={photo.id} className="provider-photo-card">
                <img src={photo.url} alt="Prestataire" />
                <div className="provider-photo-footer">
                  <span className="provider-inline-note">Photo #{photo.id}</span>
                  <div className="provider-row-actions">
                    <label className="action-btn star active" title="Remplacer">
                      <MdEdit />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(event) => handlePhotoReplace(photo.id, event.target.files?.[0])}
                        disabled={updatingPhotoId === photo.id}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      className="action-btn delete"
                      onClick={() => handlePhotoDelete(photo.id)}
                      disabled={deletingPhotoId === photo.id}
                      title="Supprimer"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <section className="card-box"><p>Aucune photo disponible pour le moment.</p></section>
          )}
        </section>
      )}
    </div>
  );

  const renderCalendar = () => (
    <div className="dashboard-view-content provider-section-stack">
      <section className="card-box provider-calendar-header">
        <div className="provider-section-header">
          <div>
            <p className="provider-section-kicker">Planning</p>
            <h2>Calendrier des reservations</h2>
          </div>
          <button className="provider-secondary-btn" onClick={loadCalendar}>
            <MdRefresh /> Actualiser
          </button>
        </div>
        <div className="provider-calendar-legend">
          <span><i className="legend-chip booked"></i> Reservations</span>
          <span><i className="legend-chip available"></i> Disponible</span>
          <span><i className="legend-chip unavailable"></i> Indisponible</span>
        </div>
      </section>

      <section className="provider-calendar-layout">
        <div className="card-box provider-calendar-card">
          <ProviderCalendar
            reservationEvents={reservationCalendarEvents}
            availabilityEvents={availabilityCalendarEvents}
            currentDate={calendarDate}
            currentView={calendarView}
            onNavigate={handleCalendarNavigate}
            onView={handleCalendarViewChange}
            onSelectEvent={handleCalendarEventSelect}
            onSelectSlot={handleCalendarSlotSelect}
          />
        </div>

        <aside className="card-box provider-calendar-sidebar">
          <div className="provider-calendar-panel">
            <p className="provider-section-kicker">Date selectionnee</p>
            <h3>
              {selectedCalendarDate
                ? selectedCalendarDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Choisissez une date"}
            </h3>
            <p className="provider-inline-note">
              {selectedAvailabilityRule
                ? selectedAvailabilityRule.available
                  ? "Cette journee est marquee disponible."
                  : "Cette journee est marquee indisponible."
                : "Aucune regle enregistree pour cette date."}
            </p>
            <div className="provider-availability-actions">
              <button
                className="provider-accept-btn"
                onClick={() => setAvailabilityForDate(true)}
                disabled={!selectedCalendarDate || savingAvailability}
              >
                Marquer disponible
              </button>
              <button
                className="provider-refuse-btn"
                onClick={() => setAvailabilityForDate(false)}
                disabled={!selectedCalendarDate || savingAvailability}
              >
                Marquer indisponible
              </button>
              <button
                className="provider-secondary-btn"
                onClick={clearAvailabilityOverride}
                disabled={savingAvailability}
              >
                {selectedAvailabilityRule?.id ? "Effacer la regle" : "Effacer le filtre"}
              </button>
            </div>
          </div>

          <div className="provider-calendar-panel">
            <p className="provider-section-kicker">Reservation</p>
            {selectedCalendarEvent?.resource ? (
              <>
                <h3>{selectedCalendarEvent.resource.service || selectedCalendarEvent.title}</h3>
                <p><strong>Client:</strong> {selectedCalendarEvent.resource.client || "Client"}</p>
                <p><strong>Email:</strong> {selectedCalendarEvent.resource.client_email || "Non renseigne"}</p>
                <p><strong>Telephone:</strong> {selectedCalendarEvent.resource.client_phone || "Non renseigne"}</p>
                <p><strong>Statut:</strong> {selectedCalendarEvent.resource.status || "pending"}</p>
                <p>
                  <strong>Horaire:</strong>{" "}
                  {selectedCalendarEvent.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  {" - "}
                  {selectedCalendarEvent.end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </>
            ) : (
              <p className="provider-inline-note">Cliquez sur une reservation pour afficher les details.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="dashboard-view-content"><p>Chargement de votre espace prestataire...</p></div>;
    }

    if (error) {
      return (
        <div className="dashboard-view-content card-box provider-error-card">
          <p>{error}</p>
          <button className="btn-save-profile" onClick={loadDashboardData}>Reessayer</button>
        </div>
      );
    }

    switch (activeTab) {
      case "services":
        return renderServices();
      case "reservations":
        return renderReservations();
      case "calendar":
        return renderCalendar();
      case "photos":
        return renderPhotos();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="provider-dashboard-layout">
      {isDrawerOpen ? <div className="drawer-backdrop active" onMouseDown={() => setIsDrawerOpen(false)}></div> : null}

      <aside className={`dashboard-sidebar ${isDrawerOpen ? "open" : ""}`}>
        <div className="sidebar-logo-container">
          <p className="logo-text">AAR<span>SSI</span></p>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setIsDrawerOpen(false);
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button className="nav-item" onClick={handleLogout}>
            <MdLogout /> Deconnexion
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="user-profile-summary">
            <button className="mobile-menu-toggle" onClick={() => setIsDrawerOpen((current) => !current)} aria-label="Ouvrir le menu">
              <MdMenu size={24} />
            </button>
            <div className="user-info">
              <span className="user-name">{profileData.name}</span>
              <span className="user-city">{profileData.city}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">{renderContent()}</div>
      </main>
    </div>
  );
}

export default ProviderDashboard;
