'use client';

import React, {useState, useEffect} from 'react';
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
    const [nextEvent, setNextEvent] = useState<EventInterface | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const onClick = (data: EventInterface) => {
        setNextEvent(data);
        setIsAnimating(true);
    }

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setEvent(nextEvent);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAnimating, nextEvent]);

    return (
        <div className="max-w-[100vw] overflow-hidden">
            <div className="grid grid-cols-10 w-[100vw] h-[calc(100vh-4.5rem)]">
                <div className="col-span-3 w-full h-full overflow-auto scroll-smooth scroll">
                    {data.map((event, index) => (
                        <div key={index} className="p-3">
                            <EventPreviewComponent data={event} click={onClick} isTrade={isTrade}/>
                        </div>
                    ))}
                </div>
                <div className="w-full h-full col-span-7 flex justify-center items-center relative overflow-hidden">
                    {event === null ? (
                        nextEvent !== null ? (
                            <div className={`absolute inset-0 transition-transform duration-500 translate-y-full`}>
                                <EventInfoComponent data={nextEvent} buttonText={buttonText} click={click} isTrade={isTrade}/>
                            </div>
                        ) : (
                            <h2 className="font-extrabold text-5xl">Click on an event to view details</h2>
                        )
                    ) : (
                        <div className={`absolute inset-0 transition-transform duration-500 ${isAnimating ? 'translate-y-full' : 'translate-y-0'}`}>
                            <EventInfoComponent data={event} buttonText={buttonText} click={click} isTrade={isTrade}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}