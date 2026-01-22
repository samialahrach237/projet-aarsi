import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Connexion.css";

function Connexion() {
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Store user information in localStorage
    const userData = {
      email: email,
      role: role,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userToken', 'auth-token-' + Date.now()); // Simple token for auth check
    
    if (role === "provider") {
      // Logic for provider login redirection
      if (email && password) {
        sessionStorage.setItem("isProviderAuthenticated", "true");
        navigate("/provider-dashboard");
      }
    } else if (role === "user") {
      navigate("/user-dashboard");
    } else {
      alert("Veuillez sélectionner un rôle");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.registerEmail.value;
    const password = e.target.registerPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    const registerRole = e.target.registerRole.value;
    
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!email || !password || !registerRole) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }
    
    // Store registered user in localStorage
    const newUser = {
      email: email,
      role: registerRole,
      registeredAt: new Date().toISOString(),
      id: Date.now() // Simple ID generation
    };
    
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.some(user => user.email === email);
    if (userExists) {
      alert("Un utilisateur avec cet email existe déjà");
      return;
    }
    
    // Add new user
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    
    // Reset form
    e.target.reset();
  };
  
  return (
    <div className="connexion-page">
      <div className="connexion-container">
        {showLogin ? (
          <>
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
            
            <div className="form-switch">
              <p>Vous n'avez pas de compte ? <span className="switch-link" onClick={() => setShowLogin(false)}>S'inscrire</span></p>
            </div>
          </>
        ) : (
          <>
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="registerEmail">Email</label>
                <input
                  id="registerEmail"
                  type="email"
                  placeholder="Entrez votre email"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registerPassword">Mot de passe</label>
                <input
                  id="registerPassword"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmation de mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registerRole">Rôle</label>
                <select 
                  id="registerRole" 
                  className="form-select" 
                  required
                >
                  <option value="" disabled selected>
                    Sélectionnez votre rôle
                  </option>
                  <option value="user">utilisateur</option>
                  <option value="provider">prestataire</option>
                </select>
              </div>

              <button type="submit" className="btn-register">
                S'inscrire
              </button>
            </form>
            
            <div className="form-switch">
              <p>Vous avez déjà un compte ? <span className="switch-link" onClick={() => setShowLogin(true)}>Se connecter</span></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Connexion;
