import { ethers } from "hardhat";
import { ZK_VERIFIER } from "./const";
import { CryptoBureau } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const TrueLayerHelper = await ethers.getContractFactory("TrueLayerHelper");
  const helper = await TrueLayerHelper.deploy(
    bureau.address,
    ZK_VERIFIER
  );
  await helper.deployed();

  await bureau.setHelper(helper.address, {
    multiplier: ethers.utils.parseEther("2"),
  });

  console.log("TrueLayerHelper deployed to:", helper.address);
}
