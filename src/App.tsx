import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIProvider } from './contexts/AIContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { DiaryPage } from './components/diary/DiaryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LandingPage } from './components/pages/LandingPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <Router>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/diary" element={<DiaryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;