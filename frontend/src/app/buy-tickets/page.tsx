'use client';

import React, {useEffect, useState} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventMocks} from "@/mocks/EventMocks";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";
import {Ripple} from "react-ripple-click";

const ProcessPurchase = ({data}: { data: EventInterface }) => {
    console.log(data)
};

const LoadEvents =  async () => {
    console.log("Loading events...");
}

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

const AsyncContent: React.FC<{ onLoad: () => void }> = ({onLoad}) => {
    const [data, setData] = useState<EventInterface | null>(null);

    useEffect(() => {
        // Simulate an asynchronous operation
        const timer = setTimeout(() => {
            onLoad();
        }, 1500); // 3 seconds delay

        return () => clearTimeout(timer);
    }, [onLoad]);

    return (
        <ModalPopup modalWindow={
            (closeModal) => {
                return <ModalWindow closeModal={closeModal} data={data}/>
            }}
        >
            {(openModal) => (
                <EventListComponent
                    data={EventMocks}
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
        <LoadingComponent text={"Loading events ..."}>
            {(stopLoading) => (
                <AsyncContent onLoad={stopLoading}/>
            )}
        </LoadingComponent>
    );
}