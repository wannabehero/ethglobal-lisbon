import { ethers } from "hardhat";
import { LATEST_BUREAU, ZK_VERIFIER } from "./const";

async function main() {
  const bureau = await ethers.getContractAt("CryptoBureau", LATEST_BUREAU);
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
