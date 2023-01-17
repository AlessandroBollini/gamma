const controller = require('../database/controller');
require('dotenv').config();
const ethers = require('ethers');
const ALCHEMY_MUMBAI_KEY = process.env.ALCHEMY_MUMBAI_KEY;
const provider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_MUMBAI_KEY);
const contract = require("../artifacts/contracts/Env23.sol/Env23.json");
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);
const abi = contract.abi;
const contractAddress = process.env.CONTRACT;
const wallet=process.env.WALLET;
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

//Chiaramente il livello va aggiornato prima di ogni evento, qui è solo indicato lo 0 come livello del primo evento
async function main() {
    const level=1;
    const userWallet=process.env.USERWALLET;
    const userEmail=process.env.EMAIL;
    await controller.addUser(userWallet,userEmail,level);
    const userInfo=await controller.findUser(userWallet);
    let nftTxn = await myNftContract['safeTransferFrom(address,address,uint256)'](wallet, userWallet, userInfo.id);
    await nftTxn.wait();
    console.log("Transaction completed");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });