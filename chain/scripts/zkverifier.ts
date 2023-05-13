import * as fs from "fs";
import { ethers } from "hardhat";
import { initialize } from "zokrates-js";

// @ts-expect-error no typesdev for solc
import solc from "solc";

async function prepareZk() {
  const contents = JSON.parse(fs.readFileSync('./zk/program.json', 'utf8'));
  const artifacts = {
    ...contents,
    program: Uint8Array.from(contents.program),
  };
  const provider = await initialize();
  // @ts-expect-error bad types for zorkates
  const keypair = provider.setup(artifacts.program, 13);

  return { artifacts, keypair, provider };
}

async function deploy() {
  const { provider, keypair } = await prepareZk();
  // verifier
  const sol = provider.exportSolidityVerifier(keypair.vk);
  const { contracts } = JSON.parse(
    solc.compile(JSON.stringify({
      language: "Solidity",
      sources: {
        "Verifier.sol": {
          content: sol
        }
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"]
          }
        }
      }
    }))
  );
  const compiled = contracts["Verifier.sol"]["Verifier"];
  const [signer] = await ethers.getSigners();
  const Verifier = new ethers.ContractFactory(
    compiled.abi,
    contracts["Verifier.sol"]["Verifier"].evm.bytecode,
    signer
  );
  const verifier = await Verifier.deploy();
  console.log(`Verifier deployed to: ${verifier.address}`);
  return verifier;
}

async function checkProof() {
  const proof = {
    "a": [
      "0x0119b947b198cf44bc463ff7e9208c5197d7cb466023fb1dc41dcbec63dbc7d7",
      "0x0ae9d1088a78e14942c5e99ed72a9de2c1e095a18730097934decb3b20d1ada2"
    ],
    "b": [
      [
        "0x068a5f2c1ef64ca3398ba6b9baf86f73c23010f29b1e0fdd05f3d23b357c543d",
        "0x079c06d2d81ec8db3e1bb2dc5111d9bf44065038bd5da40ffdafc6ff92c5a859"
      ],
      [
        "0x12e3f72a1d087a691d56257a9f9e283d687ce05dcc6f326dea447dbcc064c7f6",
        "0x130191107ffe3edaa5a0213350a489a39c576bb8d3152580d2b0ce509517db53"
      ]
    ],
    "c": [
      "0x1fd3674d1fbcdc9f9ebd4057a04298e84afb1184fe269156b7e1db393ad5f0a4",
      "0x1638bef4363f8c2cbf5def0dcd75dd6fdf2fb0edd4afd61f1818229161334b3a"
    ]
  };

  const address = await deploy();

  const verifier = await deploy();
  const result = await verifier.verifyTx(proof as any, [100]);
  console.log(`Verified: ${result}`);
}

async function checkVerifier() {
  const { artifacts, keypair, provider } = await prepareZk();
  const { witness } = provider.computeWitness(artifacts, [
    "210",
    "100",
  ]);

  const generated = provider.generateProof(artifacts.program, witness, keypair.pk);

  const isVerified = provider.verify(keypair.vk, generated);
  console.log(`Proof is verified: ${isVerified}`);
  console.log(`Proof inputs: ${JSON.stringify(generated.inputs)}`);

  const verifier = await deploy();
  const result = await verifier.verifyTx(generated.proof as any, [100]);
  console.log(`On chain Verified: ${result}`);
}

checkVerifier().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
