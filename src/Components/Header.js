import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import logoImage from "../Assets/logo/logo.png";

import "../Styles/Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // دالة لتحديد الرابط النشط
  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <div className="logo-symbol">
              <img src={logoImage} alt="AARSSI Logo" className="logo-image" />
            </div>
            <span className="brand-name">AARSSI</span>
          </Link>
        </div>

        <div className="header-right-group">
          {/* Mobile Connection Icon */}
          <div className="mobile-connection-icon">
            <Link to="/connexion" className="connection-link">
              <FaUser className="connection-icon" />
            </Link>
          </div>

          {/* زر القائمة للموبايل */}
          <div className="menu-icon" onClick={toggleMenu}>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
          </div>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link to="/" className={isActive("/")} onClick={toggleMenu}>Accueil</Link>
          <Link to="/services" className={isActive("/services")} onClick={toggleMenu}>Services</Link>
          <Link to="/avis" className={isActive("/avis")} onClick={toggleMenu}>Avis</Link>
         
        </nav>

        <div className="header-right">
          <Link to="/connexion" className="login-btn">Connexion</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;