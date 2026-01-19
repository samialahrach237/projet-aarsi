import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ServiceCategories.css"; 

// يمكنك استبدال الرموز التعبيرية بأيقونات SVG أو صور لاحقاً لتبدو مثل الـ PPT
import { getAllCategories } from "../data/serviceRepo";

function ServiceCategories() {
  const categoriesList = getAllCategories().filter(cat => cat.id !== 'all');
  
  return (
    <section className="categories-section">
      <div className="section-header">
        <h2>Catégories de services</h2>
        <p>Explorez nos services exclusifs pour un mariage de rêve</p>
      </div>

      <div className="grid-container">
        {categoriesList.map((cat) => (
          <Link to={`/services?service=${cat.id}`} key={cat.id} className="grid-item">
            <div className="icon-circle">
              {cat.icon}
            </div>
            <h3>{cat.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ServiceCategories;