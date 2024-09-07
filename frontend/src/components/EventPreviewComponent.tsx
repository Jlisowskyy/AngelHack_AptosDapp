'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {EventInterface} from '@/interface/EventInterface';
import {Ripple} from "react-ripple-click";

interface EventPreviewComponentProps {
    data: EventInterface;
    click?: ((data: EventInterface) => void) | null;
    isTrade?: boolean;
}

const EventPreviewComponent: React.FC<EventPreviewComponentProps> = ({data, click = null, isTrade = false}) => {
    const runClick = () => {
        if (click) {
            click(data);
        }
    };

    return (
        <button
            className="bg-amber-50 shadow-xl rounded-2xl p-4 relative isolate overflow-hidden w-full text-left"
            onClick={runClick}
        >
            <Ripple/>
            <div className="flex flex-row">
                <Image src={data.image} alt={data.title} width={128} height={128} className="rounded-full mr-[2rem]"/>
                <div className="flex-col flex w-full justify-between">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">{data.title}</h2>
                        <Link href={data.link} className="text-blue-500 hover:underline">Visit</Link>
                    </div>
                    <div className="font-semibold">
                        <p>{`Where: ${data.location}`}</p>
                        <p>{`When: ${data.date}`}</p>
                        <p>{`How much: ${isTrade ? data.tradePrice : data.price}`}</p>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default EventPreviewComponent;