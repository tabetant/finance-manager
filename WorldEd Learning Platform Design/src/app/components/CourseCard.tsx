import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { BookOpen, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  moduleCount: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled?: boolean;
  progress?: number;
  imageUrl: string;
  icon?: React.ReactNode;
}

interface CourseCardProps {
  course: Course;
  onCourseClick?: (courseId: string) => void;
}

export function CourseCard({ course, onCourseClick }: CourseCardProps) {
  const difficultyColors = {
    Beginner: 'success' as const,
    Intermediate: 'warning' as const,
    Advanced: 'primary' as const,
  };
  
  return (
    <Card hover className="h-full flex flex-col" onClick={() => onCourseClick?.(course.id)}>
      {/* Course Image */}
      <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden">
        <ImageWithFallback 
          src={course.imageUrl} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Course Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <Badge variant={difficultyColors[course.difficulty]}>{course.difficulty}</Badge>
          <Badge variant="outline">{course.category}</Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{course.description}</p>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{course.moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.estimatedTime}</span>
          </div>
        </div>
        
        {/* Progress or CTA */}
        {course.enrolled && course.progress !== undefined ? (
          <div className="mb-3">
            <ProgressBar value={course.progress} showLabel />
          </div>
        ) : null}
        
        <Button 
          variant={course.enrolled ? 'primary' : 'outline'} 
          size="md" 
          className="w-full"
        >
          {course.enrolled ? 'Continue' : 'Start Course'}
        </Button>
      </div>
    </Card>
  );
}
