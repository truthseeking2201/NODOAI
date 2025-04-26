
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { ActivitySection } from "@/components/vault/ActivitySection";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error, refetch } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });

  const { isConnected, balance } = useWallet();
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const { isMobile, isMd } = useBreakpoint();

  const handleVaultHover = (id: string) => {
    if (!isMobile) { // Only activate hover effects on non-mobile
      setActiveVaultId(id);
    }
  };

  return (
    <PageContainer className="page-container">
      <div className="flex flex-col space-y-12 relative z-0">
        <section className="section-spacing-compact md:section-spacing">
          <HeroSection />
        </section>

        <section className="relative component-spacing">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: isMobile ? 1 : 3 }).map((_, index) => (
                <LoadingState
                  key={index}
                  type="card"
                  height={300}
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
          ) : vaults && vaults.length > 0 ? (
            <div className="component-spacing">
              <VaultGrid
                vaults={vaults}
                isConnected={isConnected}
                balance={balance || { usdc: 0 }}
                activeVaultId={activeVaultId}
                onVaultHover={handleVaultHover}
              />
              <ActivitySection />
            </div>
          ) : (
            <ErrorState
              type="info"
              title="No Vaults Available"
              message="There are no vaults available at this time. Please check back later."
            />
          )}
        </section>
      </div>
    </PageContainer>
  );
}
