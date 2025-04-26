
import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatChipProps {
  label: string;
  value: string;
  delta?: { value: number; timeframe?: string };
  compact?: boolean;
}

export function StatChip({ label, value, delta, compact = false }: StatChipProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`font-medium text-[#9CA3AF] ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
      <div className="flex items-start gap-1.5">
        <span className={`font-mono font-bold text-white tabular-nums ${compact ? 'text-xl' : 'text-3xl'}`}>
          {value}
        </span>
        {delta && (
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
            delta.value >= 0 ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'
          } ${compact ? 'mt-0.5 text-[10px]' : 'mt-1.5 text-xs'}`}>
            {delta.value >= 0 ?
              <ArrowUp size={compact ? 10 : 12} className="text-emerald" /> :
              <ArrowDown size={compact ? 10 : 12} className="text-red-500" />
            }
          </div>
        )}
      </div>
    </div>
  );
}
