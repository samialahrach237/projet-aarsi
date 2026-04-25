import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAccountCircle,
  MdAssignment,
  MdCalendarMonth,
  MdDashboard,
  MdDelete,
  MdEdit,
  MdLayers,
  MdLogout,
  MdMenu,
  MdPayments,
  MdPhotoLibrary,
  MdSave,
} from "react-icons/md";
import {
  acceptReservation,
  createService,
  deleteService,
  deletePrestatairePhoto,
  fetchPrestatairePhotos,
  fetchMyReservations,
  fetchMyServices,
  refuseReservation,
  updatePrestatairePhoto,
  uploadPrestatairePhoto,
  updateService,
} from "../services/api";
import { getStoredUser, logoutUser } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrors";
import "../Styles/ProviderDashboard.css";

const initialServiceForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  category: "",
};

function ProviderDashboard() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [activeTab, setActiveTab] = useState("Services");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingService, setSavingService] = useState(false);
  const [changingReservationId, setChangingReservationId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingPhotoId, setUpdatingPhotoId] = useState(null);
  const [error, setError] = useState("");

  const profileData = useMemo(
    () => ({
      name: storedUser?.prestataire?.nomEntreprise || storedUser?.name || "Prestataire",
      email: storedUser?.email || "contact@prestataire.ma",
      city: storedUser?.prestataire?.adresse || "Maroc",
      description: storedUser?.prestataire?.description || "Aucune description disponible.",
      validated: storedUser?.prestataire?.is_validated,
    }),
    [storedUser]
  );

  const emitToast = (type, message) => {
    window.dispatchEvent(
      new CustomEvent("toast:add", {
        detail: { type, message },
      })
    );
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [servicesResponse, reservationsResponse] = await Promise.all([
        fetchMyServices(),
        fetchMyReservations(),
      ]);

      setServices(servicesResponse?.data || []);
      setReservations(reservationsResponse?.data?.data || reservationsResponse?.data || []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger votre espace prestataire."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadPhotos = async () => {
    if (!storedUser?.id) {
      setPhotos([]);
      return;
    }

    setPhotosLoading(true);
    setPhotoError("");

    try {
      const response = await fetchPrestatairePhotos(storedUser.id);
      setPhotos(Array.isArray(response) ? response : []);
    } catch (requestError) {
      setPhotoError(getApiErrorMessage(requestError, "Impossible de charger vos photos."));
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Photos") {
      loadPhotos();
    }
  }, [activeTab]);

  const handleDeconnexion = async () => {
    await logoutUser();
    navigate("/connexion");
  };

  const handleServiceChange = (event) => {
    const { name, value } = event.target;
    setServiceForm((current) => ({ ...current, [name]: value }));
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    setSavingService(true);

    try {
      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
      };

      if (editingServiceId) {
        await updateService(editingServiceId, payload);
        emitToast("success", "Service mis a jour avec succes.");
      } else {
        await createService(payload);
        emitToast("success", "Service cree avec succes.");
      }

      setServiceForm(initialServiceForm);
      setEditingServiceId(null);
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
      name: service.name,
      description: service.description || "",
      price: String(service.price),
      duration: String(service.duration),
      category: service.category,
    });
    setActiveTab("Services");
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId);
      emitToast("success", "Service supprime avec succes.");
      await loadDashboardData();
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de supprimer ce service."));
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    setChangingReservationId(reservationId);

    try {
      if (action === "accepted") {
        await acceptReservation(reservationId);
        emitToast("success", "Reservation acceptee.");
      } else {
        await refuseReservation(reservationId);
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
      await uploadPrestatairePhoto(imageFile);
      emitToast("success", "Photo telechargee avec succes.");
      await loadPhotos();
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
      await updatePrestatairePhoto(photoId, imageFile);
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
    try {
      await deletePrestatairePhoto(photoId);
      emitToast("success", "Photo supprimee avec succes.");
      await loadPhotos();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Impossible de supprimer cette photo.");
      setPhotoError(message);
      emitToast("error", message);
    }
  };

  const navigationItems = [
    { id: "Services", icon: <MdLayers />, label: "Services" },
    { id: "Reservations", icon: <MdAssignment />, label: "Reservations" },
    { id: "Profile", icon: <MdAccountCircle />, label: "Profil" },
    { id: "Calendar", icon: <MdCalendarMonth />, label: "Calendrier" },
    { id: "Photos", icon: <MdPhotoLibrary />, label: "Photos" },
    { id: "Earnings", icon: <MdPayments />, label: "Revenus" },
    { id: "Overview", icon: <MdDashboard />, label: "Vue d'ensemble" },
  ];

  const renderServicesTab = () => (
    <div className="dashboard-view-content animate-fade-in">
      <div className="profile-edit-container card-box">
        <form className="profile-edit-form" onSubmit={handleServiceSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom du service</label>
              <input name="name" value={serviceForm.name} onChange={handleServiceChange} required />
            </div>
            <div className="form-group">
              <label>Categorie</label>
              <input name="category" value={serviceForm.category} onChange={handleServiceChange} required />
            </div>
            <div className="form-group">
              <label>Prix (MAD)</label>
              <input name="price" type="number" min="0" value={serviceForm.price} onChange={handleServiceChange} required />
            </div>
            <div className="form-group">
              <label>Duree (minutes)</label>
              <input
                name="duration"
                type="number"
                min="1"
                value={serviceForm.duration}
                onChange={handleServiceChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={serviceForm.description}
                onChange={handleServiceChange}
              ></textarea>
            </div>
          </div>
          <div className="form-actions">
            {editingServiceId && (
              <button
                type="button"
                className="btn-save-profile"
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceForm(initialServiceForm);
                }}
              >
                Annuler
              </button>
            )}
            <button type="submit" className="btn-save-profile" disabled={savingService}>
              <MdSave />
              {savingService
                ? "Enregistrement..."
                : editingServiceId
                  ? "Mettre a jour le service"
                  : "Creer un service"}
            </button>
          </div>
        </form>
      </div>

      <div className="photos-grid" style={{ marginTop: 24 }}>
        {services.length ? (
          services.map((service) => (
            <div key={service.id} className="photo-card">
              <div style={{ padding: 20 }}>
                <h3>{service.name}</h3>
                <p>{service.category}</p>
                <p>{Number(service.price).toLocaleString("fr-FR")} MAD</p>
                <p>{service.duration} min</p>
                <p>{service.description || "Aucune description."}</p>
              </div>
              <div className="photo-actions" style={{ position: "static", padding: "0 20px 20px" }}>
                <button className="action-btn star active" onClick={() => handleEditService(service)} title="Modifier">
                  <MdEdit />
                </button>
                <button className="action-btn delete" onClick={() => handleDeleteService(service.id)} title="Supprimer">
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun service cree pour le moment.</p>
        )}
      </div>
    </div>
  );

  const renderReservationsTab = () => (
    <div className="dashboard-view-content animate-fade-in">
      <div className="photos-grid">
        {reservations.length ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="photo-card">
              <div style={{ padding: 20 }}>
                <h3>{reservation.service?.name || "Service"}</h3>
                <p>
                  Client: {reservation.client?.user?.name || "Client"}
                </p>
                <p>
                  Date: {new Date(reservation.date).toLocaleDateString("fr-FR")}
                </p>
                <p>
                  Horaire: {reservation.start_time} - {reservation.end_time}
                </p>
                <p>Statut: {reservation.status}</p>
              </div>

              {reservation.status === "pending" && (
                <div className="photo-actions" style={{ position: "static", padding: "0 20px 20px" }}>
                  <button
                    className="btn-save-profile"
                    onClick={() => handleReservationAction(reservation.id, "accepted")}
                    disabled={changingReservationId === reservation.id}
                  >
                    {changingReservationId === reservation.id ? "..." : "Accepter"}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleReservationAction(reservation.id, "rejected")}
                    disabled={changingReservationId === reservation.id}
                    title="Refuser"
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucune reservation recue pour le moment.</p>
        )}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="dashboard-view-content animate-fade-in">
      <div className="profile-edit-container card-box">
        <div className="form-grid">
          <div className="form-group">
            <label>Entreprise</label>
            <input value={profileData.name} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profileData.email} readOnly />
          </div>
          <div className="form-group">
            <label>Ville / adresse</label>
            <input value={profileData.city} readOnly />
          </div>
          <div className="form-group">
            <label>Validation</label>
            <input value={profileData.validated ? "Valide" : "En attente"} readOnly />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea value={profileData.description} readOnly rows="4"></textarea>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhotosTab = () => (
    <div className="dashboard-view-content animate-fade-in">
      <div className="profile-edit-container card-box">
        <div className="form-group full-width">
          <label>Ajouter une photo</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
          />
          <p>{uploadingPhoto ? "Telechargement en cours..." : "Formats acceptes: jpg, jpeg, png. Taille max: 2 MB."}</p>
          {photoError ? <p>{photoError}</p> : null}
        </div>
      </div>

      {photosLoading ? (
        <p>Chargement des photos...</p>
      ) : photos.length ? (
        <div className="photos-grid" style={{ marginTop: 24 }}>
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img src={photo.url} alt="Prestataire" style={{ width: "100%", height: 220, objectFit: "cover" }} />
              <div className="photo-actions" style={{ position: "static", padding: "16px 20px 20px", justifyContent: "space-between" }}>
                <label className="action-btn star active" title="Remplacer">
                  <MdEdit />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    onChange={(event) => handlePhotoReplace(photo.id, event.target.files?.[0])}
                    disabled={updatingPhotoId === photo.id}
                  />
                </label>
                <button className="action-btn delete" onClick={() => handlePhotoDelete(photo.id)} title="Supprimer">
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune photo disponible pour le moment.</p>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="dashboard-view-content animate-fade-in">
          <p>Chargement de votre espace prestataire...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="dashboard-view-content animate-fade-in">
          <p>{error}</p>
          <button className="btn-save-profile" onClick={loadDashboardData}>
            Reessayer
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "Services":
        return renderServicesTab();
      case "Reservations":
        return renderReservationsTab();
      case "Profile":
        return renderProfileTab();
      case "Photos":
        return renderPhotosTab();
      default:
        return (
          <div className="dashboard-placeholder animate-fade-in">
            <div className="placeholder-content">
              <h2>{activeTab}</h2>
              <p>Cette section sera branchee au backend dans une prochaine iteration.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="provider-dashboard-layout">
      {isDrawerOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setIsDrawerOpen(false)}></div>
      )}

      <aside className={`dashboard-sidebar ${isDrawerOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsDrawerOpen(false);
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button className="nav-item" onClick={handleDeconnexion}>
            <MdLogout /> Deconnexion
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="user-profile-summary">
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsDrawerOpen((current) => !current)}
              aria-label="Ouvrir le menu"
            >
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
