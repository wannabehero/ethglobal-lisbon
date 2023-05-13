import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
// @ts-expect-error no typesdev for solc
import solc from "solc";
import { CompilationArtifacts, SetupKeypair, ZoKratesProvider } from "zokrates-js";

import { generateCircuit } from "../scripts/circuit";

interface ZK {
  provider: ZoKratesProvider;
  artifacts: CompilationArtifacts;
  keypair: SetupKeypair;
}

describe("ZKVerifier", function () {
  async function deployVerifierFixture() {
    const [signer] = await ethers.getSigners();

    const { verifier: verifierSrc, provider, artifacts, keypair } = await generateCircuit();
    const { contracts } = JSON.parse(
      solc.compile(JSON.stringify({
        language: "Solidity",
        sources: {
          "Verifier.sol": {
            content: verifierSrc
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

    const Verifier = new ethers.ContractFactory(
      compiled.abi,
      contracts["Verifier.sol"]["Verifier"].evm.bytecode,
      signer
    );

    const verifier = await Verifier.deploy();
    return {
      verifier,
      zk: {
        provider,
        artifacts,
        keypair
      }
    };
  }

  function generateProof(zk: ZK, income: number, target: number) {
    const { witness } = zk.provider.computeWitness(
      zk.artifacts,
      [
        income.toString(),
        target.toString(),
      ]
    );
    const { proof } = zk.provider.generateProof(
      zk.artifacts.program,
      witness,
      zk.keypair.pk
    );

    return proof as any;
  }

  describe("Deployment", function () {
    it("Should deploy the verifier", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      expect(verifier.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe("Verification", function () {
    it("Should verify a proof", async function () {
      const { zk, verifier } = await loadFixture(deployVerifierFixture);

      const proof0 = generateProof(zk, 210, 100);

      const verified = await verifier.verifyTx(proof0, [100]);

      expect(verified).to.equal(true);
    });
  });
});

