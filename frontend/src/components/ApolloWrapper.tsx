'use client';

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const APTOS_INDEXER_URL = 'https://api.testnet.aptoslabs.com/v1/graphql';

const ApolloClientInstance = new ApolloClient({
    uri: APTOS_INDEXER_URL,
    cache: new InMemoryCache(),
});

export function GetApolloClient() {
    return ApolloClientInstance;
}

export default function ApolloWrapper({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ApolloProvider client={ApolloClientInstance}>
            {children}
        </ApolloProvider>
    );
}