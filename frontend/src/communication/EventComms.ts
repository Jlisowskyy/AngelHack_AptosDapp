'use client';

import {EventInterface} from '@/interface/EventInterface';
import {GetTicketsLeft, GetTicketsTrades} from "@/communication/UtilComms";
import {TicketMocks} from "@/mocks/EventMocks";

export async function SubmitEvent(event: EventInterface): Promise<EventInterface | null> {
    try {
        const response = await fetch('/api/save-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const err = await response.json();
            console.log('Error submitting event:', response);
            throw new Error(err.message || 'Failed to submit event');
        }

        const data = await response.json();
        return data.event;
    } catch (error) {
        console.error('Error submitting event:', error);
        return null;
    }
}

export async function FetchEvents(): Promise<EventInterface[]> {
    try {
        const response = await fetch('/api/get-events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const events: EventInterface[] = await response.json();

        for (const event of events) {
            event.ticketsLeft = await GetTicketsLeft(event.collectionID) || 0;
            event.ticketsTrades = await GetTicketsTrades(event.collectionID) || 0;
        }

        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

export async function FetchTickets(): Promise<EventInterface[]> {
    return TicketMocks;
}

export async function BuyTicket(event: EventInterface): Promise<void> {
    throw new Error('Not implemented');
}