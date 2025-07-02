import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/molecules/SearchBar';
import PostCard from '@/components/molecules/PostCard';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { postsService } from '@/services/api/postsService';
import { usersService } from '@/services/api/usersService';

const DiscoverPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [searching, setSearching] = useState(false);

  const loadDiscoverContent = async () => {
    try {
      setLoading(true);
      setError('');
      const [posts, users] = await Promise.all([
        postsService.getAll(),
        usersService.getSuggested(8)
      ]);
      
      // Sort posts by engagement for trending
      const sortedPosts = posts.sort((a, b) => {
        const aEngagement = (a.likes?.length || 0) + (a.comments?.length || 0);
        const bEngagement = (b.likes?.length || 0) + (b.comments?.length || 0);
        return bEngagement - aEngagement;
      });
      
      setTrendingPosts(sortedPosts.slice(0, 10));
      setSuggestedUsers(users);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load discover content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscoverContent();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ posts: [], users: [] });
      return;
    }

    try {
      setSearching(true);
      setSearchQuery(query);
      const [posts, users] = await Promise.all([
        postsService.search(query),
        usersService.search(query)
      ]);
      setSearchResults({ posts, users });
      setActiveTab('search');
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      await usersService.follow(userId);
      setSuggestedUsers(prev => 
        prev.map(user => 
          user.Id === userId 
            ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
            : user
        )
      );
      toast.success('Now following user');
    } catch (err) {
      toast.error('Failed to follow user');
    }
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'people', label: 'People', icon: 'Users' },
    { id: 'hashtags', label: 'Hashtags', icon: 'Hash' },
    { id: 'search', label: 'Search', icon: 'Search' }
  ];

  const trendingHashtags = [
    { tag: '#MiamiVibes', posts: '12.5K', color: 'from-miami-pink to-miami-coral' },
    { tag: '#SouthBeach', posts: '8.2K', color: 'from-miami-turquoise to-miami-blue' },
    { tag: '#ArtDeco', posts: '5.1K', color: 'from-miami-yellow to-miami-orange' },
    { tag: '#NightLife', posts: '4.8K', color: 'from-purple-500 to-pink-500' },
    { tag: '#Photography', posts: '3.9K', color: 'from-green-400 to-blue-500' },
    { tag: '#Fashion', posts: '3.2K', color: 'from-pink-400 to-red-500' }
  ];

  if (loading) return <Loading type="posts" />;
  if (error) return <Error message={error} onRetry={loadDiscoverContent} type="general" />;

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return (
          <div className="space-y-6">
            {trendingPosts.map((post, index) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        );

      case 'people':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedUsers.map((user, index) => (
              <motion.div
                key={user.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-miami-pink/10"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar
                    size="lg"
                    src={user.avatar}
                    alt={user.displayName}
                    online={user.isOnline}
                    onClick={() => navigate(`/app/profile/${user.username}`)}
                    className="cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{user.displayName}</h3>
                    <p className="text-gray-400">@{user.username}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                      <span>{user.followersCount} followers</span>
                      <span>{user.followingCount} following</span>
                    </div>
                  </div>
                </div>
                
                {user.bio && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    icon="MessageCircle"
                    onClick={() => navigate('/app/chats')}
                    className="flex-1"
                  >
                    Message
                  </Button>
                  <Button
                    variant={user.isFollowing ? "secondary" : "primary"}
                    size="sm"
                    icon={user.isFollowing ? "UserCheck" : "UserPlus"}
                    onClick={() => handleFollowUser(user.Id)}
                    className="flex-1"
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'hashtags':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingHashtags.map((hashtag, index) => (
              <motion.div
                key={hashtag.tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${hashtag.color} p-6 rounded-2xl cursor-pointer relative overflow-hidden`}
                onClick={() => handleSearch(hashtag.tag)}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <ApperIcon name="Hash" size={24} className="text-white" />
                    <div className="text-right">
                      <div className="text-white/80 text-sm">Posts</div>
                      <div className="text-white font-bold">{hashtag.posts}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">{hashtag.tag}</h3>
                  <div className="flex items-center text-white/80 text-sm">
                    <ApperIcon name="TrendingUp" size={16} className="mr-1" />
                    Trending
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
              </motion.div>
            ))}
          </div>
        );

      case 'search':
        if (searching) {
          return <Loading type="posts" />;
        }
        
        if (!searchQuery) {
          return (
            <Empty
              type="search"
              message="Enter a search term to find posts, people, and hashtags"
              icon="Search"
            />
          );
        }

        return (
          <div className="space-y-6">
            {searchResults.users.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <ApperIcon name="Users" size={20} className="mr-2" />
                  People ({searchResults.users.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {searchResults.users.slice(0, 4).map((user) => (
                    <div key={user.Id} className="bg-miami-surface/50 backdrop-blur-sm rounded-xl p-4 border border-miami-pink/10">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="md"
                          src={user.avatar}
                          alt={user.displayName}
                          online={user.isOnline}
                          onClick={() => navigate(`/app/profile/${user.username}`)}
                          className="cursor-pointer"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{user.displayName}</h4>
                          <p className="text-gray-400 text-sm">@{user.username}</p>
                        </div>
                        <Button size="sm" variant="tertiary" icon="UserPlus">
                          Follow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.posts.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <ApperIcon name="FileText" size={20} className="mr-2" />
                  Posts ({searchResults.posts.length})
                </h3>
                <div className="space-y-6">
                  {searchResults.posts.map((post) => (
                    <PostCard key={post.Id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {searchResults.posts.length === 0 && searchResults.users.length === 0 && (
              <Empty
                type="search"
                message={`No results found for "${searchQuery}"`}
                actionText="Try a different search term"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div>
          <h1 className="font-righteous text-2xl text-white mb-2">Discover</h1>
          <p className="text-gray-400">Explore trending content and discover new people</p>
        </div>
        
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search posts, people, hashtags..."
          loading={searching}
        />
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-2 border border-miami-pink/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
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

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default DiscoverPage;