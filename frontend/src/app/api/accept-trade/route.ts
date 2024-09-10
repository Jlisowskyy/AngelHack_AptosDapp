// app/api/submit-trade/route.ts
import {NextRequest, NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {EventInterface} from "@/interface/EventInterface";

const DB_PATH = path.join(process.cwd(), 'trades.db');

export async function DELETE(req: NextRequest) {
    let events: EventInterface[] = [];
    try {
        const fileContents = await fs.readFile(DB_PATH, 'utf-8');
        const eventStrings = fileContents.trim().split('\n');
        events = eventStrings.map(eventString => JSON.parse(eventString));
    } catch (error) {
        console.error('Error reading events:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    try {
        const eventToRemove: EventInterface = await req.json();

        const requiredFields: (keyof EventInterface)[] = ['collectionID', 'title', 'description', 'date', 'location', 'image', 'link', 'ticketsLeft', 'ticketsTrades', 'price', 'tradePrice', 'tradeSeller', 'tradeSellerId', 'tradeTokenId'];
        for (const field of requiredFields) {
            if (!(field in eventToRemove)) {
                return NextResponse.json({error: `Missing required field: ${field}`}, {status: 400});
            }
        }

        for (const ev of events) {
            if (ev.tradeTokenId === eventToRemove.tradeTokenId) {
                continue;
            }

            const eventString = JSON.stringify(ev);
            await fs.writeFile(DB_PATH, `${eventString}\n`, {flag: 'a'}).catch(async (error) => {
                if (error.code === 'ENOENT') {
                    await fs.writeFile(DB_PATH, `${eventString}`);
                } else {
                    throw error;
                }
            });
        }



        return NextResponse.json({message: 'Event removed successfully', event: eventToRemove}, {status: 201});
    } catch (error) {
        console.error('Error saving event:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}