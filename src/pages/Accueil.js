/* src/pages/Accueil.js */
import SearchBar from "../Components/SearchBar";
import hero from "../Assets/images/hero.jpg"; // تأكد من وجود صورة خلفية مناسبة
import "../Styles/Accueil.css";
import ServiceCategories from "../Components/ServiceCategories"; // سننشئ هذا المكون الجديد

function Accueil() {
  return (
    <div className="home-wrapper">
      {/* Hero Section - Matching Slide 3 */}
      <div className="hero-container">
        <div className="hero-bg" style={{ backgroundImage: `url(${hero})` }}></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <h2 className="brand-subtitle">AARSSI</h2>
          <h1 className="hero-slogan">Rir b click, un mariage magique</h1>
          
          <div className="search-wrapper">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Service Categories Grid - Matching Slide 4 */}
      <ServiceCategories />
      
    </div>
  );
}

export default Accueil;