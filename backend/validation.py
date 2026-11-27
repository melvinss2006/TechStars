import math
from typing import List, Dict, Any, Tuple
from collections import deque

ROOM_TYPES = {
    'SLEEPING': {'name': 'Crew Quarters', 'baseMin': 6.0, 'perCrew': 4.0, 'noise': 'QUIET', 'isExit': False},
    'HYGIENE': {'name': 'Hygiene & Sanitation', 'baseMin': 4.0, 'perCrew': 1.0, 'noise': 'MODERATE', 'isExit': False},
    'GALLEY': {'name': 'Galley & Wardroom', 'baseMin': 10.0, 'perCrew': 2.0, 'noise': 'MODERATE_HIGH', 'isExit': False},
    'EXERCISE': {'name': 'Exercise Countermeasures', 'baseMin': 10.0, 'perCrew': 1.5, 'noise': 'HIGH', 'isExit': False},
    'MEDICAL': {'name': 'Medical Facility', 'baseMin': 10.0, 'perCrew': 1.0, 'noise': 'QUIET', 'isExit': False},
    'WORK': {'name': 'Workstation / Lab', 'baseMin': 12.0, 'perCrew': 2.0, 'noise': 'MODERATE', 'isExit': False},
    'STORAGE': {'name': 'Logistics Storage', 'baseMin': 8.0, 'perCrew': 2.0, 'noise': 'QUIET', 'isExit': False},
    'AIRLOCK': {'name': 'Airlock / Surface Exit', 'baseMin': 6.0, 'perCrew': 0.5, 'noise': 'MODERATE', 'isExit': True},
    'CORRIDOR': {'name': 'Corridor Circulation', 'baseMin': 4.0, 'perCrew': 0.0, 'noise': 'PASSIVE', 'isExit': False, 'isPassage': True}
}

ADJACENCY_RULES = [
    {
        'typeA': 'EXERCISE', 'typeB': 'SLEEPING', 'severity': 'CRITICAL', 'penalty': 20,
        'title': 'Acoustic Shock Violation: Exercise ↔ Sleeping',
        'reason': 'Exercise module shares a bulkhead with Crew Sleeping Quarters (>65 dB acoustic shock).',
        'reference': 'NASA-STD-3001 Vol 2, Sec 7.2.1',
        'fix': 'Insert a corridor or storage buffer compartment between gym and sleeping quarters.'
    },
    {
        'typeA': 'HYGIENE', 'typeB': 'GALLEY', 'severity': 'HIGH', 'penalty': 15,
        'title': 'Cross-Contamination Hazard: Hygiene ↔ Galley',
        'reason': 'Hygiene & waste facility shares direct wall with food preparation galley.',
        'reference': 'NASA-STD-3001 Vol 2, Sec 7.3.2',
        'fix': 'Separate hygiene waste module from galley food prep area.'
    },
    {
        'typeA': 'EXERCISE', 'typeB': 'MEDICAL', 'severity': 'MEDIUM', 'penalty': 10,
        'title': 'Vibrational Diagnostic Interference: Exercise ↔ Medical',
        'reason': 'Vibrations from exercise countermeasures disrupt delicate medical diagnostic sensors.',
        'reference': 'NASA-STD-3001 Vol 2, Sec 6.1.4',
        'fix': 'Relocate medical bay away from exercise hardware.'
    },
    {
        'typeA': 'GALLEY', 'typeB': 'SLEEPING', 'severity': 'MEDIUM', 'penalty': 8,
        'title': 'Olfactory & Shift Disruption: Galley ↔ Sleeping',
        'reason': 'Food aromas and mess-hall chatter disrupt resting crew members.',
        'reference': 'NASA-STD-3001 Vol 2, Sec 7.1.3',
        'fix': 'Position galley near work/social zones rather than quiet quarters.'
    }
]

