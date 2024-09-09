export interface EventInterface {
    title: string; // Title of the event
    description: string; // Description of the event (may (should) be long)
    date: string; // Date of the event
    location: string; // Location of the event
    image: string; // link to event avatar image
    link: string; // link to the event page
    price: number; // Initial price of the ticket
    collectionID: string; // Address of the collection

    // Data from blockchain collection
    ticketsLeft: number; // Number of available tickets from event organizer
    ticketsTrades: number; // Number of active trades for this event

    // Data from trade saved on blockchain collection
    tradePrice?: number; // Price of the ticket in the trade
    tradeSeller?: string; // Name of seller in the trade
    tradeSellerId?: string; // ID of seller in the trade
    tradeTokenId?: string; // ID of token in the trade
}