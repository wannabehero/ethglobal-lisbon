import { ethers } from "hardhat";

async function main() {
  const bureau = await ethers.getContractAt(
    "CryptoBureau",
    "0xd8A8C4BB1eb794892e8DD64776A627b8a5EE7d1a"
  );
  console.log(`Running data register...`);
  const registerData = {
    root: "0x24d20bc1d69a0bcc39b7ac3a71af9a2ce8ad0d70a2eb2615dace1eeedf0947c1",
    nullifierHash:
    "0x1a94737acf9ddc80218058d7c8a2055ce1ea218a511553d60e0dceac019fac54",
    proof:
    "0x11705a6fe7a247f4146788f6702c56e9226d9157efc0a97bc72f66ca3165cb5a0c3825a231bec3095e7406e2130c69435aa74a5d7ad35bc85efbd333e62956ee0dfff98f17968fe31dee1d8032b3d2084b08df5251e688263d35473f78e4e08d0a89719ccbf41d82f006d3830574d1d866ae5c01d67c433fd2f761a31e0c9441138bcac748df93929747edbd0bc8557591efe666a6ab5838eba4f68fa257ea2f27e1fca5780aaf197c3eb5766c42279a69e70fd18282a8c67c0d96197e10acb02aa187c2b2f4eb990c4c6605d4d427a9d04d94ff34554795de1c188ed544cf7b030d888887af8763a5291f68d1d207c7dccd07457a0cbfa8c707c110763b83c6",
  };

  const unpackedProof = ethers.utils.defaultAbiCoder.decode(
    ["uint256[8]"],
    registerData.proof
  )[0];

   console.log(`Unpacked proof: ${unpackedProof}`);

  const tx = await bureau.register(
    registerData.root,
    registerData.nullifierHash,
    unpackedProof
  );
  console.log(tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