def check_adjacency(room_a: Dict[str, Any], room_b: Dict[str, Any]) -> Tuple[bool, bool, float]:
    ax1, ay1, ax2, ay2 = room_a['x'], room_a['y'], room_a['x'] + room_a['w'], room_a['y'] + room_a['h']
    bx1, by1, bx2, by2 = room_b['x'], room_b['y'], room_b['x'] + room_b['w'], room_b['y'] + room_b['h']

    x_overlap = max(0, min(ax2, bx2) - max(ax1, bx1))
    y_overlap = max(0, min(ay2, by2) - max(ay1, by1))

    is_colliding = (x_overlap > 0) and (y_overlap > 0)
    horizontal_touch = (ay2 == by1 or by2 == ay1) and x_overlap >= 1
    vertical_touch = (ax2 == bx1 or bx2 == ax1) and y_overlap >= 1

    is_adjacent = horizontal_touch or vertical_touch or is_colliding
    contact_length = x_overlap if horizontal_touch else (y_overlap if vertical_touch else min(x_overlap, y_overlap))
    return is_adjacent, is_colliding, contact_length

def run_evacuation_bfs(rooms: List[Dict[str, Any]]) -> Dict[str, Any]:
    adj = {r['id']: [] for r in rooms}
    for i in range(len(rooms)):
        for j in range(i + 1, len(rooms)):
            is_adj, _, _ = check_adjacency(rooms[i], rooms[j])
            if is_adj:
                adj[rooms[i]['id']].append(rooms[j]['id'])
                adj[rooms[j]['id']].append(rooms[i]['id'])

    exits = {r['id'] for r in rooms if ROOM_TYPES.get(r['type'], {}).get('isExit', False)}
    room_map = {r['id']: r for r in rooms}
    results = {}

    for r in rooms:
        rid = r['id']
        if rid in exits:
            results[rid] = {'reachable': True, 'hops': 0, 'distance': 0.0, 'path': [rid]}
            continue

        q = deque([[rid]])
        visited = {rid}
        found_path = None

        while q:
            path = q.popleft()
            curr = path[-1]
            if curr in exits:
                found_path = path
                break
            for nbr in adj.get(curr, []):
                if nbr not in visited:
                    visited.add(nbr)
                    q.append(path + [nbr])

        if found_path:
            dist = 0.0
            for i in range(len(found_path) - 1):
                r1 = room_map[found_path[i]]
                r2 = room_map[found_path[i+1]]
                c1x, c1y = r1['x'] + r1['w']/2, r1['y'] + r1['h']/2
                c2x, c2y = r2['x'] + r2['w']/2, r2['y'] + r2['h']/2
                dist += math.hypot(c2x - c1x, c2y - c1y)

            results[rid] = {
                'reachable': True,
                'hops': len(found_path) - 1,
                'distance': round(dist, 1),
                'path': found_path
            }
        else:
            results[rid] = {
                'reachable': False,
                'hops': -1,
                'distance': -1.0,
                'path': []
            }

    return {'has_exit': len(exits) > 0, 'status': results}

