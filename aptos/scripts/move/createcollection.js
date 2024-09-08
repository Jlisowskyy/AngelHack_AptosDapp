const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require("aptos");

// Initialize the Aptos client
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');

// Replace with your deployed module address
const MODULE_ADDRESS = '0x123...'; // The address where you deployed the module

async function createCollection(
  creator,
  description,
  name,
  uri,
  maxSupply,
  royaltyPercentage,
  preMintAmount,
  allowlist,
  allowlistStartTime,
  allowlistEndTime,
  allowlistMintLimitPerAddr,
  allowlistMintFeePerNft,
  publicMintStartTime,
  publicMintEndTime,
  publicMintLimitPerAddr,
  publicMintFeePerNft
) {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::your_module_name::create_collection`,
    type_arguments: [],
    arguments: [
      description,
      name,
      uri,
      maxSupply,
      royaltyPercentage,
      preMintAmount,
      allowlist,
      allowlistStartTime,
      allowlistEndTime,
      allowlistMintLimitPerAddr,
      allowlistMintFeePerNft,
      publicMintStartTime,
      publicMintEndTime,
      publicMintLimitPerAddr,
      publicMintFeePerNft
    ]
  };

  const txnRequest = await client.generateTransaction(creator.address(), payload);
  const signedTxn = await client.signTransaction(creator, txnRequest);
  const pendingTxn = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(pendingTxn.hash);

  console.log(`Collection creation transaction completed. Transaction hash: ${pendingTxn.hash}`);
}

// Example usage
async function main() {
  const creator = new AptosAccount(); // Replace with actual creator account

  try {
    await createCollection(
      creator,
      "My awesome NFT collection",
      "AwesomeNFTs",
      "https://my-nft-collection.com/",
      1000, // max supply
      5, // 5% royalty
      10, // pre-mint 10 NFTs
      ["0x1", "0x2", "0x3"], // allowlist
      Math.floor(Date.now() / 1000), // allowlist start in 1 hour
      Math.floor(Date.now() / 1000) + 1, // allowlist end in 2 hours
      1, // allowlist mint limit per address
      100, // allowlist mint fee 1 APT (100000000 octas)
      Math.floor(Date.now() / 1000) + 1, // public mint start in 3 hours
      Math.floor(Date.now() / 1000) + 864000, // public mint end in 24 hours
      2, // public mint limit per address
      200 // public mint fee 2 APT (200000000 octas)
    );
  } catch (error) {
    console.error("Error creating collection:", error);
  }
}

main();