import { ethers, run } from "hardhat";
// import "@nomicfoundation/hardhat-verify";
require('dotenv').config()

async function main() {
  const merkleRoot = process.env.MERKLE_ROOT || ""
  const MaxxAirdrop = await ethers.getContractFactory("MaxxAirdrop");
  const maxxAirdrop = await MaxxAirdrop.deploy(merkleRoot);

  await maxxAirdrop.deployed();
  console.log(`MaxxAirdrop deployed to ${maxxAirdrop.address}`);

  await run("verify:verify", {
    address: maxxAirdrop.address,
    constructorArguments: [merkleRoot],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
