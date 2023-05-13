import { ethers } from "hardhat";
import { LATEST_BUREAU, DAI, jEUR } from "./const";

async function main() {
  const bureau = await ethers.getContractAt("CryptoBureau", LATEST_BUREAU);
  const Lender = await ethers.getContractFactory("ERC20Lender");
  const lender = await Lender.deploy(
    bureau.address,
    DAI,
    jEUR
  );

  console.log("ERC20Lender deployed to:", lender.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
