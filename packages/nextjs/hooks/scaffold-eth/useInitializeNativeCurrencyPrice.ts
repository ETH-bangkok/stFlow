import { useCallback, useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useInterval } from "usehooks-ts";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { fetchPriceFromUniswap } from "~~/utils/scaffold-eth";

const enablePolling = false;

/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 */
export const useInitializeNativeCurrencyPrice = () => {
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const updateLSPs = useGlobalState(state => state.updateAllLspData);
  const lsps = useGlobalState(state => state.lspProviders);
  const setLSPsLoading = useGlobalState(state => state.setLspLoading);
  const setIsNativeCurrencyFetching = useGlobalState(state => state.setIsNativeCurrencyFetching);
  const { targetNetwork } = useTargetNetwork();
  const { address } = useAccount();

  const fetchPrice = useCallback(async () => {
    setIsNativeCurrencyFetching(true);
    setLSPsLoading(true);
    const price = await fetchPriceFromUniswap(targetNetwork);
    setNativeCurrencyPrice(price);
    await updateLSPs(address!);
    setIsNativeCurrencyFetching(false);
    setLSPsLoading(false);
  }, [setIsNativeCurrencyFetching, setNativeCurrencyPrice, targetNetwork, updateLSPs, address]);

  console.log(lsps);
  // Get the price of ETH from Uniswap on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Get the price of ETH from Uniswap at a given interval
  useInterval(fetchPrice, enablePolling ? scaffoldConfig.pollingInterval : null);
};
