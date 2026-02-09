import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { StatCard } from './StatCard';
import { CourseCard, Course } from './CourseCard';
import { ModuleCard, Module } from './ModuleCard';
import { BookOpen, Flame, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  userName?: string;
  onEddiClick?: () => void;
  onCourseClick?: (courseId: string) => void;
  onModuleContinue?: (moduleId: string) => void;
}

export function Dashboard({ 
  userName = 'Alex', 
  onEddiClick, 
  onCourseClick,
  onModuleContinue 
}: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Mock data for continuing modules
  const continueModules: Module[] = [
    {
      id: '1',
      title: 'Integration Techniques',
      courseTitle: 'Calculus I',
      progress: 65,
      timeRemaining: '15 min',
    },
    {
      id: '2',
      title: 'Matrix Operations',
      courseTitle: 'Linear Algebra',
      progress: 42,
      timeRemaining: '23 min',
    },
    {
      id: '3',
      title: 'Wave Functions',
      courseTitle: 'Quantum Mechanics',
      progress: 80,
      timeRemaining: '8 min',
    },
  ];
  
  // Mock data for all courses
  const allCourses: Course[] = [
    {
      id: 'calc1',
      title: 'Calculus I',
      description: 'Master limits, derivatives, and integration fundamentals for advanced mathematics.',
      category: 'Mathematics',
      moduleCount: 24,
      estimatedTime: '~12 hours',
      difficulty: 'Intermediate',
      enrolled: true,
      progress: 65,
      imageUrl: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMHN0dWR5fGVufDF8fHx8MTc3MDU1OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'linalg',
      title: 'Linear Algebra',
      description: 'Explore vectors, matrices, eigenvalues and their applications in data science.',
      category: 'Mathematics',
      moduleCount: 18,
      estimatedTime: '~10 hours',
      difficulty: 'Intermediate',
      enrolled: true,
      progress: 42,
      imageUrl: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMHN0dWR5fGVufDF8fHx8MTc3MDU1OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'quantum',
      title: 'Quantum Mechanics',
      description: 'Dive into the quantum world: wave functions, operators, and quantum states.',
      category: 'Physics',
      moduleCount: 32,
      estimatedTime: '~16 hours',
      difficulty: 'Advanced',
      enrolled: true,
      progress: 28,
      imageUrl: 'https://images.unsplash.com/photo-1769839271422-470ea5c9eca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwbGFib3JhdG9yeSUyMGV4cGVyaW1lbnR8ZW58MXx8fHwxNzcwNTY0ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'algo',
      title: 'Algorithms & Data Structures',
      description: 'Build efficient solutions with sorting, searching, trees, graphs, and more.',
      category: 'Computer Science',
      moduleCount: 28,
      estimatedTime: '~14 hours',
      difficulty: 'Intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kZXxlbnwxfHx8fDE3NzA2MzAxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'orgchem',
      title: 'Organic Chemistry',
      description: 'Understand molecular structures, reactions, and synthesis mechanisms.',
      category: 'Chemistry',
      moduleCount: 26,
      estimatedTime: '~13 hours',
      difficulty: 'Advanced',
      imageUrl: 'https://images.unsplash.com/photo-1631106321638-d94d9a8f3e1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBzY2llbmNlJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NzA2NTg5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'thermo',
      title: 'Thermodynamics',
      description: 'Study energy transfer, heat engines, entropy, and the laws of thermodynamics.',
      category: 'Engineering',
      moduleCount: 20,
      estimatedTime: '~11 hours',
      difficulty: 'Intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1769147339214-076740872485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlY2hub2xvZ3klMjBibHVlcHJpbnR8ZW58MXx8fHwxNzcwNjU4OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'molecular',
      title: 'Molecular Biology',
      description: 'Explore DNA, RNA, proteins, and cellular mechanisms at the molecular level.',
      category: 'Biology',
      moduleCount: 22,
      estimatedTime: '~12 hours',
      difficulty: 'Beginner',
      imageUrl: 'https://images.unsplash.com/photo-1636386689060-37d233b5d345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwbWljcm9zY29wZSUyMGNlbGxzfGVufDF8fHx8MTc3MDYzNjY3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'stats',
      title: 'Statistics & Probability',
      description: 'Analyze data with distributions, hypothesis testing, and regression methods.',
      category: 'Mathematics',
      moduleCount: 19,
      estimatedTime: '~10 hours',
      difficulty: 'Beginner',
      imageUrl: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMHN0dWR5fGVufDF8fHx8MTc3MDU1OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ml',
      title: 'Machine Learning Fundamentals',
      description: 'Learn supervised/unsupervised learning, neural networks, and model evaluation.',
      category: 'Computer Science',
      moduleCount: 30,
      estimatedTime: '~15 hours',
      difficulty: 'Advanced',
      imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kZXxlbnwxfHx8fDE3NzA2MzAxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];
  
  const categories = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Engineering', 'Biology'];
  
  const filteredCourses = activeFilter === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.category === activeFilter);
  
  const enrolledCourses = allCourses.filter(c => c.enrolled);
  const totalModules = enrolledCourses.reduce((sum, c) => sum + c.moduleCount, 0);
  const completedModules = Math.floor(enrolledCourses.reduce((sum, c) => sum + ((c.progress || 0) / 100) * c.moduleCount, 0));
  const avgProgress = Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation onEddiClick={onEddiClick} currentPage="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Continue your learning journey and achieve your goals.</p>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard 
            title="Courses Enrolled" 
            value={enrolledCourses.length}
            icon={<BookOpen size={32} />}
          />
          <StatCard 
            title="Modules Completed" 
            value={`${completedModules}/${totalModules}`}
            progress={avgProgress}
            showProgress
            color="var(--primary)"
          />
          <StatCard 
            title="Current Streak" 
            value="12 days"
            icon={<Flame size={32} className="text-accent" />}
          />
          <StatCard 
            title="Next Quiz" 
            value="Calculus I"
            icon={<Calendar size={32} />}
          />
        </motion.div>
        
        {/* Continue Learning Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Pick up where you left off</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {continueModules.map((module) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onContinue={onModuleContinue}
              />
            ))}
          </div>
        </motion.div>
        
        {/* All Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Explore Courses</h2>
          
          {/* Category Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${activeFilter === category 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <CourseCard course={course} onCourseClick={onCourseClick} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
