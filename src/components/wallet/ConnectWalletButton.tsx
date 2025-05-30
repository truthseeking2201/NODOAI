
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Wallet } from "lucide-react";
import { TokenIcon } from "@/components/shared/TokenIcons";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { WalletSignatureDialog } from "./WalletSignatureDialog";
import { useWallet } from "@/hooks/useWallet";

export function ConnectWalletButton() {
  const {
    isConnected,
    address,
    balance,
    disconnect,
    isConnectModalOpen,
    openConnectModal,
    closeConnectModal,
    isSignatureDialogOpen,
    currentTransaction,
    handleSignatureComplete
  } = useWallet();

  const { toast } = useToast();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        duration: 2000,
      });
    }
  };

  return (
    <>
      {!isConnected ? (
        <Button
          onClick={openConnectModal}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-[#0E0F11] hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          data-wallet-connect="true"
        >
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 bg-white/5">
              <span className="font-mono mr-2">{formatAddress(address || '')}</span>
              <span className="hidden sm:inline font-mono text-amber-500">
                {balance.usdc !== undefined ? `${balance.usdc} USDC` : ''}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[320px] p-6 rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <span className="text-white font-bold">Wallet</span>
              </div>

              {/* Address */}
              <div className="relative">
                <button
                  onClick={handleCopyAddress}
                  className="w-full text-left bg-black/40 rounded-xl px-3 py-2 hover:bg-[#1A1B1E] transition-colors group wallet-address"
                >
                  <span className="font-mono text-xs text-gray-200 block truncate pr-8">
                    {address}
                  </span>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
                </button>
              </div>

              <DropdownMenuSeparator className="bg-[#262B30] my-0" />

              {/* Balances */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TokenIcon token="USDC" size={16} />
                    <span className="text-gray-400 text-sm">USDC</span>
                  </div>
                  <span className="font-mono text-sm text-emerald">{balance.usdc}</span>
                </div>

                {balance.receiptTokens > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TokenIcon token="RECEIPT" size={16} />
                      <span className="text-gray-400 text-sm">NODOAIx</span>
                    </div>
                    <span className="font-mono text-sm text-amber-500">{balance.receiptTokens.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <DropdownMenuSeparator className="bg-[#262B30] my-0" />

              {/* Disconnect Button */}
              <button
                onClick={disconnect}
                className="w-full h-11 rounded-xl border border-[#EF4444] text-[#EF4444] flex items-center justify-center gap-2 hover:bg-[rgba(239,68,68,0.12)] hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnect</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* New Connect Wallet Modal */}
      <ConnectWalletModal
        open={isConnectModalOpen}
        onClose={closeConnectModal}
      />

      {/* Wallet Signature Dialog */}
      <WalletSignatureDialog
        open={isSignatureDialogOpen}
        onComplete={handleSignatureComplete}
        transactionType={currentTransaction?.type || 'deposit'}
        amount={currentTransaction?.amount}
        vaultName={currentTransaction?.vaultName}
      />
    </>
  );
}
