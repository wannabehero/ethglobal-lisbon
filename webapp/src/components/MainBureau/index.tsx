import { App, Button, Descriptions, List, Result, Space, Spin, Typography } from 'antd';
import { useAccount, useProvider } from 'wagmi';
import { useCreditScore } from '../../hooks/useCreditScore';
import ClaimHelperCard from '../ClaimHelperCard';
import { IClaimHelperItem } from './interfaces';
import { SismoConnect } from '@sismo-core/sismo-connect-client';
import { SISMO_CONFIG } from '../ClaimHelperCard/consts';
import TokenInfo from '../TokenInfo';
import { LENDER_ADDRESS } from '../../web3/consts';
import TokenValueInput from '../TokenValueInput/TokenValueInput';
import { useHelperClaims } from './hooks';
import { useCallback, useEffect, useState } from 'react';
import useContract from '../../hooks/useContract';
import { getERC20Lender, getERCTokenContract } from '../../web3/contracts';
import { BigNumber, ethers } from 'ethers';
import { ERC20Contract } from '../../web3/types';

const claimsData: IClaimHelperItem[] = [
  {
    cardKey: 'wc-id',
    label: 'World ID',
    url: 'https://develop.worldcoin.org/',
    scoreRate: '0.2',
    verified: false,
  },
  {
    cardKey: 'sismo-noun',
    label: 'Noun owner with Sismo',
    url: 'https://sismo.io/',
    scoreRate: '0.05',
    verified: false,
  },
  {
    cardKey: 'true-layer',
    label: 'ZK Proof of Funds',
    url: 'https://truelayer.com/',
    scoreRate: '0.2',
    verified: false,
  },
  {
    cardKey: 'polygon-id',
    label: 'ZP Proof of Diploma',
    url: 'https://polygon.technology/',
    scoreRate: '0.1',
    verified: false,
  }
];

export default function MainBureau() {
  const { message } = App.useApp();
  const { helperClaims, isLoading, reloadHelperClaims } = useHelperClaims();

  const reloadButton = <Button onClick={reloadHelperClaims}>Reload</Button>;

  const provider = useProvider();
  const { address } = useAccount();

  const [borrowedBalance, setBorrowedBalance] = useState<BigNumber>(BigNumber.from(0));
  const [collateralBalance, setCollateralBalance] = useState<BigNumber>(BigNumber.from(0));

  const creditScore = useCreditScore(address, provider);

  const urlParams = new URLSearchParams(window.location.search);
  const sismoConnectResponse = urlParams.get('sismoConnectResponseCompressed');
  const storedValue = localStorage.getItem('sismo-connect');
  if (sismoConnectResponse && (!storedValue || storedValue === '')) {
    // create a new SismoConnect instance with the client configuration
    const sismoConnect = SismoConnect(SISMO_CONFIG);
    const sismoConnectResponseBytes = sismoConnect.getResponseBytes();
    if (sismoConnectResponseBytes) {
      console.log(`Sismo response proof: ${sismoConnectResponseBytes}`);

      // TODO: show loading and send verification response to the chain
      message.info('Sending verification to verify Sismo proof: ' + sismoConnectResponse);
      localStorage.setItem('sismo-connect', sismoConnectResponseBytes);
    } else {
      console.log(`Failed to get sismo response: reverted`);
    }
  }

  const { contract: lender } = useContract(LENDER_ADDRESS, getERC20Lender);
  const [collateralAddress, setCollateralAddress] = useState<string>();
  const [lendingAddress, setLendingAddress] = useState<string>();
  const [showApproveCollateral, setShowApproveCollateral] = useState<boolean>(false);
  const [showApproveLending, setShowApproveLending] = useState<boolean>(false);

  const { contract: collateral } = useContract(collateralAddress, getERCTokenContract);
  const { contract: lending } = useContract(lendingAddress, getERCTokenContract);

  const [collateralSymbol, setCollateralSymbol] = useState<string>('');
  const [lendingSymbol, setLendingSymbol] = useState<string>('');

  const [isLoadingButtons, setIsLoadingButtons] = useState<boolean>(false);

  const updateLenderBalances = useCallback(async () => {
    if (!lender || !address) {
      return;
    }
    await Promise.all([
      lender.collateralBalance(address).then(setCollateralBalance),
      lender.borrowedBalance(address).then(setBorrowedBalance)
    ]);
  }, [lender, address]);


  useEffect(() => {
    if (!lender || !address) {
      return;
    }
    lender.LENDING_TOKEN().then(setLendingAddress);
    lender.COLLATERAL_TOKEN().then(setCollateralAddress);
    updateLenderBalances();
  }, [lender, setLendingAddress, setCollateralAddress, address]);

  useEffect(() => {
    if (!lending || !address) {
      return;
    }
    lending.symbol().then(setLendingSymbol);
    lending.allowance(address, LENDER_ADDRESS).then((allowance: BigNumber) => setShowApproveLending(allowance.isZero()));
  }, [lending, address]);

  useEffect(() => {
    if (!collateral || !address) {
      return;
    }
    collateral.symbol().then(setCollateralSymbol);
    collateral.allowance(address, LENDER_ADDRESS).then((allowance: BigNumber) => setShowApproveCollateral(allowance.isZero()));
  }, [collateral]);

  const onApprove = async (token: ERC20Contract, callback: () => void) => {
    try {
      setIsLoadingButtons(true);
      const tx = await token.approve(LENDER_ADDRESS, ethers.constants.MaxUint256);
      await tx.wait();
      message.success('Approved!');
      callback();
    } catch (e: any) {
      message.error(e.reason ?? e.message);
    } finally {
      setIsLoadingButtons(false);
    }
  };

  const onLenderAction = async (action: () => Promise<any>, description: string) => {
    try {
      const tx = await action();
      await tx.wait();
      await updateLenderBalances();
      message.success(description);
    } catch (e: any) {
      message.error(e.reason ?? e.message);
    }
  };

  return (
    <div className="content-inner">
      {isLoading && <Spin tip="Loading" />}
      {!isLoading && helperClaims === undefined && (
        <Result status="error" title="Cannot load markets" extra={reloadButton} />
      )}
      {!address && <Typography.Title level={3}> Please connect your wallet </Typography.Title>}
      {address && (
        <Descriptions layout="vertical" bordered column={3}>
          <Descriptions.Item label="Address" span={2}>
            {address}
          </Descriptions.Item>
          <Descriptions.Item label="Credit Score">{creditScore}</Descriptions.Item>
          <Descriptions.Item label="Score Goals" span={3}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={claimsData}
              renderItem={(item) => {
                item.verified =
                  helperClaims?.find((claim) => claim.id === item.cardKey)?.verified || false;
                return (
                  <List.Item>
                    <ClaimHelperCard {...item} />
                  </List.Item>
                );
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Wallet">
            {
              collateral && (
                <TokenInfo contract={collateral} symbol={collateralSymbol} />
              )
            }
            {
              lending && (
                <TokenInfo contract={lending} symbol={lendingSymbol} />
              )
            }
          </Descriptions.Item>
          <Descriptions.Item label="Debt">
            <Space direction='vertical'>
              <Typography.Paragraph>
                Current value: {ethers.utils.formatEther(borrowedBalance)} {lendingSymbol}
              </Typography.Paragraph>
              {
                lender && (
                  <>
                    <TokenValueInput
                      action='Borrow'
                      symbol={lendingSymbol}
                      onAction={(value) => onLenderAction(() => lender.borrow(ethers.BigNumber.from(value)), 'Borrowed!')}
                    />
                    <TokenValueInput
                      action='Repay'
                      symbol={lendingSymbol}
                      onAction={(value) => onLenderAction(() => lender.repay(ethers.BigNumber.from(value)), 'Repaid!')}
                    />
                  </>
                )
              }
              {
                lending && showApproveLending && (
                  <Button
                    loading={isLoadingButtons}
                    type='dashed'
                    style={{ minWidth: '200px' }}
                    onClick={() => onApprove(lending, () => setShowApproveLending(false))}
                  >
                    Approve {lendingSymbol}
                  </Button>
                )
              }
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Collateral">
            <Space direction='vertical'>
              <Typography.Paragraph>
                Current value: {ethers.utils.formatEther(collateralBalance)} {collateralSymbol}
              </Typography.Paragraph>
              {
                lender && (
                  <>
                  <TokenValueInput
                    action='Increase'
                    symbol={collateralSymbol}
                    onAction={(value) => onLenderAction(() => lender.increaseCollateral(ethers.BigNumber.from(value)), 'Increased collateral!')}
                  />
                  <TokenValueInput
                    action='Withdraw'
                    symbol={collateralSymbol}
                    onAction={(value) => onLenderAction(() => lender.decreaseCollateral(ethers.BigNumber.from(value)), 'Decreased collateral!')}
                  />
                  </>
                )
              }
              {
                collateral && showApproveCollateral && (
                  <Button
                    loading={isLoadingButtons}
                    type='dashed'
                    style={{ minWidth: '200px' }}
                    onClick={() => onApprove(collateral, () => setShowApproveCollateral(false))}
                  >
                    Approve {collateralSymbol}
                  </Button>
                )
              }
            </Space>
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
}
