import React from 'react';

interface StatusBadgeProps {
  label: string;
  variant?: 'terracotta' | 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
}) => {
  const variantStyles = {
    terracotta: 'bg-[#171717] text-[#ffffff] border-[#171717]',
    amber: 'bg-[#ffefcf] text-[#ab570a] border-[#fcd34d]',
    green: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    red: 'bg-[#fef2f2] text-[#ee0000] border-[#fecaca]',
    blue: 'bg-[#eff6ff] text-[#0070f3] border-[#bfdbfe]',
    purple: 'bg-[#f5f3ff] text-[#7928ca] border-[#ddd6fe]',
    neutral: 'bg-[#f5f5f5] text-[#4d4d4d] border-[#ebebeb]',
  };

  const dotColors = {
    terracotta: 'bg-white',
    amber: 'bg-[#f5a623]',
    green: 'bg-[#10b981]',
    red: 'bg-[#ee0000]',
    blue: 'bg-[#0070f3]',
    purple: 'bg-[#7928ca]',
    neutral: 'bg-[#8f8f8f]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border tracking-tight transition-all ${
        variantStyles[variant]
      } ${sizeStyles[size]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      <span>{label}</span>
    </span>
  );
};
