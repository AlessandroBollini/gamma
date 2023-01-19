const controller = require('../database/controller');
require('dotenv').config();
const ethers = require('ethers');
const contract = require("../artifacts/contracts/TestEnv.sol/TestEnv.json");

//Chiaramente il livello va aggiornato prima di ogni evento, qui è solo indicato lo 0 come livello del primo evento
async function main() {
    const provider = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_MUMBAI_KEY);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const abi = contract.abi;
    const wallet = process.env.WALLET;
    const userWallet = process.env.USERWALLET;
    const userEmail = process.env.EMAIL;
    const myNftContract = new ethers.Contract(process.env.CONTRACT, abi, signer);
    const level = 1;
    await controller.addUser(userWallet, userEmail, level);
    const userInfo = await controller.findUser(userWallet);
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