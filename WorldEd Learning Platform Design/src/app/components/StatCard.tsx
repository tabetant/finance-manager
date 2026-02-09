import React from 'react';
import { Card } from './Card';
import { CircularProgress } from './CircularProgress';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  progress?: number;
  showProgress?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon, progress, showProgress = false, color }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
      {showProgress && progress !== undefined ? (
        <CircularProgress value={progress} size={60} strokeWidth={6} color={color} />
      ) : (
        icon && <div className="text-primary">{icon}</div>
      )}
    </Card>
  );
}
