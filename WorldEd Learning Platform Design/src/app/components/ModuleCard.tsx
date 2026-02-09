import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { Clock } from 'lucide-react';

export interface Module {
  id: string;
  title: string;
  courseTitle: string;
  progress: number;
  timeRemaining: string;
  thumbnail?: string;
}

interface ModuleCardProps {
  module: Module;
  onContinue?: (moduleId: string) => void;
}

export function ModuleCard({ module, onContinue }: ModuleCardProps) {
  return (
    <Card hover className="min-w-[300px] max-w-[320px]">
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">{module.courseTitle}</p>
        <h4 className="font-semibold text-foreground mb-2">{module.title}</h4>
        <ProgressBar value={module.progress} />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={14} />
          <span>{module.timeRemaining} left</span>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => onContinue?.(module.id)}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
