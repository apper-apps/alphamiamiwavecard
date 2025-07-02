import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ type = "general", onAction, actionText, message }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'posts':
        return {
          icon: 'ImagePlus',
          title: 'No Posts Yet',
          subtitle: 'Be the first to share something amazing!',
          actionText: 'Create Post',
          gradient: 'from-miami-pink to-miami-yellow'
        };
      case 'chats':
        return {
          icon: 'MessageCircle',
          title: 'No Conversations',
          subtitle: 'Start chatting with friends and create memories',
          actionText: 'Start Chatting',
          gradient: 'from-miami-turquoise to-miami-mint'
        };
      case 'messages':
        return {
          icon: 'Send',
          title: 'No Messages Yet',
          subtitle: 'Send your first message to get the conversation started',
          actionText: 'Send Message',
          gradient: 'from-miami-purple to-miami-turquoise'
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No Results Found',
          subtitle: 'Try different keywords or browse trending content',
          actionText: 'Explore Trending',
          gradient: 'from-miami-yellow to-miami-coral'
        };
      case 'followers':
        return {
          icon: 'Users',
          title: 'No Followers Yet',
          subtitle: 'Share great content to attract followers',
          actionText: 'Create Content',
          gradient: 'from-miami-mint to-miami-turquoise'
        };
      default:
        return {
          icon: 'Sparkles',
          title: 'Nothing Here Yet',
          subtitle: 'Start exploring and creating content',
          actionText: 'Get Started',
          gradient: 'from-miami-pink to-miami-turquoise'
        };
    }
  };

  const config = getEmptyConfig();
  const finalMessage = message || config.subtitle;
  const finalActionText = actionText || config.actionText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div className={`w-24 h-24 bg-gradient-to-br ${config.gradient} opacity-20 rounded-full animate-pulse absolute inset-0`}></div>
        <div className="w-24 h-24 bg-miami-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-miami-pink/20 relative z-10">
          <ApperIcon 
            name={config.icon} 
            size={36} 
            className="text-miami-pink animate-float" 
          />
        </div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-miami-yellow rounded-full animate-ping"></div>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white mb-3 font-righteous"
      >
        {config.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-300 mb-8 max-w-md leading-relaxed"
      >
        {finalMessage}
      </motion.p>
      
      {onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-r ${config.gradient} text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 neon-glow flex items-center space-x-3`}
        >
          <ApperIcon name={config.icon} size={20} />
          <span>{finalActionText}</span>
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex space-x-6 text-gray-500"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-miami-pink rounded-full animate-pulse"></div>
          <span className="text-xs">Connect</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-miami-turquoise rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <span className="text-xs">Share</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-miami-yellow rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <span className="text-xs">Discover</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Empty;