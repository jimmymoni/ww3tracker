import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, Share2, Brain } from 'lucide-react';
import { getQuizQuestions, getResultTier, QUIZ_CONFIG } from '../data/quizQuestions';

// Compact Quiz for Homepage - Clean Design
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
    }, 2000);
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
    const text = `Scored ${Math.round(score)}/100 on WW3 Tracker - ${tier.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WW3 Tracker',
        text: text,
        url: 'https://ww3tracker.live'
      });
    } else {
      navigator.clipboard.writeText(`${text} - https://ww3tracker.live`);
    }
  };

  // Welcome Card - Clean Design
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Test your knowledge</h3>
            <p className="text-sm text-gray-400">
              15 questions. Most people get 7 wrong.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">History</span>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">Current</span>
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Geopolitics</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startQuiz}
          className="w-full py-3 bg-white text-black rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Start
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
        className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
      >
        <p className="text-sm text-gray-400 mb-2">Your score</p>
        <p className="text-5xl font-bold text-white mb-1">{Math.round(score)}</p>
        <p className="text-lg text-gray-400 mb-4">{tier.title}</p>
        
        <div className="flex gap-3">
          <button
            onClick={resetQuiz}
            className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <button
            onClick={shareResult}
            className="flex-1 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
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
      className="bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Q{getTotalQuestionNumber()}/15</span>
          <span className="text-xs text-gray-500">{Math.round(score)} pts</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-white"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentAct}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-sm text-gray-400 mb-3">
            {QUIZ_CONFIG.acts[currentAct - 1].name}
          </p>
          
          <h3 className="text-base font-medium text-white leading-relaxed mb-4">
            {question?.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {question?.options.map((option, index) => {
              const showResult = selected !== null;
              
              let buttonClass = "w-full text-left p-3 rounded-lg border text-sm transition-all ";
              if (showResult) {
                if (option.correct) {
                  buttonClass += "bg-green-500/20 border-green-500/50 text-green-100";
                } else if (index === 0 && !option.correct) {
                  buttonClass += "bg-red-500/20 border-red-500/50 text-red-100";
                } else {
                  buttonClass += "bg-white/5 border-white/5 text-gray-500";
                }
              } else {
                buttonClass += "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.correct)}
                  disabled={selected !== null}
                  className={buttonClass}
                >
                  {String.fromCharCode(65 + index)}. {option.text}
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
                className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <p className="text-sm text-gray-300">{question?.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
