import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Typography } from "antd";
import { ERC20Contract } from "../../web3/types";

interface TokenInfoProps {
  symbol: string;
  contract: ERC20Contract;
}

const TokenInfo = ({ symbol, contract }: TokenInfoProps) => {
  const { address } = useAccount();

  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    if (!contract) {
      return;
    }
    contract.balanceOf(address).then(setBalance);
  }, [contract, address, setBalance]);

  return (
    <Typography.Paragraph>
      Balance: {ethers.utils.formatEther(balance)} {symbol}
    </Typography.Paragraph>
  );
}

export default TokenInfo;