'use client';
import React from 'react';
import { useNotification } from '@/components/NotificationContext'

export const NotificationComponent: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50">
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
                >
                    <div className="flex justify-between items-center">
                        <span>{notification.message}</span>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};