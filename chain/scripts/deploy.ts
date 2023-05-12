import { ethers } from "hardhat";

const WORLD_ID_APP_ID = process.env.WORLD_ID_APP_ID as string;
const WORLD_ID_ACTION_ID = process.env.WORLD_ID_ACTION_ID as string;

const USDC = "0xe9dce89b076ba6107bb64ef30678efec11939234";

async function main() {
  const CryptoBureau = await ethers.getContractFactory("CryptoBureau");
  const bureau = await CryptoBureau.deploy(
    "",
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
