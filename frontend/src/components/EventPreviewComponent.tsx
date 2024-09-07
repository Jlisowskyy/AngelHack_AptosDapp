'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {EventInterface} from '@/interface/EventInterface';

interface EventPreviewComponentProps {
    data: EventInterface;
    click?: ((data: EventInterface) => void) | null;
}

const EventPreviewComponent: React.FC<EventPreviewComponentProps> = ({data, click = null}) => {
    const runClick = () => {
        if (click) {
            click(data);
        }
    };

    return (
        <div className="bg-amber-100 shadow-xl rounded-2xl p-4" onClick={runClick}>
            <div className="flex flex-row">
                <Image src={data.image} alt={data.title} width={128} height={128} className="rounded-full mr-[2rem]"/>
                <div className="flex-col flex w-full justify-between">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">{data.title}</h2>
                        <Link href={data.link} className="text-blue-500 hover:underline">Visit</Link>
                    </div>
                    <div className="font-semibold">
                        <p>{`Location: ${data.location}`}</p>
                        <p>{`Date: ${data.date}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPreviewComponent;