export interface TradeApolloInterface {
    trade_id: number; // ID of the trade
    price: number; // Price of the ticket in the trade
    seller: string; // Name of seller in the trade
    collection_address: string; // Address of the collection
    status: number; // Status of the trade
}