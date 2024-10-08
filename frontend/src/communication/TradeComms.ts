'use client';
import {AccountAddress} from "@aptos-labs/ts-sdk";
import {InputTransactionData} from "@aptos-labs/wallet-adapter-react";
import {GetAptosClient} from "@/utils/GetAptosClient";
import {EventInterface} from '@/interface/EventInterface';
import {FetchEventsFromDB} from "@/communication/EventComms";
import {TradeInterface} from "@/interface/TradeInterface";
import {convertAmountFromHumanReadableToOnChain, APT_DECIMALS} from "@/utils/helpers";
import { TradeApolloInterface } from "@/interface/TradeApolloInterface";
import {MODULE_ADDRESS} from "@/config";

export type SubmitTradeArgs = {
    collection_address: string;
    price: number;
};

export const SubmitTradeRequest = (args: SubmitTradeArgs): InputTransactionData => {
    const {collection_address, price} = args;

    console.log({
        function: `${MODULE_ADDRESS}::launchpad::submit_trade`,
        typeArguments: [],
        functionArguments: [collection_address, price],
    })

    return {
        data: {
            function: `${MODULE_ADDRESS}::launchpad::submit_trade`,
            typeArguments: [],
            functionArguments: [collection_address, price],
        },
    };
};
export async function SubmitTrade(event: EventInterface, account: any, signAndSubmitTransaction: any): Promise<void> {
    if (!account) 
        throw new Error('Account is required');
    if (!event.tradePrice) {
        throw new Error('Trade price is required');
    }

    const onChainPrice = convertAmountFromHumanReadableToOnChain(event.tradePrice, APT_DECIMALS);
    const response = await signAndSubmitTransaction(
        SubmitTradeRequest({collection_address: event.collectionID, price: onChainPrice}),
    );
    await GetAptosClient().waitForTransaction({transactionHash: response.hash});
}

async function FetchTrade(collectionId: string): Promise<TradeApolloInterface[]> {
    const tradesRes = await GetAptosClient().view<[Array<TradeApolloInterface>]>({
        payload: {
            function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_trades`,
            functionArguments: [collectionId],
        },
    });

    const [trades] = tradesRes;

    console.log("Received trades: ", trades);

    return trades;
}

export async function FetchTrades(): Promise<EventInterface[]> {
    const allTrades: EventInterface[] = [];

    try {
        const events = await FetchEventsFromDB();

        for (const event of events) {
            const trades = await FetchTrade(event.collectionID);

            for (const trade of trades) {
                if (trade.collection_address !== event.collectionID) {
                    continue;
                }

                const tradeEvent: EventInterface = { ...event };
                tradeEvent.tradeSeller = "UNKNOWN";
                tradeEvent.tradePrice = trade.price / (10 ** APT_DECIMALS);
                tradeEvent.tradeSellerId = trade.seller;

                allTrades.push(tradeEvent);
            }
        }

        return allTrades;
    } catch (e) {
        console.error("Error fetching trades: ", e);
        throw e;
    }
}
export type AcceptTradeArgs = {
    collectionId1: string;
    collectionId2: string;
};
export const AcceptTradeRequest = (args: AcceptTradeArgs): InputTransactionData => {
    const {collectionId1, collectionId2} = args;

    console.log({
        function: `${MODULE_ADDRESS}::launchpad::accept_trade`,
        typeArguments: [],
        functionArguments: [collectionId1, collectionId2],
    })

    return {
        data: {
            function: `${MODULE_ADDRESS}::launchpad::accept_trade`,
            typeArguments: [],
            functionArguments: [collectionId1, collectionId2],
        },
    };
};
export async function AcceptTrade(event: EventInterface, account: any, signAndSubmitTransaction: any): Promise<void> {
    if (!account) 
        throw new Error('Account is required');

    const response = await signAndSubmitTransaction(
        AcceptTradeRequest({collectionId1: event.collectionID, collectionId2: event.collectionID}),
    );
    await GetAptosClient().waitForTransaction({transactionHash: response.hash});
}