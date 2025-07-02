import React from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  online = false, 
  className = '',
  onClick 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        whileHover={onClick ? { scale: 1.05 } : {}}
        className={`${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br from-miami-pink/20 to-miami-turquoise/20 border-2 border-miami-pink/20 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-miami-pink to-miami-turquoise flex items-center justify-center text-white font-bold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </motion.div>
      
      {online && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${onlineIndicatorSizes[size]} bg-miami-mint border-2 border-miami-background rounded-full animate-pulse`}></div>
      )}
    </div>
  );
};

export default Avatar;