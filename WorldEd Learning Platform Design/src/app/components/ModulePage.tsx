import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ModulePageProps {
  moduleId: string;
  onBack?: () => void;
  onEddiClick?: () => void;
  onQuiz?: () => void;
  onNextModule?: () => void;
  onPrevModule?: () => void;
}

export function ModulePage({ 
  moduleId, 
  onBack, 
  onEddiClick, 
  onQuiz,
  onNextModule,
  onPrevModule 
}: ModulePageProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      
      // Mark as completed when scrolled near bottom
      if (progress > 90) {
        setIsCompleted(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mock module data
  const module = {
    id: moduleId,
    title: 'Introduction to Derivatives',
    courseTitle: 'Calculus I',
    readingTime: '15 min',
    sections: [
      { id: 'intro', title: 'Introduction' },
      { id: 'definition', title: 'Formal Definition' },
      { id: 'examples', title: 'Examples' },
      { id: 'applications', title: 'Applications' },
    ],
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      <Navigation onEddiClick={onEddiClick} currentPage="courses" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{module.courseTitle} &gt; {module.title}</span>
        </button>
        
        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-3">{module.title}</h1>
          <p className="text-muted-foreground">Estimated reading time: {module.readingTime}</p>
        </motion.div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-slate max-w-none"
            >
              {/* Content Section 1: Introduction */}
              <section id="intro" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  The derivative is one of the most fundamental concepts in calculus. It measures how a function 
                  changes as its input changes. Geometrically, the derivative represents the slope of the tangent 
                  line to the graph of the function at a given point.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  Understanding derivatives is essential for studying rates of change, optimization problems, 
                  and modeling dynamic systems in physics, engineering, economics, and many other fields.
                </p>
              </section>
              
              {/* Content Section 2: Formal Definition */}
              <section id="definition" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Formal Definition</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  The derivative of a function <InlineMath math="f(x)" /> at a point <InlineMath math="x = a" /> 
                  is defined as the limit:
                </p>
                
                <div className="bg-muted/50 rounded-lg p-6 my-6 border border-border">
                  <BlockMath math="f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}" />
                </div>
                
                <p className="text-foreground leading-relaxed mb-4">
                  This limit, if it exists, gives us the instantaneous rate of change of the function at the 
                  point <InlineMath math="x = a" />. We can also write this using different notation:
                </p>
                
                <div className="bg-muted/50 rounded-lg p-6 my-6 border border-border">
                  <BlockMath math="\frac{df}{dx} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}" />
                </div>
              </section>
              
              {/* Content Section 3: Examples */}
              <section id="examples" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Examples</h2>
                
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Example 1: Derivative of a Linear Function</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Let's find the derivative of <InlineMath math="f(x) = 2x + 3" />:
                  </p>
                  
                  <div className="space-y-3 text-foreground">
                    <BlockMath math="f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}" />
                    <BlockMath math="= \lim_{h \to 0} \frac{[2(x + h) + 3] - [2x + 3]}{h}" />
                    <BlockMath math="= \lim_{h \to 0} \frac{2x + 2h + 3 - 2x - 3}{h}" />
                    <BlockMath math="= \lim_{h \to 0} \frac{2h}{h} = \lim_{h \to 0} 2 = 2" />
                  </div>
                  
                  <p className="text-foreground leading-relaxed mt-4">
                    Therefore, <InlineMath math="f'(x) = 2" />. The derivative of a linear function is its slope.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Example 2: Derivative of a Quadratic Function</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Now let's find the derivative of <InlineMath math="f(x) = x^2" />:
                  </p>
                  
                  <div className="space-y-3 text-foreground">
                    <BlockMath math="f'(x) = \lim_{h \to 0} \frac{(x + h)^2 - x^2}{h}" />
                    <BlockMath math="= \lim_{h \to 0} \frac{x^2 + 2xh + h^2 - x^2}{h}" />
                    <BlockMath math="= \lim_{h \to 0} \frac{2xh + h^2}{h}" />
                    <BlockMath math="= \lim_{h \to 0} (2x + h) = 2x" />
                  </div>
                  
                  <p className="text-foreground leading-relaxed mt-4">
                    Therefore, <InlineMath math="f'(x) = 2x" />. This tells us the slope at any point on the parabola.
                  </p>
                </div>
              </section>
              
              {/* Content Section 4: Applications */}
              <section id="applications" className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Applications</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Derivatives have numerous real-world applications:
                </p>
                
                <ul className="space-y-3 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Physics:</strong> Velocity is the derivative of position with respect to time: 
                    <InlineMath math=" v(t) = \frac{dx}{dt}" /></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Economics:</strong> Marginal cost is the derivative of the total cost function</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Optimization:</strong> Finding maxima and minima by setting the derivative equal to zero</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Machine Learning:</strong> Gradient descent uses derivatives to minimize loss functions</span>
                  </li>
                </ul>
                
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-primary mb-2">Key Takeaway</h4>
                  <p className="text-foreground">
                    The derivative is a powerful tool that allows us to analyze how functions change. 
                    Mastering derivatives opens the door to understanding dynamic systems and solving 
                    complex real-world problems.
                  </p>
                </div>
              </section>
            </motion.article>
            
            {/* Bottom Navigation */}
            <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
              <Button 
                variant="outline" 
                onClick={onPrevModule}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Previous Module
              </Button>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  Mark as Complete
                </label>
                
                {isCompleted && (
                  <Button 
                    variant="warning" 
                    onClick={onQuiz}
                    className="flex items-center gap-2"
                  >
                    Take Quiz
                  </Button>
                )}
                
                <Button 
                  variant="primary" 
                  onClick={onNextModule}
                  className="flex items-center gap-2"
                >
                  Next Module
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Table of Contents</h3>
                <nav className="space-y-2">
                  {module.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Need help?</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onEddiClick}
                    className="w-full bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white hover:opacity-90"
                  >
                    Ask Eddi
                  </Button>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${scrollProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {Math.round(scrollProgress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
