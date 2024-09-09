'use client';
import React, {useEffect} from 'react';
import {useNotification} from '@/components/NotificationContext';
import {setNotificationHandler} from '@/components/NotificationService';

export const NotificationComponent: React.FC = () => {
    const {notifications, removeNotification, addNotification} = useNotification();

    useEffect(() => {
        setNotificationHandler(addNotification);
    }, [addNotification]);

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`mb-2 p-4 rounded-md shadow-md ${
                        notification.type === 'success'
                            ? 'bg-green-500'
                            : notification.type === 'error'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                    } text-white`}
                    onClick={() => removeNotification(notification.id)}
                >
                    <div className="flex justify-between items-center">
                        <span>{notification.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};