import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/logo/logo.png";
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
            <img src={logo} alt="AARSSI Logo" className="logo" />
            <span className="brand-name">AARSSI</span>
          </Link>
        </div>

        {/* زر القائمة للموبايل */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link to="/" className={isActive("/")} onClick={toggleMenu}>Accueil</Link>
          <Link to="/services" className={isActive("/services")} onClick={toggleMenu}>Services</Link>
          <Link to="/avis" className={isActive("/avis")} onClick={toggleMenu}>Avis</Link>
          <Link to="/connexion" className={`login-btn-mobile ${isActive("/connexion")}`} onClick={toggleMenu}>Connexion</Link>
        </nav>

        <div className="header-right">
          <Link to="/connexion" className="login-btn">Connexion</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;