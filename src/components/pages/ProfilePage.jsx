import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import PostCard from '@/components/molecules/PostCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { usersService } from '@/services/api/usersService';
import { postsService } from '@/services/api/postsService';

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  
  const isOwnProfile = username === 'currentuser';

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      const [userData, userPosts] = await Promise.all([
        usersService.getByUsername(username),
        postsService.getByUserId(username)
      ]);
      setUser(userData);
      setPosts(userPosts);
      setIsFollowing(userData.isFollowing || false);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [username]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await usersService.unfollow(user.Id);
        setIsFollowing(false);
        setUser(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
        toast.success('Unfollowed successfully');
      } else {
        await usersService.follow(user.Id);
        setIsFollowing(true);
        setUser(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
        toast.success('Following now');
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'Grid3x3', count: posts.length },
    { id: 'media', label: 'Media', icon: 'Image', count: posts.filter(p => p.imageUrl).length },
    { id: 'likes', label: 'Likes', icon: 'Heart', count: posts.reduce((sum, p) => sum + p.likes.length, 0) }
  ];

  if (loading) return <Loading type="posts" />;
  if (error) return <Error message={error} onRetry={loadProfileData} type="general" />;
  if (!user) return <Error message="User not found" type="general" />;

  const filteredPosts = activeTab === 'media' 
    ? posts.filter(post => post.imageUrl)
    : posts;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-miami-pink/10"
      >
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-miami-pink via-miami-turquoise to-miami-yellow relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 right-4">
            {isOwnProfile && (
              <Button variant="tertiary" size="sm" icon="Camera">
                Edit Cover
              </Button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-20 lg:-mt-16">
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  size="2xl"
                  src={user.avatar}
                  alt={user.displayName}
                  online={user.isOnline}
                  className="border-4 border-miami-background"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-miami-pink hover:bg-miami-coral rounded-full flex items-center justify-center text-white transition-colors duration-200">
                    <ApperIcon name="Camera" size={16} />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <div>
                  <h1 className="font-righteous text-2xl text-white">{user.displayName}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
                
                {user.bio && (
                  <p className="text-gray-300 max-w-md">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="MapPin" size={14} />
                    <span>Miami, FL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" size={14} />
                    <span>Joined March 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4 lg:mt-0">
              {isOwnProfile ? (
                <>
                  <Button variant="tertiary" size="sm" icon="Settings">
                    Edit Profile
                  </Button>
                  <Button variant="primary" size="sm" icon="Share">
                    Share
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="tertiary" size="sm" icon="MessageCircle">
                    Message
                  </Button>
                  <Button
                    variant={isFollowing ? "tertiary" : "primary"}
                    size="sm"
                    icon={isFollowing ? "UserCheck" : "UserPlus"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-8 mt-6 pt-6 border-t border-miami-pink/10">
            <div className="text-center">
              <div className="font-bold text-xl text-white">{posts.length}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-white">{user.followersCount}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-white">{user.followingCount}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-white">
                {posts.reduce((sum, p) => sum + p.likes.length, 0)}
              </div>
              <div className="text-gray-400 text-sm">Likes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
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
            <span className="bg-miami-surface/50 text-xs px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {filteredPosts.length === 0 ? (
          <Empty
            type="posts"
            message={
              activeTab === 'media' 
                ? "No media posts yet" 
                : `${isOwnProfile ? 'You haven\'t' : user.displayName + ' hasn\'t'} posted anything yet`
            }
            actionText={isOwnProfile ? "Create Post" : undefined}
          />
        ) : (
          <div className="space-y-6">
            {activeTab === 'media' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Heart" size={16} />
                          <span>{post.likes.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" size={16} />
                          <span>{post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;