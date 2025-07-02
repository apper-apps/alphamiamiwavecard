import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import * as settingsService from '@/services/api/settingsService';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [logo, setLogo] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settingsData = await settingsService.getAll();
        
        if (settingsData && settingsData.length > 0) {
          const appSettings = settingsData[0];
          setSettings(appSettings);
          setLogo(appSettings.logo_url);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Animation theme detection
  const getAnimationTheme = () => {
    if (!settings?.animation_settings) return 'default';
    
    const animationSettings = settings.animation_settings.toLowerCase();
    if (animationSettings.includes('ranting') || animationSettings.includes('rant')) {
      return 'ranting';
    }
    if (animationSettings.includes('super') && animationSettings.includes('power')) {
      return 'super-powers';
    }
    return 'default';
  };

  const animationTheme = getAnimationTheme();

  // Theme-specific animations
  const getThemeAnimations = () => {
    switch (animationTheme) {
      case 'ranting':
        return {
          logoScale: { scale: [1, 1.3, 1.1, 1.4, 1], rotate: [0, 5, -5, 8, 0] },
          logoShadow: [
            '0 0 20px #FF6B9D60, 0 0 40px #FF6B9D40',
            '0 0 40px #FF6B9D80, 0 0 60px #FF6B9D60',
            '0 0 60px #FF6B9D90, 0 0 80px #FF6B9D70',
            '0 0 20px #FF6B9D60, 0 0 40px #FF6B9D40'
          ],
          textShadow: [
            '0 0 30px #FF6B9D90, 0 0 60px #FF6B9D60',
            '0 0 50px #FF6B9D80, 0 0 80px #4ECDC480',
            '0 0 70px #FFE66D80, 0 0 100px #FF6B9D70',
            '0 0 30px #FF6B9D90, 0 0 60px #FF6B9D60'
          ],
          duration: 2
        };
      case 'super-powers':
        return {
          logoScale: { scale: [1, 1.2, 1.5, 1.2, 1], rotate: [0, 90, 180, 270, 360] },
          logoShadow: [
            '0 0 30px #4ECDC480, 0 0 60px #4ECDC440',
            '0 0 50px #FFE66D80, 0 0 80px #FFE66D60',
            '0 0 70px #FF6B9D80, 0 0 100px #FF6B9D60',
            '0 0 30px #4ECDC480, 0 0 60px #4ECDC440'
          ],
          textShadow: [
            '0 0 25px #4ECDC480, 0 0 50px #4ECDC460',
            '0 0 35px #FFE66D80, 0 0 70px #FFE66D60',
            '0 0 45px #FF6B9D80, 0 0 90px #FF6B9D60',
            '0 0 25px #4ECDC480, 0 0 50px #4ECDC460'
          ],
          duration: 3
        };
      default:
        return {
          logoScale: { scale: 1, rotate: 0 },
          logoShadow: [
            '0 0 20px #FF6B9D40',
            '0 0 40px #4ECDC440',
            '0 0 60px #FFE66D40',
            '0 0 20px #FF6B9D40'
          ],
          textShadow: [
            '0 0 20px #FF6B9D80',
            '0 0 30px #4ECDC480',
            '0 0 40px #FFE66D80',
            '0 0 20px #FF6B9D80'
          ],
          duration: 4
        };
    }
  };

  const themeAnimations = getThemeAnimations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-background via-miami-surface to-miami-background flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Animation based on theme */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: animationTheme === 'ranting' ? [
              'radial-gradient(circle at 20% 80%, #FF6B9D30 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #FF6B9D40 0%, transparent 60%)',
              'radial-gradient(circle at 40% 40%, #FF6B9D35 0%, transparent 55%)',
              'radial-gradient(circle at 20% 80%, #FF6B9D30 0%, transparent 50%)'
            ] : animationTheme === 'super-powers' ? [
              'radial-gradient(circle at 20% 80%, #4ECDC430 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #FFE66D30 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #FF6B9D30 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #4ECDC430 0%, transparent 50%)'
            ] : [
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

      {/* Ranting Theme Speech Bubbles */}
      {animationTheme === 'ranting' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`speech-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 1.2, 0],
                opacity: [0, 1, 1, 0],
                x: [0, (i % 2 === 0 ? 20 : -20), 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className={`absolute ${
                i === 0 ? 'top-20 left-20' :
                i === 1 ? 'top-32 right-20' :
                i === 2 ? 'bottom-32 left-32' : 'bottom-20 right-32'
              } w-16 h-12 bg-miami-pink/20 rounded-full border-2 border-miami-pink/40`}
            />
          ))}
        </div>
      )}

      {/* Super Powers Energy Rings */}
      {animationTheme === 'super-powers' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`energy-${i}`}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 4, 6],
                opacity: [1, 0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7
              }}
              className="absolute border-2 border-miami-turquoise/30 rounded-full"
              style={{
                width: '200px',
                height: '200px'
              }}
            />
          ))}
        </div>
      )}

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
          
          {/* Logo Background with Theme-based Animation */}
          <motion.div
            animate={{ 
              boxShadow: themeAnimations.logoShadow,
              ...themeAnimations.logoScale
            }}
            transition={{ duration: themeAnimations.duration, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-br from-miami-pink via-miami-turquoise to-miami-yellow rounded-2xl flex items-center justify-center relative z-10 m-6"
          >
            {/* Dynamic Logo or Fallback Icon */}
            {logo && !loading ? (
              <motion.img
                src={logo}
                alt="App Logo"
                className="w-12 h-12 object-contain"
                onError={() => setLogo(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <ApperIcon name="Waves" size={32} className="text-white" />
            )}
          </motion.div>

          {/* Power Burst Effect for Super Powers Theme */}
          {animationTheme === 'super-powers' && animationComplete && (
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              className="absolute inset-0 border-4 border-miami-yellow/50 rounded-full"
            />
          )}
        </motion.div>

        {/* App Name Animation with Theme Effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{ 
              textShadow: themeAnimations.textShadow
            }}
            transition={{ duration: themeAnimations.duration, repeat: Infinity }}
            className={`font-righteous text-5xl md:text-6xl text-white mb-2 ${
              animationTheme === 'ranting' ? 'animate-pulse' : ''
            }`}
          >
            MiamiWave
          </motion.h1>
          
          {/* Ranting Theme Intensity Indicator */}
          {animationTheme === 'ranting' && (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-miami-pink text-2xl font-bold"
            >
              !!!
            </motion.div>
          )}
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-gray-300 text-lg"
          >
            {animationTheme === 'ranting' 
              ? 'Express Yourself with Power!' 
              : animationTheme === 'super-powers' 
              ? 'Unleash Your Miami Super Powers!' 
              : 'Connect & Chat with Miami Vibes'
            }
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
                  scale: animationTheme === 'ranting' ? [1, 1.5, 1] : [1, 1.2, 1],
                  backgroundColor: [
                    '#FF6B9D',
                    '#4ECDC4',
                    '#FFE66D',
                    '#FF6B9D'
                  ]
                }}
                transition={{
                  duration: animationTheme === 'ranting' ? 1 : 1.5,
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
            {animationTheme === 'ranting' 
              ? 'Charging your rant power...' 
              : animationTheme === 'super-powers' 
              ? 'Activating super powers...' 
              : 'Loading your vibe...'
            }
          </motion.p>
        </motion.div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                scale: 0 
              }}
              animate={{
                y: [null, -20, 0, -20],
                scale: animationTheme === 'ranting' ? [0, 1.5, 1, 0] : [0, 1, 1, 0],
                rotate: animationTheme === 'super-powers' ? [0, 360, 720] : [0, 180, 360]
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
          y: animationTheme === 'ranting' ? [0, -15, 5, -10, 0] : [0, -10, 0],
        }}
        transition={{ 
          duration: animationTheme === 'ranting' ? 2 : 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-miami-pink/10 to-transparent"
        style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 0 80%)'
        }}
      />
    </div>
  );
};

export default SplashScreen;