import { Link } from "react-router-dom";
import logo from "../Assets/logo/logo.png";
import "../Styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      <span>AARSSI</span>
      </div>

      <nav className="nav">
        <Link to="/">Accueil</Link>
        <Link to="/services">Services</Link>
        <Link to="/avis">Avis</Link>
      </nav>

      <div className="header-right">
        <Link to="/connexion" className="login-btn">
          Connexion
        </Link>
      </div>
    </header>
  );
}

export default Header;
