"use client";

import { useState } from "react";
import Image from "next/image";
import TokenSelector from "./token-selector";
import { ArrowDown, ChevronDown, Settings } from "lucide-react";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { LSPprovider } from "~~/utils/scaffold-eth/LSP";

export function SwapCard() {
  // State for token amounts and selection

  useInitializeNativeCurrencyPrice();

  const loading = useGlobalState(state => state.lspLoading);

  const fromLsp = useGlobalState(state => state.fromLsp);
  const setFromLsp = useGlobalState(state => state.setFromLsp);

  const toLsp = useGlobalState(state => state.toLsp);
  const setToLsp = useGlobalState(state => state.setToLsp);

  // State for showing token selection modals
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);

  // State for rate and fees info

  const [showRateInfo, setShowRateInfo] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lsp: LSPprovider) => {
    if (lsp.id === toLsp.id) return;
    setIsOpen(false);
    if (showFromTokens) {
      setFromLsp(lsp);
    } else {
      setToLsp(lsp);
    }
  };

  // Handle input changes
  const handleFromAmountChange = (value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFromLsp({ amount: value });
    // Calculate and update to token amount based on rate
    setToLsp({
      amount:
        value === ""
          ? ""
          : (numValue * (parseFloat(fromLsp.ethExchangeRate!) / parseFloat(toLsp.ethExchangeRate!))).toFixed(2),
    });
  };

  console.log(fromLsp, toLsp);

  const handleToAmountChange = (value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setToLsp({
      amount: value,
    });
    // Calculate and update from token amount based on inverse rate
    setFromLsp({
      amount:
        value === ""
          ? ""
          : (numValue / (parseFloat(fromLsp.ethExchangeRate!) / parseFloat(toLsp.ethExchangeRate!))).toFixed(2),
    });
  };

  // Token selection handlers
  const toggleFromTokens = () => setShowFromTokens(!showFromTokens);
  const toggleToTokens = () => setShowToTokens(!showToTokens);

  if (loading) return "loading";

  return (
    <div className="w-full max-w-[440px] bg-[#1C1C1C] border border-zinc-800 rounded-lg text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-normal">Trade LSTs</h2>
            <p className="text-sm text-zinc-400 font-normal mt-1">Buy and sell your favourite LSTs</p>
          </div>
          <div className="p-4">
            <TokenSelector isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelect} />
          </div>

          <button className="text-zinc-̦400 hover:text-white p-2 rounded-full hover:bg-zinc-800">
            <Settings className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          {/* First Token Input */}
          <div className="rounded-lg bg-[#2C2C2C] p-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => {
                  toggleFromTokens();
                  setIsOpen(true);
                }}
                className="flex items-center gap-2 bg-[#1C1C1C] rounded-full p-1 pl-1.5 hover:bg-zinc-800"
              >
                <Image
                  src="https://app.dynamic.xyz/assets/networks/eth.svg"
                  alt={fromLsp.tokenName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{fromLsp.tokenName}</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </button>
              <span className="text-zinc-500 text-sm">
                {fromLsp.userBalance} {fromLsp.tokenName}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <input
                type="number"
                value={fromLsp.amount}
                onChange={e => handleFromAmountChange(e.target.value)}
                placeholder="0"
                className="text-4xl font-light bg-transparent w-full focus:outline-none"
              />
              <span className="text-zinc-400">
                ≈
                {fromLsp.amount
                  ? (parseFloat(fromLsp.amount) * parseFloat(fromLsp.ethExchangeRate!)).toFixed(4)
                  : "0.00"}{" "}
                ETH
              </span>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className="inset-0 flex items-center justify-center">
              <div
                onClick={() => {
                  const tempLsp = fromLsp;
                  setFromLsp(toLsp);
                  setToLsp(tempLsp);
                }}
                className="h-10 w-10 rounded-full bg-[#2C2C2C] border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700"
              >
                <ArrowDown className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Second Token Input */}
          <div className="rounded-lg bg-[#2C2C2C] p-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => {
                  toggleToTokens();
                  setIsOpen(true);
                }}
                className="flex items-center gap-2 bg-[#1C1C1C] rounded-full p-1 pl-1.5 hover:bg-zinc-800"
              >
                <Image
                  alt=""
                  src="https://app.dynamic.xyz/assets/networks/eth.svg"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{toLsp.tokenName}</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </button>
              <span className="text-zinc-500 text-sm">
                {toLsp.userBalance} {toLsp.tokenName}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <input
                type="number"
                value={toLsp.amount}
                onChange={e => handleToAmountChange(e.target.value)}
                placeholder="0"
                className="text-4xl font-light bg-transparent w-full focus:outline-none"
              />
              <span className="text-zinc-400">
                ≈ {toLsp.amount ? (parseFloat(toLsp.amount) * parseFloat(toLsp.ethExchangeRate!)).toFixed(4) : "0.00"}{" "}
                ETH
              </span>
            </div>
          </div>

          {/* Rate Info */}
          <div
            className="flex items-center justify-between text-sm text-zinc-400 px-1 cursor-pointer"
            onClick={() => setShowRateInfo(!showRateInfo)}
          >
            <div className="flex items-center gap-2">
              <span>
                1 {fromLsp.tokenName} ≈{" "}
                {(parseFloat(fromLsp.ethExchangeRate!) / parseFloat(toLsp.ethExchangeRate!)).toFixed(2)}{" "}
                {toLsp.tokenName}
              </span>
              {/* <span className="text-[#4B7BF0]">via Jupiter</span> */}
            </div>
          </div>

          {/* Fees Section */}
          {/* <div className="flex items-center justify-between text-sm text-zinc-400 px-1">
            <span>Fees</span>
            <div className="flex items-center gap-2">
              <span>Jup fees currently unavailable</span>
            </div>
          </div> */}

          {/* Connect Button */}
          <button className="w-full h-14 text-lg bg-[#4B7BF0] hover:bg-[#4B7BF0]/90 rounded-lg">Connect</button>
        </div>
      </div>
    </div>
  );
}
