import { Clock, ArrowRight } from 'lucide-react';

interface ModuleProgressCardProps {
  courseTitle: string;
  moduleTitle: string;
  progress: number;
  timeRemaining: string;
  thumbnail?: string;
  onContinue?: () => void;
}

export function ModuleProgressCard({
  courseTitle,
  moduleTitle,
  progress,
  timeRemaining,
  thumbnail,
  onContinue,
}: ModuleProgressCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 min-w-[320px] hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center text-5xl">
        {thumbnail || '📚'}
      </div>

      {/* Content */}
      <p className="text-xs text-muted-foreground mb-1">{courseTitle}</p>
      <h4 className="font-bold mb-3 line-clamp-2">{moduleTitle}</h4>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">{progress}% complete</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{timeRemaining} left</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary rounded-full h-1.5 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
