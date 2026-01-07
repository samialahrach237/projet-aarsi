import React, { useState } from 'react';
import Header from './Components/Header';
import Hero from './Components/Hero';
import Footer from './Components/Footer';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  return (
    <div className="app">
      <Header 
        menuOpen={menuOpen} 
        toggleMenu={toggleMenu} 
        closeMenu={closeMenu}
      />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;
