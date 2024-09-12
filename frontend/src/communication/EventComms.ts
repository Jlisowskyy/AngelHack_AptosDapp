/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { GetTicketsLeft, GetTicketsTrades } from "@/communication/UtilComms";
import { MODULE_ADDRESS } from "@/config";
import { EventInterface } from "@/interface/EventInterface";
import { TicketMocks } from "@/mocks/EventMocks";
import { GetAptosClient } from "@/utils/GetAptosClient";
import {
  APT_DECIMALS,
  convertAmountFromHumanReadableToOnChain,
  dateToSeconds,
} from "@/utils/helpers";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { AccountAddressInput } from "@aptos-labs/ts-sdk";
import { AccountInfo } from "@aptos-labs/wallet-adapter-core";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

export type CreateCollectionArguments = {
  collectionDescription: string; // The collection description
  collectionName: string; // The collection name
  projectUri: string; // The project URI (i.e https://mydomain.com)
  maxSupply: number; // The amount of NFTs in a collection
  royaltyPercentage?: number; // The percentage of trading value that collection creator gets when an NFT is sold on marketplaces
  preMintAmount?: number; // amount of NFT to pre-mint for myself
  allowList?: Array<AccountAddressInput>; // addresses in the allow list
  allowListStartDate?: Date; // allow list start time (in seconds)
  allowListEndDate?: Date; // allow list end time (in seconds)
  allowListLimitPerAccount?: number; // mint limit per address in the allow list
  allowListFeePerNFT?: number; // mint fee per NFT for the allow list
  publicMintStartDate?: Date; // public mint start time (in seconds)
  publicMintEndDate?: Date; // public mint end time (in seconds)
  publicMintLimitPerAccount: number; // mint limit per address in the public mint
  publicMintFeePerNFT?: number; // mint fee per NFT for the public mint, on chain stored in smallest unit of APT (i.e. 1e8 oAPT = 1 APT)
};

