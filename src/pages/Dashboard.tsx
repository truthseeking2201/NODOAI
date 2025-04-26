import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { ReceiptTokenCard } from "@/components/dashboard/ReceiptTokenCard";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PositionsPanel } from "@/components/dashboard/PositionsPanel";
import { ActivityFeedPanel } from "@/components/dashboard/ActivityFeedPanel";
import { TxDrawer } from "@/components/dashboard/TxDrawer";

export default function Dashboard() {
  const { isConnected, address, balance, openConnectModal } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);

  // Fetch user investments
  const {
    data: investments,
    isLoading: isLoadingInvestments,
  } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected,
  });

  // Fetch transaction history
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected,
  });

  // Calculate portfolio metrics
  const totalInvestmentValue = investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const totalPrincipal = investments?.reduce((sum, inv) => sum + inv.principal, 0) || 0;
  const totalProfit = investments?.reduce((sum, inv) => sum + inv.profit, 0) || 0;

  // Generate performance data for chart
  const performanceData = useMemo(() => {
    if (!transactions) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const data = [];
    for (let i = 0; i <= 29; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayFactor = i / 29;
      const growthFactor = 1 + (Math.sin(i/5) * 0.01) + (dayFactor * 0.08);
      const baseValue = totalPrincipal * growthFactor;

      // Handle transactions in the new TransactionHistory format
      const depositsOnThisDay = transactions?.filter(tx =>
        tx.type === 'deposit' && tx.timestamp.split('T')[0] === dateStr
      ) || [];

      const depositAmount = depositsOnThisDay.reduce((sum, tx) => sum + tx.amount, 0);

      data.push({
        date: dateStr,
        value: baseValue,
        profit: baseValue - totalPrincipal,
        deposit: depositAmount > 0 ? depositAmount : undefined
      });
    }

    return data;
  }, [transactions, totalPrincipal]);

  // Calculate weighted average APR
  const averageAPR = useMemo(() => {
    if (!investments || investments.length === 0) return 0;

    const totalValueWithAPR = investments.reduce((sum, inv) => {
      let aprEstimate = 0;
      if (inv.vaultId.includes('deep')) aprEstimate = 24.8;
      else if (inv.vaultId.includes('cetus')) aprEstimate = 18.7;
      else aprEstimate = 12.5;

      return sum + (inv.currentValue * aprEstimate);
    }, 0);

    return totalInvestmentValue > 0 ? totalValueWithAPR / totalInvestmentValue : 0;
  }, [investments, totalInvestmentValue]);

  // Handle withdraw click
  const handleWithdrawClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setIsWithdrawModalOpen(true);
  };

  // Handle transaction selection
  const handleTxSelect = (tx: TransactionHistory) => {
    setSelectedTx(tx);
    setIsTxDrawerOpen(true);
  };

  // If not connected, show connect prompt
  if (!isConnected) {
    return (
      <PageContainer className="mx-auto max-w-7xl">
        <div className="max-w-md mx-auto mt-12">
          <EmptyState
            title="Connect Your Wallet"
            description="Connect your wallet to access your personalized dashboard and view your investment portfolio."
            actionLabel="Connect Wallet"
            actionLink="#"
            onActionClick={openConnectModal}
          />
        </div>
      </PageContainer>
    );
  }

  // Show receipt token card only if user has balance
  const showReceiptTokenCard = balance && balance.receiptTokens > 0;

  return (
    <PageContainer className="mx-auto max-w-7xl pb-20">
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Your <span className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-transparent bg-clip-text">Portfolio</span>
          </h1>
          <p className="text-white/60 text-sm">
            Live snapshot of your vault positions
          </p>
        </div>

        {/* Metrics Grid */}
        <MetricsGrid
          isLoading={isLoadingInvestments}
          totalDeposited={totalPrincipal}
          totalValue={totalInvestmentValue}
          totalProfit={totalProfit}
          avgApr={averageAPR}
          investments={investments || []}
        />

        {/* Receipt Token Card */}
        {showReceiptTokenCard && (
          <ReceiptTokenCard />
        )}

        {/* Performance Chart */}
        <div className="bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-medium">Portfolio Performance</h2>
          </div>
          <div className="p-4">
            <PerformanceChart
              data={performanceData}
              transactions={transactions}
              isLoading={isLoadingInvestments || isLoadingTransactions}
              onTxClick={handleTxSelect}
            />
          </div>
        </div>

        {/* Active Positions */}
        <PositionsPanel
          positions={investments || []}
          isLoading={isLoadingInvestments}
          onWithdraw={handleWithdrawClick}
        />

        {/* Activity Feed */}
        <ActivityFeedPanel
          activities={transactions || []}
          isLoading={isLoadingTransactions}
        />
      </div>

      {/* Transaction Drawer */}
      <TxDrawer
        tx={selectedTx}
        open={isTxDrawerOpen}
        onClose={() => setIsTxDrawerOpen(false)}
      />

      {/* Withdraw Modal */}
      {selectedInvestment && (
        <WithdrawModal
          open={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          investment={selectedInvestment}
        />
      )}
    </PageContainer>
  );
}
