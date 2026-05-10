import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { getStoredUser, logoutUser } from "../services/authService";

function UserAccountLayout({ activeTab, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("auth:changed", syncUser);

    return () => {
      window.removeEventListener("auth:changed", syncUser);
    };
  }, []);

  const userSummary = useMemo(
    () => ({
      name: user?.name || "Utilisateur AARSSI",
      city: user?.city || user?.client?.address || "Casablanca",
    }),
    [user]
  );

  const menuItems = [
    { id: "reservations", label: "Mes reservations", icon: <FaCalendarAlt />, path: "/user-dashboard" },
    { id: "avis", label: "Mes avis", icon: <FaHistory />, path: "/mes-avis" },
    { id: "profile", label: "Profil", icon: <FaUser />, path: "/profile" },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/connexion");
  };

  const navigateTo = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }

    setIsDrawerOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {isDrawerOpen && <div className="drawer-backdrop active" onMouseDown={() => setIsDrawerOpen(false)}></div>}

      <aside className={`sidebar ${isDrawerOpen ? "open" : ""}`}>
        <div className="sidebar-header"></div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button className="nav-item logout-btn-inline" onClick={handleLogout}>
                <span className="nav-icon">
                  <FaSignOutAlt />
                </span>
                <span className="nav-label">Deconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="user-header">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsDrawerOpen((current) => !current)}
            aria-label="Ouvrir le menu"
          >
            <FaBars size={24} />
          </button>

          <div className="user-info">
            <h2 className="user-name">{userSummary.name}</h2>
            <p className="user-city">{userSummary.city}</p>
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>

      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-mobile ${activeTab === item.id ? "active" : ""}`}
            onClick={() => navigateTo(item.path)}
          >
            <span className="nav-icon-mobile">{item.icon}</span>
            <span className="nav-label-mobile">{item.label}</span>
          </button>
        ))}
        <button className="nav-item-mobile logout-btn-mobile" onClick={handleLogout}>
          <span className="nav-icon-mobile">
            <FaSignOutAlt />
          </span>
          <span className="nav-label-mobile">Deconnexion</span>
        </button>
      </nav>
    </div>
  );
}

export default UserAccountLayout;
