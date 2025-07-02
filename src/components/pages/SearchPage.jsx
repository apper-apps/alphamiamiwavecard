import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import PostCard from '@/components/molecules/PostCard';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { postsService } from '@/services/api/postsService';
import { usersService } from '@/services/api/usersService';

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'all', label: 'All', icon: 'Grid3x3' },
    { id: 'posts', label: 'Posts', icon: 'FileText' },
    { id: 'people', label: 'People', icon: 'Users' },
    { id: 'tags', label: 'Tags', icon: 'Hash' }
  ];

  const trendingTags = [
    { tag: '#MiamiVibes', posts: '12.5K', color: 'from-miami-pink to-miami-coral' },
    { tag: '#SouthBeach', posts: '8.2K', color: 'from-miami-turquoise to-miami-mint' },
    { tag: '#ArtDeco', posts: '5.1K', color: 'from-miami-yellow to-miami-coral' },
    { tag: '#SunsetPics', posts: '15.3K', color: 'from-miami-purple to-miami-turquoise' },
    { tag: '#BeachLife', posts: '22.1K', color: 'from-miami-mint to-miami-yellow' }
  ];

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      loadTrendingContent();
    }
  }, [searchQuery, activeTab]);

  const loadTrendingContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'all' || activeTab === 'posts') {
        const postsData = await postsService.getAll();
        setPosts(postsData.slice(0, 6));
      }
      if (activeTab === 'all' || activeTab === 'people') {
        const usersData = await usersService.getAll();
        setUsers(usersData.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to load trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      if (activeTab === 'all' || activeTab === 'posts') {
        const postsData = await postsService.search(searchQuery);
        setPosts(postsData);
      }
      if (activeTab === 'all' || activeTab === 'people') {
        const usersData = await usersService.search(searchQuery);
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <Loading type="posts" />;

    if (!searchQuery) {
      return (
        <div className="space-y-8">
          {/* Trending Tags */}
          <div>
            <h2 className="font-bold text-white text-xl mb-6 flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={24} className="text-miami-pink" />
              <span>Trending Tags</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTags.map((item, index) => (
                <motion.div
                  key={item.tag}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-r ${item.color} p-6 rounded-2xl cursor-pointer group`}
                >
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-2">{item.tag}</h3>
                    <p className="text-white/80 text-sm">{item.posts} posts</p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ApperIcon name="ArrowRight" size={20} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested People */}
          {(activeTab === 'all' || activeTab === 'people') && (
            <div>
              <h2 className="font-bold text-white text-xl mb-6 flex items-center space-x-2">
                <ApperIcon name="UserPlus" size={24} className="text-miami-turquoise" />
                <span>People to Follow</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.Id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-miami-turquoise/10 hover:border-miami-turquoise/30 transition-all duration-200"
                  >
                    <Avatar
                      size="xl"
                      src={user.avatar}
                      alt={user.displayName}
                      className="mx-auto mb-4"
                    />
                    <h3 className="font-bold text-white mb-1">{user.displayName}</h3>
                    <p className="text-gray-400 text-sm mb-4">@{user.username}</p>
                    <Button size="sm" variant="secondary" className="w-full">
                      Follow
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <div>
              <h2 className="font-bold text-white text-xl mb-6 flex items-center space-x-2">
                <ApperIcon name="Clock" size={24} className="text-miami-yellow" />
                <span>Recent Posts</span>
              </h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.Id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Search Results
    if (posts.length === 0 && users.length === 0) {
      return <Empty type="search" message={`No results found for "${searchQuery}"`} />;
    }

    return (
      <div className="space-y-8">
        {/* Search Results for Posts */}
        {posts.length > 0 && (activeTab === 'all' || activeTab === 'posts') && (
          <div>
            <h2 className="font-bold text-white text-lg mb-4">
              Posts ({posts.length})
            </h2>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.Id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Search Results for Users */}
        {users.length > 0 && (activeTab === 'all' || activeTab === 'people') && (
          <div>
            <h2 className="font-bold text-white text-lg mb-4">
              People ({users.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <motion.div
                  key={user.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-miami-pink/10"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar size="lg" src={user.avatar} alt={user.displayName} />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{user.displayName}</h3>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{user.bio}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-400">
                      <span>{user.followersCount} followers</span>
                      <span>{user.followingCount} following</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Search for posts, people, or tags..."
        className="sticky top-0 z-10"
      />

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-miami-pink to-miami-coral text-white'
                : 'bg-miami-surface/50 text-gray-400 hover:text-white hover:bg-miami-surface/70'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default SearchPage;