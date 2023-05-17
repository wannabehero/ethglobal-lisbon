import { ethers } from "hardhat";
import { PLONK_VERIFIER } from "./const";
import { CryptoBureau, TrueLayerHelper } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const TrueLayerHelper = await ethers.getContractFactory("TrueLayerHelper");
  const helper = await TrueLayerHelper.deploy(
    bureau.address,
    PLONK_VERIFIER
  );
  await helper.deployed();

  console.log("TrueLayerHelper deployed to:", helper.address);
  return helper;
}

export async function setInBureau(bureau: CryptoBureau, helper: TrueLayerHelper) {
  await bureau.setHelper(helper.address, {
    multiplier: ethers.utils.parseEther("2"),
  }).then((tx) => tx.wait());
}

export async function load(address: string) {
  return await ethers.getContractAt("TrueLayerHelper", address);
}
