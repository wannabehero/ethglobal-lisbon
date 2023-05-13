import { BigNumber, Contract, ethers } from 'ethers';

import CryptoBureau from '../artifacts/CryptoBureau.json';
import { CRYPTO_BUREAU_ADDRESS } from './consts';
import { provider } from './wallet';

export type Provider = ethers.providers.Provider;
export type Signer = ethers.Signer;

const CryptoBureauInterface = new ethers.utils.Interface(CryptoBureau.abi);
// const ERC20LenderInterface = new ethers.utils.Interface(ERC20Lender.abi);

export async function getCryptoBureau(provider: Provider): Promise<Contract> {
    const cryptoBureau = new ethers.Contract(CRYPTO_BUREAU_ADDRESS, CryptoBureauInterface, provider);
    return cryptoBureau;
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

