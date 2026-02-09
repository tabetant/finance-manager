import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { Card } from './Card';
import { CircularProgress } from './CircularProgress';
import { X, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InlineMath, BlockMath } from 'react-katex';

export interface QuizQuestion {
  id: string;
  question: string;
  hasMath?: boolean;
  mathContent?: string;
  options: {
    id: string;
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

interface QuizPageProps {
  quizTitle?: string;
  questions?: QuizQuestion[];
  onExit?: () => void;
  onComplete?: (score: number) => void;
  onEddiClick?: () => void;
}

export function QuizPage({ 
  quizTitle = 'Calculus I - Derivatives Quiz',
  questions: providedQuestions,
  onExit, 
  onComplete,
  onEddiClick 
}: QuizPageProps) {
  const defaultQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the derivative of f(x) = x²?',
      hasMath: true,
      mathContent: 'f(x) = x^2',
      options: [
        { id: 'a', label: 'A', text: 'x', isCorrect: false },
        { id: 'b', label: 'B', text: '2x', isCorrect: true },
        { id: 'c', label: 'C', text: 'x²', isCorrect: false },
        { id: 'd', label: 'D', text: '2x²', isCorrect: false },
      ],
      explanation: "Using the power rule, the derivative of x² is 2x¹ = 2x.",
    },
    {
      id: '2',
      question: 'The derivative represents:',
      options: [
        { id: 'a', label: 'A', text: 'The area under a curve', isCorrect: false },
        { id: 'b', label: 'B', text: 'The instantaneous rate of change', isCorrect: true },
        { id: 'c', label: 'C', text: 'The average value of a function', isCorrect: false },
        { id: 'd', label: 'D', text: 'The maximum value of a function', isCorrect: false },
      ],
      explanation: "The derivative measures how a function changes at a specific point - the instantaneous rate of change.",
    },
    {
      id: '3',
      question: 'What is the derivative of f(x) = 5x³ + 2x - 1?',
      hasMath: true,
      mathContent: 'f(x) = 5x^3 + 2x - 1',
      options: [
        { id: 'a', label: 'A', text: '15x² + 2', isCorrect: true },
        { id: 'b', label: 'B', text: '5x² + 2', isCorrect: false },
        { id: 'c', label: 'C', text: '15x² + 2x', isCorrect: false },
        { id: 'd', label: 'D', text: '10x² + 2', isCorrect: false },
      ],
      explanation: "Using the power rule: d/dx(5x³) = 15x², d/dx(2x) = 2, and d/dx(-1) = 0. Therefore f'(x) = 15x² + 2.",
    },
    {
      id: '4',
      question: 'If f(x) = 3x² - 4x + 7, what is f\'(2)?',
      hasMath: true,
      mathContent: 'f(x) = 3x^2 - 4x + 7',
      options: [
        { id: 'a', label: 'A', text: '8', isCorrect: true },
        { id: 'b', label: 'B', text: '12', isCorrect: false },
        { id: 'c', label: 'C', text: '6', isCorrect: false },
        { id: 'd', label: 'D', text: '4', isCorrect: false },
      ],
      explanation: "First find f'(x) = 6x - 4, then evaluate at x = 2: f'(2) = 6(2) - 4 = 12 - 4 = 8.",
    },
    {
      id: '5',
      question: 'The derivative of a constant is:',
      options: [
        { id: 'a', label: 'A', text: '1', isCorrect: false },
        { id: 'b', label: 'B', text: 'The constant itself', isCorrect: false },
        { id: 'c', label: 'C', text: '0', isCorrect: true },
        { id: 'd', label: 'D', text: 'Undefined', isCorrect: false },
      ],
      explanation: "Constants don't change, so their rate of change is zero. The derivative of any constant is 0.",
    },
  ];
  
