"use client";

import { useEffect, useState } from "react";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { anvil } from "@wagmi/core/chains";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider, useAccount } from "wagmi";
import { signMessage } from "wagmi/actions";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  const { address } = useAccount();

  async function signMessagefn() {
    await signMessage(wagmiConfig, {
      account: address,
      message: "hello world",
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <button className="btn btn-primary" onClick={signMessagefn}>
          Sign &quot;Hello World&quot; on Anvil
        </button>
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const evmLocalNetworks = [
    {
      blockExplorerUrls: [""],
      chainId: anvil.id,
      chainName: "Anvil",
      iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
      name: anvil.name,
      nativeCurrency: {
        decimals: anvil.nativeCurrency.decimals,
        name: anvil.nativeCurrency.name,
        symbol: anvil.nativeCurrency.symbol,
        iconUrl: "https://app.dynamic.xyz/assets/networks/eth.svg",
      },
      networkId: anvil.id,

      rpcUrls: ["http://127.0.0.1:8545"],
      vanityName: "Anvil",
    },
  ];

  return (
    <DynamicContextProvider
      theme={mounted ? (isDarkMode ? "dark" : "light") : "light"}
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_VAR || "",
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: networks => mergeNetworks(evmLocalNetworks, networks),
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <DynamicWagmiConnector>
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
