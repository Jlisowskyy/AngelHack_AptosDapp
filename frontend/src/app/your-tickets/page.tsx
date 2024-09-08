'use client';

import React, {useEffect, useState} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {TicketMocks} from "@/mocks/EventMocks";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";
import {Ripple} from "react-ripple-click";

const SellTicket = ({data, price}: { data: EventInterface; price: number }) => {
    console.log(`Selling ticket for ${data.title} at price ${price}`);
};

const LoadTickets =  async () => {
    console.log("Loading tickets...");
}

const ConvertDate = (date: string | undefined) => {
    if (date === undefined) {
        return "No date specified";
    }

    const currentDate = new Date();
    const targetDate = new Date(date);

    // Calculate the difference in time (in milliseconds)
    const differenceInTime = targetDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (differenceInDays > 0) {
        return `${differenceInDays} days left until ${targetDate.toLocaleDateString()}`;
    } else if (differenceInDays === 0) {
        return `The date is today: ${targetDate.toLocaleDateString()}`;
    } else {
        return `The date has passed: ${targetDate.toLocaleDateString()}`;
    }
};

const ModalWindow = ({closeModal, data}: { closeModal: () => void; data: EventInterface }) => {
    const [tradePrice, setTradePrice] = useState<number>(data.price);
    const [error, setError] = useState<string>('');


    const validateAndSetTradePrice = (value: string) => {
        const newPrice = parseInt(value);
        if (isNaN(newPrice)) {
            setError('Please enter a valid number');
        } else if (newPrice < 0) {
            setError('Price cannot be negative');
        } else if (newPrice > data.price) {
            setError(`Price cannot exceed the original price of ${data.price}`);
        } else {
            setError('');
            setTradePrice(newPrice);
        }
    };

    return (
        <div className={"w-[32rem] h-[24rem] flex flex-col items-center justify-between"}>
            <section className={"flex flex-col items-center"}>
                <h1 className={"text-5xl font-bold my-3"}>Trade form</h1>

                <p className={"text-xl text-center "}>Initial price for the ticket was: {data?.price}, there
                    are {data?.ticketsLeft} tickets left, time left: {ConvertDate(data?.date)}.</p>
            </section>

            <section className={"flex flex-col items-center w-full"}>
                <h2 className={"text-2xl text-center"}>Enter your price:</h2>
                <input
                    id={"text"}
                    type={"number"}
                    min={0}
                    max={data.price}
                    step={1}
                    value={tradePrice}
                    className={"w-1/2 h-10 text-center bg-gray-200 rounded-lg appearance-none cursor-pointer mb-1"}
                    onChange={(e) => validateAndSetTradePrice(e.target.value)}
                />
                <input
                    id={"slider"}
                    type={"range"}
                    min={0}
                    max={data.price}
                    step={1}
                    value={tradePrice}
                    className={"w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-1"}
                    onChange={(e) => validateAndSetTradePrice(e.target.value)}
                />
                <p className={"text-red-500 text-sm h-[2rem]"}>{error !== null ? error : ""}</p>
            </section>

            <section className={"flex flex-col items-center"}>
                <p className={"text-xl text-center mb-3"}>Are you sure you want to proceed?</p>

                <button
                    className={"bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded text-2xl relative isolate overflow-hidden" +
                        (error ? " opacity-50 cursor-not-allowed" : "")}
                    onClick={() => {
                        if (data !== null && !error) {
                            SellTicket({data: data, price: tradePrice});
                            closeModal();
                        }
                    }}
                    disabled={!!error}
                >
                    <Ripple/>
                    Proceed
                </button>
            </section>

        </div>
    );
};

const AsyncContent: React.FC<{ onLoad: () => void; onError: () => void }> = ({onLoad, onError}) => {
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
                if (data !== null) {
                    return <ModalWindow closeModal={closeModal} data={data}/>
                } else {
                    return <></>;
                }
            }}
        >
            {(openModal) => (
                <EventListComponent
                    data={TicketMocks}
                    buttonText={"Sell your ticket"}
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
        <LoadingComponent text={"Loading trades..."} errorText={"Failed to fetch your tickets..."}>
            {(stopLoading, onError) => (
                <AsyncContent onLoad={stopLoading} onError={onError}/>
            )}
        </LoadingComponent>
    );
}