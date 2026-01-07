import React from 'react';

const Navigation = ({ menuOpen, closeMenu }) => {
  const navItems = [
    { id: 1, name: 'Accueil', icon: 'fa-home' },
    { id: 2, name: 'Services', icon: 'fa-concierge-bell' },
    { id: 3, name: 'Avis', icon: 'fa-star' },
    
  ];

  return (
    <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
      {navItems.map((item) => (
        <li key={item.id}>
          <a href="#" onClick={closeMenu}>
            <i className={`fas ${item.icon}`}></i> {item.name}
          </a>
        </li>
      ))}
      <li className="mobile-only">
        <a href="#" onClick={closeMenu}>
          <i className="fas fa-sign-in-alt"></i> Connexion
        </a>
      </li>
    </ul>
  );
};

export default Navigation;

