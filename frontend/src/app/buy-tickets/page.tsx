'use client';

import React, {useEffect} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventMocks} from "@/mocks/EventMocks";

const AsyncContent: React.FC<{ onLoad: () => void }> = ({onLoad}) => {
    useEffect(() => {
        // Simulate an asynchronous operation
        const timer = setTimeout(() => {
            onLoad();
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [onLoad]);

    return (
        <EventListComponent data={EventMocks}/>
    );
};

export default function Page() {
    return (
        <LoadingComponent text={"Loading events from the blockchain ..."}>
            {(stopLoading) => (
                <AsyncContent onLoad={stopLoading}/>
            )}
        </LoadingComponent>
    );
}