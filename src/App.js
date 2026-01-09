import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer";
import Accueil from "./pages/Accueil";
import Services from "./pages/Services";
import Avis from "./pages/Avis";
import Connexion from "./pages/Connexion";

function App() {
  return (
    <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/services" element={<Services />} />
        <Route path="/avis" element={<Avis />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
      <Footer />
        </BrowserRouter>
    </>
  );
}

export default App;
