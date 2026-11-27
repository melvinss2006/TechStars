/**
 * Habitat Zone Definitions & NASA-STD-3001 Guidelines
 */

export const ROOM_TYPES = {
  SLEEPING: {
    id: 'SLEEPING',
    name: 'Crew Quarters',
    category: 'Habitability',
    color: '#3b82f6', // blue
    bgClass: 'bg-blue-500/15 border-blue-500 text-blue-950 dark:bg-blue-500/20 dark:text-blue-200',
    headerBg: 'bg-blue-600',
    minAreaPerCrew: 4.0, // m²
    baseMinArea: 6.0,
    noiseLevel: 'QUIET', // NC-32 / ~40 dB
    noiseTolerance: 'SENSITIVE', // Cannot tolerate loud neighbors
    evacuationPriority: 1,
    icon: 'Moon',
    description: 'Private crew sleep compartment with acoustic isolation (NASA-STD-3001 Sec 7.2.1).'
  },
  HYGIENE: {
    id: 'HYGIENE',
    name: 'Personal Hygiene / Waste',
    category: 'Sanitation',
    color: '#06b6d4', // cyan
    bgClass: 'bg-cyan-500/15 border-cyan-500 text-cyan-950 dark:bg-cyan-500/20 dark:text-cyan-200',
    headerBg: 'bg-cyan-600',
    minAreaPerCrew: 1.0,
    baseMinArea: 4.0,
    noiseLevel: 'MODERATE',
    noiseTolerance: 'MODERATE',
    evacuationPriority: 2,
    icon: 'Droplets',
    description: 'Sanitation, body cleansing and waste management compartment (NASA-STD-3001 Sec 7.3).'
  },
  GALLEY: {
    id: 'GALLEY',
    name: 'Galley & Wardroom',
    category: 'Nutrition & Social',
    color: '#f59e0b', // amber
    bgClass: 'bg-amber-500/15 border-amber-500 text-amber-950 dark:bg-amber-500/20 dark:text-amber-200',
    headerBg: 'bg-amber-600',
    minAreaPerCrew: 2.0,
    baseMinArea: 10.0,
    noiseLevel: 'MODERATE_HIGH',
    noiseTolerance: 'MODERATE',
    evacuationPriority: 2,
    icon: 'Utensils',
    description: 'Food preparation, storage, hydration and communal dining space (NASA-STD-3001 Sec 7.1).'
  },
  EXERCISE: {
    id: 'EXERCISE',
    name: 'Exercise & Countermeasures',
    category: 'Health & Fitness',
    color: '#ef4444', // red
    bgClass: 'bg-red-500/15 border-red-500 text-red-950 dark:bg-red-500/20 dark:text-red-200',
    headerBg: 'bg-red-600',
    minAreaPerCrew: 1.5,
    baseMinArea: 10.0,
    noiseLevel: 'HIGH', // NC-60+ vibration & acoustic impact
    noiseTolerance: 'IMMUNE',
    evacuationPriority: 2,
    icon: 'Activity',
    description: 'ARED resistance device and cycle ergometer. High vibration and noise source (NASA-STD-3001 Sec 6.3).'
  },
  MEDICAL: {
    id: 'MEDICAL',
    name: 'Medical & Telemedicine',
    category: 'Health & Safety',
    color: '#10b981', // emerald
    bgClass: 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:bg-emerald-500/20 dark:text-emerald-200',
    headerBg: 'bg-emerald-600',
    minAreaPerCrew: 1.0,
    baseMinArea: 10.0,
    noiseLevel: 'QUIET',
    noiseTolerance: 'SENSITIVE',
    evacuationPriority: 1,
    icon: 'HeartPulse',
    description: 'Crew medical restraint system, surgical diagnostic kits and telemedicine suite (NASA-STD-3001 Sec 6.1).'
  },
  WORK: {
    id: 'WORK',
    name: 'Workstation / Lab',
    category: 'Operations',
    color: '#8b5cf6', // purple
    bgClass: 'bg-purple-500/15 border-purple-500 text-purple-950 dark:bg-purple-500/20 dark:text-purple-200',
    headerBg: 'bg-purple-600',
    minAreaPerCrew: 2.0,
    baseMinArea: 12.0,
    noiseLevel: 'MODERATE',
    noiseTolerance: 'MODERATE',
    evacuationPriority: 2,
    icon: 'Cpu',
    description: 'Science rack payloads, robotics workstation, mission ops console (NASA-STD-3001 Sec 8.2).'
  },
  STORAGE: {
    id: 'STORAGE',
    name: 'Logistics & ECLSS Storage',
    category: 'Life Support',
    color: '#64748b', // slate
    bgClass: 'bg-slate-500/15 border-slate-500 text-slate-900 dark:bg-slate-500/20 dark:text-slate-200',
    headerBg: 'bg-slate-600',
    minAreaPerCrew: 2.0,
    baseMinArea: 8.0,
    noiseLevel: 'QUIET',
    noiseTolerance: 'IMMUNE',
    evacuationPriority: 3,
    icon: 'Boxes',
    description: 'Spare parts, ECLSS consumables and dry stowage. Serves as prime acoustic buffer.'
  },
  AIRLOCK: {
    id: 'AIRLOCK',
    name: 'Airlock / Surface Exit',
    category: 'Emergency & EVA',
    color: '#ec4899', // pink
    bgClass: 'bg-pink-500/15 border-pink-500 text-pink-950 dark:bg-pink-500/20 dark:text-pink-200',
    headerBg: 'bg-pink-600',
    minAreaPerCrew: 0.5,
    baseMinArea: 6.0,
    noiseLevel: 'MODERATE',
    noiseTolerance: 'IMMUNE',
    isExit: true,
    evacuationPriority: 0,
    icon: 'DoorOpen',
    description: 'EVA suit donning, depressurization lock and emergency evacuation portal (NASA-STD-3001 Sec 8.4).'
  },
  CORRIDOR: {
    id: 'CORRIDOR',
    name: 'Corridor / Circulation',
    category: 'Passage',
    color: '#475569',
    bgClass: 'bg-slate-300/40 border-dashed border-slate-500 text-slate-800 dark:bg-slate-700/30 dark:text-slate-300',
    headerBg: 'bg-slate-700',
    minAreaPerCrew: 0,
    baseMinArea: 4.0,
    noiseLevel: 'PASSIVE',
    noiseTolerance: 'IMMUNE',
    isPassage: true,
    evacuationPriority: 0,
    icon: 'Footprints',
    description: 'Inter-module circulation spine providing direct unhindered egress corridors.'
  }
};

