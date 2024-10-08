'use client';

import React, {useEffect, useState} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";
import {Ripple} from "react-ripple-click";
import {BuyTicket, FetchEventsFromDB} from "@/communication/EventComms";
import {ShowNotification} from "@/components/NotificationService";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const ProcessPurchase = async ({data, account, signAndSubmitTransaction}: {
    data: EventInterface,
    account: any,
    signAndSubmitTransaction: any
}) => {
    console.log(`Buying ticket for: ${data}`);
    BuyTicket(data, account, signAndSubmitTransaction).then(() => {
        ShowNotification('success', "Ticket bought successfully");
        console.log("Ticket bought successfully");
    }).catch((error) => {
        ShowNotification('error', "Ticket purchase failed");
        console.error("Error buying ticket: ", error);
    });
};

const ModalWindow = ({closeModal, data}: { closeModal: () => void; data: EventInterface | null }) => {
    const {account, signAndSubmitTransaction} = useWallet();

    return (
        <div className={"w-[20rem] h-[12rem] flex flex-col items-center"}>
            <h1 className={"text-5xl font-bold my-3"}>Confirmation</h1>
            <p className={"text-xl text-center mb-3"}>Are you sure you want proceed <br/> with your purchase?</p>
            <button
                className={"bg-green-600 hover:bg-green-800 text-white" +
                    " font-bold py-2 px-4 rounded text-2xl relative isolate overflow-hidden"}
                onClick={async () => {
                    if (data !== null) {
                        await ProcessPurchase({data, account, signAndSubmitTransaction});
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
        FetchEventsFromDB().then((events) => {
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