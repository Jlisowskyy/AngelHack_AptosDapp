'use client';

import React, {useEffect} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventMocks} from "@/mocks/EventMocks";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";

const ModalWindow = () => {
    return (
        <div>
            <h1>Modal Window</h1>
            <p>This is a modal window.</p>
        </div>
    );
};

const AsyncContent: React.FC<{ onLoad: () => void }> = ({onLoad}) => {
    useEffect(() => {
        // Simulate an asynchronous operation
        const timer = setTimeout(() => {
            onLoad();
        }, 1500); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [onLoad]);

    return (
        <ModalPopup modalWindow={<ModalWindow/>}>
            {(openModal) => (
                <EventListComponent
                    data={EventMocks}
                    buttonText={"Buy Tickets"}
                    click={(data: EventInterface) => {
                        console.log(data);
                        openModal();
                    }}
                />
            )}
        </ModalPopup>
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