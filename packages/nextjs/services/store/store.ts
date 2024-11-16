import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { LSPProviders, LSPprovider, fetchLspData } from "~~/utils/scaffold-eth/LSP";

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  tradeLspPair: {
    sourceLsp: LSPprovider;
    destinationLsp: LSPprovider;
  };
  setSourceLsp: (lsp: LSPprovider) => void;
  setDestinationLsp: (lsp: LSPprovider) => void;
  lspProviders: LSPprovider[];
  updateAllLspData: (userAddress: string) => Promise<void>;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newValue: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  tradeLspPair: {
    sourceLsp: LSPProviders[0],
    destinationLsp: LSPProviders[1],
  },
  setSourceLsp: (lsp: LSPprovider) =>
    set(state => ({
      tradeLspPair: {
        ...state.tradeLspPair,
        sourceLsp: lsp,
      },
    })),
  setDestinationLsp: (lsp: LSPprovider) =>
    set(state => ({
      tradeLspPair: {
        ...state.tradeLspPair,
        destinationLsp: lsp,
      },
    })),
  lspProviders: LSPProviders,
  updateAllLspData: async (userAddress: string) => {
    if (!userAddress) return;
    try {
      // Fetch data for all providers in parallel
      const fetchedDataList = await Promise.all(LSPProviders.map(provider => fetchLspData(provider.id, userAddress)));

      // Update the store with the fetched data
      set(state => ({
        lspProviders: state.lspProviders.map((provider, index) => {
          const fetchedData = fetchedDataList[index];
          return fetchedData
            ? {
                ...provider,
                APR: fetchedData.APR,
                ethExchangeRate: fetchedData.ethExchangeRate,
                userBalance: fetchedData.userBalance,
              }
            : provider; // If fetch fails, keep the original provider data
        }),
      }));
    } catch (error) {
      console.error("Error fetching LSP data:", error);
    }
  },
}));
