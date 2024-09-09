const { AptosClient, AptosAccount, HexString, TxnBuilderTypes, BCS } = require("aptos");

// Initialize the Aptos client
const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

// Replace with your deployed module address
const MODULE_ADDRESS = '0x037b2e7c51a9cd60116b00c9bdb8e23ce57254a787b602fd2b3a105dcd961ba7'; // The address where you deployed the module

// Function to create an AptosAccount from a private key
function createExistingAccount(privateKeyHex) {
  const privateKey = HexString.ensure(privateKeyHex).toUint8Array();
  return new AptosAccount(privateKey);
}

async function mintNFT(sender, collectionObjectId, amount) {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::launchpad::mint_nft`,
    type_arguments: [],
    arguments: [
      collectionObjectId,
      amount
    ]
  };

  const txnRequest = await client.generateTransaction(sender.address(), payload);
  const signedTxn = await client.signTransaction(sender, txnRequest);
  const pendingTxn = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(pendingTxn.hash);

  console.log(`NFT minting transaction completed. Transaction hash: ${pendingTxn.hash}`);
}

async function main() {
  // Replace with your actual private key
  const privateKeyHex = ""; // Your private key here
  const sender = createExistingAccount(privateKeyHex);

  // Replace with your actual collection object ID
  const collectionObject = ""; // Your collection object ID here
  const amountToMint = 1; // Number of NFTs to mint

  try {
    await mintNFT(sender, collectionObject, amountToMint);
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

main();