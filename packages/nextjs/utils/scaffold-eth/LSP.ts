import { rETHAbi } from "../abi/rETH";
import { readContract } from "@wagmi/core";
import { formatEther, zeroAddress } from "viem";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export type LSPprovider = {
  id: number;
  name: string;
  tokenName: string;
  APR: string | undefined;
  ethExchangeRate: string | undefined;
  tokenContractAddress: string;
};

export const LSPProviders: LSPprovider[] = [
  {
    id: 1,
    name: "Lido",
    tokenName: "stETH",
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034",
  },
  {
    id: 2,
    name: "Rocket",
    tokenName: "rETH",
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1",
  },
  {
    id: 3,
    name: "Ankr",
    tokenName: "ankrETH",
    APR: undefined,
    ethExchangeRate: undefined,
    tokenContractAddress: "",
  },
];

export async function fetchLspData(id: number): Promise<Partial<LSPprovider> | null> {
  if (id === 2) {
    const response = await fetch("https://api.rocketpool.net/api/holesky/payload");
    const result = await response.json();

    const ethExchangeRate = await readContract(wagmiConfig, {
      address: LSPProviders.find(lsp => lsp.id === id)?.tokenContractAddress ?? zeroAddress,
      functionName: "getExchangeRate",
      abi: rETHAbi,
    });

    return {
      APR: parseFloat(result.rethAPR).toFixed(2),
      ethExchangeRate: parseFloat(formatEther(ethExchangeRate)).toFixed(2),
    };
  }
  return null;
}
