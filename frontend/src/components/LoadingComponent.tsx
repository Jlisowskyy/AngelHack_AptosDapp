import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
    children: (stopLoading: () => void) => React.ReactNode;
    text?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children, text = "" }) => {
    const [isLoading, setIsLoading] = useState(true);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="relative min-h-[100px]">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75">
                    <p className="text-blue-500">{text}</p>
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            )}
            <div className={isLoading ? 'invisible' : 'visible'}>
                {children(stopLoading)}
            </div>
        </div>
    );
};

export default LoadingWrapper;