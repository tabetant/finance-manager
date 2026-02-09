import React from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { ArrowLeft, BookOpen, Clock, Users, CheckCircle, Lock, PlayCircle, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  duration: string;
  status: 'completed' | 'locked' | 'in-progress' | 'not-started';
  hasQuiz?: boolean;
}

interface CoursePageProps {
  courseId: string;
  onBack?: () => void;
  onEddiClick?: () => void;
  onModuleClick?: (moduleId: string) => void;
  onEnroll?: () => void;
}

export function CoursePage({ 
  courseId, 
  onBack, 
  onEddiClick, 
  onModuleClick,
  onEnroll 
}: CoursePageProps) {
  // Mock course data
  const course = {
    id: courseId,
    title: 'Calculus I',
    description: 'Master the fundamentals of calculus including limits, derivatives, and integration. This comprehensive course provides a solid foundation for advanced mathematics, physics, and engineering.',
    difficulty: 'Intermediate' as const,
    estimatedTime: '~12 hours',
    enrollmentCount: 4234,
    imageUrl: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMHN0dWR5fGVufDF8fHx8MTc3MDU1OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    enrolled: true,
    progress: 65,
    prerequisites: ['Algebra II', 'Trigonometry'],
    modules: [
      { id: '1', number: 1, title: 'Introduction to Limits', duration: '45 min', status: 'completed' as const },
      { id: '2', number: 2, title: 'Limit Laws and Properties', duration: '50 min', status: 'completed' as const, hasQuiz: true },
      { id: '3', number: 3, title: 'Continuity and Discontinuity', duration: '40 min', status: 'completed' as const },
      { id: '4', number: 4, title: 'Introduction to Derivatives', duration: '55 min', status: 'in-progress' as const },
      { id: '5', number: 5, title: 'Derivative Rules', duration: '60 min', status: 'not-started' as const, hasQuiz: true },
      { id: '6', number: 6, title: 'Chain Rule and Applications', duration: '50 min', status: 'locked' as const },
      { id: '7', number: 7, title: 'Implicit Differentiation', duration: '45 min', status: 'locked' as const },
      { id: '8', number: 8, title: 'Related Rates', duration: '55 min', status: 'locked' as const, hasQuiz: true },
      { id: '9', number: 9, title: 'Linear Approximation', duration: '40 min', status: 'locked' as const },
      { id: '10', number: 10, title: 'Optimization Problems', duration: '65 min', status: 'locked' as const },
    ],
  };
  
  const difficultyColors = {
    Beginner: 'success' as const,
    Intermediate: 'warning' as const,
    Advanced: 'primary' as const,
  };
  
  const statusIcons = {
    completed: <CheckCircle size={20} className="text-[var(--success)]" />,
    locked: <Lock size={20} className="text-muted-foreground" />,
    'in-progress': <PlayCircle size={20} className="text-primary" />,
    'not-started': <Circle size={20} className="text-muted-foreground" />,
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation onEddiClick={onEddiClick} currentPage="courses" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>
        
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 mb-8 border border-border"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Course Image */}
            <div className="md:col-span-1">
              <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg">
                <ImageWithFallback 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Course Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={difficultyColors[course.difficulty]}>{course.difficulty}</Badge>
                <Badge variant="outline">Mathematics</Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{course.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{course.enrollmentCount.toLocaleString()} students</span>
                </div>
              </div>
              
              {/* Progress or Enroll */}
              {course.enrolled ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Course Progress</span>
                    <span className="text-sm font-semibold text-foreground">{course.progress}% complete</span>
                  </div>
                  <ProgressBar value={course.progress} className="mb-4" />
                  <Button variant="primary" size="lg">Continue Course</Button>
                </div>
              ) : (
                <Button variant="primary" size="lg" onClick={onEnroll}>Enroll Now</Button>
              )}
            </div>
          </div>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Curriculum</h2>
            
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => module.status !== 'locked' && onModuleClick?.(module.id)}
                  className={`
                    bg-card border border-border rounded-xl p-4 
                    ${module.status !== 'locked' ? 'hover:shadow-md hover:border-primary/20 cursor-pointer' : 'opacity-60'}
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Module Number Badge */}
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold">
                        #{module.number}
                      </div>
                      
                      {/* Module Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {module.duration}
                          </span>
                          {module.hasQuiz && (
                            <Badge variant="warning" className="text-xs">Quiz Available</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Icon */}
                    <div>
                      {statusIcons[module.status]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Prerequisites */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq) => (
                    <li key={prereq} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} className="text-[var(--success)]" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Related Courses */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Related Courses</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-primary hover:underline">
                    Calculus II
                  </button>
                  <button className="w-full text-left text-sm text-primary hover:underline">
                    Multivariable Calculus
                  </button>
                  <button className="w-full text-left text-sm text-primary hover:underline">
                    Differential Equations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
