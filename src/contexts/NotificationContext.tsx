'use client';

import React, { createContext, useContext, useState } from 'react';

type Notification = {
  id: string;
  idProcess: number;
  message: string;
  seen: boolean;
};

interface NotificationContextType {
  notifications: Notification[];
  unseenCount: number;
  addNotification: (idProcess: number, message: string) => void;
  markAllAsSeen: () => void;
  removeNotification: (id: string) => void;
  newNotification: boolean;
  setNewNotification: (value: boolean) => void;
  notifiedIds: number[];
  setNotifiedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState<number[]>([]);

  const addNotification = (idProcess: number, message: string) => {
    const newNotif = { id: Date.now().toString(), idProcess, message, seen: false };
    setNotifications([newNotif]);
    setNewNotification(true);
  };

  const markAllAsSeen = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unseenCount = notifications.length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unseenCount,
      addNotification,
      markAllAsSeen,
      removeNotification,
      newNotification,
      setNewNotification,
      notifiedIds,
      setNotifiedIds
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
