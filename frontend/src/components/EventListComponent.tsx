'use client';

import React, {useState} from 'react';
import {EventInterface} from "@/interface/EventInterface";
import EventPreviewComponent from "@/components/EventPreviewComponent";

export default function EventListComponent({data}: { data: EventInterface[] }) {
    const [event, setEvent] = useState<EventInterface | null>(null);
    const onClick = (data: EventInterface) => {
        setEvent(data);
    }

    return (
        <div className={"grid grid-cols-10 w-[100vw] h-[calc(100vh-14.5rem)]"}>
            <div className={"col-span-3 w-full h-full overflow-auto scroll-smooth scroll"}>
                {data.map((event, index) => (
                    <div key={index} className={"p-3"}>
                        <EventPreviewComponent data={event} click={onClick}/>
                    </div>
                ))}
            </div>
            <div className={"w-full h-full col-span-7 p-2 flex justify-center items-center"}>
                {
                    event == null ? <h2 className={"font-extrabold text-5xl"}>Click on an event to view details</h2> :
                        <div> {event.title} </div>
                }
            </div>
        </div>
    );
}