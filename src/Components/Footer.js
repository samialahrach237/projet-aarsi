import "../Styles/Footer.css";


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-col">
          <h4>AARSSI</h4>
          <p>About Us</p>
          <p>Our Story</p>
          <p>Mission</p>
          <p>Careers</p>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Legal & Support</h4>
          <p>Terms</p>
          <p>Privacy Policy</p>
          <p>Cookie Policy</p>
          <p>Help Center</p>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p className="link">Contact Us</p>
          <p>FAQ</p>
          <p>Partnerships</p>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 AARSSI. Developed with React.js. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
