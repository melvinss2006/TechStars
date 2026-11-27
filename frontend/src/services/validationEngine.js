import { ROOM_TYPES, ADJACENCY_RULES, MISSION_PROFILES } from '../constants/habitatRules';

/**
 * Geometric check: Are two rooms sharing a boundary (wall touch)?
 */
export function areRoomsAdjacent(roomA, roomB) {
  const ax1 = roomA.x;
  const ay1 = roomA.y;
  const ax2 = roomA.x + roomA.w;
  const ay2 = roomA.y + roomA.h;

  const bx1 = roomB.x;
  const by1 = roomB.y;
  const bx2 = roomB.x + roomB.w;
  const by2 = roomB.y + roomB.h;

  // Check for overlap / collision
  const xOverlap = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
  const yOverlap = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));

  // If they intersect with area > 0, they collide
  const isColliding = xOverlap > 0 && yOverlap > 0;

  // Shared horizontal wall (A above B or B above A) with touching edge and overlap >= 1m
  const horizontalTouch = (ay2 === by1 || by2 === ay1) && xOverlap >= 1;

  // Shared vertical wall (A left of B or B left of A) with touching edge and overlap >= 1m
  const verticalTouch = (ax2 === bx1 || bx2 === ax1) && yOverlap >= 1;

  return {
    isAdjacent: horizontalTouch || verticalTouch || isColliding,
    isColliding,
    contactLength: horizontalTouch ? xOverlap : (verticalTouch ? yOverlap : (isColliding ? Math.min(xOverlap, yOverlap) : 0))
  };
}

/**
 * Build graph of room adjacency and run BFS to find evacuation routes to exits
 */
export function computeEvacuationGraph(rooms) {
  const adjacencyList = new Map();
  rooms.forEach(r => adjacencyList.set(r.id, []));

  // Connect adjacent rooms
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const adj = areRoomsAdjacent(rooms[i], rooms[j]);
      if (adj.isAdjacent) {
        adjacencyList.get(rooms[i].id).push(rooms[j].id);
        adjacencyList.get(rooms[j].id).push(rooms[i].id);
      }
    }
  }

  // Find all airlocks/exits
  const exitRooms = rooms.filter(r => ROOM_TYPES[r.type]?.isExit);
  const exitIds = new Set(exitRooms.map(r => r.id));

  const roomById = new Map(rooms.map(r => [r.id, r]));
  const evacuationPaths = {};
  const egressStatus = {}; // { [roomId]: { reachable: bool, distance: number, path: string[], nearestExitId: string } }

  rooms.forEach(startRoom => {
    if (exitIds.has(startRoom.id)) {
      egressStatus[startRoom.id] = {
        reachable: true,
        distance: 0,
        path: [startRoom.id],
        nearestExitId: startRoom.id
      };
      evacuationPaths[startRoom.id] = [startRoom];
      return;
    }

    // BFS to nearest exit
    const queue = [[startRoom.id]];
    const visited = new Set([startRoom.id]);
    let foundPath = null;

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentId = currentPath[currentPath.length - 1];

      if (exitIds.has(currentId)) {
        foundPath = currentPath;
        break;
      }

      const neighbors = adjacencyList.get(currentId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    if (foundPath) {
      // Calculate geometric distance through centroids
      let totalDist = 0;
      for (let i = 0; i < foundPath.length - 1; i++) {
        const rA = roomById.get(foundPath[i]);
        const rB = roomById.get(foundPath[i + 1]);
        const cAx = rA.x + rA.w / 2;
        const cAy = rA.y + rA.h / 2;
        const cBx = rB.x + rB.w / 2;
        const cBy = rB.y + rB.h / 2;
        totalDist += Math.hypot(cBx - cAx, cBy - cAy);
      }

      egressStatus[startRoom.id] = {
        reachable: true,
        hops: foundPath.length - 1,
        distance: Math.round(totalDist * 10) / 10,
        path: foundPath,
        nearestExitId: foundPath[foundPath.length - 1]
      };
      evacuationPaths[startRoom.id] = foundPath.map(id => roomById.get(id));
    } else {
      egressStatus[startRoom.id] = {
        reachable: false,
        hops: Infinity,
        distance: Infinity,
        path: [],
        nearestExitId: null
      };
      evacuationPaths[startRoom.id] = [];
    }
  });

  return {
    adjacencyList,
    egressStatus,
    evacuationPaths,
    hasExit: exitRooms.length > 0
  };
}

/**
 * Main Layout Validation Engine
 */
