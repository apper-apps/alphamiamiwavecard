import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const NotificationItem = ({ notification, onClick }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { icon: 'Heart', color: 'text-miami-pink' };
      case 'comment':
        return { icon: 'MessageCircle', color: 'text-miami-turquoise' };
      case 'follow':
        return { icon: 'UserPlus', color: 'text-miami-mint' };
      case 'message':
        return { icon: 'Mail', color: 'text-miami-yellow' };
      default:
        return { icon: 'Bell', color: 'text-gray-400' };
    }
  };

  const iconConfig = getNotificationIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        notification.read 
          ? 'bg-miami-surface/30 hover:bg-miami-surface/50' 
          : 'bg-miami-surface/50 hover:bg-miami-surface/70 border border-miami-pink/20'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar 
            size="md"
            src={notification.avatar}
            alt={notification.username}
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-miami-surface rounded-full flex items-center justify-center border border-miami-background`}>
            <ApperIcon name={iconConfig.icon} size={10} className={iconConfig.color} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm">
            <span className="font-semibold">{notification.username}</span>
            <span className="text-gray-300 ml-1">{notification.message}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </p>
        </div>
        
        {!notification.read && (
          <div className="w-2 h-2 bg-miami-pink rounded-full animate-pulse"></div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;