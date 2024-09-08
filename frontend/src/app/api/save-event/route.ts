// app/api/save-event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { EventInterface } from "@/interface/EventInterface";

const DB_PATH = path.join(process.cwd(), 'events.db');

export async function POST(req: NextRequest) {
    try {
        const newEvent: EventInterface = await req.json();

        const requiredFields: (keyof EventInterface)[] = ['title', 'description', 'date', 'location', 'image', 'link', 'ticketsLeft', 'ticketsTrades', 'price'];
        for (const field of requiredFields) {
            if (!(field in newEvent)) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
            }
        }

        const eventString = JSON.stringify(newEvent);
        await fs.writeFile(DB_PATH, `${eventString}\n`, { flag: 'a' }).catch(async (error) => {
            if (error.code === 'ENOENT') {
                await fs.writeFile(DB_PATH, `${eventString}`);
            } else {
                throw error;
            }
        });

        return NextResponse.json({ message: 'Event added successfully', event: newEvent }, { status: 201 });
    } catch (error) {
        console.error('Error saving event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}