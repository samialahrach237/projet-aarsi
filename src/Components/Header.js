import React from 'react';
import Navigation from './Navigation';

const Header = ({ menuOpen, toggleMenu, closeMenu }) => {
  return (
    <header>
      
      <nav className="nav-container">
        <a href="#" className="logo" onClick={closeMenu}>
          <i className="fas fa-hands-praying logo-icon"></i>
          AAR<span>SSI</span>
        </a>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
        
        <Navigation menuOpen={menuOpen} closeMenu={closeMenu} />
        
        <div className="lang-connexion">
          <select className="lang-select">
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
          <button className="connexion-btn">
            <i className="fas fa-sign-in-alt"></i> Connexion
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;