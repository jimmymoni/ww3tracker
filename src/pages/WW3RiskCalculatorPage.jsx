import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertTriangle, Share2, RefreshCw, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Risk questions and their impact on WW3 probability
const riskQuestions = [
  {
    id: 1,
    question: "Is there active military conflict between major powers?",
    options: [
      { label: "No conflict", value: 0, description: "Peace between all major powers" },
      { label: "Proxy conflicts only", value: 5, description: "Fighting through proxies (current situation)" },
      { label: "Direct involvement", value: 25, description: "US/Russia/China fighting directly" },
      { label: "Full-scale war", value: 60, description: "Multiple great powers at war" }
    ]
  },
  {
    id: 2,
    question: "What's the status of nuclear talks or arms control?",
    options: [
      { label: "Active treaties working", value: 0, description: "New START, inspections ongoing" },
      { label: "Treaties expiring", value: 5, description: "Some agreements lapsing" },
      { label: "No active dialogue", value: 15, description: "No talks, tension high" },
      { label: "Nuclear threats made", value: 30, description: "Leaders threatening nuclear use" }
    ]
  },
  {
    id: 3,
    question: "How severe is the current flashpoint (Iran conflict)?",
    options: [
      { label: "Diplomatic tension only", value: 2, description: "Words, sanctions, no shooting" },
      { label: "Limited strikes", value: 10, description: "Surgical strikes, contained" },
      { label: "Active war", value: 20, description: "Full bombing campaign (current)" },
      { label: "Regional expansion", value: 40, description: "Multiple countries involved" }
    ]
  },
  {
    id: 4,
    question: "Are alliances activating or expanding?",
    options: [
      { label: "No activation", value: 0, description: "NATO quiet, no mutual defense" },
      { label: "Consultations only", value: 5, description: "Allies talking, not acting" },
      { label: "Limited support", value: 15, description: "Weapons, intel, not troops" },
      { label: "Article 5 or equivalent", value: 35, description: "Collective defense triggered" }
    ]
  },
  {
    id: 5,
    question: "What's the economic/financial stress level?",
    options: [
      { label: "Stable markets", value: 0, description: "No major economic disruptions" },
      { label: "Oil price spike", value: 5, description: "Energy costs rising" },
      { label: "Supply chain crisis", value: 15, description: "Major trade disruptions" },
      { label: "Financial panic", value: 25, description: "Markets collapsing, banks failing" }
    ]
  }
];

// Risk level definitions
const getRiskLevel = (probability) => {
  if (probability < 5) return { level: "LOW", color: "text-green-400", bgColor: "bg-green-500", description: "The current situation poses minimal risk of global conflict." };
  if (probability < 15) return { level: "ELEVATED", color: "text-yellow-400", bgColor: "bg-yellow-500", description: "Risk is higher than normal. Stay informed and monitor developments." };
  if (probability < 30) return { level: "HIGH", color: "text-orange-400", bgColor: "bg-orange-500", description: "Serious risk of escalation. Prepare for potential disruptions." };
  if (probability < 50) return { level: "CRITICAL", color: "text-red-400", bgColor: "bg-red-500", description: "Dangerously high risk. Global conflict is a real possibility." };
  return { level: "EXTREME", color: "text-purple-400", bgColor: "bg-purple-500", description: "Catastrophic risk. WW3 appears imminent or already underway." };
};

// Recommendations based on risk level
const getRecommendations = (probability) => {
  if (probability < 5) return [
    "Stay informed through credible news sources",
    "No special preparation needed",
    "Continue normal activities"
  ];
  if (probability < 15) return [
    "Monitor international news regularly",
    "Consider basic emergency supplies",
    "Follow @ww3tracker for updates",
    "Review your investment portfolio"
  ];
  if (probability < 30) return [
    "Stock 2-4 weeks of emergency supplies",
    "Have a family communication plan",
    "Consider energy/oil price impacts",
    "Stay alert for rapid developments"
  ];
  if (probability < 50) return [
    "Stock 1-2 months of emergency supplies",
    "Secure important documents",
    "Have evacuation plan ready",
    "Limit unnecessary travel",
    "Stay connected to emergency alerts"
  ];
  return [
    "Stock 3+ months of emergency supplies",
    "Execute emergency plans immediately",
    "Secure shelter and resources",
    "Maintain communication with family",
    "Follow official emergency guidance"
  ];
};

export default function WW3RiskCalculatorPage() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateRisk = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    // Apply some diminishing returns - higher numbers don't add linearly
    const adjusted = Math.min(total * 0.8, 85); // Cap at 85% since nothing is certain
    return Math.round(adjusted);
  };

  const handleNext = () => {
    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const handleShare = () => {
    const risk = calculateRisk();
    const riskInfo = getRiskLevel(risk);
    const text = `My WW3 Risk Assessment: ${risk}% (${riskInfo.level})\n\nCalculate your risk at ww3tracker.live/ww3-risk-calculator`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WW3 Risk Calculator',
        text: text,
        url: 'https://ww3tracker.live/ww3-risk-calculator'
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  const risk = calculateRisk();
  const riskInfo = getRiskLevel(risk);
  const recommendations = getRecommendations(risk);
  const currentQ = riskQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / riskQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-grid text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">🦅vs☠️</span>
              <span className="font-heading font-bold text-lg">WW3 Tracker</span>
            </Link>
            <div className="flex items-center gap-2 text-yellow-500/70 text-sm">
              <Calculator className="w-4 h-4" />
              <span>Risk Calculator</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-blue-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-sm text-gray-400">
              Question {currentQuestion + 1} of {riskQuestions.length}
            </p>

            {/* Question Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-heading font-bold mb-2">
                {currentQ.question}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Select the option that best describes the current situation
              </p>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[currentQ.id] === option.value
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      {answers[currentQ.id] === option.value && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={answers[currentQ.id] === undefined}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentQuestion === riskQuestions.length - 1 ? 'See Results' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Results Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <AlertTriangle className={`w-8 h-8 ${riskInfo.color}`} />
              </div>
              
              <h2 className="text-3xl font-heading font-bold mb-2">Your WW3 Risk Score</h2>
              
              {/* Risk Percentage */}
              <div className="text-6xl font-bold mb-2">
                <span className={riskInfo.color}>{risk}%</span>
              </div>
              
              {/* Risk Level Badge */}
              <div className={`inline-block px-4 py-2 rounded-full ${riskInfo.bgColor} text-black font-bold text-lg mb-4`}>
                {riskInfo.level} RISK
              </div>
              
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {riskInfo.description}
              </p>

              {/* Risk Bar */}
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600" />
                <motion.div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  initial={{ left: 0 }}
                  animate={{ left: `${risk}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading font-bold text-lg mb-4">How This Compares</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your Assessment</span>
                  <span className={`font-bold ${riskInfo.color}`}>{risk}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">WW3 Tracker Composite</span>
                  <span className="font-bold text-blue-400">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expert Average</span>
                  <span className="font-bold text-green-400">6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cuban Missile Crisis (1962)</span>
                  <span className="font-bold text-red-400">~50%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Recalculate
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Result
              </button>
            </div>

            {/* Read More */}
            <div className="text-center">
              <Link
                to="/blog/ww3-probability-2025-data"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Read: How We Calculate WW3 Probability →
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            ⚠️ This calculator is for educational purposes. It uses simplified assumptions.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Not professional advice. Read our full methodology for details.
          </p>
        </div>
      </footer>
    </div>
  );
}
