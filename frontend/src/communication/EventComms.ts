'use client';

import {EventInterface} from '@/interface/EventInterface';
import {GetTicketsLeft, GetTicketsTrades} from "@/communication/UtilComms";
import {TicketMocks} from "@/mocks/EventMocks";
import {InputTransactionData} from "@aptos-labs/wallet-adapter-react";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {GetAptosClient} from "@/utils/GetAptosClient";
import {AccountInfo} from "@aptos-labs/wallet-adapter-core";
import {ApolloClient, gql, InMemoryCache, useQuery} from '@apollo/client';

export async function SubmitEvent(event: EventInterface): Promise<EventInterface | null> {
    try {
        const response = await fetch('/api/save-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const err = await response.json();
            console.log('Error submitting event:', response);
            throw new Error(err.message || 'Failed to submit event');
        }

        const data = await response.json();
        return data.event;
    } catch (error) {
        console.error('Error submitting event:', error);
        return null;
    }
}

function removeHexPrefix(hexString: string) {
    return hexString.slice(2);
}

export async function FetchEvents(): Promise<EventInterface[]> {
    try {
        const response = await fetch('/api/get-events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const events: EventInterface[] = await response.json();

        for (const event of events) {
            event.ticketsLeft = await GetTicketsLeft(event.collectionID) || 0;
            event.ticketsTrades = await GetTicketsTrades(event.collectionID) || 0;
        }

        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

const APTOS_INDEXER_URL = 'https://api.testnet.aptoslabs.com/v1/graphql';

const ApolloClientInstance = new ApolloClient({
    uri: APTOS_INDEXER_URL,
    cache: new InMemoryCache(),
});

export async function FetchTickets(account: AccountInfo | null): Promise<EventInterface[]> {
    if (!account) {
        throw new Error('Wallet not connected');
    }

    async function fetchNfts() {
        const addr = account.address.slice(8);
        console.log(addr);

        const GET_ACCOUNT_NFTS = gql`
          query GetAccountNfts {
            current_token_ownerships_v2(
              where: {owner_address: {_eq: ${addr}, amount: {_gt: "0"}}
            ) {
              current_token_data {
                collection_id
                largest_property_version_v1
                current_collection {
                  collection_id
                  collection_name
                  description
                  creator_address
                  uri
                  __typename
                }
                description
                token_name
                token_data_id
                token_standard
                token_uri
                __typename
              }
              owner_address
              amount
              __typename
            }
          }
        `;

        try {
            const {data} = await ApolloClientInstance.query({query: GET_ACCOUNT_NFTS});

            console.log(data);
        } catch (err) {
            console.error('Error fetching NFTs. Please try again.');
            console.error(err);
        }
    }

    // await fetchNfts();
    return TicketMocks;
}

export type MintNftArguments = {
    collectionId: string;
    amount: number;
};

export const MintNFTRequest = (args: MintNftArguments): InputTransactionData => {
    const {collectionId, amount} = args;
    return {
        data: {
            function: `${process.env.MODULE_ADDRESS}::launchpad::mint_nft`,
            typeArguments: [],
            functionArguments: [collectionId, amount],
        },
    };
};

export async function BuyTicket(event: EventInterface): Promise<void> {
    throw new Error('Not implemented');

    const {account, signAndSubmitTransaction} = useWallet();

    if (!account) {
        throw new Error('Wallet not connected');
    }

    const response = await signAndSubmitTransaction(
        MintNFTRequest({collectionId: event.collectionID, amount: 1}),
    );
    await GetAptosClient().waitForTransaction({transactionHash: response.hash});
}