import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import products from "./products.json";

const usdcAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const shrimpAddress = new PublicKey("4AHDENUSystAUR3VEgcUFLYAVL4BGNhLgq8uaAaKoQKq");
const bonkAddress = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");
const sellerAddress = "7c2eCm4MnwiVxeCv3MfrMabKRyzwMez5bCnSjPudqN61";
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    const { buyer, orderID, itemID } = req.body;
    if (!buyer) {
      res.status(400).json({
        message: "Missing buyer address",
      });
    }

    if (!orderID) {
      res.status(400).json({
        message: "Missing order ID",
      });
    }

    const itemPrice = products.find((item) => item.id === itemID).price;
    const tokenType = products.find((item) => item.id === itemID).tokenType;

    if (!itemPrice) {
      res.status(404).json({
        message: "Item not found. please check item ID",
      });
    }

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);

    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    const buyerbonkAddress = await getAssociatedTokenAddress(bonkAddress, buyerPublicKey);
    const shopbonkAddress = await getAssociatedTokenAddress(bonkAddress, sellerPublicKey);
    const buyershrimpAddress = await getAssociatedTokenAddress(shrimpAddress, buyerPublicKey);
    const shopshrimpAddress = await getAssociatedTokenAddress(shrimpAddress, sellerPublicKey);
    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    
    // This is new, we're getting the mint address of the token we want to transfer
    const usdcMint = await getMint(connection, usdcAddress);
    const shrimpMint = await getMint(connection, shrimpAddress);
    const bonkMint = await getMint(connection, bonkAddress);
    
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });
    
  // Here we're creating a different type of transfer instruction
  if( tokenType === "shrimp"){const transferInstruction = createTransferCheckedInstruction(
    buyershrimpAddress, 
    shrimpAddress,     // This is the address of the token we want to transfer
    shopshrimpAddress, 
    buyerPublicKey, 
    bigAmount.toNumber() * 10 ** (await shrimpMint).decimals, 
    shrimpMint.decimals // The token could have any number of decimals
  );
   // The rest remains the same :)
   transferInstruction.keys.push({
    pubkey: new PublicKey(orderID),
    isSigner: false,
    isWritable: false,
  });
  

  tx.add(transferInstruction);}

  //

   // Here we're creating a different type of transfer instruction
   if( tokenType === "bonk"){const transferInstruction = createTransferCheckedInstruction(
    buyerbonkAddress, 
    bonkAddress,     // This is the address of the token we want to transfer
    shopbonkAddress, 
    buyerPublicKey, 
    bigAmount.toNumber() * 10 ** (await bonkMint).decimals, 
    bonkMint.decimals // The token could have any number of decimals
  );
   // The rest remains the same :)
   transferInstruction.keys.push({
    pubkey: new PublicKey(orderID),
    isSigner: false,
    isWritable: false,
  });
  

  tx.add(transferInstruction);}



  //
  

    // Here we're creating a different type of transfer instruction
    if( tokenType === "usdc"){ const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress, 
      usdcAddress,     // This is the address of the token we want to transfer
      shopUsdcAddress, 
      buyerPublicKey, 
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals, 
      usdcMint.decimals // The token could have any number of decimals
    );

    // The rest remains the same :)
    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);}

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "error creating transaction" });
    return;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}