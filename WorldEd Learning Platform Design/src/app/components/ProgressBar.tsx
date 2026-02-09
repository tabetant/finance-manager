import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function ProgressBar({ value, className = '', showLabel = false, color = 'primary' }: ProgressBarProps) {
  const colorStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colorStyles[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1 text-right">{value}%</p>
      )}
    </div>
  );
}
