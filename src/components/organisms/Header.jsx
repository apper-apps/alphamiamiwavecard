import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import NotificationItem from '@/components/molecules/NotificationItem';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '@/App';
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications data
  const notifications = [
    {
      Id: 1,
      type: 'like',
      username: 'sarah_miami',
      message: 'liked your post',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      Id: 2,
      type: 'comment',
      username: 'carlos_beach',
      message: 'commented on your photo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      timestamp: new Date(Date.now() - 600000),
      read: false
    },
    {
      Id: 3,
      type: 'follow',
      username: 'miami_vibes',
      message: 'started following you',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibes',
      timestamp: new Date(Date.now() - 900000),
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-miami-surface/80 backdrop-blur-md border-b border-miami-pink/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-white hover:text-miami-pink transition-colors duration-200"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/app')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-miami-pink to-miami-turquoise rounded-lg flex items-center justify-center">
                <ApperIcon name="Waves" size={20} className="text-white" />
              </div>
              <span className="font-righteous text-xl text-white hidden sm:block">
                MiamiWave
              </span>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ApperIcon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-miami-pink text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-miami-surface/90 backdrop-blur-md border border-miami-pink/20 rounded-2xl shadow-2xl z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <Button size="sm" variant="ghost" className="text-xs">
                          Mark all read
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.Id}
                            notification={notification}
                            onClick={() => setShowNotifications(false)}
                          />
                        ))}
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-miami-pink/10">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-miami-turquoise"
                        >
                          View All Notifications
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create Post Button */}
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={() => navigate('/app/create')}
              className="hidden sm:flex"
            >
              Create
            </Button>

{/* Profile & Logout */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                icon="LogOut"
                onClick={async () => {
                  const { logout } = React.useContext(AuthContext);
                  await logout();
                }}
                className="text-gray-400 hover:text-miami-coral"
                title="Logout"
              />
              
              <Avatar
                size="md"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                alt="Your Profile"
                online={true}
                onClick={() => navigate('/app/profile/currentuser')}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;