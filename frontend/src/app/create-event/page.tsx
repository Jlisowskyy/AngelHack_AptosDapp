'use client';
import {useState} from "react";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {LabeledInput} from "@/components/ui/labeled-input";
import {DateTimeInput} from "@/components/ui/date-time-input";
import {ConfirmButton} from "@/components/ui/confirm-button";
import {SubmitEvent} from "@/communication/EventComms";
import {EventInterface} from "@/interface/EventInterface";

export default function CreateCollection() {
    // Wallet Adapter provider
    const {account} = useWallet();

    // Collection data entered by the user on UI
    const [publicMintStartDate, setPublicMintStartDate] = useState<Date>();
    const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
    const [publicMintEndDate, setPublicMintEndDate] = useState<Date>();
    const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
    const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(1);
    const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();


    // On publish mint start date selected
    const onPublicMintStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = event.target.value;
        setPublicMintStartTime(timeValue);

        const [hours, minutes] = timeValue.split(":").map(Number);

        publicMintStartDate?.setHours(hours);
        publicMintStartDate?.setMinutes(minutes);
        publicMintStartDate?.setSeconds(0);
        setPublicMintStartDate(publicMintStartDate);
    };

    // On publish mint end date selected
    const onPublicMintEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = event.target.value;
        setPublicMintEndTime(timeValue);

        const [hours, minutes] = timeValue.split(":").map(Number);

        publicMintEndDate?.setHours(hours);
        publicMintEndDate?.setMinutes(minutes);
        publicMintEndDate?.setSeconds(0);
        setPublicMintEndDate(publicMintEndDate);
    };

    // On create collection button clicked
    const onCreateCollection = async () => {
        try {
            if (!account) throw new Error("Please connect your wallet");

            const event: EventInterface = {
                title: "Event Title",
                description: "Event Description",
                location: "Event Location",
                image: "Event Image",
                link: "Event Link",
                date: "Event Date",
                collectionID: "Collection ID",

                // no relevant here
                ticketsLeft: 0,
                ticketsTrades: 0,

                publicMintEndDate: publicMintEndDate,
                publicMintStartDate: publicMintStartDate,
                price: publicMintFeePerNFT || 999,
                initialTicketPool: publicMintLimitPerAccount,
            };

            await SubmitEvent(event);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div
                className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
                <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
                    <div className="flex item-center gap-4 mt-4">
                        <DateTimeInput
                            id="mint-start"
                            label="Public mint start date"
                            tooltip="When minting becomes active"
                            disabled={!account}
                            date={publicMintStartDate}
                            onDateChange={setPublicMintStartDate}
                            time={publicMintStartTime}
                            onTimeChange={onPublicMintStartTime}
                            className="basis-1/2"
                        />

                        <DateTimeInput
                            id="mint-end"
                            label="Public mint end date"
                            tooltip="When minting finishes"
                            disabled={!account}
                            date={publicMintEndDate}
                            onDateChange={setPublicMintEndDate}
                            time={publicMintEndTime}
                            onTimeChange={onPublicMintEndTime}
                            className="basis-1/2"
                        />
                    </div>

                    <LabeledInput
                        id="mint-limit"
                        required
                        label="Mint limit per address"
                        tooltip="How many NFTs an individual address is allowed to mint"
                        disabled={!account}
                        onChange={(e) => {
                            setPublicMintLimitPerAccount(parseInt(e.target.value));
                        }}
                    />

                    <LabeledInput
                        id="mint-fee"
                        label="Mint fee per NFT in APT"
                        tooltip="The fee the nft minter is paying the collection creator when they mint an NFT, denominated in APT"
                        disabled={!account}
                        onChange={(e) => {
                            setPublicMintFeePerNFT(Number(e.target.value));
                        }}
                    />

                    <ConfirmButton
                        title="Create Collection"
                        className="self-start"
                        onSubmit={onCreateCollection}
                        disabled={
                            !account ||
                            !publicMintStartDate ||
                            !publicMintLimitPerAccount ||
                            !account
                        }
                        confirmMessage={"good"}
                    />
                </div>
            </div>
        </>
    );
}
