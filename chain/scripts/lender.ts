import { ethers } from "hardhat";
import { DAI, jEUR } from "./const";
import { CryptoBureau } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const Lender = await ethers.getContractFactory("ERC20Lender");
  const lender = await Lender.deploy(
    bureau.address,
    jEUR,
    DAI
  );

  await lender.deployed();
  console.log("ERC20Lender deployed to:", lender.address);

  await (await bureau.setLender(lender.address, true)).wait();
  console.log("Lender set in bureau");

  const lendingToken = await ethers.getContractAt("IERC20", jEUR);
  await (await lendingToken.transfer(lender.address, ethers.utils.parseEther("200"))).wait();
  console.log("Lender received 200 jEUR");
}
