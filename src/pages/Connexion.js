function Connexion() {
  return (
    <div style={{ padding: "60px", maxWidth: "400px", margin: "auto" }}>
      <h2>Connexion</h2>

      <input
        type="email"
        placeholder="Email"
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />

      <button
        style={{
          width: "100%",
          padding: "10px",
          background: "#c89b3c",
          color: "white",
          border: "none",
        }}
      >
        Se connecter
      </button>
    </div>
  );
}

export default Connexion;
