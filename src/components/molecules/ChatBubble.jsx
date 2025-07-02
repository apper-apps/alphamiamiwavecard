import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';

const ChatBubble = ({ message, isOwn = false, showAvatar = true, showTime = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {showAvatar && !isOwn && (
          <Avatar 
            size="sm"
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderUsername}`}
            alt={message.senderUsername}
          />
        )}
        
        <div className={`group ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg ${
              isOwn
                ? 'chat-bubble-sender text-white rounded-br-md'
                : 'chat-bubble-receiver text-white rounded-bl-md'
            }`}
          >
            {!isOwn && showAvatar && (
              <p className="text-xs font-semibold mb-1 opacity-80">
                {message.senderUsername}
              </p>
            )}
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          
          {showTime && (
            <div className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;