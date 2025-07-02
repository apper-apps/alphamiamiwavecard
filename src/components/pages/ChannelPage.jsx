import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { channelsService } from '@/services/api/channelsService';

const ChannelPage = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [trendingChannels, setTrendingChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError('');
      const [allChannels, trending] = await Promise.all([
        channelsService.getAll(),
        channelsService.getTrending()
      ]);
      setChannels(allChannels);
      setTrendingChannels(trending);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) {
      toast.error('Channel name is required');
      return;
    }

    try {
      setCreating(true);
      const newChannel = await channelsService.create({
        channelName: newChannelName.trim(),
        description: newChannelDescription.trim()
      });
      
      setChannels(prev => [newChannel, ...prev]);
      setNewChannelName('');
      setNewChannelDescription('');
      setShowCreateModal(false);
      toast.success('Channel created successfully');
    } catch (err) {
      toast.error('Failed to create channel');
    } finally {
      setCreating(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Channels', icon: 'Hash' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'joined', label: 'Joined', icon: 'Users' }
  ];

  const filteredChannels = activeTab === 'trending' 
    ? trendingChannels 
    : activeTab === 'joined' 
    ? channels.filter(channel => channel.isJoined)
    : channels;

  if (loading) return <Loading type="posts" />;
  if (error) return <Error message={error} onRetry={loadChannels} type="general" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-righteous text-2xl text-white mb-2">Channels</h1>
          <p className="text-gray-400">Discover and join communities</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
        >
          Create Channel
        </Button>
      </motion.div>

      {/* Trending Highlights */}
      {trendingChannels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-miami-pink/10"
        >
          <h2 className="font-bold text-white mb-4 flex items-center">
            <ApperIcon name="TrendingUp" size={20} className="mr-2 text-miami-pink" />
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingChannels.slice(0, 3).map((channel, index) => (
              <motion.div
                key={channel.Id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-miami-pink/10 to-miami-turquoise/10 rounded-xl p-4 border border-miami-pink/20"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-miami-pink to-miami-turquoise rounded-lg flex items-center justify-center">
                    <ApperIcon name="Hash" size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">#{channel.channelName}</h3>
                    <p className="text-xs text-gray-400">{channel.memberCount || 0} members</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{channel.description}</p>
                <Button size="sm" variant="tertiary" className="w-full">
                  Join Channel
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-2 border border-miami-pink/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-miami-pink to-miami-turquoise text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Channels List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredChannels.length === 0 ? (
          <Empty
            type="channels"
            message={
              activeTab === 'joined' 
                ? "You haven't joined any channels yet" 
                : "No channels found"
            }
            actionText="Browse Channels"
            onAction={() => setActiveTab('all')}
          />
        ) : (
          <div className="space-y-4">
            {filteredChannels.map((channel, index) => (
              <motion.div
                key={channel.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-miami-pink/10 hover:border-miami-pink/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-miami-pink to-miami-turquoise rounded-xl flex items-center justify-center">
                      <ApperIcon name="Hash" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">#{channel.channelName}</h3>
                      <p className="text-gray-400 mb-2">{channel.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Users" size={14} />
                          <span>{channel.memberCount || 0} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageSquare" size={14} />
                          <span>{channel.messageCount || 0} messages</span>
                        </div>
                        {channel.isActive && (
                          <div className="flex items-center space-x-1 text-miami-turquoise">
                            <div className="w-2 h-2 bg-miami-turquoise rounded-full animate-pulse"></div>
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="tertiary"
                      size="sm"
                      icon="Eye"
                    >
                      View
                    </Button>
                    <Button
                      variant={channel.isJoined ? "secondary" : "primary"}
                      size="sm"
                      icon={channel.isJoined ? "Check" : "Plus"}
                    >
                      {channel.isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-miami-surface/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-miami-pink/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-white">Create Channel</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Name
                </label>
                <Input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Enter channel name"
                  className="w-full"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="Describe your channel"
                  className="w-full px-4 py-3 bg-miami-surface/50 border border-miami-pink/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-miami-pink/50 transition-colors resize-none"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={creating}
                  className="flex-1"
                >
                  Create Channel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ChannelPage;