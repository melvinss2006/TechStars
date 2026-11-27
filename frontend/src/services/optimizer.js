import { validateLayout } from './validationEngine';

/**
 * Heuristic Layout Optimizer:
 * Tests pairwise room swaps or repositioning to find configurations
 * that increase the suitability score and resolve adjacency/egress issues.
 */
export function findBestOptimization(layout, crewSize, missionProfileId) {
  const currentValidation = validateLayout(layout, crewSize, missionProfileId);
  const currentScore = currentValidation.score;

  if (currentScore >= 98 || layout.rooms.length < 2) {
    return null; // Already near optimal
  }

  const rooms = layout.rooms;
  let bestSwap = null;
  let highestScore = currentScore;
  let bestNewRooms = null;

  // Try swapping pairs of non-exit rooms
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const roomA = rooms[i];
      const roomB = rooms[j];

      // Clone rooms and swap their coordinates and dimensions
      const swappedRooms = rooms.map(r => {
        if (r.id === roomA.id) {
          return { ...r, x: roomB.x, y: roomB.y, w: roomA.w, h: roomA.h };
        }
        if (r.id === roomB.id) {
          return { ...r, x: roomA.x, y: roomA.y, w: roomB.w, h: roomB.h };
        }
        return { ...r };
      });

      const candidateLayout = { ...layout, rooms: swappedRooms };
      const candidateValidation = validateLayout(candidateLayout, crewSize, missionProfileId);

      if (candidateValidation.score > highestScore) {
        highestScore = candidateValidation.score;
        bestNewRooms = swappedRooms;
        bestSwap = {
          roomA,
          roomB,
          oldScore: currentScore,
          newScore: candidateValidation.score,
          gain: candidateValidation.score - currentScore,
          resolvedIssuesCount: currentValidation.issues.length - candidateValidation.issues.length,
          newLayout: candidateLayout
        };
      }
    }
  }

  // If no simple swap improved the score, try nudging disconnected rooms toward a corridor or adjacent module
  if (!bestSwap && currentValidation.issues.some(i => i.id.startsWith('EGRESS_TRAP'))) {
    const trappedIssue = currentValidation.issues.find(i => i.id.startsWith('EGRESS_TRAP'));
    const trappedRoomId = trappedIssue.affectedRoomIds[0];
    const trappedRoom = rooms.find(r => r.id === trappedRoomId);
    const corridorOrExit = rooms.find(r => r.type === 'CORRIDOR' || r.type === 'AIRLOCK');

    if (trappedRoom && corridorOrExit) {
      // Reposition trapped room adjacent to corridor/exit
      const candidateRooms = rooms.map(r => {
        if (r.id === trappedRoom.id) {
          return {
            ...r,
            x: corridorOrExit.x + corridorOrExit.w,
            y: corridorOrExit.y
          };
        }
        return { ...r };
      });

      const candidateLayout = { ...layout, rooms: candidateRooms };
      const candidateValidation = validateLayout(candidateLayout, crewSize, missionProfileId);

      if (candidateValidation.score > currentScore) {
        bestSwap = {
          roomA: trappedRoom,
          roomB: corridorOrExit,
          type: 'CONNECT',
          oldScore: currentScore,
          newScore: candidateValidation.score,
          gain: candidateValidation.score - currentScore,
          resolvedIssuesCount: currentValidation.issues.length - candidateValidation.issues.length,
          newLayout: candidateLayout
        };
      }
    }
  }

  return bestSwap;
}
