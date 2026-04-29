import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
