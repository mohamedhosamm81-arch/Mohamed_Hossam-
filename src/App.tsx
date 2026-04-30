import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import HomePage from './pages/HomePage';
import BrowsePage from './components/browse/BrowsePage';
import ProfilePage from './components/profile/ProfilePage';
import MessagesPage from './components/messages/MessagesPage';
import AuthModal from './components/auth/AuthModal';
import { Page } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({ open: false, mode: 'signup' });

  const handleNavigate = (page: Page, id?: string) => {
    setCurrentPage(page);
    if (id) setProfileId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModal({ open: true, mode });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1 pt-16 pb-20 md:pb-0">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}
        {currentPage === 'browse' && (
          <BrowsePage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            profileId={profileId}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}
        {currentPage === 'messages' && (
          <MessagesPage />
        )}
      </main>

      {(currentPage === 'home') && <Footer onNavigate={handleNavigate} />}

      {currentPage !== 'messages' && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {authModal.open && (
        <AuthModal
          mode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'signup' })}
          onSwitchMode={(mode) => setAuthModal({ open: true, mode })}
        />
      )}
    </div>
  );
}

function ConfigurationWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <h1 className="text-xl font-bold text-yellow-600">Configuration Required</h1>
        </div>
        <p className="text-gray-700 mb-4">
          Supabase environment variables are not configured. Please set the following in your deployment platform:
        </p>
        <ul className="bg-gray-100 p-3 rounded text-sm text-gray-600 mb-4 space-y-2">
          <li><code className="bg-white px-2 py-1 rounded">VITE_SUPABASE_URL</code></li>
          <li><code className="bg-white px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
        </ul>
        <p className="text-xs text-gray-500">
          See .env.example for more details.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return <ConfigurationWarning />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
