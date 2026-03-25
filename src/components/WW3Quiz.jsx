import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bomb, 
  Shield, 
  Skull, 
  Trophy, 
  RefreshCw, 
  Share2, 
  AlertTriangle,
  Laugh,
  Zap,
  Home,
  Backpack,
  Radio
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "The sirens are blaring. What's your first move?",
    options: [
      { text: "Check TikTok for updates", score: 0, icon: "📱" },
      { text: "Fill bathtub with water like a prepper", score: 3, icon: "🛁" },
      { text: "Google 'how to survive nuclear winter'", score: 1, icon: "🔍" },
      { text: "Call mom and apologize for everything", score: 5, icon: "📞" }
    ]
  },
  {
    id: 2,
    question: "Your bunker food supply consists of:",
    options: [
      { text: "Ramen and hope", score: 2, icon: "🍜" },
      { text: "5-year freeze-dried prepper meals", score: 5, icon: "🥫" },
      { text: "Delivery apps still work, right?", score: 0, icon: "🍕" },
      { text: "My neighbor's garden (they won't need it)", score: 4, icon: "🥕" }
    ]
  },
  {
    id: 3,
    question: "The internet goes down. Your reaction:",
    options: [
      { text: "Immediate existential crisis", score: 0, icon: "😱" },
      { text: "Finally read those books I bought", score: 3, icon: "📚" },
      { text: "Talk to family members??", score: 1, icon: "👨‍👩‍👧" },
      { text: "I've been training for this (ham radio)", score: 5, icon: "📻" }
    ]
  },
  {
    id: 4,
    question: "Choose your post-apocalypse skill:",
    options: [
      { text: "Can identify edible plants", score: 5, icon: "🌿" },
      { text: "Excellent at complaining", score: 1, icon: "😤" },
      { text: "Can hotwire cars (movies taught me)", score: 3, icon: "🚗" },
      { text: "Professional Minecraft builder", score: 2, icon: "⛏️" }
    ]
  },
  {
    id: 5,
    question: "Radiation zone ahead. You have:",
    options: [
      { text: "A positive attitude and sunscreen", score: 0, icon: "☀️" },
      { text: "DIY fallout shelter from YouTube", score: 2, icon: "🏚️" },
      { text: "Actual iodine tablets (expired 2019)", score: 4, icon: "💊" },
      { text: "Lead underwear and regrets", score: 3, icon: "🩲" }
    ]
  }
];

const RESULTS = {
  survivor: {
    title: "Bunker Boss",
    subtitle: "You'll outlive us all (annoyingly)",
    description: "You've got canned beans, a Geiger counter, and probably a 'plan' for everything. Your friends mock you now, but guess who's laughing when the sirens go off?",
    color: "from-green-500 to-emerald-600",
    icon: Trophy,
    survivalRate: "87%",
    badge: "Certified Prepper"
  },
  mediocre: {
    title: "Weekend Warrior",
    subtitle: "You'll make it through Week 1",
    description: "You've watched enough survival shows to be dangerous. You've got some supplies, some knowledge, and a lot of optimism. Week 2? Let's not talk about Week 2.",
    color: "from-yellow-500 to-orange-500",
    icon: Shield,
    survivalRate: "54%",
    badge: "Average Joe"
  },
  doomed: {
    title: "Walking Casualty",
    subtitle: "Thanks for the entertainment",
    description: "You're the person others will write songs about. Not hero songs - more like cautionary tales. But hey, you'll provide valuable lessons for the survivors!",
    color: "from-red-500 to-red-600",
    icon: Skull,
    survivalRate: "12%",
    badge: "Radioactive Snack"
  }
};

export default function WW3Quiz() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (points) => {
    const newScore = score + points;
    setScore(newScore);
    setAnswers([...answers, points]);
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
  };

  const getResult = () => {
    const maxScore = QUIZ_QUESTIONS.length * 5;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 70) return RESULTS.survivor;
    if (percentage >= 40) return RESULTS.mediocre;
    return RESULTS.doomed;
  };

  const shareResult = () => {
    const result = getResult();
    const text = `I took the WW3 Readiness Quiz and got: ${result.title} (${result.survivalRate} survival rate). Take yours at ww3tracker.live`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WW3 Readiness Quiz',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  if (!started) {
    return (
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-red-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Bomb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">WW3 Readiness Quiz</h2>
              <p className="text-xs text-gray-400">5 questions. Zero judgment. (Okay, some judgment)</p>
            </div>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/40 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Takes 1 min</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 text-center">
              <Laugh className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Sarcastic</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 text-center">
              <Share2 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Shareable</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStarted(true)}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:from-red-400 hover:to-orange-400 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Start Quiz (If You Dare)
          </motion.button>

          <p className="text-center text-[10px] text-gray-600 mt-3">
            ⚠️ For entertainment purposes only. Please don't actually start WW3.
          </p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = getResult();
    const ResultIcon = result.icon;

    return (
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4"
          >
            {/* Result Badge */}
            <div className={`bg-gradient-to-r ${result.color} rounded-xl p-6 mb-4 text-center`}>
              <ResultIcon className="w-12 h-12 text-white mx-auto mb-3" />
              <span className="text-xs text-white/80 uppercase tracking-wider font-bold">
                {result.badge}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">{result.title}</h2>
              <p className="text-white/80 text-sm mt-1">{result.subtitle}</p>
            </div>

            {/* Survival Rate */}
            <div className="bg-black/40 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Survival Probability</span>
                <span className={`text-lg font-bold ${result.survivalRate === '87%' ? 'text-green-400' : result.survivalRate === '54%' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {result.survivalRate}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: result.survivalRate }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${result.color}`}
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {result.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-black/40 rounded-lg p-2 text-center">
                <Backpack className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Supplies</p>
                <p className="text-sm font-bold text-white">{score >= 20 ? 'Good' : score >= 10 ? 'Okay' : 'None'}</p>
              </div>
              <div className="bg-black/40 rounded-lg p-2 text-center">
                <Radio className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Skills</p>
                <p className="text-sm font-bold text-white">{score >= 20 ? 'Useful' : score >= 10 ? 'Basic' : 'None'}</p>
              </div>
              <div className="bg-black/40 rounded-lg p-2 text-center">
                <Home className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Shelter</p>
                <p className="text-sm font-bold text-white">{score >= 20 ? 'Secure' : score >= 10 ? 'Doubtful' : 'Cardboard'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetQuiz}
                className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-lg font-medium text-gray-300 text-sm flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareResult}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-medium text-white text-sm flex items-center justify-center gap-1.5 hover:from-blue-400 hover:to-blue-500 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Progress */}
      <div className="bg-black/40 p-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span className="text-xs text-gray-500">{Math.round((currentQuestion / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">{question.question}</h3>

            <div className="space-y-2">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {option.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
