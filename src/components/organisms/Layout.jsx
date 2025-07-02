import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/organisms/Header';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Sidebar from '@/components/organisms/Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-background via-miami-surface to-miami-background">
      {/* Header */}
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 h-screen sticky top-16">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-64 z-50"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] pt-4 pb-20 lg:pb-4">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;