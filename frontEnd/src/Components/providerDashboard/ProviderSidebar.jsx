import {
  MdCalendarMonth,
  MdCreditCard,
  MdHelpOutline,
  MdImage,
  MdInsights,
  MdLogout,
  MdMessage,
  MdReviews,
  MdSettings,
  MdStorefront,
  MdAssignment,
} from "react-icons/md";

const menuItems = [
  { id: "overview", label: "Vue d'ensemble", icon: <MdInsights /> },
  { id: "services", label: "Services", icon: <MdStorefront /> },
  { id: "reservations", label: "Reservations", icon: <MdAssignment /> },
  { id: "calendar", label: "Calendrier", icon: <MdCalendarMonth /> },
  { id: "photos", label: "Photos", icon: <MdImage /> },
  { id: "avis", label: "Avis", icon: <MdReviews /> },
  { id: "messages", label: "Messages", icon: <MdMessage /> },
  { id: "payments", label: "Paiements", icon: <MdCreditCard /> },
  { id: "settings", label: "Parametres", icon: <MdSettings /> },
];

function ProviderSidebar({ activeTab, isOpen, onChangeTab, onClose, onLogout }) {
  return (
    <aside className={`provider-modern-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="provider-sidebar-brand">AAR<span>SSI</span></div>

      <nav className="provider-sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`provider-sidebar-link ${activeTab === item.id ? "is-active" : ""}`}
            onClick={() => {
              onChangeTab(item.id);
              onClose();
            }}
            type="button"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="provider-sidebar-footer">
        <button className="provider-sidebar-link provider-logout-link" onClick={onLogout} type="button">
          <MdLogout />
          <span>Deconnexion</span>
        </button>

        <div className="provider-support-card">
          <MdHelpOutline />
          <strong>Besoin d'aide ?</strong>
          <p>Notre equipe est la pour vous accompagner.</p>
          <button type="button">Contacter le support</button>
        </div>
      </div>
    </aside>
  );
}

export default ProviderSidebar;