export const GetCreateCollectionRequest = (
  args: CreateCollectionArguments,
): InputTransactionData => {
  console.log(MODULE_ADDRESS);

  const {
    collectionDescription,
    collectionName,
    projectUri,
    maxSupply,
    royaltyPercentage,
    preMintAmount,
    allowList,
    allowListStartDate,
    allowListEndDate,
    allowListLimitPerAccount,
    allowListFeePerNFT,
    publicMintStartDate,
    publicMintEndDate,
    publicMintLimitPerAccount,
    publicMintFeePerNFT,
  } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::launchpad::create_collection`,
      typeArguments: [],
      functionArguments: [
        collectionDescription,
        collectionName,
        projectUri,
        maxSupply,
        royaltyPercentage,
        preMintAmount,
        allowList,
        dateToSeconds(allowListStartDate),
        dateToSeconds(allowListEndDate),
        allowListLimitPerAccount,
        allowListFeePerNFT,
        publicMintStartDate
          ? dateToSeconds(publicMintStartDate)
          : dateToSeconds(new Date()),
        dateToSeconds(publicMintEndDate),
        publicMintLimitPerAccount,
        publicMintFeePerNFT
          ? convertAmountFromHumanReadableToOnChain(
              publicMintFeePerNFT,
              APT_DECIMALS,
            )
          : 0,
      ],
    },
  };
};

export async function SubmitEvent(
  event: EventInterface,
  signAndSubmitTransaction: any,
): Promise<void> {
  // throw new Error('Not implemented');

  console.log("Submitting event: ", event);

  const response = await signAndSubmitTransaction(
    GetCreateCollectionRequest({
      collectionDescription: event.title,
      collectionName: event.title,
      projectUri: event.link,
      maxSupply: event.initialTicketPool || 1,
      royaltyPercentage: 0,
      preMintAmount: 0,
      allowList: undefined,
      allowListStartDate: undefined,
      allowListEndDate: undefined,
      allowListLimitPerAccount: undefined,
      allowListFeePerNFT: undefined,
      publicMintStartDate: event.publicMintStartDate,
      publicMintEndDate: event.publicMintEndDate,
      publicMintLimitPerAccount: 1,
      publicMintFeePerNFT: event.price,
    }),
  );

  console.log("Transaction sent");
  console.log(response);

  const committedTransactionResponse =
    await GetAptosClient().waitForTransaction({
      transactionHash: response.hash,
    });

  console.log("Transaction hash: ", response.hash);
  console.log("Transaction response: ", committedTransactionResponse);

  if (!committedTransactionResponse.success) {
    throw new Error("Transaction failed");
  }

  /** @ts-expect-error */
  if (committedTransactionResponse.events === undefined) {
    throw new Error("No events in transaction");
  }

  /** @ts-expect-error */
  const objEvent = committedTransactionResponse.events[2].data;
  console.log("Event: ", objEvent);

  console.log("Transaction confirmed");
  event.collectionID = objEvent.collection_obj.inner;

  console.log("Collection ID: ", event.collectionID);

  console.log("Event submitted");
  await SubmitEventToDB(event);
  console.log("Event submitted to DB");
}

export async function SubmitEventToDB(
  event: EventInterface,
): Promise<EventInterface | null> {
  try {
    const response = await fetch("/api/save-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const err = await response.json();
      console.log("Error submitting event:", response);
      throw new Error(err.message || "Failed to submit event");
    }

    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error("Error submitting event:", error);
    return null;
  }
}

export async function FetchEventsFromDB(): Promise<EventInterface[]> {
  try {
    const response = await fetch("/api/get-events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const events: EventInterface[] = await response.json();

    // for (const event of events) {
    //     event.ticketsLeft = await GetTicketsLeft(event.collectionID) || 0;
    //     event.ticketsTrades = await GetTicketsTrades(event.collectionID) || 0;
    // }

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

interface NFT {
  collectionId: string;
  tokenId: string;
}

export async function FetchTickets(
  account: AccountInfo | null,
): Promise<EventInterface[]> {
  // should return list of collection IDs
  async function fetchNfts(): Promise<NFT[]> {
    const tokenData: NFT[] = [];

    if (!account) {
      throw new Error("Wallet not connected");
    }

    const addr = account.address;
    console.log(addr);

    const tokens = await GetAptosClient().getAccountOwnedTokens({
      accountAddress: addr,
    });
    console.log(tokens);

    for (const token of tokens) {
      tokenData.push({
        /** @ts-expect-error */
        collectionId: token.current_token_data.collection_id,
        tokenId: "XD", // TODO
      });
    }

    return tokenData;
  }

  async function FilterNfts() {
    const nfts = await fetchNfts();
    const events = await FetchEventsFromDB();
    const returnEvents: EventInterface[] = [];

    for (const event of events) {
      for (const nft of nfts) {
        if (nft.collectionId === event.collectionID) {
          const ticket: EventInterface = { ...event };

          ticket.tradeTokenId = nft.tokenId;
          returnEvents.push(event);
        }
      }
    }

    return returnEvents;
  }

  return await FilterNfts();
}

export type MintNftArguments = {
  collectionId: string;
  amount: number;
};

export const MintNFTRequest = (
  args: MintNftArguments,
): InputTransactionData => {
  const { collectionId, amount } = args;
  console.log("Minting NFT: ", collectionId, amount);

  console.log({
    function: `${MODULE_ADDRESS}::launchpad::mint_nft`,
    typeArguments: [],
    functionArguments: [collectionId, amount],
  });

  return {
    data: {
      function: `${MODULE_ADDRESS}::launchpad::mint_nft`,
      typeArguments: [],
      functionArguments: [collectionId, amount],
    },
  };
};

export async function BuyTicket(
  event: EventInterface,
  account: any,
  signAndSubmitTransaction: any,
): Promise<void> {
  if (!account) {
    throw new Error("Wallet not connected");
  }

  const response = await signAndSubmitTransaction(
    MintNFTRequest({ collectionId: event.collectionID, amount: 1 }),
  );
  await GetAptosClient().waitForTransaction({ transactionHash: response.hash });
}
