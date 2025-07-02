import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { chatsService } from '@/services/api/chatsService';
import { formatDistanceToNow } from 'date-fns';

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await chatsService.getAll();
      setChats(data);
      setFilteredChats(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  const handleChatClick = (chatId) => {
    navigate(`/app/chats/${chatId}`);
  };

  const getUnreadCount = (chat) => {
    return chat.messages?.filter(msg => 
      !msg.readBy.includes('current-user') && msg.senderId !== 'current-user'
    ).length || 0;
  };

  if (loading) return <Loading type="chats" />;
  if (error) return <Error message={error} onRetry={loadChats} type="chats" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-righteous text-2xl text-white mb-2">Messages</h1>
          <p className="text-gray-400">Stay connected with your Miami crew</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon="Plus"
          onClick={() => setShowNewChatModal(true)}
        >
          New Chat
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Search conversations..."
      />

      {/* Chats List */}
      {filteredChats.length === 0 ? (
        <Empty 
          type="chats" 
          message={searchQuery ? `No chats found for "${searchQuery}"` : "No conversations yet"}
          onAction={() => setShowNewChatModal(true)}
          actionText="Start New Chat"
        />
      ) : (
        <div className="space-y-3">
          {filteredChats.map((chat, index) => {
            const unreadCount = getUnreadCount(chat);
            const isOnline = chat.participants.some(p => p.isOnline);
            
            return (
              <motion.div
                key={chat.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleChatClick(chat.Id)}
                className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-4 border border-miami-turquoise/10 hover:border-miami-turquoise/30 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  {/* Chat Avatar */}
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

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-white truncate">
                        {chat.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {chat.lastMessage && (
                          <span className="text-gray-400 text-xs">
                            {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                          </span>
                        )}
                        {unreadCount > 0 && (
                          <span className="bg-miami-pink text-white text-xs px-2 py-1 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {chat.lastMessage ? (
                          <>
                            <span className="font-medium">
                              {chat.lastMessage.senderUsername}:
                            </span>
                            {' '}
                            {chat.lastMessage.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                      
                      <div className="flex items-center space-x-2 ml-2">
                        {isOnline && (
                          <div className="w-2 h-2 bg-miami-mint rounded-full animate-pulse"></div>
                        )}
                        <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Active Status */}
      <div className="bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-miami-mint/10">
        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-miami-mint rounded-full animate-pulse"></div>
          <span>Active Now</span>
        </h3>
        
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {['sarah_miami', 'carlos_beach', 'sunset_lover', 'art_deco', 'beach_vibes'].map((username, index) => (
            <div key={username} className="flex-shrink-0 flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar
                  size="lg"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                  alt={username}
                  online={true}
                />
              </div>
              <span className="text-xs text-gray-400 truncate max-w-16">{username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;