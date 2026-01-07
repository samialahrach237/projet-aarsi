import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">AAR<span>SSI</span></div>
        <p>Votre partenaire pour l'organisation de mariages marocains traditionnels et modernes</p>
        <div className="copyright">
          &copy; {new Date().getFullYear()} AARSSI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;