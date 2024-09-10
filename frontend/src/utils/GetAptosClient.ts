import {Aptos, AptosConfig} from "@aptos-labs/ts-sdk";
import {Network} from "aptos";

const aptos = new Aptos(new AptosConfig({network: Network.TESTNET}));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function GetAptosClient(): Aptos {
    return aptos;
}
