import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 
    bg-miami-surface/50 backdrop-blur-sm 
    border border-miami-pink/20 
    rounded-xl 
    text-white placeholder-gray-400 
    focus:outline-none focus:border-miami-pink focus:ring-2 focus:ring-miami-pink/20 
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${error ? 'border-miami-coral focus:border-miami-coral focus:ring-miami-coral/20' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-white font-medium mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <ApperIcon 
            name={icon} 
            size={18} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        )}
        
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <ApperIcon 
            name={icon} 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-miami-coral text-sm flex items-center space-x-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
};

export default Input;