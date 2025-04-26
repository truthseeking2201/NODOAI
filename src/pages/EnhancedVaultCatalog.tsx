import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { EnhancedHeroSection } from "@/components/vault/EnhancedHeroSection";
import { EnhancedVaultGrid } from "@/components/vault/EnhancedVaultGrid";
import { EnhancedActivitySection } from "@/components/vault/EnhancedActivitySection";
import { EnhancedNeuralActivityTicker } from "@/components/vault/EnhancedNeuralActivityTicker";
import { AIInsightsModule } from "@/components/vault/AIInsightsModule";
import { NeuralNetworkBackground } from "@/components/vault/NeuralNetworkBackground";
import { AIProcessingVisualizer } from "@/components/vault/AIProcessingVisualizer";
import { useWallet } from "@/hooks/useWallet";
import { VaultData } from "@/types/vault";
import { adaptVaultsToVaultData } from "@/utils/vaultAdapter";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Brain,
  SlidersHorizontal,
  ArrowUpDown,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
  Filter,
  Search,
  Cpu,
  Lock
} from "lucide-react";

// Vault filter types
type VaultFilter = 'All' | 'Top APR' | 'Lowest Risk' | 'New';

export default function EnhancedVaultCatalog() {
  const { data: rawVaults, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Convert raw vaults to VaultData[] for component compatibility
  const vaults = React.useMemo<VaultData[]>(() => {
    if (!rawVaults) return [];
    return adaptVaultsToVaultData(rawVaults);
  }, [rawVaults]);

  const { isConnected, balance } = useWallet();
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrainAnimation, setShowBrainAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  // Trigger brain animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrainAnimation(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVaultHover = (id: string) => {
    setActiveVaultId(id);
  };

  // Filter vaults based on selected filter
  const filteredVaults = React.useMemo(() => {
    if (!vaults.length) return [];

    // First apply search query if any
    let filtered = vaults;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vault =>
        vault.name.toLowerCase().includes(query) ||
        vault.description.toLowerCase().includes(query)
      );
    }

    // Then apply category filter
    switch (activeFilter) {
      case 'Top APR':
        return [...filtered].sort((a, b) => b.apr - a.apr);
      case 'Lowest Risk':
        // Sort by risk level: low -> medium -> high
        return [...filtered].sort((a, b) => {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        });
      case 'New':
        // For demo purposes, just sort by ID - in a real app, would sort by creation date
        return [...filtered].sort((a, b) => a.id.localeCompare(b.id));
      case 'All':
      default:
        return filtered;
    }
  }, [vaults, activeFilter, searchQuery]);

  return (
    <PageContainer className="min-h-screen overflow-x-hidden bg-[#0A0B0D]">
      <div ref={containerRef} className="relative z-0">
        {/* Neural network background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Advanced Neural Network Visualization */}
          <NeuralNetworkBackground
            nodeCount={40}
            connectionDensity={0.2}
            nodesColor="rgba(249, 115, 22, 0.6)"
            connectionsColor="rgba(249, 115, 22, 0.15)"
            activeNodeColor="rgba(249, 115, 22, 0.9)"
            flowSpeed={0.8}
            className="opacity-30"
          />

          {/* Gradient orbs for additional depth */}
          <motion.div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-nova/10 blur-[120px]"
            style={{ y: y1 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-60 -right-40 w-[500px] h-[500px] rounded-full bg-orion/10 blur-[120px]"
            style={{ y: y2 }}
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Hero section with 3D effects */}
        <motion.section
          className="py-10 md:py-16 relative"
          style={{ opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <EnhancedHeroSection />
        </motion.section>

        {/* AI Neural Activity Ticker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-14 px-4"
        >
          <EnhancedNeuralActivityTicker />
        </motion.section>

        {/* AI Insights Module */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="px-4"
        >
          <AIInsightsModule />
        </motion.section>

        {/* AI Processing Visualization Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="pt-6 pb-16 px-4"
        >
          <div className="max-w-screen-lg mx-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-nova/20 to-nova/5">
                    <Cpu size={20} className="text-nova" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Neural Network</h2>
                    <p className="text-sm text-white/60">Optimization Engine</p>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">
                  Watch NODO's AI continuously analyze market data and optimize yield strategies in real-time.
                  The neural network processes thousands of data points per second to maximize returns.
                </p>

                <div className="bg-black/40 rounded-lg border border-white/5 p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-xs text-white/50 mb-1">DATA PROCESSED</div>
                      <div className="text-lg font-mono text-white">2.4M+</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">OPTIMIZATIONS</div>
                      <div className="text-lg font-mono text-white">984</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">SUCCESS RATE</div>
                      <div className="text-lg font-mono text-emerald">98.7%</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">APR INCREASE</div>
                      <div className="text-lg font-mono text-nova">+3.8%</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Lock size={12} />
                  <span>Secure zero-knowledge processing</span>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
                <AIProcessingVisualizer
                  size="lg"
                  type="optimization"
                  autoAnimate={true}
                  processingTime={8000}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vaults Section */}
        <motion.section
          className="py-14 relative px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="max-w-screen-xl mx-auto">
            {/* Section Header with AI Animation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nova/20 to-transparent flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={showBrainAnimation ? {
                        scale: [0.8, 1.2, 1],
                        opacity: [0, 1, 1],
                      } : {}}
                      transition={{ duration: 1 }}
                    >
                      <Brain size={20} className="text-nova" />
                    </motion.div>
                  </div>
                  {showBrainAnimation && (
                    <motion.div
                      className="absolute -inset-1 rounded-lg border border-nova/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.2, 1.4]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 5
                      }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500">Yield Vaults</span>
                  </h2>
                  <p className="text-white/60 text-sm">
                    Neural networks optimizing crypto yields 24/7
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full md:w-auto">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search vaults..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-44 bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-nova/50 focus:border-nova/50"
                  />
                </div>

                {/* Filter dropdown */}
                <div className="relative group">
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/90 transition-colors">
                    <Filter size={16} className="text-white/60" />
                    <span>{activeFilter}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg py-1 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {["All", "Top APR", "Lowest Risk", "New"].map((filter) => (
                      <button
                        key={filter}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 ${filter === activeFilter ? 'bg-white/10 text-nova' : 'text-white/80'}`}
                        onClick={() => setActiveFilter(filter as VaultFilter)}
                      >
                        {filter === "Top APR" && <TrendingUp size={14} className="text-nova" />}
                        {filter === "Lowest Risk" && <Shield size={14} className="text-emerald" />}
                        {filter === "New" && <Zap size={14} className="text-orion" />}
                        {filter === "All" && <SlidersHorizontal size={14} className="text-white/60" />}
                        <span>{filter}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort options */}
                <button className="flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/90 transition-colors">
                  <ArrowUpDown size={16} className="text-white/60" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            {/* Vault Grid with Loading and Error States */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingState
                    key={index}
                    type="card"
                    height={360}
                    className="w-full"
                  />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                type="error"
                title="Unable to Load Vaults"
                message="We encountered an issue while loading the vaults. Please try again later."
                onRetry={() => refetch()}
              />
            ) : filteredVaults.length > 0 ? (
              <EnhancedVaultGrid
                vaults={filteredVaults}
                isConnected={isConnected}
                balance={balance}
                activeVaultId={activeVaultId}
                onVaultHover={handleVaultHover}
              />
            ) : (
              <div className="bg-black/30 border border-white/10 rounded-xl p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Search size={24} className="text-white/40" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Vaults Found</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  {searchQuery
                    ? `No vaults match your search query "${searchQuery}". Try a different search term.`
                    : "There are no vaults available with the selected filters. Please try different criteria."
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Activity Feed Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="pb-20 px-4"
        >
          <div className="max-w-screen-xl mx-auto">
            <EnhancedActivitySection />
          </div>
        </motion.section>

        {/* Enhanced Footer with AI branding */}
        <motion.div
          className="max-w-screen-xl mx-auto px-4 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="relative border-t border-white/10 pt-10">
            {/* Neural line animation */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-nova/80 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-nova" />
                  <h3 className="text-sm font-medium">AI-Powered Security</h3>
                </div>
                <p className="text-xs text-white/50">
                  NODO's neural security framework continuously monitors for market anomalies and protocol risks,
                  automatically implementing protective measures to safeguard your crypto assets.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Network size={16} className="text-orion" />
                  <h3 className="text-sm font-medium">Neural Optimization</h3>
                </div>
                <p className="text-xs text-white/50">
                  Our advanced neural networks analyze over 500,000 on-chain data points daily to
                  optimize yield-generating strategies with 97.2% accuracy, constantly adapting to market conditions.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-emerald" />
                  <h3 className="text-sm font-medium">Smart Risk Management</h3>
                </div>
                <p className="text-xs text-white/50">
                  NODO employs multi-layered risk assessment models to dynamically balance risk and reward,
                  giving you the confidence to earn optimal yields with predictable risk parameters.
                </p>
              </div>
            </div>

            <div className="text-center border-t border-white/5 pt-6">
              <p className="text-xs text-white/40 max-w-xl mx-auto">
                NODO AI optimizes yield performance through advanced neural networks and machine learning algorithms.
                Past performance is not indicative of future results. The AI models continuously adapt to changing market conditions.
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-nova/50"></div>
                  <span>AI Model v2.4</span>
                </div>
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orion/50"></div>
                  <span>Neural Optimizer</span>
                </div>
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald/50"></div>
                  <span>Risk Engine v1.8</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
