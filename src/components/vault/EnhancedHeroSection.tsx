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
    <div className="relative pb-14 mb-8">
      {/* Dynamic Neural Network Background */}
      <div
        ref={networkRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20"
      >
        {animateNetwork && createNetworkElements()}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-60 -left-60 w-[800px] h-[800px] rounded-full bg-nova/10 blur-[140px]"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-60 w-[600px] h-[600px] rounded-full bg-emerald/10 blur-[120px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-[800px] mx-auto text-center mt-16 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            animate={controls}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-nova to-amber-500 rounded-full blur-[20px] opacity-30 scale-150"></div>
            <div className="relative bg-gradient-to-br from-nova via-nova to-amber-500 p-4 rounded-full shadow-lg shadow-nova/20">
              <Brain size={36} className="text-white" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-5 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
          variants={headingVariants}
        >
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500 font-extrabold">NODO AI</span> Vaults
        </motion.h1>

        <motion.p
          className="text-[#9CA3AF] text-xl font-light max-w-[600px] mx-auto mb-8"
          variants={itemVariants}
        >
          AI-powered vaults maximizing returns with smart risk management
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          variants={itemVariants}
        >
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
              <span className="text-white/80">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats ribbon with enhanced design */}
        <motion.div
          className="relative z-10 mx-auto max-w-4xl bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-2 shadow-[0_0_40px_rgba(255,136,0,0.1)]"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 py-8">
            <div className="stat-item flex items-center gap-4">
              <div className="stat-icon bg-gradient-to-br from-emerald/30 to-emerald/5 p-4 rounded-2xl shadow-lg shadow-emerald/5">
                <DollarSign size={24} className="text-emerald" />
              </div>
              <StatChip
                label="Total TVL"
                value={kpiData.tvl}
                delta={{ value: 0.5 }}
              />
            </div>

            <motion.div
              className="hidden md:block h-12 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"
              variants={itemVariants}
            />

            <div className="stat-item flex items-center gap-4">
              <div className="stat-icon bg-gradient-to-br from-nova/30 to-nova/5 p-4 rounded-2xl shadow-lg shadow-nova/5">
                <TrendingUp size={24} className="text-nova" />
              </div>
              <StatChip
                label="Average APR"
                value={kpiData.apr}
                delta={{ value: 0.2 }}
              />
            </div>

            <motion.div
              className="hidden md:block h-12 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"
              variants={itemVariants}
            />

            <div className="stat-item flex items-center gap-4">
              <div className="stat-icon bg-gradient-to-br from-orion/30 to-orion/5 p-4 rounded-2xl shadow-lg shadow-orion/5">
                <Users size={24} className="text-orion" />
              </div>
              <StatChip
                label="Active LPs"
                value={kpiData.activeLPs}
                delta={{ value: 0.8 }}
              />
            </div>
          </div>

          {/* Animated accent border at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-nova to-transparent"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
