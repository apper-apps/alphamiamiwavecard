import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      animate={{ scale: isFocused ? 1.02 : 1 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-12 pr-12 py-4 bg-miami-surface/50 backdrop-blur-sm border border-miami-pink/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-miami-pink focus:ring-2 focus:ring-miami-pink/20 transition-all duration-200"
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ApperIcon name="X" size={18} />
          </motion.button>
        )}
      </div>
      
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-miami-surface/90 backdrop-blur-sm border border-miami-pink/20 rounded-xl p-4 z-50"
        >
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={14} />
              <span>Trending</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={14} />
              <span>People</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Hash" size={14} />
              <span>Tags</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;