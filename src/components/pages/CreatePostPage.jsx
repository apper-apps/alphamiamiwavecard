import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postsService } from '@/services/api/postsService';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        content: content.trim(),
        imageUrl: imagePreview // In a real app, you'd upload the image first
      };
      
      await postsService.create(postData);
      toast.success('Post created successfully!');
      navigate('/app');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emojiOptions = ['😀', '😍', '🔥', '🌊', '🌴', '☀️', '🏖️', '🎉', '💖', '✨'];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-miami-pink/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-righteous text-2xl text-white">Create Post</h1>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => navigate('/app')}
          />
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 mb-6">
          <Avatar
            size="lg"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
            alt="Your Profile"
          />
          <div>
            <h3 className="font-bold text-white">Your Profile</h3>
            <p className="text-gray-400 text-sm">@currentuser</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in Miami?"
              className="w-full h-32 p-4 bg-miami-surface/30 border border-miami-turquoise/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-miami-turquoise focus:ring-2 focus:ring-miami-turquoise/20 transition-all duration-200"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">
                {content.length}/280 characters
              </span>
              <div className={`text-sm ${content.length > 250 ? 'text-miami-coral' : 'text-gray-400'}`}>
                {280 - content.length} remaining
              </div>
            </div>
          </div>

          {/* Emoji Picker */}
          <div>
            <p className="text-white text-sm mb-3">Add some vibes:</p>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setContent(content + emoji)}
                  className="w-10 h-10 bg-miami-surface/30 hover:bg-miami-surface/50 rounded-lg flex items-center justify-center text-lg transition-all duration-200"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2 px-4 py-2 bg-miami-turquoise/20 hover:bg-miami-turquoise/30 rounded-xl cursor-pointer transition-all duration-200">
                <ApperIcon name="Image" size={18} className="text-miami-turquoise" />
                <span className="text-miami-turquoise font-medium">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={removeImage}
                  className="text-miami-coral hover:bg-miami-coral/10"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-miami-pink/10">
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <ApperIcon name="MapPin" size={16} />
                <span className="text-sm">Miami, FL</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Globe" size={16} />
                <span className="text-sm">Public</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="tertiary"
                onClick={() => navigate('/app')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={!content.trim() && !image}
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-miami-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-miami-yellow/10"
      >
        <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
          <ApperIcon name="Lightbulb" size={20} className="text-miami-yellow" />
          <span>Tips for great posts</span>
        </h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-miami-pink">•</span>
            <span>Add emojis and hashtags to increase engagement</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-miami-turquoise">•</span>
            <span>Share high-quality images that capture Miami vibes</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-miami-yellow">•</span>
            <span>Ask questions to encourage comments and discussions</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default CreatePostPage;