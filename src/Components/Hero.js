import React, { useState } from 'react';

const Hero = () => {
  const [buttonText, setButtonText] = useState('Commencer maintenant');
  const [buttonColor, setButtonColor] = useState('#035824ff');
  
  const handleCtaClick = () => {
    setButtonText('Redirection...');
    setButtonColor('#034e1cff');
    
    setTimeout(() => {
      setButtonText('Commencer maintenant');
      setButtonColor('#d4af37');
      alert("Fonctionnalité de démonstration - En production, cela redirigerait vers la page d'inscription.");
    }, 1000);
  };
  
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AARSSI</h1>
          <p className="hero-subtitle">
            Organisez un mariage marocain de rêve en quelques clics
          </p>
          <button 
            className="cta-button" 
            onClick={handleCtaClick}
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
        </div>
      </section>
    </main>
  );
};

export default Hero;