// Mock data for the War Tracker Dashboard

export const OFFICIAL_STATEMENTS = [
  "We will not allow Iran to obtain a nuclear weapon",
  "All options remain on the table",
  "Maximum pressure campaign continues",
  "We are prepared to defend our interests and allies",
  "Diplomatic solution remains possible",
  "Iran must cease its destabilizing activities",
  "We stand with Israel in their right to self-defense",
  "Military readiness is at the highest level",
  "Sanctions will remain until behavior changes",
  "Regional security is our top priority",
];

export const ANALYST_COMMENTARY = [
  "Escalation in the Gulf region continues to concern international observers",
  "Sanctions pressure mounting on Iranian economy with measurable impact",
  "Military posture suggests preparation for extended conflict duration",
  "Diplomatic channels remain technically open but severely strained",
  "Regional allies monitoring situation closely for expansion indicators",
  "Oil market volatility reflects uncertainty over Strait of Hormuz",
  "Proxy activity increasing across multiple theaters simultaneously",
  "Nuclear program advancement accelerates amid reduced inspection access",
  "Humanitarian situation deteriorating in conflict-affected areas",
  "International coalition forming to address maritime security concerns",
];

export const NEWS_CATEGORIES = [
  {
    id: 1,
    headline: "US deploys aircraft carrier to Persian Gulf",
    category: "Military Movement",
    analysis: "Aircraft carrier deployment represents significant escalation in regional posture",
    badge: "BREAKING",
    badgeColor: "bg-red-500",
  },
  {
    id: 2,
    headline: "Iran warns of 'crushing response' to any attack",
    category: "Official Statement",
    analysis: "Rhetorical escalation follows pattern of prior regional conflicts",
    badge: "ESCALATION",
    badgeColor: "bg-orange-500",
  },
  {
    id: 3,
    headline: "European allies urge de-escalation",
    category: "Diplomatic",
    analysis: "Diplomatic pressure increasing as regional stability deteriorates",
    badge: "INTELLIGENCE",
    badgeColor: "bg-yellow-500",
  },
  {
    id: 4,
    headline: "Oil prices spike 15% amid tensions",
    category: "Economic Impact",
    analysis: "Market volatility reflects supply chain vulnerability through Strait of Hormuz",
    badge: "ECONOMIC",
    badgeColor: "bg-purple-500",
  },
  {
    id: 5,
    headline: "Nuclear inspections report increased enrichment activity",
    category: "Nuclear Program",
    analysis: "Uranium enrichment levels approach weapons-grade threshold",
    badge: "CONFIRMED",
    badgeColor: "bg-red-500",
  },
  {
    id: 6,
    headline: "Both sides claim tactical advantages in recent exchanges",
    category: "Conflict Update",
    analysis: "Information warfare complicates independent casualty verification",
    badge: "DISPUTED",
    badgeColor: "bg-green-500",
  },
];

export const ELIMINATED_OFFICIALS = [
  {
    id: 1,
    name: "Ismail Haniyeh",
    title: "Hamas Political Chief",
    date: "July 31, 2024",
    cause: "Airstrike Tehran",
    image: "https://placehold.co/100x100/2a2a4e/FFF?text=IH",
  },
  {
    id: 2,
    name: "Hassan Nasrallah",
    title: "Hezbollah Secretary-General",
    date: "Sep 27, 2024",
    cause: "Airstrike Beirut",
    image: "https://placehold.co/100x100/2a2a4e/FFF?text=HN",
  },
  {
    id: 3,
    name: "Mohammad Reza Zahedi",
    title: "IRGC Quds Force Commander",
    date: "Apr 1, 2024",
    cause: "Damascus Strike",
    image: "https://placehold.co/100x100/2a2a4e/FFF?text=MRZ",
  },
  {
    id: 4,
    name: "Yahya Sinwar",
    title: "Hamas Leader Gaza",
    date: "Oct 16, 2024",
    cause: "Gaza IDF operation",
    image: "https://placehold.co/100x100/2a2a4e/FFF?text=YS",
  },
];

export const TICKER_ITEMS = [
  "🔴 BREAKING: Iran responds... 💀 yikes",
  "🔵 US says: we don't negotiate... ok bestie",
  "🟡 Oil prices going brrrr 📈",
  "🔴 Twitter users become geopolitical experts overnight 🧠",
  "🔵 Pentagon: 'We have no comment' (they totally do) 🤫",
  "🟡 World leaders pretend to be shocked 😲",
  "🔴 Military-industrial complex stocks go brrrr 💰",
  "🔵 UN writes strongly worded letter 📜",
  "🟡 Reddit armchair generals deploy 🎖️",
  "🔴 Someone's uncle on Facebook has all the answers 👴",
  "🔵 Defense contractors calculating profits 🧮",
  "🟡 TikTok zoomers commentating live 📱",
];

export const SPICY_LEVELS = [
  { level: 0, label: "😴 Chill", color: "#4ade80", chili: "🌶️" },
  { level: 1, label: "😤 Heated", color: "#fbbf24", chili: "🌶️🌶️" },
  { level: 2, label: "😡 Spicy", color: "#fb923c", chili: "🌶️🌶️🌶️" },
  { level: 3, label: "🤯 Unhinged", color: "#f87171", chili: "🌶️🌶️🌶️🌶️" },
  { level: 4, label: "☢️ GOING NUCLEAR", color: "#dc2626", chili: "☢️☢️☢️" },
];

export const FIGHTER_STATS = {
  us: {
    name: "THE DEALMAKER 💰",
    hp: 75,
    maxHp: 100,
    stats: {
      sanctions: 99,
      tweets: "∞",
      allies: "NATO",
      ego: 100,
    },
    color: "bg-red-500",
    borderColor: "border-red-500",
  },
  iran: {
    name: "THE SHADOW 🕶️",
    hp: 60,
    maxHp: 100,
    stats: {
      proxies: 50,
      nukes: "Almost",
      allies: "Russia (maybe)",
      patience: 12,
    },
    color: "bg-red-500",
    borderColor: "border-red-500",
  },
};

export const COMBO_MESSAGES = [
  { text: "CRITICAL HIT! +3 to US 💥", type: "us", color: "text-red-400" },
  { text: "IRAN DODGES! Neutralized 🌀", type: "iran", color: "text-red-400" },
  { text: "DOUBLE KO! Both sides lose 😭", type: "neutral", color: "text-yellow-400" },
  { text: "SUPER EFFECTIVE! 🎯", type: "us", color: "text-red-400" },
  { text: "COUNTER ATTACK! ⚔️", type: "iran", color: "text-red-400" },
  { text: "COMBO BREAKER! 🛑", type: "neutral", color: "text-purple-400" },
  { text: "FINISH HIM! 💀", type: "us", color: "text-red-400" },
  { text: "PARRY! Missed opportunity 🛡️", type: "iran", color: "text-red-400" },
];
