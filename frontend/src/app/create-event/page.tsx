'use client';
import {useState} from "react";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {LabeledInput} from "@/components/ui/labeled-input";
import {DateTimeInput} from "@/components/ui/date-time-input";
import {ConfirmButton} from "@/components/ui/confirm-button";
import {SubmitEvent} from "@/communication/EventComms";
import {EventInterface} from "@/interface/EventInterface";
import {ShowNotification} from "@/components/NotificationService";
import LabeledArea from "@/components/ui/labeled-area";

export default function CreateCollection() {
    const {account} = useWallet();

    const [publicMintStartDate, setPublicMintStartDate] = useState<Date>();
    const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
    const [publicMintEndDate, setPublicMintEndDate] = useState<Date>();
    const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
    const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(999);
    const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();
    const [eventDescription, setEventDescription] = useState<string>("No description provided");
    const [eventLink, setEventLink] = useState<string>("No link provided");
    const [eventImage, setEventImage] = useState<string>("https://i.imgur.com/gsALUPb.jpeg");
    const [eventTitle, setEventTitle] = useState<string>("No title provided");
    const [eventLocation, setEventLocation] = useState<string>("no location provided");


    const onPublicMintStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = event.target.value;
        setPublicMintStartTime(timeValue);

        const [hours, minutes] = timeValue.split(":").map(Number);

        publicMintStartDate?.setHours(hours);
        publicMintStartDate?.setMinutes(minutes);
        publicMintStartDate?.setSeconds(0);
        setPublicMintStartDate(publicMintStartDate);
    };

    const onPublicMintEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = event.target.value;
        setPublicMintEndTime(timeValue);

        const [hours, minutes] = timeValue.split(":").map(Number);

        publicMintEndDate?.setHours(hours);
        publicMintEndDate?.setMinutes(minutes);
        publicMintEndDate?.setSeconds(0);
        setPublicMintEndDate(publicMintEndDate);
    };

    const onCreateCollection = async () => {
        try {
            if (!account) throw new Error("Please connect your wallet");

            const event: EventInterface = {
                collectionID: "UNDEFINED",

                // no relevant here
                ticketsLeft: 0,
                ticketsTrades: 0,

                title: eventTitle,
                location: eventLocation,
                image: eventImage,
                link: eventLink,
                date: publicMintStartDate?.toString() || "",
                description: eventDescription,
                publicMintEndDate: publicMintEndDate,
                publicMintStartDate: publicMintStartDate,
                price: publicMintFeePerNFT || 999,
                initialTicketPool: publicMintLimitPerAccount,
            };

            await SubmitEvent(event);
        } catch (error) {
            ShowNotification("error", "Collection creation failed!");
        }
    };

    return (
        <div className={"my-[10vh]"}>
            <div
                className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
                <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
                    <LabeledInput
                        id="title"
                        required
                        label="Provide some catchy title for your event"
                        tooltip="Allow user to quickly understand what your event is about or simply recognize it"
                        disabled={!account}
                        onChange={(e) => {
                            setEventTitle(e.target.value);
                        }}
                        type={"text"}
                    />

                    <LabeledInput
                        id="location"
                        required
                        label="Event location"
                        tooltip="Let people know where your event is taking place"
                        disabled={!account}
                        onChange={(e) => {
                            setEventLocation(e.target.value);
                        }}
                        type={"text"}
                    />

                    <LabeledArea
                        id="Description"
                        required
                        label="Event description"
                        tooltip="Provide some details about your event, like what it is about, what people can expect, etc."
                        disabled={!account}
                        onChange={(e) => {
                            setEventDescription(e.target.value);
                        }}
                        className={"h-[30vh]"}
                    />

                    <div className="flex item-center gap-4 mt-4">
                        <DateTimeInput
                            id="mint-start"
                            label="Ticket sell start date"
                            tooltip="When tickets will be available for purchase"
                            disabled={!account}
                            date={publicMintStartDate}
                            onDateChange={setPublicMintStartDate}
                            time={publicMintStartTime}
                            onTimeChange={onPublicMintStartTime}
                            className="basis-1/2"
                        />

                        <DateTimeInput
                            id="mint-end"
                            label="Ticket sale end date"
                            tooltip="When tickets will no longer be available for purchase"
                            disabled={!account}
                            date={publicMintEndDate}
                            onDateChange={setPublicMintEndDate}
                            time={publicMintEndTime}
                            onTimeChange={onPublicMintEndTime}
                            className="basis-1/2"
                        />
                    </div>

                    <LabeledInput
                        id="event-link"
                        required
                        label="Link to your event"
                        tooltip="Provide some additional materials for buyers"
                        disabled={!account}
                        onChange={(e) => {
                            setEventLink(e.target.value);
                        }}
                        type={"text"}
                    />

                    <LabeledInput
                        id="img-link"
                        required
                        label="Link to your event image"
                        tooltip="Allow use to quickly recognize your event"
                        disabled={!account}
                        onChange={(e) => {
                            setEventImage(e.target.value);
                        }}
                        type={"text"}
                    />

                    <LabeledInput
                        id="ticket-pool"
                        required
                        label="Amount of tickets in this event"
                        tooltip="How many tickets will be available for this event"
                        disabled={!account}
                        onChange={(e) => {
                            setPublicMintLimitPerAccount(parseInt(e.target.value));
                        }}
                    />

                    <LabeledInput
                        id="mint-fee"
                        label="Ticket price"
                        tooltip="Ticket price denominated in APT"
                        disabled={!account}
                        onChange={(e) => {
                            setPublicMintFeePerNFT(Number(e.target.value));
                        }}
                        required
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
        </div>
    );
}
