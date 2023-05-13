import { ethers } from "hardhat";
import { LATEST_BUREAU, DAI, jEUR } from "./const";

async function main() {
  const bureau = await ethers.getContractAt("CryptoBureau", LATEST_BUREAU);
  const Lender = await ethers.getContractFactory("ERC20Lender");
  const lender = await Lender.deploy(
    bureau.address,
    jEUR,
    DAI
  );

  console.log("ERC20Lender deployed to:", lender.address);
}

async function setLender() {
  const bureau = await ethers.getContractAt("CryptoBureau", LATEST_BUREAU);
  const lender = await ethers.getContractAt("ERC20Lender", "0xF82329760FD41E346Bd7A9297dA1E5C01DC08bbf");

  await bureau.setLender(lender.address, true);
}

setLender().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
