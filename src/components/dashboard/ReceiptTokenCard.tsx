import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Info, Ticket, Lock, LifeBuoy } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { motion, AnimatePresence } from "framer-motion";

export function ReceiptTokenCard() {
  const { balance } = useWallet();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Format with 2 decimal places
  const formattedBalance = balance?.receiptTokens?.toFixed(2) || "0.00";

  // Animate token value on mount
  useEffect(() => {
    const targetValue = parseFloat(formattedBalance);
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of steps in animation
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      // Easing function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValue(targetValue * easeProgress);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValue(targetValue);

        // Add pulse effect after animation completes
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [formattedBalance]);

  return (
    <Card className="bg-[#0c0c10] border-white/10 overflow-hidden relative">
      <div className="h-1 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00]"></div>

      {/* Neural network background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl"></div>
        <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
          <pattern id="neural-net" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-net)" />
        </svg>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-3">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Vault Receipt Tokens</h3>
              <p className="text-xs text-white/50">Non-transferable position tokens that burn on withdrawal</p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
                  <Info className="h-4 w-4 text-white/40" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-4 bg-[#0c0c10]/95 border border-white/20 text-white">
                <h4 className="font-medium text-sm mb-2 text-amber-500">About Receipt Tokens</h4>
                <p className="text-sm text-white/80">
                  Receipt tokens represent your position in the vault and are automatically minted when you deposit.
                  They serve as proof of your deposit and will burn automatically when you withdraw.
                  These tokens are non-transferable and remain linked to your wallet.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
          <div className="flex items-center">
            <div className="relative mr-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: pulseEffect ? [1, 1.2, 1] : 1,
                    opacity: pulseEffect ? [1, 0.7, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">RT</span>
                  </div>
                </motion.div>
              </div>

              {/* Pulsing rings effect */}
              <AnimatePresence>
                {pulseEffect && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-full border border-amber-500/50"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white/60">Balance</span>
                <div className="flex items-center text-xs text-white/50">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Non-transferable</span>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  {animatedValue.toFixed(2)}
                </span>
                <span className="ml-1 text-white/50 text-lg font-mono">RT</span>
              </div>

              <div className="mt-1 text-xs text-white/40 flex items-center">
                <span>1 RT ≈ 1 USDC</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <LifeBuoy className="h-3 w-3 mr-1 text-amber-500/70" />
                  Burns on withdrawal
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
