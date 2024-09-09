const { AptosClient, AptosAccount, TxnBuilderTypes, BCS, HexString  } = require("aptos");

// Initialize the Aptos client
const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

// Replace with your deployed module address
const MODULE_ADDRESS = '0x037b2e7c51a9cd60116b00c9bdb8e23ce57254a787b602fd2b3a105dcd961ba7'; // The address where you deployed the module

function createExistingAccount(privateKeyHex) {
  const privateKey = HexString.ensure(privateKeyHex).toUint8Array();
  return new AptosAccount(privateKey);
}

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
    function: `${MODULE_ADDRESS}::launchpad::create_collection`,
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
  const privateKeyHex = ""; // Your private key here
  const creator = createExistingAccount(privateKeyHex);

  try {
    await createCollection(
      creator,
      "My awesome NFT collection_2",
      "AwesomeNFTs_2",
      "https://my-nft-collection.com/",
      10, // max supply
      1, // royalty percent
      1, // pre-mint 
      ["0x1", "0x2", "0x3"], // allowlist
      Math.floor(Date.now() / 1000), // allowlist start
      Math.floor(Date.now() / 1000) + 10, // allowlist end
      4, // allowlist mint limit per address
      100, // allowlist mint fee 
      Math.floor(Date.now() / 1000) + 10, // public mint start 
      Math.floor(Date.now() / 1000) + 864000, // public mint end 
      4, // public mint limit per address
      200 // public mint fee in octas
    );
  } catch (error) {
    console.error("Error creating collection:", error);
  }
}

main();