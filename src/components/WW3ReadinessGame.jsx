import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, RefreshCw, Zap, Globe,
  ChevronRight, Check, Copy, Trophy,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

// Clean scenarios - no GIFs
const gameScenarios = [
  {
    id: 1,
    scenario: "Your mom calls at 6 AM: 'Are we going to war? Your aunt shared something on Facebook.'",
    subtext: "The post has 200K shares and a blurry photo of tanks.",
    emoji: "📱",
    choices: [
      { 
        id: 'a', 
        text: "Send her the WW3 Tracker link", 
        subtext: "Fact-check in real-time",
        icon: "🎯",
        score: 40,
        reactionText: "Mom approves of your source game"
      },
      { 
        id: 'b', 
        text: "Check if the tanks have Walmart logos", 
        subtext: "It's probably from 2014",
        icon: "🔍",
        score: 35,
        reactionText: "Detective mode activated"
      },
      { 
        id: 'c', 
        text: "Panic buy toilet paper", 
        subtext: "Just like COVID times",
        icon: "🧻",
        score: 15,
        reactionText: "Not this again..."
      },
      { 
        id: 'd', 
        text: "Tell her to ask the aunt for sources", 
        subtext: "Karen won't have any",
        icon: "👵",
        score: 25,
        reactionText: "The aunt is typing..."
      }
    ]
  },
  {
    id: 2,
    scenario: "Your crypto bro friend says: 'Bro, WW3 is bullish for Bitcoin.'",
    subtext: "He's already leveraged 100x. What do you do?",
    emoji: "🪙",
    choices: [
      { 
        id: 'a', 
        text: "Short his advice", 
        subtext: "Inverse crypto bro = profit",
        icon: "📉",
        score: 35,
        reactionText: "Playing 4D chess"
      },
      { 
        id: 'b', 
        text: "Buy gold like a sane person", 
        subtext: "Old school but works",
        icon: "🥇",
        score: 40,
        reactionText: "Boomer strategy but valid"
      },
      { 
        id: 'c', 
        text: "Yolo into defense stocks", 
        subtext: "Raytheon to the moon",
        icon: "🚀",
        score: 30,
        reactionText: "Stonks only go up"
      },
      { 
        id: 'd', 
        text: "Take his advice seriously", 
        subtext: "Your portfolio is doomed",
        icon: "💀",
        score: 5,
        reactionText: "RIP your savings"
      }
    ]
  },
  {
    id: 3,
    scenario: "Elon tweets: 'WW3 probability is now 42.069%'",
    subtext: "The number has meme energy. How do you respond?",
    emoji: "🐦",
    choices: [
      { 
        id: 'a', 
        text: "Check actual prediction markets", 
        subtext: "Polymarket > Elon",
        icon: "📊",
        score: 40,
        reactionText: "Data > Memes"
      },
      { 
        id: 'b', 
        text: "Reply with the simulation meme", 
        subtext: "He's probably high again",
        icon: "🖥️",
        score: 25,
        reactionText: "Simulation confirmed"
      },
      { 
        id: 'c', 
        text: "Panic sell your Tesla stock", 
        subtext: "CEO is distracted",
        icon: "🚗",
        score: 20,
        reactionText: "Paper hands detected"
      },
      { 
        id: 'd', 
        text: "Trust Elon, he's a genius", 
        subtext: "Don't bet against Elon",
        icon: "🧠",
        score: 10,
        reactionText: "Cult member confirmed"
      }
    ]
  },
  {
    id: 4,
    scenario: "You see someone in full gas mask at Whole Foods.",
    subtext: "They're buying organic avocados. It's confusing.",
    emoji: "😷",
    choices: [
      { 
        id: 'a', 
        text: "Nod respectfully", 
        subtext: "They know something",
        icon: "🫡",
        score: 35,
        reactionText: "Respect the grind"
      },
      { 
        id: 'b', 
        text: "Judge silently but buy extra water", 
        subtext: "Secretly taking notes",
        icon: "💧",
        score: 30,
        reactionText: "Lowkey prepping"
      },
      { 
        id: 'c', 
        text: "Ask for their bunker location", 
        subtext: "Make prepper friends",
        icon: "🤝",
        score: 40,
        reactionText: "Networking level 100"
      },
      { 
        id: 'd', 
        text: "Post it on r/oddlyspecific", 
        subtext: "Farming karma first",
        icon: "📸",
        score: 15,
        reactionText: "Priorities, am I right?"
      }
    ]
  },
  {
    id: 5,
    scenario: "Kim Jong Un releases statement: 'Not invited to WW3 but monitoring closely.'",
    subtext: "Even dictators get FOMO. Your move?",
    emoji: "🇰🇵",
    choices: [
      { 
        id: 'a', 
        text: "Tweet 'Ratio + L + Not Invited'", 
        subtext: "Risk getting hacked",
        icon: "🐦",
        score: 30,
        reactionText: "Bold move cotton"
      },
      { 
        id: 'b', 
        text: "Take it as a signal to prep", 
        subtext: "If Kim's worried...",
        icon: "⚠️",
        score: 45,
        reactionText: "Supreme Leader is nervous"
      },
      { 
        id: 'c', 
        text: "Make a meme and go viral", 
        subtext: "Priority: internet points",
        icon: "😂",
        score: 20,
        reactionText: "Meme game strong"
      },
      { 
        id: 'd', 
        text: "Feel bad for Kim", 
        subtext: "Empathy for dictators?",
        icon: "🥺",
        score: 10,
        reactionText: "Weird flex but okay"
      }
    ]
  }
];