  const questions = providedQuestions || defaultQuestions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Timer
  useEffect(() => {
    if (showResults) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showResults]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSelectAnswer = (optionId: string) => {
    if (isAnswered) return;
    setSelectedAnswer(optionId);
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: selectedAnswer });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      handleFinishQuiz();
    }
  };
  
  const handleFinishQuiz = () => {
    setShowResults(true);
  };
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (userAnswer === correctOption?.id) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };
  
  const score = calculateScore();
  
  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onEddiClick={onEddiClick} currentPage="courses" />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-4">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-8">{quizTitle}</p>
            
            {/* Score Display */}
            <div className="flex justify-center mb-8">
              <CircularProgress 
                value={score.percentage} 
                size={160} 
                strokeWidth={12}
                color={score.percentage >= 70 ? 'var(--success)' : score.percentage >= 50 ? 'var(--warning)' : 'var(--destructive)'}
              />
            </div>
            
            <div className="mb-8">
              <p className="text-5xl font-bold text-foreground mb-2">{score.percentage}%</p>
              <p className="text-xl text-muted-foreground">
                {score.correct} out of {score.total} correct
              </p>
            </div>
            
            {/* Breakdown */}
            <Card className="mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">Answer Breakdown</h3>
              <div className="space-y-3">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const correctOption = question.options.find(opt => opt.isCorrect);
                  const isCorrect = userAnswer === correctOption?.id;
                  
                  return (
                    <div key={question.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        {isCorrect ? (
                          <CheckCircle size={20} className="text-[var(--success)]" />
                        ) : (
                          <XCircle size={20} className="text-destructive" />
                        )}
                        <span className="text-sm text-foreground">Question {index + 1}</span>
                      </div>
                      <span className="text-sm font-medium" style={{ color: isCorrect ? 'var(--success)' : 'var(--destructive)' }}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
            
            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onExit}>
                Back to Course
              </Button>
              <Button variant="primary" onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setSelectedAnswer(null);
                setIsAnswered(false);
                setTimeRemaining(900);
              }}>
                Retake Quiz
              </Button>
              <Button variant="success" onClick={() => onComplete?.(score.percentage)}>
                Continue to Next Module
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }
  
  // Quiz Screen
  return (
    <div className="min-h-screen bg-background">
      <Navigation onEddiClick={onEddiClick} currentPage="courses" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{quizTitle}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`px-4 py-2 rounded-lg ${timeRemaining < 60 ? 'bg-destructive/10 text-destructive' : 'bg-[var(--warning)]/10 text-[var(--warning)]'}`}>
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
            
            <button 
              onClick={onExit}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={24} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-8">
          <motion.div
            className="h-full bg-[var(--warning)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.hasMath && currentQuestion.mathContent && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <BlockMath math={currentQuestion.mathContent} />
                  </div>
                )}
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.isCorrect;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={isAnswered}
                      whileHover={!isAnswered ? { scale: 1.01 } : {}}
                      whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${!isAnswered && !isSelected ? 'border-border hover:border-primary/50 bg-card' : ''}
                        ${!isAnswered && isSelected ? 'border-primary bg-primary/5' : ''}
                        ${showCorrect ? 'border-[var(--success)] bg-[var(--success)]/5' : ''}
                        ${showIncorrect ? 'border-destructive bg-destructive/5' : ''}
                        ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Letter Badge */}
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center font-semibold flex-shrink-0
                          ${!isAnswered ? 'bg-muted text-foreground' : ''}
                          ${showCorrect ? 'bg-[var(--success)] text-white' : ''}
                          ${showIncorrect ? 'bg-destructive text-white' : ''}
                        `}>
                          {option.label}
                        </div>
                        
                        {/* Option Text */}
                        <span className="flex-1 font-medium text-foreground">
                          {option.text}
                        </span>
                        
                        {/* Icon */}
                        {showCorrect && <CheckCircle size={24} className="text-[var(--success)]" />}
                        {showIncorrect && <XCircle size={24} className="text-destructive" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Explanation */}
              {isAnswered && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl"
                >
                  <h4 className="font-semibold text-primary mb-2">Explanation</h4>
                  <p className="text-foreground">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </Card>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={onExit}
              >
                Exit Quiz
              </Button>
              
              <div className="flex gap-3">
                {!isAnswered ? (
                  <>
                    <Button 
                      variant="ghost"
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswer}
                    >
                      Skip
                    </Button>
                    <Button 
                      variant="warning"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight size={18} />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
