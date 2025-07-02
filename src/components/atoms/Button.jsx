import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-miami-pink to-miami-coral text-white hover:scale-105 neon-glow",
    secondary: "bg-gradient-to-r from-miami-turquoise to-miami-mint text-white hover:scale-105",
    tertiary: "bg-miami-surface/80 backdrop-blur-sm text-white border border-miami-pink/20 hover:border-miami-pink/40 hover:bg-miami-surface",
    outline: "border-2 border-miami-pink text-miami-pink hover:bg-miami-pink hover:text-white",
    ghost: "text-miami-pink hover:bg-miami-pink/10",
    yellow: "bg-gradient-to-r from-miami-yellow to-miami-coral text-miami-background hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={18} className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} size={18} />
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} size={18} />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;