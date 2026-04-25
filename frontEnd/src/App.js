import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// استيراد ملفات التنسيق العامة
import "./index.css"; 
import "./App.css";

// استيراد المكونات الثابتة
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop"; // لحل مشكلة التمرير
import ProtectedRoute from "./Components/ProtectedRoute";
import ToastContainer from "./Components/ToastContainer";

// استيراد الصفحات
import Accueil from "./pages/Accueil";
import Services from "./pages/Services";
import ProviderProfile from "./pages/ProviderProfile"; // صفحة تفاصيل الخدمة
import UserDashboard from "./pages/UserDashboard"; // لوحة تحكم المستخدم
import Provider from "./pages/provider"; // صفحة Provider
import ProviderDashboard from "./pages/ProviderDashboard"; // لوحة تحكم Provider

import Admin from "./pages/Admin"; // صفحة Admin
import AdminLogin from "./pages/AdminLogin"; // صفحة تسجيل دخول Admin
import Avis from "./pages/Avis";
import Connexion from "./pages/Connexion";
import Contact from "./pages/Contact";
import NotFound from "./pages/error"; // صفحة 404
import Reservation from "./pages/Reservation";


function App() {
  return (
    <BrowserRouter>
      {/* ScrollToTop يضمن أن الصفحة تبدأ من الأعلى عند الانتقال */}
      <ScrollToTop />

      {/* الهيدر يظهر في جميع الصفحات */}
      <Header />
      <ToastContainer />

      {/* تحديد المسارات */}
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ProviderProfile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/provider" element={<Provider />} />
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute allowedRoles={["prestataire"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/avis" element={<Avis />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/reservation/:id"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Reservation />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* الفوتر يظهر في جميع الصفحات */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
