import { rETHAbi } from "../abi/rETH";
import { stETHAbi } from "../abi/stETH";
import { readContract } from "@wagmi/core";
import { formatEther, zeroAddress } from "viem";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export type LSPprovider = {
  id: number;
  name: string;
  tokenName: string;
  userBalance: string | undefined;
  APR: string | undefined;
  ethExchangeRate: string | undefined;
  tokenContractAddress: string | undefined;
};

export const LSPProviders: LSPprovider[] = [
  {
    id: 1,
    name: "Lido",
    tokenName: "stETH",
    userBalance: undefined,
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034",
  },
  {
    id: 2,
    name: "Rocket",
    tokenName: "rETH",
    userBalance: undefined,
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1",
  },
  {
    id: 3,
    name: "Ankr",
    tokenName: "ankrETH",
    userBalance: undefined,
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "0x8783c9c904e1bdc87d9168ae703c8481e8a477fd",
  },
];

export async function fetchLspData(id: number, userAddress: string): Promise<Partial<LSPprovider> | null> {
  if (id === 1) {
    const apr = await fetch("https://eth-api-holesky.testnet.fi/v1/protocol/steth/apr/sma");
    const aprResult = await apr.json();

    const ethExchangeRate = await fetch("https://eth-api-holesky.testnet.fi/v1/swap/one-inch?token=ETH");
    const ethExchangeRateResult = await ethExchangeRate.json();

    const userbalance = await readContract(wagmiConfig, {
      address: LSPProviders.find(lsp => lsp.id === id)?.tokenContractAddress ?? zeroAddress,
      functionName: "balanceOf",
      args: [userAddress],
      abi: stETHAbi,
    });

    return {
      APR: parseFloat(aprResult.data.smaApr).toFixed(2),
      ethExchangeRate: parseFloat(ethExchangeRateResult.rate).toFixed(2),
      userBalance: parseFloat(formatEther(userbalance as bigint)).toFixed(2),
    };
  }
  if (id === 2) {
    const response = await fetch("https://api.rocketpool.net/api/holesky/payload");
    const result = await response.json();

    const ethExchangeRate = await readContract(wagmiConfig, {
      address: LSPProviders.find(lsp => lsp.id === id)?.tokenContractAddress ?? zeroAddress,
      functionName: "getExchangeRate",
      abi: rETHAbi,
    });

    const userbalance = await readContract(wagmiConfig, {
      address: LSPProviders.find(lsp => lsp.id === id)?.tokenContractAddress ?? zeroAddress,
      functionName: "balanceOf",
      args: [userAddress],
      abi: rETHAbi,
    });

    return {
      APR: parseFloat(result.rethAPR).toFixed(2),
      ethExchangeRate: parseFloat(formatEther(ethExchangeRate)).toFixed(2),
      userBalance: parseFloat(formatEther(userbalance)).toFixed(2),
    };
  }

  if (id === 3) {
    // Ankr fetches their price from mainnet token in their testnet app so we do the same
    // https://testnet.ankr.com/staking/stake/ethereum/
    const ethExchangeRate = await fetch(
      "https://open-api.openocean.finance/v3/eth/quote?amount=1&gasPrice=300&inTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&outTokenAddress=0xE95A203B1a91a908F9B9CE46459d101078c2c3cb&slippage=1",
    );
    const ethExchangeRateResult = await ethExchangeRate.json();

    const inAmt = ethExchangeRateResult.data.inAmount as number;
    const outAmt = ethExchangeRateResult.data.outAmount as number;

    const userbalance = await readContract(wagmiConfig, {
      address: LSPProviders.find(lsp => lsp.id === id)?.tokenContractAddress ?? zeroAddress,
      functionName: "balanceOf",
      args: [userAddress],
      abi: stETHAbi,
    });

    return {
      // ankr doesn't seem to have holesky API to fetch APR
      APR: "4.97",
      ethExchangeRate: (outAmt / inAmt).toFixed(2),
      userBalance: parseFloat(formatEther(userbalance as bigint)).toFixed(2),
    };
  }
  return null;
}
