import { analyzeHeadlinesBatch } from './replicateService.js';
import { triggerBotMessage, updateLiveDataCache } from './botMessageService.js';

// Game state
let gameState = {
  usHP: 75,
  iranHP: 60,
  tension: 35,
  lastUpdate: new Date().toISOString(),
  recentScores: [],
  breakingAlert: null
};

// Tension decay - slowly reduce tension over time to prevent permanent 100%
const TENSION_DECAY_RATE = 2; // Decay 2% per update cycle
const TENSION_DECAY_INTERVAL = 10 * 60 * 1000; // Every 10 minutes

// Start tension decay interval
setInterval(() => {
  if (gameState.tension > 35) { // Don't go below baseline
    gameState.tension = Math.max(35, gameState.tension - TENSION_DECAY_RATE);
    gameState.lastUpdate = new Date().toISOString();
    console.log(`[GameState] Tension decayed to ${gameState.tension}%`);
  }
}, TENSION_DECAY_INTERVAL);

// Track previous state for change detection
let lastUSHP = 75;
let lastIranHP = 60;
let lastTension = 35;
let lastHeadline = "";

// Calculate HP and tension from news analysis
export const updateGameStateFromAnalysis = async (newsItems) => {
  console.log('[GameState] Updating from analysis...');
  
  // Analyze headlines
  const analyzed = await analyzeHeadlinesBatch(newsItems);
  
  // Calculate cumulative scores
  let usScoreDelta = 0;
  let iranScoreDelta = 0;
  let tensionDelta = 0;
  let highSeverityCount = 0;
  
  analyzed.forEach(item => {
    const { side, score, severity } = item.analysis;
    
    // HP changes based on score
    if (side === 'US') {
      usScoreDelta += score * 2; // Scale up
      iranScoreDelta -= score;
    } else if (side === 'IRAN') {
      iranScoreDelta += Math.abs(score) * 2;
      usScoreDelta -= Math.abs(score);
    }
    
    // Tension increases with severity
    if (severity === 'high') {
      tensionDelta += 5;
      highSeverityCount++;
    } else if (severity === 'medium') {
      tensionDelta += 2;
    } else {
      tensionDelta += 0.5;
    }
    
    // Store recent score
    gameState.recentScores.unshift({
      headline: item.headline,
      ...item.analysis,
      timestamp: new Date().toISOString()
    });
  });
  
  // Keep only last 20 scores
  gameState.recentScores = gameState.recentScores.slice(0, 20);
  
  // Apply changes with dampening
  const dampening = 0.3; // Don't change too fast
  
  gameState.usHP = Math.round(Math.max(10, Math.min(100, gameState.usHP + (usScoreDelta * dampening))));
  gameState.iranHP = Math.round(Math.max(10, Math.min(100, gameState.iranHP + (iranScoreDelta * dampening))));
  gameState.tension = Math.round(Math.max(0, Math.min(100, gameState.tension + (tensionDelta * dampening))));
  
  // Set breaking alert if high severity
  if (highSeverityCount > 0) {
    const breakingItem = analyzed.find(i => i.analysis.severity === 'high');
    if (breakingItem) {
      gameState.breakingAlert = {
        headline: breakingItem.headline,
        caption: breakingItem.analysis.memeCaption,
        badge: breakingItem.analysis.badge,
        timestamp: new Date().toISOString()
      };
      
      // Auto-clear after 30 seconds
      setTimeout(() => {
        gameState.breakingAlert = null;
      }, 30000);
    }
  }
  
  gameState.lastUpdate = new Date().toISOString();
  
  console.log(`[GameState] US: ${Math.round(gameState.usHP)}%, Iran: ${Math.round(gameState.iranHP)}%, Tension: ${Math.round(gameState.tension)}%`);
  
  // Update live data cache
  updateLiveDataCache({
    usHP: gameState.usHP,
    iranHP: gameState.iranHP,
    spicyMeter: gameState.tension,
    latestHeadline: gameState.breakingAlert?.headline || lastHeadline
  });
  
  // Trigger bot reactions to state changes
  if (Math.abs(gameState.usHP - lastUSHP) >= 2) {
    triggerBotMessage('hp', { side: 'us', newValue: gameState.usHP, oldValue: lastUSHP });
    lastUSHP = gameState.usHP;
  }
  
  if (Math.abs(gameState.iranHP - lastIranHP) >= 2) {
    triggerBotMessage('hp', { side: 'iran', newValue: gameState.iranHP, oldValue: lastIranHP });
    lastIranHP = gameState.iranHP;
  }
  
  if (Math.abs(gameState.tension - lastTension) >= 5) {
    triggerBotMessage('spicy', { level: gameState.tension });
    lastTension = gameState.tension;
  }
  
  if (gameState.breakingAlert && gameState.breakingAlert.headline !== lastHeadline) {
    const side = gameState.breakingAlert.caption?.includes('Iran') ? 'iran' : 'us';
    triggerBotMessage('meme', { 
      headline: gameState.breakingAlert.headline, 
      side: side 
    });
    lastHeadline = gameState.breakingAlert.headline;
  }
  
  return {
    state: gameState,
    analyzed
  };
};

export const getGameState = () => gameState;

export const resetBreakingAlert = () => {
  gameState.breakingAlert = null;
};

// Initialize with some default values
export const initGameState = () => {
  console.log('[GameState] Initialized');
  return gameState;
};
