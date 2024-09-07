export interface EventInterface {
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    link: string;
    ticketsLeft: number;
    ticketsTrades: number;
    price: number;
    tradePrice?: number;
    tradeSeller?: string;
    tradeSellerId?: string;
}