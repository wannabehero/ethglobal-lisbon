import { Contract, ethers } from 'ethers';

import CryptoBureau from '../../../chain/artifacts/contracts/CryptoBureau.sol/CryptoBureau.json';
import SismoHelper from '../../../chain/artifacts/contracts/helpers/SismoHelper.sol/SismoHelper.json';
import TrueLayerHelper from '../../../chain/artifacts/contracts/helpers/TrueLayerHelper.sol/TrueLayerHelper.json';
import PolygonHelper from '../../../chain/artifacts/contracts/helpers/PolygonIdHelper.sol/PolygonIdHelper.json';
import Verifier from '../../../chain/artifacts/contracts/ZKVerifier.sol/Verifier.json';
import IERC20 from '../../../chain/artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json';
import ERC20Lender from '../../../chain/artifacts/contracts/ERC20Lender.sol/ERC20Lender.json';
import { CryptoBureauContract, ERC20Contract, LenderContract } from './types';
import {
  POLYGON_HELPER_ADDRESS,
  SISMO_HELPER_ADDRESS,
  TRUE_LAYER_HELPER_ADDRESS,
  ZK_VERIFIER_ADDRESS,
} from './consts';
import { HelperClaim } from '../components/MainBureau/hooks';

export type Provider = ethers.providers.Provider;
export type Signer = ethers.Signer;
export type SignerOrProvider = Provider | Signer;

const CryptoBureauInterface = new ethers.utils.Interface(CryptoBureau.abi);
const SismoHelperInterface = new ethers.utils.Interface(SismoHelper.abi);
const TrueLayerHelperInterface = new ethers.utils.Interface(TrueLayerHelper.abi);
const PolygonHelperInterface = new ethers.utils.Interface(PolygonHelper.abi);
const ZKVerifierInterface = new ethers.utils.Interface(Verifier.abi);
const ERC20LenderInterface = new ethers.utils.Interface(ERC20Lender.abi);
const ERC20Interface = new ethers.utils.Interface(IERC20.abi);

export async function getCryptoBureau(address: string, provider: SignerOrProvider): Promise<CryptoBureauContract> {
  const cryptoBureau = new ethers.Contract(address, CryptoBureauInterface, provider);
  return cryptoBureau;
}

export async function getSismoHelper(provider: SignerOrProvider): Promise<Contract> {
  const sismoHelper = new ethers.Contract(SISMO_HELPER_ADDRESS, SismoHelperInterface, provider);
  return sismoHelper;
}

export async function getTrueLayerHelper(provider: SignerOrProvider): Promise<Contract> {
  const trueLayerHelper = new ethers.Contract(
    TRUE_LAYER_HELPER_ADDRESS,
    TrueLayerHelperInterface,
    provider,
  );
  return trueLayerHelper;
}

export async function getPolygonHelper(provide: SignerOrProvider): Promise<Contract> {
  const polygonHelper = new ethers.Contract(
    POLYGON_HELPER_ADDRESS,
    PolygonHelperInterface,
    provide,
  );
  return polygonHelper;
}

export async function getZKVerifier(provider: SignerOrProvider): Promise<Contract> {
  const zkVerifier = new ethers.Contract(
    ZK_VERIFIER_ADDRESS,
    ZKVerifierInterface,
    provider,
  );
  return zkVerifier;
}

export async function getERC20Lender(address: string, provider: SignerOrProvider): Promise<LenderContract> {
  const erc20Lender = new ethers.Contract(address, ERC20LenderInterface, provider);
  return erc20Lender;
}

export async function getHelperClaims(
  bureau: CryptoBureauContract,
  address: string | undefined,
): Promise<HelperClaim[]> {
  const claims: HelperClaim[] = [
    {
      id: 'wc-id',
      verified: false,
    },
    {
      id: 'sismo-noun',
      verified: false,
    },
    {
      id: 'true-layer',
      verified: false,
    },
    {
      id: 'polygon-id',
      verified: false,
    },
  ];

  if(!address){
    console.log("No address provided, returning empty claims");
    return claims;
  }

  try {
    const [claimSismoNoun, claimFundszk, claimPolygonDiploma] = await Promise.all([
      bureau.isHelperUsed(address, SISMO_HELPER_ADDRESS),
      bureau.isHelperUsed(address, TRUE_LAYER_HELPER_ADDRESS),
      bureau.isHelperUsed(address, POLYGON_HELPER_ADDRESS),
    ]);

    // costyl to verify world id claim
    try {
      await bureau.score(address);
      claims[0].verified = true;
    } catch (e) {
      console.log(`World ID claim verification failed, consider World ID not verified: ${e}`);
    }

    // set claims
    claims[1].verified = claimSismoNoun;
    claims[2].verified = claimFundszk;
    claims[3].verified = claimPolygonDiploma;
    return claims;
  } catch (e) {
    console.log(e);
    return claims;
  }
}

export async function getERCTokenContract(address: string, providerOrSigner: Provider | Signer): Promise<ERC20Contract> {
  return new ethers.Contract(address, ERC20Interface, providerOrSigner);
}

// TODO: add calls to get Helper status for claims

// TODO: add WorldIDHelper call to verify proof

// calls to abis

// Lender Calls:
// collateralBalance for address
// borrowedBalance for address
// collateralRequired for address for amount

// export async function getCollateralBalance(address: string, provider: Provider): Promise<BigNumber> {
//     const lender = await getERC20Lender(provider);
//     const collateralBalance = await lender.collateralBalance(address);
//     return collateralBalance;
// }

// export async function getBorrowedBalance(address: string, provider: Provider): Promise<BigNumber> {
//     const lender = await getERC20Lender(provider);
//     const borrowedBalance = await lender.borrowedBalance(address);
//     return borrowedBalance;
// }

// export async function getCollateralRequired(address: string, amount: BigNumber, provider: Provider): Promise<BigNumber> {
//     const lender = await getERC20Lender(provider);
//     const collateralRequired = await lender.collateralRequired(address, amount);
//     return collateralRequired;
// }

export { TrueLayerHelper };
