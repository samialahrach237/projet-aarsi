import { useEffect, useRef, useState } from "react";
import UserAccountLayout from "../Components/UserAccountLayout";
import { fetchUserProfile, updateUserProfile } from "../services/api";
import { getStoredToken, refreshStoredUser } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrors";
import "../Styles/UserDashboard.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  password: "",
  password_confirmation: "",
  created_at: "",
};

function Profile() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedProfile = useRef(false);

  const emitToast = (type, message) => {
    window.dispatchEvent(new CustomEvent("toast:add", { detail: { type, message } }));
  };

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchUserProfile();
      const profile = response?.data || response;

      setForm({
        name: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        city: profile?.city || "",
        password: "",
        password_confirmation: "",
        created_at: profile?.created_at || "",
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible de charger votre profil."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedProfile.current) {
      return;
    }

    const token = getStoredToken();

    console.log("TOKEN before profile fetch:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    hasLoadedProfile.current = true;
    loadProfile();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
      };

      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }

      const response = await updateUserProfile(payload);
      const profile = response?.data || response;

      setForm((current) => ({
        ...current,
        ...profile,
        password: "",
        password_confirmation: "",
      }));

      await refreshStoredUser();
      emitToast("success", "Profil mis a jour avec succes.");
    } catch (requestError) {
      emitToast("error", getApiErrorMessage(requestError, "Impossible de mettre a jour votre profil."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserAccountLayout activeTab="profile">
      <div className="tab-content">
        {loading ? (
          <p>Chargement de votre profil...</p>
        ) : error ? (
          <>
            <p>{error}</p>
            <button className="save-btn" onClick={loadProfile}>
              Reessayer
            </button>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="content-title">Mon Profil</h2>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input name="name" type="text" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Ville</label>
                <input name="city" type="text" className="form-input" value={form.city} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Telephone</label>
                <input name="phone" type="text" className="form-input" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  name="password"
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Laisser vide pour conserver l'actuel"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmation</label>
                <input
                  name="password_confirmation"
                  type="password"
                  className="form-input"
                  value={form.password_confirmation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Membre depuis</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.created_at ? new Date(form.created_at).toLocaleDateString("fr-FR") : ""}
                  readOnly
                />
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        )}
      </div>
    </UserAccountLayout>
  );
}

export default Profile;
