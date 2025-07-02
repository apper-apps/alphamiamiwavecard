import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/app', icon: 'Home', label: 'Home', exact: true },
    { path: '/app/search', icon: 'Search', label: 'Explore' },
    { path: '/app/chats', icon: 'MessageCircle', label: 'Messages', badge: 3 },
    { path: '/app/profile/currentuser', icon: 'User', label: 'Profile' }
  ];

  const trendingTopics = [
    { tag: '#MiamiVibes', posts: '12.5K' },
    { tag: '#SouthBeach', posts: '8.2K' },
    { tag: '#ArtDeco', posts: '5.1K' },
    { tag: '#SunsetPics', posts: '15.3K' },
    { tag: '#BeachLife', posts: '22.1K' }
  ];

  const suggestedUsers = [
    { username: 'miami_sunset', name: 'Miami Sunset', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunset' },
    { username: 'beachvibes23', name: 'Beach Vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beach' },
    { username: 'artdeco_lover', name: 'Art Deco Fan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artdeco' }
  ];

  return (
    <div className="h-full bg-miami-surface/50 backdrop-blur-sm border-r border-miami-pink/10 p-6 overflow-y-auto scrollbar-hide">
      {/* Profile Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-miami-pink/10 to-miami-turquoise/10 rounded-2xl">
          <Avatar
            size="lg"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
            alt="Your Profile"
            online={true}
          />
          <div className="flex-1">
            <h3 className="font-bold text-white">Your Profile</h3>
            <p className="text-gray-400 text-sm">@currentuser</p>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 px-4">
          <div className="text-center">
            <div className="font-bold text-white">128</div>
            <div className="text-gray-400 text-xs">Following</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">1.2K</div>
            <div className="text-gray-400 text-xs">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">89</div>
            <div className="text-gray-400 text-xs">Posts</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 text-white border border-miami-pink/30'
                      : 'text-gray-400 hover:text-white hover:bg-miami-surface/50'
                  }`}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-miami-pink text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Trending Topics */}
      <div className="mb-8">
        <h3 className="font-bold text-white mb-4 px-4">Trending</h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-3 rounded-xl hover:bg-miami-surface/30 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-miami-turquoise font-semibold">{topic.tag}</span>
                <span className="text-gray-400 text-sm">{topic.posts}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <h3 className="font-bold text-white mb-4 px-4">Suggested</h3>
        <div className="space-y-3">
          {suggestedUsers.map((user, index) => (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-miami-surface/30 cursor-pointer transition-all duration-200"
            >
              <Avatar size="md" src={user.avatar} alt={user.name} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">@{user.username}</p>
              </div>
              <button className="text-miami-turquoise hover:text-white text-sm font-semibold">
                Follow
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;