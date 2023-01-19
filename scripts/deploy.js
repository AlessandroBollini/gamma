async function main() {
  const TestEnv = await hre.ethers.getContractFactory("TestEnv");
  const nft = await TestEnv.deploy();
  await nft.deployed();
  console.log("TestEnv deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
