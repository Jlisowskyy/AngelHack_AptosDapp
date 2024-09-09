'use client'
import { NotificationType } from '@/components/NotificationContext';

let notificationHandler: ((type: NotificationType, message: string) => void) | null = null;

export const setNotificationHandler = (handler: (type: NotificationType, message: string) => void) => {
    notificationHandler = handler;
};

export const ShowNotification = (type: NotificationType, message: string) => {
    if (notificationHandler) {
        notificationHandler(type, message);
    } else {
        console.warn('Notification handler not set. Call setNotificationHandler first.');
    }
};