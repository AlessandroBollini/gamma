require("dotenv").config();
let Web3 = require('web3');
const web3Provider = new Web3.providers.HttpProvider(process.env.ALCHEMY_MUMBAI_URL);
let web3 = new Web3(web3Provider);
const contract = process.env.CONTRACT;
const wallet = process.env.WALLET;
const users = 20;

async function main() {
  for (let i = 1; i <= users; i++) {
    console.log(i);
    await mint();
  }
}

//Chiaramente il livello va aggiornato prima di ogni evento, qui è solo indicato lo 0 come livello del primo evento
async function mint() {
  const binLevel=0;
  const level=parseInt(binLevel,2);
  const nft = await hre.ethers.getContractAt("Env23", contract);
  await nft.safeMint(wallet, level, {
    nonce: web3.eth.getTransactionCount(process.env.WALLET, 'pending'),
  });
  console.log("Minting done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });