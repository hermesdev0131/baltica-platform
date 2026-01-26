import { useState, useEffect, useCallback } from 'react';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm format
  streakReminder: boolean;
  encouragement: boolean;
}

export interface AppNotification {
  id: string;
  type: 'reminder' | 'streak' | 'encouragement' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  dailyReminder: true,
  reminderTime: '09:00',
  streakReminder: true,
  encouragement: true,
};

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('appNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('appNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Request browser notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    return permission === 'granted';
  }, []);

  // Send browser push notification
  const sendPushNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permissionStatus === 'granted' && settings.enabled) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }, [permissionStatus, settings.enabled]);

  // Add in-app notification
  const addNotification = useCallback((
    type: AppNotification['type'],
    title: string,
    message: string
  ) => {
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    
    // Also send push notification if enabled
    if (settings.enabled) {
      sendPushNotification(title, { body: message });
    }

    return newNotification;
  }, [settings.enabled, sendPushNotification]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Delete single notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    settings,
    updateSettings,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    requestPermission,
    permissionStatus,
    sendPushNotification,
  };
}