// Archetypes
const getArchetype = (score) => {
  if (score >= 180) return {
    name: "BUNKER DADDY",
    emoji: "☢️",
    color: "from-red-600 to-orange-600",
    description: "You've got 6 months of supplies, a ham radio, and you've already picked your post-apocalypse gang.",
    tagline: "Started prepping before it was cool.",
    percentile: 98,
    kimReaction: "Kim Jong Un wants YOU as his advisor"
  };
  if (score >= 145) return {
    name: "THE INFORMED NORMIE",
    emoji: "📱",
    color: "from-blue-600 to-cyan-600",
    description: "You follow the right accounts, have some supplies, and won't panic when things get weird.",
    tagline: "Stay woke, not anxious.",
    percentile: 78,
    kimReaction: "Kim Jong Un follows you on Twitter"
  };
  if (score >= 110) return {
    name: "COPING CHRONICALLY ONLINE",
    emoji: "🎭",
    color: "from-yellow-500 to-amber-500",
    description: "You make memes about the apocalypse but also have a go-bag. Humor is your defense mechanism.",
    tagline: "Laughing through the chaos.",
    percentile: 58,
    kimReaction: "Kim Jong Un laughed at your meme"
  };
  if (score >= 75) return {
    name: "MAIN CHARACTER SYNDROME",
    emoji: "🎬",
    color: "from-purple-500 to-pink-500",
    description: "You think you'd survive because you've seen all the zombie movies. Reality check: you've never gone camping without WiFi.",
    tagline: "Probably dies in act 1.",
    percentile: 35,
    kimReaction: "Kim Jong Un is more prepared than you"
  };
  return {
    name: "NPC VIBES",
    emoji: "🤖",
    color: "from-green-500 to-emerald-500",
    description: "You're either incredibly zen or haven't checked the news since 2019.",
    tagline: "This is fine. 🔥",
    percentile: 12,
    kimReaction: "Kim Jong Un sent you a care package"
  };
};

