import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { notificationsService } from '@/services/api/notificationsService';
import { formatDistanceToNow } from 'date-fns';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [markingAsRead, setMarkingAsRead] = useState(new Set());

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(prev => new Set(prev.add(notificationId)));
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.Id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      toast.error('Failed to mark as read');
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length === 0) {
        toast.info('No unread notifications');
        return;
      }

      await notificationsService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.Id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
        // Navigate to post (would need post ID in notification data)
        navigate('/app');
        break;
      case 'follow':
        navigate(`/app/profile/${notification.username}`);
        break;
      case 'message':
        navigate('/app/chats');
        break;
      default:
        break;
    }
  };

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { id: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
    { id: 'comments', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
    { id: 'follows', label: 'Follows', count: notifications.filter(n => n.type === 'follow').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'likes':
        return notification.type === 'like';
      case 'comments':
        return notification.type === 'comment';
      case 'follows':
        return notification.type === 'follow';
      default:
        return true;
    }
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'Heart', color: 'text-red-500' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-blue-500' };
      case 'follow':
        return { name: 'UserPlus', color: 'text-green-500' };
      case 'message':
        return { name: 'Send', color: 'text-purple-500' };
      default:
        return { name: 'Bell', color: 'text-gray-500' };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <Loading type="posts" />;
  if (error) return <Error message={error} onRetry={loadNotifications} type="general" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-righteous text-2xl text-white mb-2 flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-1 bg-miami-pink text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400">Stay updated with your latest activity</p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="tertiary"
            size="sm"
            icon="CheckCheck"
            onClick={handleMarkAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {filters.map((filterOption) => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
              filter === filterOption.id
                ? 'bg-gradient-to-r from-miami-pink to-miami-turquoise text-white'
                : 'bg-miami-surface/30 text-gray-400 hover:text-white border border-miami-pink/10'
            }`}
          >
            <span>{filterOption.label}</span>
            {filterOption.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                filter === filterOption.id
                  ? 'bg-white/20 text-white'
                  : 'bg-miami-surface/50 text-gray-400'
              }`}>
                {filterOption.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {filteredNotifications.length === 0 ? (
          <Empty
            type="notifications"
            message={
              filter === 'unread'
                ? "No unread notifications"
                : filter !== 'all'
                ? `No ${filter} notifications`
                : "No notifications yet"
            }
            actionText={filter !== 'all' ? "View All" : undefined}
            onAction={filter !== 'all' ? () => setFilter('all') : undefined}
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const icon = getNotificationIcon(notification.type);
                const isMarking = markingAsRead.has(notification.Id);
                
                return (
                  <motion.div
                    key={notification.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-miami-surface/50 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:border-miami-pink/30 ${
                      notification.isRead
                        ? 'border-miami-pink/10'
                        : 'border-miami-pink/20 bg-miami-surface/70'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar
                          size="md"
                          src={notification.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.username}`}
                          alt={notification.username}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          notification.isRead ? 'bg-gray-500' : 'bg-miami-pink'
                        }`}>
                          <ApperIcon name={icon.name} size={12} className="text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                              <span className="font-medium">@{notification.username}</span>
                              {' '}{notification.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.timestamp || notification.CreatedOn), { addSuffix: true })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.Id);
                                }}
                                disabled={isMarking}
                                className="p-2 text-gray-400 hover:text-miami-pink transition-colors disabled:opacity-50"
                                title="Mark as read"
                              >
                                {isMarking ? (
                                  <div className="w-4 h-4 border-2 border-miami-pink border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <ApperIcon name="Check" size={16} />
                                )}
                              </button>
                            )}
                            
                            <div className={`w-2 h-2 rounded-full ${
                              notification.isRead ? 'bg-transparent' : 'bg-miami-pink'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Load More */}
      {filteredNotifications.length > 0 && filteredNotifications.length >= 20 && (
        <div className="flex justify-center pt-6">
          <Button variant="tertiary" icon="RefreshCw">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;