/**
 * Adjacency conflict rules matrix
 */
export const ADJACENCY_RULES = [
  {
    typeA: 'EXERCISE',
    typeB: 'SLEEPING',
    severity: 'CRITICAL',
    penalty: 20,
    ruleId: 'ADJ-001',
    name: 'Acoustic Shock Violation',
    reason: 'Exercise module shares a bulkhead with Crew Sleeping Quarters.',
    explanation: 'Acoustic emissions from resistive gym equipment (ARED/T2) exceed NC-32 sleep limits by >25 dB, causing chronic sleep deprivation.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.2.1 (Acoustic Limits in Crew Rest Zones)',
    fixSuggestion: 'Separate Exercise and Sleeping with a Corridor or Storage buffer zone.'
  },
  {
    typeA: 'HYGIENE',
    typeB: 'GALLEY',
    severity: 'HIGH',
    penalty: 15,
    ruleId: 'ADJ-002',
    name: 'Cross-Contamination Hazard',
    reason: 'Hygiene/Waste facility directly borders Galley & Food Preparation.',
    explanation: 'Microbial bio-aerosols from waste management pose a direct food contamination hazard in microgravity/confined habitats.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.3.2 (Cross-Contamination & Waste Isolation)',
    fixSuggestion: 'Relocate Hygiene away from food prep, ensuring at least one intermediate buffer compartment.'
  },
  {
    typeA: 'EXERCISE',
    typeB: 'MEDICAL',
    severity: 'MEDIUM',
    penalty: 10,
    ruleId: 'ADJ-003',
    name: 'Vibrational Diagnostic Interference',
    reason: 'Medical station is adjacent to high-vibration Exercise equipment.',
    explanation: 'Vibrations degrade telemetry diagnostics, micro-surgery capabilities, and patient rest environment.',
    reference: 'NASA-STD-3001 Vol 2, Sec 6.1.4 (Medical Facility Stability)',
    fixSuggestion: 'Move Medical station adjacent to quiet areas or Life Support storage.'
  },
  {
    typeA: 'GALLEY',
    typeB: 'SLEEPING',
    severity: 'MEDIUM',
    penalty: 8,
    ruleId: 'ADJ-004',
    name: 'Olfactory & Social Disruption',
    reason: 'Galley / Wardroom is directly adjacent to Sleeping Quarters.',
    explanation: 'Food heating odors, galley conversation, and meal schedules disrupt off-duty sleeping shifts.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.1.3 (Food Preparation Isolation)',
    fixSuggestion: 'Position Galley between Work and Storage zones, away from sleeping bunks.'
  }
];

export const MISSION_PROFILES = [
  {
    id: 'lunar_surface',
    name: 'Lunar Surface Alpha Base',
    gravity: '0.166g',
    defaultCrew: 4,
    recommendedTotalArea: 80,
    description: 'Long-duration lunar surface outpost (Artemis Program architecture).'
  },
  {
    id: 'mars_transit',
    name: 'Mars Transit Deep Space Hab',
    gravity: 'Microgravity (0g)',
    defaultCrew: 6,
    recommendedTotalArea: 120,
    description: 'Deep space transit vehicle for 3-year Earth-Mars round-trip voyage.'
  },
  {
    id: 'orbital_station',
    name: 'Commercial LEO Station',
    gravity: 'Microgravity (0g)',
    defaultCrew: 4,
    recommendedTotalArea: 65,
    description: 'Commercial microgravity science station in Low Earth Orbit.'
  }
];
