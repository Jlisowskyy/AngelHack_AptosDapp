'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: number;
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, message: string) => void;
    removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeNotification(id), 5000); // Auto-remove after 5 seconds
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
