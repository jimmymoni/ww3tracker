import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight,
  RefreshCw,
  Share2,
  Lightbulb,
  Globe,
  Zap
} from 'lucide-react';
import { getQuizQuestions, getResultTier, QUIZ_CONFIG } from '../data/quizQuestions';

// Compact Quiz for Homepage
export default function WW3QuizHome() {
  const [started, setStarted] = useState(false);
  const [currentAct, setCurrentAct] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questions, setQuestions] = useState({ act1: [], act2: [], act3: [] });
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = () => {
    setQuestions(getQuizQuestions());
    setCurrentAct(1);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setSelected(null);
    setShowExplanation(false);
    setShowResult(false);
    setStarted(true);
  };

  const handleAnswer = (correct) => {
    if (selected !== null) return;
    
    setSelected(correct ? 1 : 0);
    setShowExplanation(true);
    
    if (correct) {
      setScore(prev => prev + QUIZ_CONFIG.pointsPerQuestion);
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      const currentActQuestions = questions[`act${currentAct}`];
      
      if (currentQuestionIndex < currentActQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentAct < 3) {
        setCurrentAct(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowResult(true);
      }
      
      setSelected(null);
      setShowExplanation(false);
    }, 2500);
  };

  const resetQuiz = () => {
    setStarted(false);
    setShowResult(false);
    setCurrentAct(1);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
  };

  const getCurrentQuestion = () => {
    return questions[`act${currentAct}`]?.[currentQuestionIndex];
  };

  const getTotalQuestionNumber = () => {
    return (currentAct - 1) * 5 + currentQuestionIndex + 1;
  };

  const shareResult = () => {
    const tier = getResultTier(score);
    const text = `I scored ${Math.round(score)}/100 on WW3 Tracker's knowledge check. ${tier.title}. Try it yourself:`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WW3 Tracker Knowledge Check',
        text: text,
        url: 'https://ww3tracker.live'
      });
    } else {
      navigator.clipboard.writeText(`${text} https://ww3tracker.live`);
    }
  };

  // Welcome Card
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Think you understand the conflict?</h2>
            <p className="text-gray-400 text-sm">
              15 questions across three topics. Most people get 7 wrong.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-black/30 rounded-lg p-3 text-center">
            <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">History</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Current Events</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center">
            <Share2 className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Share Results</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startQuiz}
          className="w-full py-3 bg-white text-black rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Start Knowledge Check
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  // Results Card
  if (showResult) {
    const tier = getResultTier(score);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${tier.color}`}>
          <span className="text-3xl">{tier.icon}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">{tier.title}</h2>
        <p className="text-gray-400 mb-4">{tier.subtitle}</p>
        
        <div className="bg-black/30 rounded-xl p-4 mb-6">
          <p className="text-4xl font-bold text-white">{Math.round(score)}</p>
          <p className="text-gray-500 text-sm">out of 100</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuiz}
            className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-lg font-medium text-gray-300 text-sm flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareResult}
            className="flex-1 py-2.5 bg-white text-black rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Question Card
  const question = getCurrentQuestion();
  const progress = (getTotalQuestionNumber() / 15) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-2xl p-5 sm:p-6"
    >
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            Question {getTotalQuestionNumber()} of 15
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(score)} pts
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>
      </div>

      {/* Act Badge */}
      <div className="mb-3">
        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase
          ${currentAct === 1 ? 'bg-blue-500/20 text-blue-400' : 
            currentAct === 2 ? 'bg-orange-500/20 text-orange-400' : 
            'bg-red-500/20 text-red-400'}`}>
          {QUIZ_CONFIG.acts[currentAct - 1].name}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentAct}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-base font-medium text-white leading-relaxed mb-4">
            {question?.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {question?.options.map((option, index) => {
              const isSelected = selected !== null;
              const isCorrect = option.correct;
              const showResult = selected !== null;
              
              let buttonClass = "w-full text-left p-3 rounded-lg border text-sm transition-all ";
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-green-500/20 border-green-500/50 text-green-100";
                } else if (index === selected && !isCorrect) {
                  buttonClass += "bg-red-500/20 border-red-500/50 text-red-100";
                } else {
                  buttonClass += "bg-white/5 border-white/5 text-gray-500";
                }
              } else {
                buttonClass += "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.correct)}
                  disabled={selected !== null}
                  className={buttonClass}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option.text}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <p className="text-sm text-yellow-100/80">
                  {question?.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
