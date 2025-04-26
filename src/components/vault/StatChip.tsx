
import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatChipProps {
  label: string;
  value: string;
  delta?: { value: number; timeframe?: string };
}

export function StatChip({ label, value, delta }: StatChipProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[#9CA3AF]">{label}</span>
      <div className="flex items-start gap-1.5">
        <span className="font-mono text-3xl font-bold text-white tabular-nums">
          {value}
        </span>
        {delta && (
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
            delta.value >= 0 ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'
          } mt-1.5 text-xs`}>
            {delta.value >= 0 ?
              <ArrowUp size={12} className="text-emerald" /> :
              <ArrowDown size={12} className="text-red-500" />
            }
          </div>
        )}
      </div>
    </div>
  );
}
