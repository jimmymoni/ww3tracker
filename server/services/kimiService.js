import fetch from 'node-fetch';

const KIMI_BASE_URL = 'https://api.moonshot.cn/v1';
const KIMI_MODEL = 'moonshot-v1-8k';

// Read env var at runtime
const getKimiKey = () => process.env.KIMI_API_KEY;

// Badge selection based on headline keywords
const getBadgeFromHeadline = (headline) => {
  const lower = headline.toLowerCase();
  
  // BREAKING 💥 - violent/attack keywords
  if (/\b(killed|struck|missiles|attack|strikes|bombed|explosion|casualties|death|dead)\b/.test(lower)) {
    return 'BREAKING 💥';
  }
  
  // YIKES 😬 - warning/threat keywords
  if (/\b(warns|threatens|threat|warning|retaliation|revenge|promises|vows)\b/.test(lower)) {
    return 'YIKES 😬';
  }
  
  // SUS 👀 - diplomatic/talks keywords
  if (/\b(talks|diplomatic|diplomacy|negotiations|peace|meeting|discuss|agreement)\b/.test(lower)) {
    return 'SUS 👀';
  }
  
  // Default OOF 💀
  return 'OOF 💀';
};

const BADGES = ['BREAKING 💥', 'YIKES 😬', 'SUS 👀', 'OOF 💀', 'W 🏆', 'L 💀'];

const analyzeHeadlinePrompt = (headline, description) => `
You are a Gen-Z war analyst who analyzes US-Iran conflict news.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Analyze this news and respond with ONLY a JSON object in this exact format:
{
  "side": "US" | "IRAN" | "NEUTRAL",
  "score": number between -5 and 5 (negative favors Iran, positive favors US, 0 is neutral),
  "severity": "low" | "medium" | "high",
  "badge": one of ["BREAKING 💥", "YIKES 😬", "SUS 👀", "OOF 💀", "W 🏆", "L 💀"],
  "memeCaption": "funny gen-z reaction",
  "tickerText": "short funny version (max 8 words)"
}

CRITICAL RULES FOR MEME CAPTION:
- Write a UNIQUE funny Gen-Z reaction to THIS specific headline
- NEVER repeat the same caption twice - make it original!
- Max 8 words
- No full sentences
- Use slang: fr fr, no cap, caught an L, slay, bestie, 💀🔥😭
- Be creative and specific to this headline

Examples of UNIQUE captions:
- "Iran caught an L fr fr 💀"
- "US said no cap we bussin 🦅"
- "Bestie this is literally giving anxiety 😭"
- "They really hit the griddy on em 🕺"
- "Ayatollah caught lacking mid fr fr 📸"

Rules:
- "side": Which side benefits or is affected more by this news
- "score": How much this impacts the conflict (-5 = big win for Iran, 5 = big win for US)
- "severity": How serious/escalatory this news is
- "badge": ${getBadgeFromHeadline(headline)} (use this pre-selected badge based on headline keywords)
- Meme caption: MUST BE UNIQUE - never repeat captions
- Return ONLY valid JSON, no markdown, no explanation
`;

const chatSystemPrompt = `You are a Gen-Z war analyst who speaks only in brainrot slang.
Use: fr fr, no cap, bussin, caught an L, slay, it's giving, bestie, 💀🔥😭🦅, mid, rizz, gyatt, skibidi, sigma, ohio, fanum tax
Max 3 sentences. Be funny. Explain Iran/US news in slang only.`;

