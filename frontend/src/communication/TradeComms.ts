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


export async function SubmitTrade(event: EventInterface): Promise<void> {
    if (!event.tradePrice) {
        throw new Error('Trade price is required');
    }

    const onChainPrice = convertAmountFromHumanReadableToOnChain(event.tradePrice, APT_DECIMALS);

    throw new Error('Not implemented');
}

async function FetchTrade(collectionId: string): Promise<TradeInterface[]> {
    const tradesRes = await GetAptosClient().view<[Array<TradeApolloInterface>]>({
        payload: {
            function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_trades`,
            functionArguments: [collectionId],
        },
    });
    console.log("Received trades: ", tradesRes);

    return tradesRes;
}

export async function FetchTrades(): Promise<EventInterface[]> {
    const allTrades: EventInterface[] = [];

    try {
        const events = await FetchEventsFromDB();

        for (const event of events) {
            const trades = await FetchTrade(event.collectionID);

            for (const trade of trades) {
                const tradeEvent: EventInterface = { ...event };
                tradeEvent.tradeSeller = trade.tradeSeller;
                tradeEvent.tradePrice = trade.tradePrice;
                tradeEvent.tradeSellerId = trade.tradeSellerId;

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