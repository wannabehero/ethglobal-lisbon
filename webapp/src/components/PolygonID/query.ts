export const query = {
  id: "7f38a193-0918-4a48-9fac-36adfdb8b542",
  typ: "application/iden3comm-plain-json",
  type:
    "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
  thid: "7f38a193-0918-4a48-9fac-36adfdb8b542",
  body: {
    reason: "for Credit Score verification",
    transaction_data: {
      contract_address:
        // "0x533f0190046430F7C72E49976774b6A7C192b518", // kyc
        "0x0d25010ad1aDF3C0439df62281452Db6393A0973", // gpa
      method_id: "b68967e2",
      chain_id: 80001,
      network: "polygon-mumbai"
    },
    scope: [
      {
        id: 1,
        circuitId: "credentialAtomicQuerySigV2OnChain",
        query: {
          allowedIssuers: ["*"],
          context:
            // "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
            "https://raw.githubusercontent.com/wannabehero/ethglobal-lisbon/main/chain/id/diploma.jsonld",
          credentialSubject: {
            gpaScore: {
              $gt: 95
            }
          },
          type: "Diploma"
        }
      }
    ]
  }
};