export function validateLayout(layout, crewSize = 4, missionProfileId = 'lunar_surface') {
  const rooms = layout.rooms || [];
  const issues = [];
  let spaceDeductions = 0;
  let adjacencyDeductions = 0;
  let egressDeductions = 0;
  let safetyDeductions = 0;

  const profile = MISSION_PROFILES.find(p => p.id === missionProfileId) || MISSION_PROFILES[0];

  // 1. Check Collisions & Overlaps
  const collidedPairs = new Set();
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const roomA = rooms[i];
      const roomB = rooms[j];
      const adj = areRoomsAdjacent(roomA, roomB);

      if (adj.isColliding) {
        collidedPairs.add(`${roomA.id}_${roomB.id}`);
        safetyDeductions += 25;
        issues.push({
          id: `COLLISION_${roomA.id}_${roomB.id}`,
          category: 'Geometry',
          severity: 'CRITICAL',
          penalty: 25,
          title: `Compartment Overlap: ${roomA.name} & ${roomB.name}`,
          affectedRoomIds: [roomA.id, roomB.id],
          reason: `Physical bulkheads collide (${adj.contactLength}m overlap). Two physical modules cannot occupy identical coordinate space.`,
          reference: 'NASA-STD-3001 Vol 2, Sec 8.1 (Structural & Volumetric Allocation)',
          fixSuggestion: `Move or resize either ${roomA.name} or ${roomB.name} to eliminate overlap.`
        });
      }
    }
  }

  // 2. Check Space Allocation (Area vs Crew Size)
  let totalArea = 0;
  const roomTypeCounts = {};

  rooms.forEach(room => {
    const rDef = ROOM_TYPES[room.type] || {};
    const area = room.w * room.h;
    totalArea += area;
    roomTypeCounts[room.type] = (roomTypeCounts[room.type] || 0) + 1;

    // Minimum required area
    const minRequired = Math.max(
      rDef.baseMinArea || 6,
      Math.round((rDef.minAreaPerCrew || 1) * crewSize * 10) / 10
    );

    if (area < minRequired && !rDef.isPassage) {
      const deficit = (minRequired - area).toFixed(1);
      const penalty = Math.min(15, Math.ceil((minRequired - area) * 2.5));
      spaceDeductions += penalty;

      issues.push({
        id: `SPACE_${room.id}`,
        category: 'Space Allocation',
        severity: deficit > 4 ? 'HIGH' : 'MEDIUM',
        penalty,
        title: `Undersized Module: ${room.name}`,
        affectedRoomIds: [room.id],
        reason: `Current area is ${area} m², but NASA-STD-3001 requires at least ${minRequired} m² for a crew of ${crewSize}.`,
        reference: `NASA-STD-3001 Vol 2, Sec 7 (${rDef.category || 'Habitability'} Volume Requirements)`,
        fixSuggestion: `Enlarge ${room.name} by at least ${deficit} m² (e.g. increase dimensions by 1-2 grid units).`
      });
    }
  });

  // Overall habitat volume check
  if (totalArea < profile.recommendedTotalArea && rooms.length > 0) {
    const areaShortfall = profile.recommendedTotalArea - totalArea;
    const penalty = Math.min(10, Math.ceil(areaShortfall * 0.15));
    spaceDeductions += penalty;
    issues.push({
      id: 'TOTAL_HAB_AREA_LOW',
      category: 'Space Allocation',
      severity: 'LOW',
      penalty,
      title: 'Overall Habitable Space Below Mission Recommendation',
      affectedRoomIds: [],
      reason: `Total habitat area is ${totalArea} m², recommended for ${profile.name} is ${profile.recommendedTotalArea} m².`,
      reference: 'NASA Human Integration Design Handbook (HIDH) Vol 2',
      fixSuggestion: 'Add dedicated logistics/storage or expand crew communal areas.'
    });
  }

  // Missing essential rooms
  if (!roomTypeCounts['AIRLOCK']) {
    egressDeductions += 35;
    issues.push({
      id: 'MISSING_AIRLOCK',
      category: 'Emergency Egress',
      severity: 'CRITICAL',
      penalty: 35,
      title: 'Missing Surface Airlock / Emergency Exit',
      affectedRoomIds: [],
      reason: 'No Airlock or evacuation egress point is designated in this habitat layout.',
      reference: 'NASA-STD-3001 Vol 2, Sec 8.4 (Emergency Egress & EVA Access)',
      fixSuggestion: 'Place at least one AIRLOCK module with direct corridor or module connectivity.'
    });
  }

  if (!roomTypeCounts['SLEEPING']) {
    spaceDeductions += 15;
    issues.push({
      id: 'MISSING_SLEEPING',
      category: 'Space Allocation',
      severity: 'HIGH',
      penalty: 15,
      title: 'Missing Dedicated Sleeping Quarters',
      affectedRoomIds: [],
      reason: 'Crew requires private acoustic sleep compartments to maintain circadian rhythm.',
      reference: 'NASA-STD-3001 Vol 2, Sec 7.2',
      fixSuggestion: 'Add one or more Crew Quarters modules.'
    });
  }

  // 3. Adjacency & Noise Matrix Rules
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const roomA = rooms[i];
      const roomB = rooms[j];
      const adj = areRoomsAdjacent(roomA, roomB);

      if (adj.isAdjacent && !adj.isColliding) {
        // Find matching rule
        const rule = ADJACENCY_RULES.find(
          r => (r.typeA === roomA.type && r.typeB === roomB.type) ||
               (r.typeA === roomB.type && r.typeB === roomA.type)
        );

        if (rule) {
          adjacencyDeductions += rule.penalty;
          issues.push({
            id: `ADJ_${rule.ruleId}_${roomA.id}_${roomB.id}`,
            category: 'Adjacency & Noise',
            severity: rule.severity,
            penalty: rule.penalty,
            title: `${rule.name}: ${roomA.name} ↔ ${roomB.name}`,
            affectedRoomIds: [roomA.id, roomB.id],
            reason: rule.reason,
            explanation: rule.explanation,
            reference: rule.reference,
            fixSuggestion: rule.fixSuggestion
          });
        }
      }
    }
  }

  // 4. Access & Evacuation Path Check (BFS)
  const evacGraph = computeEvacuationGraph(rooms);

  if (evacGraph.hasExit) {
    rooms.forEach(room => {
      const status = evacGraph.egressStatus[room.id];
      if (!status || !status.reachable) {
        egressDeductions += 25;
        issues.push({
          id: `EGRESS_TRAP_${room.id}`,
          category: 'Emergency Egress',
          severity: 'CRITICAL',
          penalty: 25,
          title: `Evacuation Route Blocked: ${room.name}`,
          affectedRoomIds: [room.id],
          reason: `${room.name} has no reachable doorway or corridor path connecting it to an Airlock exit.`,
          reference: 'NASA-STD-3001 Vol 2, Sec 8.4.1 (Two-Path Redundant Egress Standard)',
          fixSuggestion: `Relocate ${room.name} to touch an existing corridor or another reachable compartment.`
        });
      } else if (status.distance > 22) {
        egressDeductions += 8;
        issues.push({
          id: `EGRESS_DISTANCE_${room.id}`,
          category: 'Emergency Egress',
          severity: 'MEDIUM',
          penalty: 8,
          title: `Excessive Evacuation Distance: ${room.name}`,
          affectedRoomIds: [room.id],
          reason: `Escape distance is ${status.distance}m (${status.hops} room transitions), exceeding rapid depressurization limits.`,
          reference: 'NASA Human Integration Design Handbook, Sec 8.4',
          fixSuggestion: 'Create a direct corridor link or position closer to an airlock.'
        });
      }
    });
  }

  // 5. Calculate Weighted Score
  // Max buckets: Space (25), Adjacency (30), Egress (35), Safety/Collisions (10)
  const maxSpace = 25;
  const maxAdjacency = 30;
  const maxEgress = 35;
  const maxSafety = 10;

  const spaceScore = Math.max(0, maxSpace - spaceDeductions);
  const adjacencyScore = Math.max(0, maxAdjacency - adjacencyDeductions);
  const egressScore = Math.max(0, maxEgress - egressDeductions);
  const safetyScore = Math.max(0, maxSafety - safetyDeductions);

  const rawScore = spaceScore + adjacencyScore + egressScore + safetyScore;
  const suitabilityScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine overall status
  let rating = 'CRITICAL HAZARD';
  let ratingColor = 'text-red-600 dark:text-red-400';
  let badgeBg = 'bg-red-500/15 border-red-500/50 text-red-700 dark:bg-red-500/20 dark:text-red-300';

  if (suitabilityScore >= 90) {
    rating = 'FLIGHT CERTIFIED (EXCELLENT)';
    ratingColor = 'text-emerald-600 dark:text-emerald-400';
    badgeBg = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
  } else if (suitabilityScore >= 75) {
    rating = 'ACCEPTABLE (MINOR REVISIONS)';
    ratingColor = 'text-amber-600 dark:text-amber-400';
    badgeBg = 'bg-amber-500/15 border-amber-500/50 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
  } else if (suitabilityScore >= 50) {
    rating = 'SUB-OPTIMAL (REDESIGN RECOMMENDED)';
    ratingColor = 'text-orange-600 dark:text-orange-400';
    badgeBg = 'bg-orange-500/15 border-orange-500/50 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
  }

  return {
    score: suitabilityScore,
    breakdown: {
      spaceScore,
      maxSpace,
      adjacencyScore,
      maxAdjacency,
      egressScore,
      maxEgress,
      safetyScore,
      maxSafety
    },
    deductions: {
      spaceDeductions,
      adjacencyDeductions,
      egressDeductions,
      safetyDeductions
    },
    rating,
    ratingColor,
    badgeBg,
    issues,
    totalArea,
    roomCount: rooms.length,
    evacGraph
  };
}
