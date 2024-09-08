'use client';
import {AccountAddress} from "@aptos-labs/ts-sdk";
import {aptosClient} from "@/utils/AptosClient";
import {EventInterface} from '@/interface/EventInterface';
import {MODULE_ADDRESS} from "@/utils/AptosClient";
import {FetchEvents} from "@/communication/EventComms";
import {TradeInterface} from "@/interface/TradeInterface";

export async function SubmitTrade(event: EventInterface): Promise<string | null> {
    return "";
}

async function FetchTrades(collectionId: string): Promise<TradeInterface[]> {
    const tradesRes = await aptosClient().view<[string]>({
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

export async function GetTrades(): Promise<EventInterface[] | null> {
    const allTrades: EventInterface[] = [];

    try {
        const events = await FetchEvents();

        for (const event of events) {
            const trades = await FetchTrades(event.collectionID);

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
        console.log(e);
        return null;
    }
}

export async function AcceptTrade(tradeId: string): Promise<boolean> {
    return true;
}