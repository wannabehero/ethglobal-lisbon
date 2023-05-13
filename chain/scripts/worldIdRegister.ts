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
    "0x25acd694a346875daedafef939bb61ad8a9b6bfcd7ef0069a60dda5abd382d6c0f5124b47d9cbd138260f455fea3a32098de54ac341c13980757894165222f300eba59e2eb640d199649c11eb5873e624584625f0e280e9cf732162f70433a0129e8852efd813feb4c6456c853c8be91c9622f1839e31271dae769c87894c6e70fe74d6cae5da83acfdb941bab35e5406352d23cd4dceb5cd9dafb2cb2bfe9db19f5feb004a7c3b028748051692663ba2c0219a0d54f65de3da9b2fa4462b74908676ce3071b97739fb881aa6307e4444915462e5fd0d4c76ac0eaf5e353aa0721379adecca6a746a0df7eba9815fd1fe4e23baf119213db40ad3949a338c34a",
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
