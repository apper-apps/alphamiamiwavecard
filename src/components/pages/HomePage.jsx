import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '@/components/molecules/PostCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { postsService } from '@/services/api/postsService';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsService.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const updatedPost = await postsService.likePost(postId);
      setPosts(posts.map(post => 
        post.Id === postId ? updatedPost : post
      ));
      toast.success('Post liked!');
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const updatedPost = await postsService.addComment(postId, content);
      setPosts(posts.map(post => 
        post.Id === postId ? updatedPost : post
      ));
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/app/post/${postId}`);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <Loading type="posts" />;
  if (error) return <Error message={error} onRetry={loadPosts} type="posts" />;
  if (posts.length === 0) return <Empty type="posts" onAction={() => navigate('/app/create')} />;

  return (
    <div className="space-y-6">
      {/* Stories Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-miami-turquoise/10"
      >
        <h2 className="font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-miami-yellow to-miami-coral rounded-full flex items-center justify-center">
            <span className="text-white text-sm">📸</span>
          </div>
          <span>Stories</span>
        </h2>
        
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {/* Add Your Story */}
          <div className="flex-shrink-0 flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-miami-pink/20 to-miami-turquoise/20 rounded-full flex items-center justify-center border-2 border-dashed border-miami-pink/40 cursor-pointer hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">+</span>
            </div>
            <span className="text-xs text-gray-400">Your Story</span>
          </div>
          
          {/* Sample Stories */}
          {['sarah_miami', 'carlos_beach', 'sunset_lover', 'art_deco'].map((username, index) => (
            <div key={username} className="flex-shrink-0 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-miami-pink to-miami-turquoise p-0.5 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-400 truncate max-w-16">{username}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-8"
      >
        <button className="px-8 py-3 bg-miami-surface/50 backdrop-blur-sm border border-miami-pink/20 rounded-xl text-white hover:bg-miami-surface/70 transition-all duration-200">
          Load More Posts
        </button>
      </motion.div>
    </div>
  );
};

export default HomePage;