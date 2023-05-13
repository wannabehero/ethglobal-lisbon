import * as fs from "fs";
import { exec } from "child_process";
import { ethers } from "hardhat";
import { ZK_VERIFIER } from "./const";

async function deploy() {
  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  console.log(`Verifier deployed to: ${verifier.address}`);
  return verifier;
}

async function zokratesCmd(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, {
      cwd: "./circuits",
    }, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        reject(error);
      } else {
        resolve(0);
      }
    });
  });
}

async function checkVerifier() {
  const income = 210;
  const target = 200;

  const address = "0xE432a8314d971441Ad7700e8b45d66cC326CE517";

  await zokratesCmd(`zokrates compute-witness -o ${address} -a ${income} ${target}`);
  await zokratesCmd(`zokrates generate-proof -w ${address} -j ${address}.proof.json`);

  const { proof } = JSON.parse(fs.readFileSync(`./circuits/${address}.proof.json`).toString('utf-8'));

  // const verifier = await deploy();
  const verifier = await ethers.getContractAt("Verifier", ZK_VERIFIER);

  console.log(await verifier.verifyTx(proof as any, [target]));
}

async function checkProof() {
  const proof = {"a":["0x253b0a594a0486fc087b0978c253dd6b6a3702655cc940442c8415dc9288912c","0x20121d5bc65386651ce3e1b5c74307ad206a3af00f9c19c3d3eba229e8b4120b"],"b":[["0x11d6e0725c6d537e7c084e5ecf111c3c3aa372b56a8e49efe7b8f75897052041","0x272329352cc982343f4c1bbe2c71827c8b9dfbe77cd4dde5bda598741cbe4333"],["0x19a1a646467bdf9374d6bbd3b15a277d973165f382b0eb6299f094de0943a384","0x08718bd4465a6889cf5e3c0202a96a540dd6164dbfbce0ee15fc278b7af134ce"]],"c":["0x185ca8aae9b8eb58f01ec8550f3c0b6243f2fa29422ed15206738e62e8924c2f","0x1a4b1497d85755806a4e6fd5c78b8fdddc6e92fed635026cb2d65056d6b99f54"]};
  // const verifier = await deploy();
  const verifier = await ethers.getContractAt("Verifier", ZK_VERIFIER);

  console.log(await verifier.verifyTx(proof as any, [200]));
}

checkVerifier().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
