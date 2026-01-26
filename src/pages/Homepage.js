import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Homepage.css";

function Homepage() {
  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Platform</h1>
          <p className="hero-subtitle">
            Discover a world of possibilities with our professional services
          </p>
        </div>
      </section>

      {/* Two-Column Section */}
      <section className="two-column-section">
        <div className="column-container">
          {/* Left Column */}
          <div className="column left-column">
            <div className="column-image">
              <img 
                src="/images/business-professional.jpg" 
                alt="Business Professional" 
                className="column-img"
              />
            </div>
            <div className="column-content">
              <h2 className="column-title">Professional Services</h2>
              <p className="column-description">
                Our expert team delivers high-quality solutions tailored to your business needs. 
                From consultation to implementation, we ensure excellence at every step.
              </p>
              <Link to="/services" className="column-btn">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="column right-column">
            <div className="column-image">
              <img 
                src="/images/digital-solutions.jpg" 
                alt="Digital Solutions" 
                className="column-img"
              />
            </div>
            <div className="column-content">
              <h2 className="column-title">Digital Innovation</h2>
              <p className="column-description">
                Stay ahead of the curve with our cutting-edge digital solutions. 
                We transform your ideas into reality through innovative technology.
              </p>
              <Link to="/services" className="column-btn">
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of satisfied clients who have transformed their business with us
          </p>
          <div className="cta-buttons">
            <Link to="/services" className="cta-primary-btn">
              View Our Services
            </Link>
            <Link to="/connexion" className="cta-secondary-btn">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;