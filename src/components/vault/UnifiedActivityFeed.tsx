import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Zap, Brain, RefreshCw, PanelLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";

interface Activity {
  id: string;
  type: "deposit" | "withdraw" | "ai";
  amount?: number;
  timestamp: Date;
  vault: string;
  user?: string;
  aiAction?: string;
  aiResult?: string;
}

interface UnifiedActivityFeedProps {
  className?: string;
}

export function UnifiedActivityFeed({ className = "" }: UnifiedActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState<"all" | "user" | "ai">("all");

  // Get transaction history from vault service
  const { data: transactions, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => vaultService.getTransactionHistory(),
    refetchOnWindowFocus: false,
  });

  // Generate simulated activities
  useEffect(() => {
    // Convert transactions to activities format (if any)
    const txActivities = transactions ? transactions.map((tx) => ({
      id: tx.id,
      type: tx.type as "deposit" | "withdraw",
      amount: tx.amount,
      timestamp: new Date(tx.timestamp),
      vault: tx.vaultName,
      user: tx.id.substring(0, 8), // Simulated user address
    })) : [];

    // Generate AI activities
    const aiActivities: Activity[] = [
      {
        id: "ai-1",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 2), // 2 minutes ago
        vault: "DEEP-SUI",
        aiAction: "Optimized position range",
        aiResult: "+0.4% APR",
      },
      {
        id: "ai-2",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 5), // 5 minutes ago
        vault: "CETUS-SUI",
        aiAction: "Rebalanced LP positions",
        aiResult: "$240 fees captured",
      },
      {
        id: "ai-3",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 8), // 8 minutes ago
        vault: "SUI-USDC",
        aiAction: "Modified fee tier allocation",
        aiResult: "Reduced slippage",
      },
      {
        id: "ai-4",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 15), // 15 minutes ago
        vault: "DEEP-SUI",
        aiAction: "Adjusted impermanent loss parameters",
        aiResult: "Risk -9%",
      },
      {
        id: "ai-5",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 22), // 22 minutes ago
        vault: "SUI-USDC",
        aiAction: "Executed price protection strategy",
        aiResult: "Protected $15K assets",
      },
      {
        id: "ai-6",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 37), // 37 minutes ago
        vault: "CETUS-SUI",
        aiAction: "Dynamic fee recalibration",
        aiResult: "+5.2% efficiency",
      },
      {
        id: "ai-7",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 48), // 48 minutes ago
        vault: "DEEP-SUI",
        aiAction: "Price volatility analysis",
        aiResult: "Position shift initiated",
      },
      {
        id: "ai-8",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 67), // 67 minutes ago
        vault: "SUI-USDC",
        aiAction: "Market sentiment adjustment",
        aiResult: "Strategy updated",
      },
    ];

    // Combine and sort all activities
    const allActivities = [...txActivities, ...aiActivities].sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    setActivities(allActivities);
  }, [transactions]);

  // Filter activities based on selected type
  const filteredActivities = activities.filter(
    (activity) => filterType === "all" ||
    (filterType === "user" && (activity.type === "deposit" || activity.type === "withdraw")) ||
    (filterType === "ai" && activity.type === "ai")
  );

  // Format time ago
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/60 hover:text-white/80"
            }`}
            onClick={() => setFilterType("all")}
          >
            All Activity
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filterType === "user"
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/60 hover:text-white/80"
            }`}
            onClick={() => setFilterType("user")}
          >
            User Transactions
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filterType === "ai"
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/60 hover:text-white/80"
            }`}
            onClick={() => setFilterType("ai")}
          >
            AI Actions
          </button>
        </div>
        <button
          onClick={() => {
            refetch();
            // Add a slight delay for visual feedback
            const btn = document.activeElement as HTMLButtonElement;
            if (btn) {
              btn.classList.add('animate-spin-once');
              setTimeout(() => btn.classList.remove('animate-spin-once'), 500);
            }
          }}
          className="px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={16} className="text-white/60" />
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence initial={false}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {activity.type === "deposit" && (
                        <div className="h-8 w-8 rounded-full bg-emerald/10 flex items-center justify-center">
                          <ArrowUpRight size={16} className="text-emerald" />
                        </div>
                      )}
                      {activity.type === "withdraw" && (
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <ArrowDownRight size={16} className="text-red-500" />
                        </div>
                      )}
                      {activity.type === "ai" && (
                        <div className="h-8 w-8 rounded-full bg-nova/10 flex items-center justify-center">
                          <Brain size={16} className="text-nova" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-white space-x-1">
                        {activity.type === "deposit" && <span>Deposit to</span>}
                        {activity.type === "withdraw" && <span>Withdraw from</span>}
                        {activity.type === "ai" && <span>AI optimized</span>}
                        <span className={
                          activity.vault.includes("DEEP") ? "text-nova" :
                          activity.vault.includes("CETUS") ? "text-orion" : "text-emerald"
                        }>
                          {activity.vault}
                        </span>
                      </div>

                      <div className="text-xs text-white/60 mt-1">
                        {activity.type === "ai" ? (
                          <div className="flex items-center">
                            <span>{activity.aiAction}</span>
                            <span className="mx-1.5">•</span>
                            <span className="text-emerald font-medium">{activity.aiResult}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="font-mono font-medium text-white/80">
                              {formatCurrency(activity.amount || 0)}
                            </span>
                            <span className="mx-1.5">•</span>
                            <span className="font-mono">0x...{activity.user}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono mt-1">
                    {getTimeAgo(activity.timestamp)} ago
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-white/40">
              No activities found
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
