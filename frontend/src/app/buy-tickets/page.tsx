'use client';

import React, {useEffect, useState} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";
import {Ripple} from "react-ripple-click";
import {FetchEvents} from "@/communication/EventComms";

const ProcessPurchase = ({data}: { data: EventInterface }) => {
    console.log(data)
};

const ModalWindow = ({closeModal, data}: { closeModal: () => void; data: EventInterface | null }) => {
    return (
        <div className={"w-[20rem] h-[12rem] flex flex-col items-center"}>
            <h1 className={"text-5xl font-bold my-3"}>Confirmation</h1>
            <p className={"text-xl text-center mb-3"}>Are you sure you want proceed <br/> with your purchase?</p>
            <button
                className={"bg-green-600 hover:bg-green-800 text-white" +
                    " font-bold py-2 px-4 rounded text-2xl relative isolate overflow-hidden"}
                onClick={() => {
                    if (data !== null) {
                        ProcessPurchase({data});
                    }
                    closeModal();
                }}
            >
                <Ripple/>
                Proceed
            </button>
        </div>
    );
};

const AsyncContent: React.FC<{ onLoad: () => void; onError: () => void }> = ({onLoad, onError}) => {
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [data, setData] = useState<EventInterface | null>(null);

    useEffect(() => {
        FetchEvents().then((events) => {
            setEvents(events);
            onLoad();
        }).catch((error) => {
            console.error(error);
            onError();
        });
    }, [onLoad, onError]);

    return (
        <ModalPopup modalWindow={
            (closeModal) => {
                return <ModalWindow closeModal={closeModal} data={data}/>
            }}
        >
            {(openModal) => (
                <EventListComponent
                    data={events}
                    buttonText={"Buy tickets"}
                    click={(data: EventInterface) => {
                        setData(data);
                        openModal();
                    }}
                />
            )}
        </ModalPopup>
    );
};

export default function Page() {
    return (
        <LoadingComponent text={"Loading events ..."} errorText={"Failed to fetch ongoing events..."}>
            {(stopLoading, startError) => (
                <AsyncContent onLoad={stopLoading} onError={startError}/>
            )}
        </LoadingComponent>
    );
}