import SearchBar from "../Components/SearchBar";
import hero from "../Assets/images/hero.jpg";
import "../Styles/Accueil.css";

function Accueil() {
  return (
    <div className="hero-container">
      <div className="hero-background" style={{ backgroundImage: `url(${hero})` }}></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <SearchBar />
      </div>
    </div>
  );
}

export default Accueil;
