import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CoursePage } from './components/CoursePage';
import { ModulePage } from './components/ModulePage';
import { QuizPage } from './components/QuizPage';
import { EddiChat } from './components/EddiChat';

type Page = 'dashboard' | 'course' | 'module' | 'quiz';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [isEddiOpen, setIsEddiOpen] = useState(false);
  
  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course');
  };
  
  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentPage('module');
  };
  
  const handleQuizClick = () => {
    setCurrentPage('quiz');
  };
  
  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };
  
  const handleBackToCourse = () => {
    setCurrentPage('course');
  };
  
  const handleModuleContinue = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentPage('module');
  };
  
  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    setCurrentPage('dashboard');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onEddiClick={() => setIsEddiOpen(true)}
          onCourseClick={handleCourseClick}
          onModuleContinue={handleModuleContinue}
        />
      )}
      
      {currentPage === 'course' && (
        <CoursePage 
          courseId={selectedCourseId}
          onBack={handleBackToDashboard}
          onEddiClick={() => setIsEddiOpen(true)}
          onModuleClick={handleModuleClick}
        />
      )}
      
      {currentPage === 'module' && (
        <ModulePage 
          moduleId={selectedModuleId}
          onBack={handleBackToCourse}
          onEddiClick={() => setIsEddiOpen(true)}
          onQuiz={handleQuizClick}
          onNextModule={() => console.log('Next module')}
          onPrevModule={() => console.log('Previous module')}
        />
      )}
      
      {currentPage === 'quiz' && (
        <QuizPage 
          onExit={handleBackToCourse}
          onComplete={handleQuizComplete}
          onEddiClick={() => setIsEddiOpen(true)}
        />
      )}
      
      {/* Eddi AI Chat - Accessible from all pages */}
      <EddiChat 
        isOpen={isEddiOpen}
        onClose={() => setIsEddiOpen(false)}
      />
    </div>
  );
}
