import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { PolicyProvider } from '@/context/PolicyContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { PublicRoute } from '@/components/shared/PublicRoute';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import WorkerDashboard from '@/pages/WorkerDashboard';
import WorkerClaims from '@/pages/WorkerClaims';
import AdminDashboard from '@/pages/AdminDashboard';
import PolicyPage from '@/pages/PolicyPage';
import ClaimsPage from '@/pages/ClaimsPage';
import RenewalConfirmation from '@/pages/RenewalConfirmation';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-6xl font-serif font-bold italic text-primary">404</h1>
      <p className="text-secondary font-medium uppercase tracking-[0.2em] text-[10px]">Page Not Found</p>
      <a href="/" className="inline-block mt-8 text-primary font-bold border-b border-primary hover:pb-1 transition-all">Return Home</a>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PolicyProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-background font-sans antialiased text-foreground">
              <main className="flex-1 flex flex-col">
                <Routes>
                  {/* Landing Page is Public */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Public Only Routes */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                  </Route>

                  {/* Worker Routes */}
                  <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']} />}>
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    <Route path="claims" element={<WorkerClaims />} />
                    <Route path="policy/:id" element={<PolicyPage />} />
                    <Route path="policy" element={<PolicyPage />} />
                    <Route path="renew" element={<RenewalConfirmation />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster position="top-right" />
          </Router>
        </PolicyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