def validate_habitat_layout(layout: Dict[str, Any], crew_size: int = 4) -> Dict[str, Any]:
    rooms = layout.get('rooms', [])
    issues = []
    space_deductions = 0
    adj_deductions = 0
    egress_deductions = 0
    safety_deductions = 0
    total_area = 0

    # 1. Collisions
    for i in range(len(rooms)):
        for j in range(i + 1, len(rooms)):
            rA, rB = rooms[i], rooms[j]
            _, is_col, contact = check_adjacency(rA, rB)
            if is_col:
                safety_deductions += 25
                issues.append({
                    'id': f"COLLISION_{rA['id']}_{rB['id']}",
                    'category': 'Geometry',
                    'severity': 'CRITICAL',
                    'penalty': 25,
                    'title': f"Overlap: {rA.get('name')} & {rB.get('name')}",
                    'affectedRoomIds': [rA['id'], rB['id']],
                    'reason': f"Bulkhead collision ({contact}m overlap).",
                    'reference': 'NASA-STD-3001 Vol 2, Sec 8.1',
                    'fixSuggestion': 'Nudge compartments apart to clear space.'
                })

    # 2. Space Allocation
    room_types_present = set()
    for r in rooms:
        rtype = r.get('type')
        room_types_present.add(rtype)
        area = r.get('w', 0) * r.get('h', 0)
        total_area += area
        rdef = ROOM_TYPES.get(rtype, {})

        if not rdef.get('isPassage'):
            min_req = max(rdef.get('baseMin', 6.0), rdef.get('perCrew', 1.0) * crew_size)
            if area < min_req:
                deficit = round(min_req - area, 1)
                penalty = min(15, math.ceil(deficit * 2.5))
                space_deductions += penalty
                issues.append({
                    'id': f"SPACE_{r['id']}",
                    'category': 'Space Allocation',
                    'severity': 'HIGH' if deficit > 4 else 'MEDIUM',
                    'penalty': penalty,
                    'title': f"Undersized: {r.get('name')}",
                    'affectedRoomIds': [r['id']],
                    'reason': f"Area is {area}m², required min is {min_req}m² for crew of {crew_size}.",
                    'reference': 'NASA-STD-3001 Vol 2, Sec 7',
                    'fixSuggestion': f"Enlarge module by {deficit}m²."
                })

    if 'AIRLOCK' not in room_types_present:
        egress_deductions += 35
        issues.append({
            'id': 'MISSING_AIRLOCK',
            'category': 'Emergency Egress',
            'severity': 'CRITICAL',
            'penalty': 35,
            'title': 'No Airlock Exit Designated',
            'affectedRoomIds': [],
            'reason': 'Habitat possesses no emergency surface airlock exit.',
            'reference': 'NASA-STD-3001 Vol 2, Sec 8.4',
            'fixSuggestion': 'Add an AIRLOCK compartment.'
        })

    # 3. Adjacency & Noise
    for i in range(len(rooms)):
        for j in range(i + 1, len(rooms)):
            rA, rB = rooms[i], rooms[j]
            is_adj, is_col, _ = check_adjacency(rA, rB)
            if is_adj and not is_col:
                for rule in ADJACENCY_RULES:
                    if (rule['typeA'] == rA['type'] and rule['typeB'] == rB['type']) or \
                       (rule['typeA'] == rB['type'] and rule['typeB'] == rA['type']):
                        adj_deductions += rule['penalty']
                        issues.append({
                            'id': f"ADJ_{rA['id']}_{rB['id']}",
                            'category': 'Adjacency & Noise',
                            'severity': rule['severity'],
                            'penalty': rule['penalty'],
                            'title': rule['title'],
                            'affectedRoomIds': [rA['id'], rB['id']],
                            'reason': rule['reason'],
                            'reference': rule['reference'],
                            'fixSuggestion': rule['fix']
                        })

    # 4. BFS Evacuation Check
    bfs_result = run_evacuation_bfs(rooms)
    if bfs_result['has_exit']:
        for r in rooms:
            stat = bfs_result['status'].get(r['id'])
            if stat and not stat['reachable']:
                egress_deductions += 25
                issues.append({
                    'id': f"TRAPPED_{r['id']}",
                    'category': 'Emergency Egress',
                    'severity': 'CRITICAL',
                    'penalty': 25,
                    'title': f"Evacuation Trapped: {r.get('name')}",
                    'affectedRoomIds': [r['id']],
                    'reason': f"No connected egress path to any airlock exit.",
                    'reference': 'NASA-STD-3001 Vol 2, Sec 8.4.1',
                    'fixSuggestion': 'Link module to corridor or adjacent exit path.'
                })

    # 5. Weighted Score
    space_score = max(0, 25 - space_deductions)
    adj_score = max(0, 30 - adj_deductions)
    egress_score = max(0, 35 - egress_deductions)
    safety_score = max(0, 10 - safety_deductions)

    total_score = max(0, min(100, space_score + adj_score + egress_score + safety_score))

    rating = 'CRITICAL HAZARD'
    if total_score >= 90:
        rating = 'FLIGHT CERTIFIED (EXCELLENT)'
    elif total_score >= 75:
        rating = 'ACCEPTABLE (MINOR REVISIONS)'
    elif total_score >= 50:
        rating = 'SUB-OPTIMAL (REDESIGN RECOMMENDED)'

    return {
        'score': total_score,
        'rating': rating,
        'totalArea': total_area,
        'breakdown': {
            'spaceScore': space_score,
            'maxSpace': 25,
            'adjacencyScore': adj_score,
            'maxAdjacency': 30,
            'egressScore': egress_score,
            'maxEgress': 35,
            'safetyScore': safety_score,
            'maxSafety': 10
        },
        'issues': issues,
        'evacuationGraph': bfs_result
    }
