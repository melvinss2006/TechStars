/**
 * Habitat Zone Definitions & NASA-STD-3001 Guidelines
 * Styled with reference pastel tones & high-contrast aerospace accents
 */

export const ROOM_TYPES = {
  SLEEPING: {
    id: 'SLEEPING',
    name: 'Sleep',
    fullName: 'Crew Sleep Quarters',
    category: 'Habitability',
    color: '#6366f1', // Indigo / Lavender
    lightBg: 'bg-[#EEF2FF] border-[#6366f1] text-[#312E81]',
    darkBg: 'dark:bg-[#1e1b4b]/80 dark:border-[#818cf8] dark:text-[#e0e7ff]',
    chipBg: 'bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] border-[#C7D2FE]',
    minAreaPerCrew: 4.0, // m²
    baseMinArea: 6.0,
    noiseLevel: 'QUIET',
    noiseTolerance: 'SENSITIVE',
    evacuationPriority: 1,
    icon: 'Moon',
    description: 'Private crew sleep compartment with acoustic isolation (NASA-STD-3001 Sec 7.2.1).'
  },
  EXERCISE: {
    id: 'EXERCISE',
    name: 'Exercise',
    fullName: 'Exercise & Countermeasures',
    category: 'Health & Fitness',
    color: '#f43f5e', // Coral / Rose
    lightBg: 'bg-[#FFF1F2] border-[#f43f5e] text-[#881337]',
    darkBg: 'dark:bg-[#4c0519]/80 dark:border-[#fb7185] dark:text-[#ffe4e6]',
    chipBg: 'bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]',
    minAreaPerCrew: 1.5,
    baseMinArea: 10.0,
    noiseLevel: 'HIGH',
    noiseTolerance: 'IMMUNE',
    evacuationPriority: 2,
    icon: 'Activity',
    description: 'Resistive gym and cycle ergometer. High noise and vibration source (NASA-STD-3001 Sec 6.3).'
  },
  HYGIENE: {
    id: 'HYGIENE',
    name: 'Hygiene',
    fullName: 'Personal Hygiene & Waste',
    category: 'Sanitation',
    color: '#0d9488', // Teal / Mint
    lightBg: 'bg-[#F0FDFA] border-[#0d9488] text-[#134E4A]',
    darkBg: 'dark:bg-[#042f2e]/80 dark:border-[#2dd4bf] dark:text-[#ccfbf1]',
    chipBg: 'bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
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
    name: 'Food',
    fullName: 'Food Prep & Wardroom',
    category: 'Nutrition & Social',
    color: '#d97706', // Warm Amber / Honey
    lightBg: 'bg-[#FEFCE8] border-[#d97706] text-[#713F12]',
    darkBg: 'dark:bg-[#451a03]/80 dark:border-[#fbbf24] dark:text-[#fef3c7]',
    chipBg: 'bg-[#FEFCE8] hover:bg-[#FEF08A] text-[#B45309] border-[#FDE047]',
    minAreaPerCrew: 2.0,
    baseMinArea: 10.0,
    noiseLevel: 'MODERATE_HIGH',
    noiseTolerance: 'MODERATE',
    evacuationPriority: 2,
    icon: 'Utensils',
    description: 'Food preparation, hydration, and communal wardroom dining space (NASA-STD-3001 Sec 7.1).'
  },
  WORK: {
    id: 'WORK',
    name: 'Work',
    fullName: 'Workstation / Lab',
    category: 'Operations',
    color: '#2563eb', // Clean Blue
    lightBg: 'bg-[#EFF6FF] border-[#2563eb] text-[#1E3A8A]',
    darkBg: 'dark:bg-[#172554]/80 dark:border-[#60a5fa] dark:text-[#dbeafe]',
    chipBg: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
    minAreaPerCrew: 2.0,
    baseMinArea: 12.0,
    noiseLevel: 'MODERATE',
    noiseTolerance: 'MODERATE',
    evacuationPriority: 2,
    icon: 'Cpu',
    description: 'Science rack payloads, robotics workstation, mission ops console (NASA-STD-3001 Sec 8.2).'
  },
  MEDICAL: {
    id: 'MEDICAL',
    name: 'Medical',
    fullName: 'Medical & Telemedicine',
    category: 'Health & Safety',
    color: '#ec4899', // Pink
    lightBg: 'bg-[#FDF2F8] border-[#ec4899] text-[#831843]',
    darkBg: 'dark:bg-[#500724]/80 dark:border-[#f472b6] dark:text-[#fce7f3]',
    chipBg: 'bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#BE185D] border-[#FBCFE8]',
    minAreaPerCrew: 1.0,
    baseMinArea: 10.0,
    noiseLevel: 'QUIET',
    noiseTolerance: 'SENSITIVE',
    evacuationPriority: 1,
    icon: 'HeartPulse',
    description: 'Crew medical restraint system, diagnostic kits and telemedicine suite (NASA-STD-3001 Sec 6.1).'
  },
  STORAGE: {
    id: 'STORAGE',
    name: 'Storage',
    fullName: 'Logistics & ECLSS Storage',
    category: 'Life Support',
    color: '#64748b', // Slate / Gray
    lightBg: 'bg-[#F8FAFC] border-[#64748b] text-[#334155]',
    darkBg: 'dark:bg-[#1e293b]/80 dark:border-[#94a3b8] dark:text-[#e2e8f0]',
    chipBg: 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    minAreaPerCrew: 2.0,
    baseMinArea: 8.0,
    noiseLevel: 'QUIET',
    noiseTolerance: 'IMMUNE',
    evacuationPriority: 3,
    icon: 'Boxes',
    description: 'Spare parts, ECLSS consumables and logistics. Prime acoustic sound buffer.'
  },
  AIRLOCK: {
    id: 'AIRLOCK',
    name: 'Airlock',
    fullName: 'Surface EVA Airlock',
    category: 'Emergency & EVA',
    color: '#8b5cf6', // Violet
    lightBg: 'bg-[#FAF5FF] border-[#8b5cf6] text-[#581C87]',
    darkBg: 'dark:bg-[#2e1065]/80 dark:border-[#a78bfa] dark:text-[#ede9fe]',
    chipBg: 'bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#6D28D9] border-[#DDD6FE]',
    minAreaPerCrew: 0.5,
    baseMinArea: 6.0,
    noiseLevel: 'MODERATE',
    noiseTolerance: 'IMMUNE',
    isExit: true,
    evacuationPriority: 0,
    icon: 'DoorOpen',
    description: 'EVA suit donning, depressurization chamber and emergency evacuation exit.'
  },
  CORRIDOR: {
    id: 'CORRIDOR',
    name: 'Corridor',
    fullName: 'Spine Corridor',
    category: 'Passage',
    color: '#94a3b8',
    lightBg: 'bg-[#F1F5F9] border-dashed border-[#94a3b8] text-[#475569]',
    darkBg: 'dark:bg-[#0f172a]/70 dark:border-dashed dark:border-[#64748b] dark:text-[#cbd5e1]',
    chipBg: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border-[#CBD5E1]',
    minAreaPerCrew: 0,
    baseMinArea: 4.0,
    noiseLevel: 'PASSIVE',
    noiseTolerance: 'IMMUNE',
    isPassage: true,
    evacuationPriority: 0,
    icon: 'Footprints',
    description: 'Inter-module circulation spine providing direct egress corridors.'
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
    reason: 'Exercise module shares a bulkhead with Crew Sleep Quarters.',
    explanation: 'Acoustic emissions from resistive gym equipment exceed NC-32 sleep limits by >25 dB, causing chronic sleep deprivation.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.2.1 (Acoustic Limits in Crew Rest Zones)',
    fixSuggestion: 'Separate Exercise and Sleep with a Corridor or Storage buffer zone.'
  },
  {
    typeA: 'HYGIENE',
    typeB: 'GALLEY',
    severity: 'HIGH',
    penalty: 15,
    ruleId: 'ADJ-002',
    name: 'Cross-Contamination Hazard',
    reason: 'Hygiene & waste facility directly borders Food prep / Galley.',
    explanation: 'Microbial bio-aerosols from waste management pose a direct food contamination hazard in confined habitats.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.3.2 (Cross-Contamination & Waste Isolation)',
    fixSuggestion: 'Relocate Hygiene away from Food, ensuring an intermediate buffer compartment.'
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
    reason: 'Food & Dining area is directly adjacent to Sleeping Quarters.',
    explanation: 'Food heating odors, galley conversation, and meal schedules disrupt off-duty sleeping shifts.',
    reference: 'NASA-STD-3001 Vol 2, Sec 7.1.3 (Food Preparation Isolation)',
    fixSuggestion: 'Position Food between Work and Storage zones, away from sleeping bunks.'
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
