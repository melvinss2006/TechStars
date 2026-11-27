/**
 * Preset Layouts for Demo & Comparison
 * Grid is based on 1 grid unit = 1 meter
 */

export const PRESET_LAYOUTS = [
  {
    id: 'lunar_flawed',
    name: '1. Lunar Alpha (Flawed Demo)',
    tagline: 'Demonstrates manual planning mistakes flagged by SW-4',
    missionProfile: 'lunar_surface',
    crewSize: 4,
    description: 'Contains severe acoustic violation (Gym next to Sleep), contamination hazard (Hygiene next to Galley), undersized Medical room, and an isolated room with no exit route.',
    rooms: [
      {
        id: 'room-1',
        type: 'SLEEPING',
        name: 'Crew Quarters A',
        x: 2,
        y: 2,
        w: 4,
        h: 3, // 12 m²
      },
      {
        id: 'room-2',
        type: 'EXERCISE',
        name: 'Gym / Countermeasures',
        x: 6,
        y: 2,
        w: 4,
        h: 3, // 12 m² - SHARING WALL WITH SLEEPING! (Acoustic violation)
      },
      {
        id: 'room-3',
        type: 'HYGIENE',
        name: 'Hygiene & Waste',
        x: 2,
        y: 6,
        w: 3,
        h: 3, // 9 m²
      },
      {
        id: 'room-4',
        type: 'GALLEY',
        name: 'Galley & Mess',
        x: 5,
        y: 6,
        w: 5,
        h: 3, // 15 m² - DIRECTLY ADJACENT TO HYGIENE! (Contamination violation)
      },
      {
        id: 'room-5',
        type: 'MEDICAL',
        name: 'Medical Bay',
        x: 11,
        y: 2,
        w: 2,
        h: 3, // 6 m² - UNDERSIZED! (Needs min 10 m² for crew of 4)
      },
      {
        id: 'room-6',
        type: 'AIRLOCK',
        name: 'EVA Surface Airlock',
        x: 15,
        y: 6,
        w: 3,
        h: 3, // 9 m²
      },
      {
        id: 'room-7',
        type: 'WORK',
        name: 'Science & Geology Lab',
        x: 2,
        y: 11,
        w: 4,
        h: 3, // 12 m² - ISOLATED! No connection or corridor to the Airlock!
      }
    ]
  },
  {
    id: 'lunar_optimized',
    name: '2. Lunar Alpha (NASA-STD-3001 Compliant)',
    tagline: 'Optimized layout with sound buffers and verified egress',
    missionProfile: 'lunar_surface',
    crewSize: 4,
    description: 'Fully compliant habitat: Central spine corridor, Storage buffer between Exercise and Sleep, separated Hygiene and Galley, direct egress to Airlock.',
    rooms: [
      {
        id: 'room-101',
        type: 'SLEEPING',
        name: 'Crew Quarters A',
        x: 2,
        y: 2,
        w: 5,
        h: 3, // 15 m²
      },
      {
        id: 'room-102',
        type: 'HYGIENE',
        name: 'Crew Hygiene & Sanitation',
        x: 7,
        y: 2,
        w: 3,
        h: 3, // 9 m²
      },
      {
        id: 'room-103',
        type: 'STORAGE',
        name: 'Acoustic Buffer & ECLSS Storage',
        x: 10,
        y: 2,
        w: 4,
        h: 3, // 12 m² - BUFFERS NOISY GYM!
      },
      {
        id: 'room-104',
        type: 'EXERCISE',
        name: 'Exercise & Vibration Iso Gym',
        x: 14,
        y: 2,
        w: 4,
        h: 3, // 12 m²
      },
      {
        id: 'room-105',
        type: 'CORRIDOR',
        name: 'Central Avionics Corridor',
        x: 2,
        y: 5,
        w: 16,
        h: 2, // 32 m² central artery connecting all modules
      },
      {
        id: 'room-106',
        type: 'GALLEY',
        name: 'Galley & Wardroom',
        x: 2,
        y: 7,
        w: 5,
        h: 4, // 20 m²
      },
      {
        id: 'room-107',
        type: 'WORK',
        name: 'Mission Ops & Science Lab',
        x: 7,
        y: 7,
        w: 5,
        h: 4, // 20 m²
      },
      {
        id: 'room-108',
        type: 'MEDICAL',
        name: 'Medical & Telemedicine Bay',
        x: 12,
        y: 7,
        w: 4,
        h: 4, // 16 m² - compliant!
      },
      {
        id: 'room-109',
        type: 'AIRLOCK',
        name: 'Surface EVA Airlock',
        x: 16,
        y: 7,
        w: 3,
        h: 4, // 12 m² - directly adjacent to corridor & medical!
      }
    ]
  },
  {
    id: 'mars_transit_6crew',
    name: '3. Mars Transit Vehicle (6-Crew Habitat)',
    tagline: 'Deep space 1000-day mission layout with dual egress paths',
    missionProfile: 'mars_transit',
    crewSize: 6,
    description: 'Engineered for a 3-year deep space trajectory. Features dual emergency airlocks, redundant life support, and acoustic isolation rings.',
    rooms: [
      {
        id: 'room-201',
        type: 'AIRLOCK',
        name: 'Port EVA Airlock',
        x: 1,
        y: 5,
        w: 3,
        h: 3,
      },
      {
        id: 'room-202',
        type: 'SLEEPING',
        name: 'Crew Pods 1-3 (Port)',
        x: 4,
        y: 2,
        w: 6,
        h: 3,
      },
      {
        id: 'room-203',
        type: 'HYGIENE',
        name: 'Sanitation Station',
        x: 10,
        y: 2,
        w: 3,
        h: 3,
      },
      {
        id: 'room-204',
        type: 'SLEEPING',
        name: 'Crew Pods 4-6 (Starboard)',
        x: 13,
        y: 2,
        w: 6,
        h: 3,
      },
      {
        id: 'room-205',
        type: 'CORRIDOR',
        name: 'Main Hab Spine Corridor',
        x: 4,
        y: 5,
        w: 15,
        h: 2,
      },
      {
        id: 'room-206',
        type: 'GALLEY',
        name: 'Deep Space Wardroom & Galley',
        x: 4,
        y: 7,
        w: 6,
        h: 4,
      },
      {
        id: 'room-207',
        type: 'STORAGE',
        name: 'Acoustic Logistics Bay',
        x: 10,
        y: 7,
        w: 4,
        h: 4,
      },
      {
        id: 'room-208',
        type: 'EXERCISE',
        name: 'Zero-G Countermeasures Facility',
        x: 14,
        y: 7,
        w: 5,
        h: 4,
      },
      {
        id: 'room-209',
        type: 'AIRLOCK',
        name: 'Starboard Emergency Hatch',
        x: 19,
        y: 5,
        w: 3,
        h: 3,
      }
    ]
  }
];
