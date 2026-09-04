/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  if (!isLoggedIn && currentPage !== 'landing' && currentPage !== 'login') {
    // Force to landing or login if not logged in
    setCurrentPage('landing');
  }

  const handleLaunch = () => {
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <BackgroundOrbs />
      <NetworkVisualizer />
      
      {isLoggedIn && (
        <Navbar 
          onNavigate={(page) => setCurrentPage(page)} 
          currentPage={currentPage}
          onLogout={handleLogout}
        />
      )}

      {/* Special case for Landing page which has its own login button entry */}
      {!isLoggedIn && currentPage === 'landing' && (
        <Navbar 
          onNavigate={(page) => setCurrentPage(isLoggedIn ? page : 'login')} 
          currentPage={currentPage}
        />
      )}

      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!isLoggedIn && currentPage === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <LoginPage onLogin={handleLogin} />
            </motion.div>
          )}

          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <LandingPage onLaunch={handleLaunch} isLoggedIn={isLoggedIn} onNavigate={(page) => setCurrentPage(page)} />
            </motion.div>
          )}
          
          {isLoggedIn && currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <DashboardPage />
            </motion.div>
          )}

          {isLoggedIn && currentPage === 'assets' && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <LogisticsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-4 pointer-events-none z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-on-surface/20 font-bold">
          <div className="flex items-center gap-4 pointer-events-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              RENTENER SECURE
            </span>
            <span className="hidden sm:inline">NODES: 2,401 ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 pointer-events-auto">
            <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
            <span className="hover:text-primary transition-colors cursor-pointer">API</span>
            <span className="hidden sm:inline">© 2026 RENTENER LABS INC.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

