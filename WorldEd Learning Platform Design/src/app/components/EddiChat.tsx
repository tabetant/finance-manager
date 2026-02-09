import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { X, Send, Sparkles, BookOpen, ListChecks, TrendingUp, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'eddi';
  message: string;
  timestamp: Date;
}

interface EddiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EddiChat({ isOpen, onClose }: EddiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'eddi',
      message: "Hi! I'm Eddi, your AI learning assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const quickActions = [
    { icon: <BookOpen size={16} />, label: 'Find a course', action: 'find_course' },
    { icon: <ListChecks size={16} />, label: 'Start a quiz', action: 'start_quiz' },
    { icon: <TrendingUp size={16} />, label: 'Show my progress', action: 'show_progress' },
  ];
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputValue,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate Eddi's response
    setTimeout(() => {
      const eddiResponse = generateEddiResponse(inputValue);
      const eddiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'eddi',
        message: eddiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, eddiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'find_course':
        message = 'I want to find a course';
        break;
      case 'start_quiz':
        message = 'I want to start a quiz';
        break;
      case 'show_progress':
        message = 'Show me my progress';
        break;
    }
    setInputValue(message);
  };
  
  const generateEddiResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('course') || lowerMessage.includes('find')) {
      return "I can help you find the perfect course! Based on your current progress, I recommend continuing with Calculus I or exploring Linear Algebra. What subject interests you most?";
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return "Great! You have quizzes available for Calculus I (Module 4: Derivatives) and Linear Algebra (Module 2: Matrix Operations). Which one would you like to tackle first?";
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('stats')) {
      return "You're doing amazing! You've completed 65% of Calculus I and 42% of Linear Algebra. You're on a 12-day learning streak! Keep it up! 🎉";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return "I'm here to help! Can you tell me which module or topic you're having trouble with? I can provide explanations, examples, or guide you to relevant resources.";
    } else if (lowerMessage.includes('derivative') || lowerMessage.includes('calculus')) {
      return "Derivatives measure how functions change! Think of it as the slope of a curve at any point. The basic rule is: d/dx(xⁿ) = n·xⁿ⁻¹. Need help with a specific problem?";
    } else if (lowerMessage.includes('matrix') || lowerMessage.includes('linear')) {
      return "Linear Algebra is fascinating! Matrices are powerful tools for solving systems of equations and transforming data. Are you working on matrix multiplication, determinants, or eigenvalues?";
    } else {
      return "That's a great question! While I can help with course navigation, quizzes, and general learning support, I recommend checking the specific module content for detailed explanations. Is there a particular topic you'd like me to help you find?";
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
          
          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Eddi</h2>
                  <p className="text-xs text-white/80">Your Learning Assistant</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] rounded-2xl px-4 py-2.5
                    ${msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-md' 
                      : 'bg-white border border-border rounded-bl-md shadow-sm'
                    }
                  `}>
                    {msg.sender === 'eddi' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] rounded-full flex items-center justify-center">
                          <Sparkles className="text-white" size={12} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Eddi</span>
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-foreground'}`}>
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-border bg-white">
                <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                <div className="flex gap-2 flex-wrap">
                  {quickActions.map((action) => (
                    <button
                      key={action.action}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-medium hover:bg-primary/10 transition-colors"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="p-4 border-t border-border bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Eddi anything..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
