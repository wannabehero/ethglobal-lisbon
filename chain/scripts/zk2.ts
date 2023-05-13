import * as fs from "fs";
import { exec } from "child_process";
import { ethers } from "hardhat";

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
  const target = 100;

  const address = "0xE432a8314d971441Ad7700e8b45d66cC326CE517";

  await zokratesCmd(`zokrates compute-witness -o ${address} -a ${income} ${target}`);
  await zokratesCmd(`zokrates generate-proof -w ${address} -j ${address}.proof.json`);

  const { proof } = JSON.parse(fs.readFileSync(`./circuits/${address}.proof.json`).toString('utf-8'));

  const verifier = await deploy();

  console.log(await verifier.verifyTx(proof as any, [target]));
}

async function checkProof() {
  const proof = {"a":["0x2bbc231ef22ef5a5017c6be73225e146f5391825eca4e020ae3f136a84287287","0x076a9ecb98421a7a5756649be22c886285893a0380f91406059cef2379341d6a"],"b":[["0x0256d006968948c0f85617282211bbe87a2e37fbbaf586c4d5d5fdcb8743377d","0x0a28e81cab9ee87d5415456a3f32ecb7683fcc01a9550abf1bf706d014489ef6"],["0x20aa85f7b11382faff7240de38e8cc7ca9aa502c8a9de63c005bc9591805e3f8","0x24ede656d8cd4dcf4642ba03de3e2009a0390f7a3498940c2a05e4d8f1999427"]],"c":["0x1e4294d0fbb6a96c7543da66d7b1fa250f54c0c1ff2ea160879570d8710c3ed8","0x21a7e11efae7f7b42dbd3aac3450b92226e2634903879d12e984b2757f7f913b"]};
  const verifier = await deploy();

  console.log(await verifier.verifyTx(proof as any, [100]));
}

checkProof().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
