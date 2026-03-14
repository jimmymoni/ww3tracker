import fetch from 'node-fetch';

const KIMI_BASE_URL = 'https://api.moonshot.cn/v1';
const KIMI_MODEL = 'moonshot-v1-8k';

// Read env var at runtime
const getKimiKey = () => process.env.KIMI_API_KEY;

// Badge selection based on headline keywords
const getBadgeFromHeadline = (headline) => {
  const lower = headline.toLowerCase();
  
  // BREAKING - violent/attack keywords
  if (/\b(killed|struck|missiles|attack|strikes|bombed|explosion|casualties|death|dead)\b/.test(lower)) {
    return 'BREAKING';
  }
  
  // ESCALATION - warning/threat keywords
  if (/\b(warns|threatens|threat|warning|retaliation|revenge|promises|vows)\b/.test(lower)) {
    return 'ESCALATION';
  }
  
  // INTELLIGENCE - diplomatic/talks keywords
  if (/\b(talks|diplomatic|diplomacy|negotiations|peace|meeting|discuss|agreement)\b/.test(lower)) {
    return 'INTELLIGENCE';
  }
  
  // Default
  return 'CONFIRMED';
};

const BADGES = ['BREAKING', 'ESCALATION', 'INTELLIGENCE', 'CASUALTIES', 'CONFIRMED', 'DISPUTED'];

const analyzeHeadlinePrompt = (headline, description) => `
You are a military intelligence analyst analyzing US-Iran conflict news.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Analyze this news and respond with ONLY a JSON object in this exact format:
{
  "side": "US" | "IRAN" | "NEUTRAL",
  "score": number between -5 and 5 (negative favors Iran, positive favors US, 0 is neutral),
  "severity": "low" | "medium" | "high",
  "badge": one of ["BREAKING", "ESCALATION", "INTELLIGENCE", "CASUALTIES", "CONFIRMED", "DISPUTED"],
  "analysis": "professional military assessment of this development",
  "tickerText": "concise factual summary (max 10 words)"
}

CRITICAL RULES FOR ANALYSIS:
- Write a professional military intelligence assessment
- Focus on tactical and strategic implications
- Maximum 20 words
- No slang or informal language
- Be objective and factual

Examples of professional analysis:
- "Iranian military infrastructure sustaining significant damage from precision strikes"
- "US carrier deployment signals elevated readiness posture in region"
- "Proxy escalation risks drawing in additional regional actors"
- "Sanctions impact reducing Iranian operational capacity"

Rules:
- "side": Which side benefits or is affected more by this news
- "score": How much this impacts the conflict (-5 = big win for Iran, 5 = big win for US)
- "severity": How serious/escalatory this news is
- "badge": ${getBadgeFromHeadline(headline)} (use this pre-selected badge based on headline keywords)
- Analysis: MUST BE PROFESSIONAL - no slang, no emojis
- Return ONLY valid JSON, no markdown, no explanation
`;

