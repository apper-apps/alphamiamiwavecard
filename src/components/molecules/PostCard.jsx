import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes.includes('current-user'));

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.Id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.Id, commentText);
      setCommentText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-miami-pink/10 hover:border-miami-pink/20 transition-all duration-300"
    >
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Avatar 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`}
          alt={post.username}
          size="lg"
          online={post.isOnline}
        />
        <div className="ml-3 flex-1">
          <h3 className="font-bold text-white">{post.displayName}</h3>
          <p className="text-gray-400 text-sm">@{post.username}</p>
        </div>
        <div className="text-gray-400 text-sm">
          {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-miami-pink/10">
        <div className="flex space-x-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isLiked ? 'text-miami-pink' : 'text-gray-400 hover:text-miami-pink'
            }`}
          >
            <ApperIcon name={isLiked ? "Heart" : "Heart"} size={18} className={isLiked ? "fill-current" : ""} />
            <span className="text-sm">{post.likes.length}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-miami-turquoise transition-colors duration-200"
          >
            <ApperIcon name="MessageCircle" size={18} />
            <span className="text-sm">{post.comments.length}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(post.Id)}
            className="flex items-center space-x-2 text-gray-400 hover:text-miami-yellow transition-colors duration-200"
          >
            <ApperIcon name="Share" size={18} />
            <span className="text-sm">Share</span>
          </motion.button>
        </div>

        <Button variant="ghost" size="sm" icon="Bookmark">
          Save
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-miami-pink/10"
        >
          {/* Add Comment */}
          <div className="flex space-x-3 mb-4">
            <Avatar size="sm" alt="You" />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 bg-miami-surface/50 border border-miami-turquoise/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-miami-turquoise"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <Avatar 
                  size="sm" 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                  alt={comment.username} 
                />
                <div className="flex-1">
                  <div className="bg-miami-surface/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-white text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;