import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ServiceCategories.css"; 

// يمكنك استبدال الرموز التعبيرية بأيقونات SVG أو صور لاحقاً لتبدو مثل الـ PPT
const categories = [
  { id: 1, title: "Makeup Artist", icon: "💄" },
  { id: 2, title: "Photographe", icon: "📸" },
  { id: 3, title: "Traiteur", icon: "🍽️" },
  { id: 4, title: "Nekkacha", icon: "🎨" }, // الحناء
  { id: 5, title: "Caftan Rental", icon: "👗" },
  { id: 6, title: "DJ & Music", icon: "🎵" },
  { id: 7, title: "Salles", icon: "🏰" },
];

function ServiceCategories() {
  return (
    <section className="categories-section">
      <div className="section-header">
        <h2>Service Categories Grid</h2>
        <p>Explorez nos services exclusifs pour un mariage de rêve</p>
      </div>

      <div className="grid-container">
        {categories.map((cat) => (
          <Link to="/services" key={cat.id} className="grid-item">
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