const chatSystemPrompt = `You are a military intelligence analyst providing brief, factual assessments of US-Iran conflict developments.
Maximum 3 sentences. Objective tone. No speculation. Focus on verified facts and tactical implications.`;

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
      analysis: analysis.analysis || 'Military development requires monitoring',
      tickerText: analysis.tickerText || 'Conflict update'
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
      analysis: 'US military or diplomatic advantage gained in region',
      tickerText: 'US operational success reported'
    };
  } else if (lower.includes('iran') && (lower.includes('threat') || lower.includes('warn'))) {
    return {
      side: 'IRAN',
      score: -(Math.floor(Math.random() * 3) + 2),
      severity: 'high',
      badge: badge,
      analysis: 'Iranian forces conducting offensive operations',
      tickerText: 'Iranian military action confirmed'
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
  "Escalation in the Gulf region continues to concern international observers",
  "Sanctions pressure mounting on Iranian economy with measurable impact",
  "Military posture suggests preparation for extended conflict duration",
  "Diplomatic channels remain technically open but severely strained",
  "Regional allies monitoring situation closely for expansion indicators",
];

const getMockChatResponse = () => {
  return MOCK_QUIPS[Math.floor(Math.random() * MOCK_QUIPS.length)];
};

// NEW: Analyze headline for map display - extracts attack details
const analyzeForMapPrompt = (headline, description) => `
You are a military intelligence analyst. Determine if this news describes a CONFIRMED military strike/attack.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Respond with ONLY a JSON object:
{
  "isAttack": true | false,
  "attackType": "airstrike" | "missile" | "drone" | "bombing" | "shelling" | "none",
  "location": "city or region name",
  "severity": "high" | "medium" | "low",
  "description": "brief factual description of the attack"
}

RULES:
- isAttack: ONLY true if a military strike/attack already happened (not threats, warnings, analysis)
- attackType: classify the weapon/method used
- location: extract the city/region where it happened
- severity: high = casualties/infrastructure damage, medium = confirmed strike no casualties, low = minor damage
- Return ONLY JSON, no markdown
`;

export const analyzeForMap = async (headline, description = '') => {
  const apiKey = getKimiKey();
  
  // Quick keyword pre-check for performance
  const lower = (headline + ' ' + description).toLowerCase();
  const hasAttackKeyword = /\b(strike|struck|bombed|attack|hit|airstrike|missile|drone|explosion|shelling)\b/.test(lower);
  const hasExcludeKeyword = /\b(warns|threatens|pledges|plans|considering|may|might|could|analysis|opinion|why|what if)\b/.test(lower);
  
  // Fast path: if no attack keywords or has exclude keywords, skip AI
  if (!hasAttackKeyword || hasExcludeKeyword) {
    return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
  }
  
  if (!apiKey) {
    // Fallback: basic keyword matching
    return getMockMapAnalysis(headline, description);
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
          { role: 'user', content: analyzeForMapPrompt(headline, description) }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      return getMockMapAnalysis(headline, description);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return getMockMapAnalysis(headline, description);
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return {
      isAttack: analysis.isAttack || false,
      attackType: analysis.attackType || 'none',
      location: analysis.location || '',
      severity: analysis.severity || 'low',
      description: analysis.description || ''
    };
  } catch (error) {
    return getMockMapAnalysis(headline, description);
  }
};

// Mock map analysis when AI unavailable
const getMockMapAnalysis = (headline, description) => {
  const lower = (headline + ' ' + description).toLowerCase();
  
  // Confirmed attacks
  if (lower.includes('strike') || lower.includes('struck') || lower.includes('bombed') || lower.includes('hit by')) {
    let type = 'strike';
    if (lower.includes('missile')) type = 'missile';
    else if (lower.includes('drone')) type = 'drone';
    else if (lower.includes('bomb')) type = 'bombing';
    
    let location = '';
    if (lower.includes('baghdad')) location = 'Baghdad';
    else if (lower.includes('tehran')) location = 'Tehran';
    else if (lower.includes('kharg')) location = 'Kharg Island';
    else if (lower.includes('jerusalem')) location = 'Jerusalem';
    else if (lower.includes('beirut')) location = 'Beirut';
    else if (lower.includes('damascus')) location = 'Damascus';
    else if (lower.includes('gaza')) location = 'Gaza';
    else if (lower.includes('basra')) location = 'Basra';
    
    let severity = 'medium';
    if (lower.includes('killed') || lower.includes('casualties') || lower.includes('destroyed')) severity = 'high';
    
    return {
      isAttack: true,
      attackType: type,
      location: location,
      severity: severity,
      description: headline
    };
  }
  
  return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
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

// Batch analyze for map display
export const analyzeForMapBatch = async (items) => {
  const results = [];
  
  for (const item of items.slice(0, 15)) { // Analyze top 15 for map
    try {
      const mapAnalysis = await analyzeForMap(item.headline, item.description);
      if (mapAnalysis.isAttack) {
        results.push({
          ...item,
          mapAnalysis
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 50));
    } catch (error) {
      console.error('[Kimi] Map analysis error:', error);
    }
  }
  
  return results;
};
