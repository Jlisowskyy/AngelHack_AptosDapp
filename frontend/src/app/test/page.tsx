'use client';

import BlankPage from "@/components/BlankPage";
import {EventMocks} from "@/mocks/EventMocks";
import {SubmitEventToDB, FetchEventsFromDB} from "@/communication/EventComms";

function TestAppend() {
    for (let i = 0; i < EventMocks.length; i++) {
        SubmitEventToDB(EventMocks[i]);
    }
}

function TestFetch() {
    FetchEventsFromDB().then((events) => {
        console.log(events);
    });
}

export default function Page() {
    return (<BlankPage name={"Test Page"}/>);
}