const { AptosClient, AptosAccount, HexString, TxnBuilderTypes, BCS } = require("aptos");

// Initialize the Aptos client
const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

// Replace with your deployed module address
const MODULE_ADDRESS = ''; // The address where you deployed the module

function createAccount(privateKeyHex) {
    const privateKey = HexString.ensure(privateKeyHex).toUint8Array();
    return new AptosAccount(privateKey);
  }

async function lockCoinsForSwap(coinOwner, nftOwnerAddress, amount) {
    const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::launchpad::lock_coins_for_nft_swap`,
        type_arguments: [],
        arguments: [
        nftOwnerAddress,
        amount.toString()
        ]
    };

    const txnRequest = await client.generateTransaction(coinOwner.address(), payload);
    const signedTxn = await client.signTransaction(coinOwner, txnRequest);
    const pendingTxn = await client.submitTransaction(signedTxn);
    const txnResult = await client.waitForTransactionWithResult(pendingTxn.hash);

    console.log(`Coins locked by ${coinOwner.address().hex()} for NFT swap.`);
    if (!txnResult.success) {
        console.error('Transaction failed:', txnResult.vm_status);
    }
}

async function completeNftSwap(nftOwner, coinOwnerAddress, creator, collection, name, propertyVersion) {
    const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::launchpad::complete_nft_swap`,
        type_arguments: [],
        arguments: [
        coinOwnerAddress,
        creator,
        collection,
        name,
        propertyVersion.toString()
        ]
    };

    const txnRequest = await client.generateTransaction(nftOwner.address(), payload);
    const signedTxn = await client.signTransaction(nftOwner, txnRequest);
    const pendingTxn = await client.submitTransaction(signedTxn);
    const txnResult = await client.waitForTransactionWithResult(pendingTxn.hash);

    console.log(`NFT swap completed by ${nftOwner.address().hex()}`);
    if (!txnResult.success) {
        console.error('Transaction failed:', txnResult.vm_status);
    }
}

async function main() {
    try {
        // Replace with actual private keys
        const nftOwnerPrivateKey = "";
        const coinOwnerPrivateKey = "";

        const nftOwner = createAccount(nftOwnerPrivateKey);
        const coinOwner = createAccount(coinOwnerPrivateKey);

        // Replace these with actual values
        const creator = ""; // Creator's address
        const collection = "";
        const name = "1";
        const propertyVersion = 0;
        const price = 100; // Price in smallest coin units (e.g., 1 APT = 100000000)

        console.log('NFT Owner address:', nftOwner.address().hex());
        console.log('Coin Owner address:', coinOwner.address().hex());

        // Step 1: CoinOwner locks coins for the NFT purchase
        await lockCoinsForSwap(coinOwner, nftOwner.address().hex(), price);

        // Step 2: NftOwner completes the swap by transferring the NFT and releasing the coins
        await completeNftSwap(nftOwner, coinOwner.address().hex(), creator, collection, name, propertyVersion);
    } catch (error) {
        console.error("Error in main function:", error.message);
    }
}



main();