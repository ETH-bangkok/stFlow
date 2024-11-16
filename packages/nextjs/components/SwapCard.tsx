"use client";

import { useState } from "react";
import Image from "next/image";
import TokenSelector from "./token-selector";
import { ArrowDown, ChevronDown, Info, Settings } from "lucide-react";

export function SwapCard() {
  // State for token amounts and selection
  type Token = {
    symbol: string;
    name?: string;
    amount: string;
    balance: string;
    price: number;
    image: string;
  };

  const [fromToken, setFromToken] = useState<Token>({
    symbol: "SOL",
    amount: "",
    balance: "0",
    price: 218.2,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  });

  const [toToken, setToToken] = useState<Token>({
    symbol: "alfSOL",
    name: "AEP Life Form Staked SOL",
    amount: "",
    balance: "0",
    price: 218.17,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  });

  // State for showing token selection modals
  //const [showFromTokens, setShowFromTokens] = useState(false);
  // const [showToTokens, setShowToTokens] = useState(false);

  // State for rate and fees info
  const [rate] = useState(0.997234624);
  const [showRateInfo, setShowRateInfo] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (token: any) => {
    console.log("Selected token:", token);
    setIsOpen(false);
  };

  // Handle input changes
  const handleFromAmountChange = (value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFromToken(prev => ({
      ...prev,
      amount: value,
    }));
    // Calculate and update to token amount based on rate
    setToToken(prev => ({
      ...prev,
      amount: value === "" ? "" : (numValue * rate).toFixed(9),
    }));
  };

  const handleToAmountChange = (value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setToToken(prev => ({
      ...prev,
      amount: value,
    }));
    // Calculate and update from token amount based on inverse rate
    setFromToken(prev => ({
      ...prev,
      amount: value === "" ? "" : (numValue / rate).toFixed(9),
    }));
  };

  // Token selection handlers
  //const toggleFromTokens = () => setShowFromTokens(!showFromTokens);
  //const toggleToTokens = () => setShowToTokens(!showToTokens);

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
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-[#1C1C1C] rounded-full p-1 pl-1.5 hover:bg-zinc-800"
              >
                <Image src={fromToken.image} alt={fromToken.symbol} width={24} height={24} className="rounded-full" />
                <span>{fromToken.symbol}</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </button>
              <span className="text-zinc-500 text-sm">
                {fromToken.balance} {fromToken.symbol}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <input
                type="number"
                value={fromToken.amount}
                onChange={e => handleFromAmountChange(e.target.value)}
                placeholder="0"
                className="text-4xl font-light bg-transparent w-full focus:outline-none"
              />
              <span className="text-zinc-400">
                ≈ ${fromToken.amount ? (parseFloat(fromToken.amount) * fromToken.price).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-10 w-10 rounded-full bg-[#2C2C2C] border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700"
                onClick={() => {
                  const tempToken = fromToken;
                  setFromToken(toToken);
                  setToToken(tempToken);
                }}
              >
                <ArrowDown className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Second Token Input */}
          <div className="rounded-lg bg-[#2C2C2C] p-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                // onClick={toggleToTokens}
                className="flex items-center gap-2 bg-[#1C1C1C] rounded-full p-1 pl-1.5 hover:bg-zinc-800"
              >
                <Image src={toToken.image} alt={toToken.symbol} width={24} height={24} className="rounded-full" />
                <span>{toToken.name}</span>
                <ChevronDown className="h-4 w-4 mr-1" />
              </button>
              <span className="text-zinc-500 text-sm">
                {toToken.balance} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <input
                type="number"
                value={toToken.amount}
                onChange={e => handleToAmountChange(e.target.value)}
                placeholder="0"
                className="text-4xl font-light bg-transparent w-full focus:outline-none"
              />
              <span className="text-zinc-400">
                ≈ ${toToken.amount ? (parseFloat(toToken.amount) * toToken.price).toFixed(2) : "0.00"}
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
                1 {fromToken.symbol} ≈ {rate} {toToken.symbol}
              </span>
              <span className="text-[#4B7BF0]">via Jupiter</span>
            </div>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${showRateInfo ? "rotate-180" : ""}`} />
          </div>

          {/* Fees Section */}
          <div className="flex items-center justify-between text-sm text-zinc-400 px-1">
            <span>Fees</span>
            <div className="flex items-center gap-2">
              <span>Jup fees currently unavailable</span>
            </div>
          </div>

          {/* Connect Button */}
          <button className="w-full h-14 text-lg bg-[#4B7BF0] hover:bg-[#4B7BF0]/90 rounded-lg">Connect</button>

          {/* Info Box */}
          <div className="flex gap-3 rounded-lg bg-[#1E3A8A]/20 p-4 text-[#93C5FD]">
            <Info className="h-6 w-6 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">No further staking required</p>
              <p className="text-sm opacity-90">
                Upon receiving alfSOL, you&apos;re already staked with AEP Life Form and earning staking yields. No
                further staking required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
