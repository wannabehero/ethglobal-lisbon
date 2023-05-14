import { ethers } from "hardhat";
import { DAI, jEUR } from "./const";
import { CryptoBureau, ERC20Lender } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const Lender = await ethers.getContractFactory("ERC20Lender");
  const lender = await Lender.deploy(
    bureau.address,
    jEUR,
    DAI
  );

  await lender.deployed();
  console.log("ERC20Lender deployed to:", lender.address);
  return lender;
}

export async function setInBureau(bureau: CryptoBureau, lender: ERC20Lender) {
  await bureau.setLender(lender.address, true).then((tx) => tx.wait());
  console.log("Lender set in bureau");
}

export async function topUp(lender: ERC20Lender) {
  const lendingToken = await ethers.getContractAt("IERC20", jEUR);
  await lendingToken.transfer(lender.address, ethers.utils.parseEther("200")).then((tx) => tx.wait());
  console.log("Lender received 200 jEUR");
}

export async function load(address: string) {
  return await ethers.getContractAt("ERC20Lender", address);
}
