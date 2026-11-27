/**
 * Preset Layouts for Demo & Comparison
 * Grid is based on 1 grid unit = 1 meter
 */

export const PRESET_LAYOUTS = [
  {
    id: 'reference_optimal',
    name: '1. Mission Ready Habitat (Reference)',
    tagline: 'Balanced, compliant layout matching reference architecture',
    missionProfile: 'lunar_surface',
    crewSize: 4,
    durationDays: 180,
    habitatShape: 'cylinder',
    description: 'Optimal zoning: Quiet sleep isolated from exercise, hygiene buffered from food prep, dual redundant airlocks at port and starboard collars.',
    rooms: [
      {
        id: 'room-sleep',
        type: 'SLEEPING',
        name: 'Sleep',
        x: 3,
        y: 2,
        w: 9,
        h: 4, // 36 m²
      },
      {
        id: 'room-work',
        type: 'WORK',
        name: 'Work',
        x: 12,
        y: 2,
        w: 9,
        h: 4, // 36 m²
      },
      {
        id: 'room-food',
        type: 'GALLEY',
        name: 'Food',
        x: 21,
        y: 2,
        w: 6,
        h: 4, // 24 m²
      },
      {
        id: 'room-hygiene',
        type: 'HYGIENE',
        name: 'Hygiene',
        x: 3,
        y: 6,
        w: 6,
        h: 4, // 24 m²
      },
      {
        id: 'room-med',
        type: 'MEDICAL',
        name: 'Medical',
        x: 9,
        y: 6,
        w: 6,
        h: 4, // 24 m²
      },
      {
        id: 'room-storage',
        type: 'STORAGE',
        name: 'Storage',
        x: 15,
        y: 6,
        w: 6,
        h: 4, // 24 m²
      },
      {
        id: 'room-exercise',
        type: 'EXERCISE',
        name: 'Exercise',
        x: 21,
        y: 6,
        w: 6,
        h: 4, // 24 m²
      },
      {
        id: 'room-port-airlock',
        type: 'AIRLOCK',
        name: 'Port Airlock',
        x: 1,
        y: 4,
        w: 2,
        h: 4, // Port egress hatch
      },
      {
        id: 'room-stbd-airlock',
        type: 'AIRLOCK',
        name: 'Stbd Airlock',
        x: 27,
        y: 4,
        w: 2,
        h: 4, // Starboard egress hatch
      }
    ]
  },
  {
    id: 'lunar_flawed',
    name: '2. Lunar Alpha (Flawed Demo)',
    tagline: 'Demonstrates manual planning mistakes flagged by SW-4',
    missionProfile: 'lunar_surface',
    crewSize: 4,
    durationDays: 180,
    habitatShape: 'cylinder',
    description: 'Contains severe acoustic violation (Gym next to Sleep), contamination hazard (Hygiene next to Galley), undersized Medical room, and an isolated room with no exit route.',
    rooms: [
      {
        id: 'room-1',
        type: 'SLEEPING',
        name: 'Sleep Quarters',
        x: 3,
        y: 2,
        w: 7,
        h: 4,
      },
      {
        id: 'room-2',
        type: 'EXERCISE',
        name: 'Exercise / Gym',
        x: 10,
        y: 2,
        w: 6,
        h: 4, // SHARING WALL WITH SLEEPING! (Acoustic violation)
      },
      {
        id: 'room-3',
        type: 'HYGIENE',
        name: 'Hygiene & Waste',
        x: 3,
        y: 6,
        w: 5,
        h: 4,
      },
      {
        id: 'room-4',
        type: 'GALLEY',
        name: 'Food & Mess',
        x: 8,
        y: 6,
        w: 7,
        h: 4, // DIRECTLY ADJACENT TO HYGIENE! (Contamination violation)
      },
      {
        id: 'room-5',
        type: 'MEDICAL',
        name: 'Medical Bay',
        x: 17,
        y: 2,
        w: 3,
        h: 2, // UNDERSIZED! (Only 6 m²)
      },
      {
        id: 'room-6',
        type: 'AIRLOCK',
        name: 'EVA Surface Airlock',
        x: 25,
        y: 4,
        w: 3,
        h: 4,
      },
      {
        id: 'room-7',
        type: 'WORK',
        name: 'Science Lab',
        x: 17,
        y: 6,
        w: 6,
        h: 4, // Trapped / no connection to exit!
      }
    ]
  },
  {
    id: 'mars_transit_6crew',
    name: '3. Mars Transit Vehicle (6-Crew Hab)',
    tagline: 'Deep space 1000-day mission layout with dual egress paths',
    missionProfile: 'mars_transit',
    crewSize: 6,
    durationDays: 1000,
    habitatShape: 'ring',
    description: 'Engineered for a 3-year deep space trajectory. Features dual emergency airlocks, redundant life support, and acoustic isolation rings.',
    rooms: [
      {
        id: 'room-201',
        type: 'AIRLOCK',
        name: 'Port Airlock',
        x: 1,
        y: 4,
        w: 3,
        h: 4,
      },
      {
        id: 'room-202',
        type: 'SLEEPING',
        name: 'Sleep Pods Port',
        x: 4,
        y: 2,
        w: 8,
        h: 4,
      },
      {
        id: 'room-203',
        type: 'HYGIENE',
        name: 'Hygiene Station',
        x: 12,
        y: 2,
        w: 5,
        h: 4,
      },
      {
        id: 'room-204',
        type: 'SLEEPING',
        name: 'Sleep Pods Stbd',
        x: 17,
        y: 2,
        w: 8,
        h: 4,
      },
      {
        id: 'room-206',
        type: 'GALLEY',
        name: 'Food & Wardroom',
        x: 4,
        y: 6,
        w: 7,
        h: 4,
      },
      {
        id: 'room-207',
        type: 'STORAGE',
        name: 'Logistics Storage',
        x: 11,
        y: 6,
        w: 6,
        h: 4,
      },
      {
        id: 'room-208',
        type: 'EXERCISE',
        name: 'Exercise Gym',
        x: 17,
        y: 6,
        w: 8,
        h: 4,
      },
      {
        id: 'room-209',
        type: 'AIRLOCK',
        name: 'Stbd Airlock',
        x: 25,
        y: 4,
        w: 3,
        h: 4,
      }
    ]
  }
];
