import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { WalletIcon, Download } from "lucide-react";

// Dashboard components
import { VaultRowAccordion } from "@/components/dashboard/VaultRowAccordion";
import { TxDrawer } from "@/components/dashboard/TxDrawer";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { VaultMetricsHeader } from "@/components/dashboard/VaultMetricsHeader";
import { DualActivityFeed } from "@/components/dashboard/DualActivityFeed";

export default function Dashboard() {
  const { isConnected, address, openWalletModal } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  const {
    data: investments,
    isLoading: isLoadingInvestments,
  } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected,
  });

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected,
  });

  const totalInvestmentValue = investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const totalPrincipal = investments?.reduce((sum, inv) => sum + inv.principal, 0) || 0;
  const totalProfit = investments?.reduce((sum, inv) => sum + inv.profit, 0) || 0;

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

  const averageAPR = useMemo(() => {
    if (!investments || investments.length === 0) return 0;

    const totalValueWithAPR = investments.reduce((sum, inv) => {
      let aprEstimate = 0;
      if (inv.vaultId.includes('deep')) aprEstimate = 21.5;
      else if (inv.vaultId.includes('cetus')) aprEstimate = 18.9;
      else aprEstimate = 15.2;

      return sum + (inv.currentValue * aprEstimate);
    }, 0);

    return totalInvestmentValue > 0 ? totalValueWithAPR / totalInvestmentValue : 0;
  }, [investments, totalInvestmentValue]);

  const handleWithdrawClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setIsWithdrawModalOpen(true);
  };

  const handleTxSelect = (tx: TransactionHistory) => {
    setSelectedTx(tx);
    setIsTxDrawerOpen(true);
  };

  const handleExportCSV = () => {
    setExportingCSV(true);
    setTimeout(() => {
      setExportingCSV(false);
      alert("Transactions exported to CSV");
    }, 1500);
  };

  if (!isConnected) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto mt-12">
          <EmptyState
            title="Connect Your Wallet"
            description="Connect your wallet to access your personalized dashboard and view your investment portfolio."
            actionLabel="Connect Wallet"
            actionLink="#"
          />
          <Button
            onClick={openWalletModal}
            className="gradient-bg-nova hover:shadow-neon-nova w-full mt-4 hidden"
            data-wallet-connect
          >
            <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Your <span className="gradient-text-nova">Portfolio</span>
          </h1>
          <p className="text-white/60 text-sm">
            Live snapshot of your vault positions
          </p>
        </div>
      </div>

      {/* Replace KpiBar with VaultMetricsHeader */}
      <VaultMetricsHeader
        investments={investments || []}
        className="mb-8"
      />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div>
          <PerformanceChart
            data={performanceData}
            transactions={transactions}
            isLoading={isLoadingInvestments || isLoadingTransactions}
            onTxClick={handleTxSelect}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Active Positions</h2>

      {isLoadingInvestments ? (
        <div className="space-y-4 mb-8">
          {[1, 2].map(i => (
            <div key={i} className="glass-card h-24 animate-shimmer"></div>
          ))}
        </div>
      ) : investments && investments.length > 0 ? (
        <div className="mb-8">
          {investments.map((investment) => (
            <VaultRowAccordion
              key={investment.vaultId}
              investment={investment}
              onWithdraw={handleWithdrawClick}
            />
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <EmptyState
            title="No Active Investments"
            description="You don't have any active investments. Start by exploring our vaults and making your first deposit."
            actionLabel="Explore Vaults"
            actionLink="/"
          />
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Activity</h2>
      {isLoadingTransactions ? (
        <div className="glass-card h-64 animate-shimmer"></div>
      ) : transactions && transactions.length > 0 ? (
        <DualActivityFeed
          transactions={transactions || []}
        />
      ) : (
        <EmptyState
          title="No Activity Yet"
          description="You haven't made any transactions yet. Make your first deposit to get started."
          actionLabel="Explore Vaults"
          actionLink="/"
        />
      )}

      <TxDrawer
        tx={selectedTx}
        open={isTxDrawerOpen}
        onClose={() => setIsTxDrawerOpen(false)}
      />

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
