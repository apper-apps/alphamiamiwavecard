import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ChatBubble from '@/components/molecules/ChatBubble';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { chatsService } from '@/services/api/chatsService';
import { messagesService } from '@/services/api/messagesService';
import { formatDistanceToNow } from 'date-fns';

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const currentUser = 'current-user';

  const loadChatData = async () => {
    try {
      setLoading(true);
      setError('');
      const [chatData, messagesData] = await Promise.all([
        chatsService.getById(parseInt(chatId)),
        messagesService.getByChatId(parseInt(chatId))
      ]);
      setChat(chatData);
      setMessages(messagesData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatData();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const messageData = {
        chatId: parseInt(chatId),
        content: messageText,
        type: 'text'
      };
      
      const newMsg = await messagesService.create(messageData);
      setMessages(prev => [...prev, newMsg]);
      toast.success('Message sent!');
    } catch (err) {
      toast.error('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Simulate typing indicator
    if (!typing) {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    }
  };

  if (loading) return <Loading type="messages" />;
  if (error) return <Error message={error} onRetry={loadChatData} type="chats" />;
  if (!chat) return <Error message="Chat not found" type="chats" />;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      {/* Chat Header */}
      <div className="bg-miami-surface/80 backdrop-blur-sm border-b border-miami-turquoise/10 p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/app/chats')}
              className="lg:hidden"
            />
            
            <div className="relative">
              {chat.participants.length === 1 ? (
                <Avatar
                  size="lg"
                  src={chat.participants[0].avatar}
                  alt={chat.participants[0].displayName}
                  online={chat.participants[0].isOnline}
                />
              ) : (
                <div className="relative w-12 h-12">
                  <Avatar
                    size="md"
                    src={chat.participants[0]?.avatar}
                    alt={chat.participants[0]?.displayName}
                    className="absolute top-0 left-0 border-2 border-miami-background"
                  />
                  <Avatar
                    size="md"
                    src={chat.participants[1]?.avatar}
                    alt={chat.participants[1]?.displayName}
                    className="absolute bottom-0 right-0 border-2 border-miami-background"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="font-bold text-white">{chat.name}</h2>
              <p className="text-gray-400 text-sm">
                {chat.participants.length} participants
                {chat.participants.some(p => p.isOnline) && (
                  <span className="ml-2 text-miami-mint">• Active now</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Users"
              onClick={() => setShowParticipants(!showParticipants)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="MoreVertical"
            />
          </div>
        </div>
        
        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-miami-turquoise/10"
            >
              <div className="flex flex-wrap gap-3">
                {chat.participants.map((participant) => (
                  <div key={participant.Id} className="flex items-center space-x-2 bg-miami-surface/30 rounded-lg p-2">
                    <Avatar
                      size="sm"
                      src={participant.avatar}
                      alt={participant.displayName}
                      online={participant.isOnline}
                    />
                    <span className="text-white text-sm">{participant.displayName}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-miami-surface/20">
        {messages.length === 0 ? (
          <Empty 
            type="messages"
            message="No messages yet. Start the conversation!"
          />
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUser;
              const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);
              const showTime = index === 0 || 
                new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000; // 5 minutes
              
              return (
                <ChatBubble
                  key={message.Id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  showTime={showTime}
                />
              );
            })}
            
            {/* Typing Indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-gray-400"
              >
                <Avatar size="sm" src={chat.participants[0]?.avatar} />
                <div className="bg-miami-surface/50 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-miami-surface/80 backdrop-blur-sm border-t border-miami-turquoise/10 p-4 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-miami-surface/50 border border-miami-turquoise/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-miami-turquoise focus:ring-2 focus:ring-miami-turquoise/20 transition-all duration-200 max-h-32"
                style={{ minHeight: '44px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              
              {/* Emoji Button */}
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-miami-yellow transition-colors duration-200"
              >
                <ApperIcon name="Smile" size={18} />
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon="Send"
            loading={sending}
            disabled={!newMessage.trim() || sending}
            className="shrink-0"
          />
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{newMessage.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;