/**
 * Attack Parser Service
 * Parses Claude's structured format into attack objects
 * Handles multi-attack batches with validation and geocoding
 */

import { getCoordinates } from './locationService.js';
import { attackExists } from '../data/verifiedAttacks.js';

// Valid values for validation
const VALID_ATTACK_TYPES = ['airstrike', 'missile', 'drone', 'artillery', 'rocket', 'other'];
const VALID_SEVERITIES = ['high', 'medium', 'low'];
const VALID_CONFIDENCES = ['HIGH', 'MEDIUM', 'LOW'];

// Parse multiple attacks from Claude's structured format
export async function parseAttacks(text) {
  if (!text || typeof text !== 'string') {
    return { success: false, errors: ['No text provided'], attacks: [] };
  }

  const results = [];
  const errors = [];

  // Split by ---ATTACK--- markers
  const attackBlocks = text.split(/---ATTACK---/).filter(block => block.trim());

  if (attackBlocks.length === 0) {
    // Try parsing as single attack without marker
    attackBlocks.push(text);
  }

  for (let i = 0; i < attackBlocks.length; i++) {
    const block = attackBlocks[i].trim();
    
    try {
      const attack = await parseSingleAttack(block, i);
      
      if (attack) {
        // Validate the parsed attack
        const validation = validateAttack(attack);
        
        if (validation.valid) {
          // Check for duplicates
          const isDuplicate = attackExists(attack.location, attack.date);
          
          if (isDuplicate) {
            attack._duplicate = true;
            attack._warning = `Possible duplicate: attack at ${attack.location} within 6 hours`;
          }
          
          results.push(attack);
        } else {
          errors.push(`Attack ${i + 1}: ${validation.errors.join(', ')}`);
        }
      }
    } catch (err) {
      errors.push(`Attack ${i + 1}: Parse error - ${err.message}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
    attacks: results,
    count: results.length
  };
}

// Parse a single attack block
async function parseSingleAttack(block, index) {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l);
  
  const attack = {
    _rawIndex: index,
    _parsedAt: new Date().toISOString()
  };

  // Extract fields using regex patterns
  for (const line of lines) {
    // LOCATION: value
    const locationMatch = line.match(/^LOCATION:\s*(.+)/i);
    if (locationMatch) attack.location = locationMatch[1].trim();

    // COUNTRY: value
    const countryMatch = line.match(/^COUNTRY:\s*(.+)/i);
    if (countryMatch) attack.country = countryMatch[1].trim();

    // TIME: value
    const timeMatch = line.match(/^TIME:\s*(.+)/i);
    if (timeMatch) attack.timeRaw = timeMatch[1].trim();

    // TYPE: value
    const typeMatch = line.match(/^TYPE:\s*(.+)/i);
    if (typeMatch) attack.attackType = typeMatch[1].trim().toLowerCase();

    // SEVERITY: value
    const severityMatch = line.match(/^SEVERITY:\s*(.+)/i);
    if (severityMatch) attack.severity = severityMatch[1].trim().toLowerCase();

    // TARGET: value
    const targetMatch = line.match(/^TARGET:\s*(.+)/i);
    if (targetMatch) attack.target = targetMatch[1].trim();

    // HEADLINE: value
    const headlineMatch = line.match(/^HEADLINE:\s*(.+)/i);
    if (headlineMatch) attack.headline = headlineMatch[1].trim();

    // SOURCE: value
    const sourceMatch = line.match(/^SOURCE:\s*(.+)/i);
    if (sourceMatch) attack.source = sourceMatch[1].trim();

    // CONFIDENCE: value
    const confidenceMatch = line.match(/^CONFIDENCE:\s*(.+)/i);
    if (confidenceMatch) attack.confidence = confidenceMatch[1].trim().toUpperCase();

    // NOTES: value
    const notesMatch = line.match(/^NOTES:\s*(.+)/i);
    if (notesMatch) attack.notes = notesMatch[1].trim();
  }

  // Parse time
  attack.date = parseTime(attack.timeRaw);
  
  // Generate ID
  if (attack.location && attack.attackType) {
    const dateStr = attack.date ? new Date(attack.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const locationSlug = attack.location.toLowerCase().replace(/\s+/g, '-');
    const typeSlug = attack.attackType.toLowerCase();
    attack.id = `${dateStr}-${locationSlug}-${typeSlug}`;
  }

  // Geocode location
  if (attack.location) {
    const coords = await getCoordinates(attack.location);
    if (coords) {
      attack.coordinates = { lat: coords.lat, lng: coords.lng };
      // Use geocoded country if not explicitly provided
      if (!attack.country && coords.country) {
        attack.country = coords.country;
      }
    } else {
      attack._geocodeWarning = `Could not geocode: ${attack.location}`;
    }
  }

  // Build description from notes/target
  if (attack.notes) {
    attack.description = attack.notes;
  } else if (attack.target) {
    attack.description = `Target: ${attack.target}`;
  } else {
    attack.description = attack.headline || 'No additional details';
  }

  // Set reportedAt
  attack.reportedAt = new Date().toISOString().split('T')[0];

  return attack;
}

// Parse time string to ISO format
function parseTime(timeStr) {
  if (!timeStr) return new Date().toISOString();

  // Handle "now"
  if (timeStr.toLowerCase() === 'now') {
    return new Date().toISOString();
  }

  // Handle "YYYY-MM-DD HH:MM UTC" format
  const utcMatch = timeStr.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})\s*UTC/i);
  if (utcMatch) {
    const [_, date, hours, minutes] = utcMatch;
    return new Date(`${date}T${hours}:${minutes}:00Z`).toISOString();
  }

  // Handle ISO format
  if (timeStr.includes('T') || timeStr.includes('Z')) {
    try {
      return new Date(timeStr).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  // Default to now if can't parse
  return new Date().toISOString();
}

// Validate attack object
export function validateAttack(attack) {
  const errors = [];
  const required = ['location', 'country', 'date', 'attackType', 'severity', 'headline', 'source', 'confidence'];

  for (const field of required) {
    if (!attack[field]) {
      errors.push(`Missing required field: ${field.toUpperCase()}`);
    }
  }

  // Validate attack type
  if (attack.attackType && !VALID_ATTACK_TYPES.includes(attack.attackType)) {
    errors.push(`Invalid TYPE: ${attack.attackType}. Must be: ${VALID_ATTACK_TYPES.join(', ')}`);
  }

  // Validate severity
  if (attack.severity && !VALID_SEVERITIES.includes(attack.severity)) {
    errors.push(`Invalid SEVERITY: ${attack.severity}. Must be: ${VALID_SEVERITIES.join(', ')}`);
  }

  // Validate confidence
  if (attack.confidence && !VALID_CONFIDENCES.includes(attack.confidence)) {
    errors.push(`Invalid CONFIDENCE: ${attack.confidence}. Must be: ${VALID_CONFIDENCES.join(', ')}`);
  }

  // Validate coordinates
  if (!attack.coordinates) {
    errors.push('Could not geocode LOCATION');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Format attack for display
export function formatAttackPreview(attack, index) {
  const severityEmoji = {
    high: '🔴',
    medium: '🟠',
    low: '🟡'
  }[attack.severity] || '⚪';

  const confidenceEmoji = {
    HIGH: '✅',
    MEDIUM: '⏱️',
    LOW: '❌'
  }[attack.confidence] || '❓';

  const tweetWarning = attack.confidence === 'MEDIUM' 
    ? '(tweet in 30 min)' 
    : attack.confidence === 'LOW' 
      ? '(NO tweet)' 
      : '(immediate tweet)';

  const duplicateWarning = attack._duplicate ? ' ⚠️ POSSIBLE DUPLICATE' : '';

  return `${index + 1}. ${severityEmoji} ${attack.confidence} | ${attack.location} | ${attack.attackType} ${tweetWarning}${duplicateWarning}`;
}

// Get confidence color for Telegram
export function getConfidenceColor(confidence) {
  const colors = {
    HIGH: '\xF0\x9F\x9F\xA2', // Green
    MEDIUM: '\xF0\x9F\x9F\xA1', // Yellow
    LOW: '\xF0\x9F\x94\xB4' // Red
  };
  return colors[confidence] || '⚪';
}

export default {
  parseAttacks,
  validateAttack,
  formatAttackPreview,
  getConfidenceColor
};
