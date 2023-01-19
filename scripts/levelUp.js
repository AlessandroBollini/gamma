require("dotenv").config();
const controller = require('../database/controller');
const alch = require('alchemy-sdk');
const ethers = require('ethers');
const contract = require("../artifacts/contracts/TestEnv.sol/TestEnv.json");

async function main() {
  const alchemy = new alch.Alchemy({ apiKey: process.env.ALCHEMY_MUMBAI_KEY, network: alch.Network.MATIC_MUMBAI, maxRetries: 30 });
  const provider = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_MUMBAI_KEY);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = contract.abi;
  const myNftContract = new ethers.Contract(process.env.CONTRACT, abi, signer);
  const tokenId = process.env.TOKEN_ID;
  const userWallet = process.env.USERWALLET;
  const oldLevel = await controller.findUser(userWallet);
  const newLevel = oldLevel.level.concat('1');
  const level = parseInt(newLevel, 2);
  let nftTxn = await myNftContract.performUpkeep(tokenId, 2);
  await nftTxn.wait();
  await alchemy.nft.refreshNftMetadata(userWallet, tokenId);
  await controller.updateUser(tokenId, newLevel);
  console.log("nft Updated");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });