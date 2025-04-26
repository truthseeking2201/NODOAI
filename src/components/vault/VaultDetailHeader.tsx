import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface VaultDetailHeaderProps {
  vaultName: string; // Internal reference, not shown to users
  styles: {
    gradientText: string;
  };
}

export function VaultDetailHeader({ vaultName, styles }: VaultDetailHeaderProps) {
  const getVaultInfo = () => {
    if (vaultName.includes('SUI-USDC')) {
      return {
        displayName: 'Conservative Yield Vault',
        riskBadge: {
          text: 'Low Risk',
          class: 'bg-emerald/20 text-emerald'
        }
      };
    } else if (vaultName.includes('Cetus')) {
      return {
        displayName: 'Balanced Yield Vault',
        riskBadge: {
          text: 'Moderate Risk',
          class: 'bg-orion/20 text-orion'
        }
      };
    } else {
      return {
        displayName: 'Aggressive Yield Vault',
        riskBadge: {
          text: 'High Risk',
          class: 'bg-nova/20 text-nova'
        }
      };
    }
  };

  const vaultInfo = getVaultInfo();

  return (
    <div className="mb-10 mt-10">
      <Link to="/">
        <Button
          variant="ghost"
          className="mb-4 mt-2 rounded-xl flex items-center gap-2 text-[#C9CDD3] hover:text-white font-medium text-xs tracking-wide"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Vaults
        </Button>
      </Link>
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl md:text-4xl font-bold ${styles.gradientText}`}>
          {vaultInfo.displayName}
        </h1>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${vaultInfo.riskBadge.class}`}>
          <ShieldCheck className="h-4 w-4" />
          {vaultInfo.riskBadge.text}
        </div>
      </div>
    </div>
  );
}
