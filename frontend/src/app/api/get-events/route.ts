// app/api/get-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { EventInterface } from "@/interface/EventInterface";

const DB_PATH = path.join(process.cwd(), 'events.db');

export async function GET(req: NextRequest) {
    try {
        const fileContents = await fs.readFile(DB_PATH, 'utf-8');
        const eventStrings = fileContents.trim().split('\n');
        const events: EventInterface[] = eventStrings.map(eventString => JSON.parse(eventString));

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error reading events:', error);
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return NextResponse.json([]);
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}