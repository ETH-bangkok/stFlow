"use client";

import { XIcon } from "lucide-react";
import { useGlobalState } from "~~/services/store/store";
import { LSPprovider } from "~~/utils/scaffold-eth/LSP";

interface LSPSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lsp: LSPprovider) => void;
}

export default function LSPSelector({ isOpen, onClose, onSelect }: LSPSelectorProps) {
  const lspProviders = useGlobalState(state => state.lspProviders);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-white font-normal">Select LST</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <>
            <div className="max-h-[400px] overflow-y-auto">
              {lspProviders.map(lsp => (
                <button
                  key={lsp.id}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => onSelect(lsp)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://app.dynamic.xyz/assets/networks/eth.svg"
                      alt={lsp.tokenName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-medium text-white">{lsp.tokenName}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">{lsp.tokenName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{lsp.ethExchangeRate} ETH</div>
                    <div className="text-sm text-gray-400">APR {lsp.APR}%</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
