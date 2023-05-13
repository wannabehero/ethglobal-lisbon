import { useAccount } from "wagmi";
import useContract from "../../hooks/useContract";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Typography } from "antd";
import { getERCTokenContract } from "../../web3/contracts";

interface TokenInfoProps {
  token: string;
}

const TokenInfo = ({ token }: TokenInfoProps) => {
  const { address } = useAccount();
  const { contract } = useContract(token, getERCTokenContract);

  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const [symbol, setSymbol] = useState<string>('');

  useEffect(() => {
    if (!contract) {
      return;
    }
    contract.balanceOf(address).then(setBalance);
    contract.symbol().then(setSymbol);
  }, [contract, address, setBalance, setSymbol]);

  return (
    <Typography.Paragraph>
      Balance: {ethers.utils.formatEther(balance)} {symbol}
    </Typography.Paragraph>
  );
}

export default TokenInfo;