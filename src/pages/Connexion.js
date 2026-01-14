import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Connexion.css";

function Connexion() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (role === "provider") {
      navigate("/provider");
    } else if (role === "user") {
      navigate("/user-dashboard");
    } else {
      alert("Veuillez sélectionner un rôle");
    }
  };

  return (
    <div className="connexion-container">
      <h2>Connexion</h2>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre email"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select 
            id="role" 
            className="form-select" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionnez votre rôle
            </option>
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
        </div>

        <button type="submit" className="btn-connexion">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Connexion;
