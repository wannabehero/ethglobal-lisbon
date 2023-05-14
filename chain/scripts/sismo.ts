import { ethers } from "hardhat";
import { SISMO_APP_ID } from "./const";
import { CryptoBureau } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const SismoHelper = await ethers.getContractFactory("SismoHelper");
  const helper = await SismoHelper.deploy(
    bureau.address,
    SISMO_APP_ID
  );
  await helper.deployed();

  await bureau.setHelper(helper.address, {
    multiplier: ethers.utils.parseEther("1.5"),
  });

  console.log("SismoHelper deployed to:", helper.address);

  return helper;
}
