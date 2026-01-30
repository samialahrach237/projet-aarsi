import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  MdDashboard, MdPeople, MdStore, MdEvent, MdStar, 
  MdPayments, MdMessage, MdSettings, MdContentPaste,
  MdFileDownload, MdFilterList, MdTrendingUp, MdTrendingDown, MdLogout
} from 'react-icons/md';
import providerService from "../services/providerService";
import "../Styles/Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [providers, setProviders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProvider, setViewingProvider] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);
  
  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/admin-login");
    } else {
      setCheckingAuth(false);
      loadProviders();
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    city: "",
    phone: "",
    status: "pending"
  });

  const loadProviders = () => {
    const allProviders = providerService.getAllProviders();
    setProviders(allProviders);
  };

  // Mock data for charts and stats
  const stats = {
    totalServices: 124,
    totalCategories: 8,
    citiesCovered: 12,
    providers: {
      total: providers.length,
      pending: providers.filter(p => p.status === "pending").length,
      approved: providers.filter(p => p.status === "approved").length,
      rejected: providers.filter(p => p.status === "rejected").length,
    },
    clients: {
      total: 1450,
      newThisMonth: 85
    },
    revenue: {
      total: 45200,
      monthly: 12400,
      growth: 12.5
    },
    subscriptions: {
      subscribed: 45,
      notSubscribed: 12
    },
    reservations: {
      total: 320,
      confirmed: 245,
      pending: 45,
      cancelled: 30
    }
  };

  const chartData = {
    servicesPerCategory: [
      { name: 'Negafa', value: 30 },
      { name: 'Traiteur', value: 25 },
      { name: 'Photo', value: 20 },
      { name: 'Salles', value: 15 },
      { name: 'Orchestre', value: 10 },
      { name: 'Maquillage', value: 14 },
    ],
    subscriptionPlans: [
      { name: 'Basic', value: 60, color: '#999' },
      { name: 'Premium', value: 40, color: '#D4AF37' },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 8000 },
      { month: 'Feb', revenue: 9500 },
      { month: 'Mar', revenue: 11000 },
      { month: 'Apr', revenue: 10500 },
      { month: 'May', revenue: 12400 },
      { month: 'Jun', revenue: 13500 },
    ]
  };

  const handleStatusChange = (id, newStatus) => {
    providerService.updateProviderStatus(id, newStatus);
    loadProviders();
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce prestataire ?")) {
      providerService.deleteProvider(id);
      loadProviders();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    navigate("/");
  };

  if (checkingAuth) {
    return (
      <div className="auth-loading-overlay">
        <div className="luxury-spinner"></div>
        <p>Vérification de l'accès...</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch(status) {
      case "approved": return "status-approved";
      case "rejected": return "status-rejected";
      default: return "status-pending";
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (editingProvider) {
      providerService.updateProvider(editingProvider.id, formData);
    } else {
      providerService.createProvider({
        ...formData,
        country: "Morocco"
      });
    }
    
    loadProviders();
    setShowModal(false);
    setEditingProvider(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    setEditingProvider(null);
    setFormData({
      name: "",
      email: "",
      service: "",
      city: "",
      phone: "",
      status: "pending"
    });
    setShowModal(true);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      email: provider.email,
      service: provider.service,
      city: provider.city,
      phone: provider.phone,
      status: provider.status
    });
    setShowModal(true);
  };

  const renderDashboard = () => (
    <div className="dashboard-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green"><MdStore /></div>
          <div className="stat-info">
            <h3>{stats.totalServices}</h3>
            <p>Total Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><MdContentPaste /></div>
          <div className="stat-info">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><MdDashboard /></div>
          <div className="stat-info">
            <h3>{stats.citiesCovered}</h3>
            <p>Cities Covered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><MdPeople /></div>
          <div className="stat-info">
            <h3>{stats.providers.total}</h3>
            <p>Total Providers</p>
            <div className="status-mini-grid">
              <span className="text-pending">{stats.providers.pending} P</span>
              <span className="text-approved">{stats.providers.approved} A</span>
              <span className="text-rejected">{stats.providers.rejected} R</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><MdPeople /></div>
          <div className="stat-info">
            <h3>{stats.clients.total}</h3>
            <p>Total Clients</p>
            <span className="growth-text">+{stats.clients.newThisMonth} this month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="revenue-section card-box">
          <div className="card-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="revenue-grid">
            <div className="revenue-main-card">
              <p>Total Revenue</p>
              <h2>{stats.revenue.total.toLocaleString()} MAD</h2>
            </div>
            <div className="revenue-monthly-card">
              <p>Monthly Revenue</p>
              <h3>{stats.revenue.monthly.toLocaleString()} MAD</h3>
              <span className="growth-indicator positive">
                <MdTrendingUp /> {stats.revenue.growth}%
              </span>
            </div>
          </div>
        </div>

        <div className="res-section">
          <div className="res-card card-box">
            <h3>Reservations</h3>
            <div className="res-grid">
              <div className="res-item"><span>Total</span> <strong>{stats.reservations.total}</strong></div>
              <div className="res-item"><span>Confirmed</span> <strong className="text-approved">{stats.reservations.confirmed}</strong></div>
              <div className="res-item"><span>Pending</span> <strong className="text-pending">{stats.reservations.pending}</strong></div>
              <div className="res-item"><span>Cancelled</span> <strong className="text-rejected">{stats.reservations.cancelled}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box card-box">
          <h3>Services per Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.servicesPerCategory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#005A31" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box card-box">
          <h3>Subscription Plans</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.subscriptionPlans}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.subscriptionPlans.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box card-box full-width">
          <h3>Monthly Revenue Evolution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="providers-view">
      <div className="admin-actions-bar">
        <div className="filter-group">
          <label><MdFilterList /> Filter Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="export-buttons">
          <button className="btn-export"><MdFileDownload /> PDF</button>
          <button className="btn-export"><MdFileDownload /> Excel</button>
        </div>
      </div>

      <div className="table-container">
        <table className="providers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Service</th>
              <th>Images</th>
              <th>Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers
              .filter(p => filterStatus === "all" ? true : p.status === filterStatus)
              .map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td className="provider-name">{p.name}</td>
                <td>{p.service}</td>
                <td>
                  <div className="table-images-preview">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt="p" className="table-thumb" />
                    ) : "N/A"}
                  </div>
                </td>
                <td>
                  <button className="btn-view-profile" onClick={() => { setViewingProvider(p); setShowViewModal(true); }}>Voir Profile</button>
                </td>
                <td className="action-buttons">
                  <button className="btn-approve" onClick={() => handleStatusChange(p.id, "approved")}>Accept</button>
                  <button className="btn-edit" onClick={() => handleEdit(p)}>Update</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delet</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>AAR<span>SSI</span></h2>
         
        </div>
        <nav className="sidebar-nav">
          <button className={currentView === "dashboard" ? "active" : ""} onClick={() => setCurrentView("dashboard")}>
            <MdDashboard /> Dashboard
          </button>
          <button className={currentView === "providers" ? "active" : ""} onClick={() => setCurrentView("providers")}>
            <MdStore /> Prestataires
          </button>
          <button className={currentView === "clients" ? "active" : ""} onClick={() => setCurrentView("clients")}><MdPeople /> Clients</button>
          <button className={currentView === "services" ? "active" : ""} onClick={() => setCurrentView("services")}><MdContentPaste /> Services</button>
          <button className={currentView === "reservations" ? "active" : ""} onClick={() => setCurrentView("reservations")}><MdEvent /> Reservations</button>
          <button className={currentView === "reviews" ? "active" : ""} onClick={() => setCurrentView("reviews")}><MdStar /> Reviews</button>
          <button className={currentView === "payments" ? "active" : ""} onClick={() => setCurrentView("payments")}><MdPayments /> Payments</button>
          <button className={currentView === "messages" ? "active" : ""} onClick={() => setCurrentView("messages")}><MdMessage /> Messages</button>
          <button className={currentView === "cms" ? "active" : ""} onClick={() => setCurrentView("cms")}><MdContentPaste /> CMS</button>
          <button className={currentView === "settings" ? "active" : ""} onClick={() => setCurrentView("settings")}><MdSettings /> Settings</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>AARSSI Admin Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-filters">
              <select>
                <option>All Cities</option>
                <option>Fes</option>
                <option>Meknes</option>
                <option>Casablanca</option>
                <option>Agadir</option>
                <option>Marrakech</option>
              </select>
              <select>
                <option>All Categories</option>
                <option>Negafa</option>
                <option>Traiteur</option>
                <option>Photographe</option>
                <option>Taifar</option>
              </select>
              <input type="date" />
              <button className="header-logout" onClick={handleLogout}>
                <MdLogout /> Déconnexion
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content-area">
          <div className="admin-view-header">
            {currentView === "providers" && (
              <button className="btn-create" onClick={handleCreate}>
                ➕ Nouveau Prestataire
              </button>
            )}
          </div>
          {currentView === "dashboard" ? renderDashboard() : 
           currentView === "providers" ? renderProviders() :
           (
             <div className="generic-view">
               <h2>{currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</h2>
               <p>Cette section est en cours de développement.</p>
             </div>
           )}
        </div>
      </main>

      {showViewModal && viewingProvider && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails: {viewingProvider.name}</h2>
              <button onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="view-profile-body">
               <div className="profile-info-grid">
                  <div className="info-item"><label>Email:</label><span>{viewingProvider.email}</span></div>
                  <div className="info-item"><label>Service:</label><span>{viewingProvider.service}</span></div>
                  <div className="info-item"><label>Ville:</label><span>{viewingProvider.city}</span></div>
                  <div className="info-item"><label>Phone:</label><span>{viewingProvider.phone}</span></div>
               </div>
               <div className="gallery-preview">
                 {viewingProvider.images?.map((img, i) => <img key={i} src={img} alt="s" className="gallery-img" />)}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProvider ? "Modifier Prestataire" : "Nouveau Prestataire"}</h2>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Service</label>
                  <select name="service" value={formData.service} onChange={handleInputChange} required>
                    <option value="">Sélectionnez</option>
                    <option value="Negafa">Negafa</option>
                    <option value="Traiteur">Traiteur</option>
                    <option value="Photographe">Photographe</option>
                    <option value="Salles">Salles</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-save">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;