// ==================== BOT MESSAGE SERVICE ====================
// Handles fake user messages with live data injection
// This is separate from server.js to avoid circular imports

// Fake user pool (betting themed)
const fakeUsers = [
  { name: "DegenerateGambler", side: "us" },
  { name: "AllInOnIran", side: "iran" },
  { name: "PolymarketWhale", side: "us" },
  { name: "TehranTendies", side: "iran" },
  { name: "YOLO_America", side: "us" },
  { name: "HedgeFundHassan", side: "iran" },
  { name: "PutItAllOnRed", side: "us" },
  { name: "IRAN_to_the_MOON", side: "iran" },
];

// Live data cache for bot messages
let liveDataCache = {
  usHP: 75,
  iranHP: 60,
  spicyMeter: 35,
  ww3Risk: 34,
  latestHeadline: "US-Iran tensions escalate over Strait of Hormuz",
  oilPrice: "$75.00",
  oilChange: "+0.00%"
};

// Bot message state
let lastBotUserIndex = -1;
let isTyping = false;
let lastUserMessageTime = 0;
let ioInstance = null;
let addMessageFn = null;

// Update live data cache (called from various services)
export const updateLiveDataCache = (data) => {
  liveDataCache = { ...liveDataCache, ...data };
};

// Get current live data cache
export const getLiveDataCache = () => liveDataCache;

// Set socket.io instance
export const setSocketIO = (io) => {
  ioInstance = io;
};

// Set add message function
export const setAddMessageFn = (fn) => {
  addMessageFn = fn;
};

// Track user message time
export const recordUserMessage = () => {
  lastUserMessageTime = Date.now();
};

// Get random fake user (never same twice in a row)
const getNextBotUser = () => {
  let index;
  do {
    index = Math.floor(Math.random() * fakeUsers.length);
  } while (index === lastBotUserIndex && fakeUsers.length > 1);
  
  lastBotUserIndex = index;
  return fakeUsers[index];
};

// Send typing indicator via socket
const sendTypingIndicator = () => {
  if (!ioInstance) return;
  ioInstance.emit('typing', { isTyping: true });
};

const stopTypingIndicator = () => {
  if (!ioInstance) return;
  ioInstance.emit('typing', { isTyping: false });
};

// ==================== BETTING-FOCUSED MESSAGE TEMPLATES ====================
const generateMessageText = (type) => {
  const { usHP, iranHP, spicyMeter, ww3Risk, latestHeadline, oilPrice, oilChange } = liveDataCache;
  
  const templates = {
    iranHP: [
      `iran at ${iranHP}% HP 📉 im losing my shirt on them rn 💸`,
      `${iranHP}%? my puts on iran printing MONEY 🤑📉`,
      `iran HP tanking, time to double down 🎰`,
      `${iranHP}%? sold all my iran calls immediately 📞💀`,
    ],
    usHP: [
      `US ${usHP}% vs iran ${iranHP}% 📈 my US calls are ITM 🦅💰`,
      `US holding ${usHP}% 🚀 loading up more LONG positions`,
      `${usHP}%? US looking BULLISH AF, all in 📊`,
      `hedge funds buying US dip at ${usHP}% 🐋`,
    ],
    ww3Risk: [
      `WW3 at ${ww3Risk}% on polymarket 📊 just bet the house on NO 🏠`,
      `${ww3Risk}%? bought calls on defense stocks 🚀`,
      `odds moved to ${ww3Risk}% 📈 market pricing in chaos`,
      `${ww3Risk}% WW3 risk = perfect time to DCA into bunkers 💎🙌`,
    ],
    oilPrice: [
      `oil at ${oilPrice} (${oilChange}) 📈 my energy plays popping off`,
      `${oilPrice} crude 🛢️ war premium fully priced in now`,
      `black gold ${oilChange} 📊 OPEC plays printing`,
      `${oilPrice}? loaded up on USO calls at open 🎯`,
    ],
    spicyMeter: [
      `tension at ${spicyMeter}% 📊 volatility going crazy`,
      `${spicyMeter}% spicy? VIX bout to EXPLODE 📈`,
      `spicy meter ${spicyMeter}% 🌶️ buying more straddles`,
      `${spicyMeter}%? market makers sweating rn 😰`,
    ],
    headline: [
      `breaking: ${latestHeadline?.substring(0, 30)}... 📰 my positions reacting`,
      `just saw: ${latestHeadline?.substring(0, 35)}... time to rebalance 📊`,
      `news drop: ${latestHeadline?.substring(0, 30)}... vol expansion incoming 📈`,
    ],
    random: [
      `whos YOLOing on the next airstrike? 🎰`,
      `my portfolio cant handle this volatility rn 📉😰`,
      `anyone got insider info on the next move? 👀`,
      `this war better pay my rent by friday 🏠💸`,
      `bought the dip, it dipped more, bought more dip 📉📉📉`,
      `regime change odds looking JUICY on polymarket 🥤`,
      `just mortgaged my house for more US calls 🏠🚀`,
      `if iran hits 50% im retiring to bahamas 🏝️`,
      `war is my dividend stock 📈💰`,
      `anyone tracking the proxy spreads? 📊`,
      `my risk management is just praying 🙏`,
      `theta decay killing my weekend positions ⏰💀`,
      `this geopolitical volatility is my 9-5 now 📈`,
    ]
  };
  
  const options = templates[type] || templates.random;
  return options[Math.floor(Math.random() * options.length)];
};

