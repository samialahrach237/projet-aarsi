import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// استيراد المكونات الثابتة
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop"; // لحل مشكلة التمرير

// استيراد الصفحات
import Accueil from "./pages/Accueil";
import Services from "./pages/Services";
import ProviderProfile from "./pages/ProviderProfile"; // صفحة تفاصيل الخدمة
import UserDashboard from "./pages/UserDashboard"; // لوحة تحكم المستخدم
import Avis from "./pages/Avis";
import Connexion from "./pages/Connexion";

// استيراد ملفات التنسيق العامة
import "./index.css"; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* ScrollToTop يضمن أن الصفحة تبدأ من الأعلى عند الانتقال */}
      <ScrollToTop />
      
      {/* الهيدر يظهر في جميع الصفحات */}
      <Header />
      
      {/* تحديد المسارات (Routes) */}
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/services" element={<Services />} />
        
        {/* مسار ديناميكي لصفحة تفاصيل الخدمة (يقبل ID) */}
        <Route path="/service/:id" element={<ProviderProfile />} />
        
        {/* مسار لوحة تحكم المستخدم */}
        <Route path="/dashboard" element={<UserDashboard />} />
        
        <Route path="/avis" element={<Avis />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>

      {/* الفوتر يظهر في جميع الصفحات */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;