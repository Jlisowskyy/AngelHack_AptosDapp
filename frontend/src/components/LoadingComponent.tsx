import React, {useState, useCallback} from 'react';
import {Loader2} from 'lucide-react';

interface LoadingWrapperProps {
    children: (stopLoading: () => void, startError: () => void) => React.ReactNode;
    text?: string;
    errorText?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({children, text = "", errorText = ""}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const startError = useCallback(() => {
        setIsError(true);
    }, []);

    return (
        <div className="relative min-h-[100px]">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75">
                    {
                        isError ? (
                            <div className={"font-bold text-5xl text-red-600 flex flex-col items-center justify-center"}>
                                <p>{errorText}</p>
                                <p>Try to refresh your window!</p>
                            </div>
                        ) : (
                            <div className={"flex flex-col items-center justify-center"}>
                                <p className="text-blue-500">{text}</p>
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                            </div>
                        )
                    }
                </div>
            )}
            <div className={isLoading ? 'invisible' : 'visible'}>
                {children(stopLoading, startError)}
            </div>
        </div>
    );
};

export default LoadingWrapper;