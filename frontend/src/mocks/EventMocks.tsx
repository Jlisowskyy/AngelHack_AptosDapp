import {EventInterface} from "@/interface/EventInterface";

export const EventMocks: EventInterface[] = [
    {
        collectionID: "1",
        title: "Event 1",
        description: "Event 1 Description",
        date: "2025-01-01",
        location: "Event 1 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 100,
        ticketsTrades: 10,
        price: 1
    },
    {
        collectionID: "2",
        title: "Event 2",
        description: "Event 2 Description",
        date: "2025-01-02",
        location: "Event 2 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 200,
        ticketsTrades: 20,
        price: 2
    },
    {
        collectionID: "3",
        title: "Event 3",
        description: "Event 3 Description",
        date: "2025-01-03",
        location: "Event 3 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 300,
        ticketsTrades: 30,
        price: 3
    },
];

export const TradeMocks: EventInterface[] = [
    {
        collectionID: "2",
        title: "Event 2",
        description: "Event 2 Description",
        date: "2025-01-02",
        location: "Event 2 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 200,
        ticketsTrades: 20,
        price: 2,
        tradePrice: 1.5,
        tradeSeller: "Johny"
    },
    {
        collectionID: "3",
        title: "Event 3",
        description: "Event 3 Description",
        date: "2025-01-03",
        location: "Event 3 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 300,
        ticketsTrades: 30,
        price: 3,
        tradePrice: 2.5,
        tradeSeller: "Adam"
    }
];

export const TicketMocks: EventInterface[] = [
    {
        collectionID: "1",
        title: "Event 3",
        description: "Event 3 Description",
        date: "2025-01-03",
        location: "Event 3 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 300,
        ticketsTrades: 30,
        price: 3
    },
    {
        collectionID: "2",
        title: "Event 1",
        description: "Event 1 Description",
        date: "2025-01-01",
        location: "Event 1 Location",
        image: "https://i.imgur.com/gsALUPb.jpeg",
        link: "https://www.youtube.com/watch?v=SDPSjup6yK8",
        ticketsLeft: 100,
        ticketsTrades: 10,
        price: 1
    },
];