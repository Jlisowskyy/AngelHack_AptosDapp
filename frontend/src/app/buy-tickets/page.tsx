'use client';

import React, {useEffect} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventMocks} from "@/mocks/EventMocks";
import {EventInterface} from "@/interface/EventInterface";

const AsyncContent: React.FC<{ onLoad: () => void }> = ({onLoad}) => {
    useEffect(() => {
        // Simulate an asynchronous operation
        const timer = setTimeout(() => {
            onLoad();
        }, 1500); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [onLoad]);

    const onClick = (data: EventInterface) => {
        console.log(data);
    }

    return (
        <EventListComponent data={EventMocks} buttonText={"Buy ticket"} click={onClick}/>
    );
};

export default function Page() {
    return (
        <LoadingComponent text={"Loading events ..."}>
            {(stopLoading) => (
                <AsyncContent onLoad={stopLoading}/>
            )}
        </LoadingComponent>
    );
}