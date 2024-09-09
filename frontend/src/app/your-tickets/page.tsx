'use client';

import React, {useEffect, useState} from "react";
import LoadingComponent from "@/components/LoadingComponent";
import EventListComponent from "@/components/EventListComponent";
import {EventInterface} from "@/interface/EventInterface";
import ModalPopup from "@/components/ModalPopup";
import {Ripple} from "react-ripple-click";
import {FetchTickets} from "@/communication/EventComms";
import {SubmitTrade} from "@/communication/TradeComms";
import {ShowNotification} from "@/components/NotificationService";

const SellTicket = ({data, price, name}: { data: EventInterface; price: number; name: string }) => {
    data.tradeSeller = name;
    data.tradePrice = price;

    console.log(`Selling ticket for ${data.title} at price ${price} with name ${name}`);
    SubmitTrade(data).then(() => {
        ShowNotification("success", "Trade submitted successfully");
        console.log("Trade submitted successfully");
    }).catch((error) => {
        ShowNotification("error", "Trade submission failed");
        console.error("Error submitting trade: ", error);
    });
};

const ConvertDate = (date: string | undefined) => {
    if (date === undefined) {
        return "No date specified";
    }

    const currentDate = new Date();
    const targetDate = new Date(date);
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
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
    const [traderName, setTraderName] = useState<string>('Default name');
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

    const valideAndSetTraderName = (value: string) => {
        if (value.length < 1) {
            setError('Name must be at least 1 characters long');
        } else {
            setError('');
            setTraderName(value);
        }
    }

    return (
        <div className={"w-[42rem] h-[24rem] flex flex-col items-center justify-between"}>
            <section className={"flex flex-col items-center"}>
                <h1 className={"text-5xl font-bold my-3"}>Trade form</h1>

                <p className={"text-xl text-center "}>Initial price for the ticket was: {data?.price}, there
                    are {data?.ticketsLeft} tickets left, time left: {ConvertDate(data?.date)}.</p>
            </section>

            <section className={"flex flex-col items-center w-full"}>
                <div className={"grid grid-cols-2 w-full my-4"}>
                    <div className={"flex flex-col items-center px-2"}>
                        <h2 className={"text-2xl text-center"}>Enter your price:</h2>
                        <input
                            id={"value"}
                            type={"number"}
                            min={0}
                            max={data.price}
                            step={1}
                            value={tradePrice}
                            className={"h-10 text-center bg-gray-200 rounded-lg appearance-none cursor-pointer mb-1 w-full"}
                            onChange={(e) => validateAndSetTradePrice(e.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col items-center px-2"}>
                        <h2 className={"text-2xl text-center"}>Enter your Name:</h2>
                        <input
                            id={"name"}
                            type={"text"}
                            value={traderName}
                            className={"h-10 text-center bg-gray-200 rounded-lg appearance-none cursor-pointer mb-1 w-full"}
                            onChange={(e) => valideAndSetTraderName(e.target.value)}
                        />
                    </div>
                </div>

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
                            SellTicket({data: data, price: tradePrice, name: traderName});
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
    const [tickets, setTickets] = useState<EventInterface[]>([]);

    useEffect(() => {
        console.log("Fetching tickets...");

        FetchTickets().then((events) => {
            setTickets(events);
            // onLoad();
        }).catch((error) => {
            console.error(error);
            onError();
        });

        const timer = setTimeout(() => {
            onLoad();
        }, 1000);

        console.log("Tickets fetched");
        return () => clearTimeout(timer);
    }, [onLoad, onError]);
    ``

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
                    data={tickets}
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