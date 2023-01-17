require("dotenv").config();
const controller=require('../database/controller');
const alch = require('alchemy-sdk');
const alchemy = new alch.Alchemy({ apiKey: process.env.ALCHEMY_MUMBAI_KEY, network: alch.Network.MATIC_MUMBAI, maxRetries:30 });
const ethers = require('ethers');
const ALCHEMY_MUMBAI_KEY = process.env.ALCHEMY_MUMBAI_KEY;
const provider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_MUMBAI_KEY);
const contract = require("../artifacts/contracts/Env23.sol/Env23.json");
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);
const abi = contract.abi;
const contractAddress = process.env.CONTRACT;
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

async function main(){
    const tokenId=process.env.TOKEN_ID;
    const userWallet=process.env.USERWALLET;
    const oldLevel=await controller.findUser(userWallet);
    console.log(oldLevel);
    const newLevel=oldLevel.level.concat('1');
    console.log(newLevel);
    const level=parseInt(newLevel,2);
    console.log(level);
    let nftTxn = await myNftContract.performUpkeep(tokenId,2);
    await nftTxn.wait();
    await alchemy.nft.refreshNftMetadata(userWallet,tokenId);
    await controller.updateUser(tokenId,newLevel);
    console.log("nft Updated");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });