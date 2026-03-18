/**
 * RELATIONSHIP VISUALIZATION GENERATOR
 * Generates various text-based and data formats for visualizing conflict relationships
 * Can be extended to output GraphViz DOT, Mermaid, D3.js JSON, etc.
 */

import { 
  ACTORS, 
  RELATIONSHIPS, 
  STAKES, 
  CONFLICT_ZONES,
  getActor,
  getAllActors,
  getRelationshipsByType,
  getAxisOfResistance,
  getUSCoalition,
  getActiveConflicts
} from './conflictRelationships.js';

// ============================================================================
// TEXT-BASED DIAGRAM GENERATORS
// ============================================================================

/**
 * Generate ASCII conflict matrix showing who is fighting whom
 */
export function generateConflictMatrix() {
  const actors = getAllActors().filter(a => a.type === 'nation-state');
  const attacks = getRelationshipsByType('attacking');
  
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                    CONFLICT MATRIX (Nation States)                   ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  // Header
  output += 'ATTACKER → TARGET    │ ';
  actors.forEach(a => {
    output += `${a.shortName.padEnd(4)} │ `;
  });
  output += '\n';
  output += '─'.repeat(25 + actors.length * 8) + '\n';
  
  // Rows
  actors.forEach(attacker => {
    output += `${attacker.shortName.padEnd(20)} │ `;
    actors.forEach(target => {
      const attack = attacks.find(a => 
        a.source === attacker.id && a.target === target.id
      );
      if (attack) {
        const symbol = attack.intensity === 'high' ? '🔴' : 
                       attack.intensity === 'medium' ? '🟡' : '🟠';
        output += `${symbol}   │ `;
      } else {
        output += '    │ ';
      }
    });
    output += '\n';
  });
  
  output += '\n🔴 = High intensity  🟡 = Medium  🟠 = Ongoing\n';
  return output;
}

/**
 * Generate proxy network tree view
 */
export function generateProxyTree() {
  const axis = getAxisOfResistance();
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                  IRAN PROXY NETWORK (Axis of Resistance)             ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  output += `                    🇮🇷 IRAN (Master)\n`;
  output += `                    ├─ Military: $25B\n`;
  output += `                    ├─ Nuclear: Threshold (60%)\n`;
  output += `                    └─ Controls ${axis.proxies.length} proxy groups\n\n`;
  
  axis.proxies.forEach((proxy, idx) => {
    const isLast = idx === axis.proxies.length - 1;
    const branch = isLast ? '└' : '├';
    const rel = RELATIONSHIPS.find(r => 
      r.source === 'iran' && r.target === proxy.id
    );
    
    output += `                       ${branch}── ${proxy.flag} ${proxy.shortName}\n`;
    output += `                       ${isLast ? ' ' : '│'}   ├─ Location: ${proxy.region}\n`;
    if (rel?.annualFunding) {
      const funding = (rel.annualFunding / 1000000).toFixed(0);
      output += `                       ${isLast ? ' ' : '│'}   ├─ Funding: ~$${funding}M/year\n`;
    }
    if (rel?.supportTypes) {
      output += `                       ${isLast ? ' ' : '│'}   └─ Support: ${rel.supportTypes.join(', ')}\n`;
    }
    output += '\n';
  });
  
  return output;
}

/**
 * Generate alliance network
 */
export function generateAllianceNetwork() {
  const usCoalition = getUSCoalition();
  const alliances = getRelationshipsByType('alliance');
  
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                      US-LED SECURITY ALLIANCES                       ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  output += `                        🇺🇸 UNITED STATES\n`;
  output += `                        ├─ Military Budget: $886B\n`;
  output += `                        ├─ Nuclear: Armed\n`;
  output += `                        └─ ${usCoalition.allies.length} Major Allies\n\n`;
  
  usCoalition.allies.forEach((ally, idx) => {
    const isLast = idx === usCoalition.allies.length - 1;
    const branch = isLast ? '└' : '├';
    const rel = alliances.find(a => 
      a.source === 'united-states' && a.target === ally.id
    );
    
    output += `                           ${branch}── ${ally.flag} ${ally.shortName}\n`;
    if (rel?.strength) {
      const strength = rel.strength === 'strong' ? '★★★' : 
                       rel.strength === 'moderate' ? '★★☆' : '★☆☆';
      output += `                           ${isLast ? ' ' : '│'}   ├─ Strength: ${strength}\n`;
    }
    if (rel?.aspects) {
      const aspects = rel.aspects.slice(0, 2).join(', ');
      output += `                           ${isLast ? ' ' : '│'}   └─ ${aspects}\n`;
    }
    output += '\n';
  });
  
  return output;
}

/**
 * Generate stakes summary table
 */
export function generateStakesSummary() {
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                         WHAT\'S AT STAKE                              ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  Object.values(STAKES).forEach(stakeData => {
    const actor = getActor(stakeData.actorId);
    if (!actor) return;
    
    output += `${actor.flag} ${actor.name.toUpperCase()}\n`;
    output += `${actor.nuclearStatus === 'armed' ? '☢️ ' : '  '} `;
    output += `Nuclear: ${actor.nuclearStatus.toUpperCase()}\n`;
    output += `${stakeData.existentialRisk ? '⚠️ ' : '  '} `;
    output += `Existential Risk: ${stakeData.existentialRisk ? 'YES' : 'NO'}\n\n`;
    
    output += 'Primary Stakes:\n';
    stakeData.primaryStakes.forEach((stake, idx) => {
      const priority = stake.priority === 'critical' ? '🔴' :
                       stake.priority === 'high' ? '🟡' : '🟢';
      output += `  ${priority} ${stake.stake}\n`;
      output += `     ${stake.description}\n`;
    });
    
    output += `\n${'─'.repeat(70)}\n\n`;
  });
  
  return output;
}

/**
 * Generate attack summary by type
 */
export function generateAttackSummary() {
  const attacks = getRelationshipsByType('attacking');
  
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                       ACTIVE ATTACK SUMMARY                          ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  // Group by intensity
  const highIntensity = attacks.filter(a => a.intensity === 'high');
  const mediumIntensity = attacks.filter(a => a.intensity === 'medium');
  const ongoing = attacks.filter(a => a.intensity === 'ongoing');
  
  output += `🔴 HIGH INTENSITY ATTACKS (${highIntensity.length}):\n`;
  output += '─'.repeat(70) + '\n';
  highIntensity.forEach(attack => {
    const source = getActor(attack.source);
    const target = getActor(attack.target);
    output += `  ${source?.flag || ''} ${source?.shortName || attack.source} ──► `;
    output += `${target?.flag || ''} ${target?.shortName || attack.target}\n`;
    output += `     Types: ${attack.attackTypes?.join(', ')}\n`;
    output += `     Since: ${attack.since || 'unknown'}\n\n`;
  });
  
  if (mediumIntensity.length > 0) {
    output += `\n🟡 MEDIUM INTENSITY (${mediumIntensity.length}):\n`;
    output += '─'.repeat(70) + '\n';
    mediumIntensity.forEach(attack => {
      const source = getActor(attack.source);
      const target = getActor(attack.target);
      output += `  ${source?.flag || ''} ${source?.shortName || attack.source} ──► `;
      output += `${target?.flag || ''} ${target?.shortName || attack.target}\n`;
    });
  }
  
  return output;
}

/**
 * Generate conflict zone status board
 */
export function generateZoneStatusBoard() {
  let output = '\n╔══════════════════════════════════════════════════════════════════════╗\n';
  output +=    '║                      CONFLICT ZONE STATUS BOARD                      ║\n';
  output +=    '╠══════════════════════════════════════════════════════════════════════╣\n\n';
  
  CONFLICT_ZONES.forEach(zone => {
    const status = zone.currentStatus === 'active-combat' ? '🔴 ACTIVE COMBAT' :
                   zone.currentStatus === 'ongoing-tensions' ? '🟡 TENSIONS' : '🟢 STABLE';
    
    output += `${status}\n`;
    output += `  📍 ${zone.name}\n`;
    output += `  Type: ${zone.type}\n`;
    output += `  Actors: ${zone.actors.length} parties\n`;
    
    // Show actor flags
    const actorFlags = zone.actors
      .map(id => getActor(id)?.flag)
      .filter(Boolean)
      .join(' ');
    output += `  ${actorFlags}\n`;
    
    if (zone.recentEvents?.length > 0) {
      output += `  Recent: ${zone.recentEvents[0]}\n`;
    }
    
    output += '\n';
  });
  
  return output;
}

// ============================================================================
// JSON/DATA EXPORT FORMATS
// ============================================================================

/**
 * Generate D3.js compatible graph data
 */
export function generateD3GraphData() {
  const nodes = getAllActors().map(actor => ({
    id: actor.id,
    name: actor.name,
    shortName: actor.shortName,
    type: actor.type,
    category: actor.category,
    flag: actor.flag,
    group: actor.type === 'nation-state' ? 1 : 2,
    value: actor.militaryBudget ? Math.log10(actor.militaryBudget) : 5,
    nuclear: actor.nuclearStatus
  }));
  
  const links = RELATIONSHIPS.map(rel => ({
    source: rel.source,
    target: rel.target,
    type: rel.type,
    value: rel.intensity === 'high' ? 3 : 
           rel.intensity === 'medium' ? 2 : 1
  }));
  
  return { nodes, links };
}

/**
 * Generate GraphViz DOT format for diagram generation
 */
export function generateGraphVizDOT() {
  let dot = 'digraph ConflictMap {\n';
  dot += '  rankdir=LR;\n';
  dot += '  node [shape=box, style=filled];\n\n';
  
  // Define nodes with colors
  getAllActors().forEach(actor => {
    const color = actor.type === 'nation-state' ? 
                  (actor.nuclearStatus === 'armed' ? 'red' : 'lightblue') : 
                  'orange';
    dot += `  "${actor.id}" [label="${actor.flag} ${actor.shortName}", fillcolor=${color}];\n`;
  });
  
  dot += '\n';
  
  // Define edges
  RELATIONSHIPS.forEach(rel => {
    let color = 'gray';
    let style = 'solid';
    
    if (rel.type === 'attacking') {
      color = 'red';
      style = 'bold';
    } else if (rel.type === 'alliance') {
      color = 'blue';
    } else if (rel.type === 'proxy-master') {
      color = 'purple';
      style = 'dashed';
    }
    
    dot += `  "${rel.source}" -> "${rel.target}" [color=${color}, style=${style}];\n`;
  });
  
  dot += '}\n';
  return dot;
}

/**
 * Generate Mermaid diagram format
 */
export function generateMermaidDiagram() {
  let mermaid = '```mermaid\ngraph LR\n\n';
  
  // Node definitions
  getAllActors().forEach(actor => {
    mermaid += `    ${actor.id}["${actor.flag} ${actor.shortName}"]\n`;
  });
  
  mermaid += '\n';
  
  // Relationships
  RELATIONSHIPS.forEach(rel => {
    let arrow = '-->';
    let label = '';
    
    if (rel.type === 'attacking') {
      arrow = '==>';
      label = `|attacks|`;
    } else if (rel.type === 'alliance') {
      arrow = '-->';
      label = `|allied|`;
    } else if (rel.type === 'proxy-master') {
      arrow = '-.->';
      label = `|proxy|`;
    }
    
    mermaid += `    ${rel.source} ${arrow}${label} ${rel.target}\n`;
  });
  
  mermaid += '\n    %% Styling\n';
  mermaid += '    classDef nuclear fill:#f96;\n';
  mermaid += '    classDef proxy fill:#9f6;\n';
  
  mermaid += '```\n';
  return mermaid;
}

/**
 * Generate CSV for spreadsheet import
 */
export function generateAttacksCSV() {
  const attacks = getRelationshipsByType('attacking');
  
  let csv = 'Source,Target,Attack Types,Intensity,Since,Description\n';
  
  attacks.forEach(attack => {
    const source = getActor(attack.source)?.name || attack.source;
    const target = getActor(attack.target)?.name || attack.target;
    const types = attack.attackTypes?.join(';') || '';
    
    csv += `"${source}","${target}","${types}",${attack.intensity},${attack.since || ''},"${attack.description || ''}"\n`;
  });
  
  return csv;
}

// ============================================================================
// FULL REPORT GENERATOR
// ============================================================================

/**
 * Generate complete text report
 */
export function generateFullReport() {
  let report = '\n';
  report += '╔══════════════════════════════════════════════════════════════════════╗\n';
  report += '║                                                                      ║\n';
  report += '║       MIDDLE EAST / SOUTH ASIA CONFLICT RELATIONSHIP REPORT         ║\n';
  report += '║                                                                      ║\n';
  report += '║                    Generated: March 17, 2026                        ║\n';
  report += '║                                                                      ║\n';
  report += '╚══════════════════════════════════════════════════════════════════════╝\n';
  
  report += '\n' + generateConflictMatrix();
  report += '\n' + generateProxyTree();
  report += '\n' + generateAllianceNetwork();
  report += '\n' + generateAttackSummary();
  report += '\n' + generateZoneStatusBoard();
  report += '\n' + generateStakesSummary();
  
  return report;
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Text generators
  generateConflictMatrix,
  generateProxyTree,
  generateAllianceNetwork,
  generateStakesSummary,
  generateAttackSummary,
  generateZoneStatusBoard,
  generateFullReport,
  
  // Data format generators
  generateD3GraphData,
  generateGraphVizDOT,
  generateMermaidDiagram,
  generateAttacksCSV
};

// If running directly, print report
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(generateFullReport());
}
