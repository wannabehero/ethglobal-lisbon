import { BigNumber, Contract, ethers } from 'ethers';

import CryptoBureau from '../../../chain/artifacts/contracts/CryptoBureau.sol/CryptoBureau.json';
import TrueLayerHelper from '../../../chain/artifacts/contracts/helpers/TrueLayerHelper.sol/TrueLayerHelper.json';
import Verifier from '../../../chain/artifacts/contracts/ZKVerifier.sol/Verifier.json';
import IERC20 from '../../../chain/artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json';
import ERC20Lender from '../../../chain/artifacts/contracts/ERC20Lender.sol/ERC20Lender.json';
import { CRYPTO_BUREAU_ADDRESS, TRUE_LAYER_HELPER_ADDRESS, ZK_VERIFIER_ADDRESS } from './consts';
import { ERC20Contract, LenderContract } from './types';

export type Provider = ethers.providers.Provider;
export type Signer = ethers.Signer;

const CryptoBureauInterface = new ethers.utils.Interface(CryptoBureau.abi);
const TrueLayerHelperInterface = new ethers.utils.Interface(TrueLayerHelper.abi);
const ZKVerifierInterface = new ethers.utils.Interface(Verifier.abi);
const ERC20LenderInterface = new ethers.utils.Interface(ERC20Lender.abi);
// const WorldIdHelperInterface = new ethers.utils.Interface(WorldIdHelper.abi);

const ERC20Interface = new ethers.utils.Interface(IERC20.abi);

export async function getCryptoBureau(provider: Provider): Promise<Contract> {
  const cryptoBureau = new ethers.Contract(CRYPTO_BUREAU_ADDRESS, CryptoBureauInterface, provider);
  return cryptoBureau;
}

export async function getTrueLayerHelper(providerOrSigner: Provider | Signer): Promise<Contract> {
  const trueLayerHelper = new ethers.Contract(TRUE_LAYER_HELPER_ADDRESS, TrueLayerHelperInterface, providerOrSigner);
  return trueLayerHelper;
}

export async function getZKVerifier(providerOrSigner: Provider | Signer): Promise<Contract> {
  const zkVerifier = new ethers.Contract(ZK_VERIFIER_ADDRESS, ZKVerifierInterface, providerOrSigner);
  return zkVerifier;
}

export async function getERC20Lender(address: string, providerOrSigner: Provider | Signer): Promise<LenderContract> {
  const erc20Lender = new ethers.Contract(address, ERC20LenderInterface, providerOrSigner);
  return erc20Lender;
}

export async function getScoreData(address: string, provider: Provider): Promise<BigNumber> {
  const bureau = await getCryptoBureau(provider);
  try{
    const scoreData = await bureau.scoreData(address);
    return scoreData;
  } catch (e) {
    console.log(e);
    return BigNumber.from(0);
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