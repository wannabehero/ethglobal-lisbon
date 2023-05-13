import { ethers } from "hardhat";


async function main() {
  const ZKVerifier = await ethers.getContractFactory("Verifier");
  const verifier = await ZKVerifier.deploy();

  await verifier.deployed();

  console.log("Verifier deployed to:", verifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
