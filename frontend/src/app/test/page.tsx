'use client';

import BlankPage from "@/components/BlankPage";
import {EventMocks} from "@/mocks/EventMocks";
import {SubmitEvent, FetchEvents} from "@/communication/EventComms";

function TestAppend() {
    for (let i = 0; i < EventMocks.length; i++) {
        SubmitEvent(EventMocks[i]);
    }
}

function TestFetch() {
    FetchEvents().then((events) => {
        console.log(events);
    });
}

export default function Page() {
    return (<BlankPage name={"Test Page"}/>);
}