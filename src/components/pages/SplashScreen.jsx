import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-background via-miami-surface to-miami-background flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #FF6B9D20 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #4ECDC420 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #FFE66D20 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #FF6B9D20 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.5, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          onAnimationComplete={() => setAnimationComplete(true)}
          className="relative mb-8"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-miami-pink/30 rounded-full absolute inset-0"
          />
          
          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-2 border-miami-turquoise/50 rounded-full absolute inset-4"
          />
          
          {/* Logo Background */}
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px #FF6B9D40',
                '0 0 40px #4ECDC440',
                '0 0 60px #FFE66D40',
                '0 0 20px #FF6B9D40'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-br from-miami-pink via-miami-turquoise to-miami-yellow rounded-2xl flex items-center justify-center relative z-10 m-6"
          >
            <ApperIcon name="Waves" size={32} className="text-white" />
          </motion.div>
        </motion.div>

        {/* App Name Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{ 
              textShadow: [
                '0 0 20px #FF6B9D80',
                '0 0 30px #4ECDC480',
                '0 0 40px #FFE66D80',
                '0 0 20px #FF6B9D80'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="font-righteous text-5xl md:text-6xl text-white mb-2"
          >
            MiamiWave
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-gray-300 text-lg"
          >
            Connect & Chat with Miami Vibes
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          {/* Loading Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  backgroundColor: [
                    '#FF6B9D',
                    '#4ECDC4',
                    '#FFE66D',
                    '#FF6B9D'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className="w-3 h-3 rounded-full"
              />
            ))}
          </div>
          
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm"
          >
            Loading your vibe...
          </motion.p>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: 0 
              }}
              animate={{
                y: [null, -20, 0, -20],
                scale: [0, 1, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className={`absolute w-4 h-4 rounded-full ${
                i % 3 === 0 ? 'bg-miami-pink/30' : 
                i % 3 === 1 ? 'bg-miami-turquoise/30' : 'bg-miami-yellow/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Wave Animation */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-miami-pink/10 to-transparent"
        style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 0 80%)'
        }}
      />
    </div>
  );
};

export default SplashScreen;