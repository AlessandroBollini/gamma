async function main() {
  const Env23 = await hre.ethers.getContractFactory("Env23");
  const nft = await Env23.deploy();
  await nft.deployed();
  console.log("Env23 deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
