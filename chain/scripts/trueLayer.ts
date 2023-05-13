import { ethers } from "hardhat";

async function main() {
  const bureau = await ethers.getContractAt("CryptoBureau", "0xd8A8C4BB1eb794892e8DD64776A627b8a5EE7d1a");
  const TrueLayerHelper = await ethers.getContractFactory("TrueLayerHelper");
  const helper = await TrueLayerHelper.deploy(
    bureau.address,
    "0x88Efb8d5473f39C37B1E6Db5f63d7d99cC57708c"
  );
  await helper.deployed();

  await bureau.setHelper(helper.address, {
    multiplier: 2,
  });

  console.log("TrueLayerHelper deployed to:", helper.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
