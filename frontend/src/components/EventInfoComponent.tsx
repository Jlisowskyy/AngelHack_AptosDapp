'use client';

import React from 'react';
import Image from 'next/image';
import {EventInterface} from '@/interface/EventInterface';

import {Ripple} from "react-ripple-click";
import 'react-ripple-click/dist/index.css';

interface EventPreviewComponentProps {
    data: EventInterface;
    buttonText?: string;
    click?: ((data: EventInterface) => void) | null;
    isTrade?: boolean;
}

const EventPreviewComponent: React.FC<EventPreviewComponentProps> = ({
                                                                         data,
                                                                         buttonText = "",
                                                                         click = null,
                                                                         isTrade = false
                                                                     }) => {
    const runClick = () => {
        if (click) {
            click(data);
        }
    };

    const Header = () => {
        return (
            <div className="flex flex-row">
                <Image src={data.image} alt={data.title} width={325} height={325}
                       className="rounded-full mr-[2rem]"/>
                <div className="flex-col flex w-full justify-between">
                    <div className="flex items-center justify-between">
                        <h2 className="text-7xl font-semibold">{data.title}</h2>
                    </div>
                    <section>
                        {
                            isTrade &&
                            <p className={"py-1 text-2xl font-semibold"}>Seller: <span
                                className={"font-normal"}>{data.tradeSeller}</span>
                            </p>
                        }
                        {
                            isTrade &&
                            <p className={"py-1 text-2xl font-semibold"}>Trade price: <span
                                className={"font-normal"}>{data.tradePrice}</span>
                            </p>
                        }
                        <p className={"py-1 text-2xl font-semibold"}>Tickets left: <span
                            className={"font-normal"}>{data.ticketsLeft}</span>
                        </p>
                        <p className={"py-1 text-2xl font-semibold"}>Tickets on market: <span
                            className={"font-normal"}>{data.ticketsTrades}</span>
                        </p>
                        <p className={"py-1 text-2xl font-semibold"}>Original price: <span
                            className={"font-normal"}>{data.price}</span>
                        </p>
                    </section>
                </div>
            </div>);
    }

    const Description = () => {
        return (
            <div className={"my-4 h-full"}>
                <p className={"py-1 text-5xl font-semibold mb-3"}>Description:</p>
                <textarea readOnly className={"py-1 text-2xl font-normal w-full h-full bg-transparent"} defaultValue={data.description}/>
            </div>
        );
    }

    const Footer = () => {
        return (
            <div className={"w-full flex justify-end"}>
                {click != null &&
                    <button
                        className={"bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded text-2xl relative isolate overflow-hidden"}
                        onClick={runClick}>
                        <Ripple/>
                        {buttonText}
                    </button>}
            </div>
        );
    }

    return (
        <div className={"w-[100%] h-[100%] px-8 pb-8 pt-2"}>
            <div className="w-[100%] h-[100%] bg-amber-50 shadow-2xl rounded-2xl p-6 flex flex-col justify-between">
                <div className={"flex flex-col h-[85%]"}>
                    <Header/>
                    <Description/>
                </div>
                <Footer/>
            </div>
        </div>

    );
};

export default EventPreviewComponent;