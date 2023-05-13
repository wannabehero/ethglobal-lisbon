import { ethers } from "hardhat";

async function deploy() {
  const bureau = await ethers.getContractAt("CryptoBureau", "0xd8A8C4BB1eb794892e8DD64776A627b8a5EE7d1a");

  const PolygonIdHelper = await ethers.getContractFactory("PolygonIdHelper", {
    libraries: {
      SpongePoseidon: "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153",
      PoseidonUnit6L: "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7"
    },
  } );
  const helper = await PolygonIdHelper.deploy(bureau.address);
  await helper.deployed();

  console.log("contract address:", helper.address);

  return helper;
}

async function main() {
  // you can run https://go.dev/play/p/rnrRbxXTRY6 to get schema hash and claimPathKey using YOUR schema
  const schemaBigInt = "74977327600848231385663280181476307657"
   // merklized path to field in the W3C credential according to JSONLD  schema e.g. birthday in the KYCAgeCredential under the url "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
  const schemaClaimPathKey = "20376033832371109177683048456014525905119173674985843915445634726167450989630"

  const requestId = 1;

  const query = {
    schema: schemaBigInt,
    claimPathKey: schemaClaimPathKey,
    operator: 2, // less than
    value: [20020101, ...new Array(63).fill(0).map(i => 0)],
  };

  const helper = await deploy();
  // const helper = await ethers.getContractAt("PolygonIdHelper", "0xAB4B07cC81f14Baf1a9Cb818536feB5D93f2135f");

  const validatorAddress = "0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450"; // sig validator
  // const validatorAddress = "0x3DcAe4c8d94359D31e4C89D7F2b944859408C618"; // mtp validator

  try {
    await helper.setZKPRequest(
        requestId,
        validatorAddress,
        query.schema,
        query.claimPathKey,
        query.operator,
        query.value
    );
    console.log("Request set");
  } catch (e) {
    console.log("error: ", e);
  }
}

main().catch((e) => {
  console.log("error: ", e);
  process.exit(1);
});