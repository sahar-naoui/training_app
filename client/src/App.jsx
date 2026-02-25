import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/ChatbotButton';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages publiques
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import FormationDetail from './pages/FormationDetail';
import Demos from './pages/Demos';
import Contact from './pages/Contact';

// Pages admin
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFormations from './pages/admin/Formations';
import AdminFormationForm from './pages/admin/FormationForm';
import AdminDemandes from './pages/admin/Demandes';
import AdminDemandeDetail from './pages/admin/DemandeDetail';
import AdminInscriptions from './pages/admin/Inscriptions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ChatbotButton />
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogue" element={<Catalogue />} />
                    <Route path="/formation/:slug" element={<FormationDetail />} />
                    <Route path="/demos" element={<Demos />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Login admin (sans layout admin) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Routes admin protégées */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="formations" element={<AdminFormations />} />
            <Route path="formations/new" element={<AdminFormationForm />} />
            <Route path="formations/:id/edit" element={<AdminFormationForm />} />
            <Route path="demandes" element={<AdminDemandes />} />
            <Route path="demandes/:id" element={<AdminDemandeDetail />} />
            <Route path="inscriptions" element={<AdminInscriptions />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
