import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Trophy, 
  RefreshCw, 
  Share2, 
  ChevronRight,
  Target,
  AlertTriangle,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  Bomb
} from 'lucide-react';
import { getQuizQuestions, getResultTier, QUIZ_CONFIG } from '../data/quizQuestions';

// Page SEO Component
const QuizSEO = () => (
  <>
    <title>WW3 Knowledge Quiz | Test Your Understanding | WW3 Tracker</title>
    <meta name="description" content="Take the ultimate WW3 quiz. 15 questions across 3 acts. How much do you really know about the US-Iran conflict?" />
    <meta name="keywords" content="WW3 quiz, Iran war quiz, US Iran conflict test, World War 3 trivia" />
    <link rel="canonical" href="https://ww3tracker.live/quiz" />
    
    {/* Open Graph */}
    <meta property="og:title" content="I took the WW3 Knowledge Quiz — can you beat my score?" />
    <meta property="og:description" content="15 questions. 3 acts. How much do you really know about what's happening?" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ww3tracker.live/quiz" />
    <meta property="og:image" content="https://ww3tracker.live/og-image.png" />
    
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="WW3 Knowledge Quiz | WW3 Tracker" />
    <meta name="twitter:description" content="Test your knowledge of the US-Iran conflict. 15 questions. No mercy." />
    <meta name="twitter:image" content="https://ww3tracker.live/og-image.png" />
  </>
);

