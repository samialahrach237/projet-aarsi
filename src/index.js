import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Header from './Components/Header';
import reportWebVitals from './reportWebVitals';
import Footer from './Components/Footer';
import Hero from './Components/Hero';
import Navigation from './Components/Navigation';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      
        <Header/>
        <Hero/>
      <Footer/>
     
  </React.StrictMode>
);


reportWebVitals();
