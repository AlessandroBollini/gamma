require("dotenv").config();
const contract=process.env.CONTRACT;

async function main(){
    const nft = await hre.ethers.getContractAt("TestEnv", contract);
    const data=await nft.tokenURI(3);
    console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });