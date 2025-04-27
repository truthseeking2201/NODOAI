import React, { useEffect, useState, useRef } from "react";
import { Brain, TrendingUp, DollarSign, Users, Zap, Network, Lock, ShieldCheck } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { StatChip } from "./StatChip";

export function EnhancedHeroSection() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    refetchOnWindowFocus: false,
  });

  const [kpiData, setKpiData] = useState({
    tvl: "$6.3M",
    apr: "18.7%",
    activeLPs: "2,000+"
  });

  const [animateNetwork, setAnimateNetwork] = useState(true);
  const networkRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading || !vaults) return;

    // Calculate total TVL
    const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)}M`;

    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)}%`;

    // Simulate active LPs (would come from real data in production)
    const activeLPs = "2,000+";

    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);

  useEffect(() => {
    // Animation for the AI logo
    controls.start({
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [controls]);

  // Create neural network nodes and connections
  const createNetworkElements = () => {
    if (!networkRef.current) return null;

    const nodes = [];
    const connections = [];
    const nodeCount = 20;
    const width = networkRef.current.offsetWidth;
    const height = networkRef.current.offsetHeight;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 2 + Math.random() * 3;

      nodes.push(
        <motion.div
          key={`node-${i}`}
          className="absolute rounded-full bg-white/40"
          style={{
            width: size,
            height: size,
            left: x,
            top: y,
            boxShadow: `0 0 ${size * 2}px rgba(255, 136, 0, 0.3)`
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      );

      // Create connections between some nodes
      if (i > 0 && Math.random() > 0.6) {
        const target = Math.floor(Math.random() * i);
        connections.push(
          <svg
            key={`connection-${i}-${target}`}
            className="absolute top-0 left-0 w-full h-full z-0 overflow-visible"
            style={{ opacity: 0.05 + Math.random() * 0.15 }}
          >
            <line
              x1={x}
              y1={y}
              x2={Math.random() * width}
              y2={Math.random() * height}
              stroke="#FF8800"
              strokeWidth="0.5"
              strokeDasharray="1,2"
            />
          </svg>
        );
      }
    }

    return (
      <>
        {connections}
        {nodes}
      </>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const featureItems = [
    { icon: <Zap className="text-emerald h-5 w-5" />, text: "Automated Yield" },
    { icon: <Network className="text-nova h-5 w-5" />, text: "Neural Optimization" },
    { icon: <Lock className="text-orion h-5 w-5" />, text: "Secure Assets" },
    { icon: <ShieldCheck className="text-orion h-5 w-5" />, text: "Risk Management" }
  ];

  return (
    <div className="relative pb-0 mb-0">
      {/* Dynamic Neural Network Background */}
      <div
        ref={networkRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20"
      >
        {animateNetwork && createNetworkElements()}
      </div>

      {/* Gradient Orbs - simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-nova/10 blur-[120px]"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content with prominent headline */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto text-center py-4 md:py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="relative mb-3"
            animate={controls}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-nova to-amber-500 rounded-full blur-[20px] opacity-40 scale-150"></div>
            <div className="relative bg-gradient-to-br from-nova via-nova to-amber-500 p-3 md:p-4 rounded-full shadow-lg shadow-nova/20">
              <Brain size={32} className="text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent leading-tight"
            variants={headingVariants}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500 font-extrabold">NODO AI</span> Vaults
          </motion.h1>
        </div>

        <motion.p
          className="text-[#9CA3AF] text-base md:text-lg font-light max-w-[700px] mx-auto mt-2 mb-5"
          variants={itemVariants}
        >
          AI-powered vaults maximizing returns with smart risk management
        </motion.p>

        {/* Stats ribbon - more compact */}
        <motion.div
          className="relative z-10 mx-auto max-w-2xl bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-lg border border-white/10 rounded-xl px-2 shadow-[0_0_20px_rgba(255,136,0,0.1)]"
          variants={itemVariants}
        >
          <div className="flex flex-row justify-center items-center gap-4 md:gap-6 py-2">
            <div className="stat-item flex items-center gap-2">
              <div className="stat-icon bg-gradient-to-br from-emerald/30 to-emerald/5 p-1.5 rounded-lg shadow-md shadow-emerald/5">
                <DollarSign size={14} className="text-emerald" />
              </div>
              <StatChip
                label="TVL"
                value={kpiData.tvl}
                delta={{ value: 0.5 }}
                compact={true}
              />
            </div>

            <motion.div
              className="hidden md:block h-6 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"
              variants={itemVariants}
            />

            <div className="stat-item flex items-center gap-2">
              <div className="stat-icon bg-gradient-to-br from-nova/30 to-nova/5 p-1.5 rounded-lg shadow-md shadow-nova/5">
                <TrendingUp size={14} className="text-nova" />
              </div>
              <StatChip
                label="APR"
                value={kpiData.apr}
                delta={{ value: 0.2 }}
                compact={true}
              />
            </div>

            <motion.div
              className="hidden md:block h-6 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"
              variants={itemVariants}
            />

            <div className="stat-item flex items-center gap-2">
              <div className="stat-icon bg-gradient-to-br from-orion/30 to-orion/5 p-1.5 rounded-lg shadow-md shadow-orion/5">
                <Users size={14} className="text-orion" />
              </div>
              <StatChip
                label="Users"
                value={kpiData.activeLPs}
                delta={{ value: 0.8 }}
                compact={true}
              />
            </div>
          </div>

          {/* Animated accent border at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-nova to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
