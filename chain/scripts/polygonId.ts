import { ethers } from "hardhat";
import { CryptoBureau, PolygonIdHelper } from "../typechain-types";

export async function deploy(bureau: CryptoBureau) {
  const PolygonIdHelper = await ethers.getContractFactory("PolygonIdHelper", {
    libraries: {
      SpongePoseidon: "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153",
      PoseidonUnit6L: "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7"
    },
  } );
  const helper = await PolygonIdHelper.deploy(bureau.address);
  await helper.deployed();
  console.log("PolygonIdHelper address:", helper.address);
  return helper;
}

export async function setInBureau(bureau: CryptoBureau, helper: PolygonIdHelper) {
  await bureau.setHelper(helper.address, {
    multiplier: ethers.utils.parseEther("1.1"),
  }).then((tx) => tx.wait());
}

export async function setZKPRequest(helper: PolygonIdHelper) {
  // KYC
  // // you can run https://go.dev/play/p/rnrRbxXTRY6 to get schema hash and claimPathKey using YOUR schema
  // const schemaBigInt = "74977327600848231385663280181476307657"
  //  // merklized path to field in the W3C credential according to JSONLD  schema e.g. birthday in the KYCAgeCredential under the url "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
  // const schemaClaimPathKey = "20376033832371109177683048456014525905119173674985843915445634726167450989630"

  // Diploma
  // generated with https://go.dev/play/p/P4-PSKF-ihG
  const schemaBigInt = "238194148390727052630409939902286551072"
  const schemaClaimPathKey = "4733956571025984262884587616230959074711837039774257046884151643564198805767";

  const requestId = 1;

  const query = {
    schema: schemaBigInt,
    claimPathKey: schemaClaimPathKey,
    operator: 3, // greater than
    value: [95, ...new Array(63).fill(0).map(i => 0)],
  };

  const validatorAddress = "0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450"; // sig validator
  // const validatorAddress = "0x3DcAe4c8d94359D31e4C89D7F2b944859408C618"; // mtp validator

  await helper.setZKPRequest(
    requestId,
    validatorAddress,
    query.schema,
    query.claimPathKey,
    query.operator,
    query.value
  ).then((tx) => tx.wait());
  console.log("Request set");
}
