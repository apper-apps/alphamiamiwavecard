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
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-miami-pink to-miami-coral rounded-full flex items-center justify-center mx-auto neon-glow">
          <span className="text-white text-4xl font-bold">M</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome to MiamiWave</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Your mobile app experience starts here. Navigate using the tabs below to explore different sections.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 w-full max-w-sm"
      >
        <div className="bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-miami-turquoise/10">
          <div className="w-12 h-12 bg-gradient-to-r from-miami-turquoise to-miami-blue rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">🏠</span>
          </div>
          <h3 className="text-white font-semibold">Home</h3>
          <p className="text-gray-400 text-sm">Main dashboard</p>
        </div>
        
        <div className="bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-miami-turquoise/10">
          <div className="w-12 h-12 bg-gradient-to-r from-miami-pink to-miami-coral rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">🔔</span>
          </div>
          <h3 className="text-white font-semibold">Notifications</h3>
          <p className="text-gray-400 text-sm">Stay updated</p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;