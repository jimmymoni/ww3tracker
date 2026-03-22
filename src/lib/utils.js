// Utility functions for the War Tracker

export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateSpicyLevel = (tension) => {
  if (tension < 20) return 0;
  if (tension < 40) return 1;
  if (tension < 60) return 2;
  if (tension < 80) return 3;
  return 4;
};

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Sound effect placeholders (in a real app, these would play actual sounds)
export const playSound = (type) => {
  console.log(`Playing sound: ${type}`);
  // Types: 'fatality', 'airhorn', 'trombone', 'fight', 'punch', 'explosion'
};

// Animation variants for Framer Motion
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const shakeAnimation = {
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

export const pulseAnimation = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, repeat: 2 }
  }
};

// CSS class generators
export const getComicBorder = (color = 'black') => {
  return `border-4 border-${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
};

export const getNeonText = (color) => {
  const colors = {
    yellow: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]',
    red: 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]',
    blue: 'text-red-400 drop-shadow-[0_0_8px_rgba(204,26,26,0.8)]',
  };
  return colors[color] || colors.yellow;
};