// Send a bot message with typing delay
export const sendBotMessage = (type = 'random', customText = null) => {
  if (!ioInstance || !addMessageFn) {
    console.log('[BotService] Cannot send message - io or addMessage not set');
    return;
  }
  
  const user = getNextBotUser();
  const text = customText || generateMessageText(type);
  
  // Show typing indicator for 2-3 seconds
  const typingDelay = 2000 + Math.random() * 1000;
  
  console.log(`[BotService] ${user.name} typing... (message in ${Math.round(typingDelay)}ms)`);
  sendTypingIndicator();
  isTyping = true;
  
  setTimeout(() => {
    const message = {
      id: Date.now(),
      username: user.name,
      side: user.side,
      text: text,
      timestamp: Date.now(),
      isBot: true
    };
    
    addMessageFn(message);
    ioInstance.emit('newMessage', message);
    console.log(`[BotService] Message sent from ${user.name}: ${text.substring(0, 30)}...`);
    
    stopTypingIndicator();
    isTyping = false;
  }, typingDelay);
};

// Send burst of 2-3 messages (for big events)
export const sendBurstMessages = (type) => {
  if (!ioInstance) return;
  
  const burstCount = 2 + Math.floor(Math.random() * 2); // 2-3 messages
  
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      sendBotMessage(type);
    }, i * 4000); // 4 seconds apart
  }
};

// Start automatic bot message loop
export const startBotMessageLoop = () => {
  console.log('[BotService] Bot message loop starting...');
  
  // Send first message immediately
  setTimeout(() => {
    console.log('[BotService] Sending initial message...');
    sendBotMessage('random', 'market is OPEN 📈 whos got positions on this war? 🎰');
  }, 3000);
  
  const scheduleNextMessage = () => {
    // Random delay between 15-30 seconds for subsequent messages
    const delay = 15000 + Math.random() * 15000;
    
    setTimeout(() => {
      // Check if user sent message recently (wait 8 more seconds)
      const timeSinceUserMessage = Date.now() - lastUserMessageTime;
      if (timeSinceUserMessage < 8000) {
        scheduleNextMessage();
        return;
      }
      
      // Pick random message type weighted toward random
      const rand = Math.random();
      let type = 'random';
      if (rand < 0.15) type = 'iranHP';
      else if (rand < 0.25) type = 'usHP';
      else if (rand < 0.35) type = 'ww3Risk';
      else if (rand < 0.45) type = 'oilPrice';
      else if (rand < 0.55) type = 'spicyMeter';
      else if (rand < 0.65) type = 'headline';
      
      sendBotMessage(type);
      scheduleNextMessage();
    }, delay);
  };
  
  // Start the recurring loop after first message
  setTimeout(scheduleNextMessage, 8000);
};

// Event-triggered bot messages
export const triggerBotMessage = (type, data) => {
  let responses = [];
  let isBurst = false;
  let delay = 3000; // Default 3 second reaction time
  
  switch (type) {
    case 'spicy':
      liveDataCache.spicyMeter = data.level;
      responses = [
        `volatility spiking at ${data.level}% 📈 my straddles printing`,
        `tension at ${data.level}% 🌶️ time to load up on puts`,
        `${data.level}%? market makers are shook 😰`,
      ];
      delay = 4000;
      break;
    case 'meme':
      liveDataCache.latestHeadline = data.headline;
      responses = [
        `news drop: ${data.headline?.substring(0, 30)}... 📰 repositioning my portfolio`,
        `breaking: ${data.headline?.substring(0, 30)}... vol expansion incoming 📈`,
        `just saw: ${data.headline?.substring(0, 30)}... odds moving on polymarket`,
      ];
      delay = 5000; // React within 5 seconds of breaking headline
      isBurst = true;
      break;
    case 'hp':
      if (data.side === 'us') liveDataCache.usHP = data.newValue;
      if (data.side === 'iran') liveDataCache.iranHP = data.newValue;
      const diff = data.newValue - data.oldValue;
      const direction = diff > 0 ? 'up' : 'down';
      
      if (data.side === 'iran') {
        responses = [
          `iran HP ${direction} to ${data.newValue}% 📉 my puts are ITM`,
          `${data.newValue}%? just doubled my short position 📊`,
          `iran tanking to ${data.newValue}% 💸 bullish on US defense`,
        ];
      } else {
        responses = [
          `US HP ${direction} to ${data.newValue}% 📈 calls printing`,
          `${data.newValue}% for US 🚀 adding to my long position`,
        ];
      }
      delay = 3000; // React within 3 seconds of HP change
      break;
    case 'ww3':
      liveDataCache.ww3Risk = data.probability;
      if (data.direction === 'up') {
        responses = [
          `WW3 odds at ${data.probability}% 📈 time to hedge`,
          `${data.probability}%? just bought more defense calls 🚀`,
          `markets pricing in ${data.probability}% WW3 risk 📊`,
        ];
      } else {
        responses = [
          `WW3 dropped to ${data.probability}% 📉 taking profits`,
          `${data.probability}%? closing my fear positions 🎯`,
          `de-escalation at ${data.probability}% 📊 risk-off`,
        ];
      }
      isBurst = data.probability > 50; // Burst if WW3 risk > 50%
      break;
    case 'timeline':
      responses = [
        `remember ${data.event}? 📊 changed my whole strategy`,
        `${data.event} was when the real money was made 💰`,
        `${data.event}? my portfolio still recovering from that 😰`,
      ];
      break;
    case 'oil':
      liveDataCache.oilPrice = data.price;
      liveDataCache.oilChange = data.change;
      responses = [
        `oil ${data.price} (${data.change}) 📈 energy sector popping`,
        `crude at ${data.price} 🛢️ war premium holding`,
        `${data.change} on oil 📊 OPEC thesis playing out`,
      ];
      delay = 6000;
      break;
  }
  
  // Send message with delay
  if (responses.length > 0) {
    const text = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      if (isBurst) {
        sendBurstMessages(type);
      } else {
        sendBotMessage(type, text);
      }
    }, delay);
  }
};
