import { ethers } from "hardhat";

async function main() {
  const bureau = await ethers.getContractAt("CryptoBureau", "0xd8A8C4BB1eb794892e8DD64776A627b8a5EE7d1a");
  const CismoHelper = await ethers.getContractFactory("CismoHelper");
  const helper = await CismoHelper.deploy(
    bureau.address,
    "0x2d50ca0a1c74f4c2a562a2755b1bb6f0",
    "0x8b64c959a715c6b10aa8372100071ca7",
  );
  await helper.deployed();

  await bureau.setHelper(helper.address, {
    multiplier: 1.5,
  });

  console.log("CismoHelper deployed to:", helper.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