export const analyzeHeadline = async (headline, description = '') => {
  const apiKey = getKimiKey();
  if (!apiKey) {
    console.log('[Kimi] Using mock analysis (no API key)');
    return getMockAnalysis(headline);
  }

  try {
    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON.' },
          { role: 'user', content: analyzeHeadlinePrompt(headline, description) }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Kimi] API error:', error);
      return getMockAnalysis(headline);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Kimi] No JSON found in response:', content);
      return getMockAnalysis(headline);
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Determine badge based on headline keywords (override AI selection)
    const determinedBadge = getBadgeFromHeadline(headline);
    
    // Validate and normalize
    return {
      side: ['US', 'IRAN', 'NEUTRAL'].includes(analysis.side) ? analysis.side : 'NEUTRAL',
      score: Math.max(-5, Math.min(5, analysis.score || 0)),
      severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'medium',
      badge: determinedBadge, // Use keyword-based badge selection
      memeCaption: analysis.memeCaption || 'Bestie, something happened fr fr 💀',
      tickerText: analysis.tickerText || 'News dropped, no cap 📰'
    };
  } catch (error) {
    console.error('[Kimi] Analysis error:', error.message);
    return getMockAnalysis(headline);
  }
};

export const getChatResponse = async (userMessage, context = '') => {
  const apiKey = getKimiKey();
  if (!apiKey) {
    console.log('[Kimi] Using mock chat (no API key)');
    return getMockChatResponse(userMessage);
  }

  try {
    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        messages: [
          { role: 'system', content: chatSystemPrompt },
          { role: 'user', content: context ? `Context: ${context}\n\nUser: ${userMessage}` : userMessage }
        ],
        temperature: 0.9,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Kimi] Chat API error:', error);
      return getMockChatResponse(userMessage);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getMockChatResponse(userMessage);
  } catch (error) {
    console.error('[Kimi] Chat error:', error.message);
    return getMockChatResponse(userMessage);
  }
};

// Mock responses for when API key is not available
const getMockAnalysis = (headline) => {
  const lower = headline.toLowerCase();
  
  // Use keyword-based badge selection for mock too
  const badge = getBadgeFromHeadline(headline);
  
  if (lower.includes('trump') || lower.includes('us') || lower.includes('sanction')) {
    return {
      side: 'US',
      score: Math.floor(Math.random() * 3) + 2,
      severity: 'medium',
      badge: badge,
      memeCaption: 'US out here catching dubs fr fr, no cap 🦅💪',
      tickerText: 'US secured the bag 💰'
    };
  } else if (lower.includes('iran') && (lower.includes('threat') || lower.includes('warn'))) {
    return {
      side: 'IRAN',
      score: -(Math.floor(Math.random() * 3) + 2),
      severity: 'high',
      badge: badge,
      memeCaption: 'Iran really said "hold my tea" and went off 🍵💀',
      tickerText: 'Iran cooking something fr 🔥'
    };
  }
  
  return {
    side: 'NEUTRAL',
    score: 0,
    severity: 'low',
    badge: badge,
    memeCaption: 'Something sus happening bestie, stay woke 👀',
    tickerText: 'Plot thickening... 🍿'
  };
};

const MOCK_QUIPS = [
  "bro iran just caught an L fr fr 💀",
  "US said no cap we bussin today 🦅",
  "this ain't it chief 😭",
  "the plot thickens bestie 🍵",
  "iran is literally giving main character energy rn 🎭",
  "yooo did they just hit the griddy on em? 🕺",
  "mid take from the ayatollah ngl 💤",
  "US out here ratioing iran hard 📊",
  "someone's about to get cancelled irl 💥",
  "the way they're beefing rn... unhinged behavior 🎪",
];

const getMockChatResponse = () => {
  return MOCK_QUIPS[Math.floor(Math.random() * MOCK_QUIPS.length)];
};

// Batch analyze multiple headlines
export const analyzeHeadlinesBatch = async (items) => {
  const results = [];
  
  for (const item of items.slice(0, 10)) { // Analyze top 10
    try {
      const analysis = await analyzeHeadline(item.headline, item.description);
      results.push({
        ...item,
        analysis
      });
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    } catch (error) {
      console.error('[Kimi] Batch analysis error:', error);
      results.push({
        ...item,
        analysis: getMockAnalysis(item.headline)
      });
    }
  }
  
  return results;
};
