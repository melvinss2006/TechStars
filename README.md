# SW-4: HABITAT LAYOUT CREATOR

**Team Name:** TechStars  
**Team Leader:** Melvin S  
**Track:** Software Track  
**Problem Statement Code:** SW-4  
**Regulatory Standards:** NASA-STD-3001 (Human Factors, Habitability and Environmental Health) & NASA Human Integration Design Handbook (HIDH)

---

## 🚀 Overview

The **Habitat Layout Creator** is an interactive 2D decision-support tool that assists mission planners and architects in designing, evaluating, and optimizing space habitat floor plans. Every square metre, module adjacency, and emergency egress route matters in extraterrestrial habitats.

Unlike ordinary floor-plan drawing tools, this creator incorporates a **deterministic aerospace rule engine** that automatically scores the layout, flags acoustic and bio-contamination conflicts, searches evacuation paths using **Breadth-First Search (BFS)** graph traversal, explains every penalty with regulatory rationale, and offers automated room-swap optimizations.

---

## 🌟 Core Features Implemented

| Feature | Description |
| :--- | :--- |
| **1. Interactive 2D Designer** | Add, drag, resize, snap, duplicate, and delete compartments on an interactive grid ($1\text{ unit} = 1.0\text{ m}^2$) with aerospace HUD styling. |
| **2. Space Allocation Check** | Real-time volumetric and floor area checks against NASA-STD-3001 recommendations based on crew size ($2$, $4$, $6$, or $8$ astronauts). |
| **3. Adjacency & Noise Matrix** | Automatically flags acoustic shock (e.g., Exercise gym $>65\text{ dB}$ sharing a bulkhead with Sleeping quarters) and bio-contamination hazards (Hygiene next to Galley food prep). |
| **4. Evacuation BFS Engine** | Graph-based BFS pathfinder ensures every compartment can reach an Airlock exit. Renders animated neon-green evacuation corridors and highlights trapped rooms. |
| **5. Transparent Score & Reasons** | $0-100$ weighted suitability score broken down into Space ($25\text{ pts}$), Acoustics ($30\text{ pts}$), Egress ($35\text{ pts}$), and Geometry ($10\text{ pts}$), with exact NASA citations and recommended fixes. |
| **6. Save & Compare Mode** | Keep versioned snapshots and compare Layout A vs Layout B side-by-side, displaying score deltas ($+18\text{ pts}$), resolved penalties, and area utilization. |
| **7. Smart Room-Swap Optimizer** | Heuristic recommendation engine that identifies high-impact room swaps to resolve conflicts and boost the suitability score in one click. |
| **8. NASA Safety Debrief** | Plain-language human factors debrief summary with one-click clipboard copying and printable format. |
| **9. Built-in Mission Templates** | Includes **Lunar Alpha (Flawed Demo)** (proves detection of errors to judges), **Lunar Alpha (NASA-STD-3001 Compliant)** ($95+\text{ score}$), and **Mars Transit 6-Crew Habitat**. |

---

## 📐 Habitat Zones & Rule Matrix

- **SLEEPING (Crew Quarters):** Quiet zone ($\text{NC-32} / 40\text{ dB}$ max). Must be acoustically isolated from Exercise and Galley.
- **HYGIENE (Sanitation & Waste):** Must maintain physical buffer separation from Galley food preparation.
- **GALLEY (Food Prep & Wardroom):** Communal dining and meal prep.
- **EXERCISE (Gym & Countermeasures):** High noise and structural vibration source. Requires storage or corridor isolation buffers.
- **MEDICAL (Telemedicine & Restraint):** Clean, quiet, and directly reachable in EVA emergency ingress.
- **WORK (Lab & Mission Ops):** Operational and payload consoles.
- **STORAGE (Logistics & ECLSS):** Serves as an ideal acoustic buffer between loud and quiet modules.
- **AIRLOCK (EVA Surface Hatch):** Primary emergency evacuation target.
- **CORRIDOR (Circulation Spine):** Guarantees rapid egress transitions.

---

## 💻 Tech Stack

### Frontend
- **React 18 + Vite**: Lightning-fast browser-based interactive 2D editor.
- **Tailwind CSS**: Dark aerospace Mission Control aesthetic with HUD status telemetry.
- **Lucide React**: Vector aerospace symbology.
- **Canvas-Confetti**: Positive reinforcement when reaching flight-certified layout scores.

### Backend & Data
- **Python 3.13 + FastAPI**: High-performance REST APIs for validation, graph traversal, and optimization.
- **SQLite Database**: Persistent storage for projects, layouts, and version snapshots.
- **Pydantic**: Strict data validation.

---

## ⚡ Quick Start

### Option A: One-Click Launcher (Windows)
Double-click `start-all.bat` in the project root. This opens both the backend server and frontend development server.

### Option B: Manual Launch

#### 1. Start the React Frontend:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

#### 2. Start the FastAPI Backend:
```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API Documentation available at: `http://localhost:8000/docs`

---

## 🏆 Round 1 Prototype Demo Flow for Judges

1. **Open the App:** Notice it loads with the **"Lunar Alpha (Flawed Demo)"** template ($52/100\text{ pts}$ - *Sub-Optimal*).
2. **Review Warnings:** The engine immediately flags:
   - **Critical Warning:** Exercise gym borders Sleeping Quarters (Acoustic violation).
   - **High Warning:** Hygiene borders Galley (Contamination violation).
   - **Critical Warning:** Science Lab is isolated with no escape route to the Airlock!
   - **Space Warning:** Medical Bay is undersized ($6\text{ m}^2$ vs $10\text{ m}^2$ required).
3. **Interactive 2D Editing:**
   - Drag modules and watch the score dynamically recalculate in real-time.
   - Resize Medical Bay using the corner handle; watch the space penalty disappear!
4. **Trigger Evacuation Simulation:** Click **"Evac Simulation"** to watch the dynamic BFS escape paths animate along connected corridors to the airlock.
5. **Use Smart Optimizer:** Click **"Optimize"** -> notice the engine recommends swapping modules to isolate the gym. Click **"Apply Recommendation"** and watch the score jump to $90+$ with confetti!
6. **Compare Layouts:** Click **"Compare"** to inspect side-by-side versions before and after optimization.
7. **Generate NASA Debrief:** Click **"Debrief"** to view and copy the plain-language safety evaluation.
