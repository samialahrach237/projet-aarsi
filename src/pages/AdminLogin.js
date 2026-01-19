import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple static credentials for admin
    if (email === "oumayma@aarssi.com" && password === "12345") {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
    } else {
      alert("❌ Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h2>🔒 Admin Access</h2>
          <p>Espace de gestion sécurisé</p>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Email Administrateur</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@aarssi.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="btn-admin-login">
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
