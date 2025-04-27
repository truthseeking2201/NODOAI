
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { VaultPerformanceChart } from "./VaultPerformanceChart";
import { VaultData } from "@/types/vault";
import { AIRebalancingTicker } from "./AIRebalancingTicker";

interface VaultPerformanceSectionProps {
  vault: VaultData;
  timeRange: "daily" | "weekly" | "monthly";
  onTimeRangeChange: (range: "daily" | "weekly" | "monthly") => void;
  styles: {
    gradientBg: string;
  };
}

export function VaultPerformanceSection({
  vault,
  timeRange,
  onTimeRangeChange,
  styles
}: VaultPerformanceSectionProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-0 relative">
      {/* Top gradient border */}
      <div className={`h-1 ${
        vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
        vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
        'bg-gradient-to-r from-emerald to-green-500'
      }`} />

      <CardHeader className="flex flex-row items-center justify-between p-6 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className={`p-2 rounded-lg ${
              vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
              vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
              'bg-gradient-to-br from-emerald/30 to-emerald/10'
            }`}>
              <BarChart size={20} className={
                vault.type === 'nova' ? 'text-nova' :
                vault.type === 'orion' ? 'text-orion' :
                'text-emerald'} />
            </div>
            Performance
          </CardTitle>
          <CardDescription className="text-sm text-white/60">
            Historical vault performance
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "daily" ? "default" : "outline"}
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "daily"
                ? styles.gradientBg
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange("daily")}
          >
            Daily
          </Button>
          <Button
            variant={timeRange === "weekly" ? "default" : "outline"}
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "weekly"
                ? styles.gradientBg
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === "monthly" ? "default" : "outline"}
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "monthly"
                ? styles.gradientBg
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 overflow-hidden">
          <VaultPerformanceChart
            data={vault.performance[timeRange]}
            vaultType={vault.type}
            showAxisLabels={true}
            highlightLastDataPoint={true}
            timeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
            styles={styles}
          />

          {/* Add AI Rebalancing Ticker */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <AIRebalancingTicker variant="detail" vaultId={vault.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
