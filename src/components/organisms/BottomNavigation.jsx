import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: 'Home', label: 'Home', exact: true },
    { path: '/app/search', icon: 'Search', label: 'Search' },
    { path: '/app/create', icon: 'Plus', label: 'Create', isCreate: true },
    { path: '/app/chats', icon: 'MessageCircle', label: 'Chats', badge: 3 },
    { path: '/app/profile/currentuser', icon: 'User', label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-miami-surface/90 backdrop-blur-md border-t border-miami-pink/10 z-40">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-3 min-w-0"
            >
              {({ isActive: navIsActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-xl transition-all duration-200 ${
                      item.isCreate
                        ? 'bg-gradient-to-r from-miami-pink to-miami-coral neon-glow'
                        : isActive
                        ? 'bg-miami-pink/20 text-miami-pink'
                        : 'text-gray-400'
                    }`}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={item.isCreate ? 'text-white' : ''} 
                    />
                    
                    {item.badge && !item.isCreate && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-miami-pink text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                  
                  <span className={`text-xs mt-1 font-medium truncate max-w-full ${
                    item.isCreate
                      ? 'text-miami-pink'
                      : isActive
                      ? 'text-miami-pink'
                      : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                  
                  {isActive && !item.isCreate && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-miami-pink rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;