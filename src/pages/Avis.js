import "../Styles/Accueil.css"; // نعيد استخدام الأنماط العامة

function Avis() {
  const reviews = [
    { id: 1, name: "Salma & Ahmed", comment: "Un service impeccable ! Merci AARSSI pour l'organisation.", rating: "⭐⭐⭐⭐⭐" },
    { id: 2, name: "Fatima E.", comment: "J'ai trouvé la meilleure Negafa grâce à vous.", rating: "⭐⭐⭐⭐⭐" },
    { id: 3, name: "Karim T.", comment: "Facile à utiliser et très professionnel.", rating: "⭐⭐⭐⭐" },
  ];

  return (
    <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 className="section-title">Ce que disent nos clients</h1>
      <p style={{ color: "#666", marginBottom: "50px" }}>Vos retours sont notre plus grande fierté.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
        {reviews.map((review) => (
          <div key={review.id} style={{ 
            background: "#fff", 
            padding: "30px", 
            borderRadius: "15px", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #eee"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{review.rating}</div>
            <p style={{ fontStyle: "italic", color: "#555", marginBottom: "20px", lineHeight: "1.6" }}>
              "{review.comment}"
            </p>
            <h4 style={{ color: "#c89b3c", fontWeight: "bold" }}>- {review.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Avis;