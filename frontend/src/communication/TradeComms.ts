'use client';
import {AccountAddress} from "@aptos-labs/ts-sdk";
import {GetAptosClient} from "@/utils/GetAptosClient";
import {EventInterface} from '@/interface/EventInterface';
import {MODULE_ADDRESS} from "@/utils/GetAptosClient";
import {FetchEventsFromDB} from "@/communication/EventComms";
import {TradeInterface} from "@/interface/TradeInterface";
import {TradeMocks} from "@/mocks/EventMocks";

export async function SubmitTrade(event: EventInterface): Promise<void> {
    throw new Error('Not implemented');
}

async function FetchTrade(collectionId: string): Promise<TradeInterface[]> {
    const tradesRes = await GetAptosClient().view<[string]>({
        payload: {
            function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_trades`,
            functionArguments: [collectionId],
        },
    });

    const [tradesStr] = tradesRes;
    const trades: TradeInterface[] = JSON.parse(tradesStr);
    console.log("Received trades: ", trades);

    return trades;
}

export async function FetchTrades(): Promise<EventInterface[]> {
    return TradeMocks;

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

export async function AcceptTrade(event: EventInterface): Promise<void> {
    throw new Error('Not implemented');
}