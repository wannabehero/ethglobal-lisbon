import { ClaimRequest, SismoConnectClientConfig } from "@sismo-core/sismo-connect-client";

export const WORLD_ID_APP_ID = 'app_staging_84dd85a2ac852d698c11c8eca5d33096';
export const WORLD_ID_APP_ACTION = 'register';
export const WORLD_ID_APP_SIGNAL = 'bureau-claim';

export const SISMO_CONFIG: SismoConnectClientConfig = {
  // you will need to get an appId from the Factory
  appId: '0x2d50ca0a1c74f4c2a562a2755b1bb6f0',
  // allows to create valid proofs for specific addresses
  // should only be used when prototyping
  // default: undefined
  devMode: {
    // will use the Dev Sismo Data Vault https://dev.vault-beta.sismo.io/
    enabled: true,
    // overrides a group with these addresses
    devGroups: [
      {
        groupId: '0x8b64c959a715c6b10aa8372100071ca7',
        data: {
          '0x3C9Fd1778463066a8614B2B2F7CfBdf5491F4875': 0,
          '0x76e7DB3Ee732c3C668b4B78B7D0643339C63493e': 1,
        },
      },
    ],
  },
};

// claim 1: request a proof of ENS handle ownership
export const SISMO_CLAIM: ClaimRequest = {
  // ID of the group the user should be a member of
  // here: ens-domains-holders
  groupId: '0x8b64c959a715c6b10aa8372100071ca7',
};