export default function WW3ReadinessGame() {
  const [gameState, setGameState] = useState('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showReaction, setShowReaction] = useState(null);

  const archetype = getArchetype(totalScore);
  const currentQ = gameScenarios[currentScenario];
  const progress = ((currentScenario) / gameScenarios.length) * 100;

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setAnswers([]);
    setTotalScore(0);
    setSelectedChoice(null);
    setShowReaction(null);
  };

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowReaction(choice);
    
    setTimeout(() => {
      const newAnswers = [...answers, choice];
      const newScore = totalScore + choice.score;
      
      setAnswers(newAnswers);
      setTotalScore(newScore);
      setSelectedChoice(null);
      setShowReaction(null);
      
      if (currentScenario < gameScenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
      } else {
        setGameState('result');
      }
    }, 1200);
  };

  const resetGame = () => {
    setGameState('intro');
    setCurrentScenario(0);
    setAnswers([]);
    setTotalScore(0);
    setShowShareModal(false);
    setShowReaction(null);
  };

  return (
    <>
      <SEO
        title="WW3 Readiness Test - Are You Ready? | 60 Second Quiz"
        description="Take the viral WW3 Readiness Test. Even Kim Jong Un wasn't invited! Find out your readiness score and share with friends."
        pathname="/ready"
        ogImage="/og-image.png"
      />
      
      <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-xl sm:text-2xl">☢️</span>
                <span className="font-bold text-base sm:text-lg">WW3 Tracker</span>
              </Link>
              {gameState === 'playing' && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                  <span className="hidden sm:inline">Q</span>
                  <span className="font-bold text-white">{currentScenario + 1}/{gameScenarios.length}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-lg mx-auto px-4 py-4 sm:py-6">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {gameState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                <div className="text-center space-y-3">
                  <div className="text-5xl sm:text-6xl">🎯</div>
                  <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                    The WW3
                    <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      Readiness Test
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-sm sm:text-base max-w-xs mx-auto">
                    Even Kim Jong Un wasn't invited to WW3.
                    <br />
                    <span className="text-white font-semibold">But you CAN be ready.</span>
                  </p>
                </div>

                {/* Not Invited Badge */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm">
                    <span>🇰🇵</span>
                    <span className="text-zinc-400">Not invited to WW3</span>
                  </span>
                </div>

                {/* Stats */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xl font-bold text-white">14.2K</div>
                      <div className="text-xs text-zinc-500">Tested today</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-400">60s</div>
                      <div className="text-xs text-zinc-500">To complete</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-400">5</div>
                      <div className="text-xs text-zinc-500">Scenarios</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:via-orange-400 hover:to-red-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/20 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    START THE TEST
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </button>
              </motion.div>
            )}

            {/* PLAYING */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500">Readiness Score</span>
                    <span className="text-white font-bold">{totalScore}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      initial={{ width: `${progress}%` }}
                      animate={{ width: `${progress + (100/gameScenarios.length)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Reaction Modal - Text only */}
                <AnimatePresence>
                  {showReaction && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-xs w-full text-center">
                        <div className="text-4xl mb-3">✨</div>
                        <p className="text-white font-bold text-lg">{showReaction.reactionText}</p>
                        <p className="text-red-400 font-bold text-xl mt-2">+{showReaction.score}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Question */}
                <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{currentQ.emoji}</span>
                    <div className="flex-1">
                      <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">
                        Scenario {currentScenario + 1} of {gameScenarios.length}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {currentQ.scenario}
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">{currentQ.subtext}</p>
                    </div>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2">
                    {currentQ.choices.map((choice, idx) => (
                      <motion.button
                        key={choice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedChoice !== null}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                          selectedChoice?.id === choice.id
                            ? 'border-green-500 bg-green-500/10'
                            : selectedChoice && selectedChoice.id !== choice.id
                            ? 'border-zinc-800 opacity-40'
                            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{choice.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{choice.text}</div>
                            <div className="text-zinc-500 text-xs">{choice.subtext}</div>
                          </div>
                          {selectedChoice?.id === choice.id && (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-zinc-600">
                  Pick what you'd ACTUALLY do
                </p>
              </motion.div>
            )}

            {/* RESULT */}
            {gameState === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Score Card */}
                <div className={`bg-gradient-to-br ${archetype.color} rounded-2xl p-5 text-center`}>
                  <div className="text-5xl mb-2">{archetype.emoji}</div>
                  <div className="text-4xl font-black text-white mb-1">{totalScore}%</div>
                  <div className="text-lg font-bold text-white/90">{archetype.name}</div>
                  <div className="text-white/70 text-sm mt-1">{archetype.tagline}</div>
                </div>

                {/* Description */}
                <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-4">
                  <p className="text-zinc-300 text-center text-sm">{archetype.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                    <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{archetype.percentile}%</div>
                    <div className="text-xs text-zinc-500">More ready than</div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                    <span className="text-2xl mb-1 block">🇰🇵</span>
                    <div className="text-xl font-bold text-white">0%</div>
                    <div className="text-xs text-zinc-500">Kim's score</div>
                  </div>
                </div>

                {/* Kim Reaction */}
                <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm italic text-center">
                    "{archetype.kimReaction}"
                  </p>
                  <p className="text-zinc-600 text-xs text-center mt-1">— Kim Jong Un</p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-3.5 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Result
                  </button>
                  <div className="flex gap-2">
                    <button onClick={resetGame} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl text-sm font-medium">
                      <RefreshCw className="w-4 h-4 inline mr-1" /> Retake
                    </button>
                    <Link to="/" className="flex-1 py-3 bg-zinc-800 text-white rounded-xl text-sm font-medium text-center">
                      <Globe className="w-4 h-4 inline mr-1" /> Tracker
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`bg-gradient-to-r ${archetype.color} p-6 text-center`}>
                  <button onClick={() => setShowShareModal(false)} className="absolute top-3 right-3 text-white/60 text-xl">&times;</button>
                  <div className="text-5xl mb-2">{archetype.emoji}</div>
                  <h2 className="text-4xl font-black text-white">{totalScore}%</h2>
                  <p className="text-white/90 font-bold text-sm">{archetype.name}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`I scored ${totalScore}% on WW3 Readiness Test! I'm "${archetype.name}" 🎯\n\nEven Kim Jong Un wasn't invited 😂`);
                      window.open(`https://twitter.com/intent/tweet?text=${text}&url=https://ww3tracker.live/share/${totalScore}`, '_blank');
                    }}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl"
                  >
                    Share on X / Twitter
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`I scored ${totalScore}% on WW3 Readiness Test! I'm "${archetype.name}" 🎯\n\nEven Kim Jong Un wasn't invited 😂\n\nhttps://ww3tracker.live/share/${totalScore}`);
                      alert('Copied!');
                    }}
                    className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="relative z-10 border-t border-zinc-800/50 mt-8">
          <div className="max-w-lg mx-auto px-4 py-4 text-center">
            <p className="text-zinc-600 text-xs flex items-center justify-center gap-1">
              <Smartphone className="w-3 h-3" />
              Optimized for mobile
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
