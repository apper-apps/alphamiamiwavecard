import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'posts' }) => {
  const renderPostSkeleton = () => (
    <div className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-miami-pink/10">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded-full animate-pulse"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded animate-pulse mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded w-3/4 animate-pulse mb-4"></div>
      <div className="h-48 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded-xl animate-pulse mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          <div className="h-8 w-16 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-20 bg-gradient-to-r from-miami-pink/20 to-miami-turquoise/20 rounded animate-pulse"></div>
      </div>
    </div>
  );

  const renderChatSkeleton = () => (
    <div className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-miami-turquoise/10">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-miami-turquoise/20 to-miami-mint/20 rounded-full animate-pulse"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gradient-to-r from-miami-turquoise/20 to-miami-mint/20 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-miami-turquoise/20 to-miami-mint/20 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-miami-turquoise/20 to-miami-mint/20 rounded w-12 animate-pulse"></div>
      </div>
    </div>
  );

  const renderMessageSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="max-w-xs bg-gradient-to-r from-miami-pink/20 to-miami-coral/20 rounded-2xl p-3 animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-1"></div>
          <div className="h-3 bg-white/20 rounded w-16"></div>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-xs bg-gradient-to-r from-miami-turquoise/20 to-miami-mint/20 rounded-2xl p-3 animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-1"></div>
          <div className="h-4 bg-white/20 rounded w-24 mb-1"></div>
          <div className="h-3 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {type === 'posts' && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {renderPostSkeleton()}
            </motion.div>
          ))}
        </div>
      )}
      
      {type === 'chats' && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {renderChatSkeleton()}
            </motion.div>
          ))}
        </div>
      )}
      
      {type === 'messages' && (
        <div className="space-y-4 p-4">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {renderMessageSkeleton()}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Loading;