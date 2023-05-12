import { ethers } from "hardhat";
import { WORLD_ID_ACTION_ID, WORLD_ID_ADDRESS, WORLD_ID_APP_ID } from "./consts";

const USDC = "0xe9dce89b076ba6107bb64ef30678efec11939234";
const jEUR = "0x6bF2BC4BD4277737bd50cF377851eCF81B62e320";

async function main() {
  const CryptoBureau = await ethers.getContractFactory("CryptoBureau");
  const bureau = await CryptoBureau.deploy(
    WORLD_ID_ADDRESS,
    WORLD_ID_APP_ID,
    WORLD_ID_ACTION_ID,
  );

  await bureau.deployed();

  console.log("CryptoBureau deployed to:", bureau.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
