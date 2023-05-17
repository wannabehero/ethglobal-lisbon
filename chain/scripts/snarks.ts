import { ethers } from "hardhat";
// @ts-ignore snarksjs is not typed
import * as snarkjs from "snarkjs";

async function deploy() {
  const PlonkVerifier = await ethers.getContractFactory("PlonkVerifier");
  const verifier = await PlonkVerifier.deploy();
  await verifier.deployed();
  console.log("PlonkVerifier deployed to:", verifier.address);
  return verifier;
}

async function run() {
  const payload = { income: 210, target: 100 };
  const { proof, publicSignals } = await snarkjs.plonk.fullProve(
    payload,
    "snarks/gte_js/gte.wasm",
    "snarks/gte_plonk.zkey"
  );

  const calldata: string = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

  const verifier = await deploy();

  const [, ...params] = calldata.match(/^(0x[\w]+),(\[.+\])$/)!;

  const success = await verifier.verifyProof(params[0], [1, 100]);

  console.log("success", success);
}

run().then(() => {
  process.exit(0);
});