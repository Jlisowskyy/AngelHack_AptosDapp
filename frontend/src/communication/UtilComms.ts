'use client';
import {aptosClient, MODULE_ADDRESS} from "@/utils/AptosClient";
import {AccountAddress} from "@aptos-labs/ts-sdk";

export async function GetTicketsLeft(collectionId: string): Promise<number | null> {
    return 0;

    try{
        const ticketsLeftRes = await aptosClient().view<[string]>({
            payload: {
                function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_tickets_left`,
                functionArguments: [collectionId],
            },
        });

        const [ticketsLeft] = ticketsLeftRes;

        return parseInt(ticketsLeft, 10);
    }catch (e) {
        console.log(e);
        return null;
    }
}

export async function GetTicketsTrades(collectionId: string): Promise<number | null> {
    return 0;

    try{
        const numTradesRes = await aptosClient().view<[string]>({
            payload: {
                function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_num_ticket_trades`,
                functionArguments: [collectionId],
            },
        });

        const [ticketsLeft] = numTradesRes;

        return parseInt(ticketsLeft, 10);
    }catch (e) {
        console.log(e);
        return null;
    }
}