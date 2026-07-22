import React, { Component, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import MagneticRadarCursor from './components/MagneticRadarCursor';
import Background3D from './components/Background3D';
import { useAuth } from './context/AuthContext';
import './index.css';
import './i18n';

// Lazy loading pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const IntegrationPage = lazy(() => import('./pages/IntegrationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  // const { user, isAuthLoading } = useAuth();
  // if (isAuthLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  // return user ? children : <Navigate to="/login" />;
  
  // Temporary bypass for login
  return children;
};

// Error Boundary untuk menangkap crash (layar putih)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#12121a', minHeight: '100vh', color: 'white' }}>
          <h1 style={{ color: 'var(--danger)' }}>Aplikasi Mengalami Crash</h1>
          <p>Mohon bagikan pesan error di bawah ini kepada AI untuk diperbaiki:</p>
          <pre style={{ background: '#000', padding: '20px', overflowX: 'auto', color: 'red' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ background: '#000', padding: '20px', overflowX: 'auto', color: 'gray', marginTop: '10px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button className="btn btn-primary" onClick={() => window.location.href='/'} style={{ marginTop: '20px' }}>
            Kembali ke Beranda
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { i18n } = useTranslation();

  // Dynamic language attribute for SEO and Accessibility
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="app-container">
        <Background3D />
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/scan" element={<PrivateRoute><ScanPage /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
              <Route path="/integrations" element={<PrivateRoute><IntegrationPage /></PrivateRoute>} />
              
              {/* 404 Catch-all Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#12121a',
              color: '#f0f0f5',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
            }
          }}
        />
        <MagneticRadarCursor />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
