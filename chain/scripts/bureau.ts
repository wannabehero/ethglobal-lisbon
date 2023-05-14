import { ethers } from "hardhat";
import { WORLD_ID_ACTION_ID, WORLD_ID_ADDRESS, WORLD_ID_APP_ID } from "./consts";

export async function deploy() {
  const CryptoBureau = await ethers.getContractFactory("CryptoBureau");
  const bureau = await CryptoBureau.deploy(
    WORLD_ID_ADDRESS,
    WORLD_ID_APP_ID,
    WORLD_ID_ACTION_ID,
  );

  await bureau.deployed();

  console.log("CryptoBureau deployed to:", bureau.address);

  return bureau;
}
