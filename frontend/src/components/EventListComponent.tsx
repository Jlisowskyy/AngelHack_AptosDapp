'use client';

import React, {useState} from 'react';
import {EventInterface} from "@/interface/EventInterface";
import EventPreviewComponent from "@/components/EventPreviewComponent";
import EventInfoComponent from "@/components/EventInfoComponent";

export default function EventListComponent({data, buttonText, click, isTrade = false}: {
    data: EventInterface[];
    buttonText?: string;
    click?: ((data: EventInterface) => void) | null;
    isTrade?: boolean;
}) {
    const [event, setEvent] = useState<EventInterface | null>(null);
    const onClick = (data: EventInterface) => {
        setEvent(data);
    }

    return (
        <div className={"grid grid-cols-10 w-[100vw] h-[calc(100vh-4.5rem)]"}>
            <div className={"col-span-3 w-full h-full overflow-auto scroll-smooth scroll"}>
                {data.map((event, index) => (
                    <div key={index} className={"p-3"}>
                        <EventPreviewComponent data={event} click={onClick} isTrade={isTrade}/>
                    </div>
                ))}
            </div>
            <div className={"w-full h-full col-span-7 p-2 flex justify-center items-center"}>
                {
                    event == null ? <h2 className={"font-extrabold text-5xl"}>Click on an event to view details</h2> :
                        <EventInfoComponent data={event} buttonText={buttonText} click={click} isTrade={isTrade}/>
                }
            </div>
        </div>
    );
}