"use client";

import React, { useEffect, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  icon: string;
  balance: string;
  value: string;
}

const tokens: Token[] = [
  {
    id: "1",
    name: "SOL",
    symbol: "SOL",
    address: "So11...1112",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "2",
    name: "aeroSOL",
    symbol: "aeroSOL",
    address: "aero...rcxF",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "3",
    name: "AEP Life Form Staked SOL",
    symbol: "alfSOL",
    address: "aepL...eGWs",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "4",
    name: "apySOL",
    symbol: "apySOL",
    address: "apyS...7icM",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "5",
    name: "banxSOL",
    symbol: "banxSOL",
    address: "BANX...9NGG",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "6",
    name: "BytbitSOL",
    symbol: "bbSOL",
    address: "Bybi...Pb4B",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
  {
    id: "7",
    name: "Binance Staked SOL",
    symbol: "BNSOL",
    address: "BNso...1X85",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: "0.00",
    value: "$0.00",
  },
];

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export default function TokenSelector({ isOpen, onClose, onSelect }: TokenSelectorProps) {
  const [activeTab, setActiveTab] = useState("tokens");
  const [search, setSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  useEffect(() => {
    const filtered = tokens.filter(
      token =>
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.address.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredTokens(filtered);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-white font-normal">Select</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-l-lg ${
                activeTab === "tokens" ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
              }`}
              onClick={() => setActiveTab("tokens")}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-500" />
                Tokens
              </div>
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-r-lg ${
                activeTab === "stake-accounts" ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
              }`}
              onClick={() => setActiveTab("stake-accounts")}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gray-500" />
                Stake Accounts
              </div>
            </button>
          </div>

          {activeTab === "tokens" && (
            <>
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by token name or address"
                  className="w-full bg-gray-800 text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredTokens.map(token => (
                  <button
                    key={token.id}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => onSelect(token)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={token.icon} alt={token.name} className="h-10 w-10 rounded-full" />
                      <div className="text-left">
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          {token.name} <span className="text-gray-600">{token.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{token.balance}</div>
                      <div className="text-sm text-gray-400">{token.value}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === "stake-accounts" && (
            <div className="p-4 text-center text-gray-400">No stake accounts available</div>
          )}
        </div>
      </div>
    </div>
  );
}
