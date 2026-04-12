import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Page } from '../../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export default function Header({ currentPage, onNavigate, onOpenAuth }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Browse Skills', page: 'browse' as Page },
    { label: 'How It Works', page: 'home' as Page },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}>
              Mind<span className="text-teal-400">2</span>Mind
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? scrolled ? 'text-teal-600 bg-teal-50' : 'text-teal-300 bg-white/10'
                    : scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-700 text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <span>{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <button
                      onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { signOut(); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                    scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <Button size="sm" onClick={() => onOpenAuth('signup')}>
                  Join Free
                </Button>
              </>
            )}
          </div>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700' : 'text-white'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <Button variant="outline" onClick={() => { signOut(); setMobileOpen(false); }}>
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { onOpenAuth('signin'); setMobileOpen(false); }}>
                  Sign In
                </Button>
                <Button onClick={() => { onOpenAuth('signup'); setMobileOpen(false); }}>
                  Join Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
