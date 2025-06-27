import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import FixSupabasePage from './pages/FixSupabasePage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Despre Noi Page
const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Despre Nexar</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Nexar este cel mai premium marketplace pentru motociclete din România, dedicat pasionaților de două roți care caută excelența în fiecare detaliu.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misiunea Noastră</h2>
            <p className="text-gray-700 mb-6">
              Conectăm vânzătorii și cumpărătorii de motociclete într-un mediu sigur, transparent și profesional. Oferim o platformă unde calitatea și încrederea sunt prioritățile noastre principale.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">De Ce Nexar?</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Verificarea manuală a fiecărui anunț pentru siguranța maximă</li>
              <li>Sistem de rating și recenzii pentru transparență completă</li>
              <li>Interfață intuitivă și experiență de utilizare superioară</li>
              <li>Suport dedicat pentru toți utilizatorii noștri</li>
              <li>Comunitate activă de peste 15,000 de pasionați</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Echipa Noastră</h2>
            <p className="text-gray-700 mb-6">
              Suntem o echipă de profesioniști pasionați de motociclete, cu experiență vastă în domeniul automotive și tehnologic. Înțelegem nevoile comunității și lucrăm constant pentru a oferi cea mai bună experiență.
            </p>
            
            <div className="bg-nexar-accent/10 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contactează-ne</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea</p>
                <p><strong>Telefon:</strong> 0790 454 647</p>
                <p><strong>Email:</strong> contact@nexar.ro</p>
                <p><strong>Program:</strong> Luni - Vineri: 09:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informații de Contact</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Adresă</h3>
                  <p className="text-gray-700">Bulevardul Dem Radulescu 24, Râmnicu Vâlcea</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Telefon</h3>
                  <p className="text-gray-700">0790 454 647</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-700">contact@nexar.ro</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Program</h3>
                  <div className="text-gray-700">
                    <p>Luni - Vineri: 09:00 - 17:00</p>
                    <p>Weekend: Închis</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trimite-ne un Mesaj</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nume</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                  <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"></textarea>
                </div>
                <button type="submit" className="w-full bg-nexar-accent text-white py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors">
                  Trimite Mesaj
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-nexar-light flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anunturi" element={<ListingsPage />} />
            <Route path="/anunt/:id" element={<ListingDetailPage />} />
            <Route path="/adauga-anunt" element={<CreateListingPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/profil/:id" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/despre" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/termeni" element={<TermsPage />} />
            <Route path="/confidentialitate" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/fix-supabase" element={<FixSupabasePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;