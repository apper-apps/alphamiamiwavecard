import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Connection Error',
          subtitle: 'Check your internet connection and try again'
        };
      case 'posts':
        return {
          icon: 'AlertCircle',
          title: 'Failed to Load Posts',
          subtitle: 'Unable to fetch your feed right now'
        };
      case 'chats':
        return {
          icon: 'MessageCircle',
          title: 'Chat Error',
          subtitle: 'Unable to load your conversations'
        };
      case 'messages':
        return {
          icon: 'Send',
          title: 'Message Failed',
          subtitle: 'Your message could not be delivered'
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Oops!',
          subtitle: 'Something unexpected happened'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-miami-pink/20 to-miami-coral/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-miami-pink/20">
          <ApperIcon 
            name={config.icon} 
            size={32} 
            className="text-miami-pink animate-pulse" 
          />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-miami-coral rounded-full animate-bounce"></div>
      </div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold text-white mb-2 font-righteous"
      >
        {config.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-300 mb-2 max-w-sm"
      >
        {config.subtitle}
      </motion.p>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-sm mb-6"
      >
        {message}
      </motion.p>
      
      {onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-miami-pink to-miami-coral text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 neon-glow flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xs text-gray-500"
      >
        If this persists, check your connection or contact support
      </motion.div>
    </motion.div>
  );
};

export default Error;