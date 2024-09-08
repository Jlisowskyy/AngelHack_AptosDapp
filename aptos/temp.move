/// Pay for mint
fun pay_for_mint(sender: &signer, mint_fee: u64) acquires Config {
    if (mint_fee > 0) {
        aptos_account::transfer(sender, get_mint_fee_collector(), mint_fee);
    }
}


struct TradeStruct {
    tradePrice: u64,
    tradeSeller: String,
    tradeSellerAddress: address,
}

fun initiaite_trade(
    tradeSellerAddress: address,

)

    public entry fun swap_nft_for_coins(
        nft_owner_addr: address,
        coin_owner_addr: address,
        creator: address,
        collection: vector<u8>,
        name: vector<u8>,
        property_version: u64,
        price_in_octas: u64
    ) {
        // Create the token ID
        let token_id = token::create_token_id_raw(creator, collection, name, property_version);

        // Transfer the NFT from nft_owner to coin_owner
        token::transfer_with_opt_in(nft_owner_addr, token_id, coin_owner_addr, 1);

        // Transfer the coins from coin_owner to nft_owner
        coin::transfer<AptosCoin>(coin_owner_addr, nft_owner_addr, price_in_octas);
    }



module nft_swap_module {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token::token;

    struct ListedNFT has key {
        token_id: token::TokenId,
        price: u64,
    }

    public entry fun list_nft(account: &signer, creator: address, collection: vector<u8>, name: vector<u8>, property_version: u64, price: u64) {
        let token_id = token::create_token_id_raw(creator, collection, name, property_version);
        
        // Transfer the NFT to this module
        token::transfer(account, token_id, @nft_swap_module, 1);
        
        // Create and move the ListedNFT resource to the seller's account
        move_to(account, ListedNFT { token_id, price });
    }

    public entry fun buy_nft(buyer: &signer, seller: address) acquires ListedNFT {
        let listed_nft = move_from<ListedNFT>(seller);
        let ListedNFT { token_id, price } = listed_nft;

        // Transfer the payment
        coin::transfer<AptosCoin>(buyer, seller, price);

        // Transfer the NFT to the buyer
        token::transfer(@nft_swap_module, token_id, signer::address_of(buyer), 1);
    }

    public entry fun cancel_listing(seller: &signer) acquires ListedNFT {
        let listed_nft = move_from<ListedNFT>(signer::address_of(seller));
        let ListedNFT { token_id, price: _ } = listed_nft;

        // Transfer the NFT back to the seller
        token::transfer(@nft_swap_module, token_id, signer::address_of(seller), 1);
    }
}




public entry fun offer_script(
        sender: signer,
        receiver: address,
        creator: address,
        collection: String,
        name: String,
        property_version: u64,
        amount: u64,
    ) acquires PendingClaims {
        let token_id = token::create_token_id_raw(creator, collection, name, property_version);
        offer(&sender, receiver, token_id, amount);
    }

    public fun offer(
        sender: &signer,
        receiver: address,
        token_id: TokenId,
        amount: u64,
    ) acquires PendingClaims {
        let sender_addr = signer::address_of(sender);
        if (!exists<PendingClaims>(sender_addr)) {
            initialize_token_transfers(sender)
        };

        let pending_claims =
            &mut borrow_global_mut<PendingClaims>(sender_addr).pending_claims;
        let token_offer_id = create_token_offer_id(receiver, token_id);
        let token = token::withdraw_token(sender, token_id, amount);
        if (!table::contains(pending_claims, token_offer_id)) {
            table::add(pending_claims, token_offer_id, token);
        } else {
            let dst_token = table::borrow_mut(pending_claims, token_offer_id);
            token::merge(dst_token, token);
        };

        if (std::features::module_event_migration_enabled()) {
            event::emit(
                TokenOffer {
                    to_address: receiver,
                    token_id,
                    amount,
                }
            )
        };
        event::emit_event<TokenOfferEvent>(
            &mut borrow_global_mut<PendingClaims>(sender_addr).offer_events,
            TokenOfferEvent {
                to_address: receiver,
                token_id,
                amount,
            },
        );
    }



/// Swaps an NFT for Aptos coins
/// @param nft_owner_addr: The address of the NFT owner
/// @param coin_owner_addr: The address of the coin owner
/// @param creator: The creator of the NFT
/// @param collection: The collection name of the NFT
/// @param name: The name of the NFT
/// @param property_version: The property version of the NFT
/// @param price_in_octas: The price in octas (1 APT = 10^8 octas)
public entry fun swap_nft_for_coins(
    nft_owner_addr: address,
    coin_owner_addr: address,
    creator: address,
    collection: vector<u8>,
    name: vector<u8>,
    property_version: u64,
    price_in_octas: u64
) {
    // Create the token ID
    let token_id = token::create_token_id_raw(creator, collection, name, property_version);

    // Transfer the NFT from nft_owner to coin_owner
    token::transfer(nft_owner_addr, token_id, coin_owner_addr, 1);

    // Transfer the coins from coin_owner to nft_owner
    coin::transfer<AptosCoin>(coin_owner_addr, nft_owner_addr, price_in_octas);
}