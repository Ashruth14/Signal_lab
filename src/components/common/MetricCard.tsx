import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  accentColor?: 'terracotta' | 'amber' | 'green' | 'blue' | 'purple';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  accentColor = 'terracotta',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[12px] bg-white p-5 border border-[#ebebeb] transition-all duration-150 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] ${
        onClick ? 'cursor-pointer hover:border-[#171717] hover:shadow-[0px_2px_4px_rgba(0,0,0,0.06)]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              {value}
            </span>
          </div>
        </div>
        {Icon && (
          <div className="rounded-[6px] p-2 bg-[#fafafa] border border-[#ebebeb] text-[#171717]">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#f2f2f2]">
          {subtitle && <span className="text-[#8f8f8f] truncate max-w-[200px] text-[11px]">{subtitle}</span>}
          {change && (
            <span
              className={`flex items-center gap-1 font-mono text-[11px] font-medium ${
                changeType === 'up'
                  ? 'text-[#047857]'
                  : changeType === 'down'
                  ? 'text-[#ee0000]'
                  : 'text-[#8f8f8f]'
              }`}
            >
              {changeType === 'up' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'down' && <TrendingDown className="h-3 w-3" />}
              {changeType === 'neutral' && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