// Intro Screen Component
const QuizIntro = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    {/* Header Card */}
    <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">WW3 Knowledge Quiz</h1>
          <p className="text-gray-400">15 questions. 3 acts. No mercy.</p>
        </div>
      </div>
      
      <p className="text-gray-300 leading-relaxed">
        Think you understand what's happening? Let's find out. This quiz pulls from 
        35 questions across three acts — history, current events, and the geopolitical 
        chess game nobody's talking about.
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">15</p>
        <p className="text-xs text-gray-500">Questions</p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">~5</p>
        <p className="text-xs text-gray-500">Minutes</p>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 text-center">
        <Trophy className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">2,000+</p>
        <p className="text-xs text-gray-500">Combos</p>
      </div>
    </div>

    {/* The Three Acts */}
    <div className="space-y-3 mb-6">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">The Three Acts</h2>
      
      {QUIZ_CONFIG.acts.map((act, index) => (
        <div key={act.id} className="flex items-center gap-3 bg-[#111] border border-[#2a2a2a] rounded-lg p-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
            ${act.id === 1 ? 'bg-blue-500/20 text-blue-400' : 
              act.id === 2 ? 'bg-orange-500/20 text-orange-400' : 
              'bg-red-500/20 text-red-400'}`}>
            {act.id}
          </div>
          <div className="flex-1">
            <p className="font-medium text-white text-sm">{act.name}</p>
            <p className="text-xs text-gray-500">{act.description}</p>
          </div>
          <span className="text-xs text-gray-600">5 questions</span>
        </div>
      ))}
    </div>

    {/* Start Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 hover:from-red-400 hover:to-orange-400 transition-colors"
    >
      <Bomb className="w-5 h-5" />
      Start Quiz
    </motion.button>

    <p className="text-center text-xs text-gray-600 mt-4">
      ⚠️ Warning: May cause existential dread about the state of the world.
    </p>
  </motion.div>
);

// Question Card Component
const QuestionCard = ({ question, actNumber, questionNumber, totalQuestions, onAnswer, score }) => {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleSelect = (index, correct) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    
    // Delay before moving to next
    setTimeout(() => {
      onAnswer(correct);
      setSelected(null);
      setShowExplanation(false);
    }, 3000);
  };

  const progress = ((questionNumber) / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded
              ${actNumber === 1 ? 'bg-blue-500/20 text-blue-400' : 
                actNumber === 2 ? 'bg-orange-500/20 text-orange-400' : 
                'bg-red-500/20 text-red-400'}`}>
              ACT {actNumber}
            </span>
            <span className="text-xs text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs text-gray-500">Score: {Math.round(score)}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 mb-4">
        <h2 className="text-lg font-medium text-white leading-relaxed mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = option.correct;
            const showResult = selected !== null;
            
            let buttonClass = "w-full text-left p-4 rounded-xl border transition-all ";
            if (showResult) {
              if (isCorrect) {
                buttonClass += "bg-green-500/20 border-green-500/50";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-500/20 border-red-500/50";
              } else {
                buttonClass += "bg-white/5 border-white/5 opacity-50";
              }
            } else {
              buttonClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
            }

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={selected === null ? { scale: 1.01 } : {}}
                whileTap={selected === null ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(index, option.correct)}
                disabled={selected !== null}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium text-gray-400">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-gray-200">{option.text}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4"
          >
            <p className="text-gray-300 text-sm leading-relaxed">
              {question.explanation}
            </p>
            {question.link && (
              <a 
                href={question.link}
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
              >
                Read more <ChevronRight className="w-3 h-3" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Act Transition Component
const ActTransition = ({ act, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="max-w-md mx-auto text-center py-12"
  >
    <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center
      ${act.id === 1 ? 'bg-blue-500/20' : act.id === 2 ? 'bg-orange-500/20' : 'bg-red-500/20'}`}>
      <span className="text-3xl font-bold text-white">{act.id}</span>
    </div>
    
    <h2 className="text-3xl font-bold text-white mb-2">Act {act.id}</h2>
    <p className="text-xl text-gray-400 mb-4">{act.name}</p>
    <p className="text-gray-500 mb-8">{act.description}</p>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onContinue}
      className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl font-medium text-white hover:bg-white/20 transition-colors"
    >
      Continue
    </motion.button>
  </motion.div>
);

// Results Component
const QuizResults = ({ score, correctCount, totalQuestions, onRestart }) => {
  const tier = getResultTier(score);
  
  const shareText = tier.description.replace('X', Math.round(score));
  
  const handleShare = async () => {
    const shareData = {
      title: 'WW3 Knowledge Quiz',
      text: `${shareText} ww3tracker.live/quiz`,
      url: 'https://ww3tracker.live/quiz'
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ww3tracker.live/quiz`);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      {/* Result Card */}
      <div className={`bg-gradient-to-br ${tier.color} rounded-2xl p-8 text-center mb-6`}>
        <div className="text-6xl mb-4">{tier.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{tier.title}</h2>
        <p className="text-white/80 mb-4">{tier.subtitle}</p>
        
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-5xl font-bold text-white">{Math.round(score)}</p>
          <p className="text-white/60 text-sm">out of 100</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400">Correct Answers</span>
          <span className="text-white font-bold">{correctCount}/{totalQuestions}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400"
            style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Share Text Preview */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-2">Your share message:</p>
        <p className="text-gray-300 text-sm italic">"{shareText}"</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-gray-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:from-blue-400 hover:to-blue-500 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Result
        </motion.button>
      </div>

      {/* CTA to Blog */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">Want to learn more?</p>
        <a 
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          Read our latest analysis <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

// Main Quiz Page Component
export default function WW3QuizPage() {
  const [gameState, setGameState] = useState('intro'); // intro, act-transition, playing, results
  const [questions, setQuestions] = useState({ act1: [], act2: [], act3: [] });
  const [currentAct, setCurrentAct] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const startQuiz = useCallback(() => {
    setQuestions(getQuizQuestions());
    setCurrentAct(1);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setGameState('act-transition');
  }, []);

  const handleActContinue = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleAnswer = useCallback((correct) => {
    if (correct) {
      setScore(prev => prev + QUIZ_CONFIG.pointsPerQuestion);
      setCorrectCount(prev => prev + 1);
    }

    const currentActQuestions = questions[`act${currentAct}`];
    
    if (currentQuestionIndex < currentActQuestions.length - 1) {
      // Next question in same act
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentAct < 3) {
      // Next act
      setCurrentAct(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setGameState('act-transition');
    } else {
      // Quiz complete
      setGameState('results');
    }
  }, [currentAct, currentQuestionIndex, questions]);

  const restartQuiz = useCallback(() => {
    setGameState('intro');
    setQuestions({ act1: [], act2: [], act3: [] });
    setCurrentAct(1);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
  }, []);

  const getCurrentQuestion = () => {
    return questions[`act${currentAct}`]?.[currentQuestionIndex];
  };

  const getCurrentActConfig = () => {
    return QUIZ_CONFIG.acts.find(act => act.id === currentAct);
  };

  const getTotalQuestionNumber = () => {
    const previousActs = (currentAct - 1) * 5;
    return previousActs + currentQuestionIndex + 1;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
      <QuizSEO />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <img src="/logo/globe-radar.svg" alt="WW3 Tracker" className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">WW3 Tracker</h1>
                <p className="text-[10px] text-gray-500">Knowledge Quiz</p>
              </div>
            </a>
            
            {gameState === 'playing' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Score</span>
                <span className="text-sm font-bold text-white">{Math.round(score)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <QuizIntro key="intro" onStart={startQuiz} />
          )}
          
          {gameState === 'act-transition' && (
            <ActTransition 
              key="transition"
              act={getCurrentActConfig()} 
              onContinue={handleActContinue} 
            />
          )}
          
          {gameState === 'playing' && getCurrentQuestion() && (
            <QuestionCard
              key={`q-${currentAct}-${currentQuestionIndex}`}
              question={getCurrentQuestion()}
              actNumber={currentAct}
              questionNumber={getTotalQuestionNumber()}
              totalQuestions={15}
              onAnswer={handleAnswer}
              score={score}
            />
          )}
          
          {gameState === 'results' && (
            <QuizResults
              key="results"
              score={score}
              correctCount={correctCount}
              totalQuestions={15}
              onRestart={restartQuiz}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            Built for educational purposes • Data from verified public sources
          </p>
        </div>
      </footer>
    </div>
  );
}
