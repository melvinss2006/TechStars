from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from database import init_db, save_layout_db, list_layouts_db, get_layout_db
from validation import validate_habitat_layout

# Initialize Database
init_db()

app = FastAPI(
    title="Habitat Layout Creator API",
    description="Backend validation service, graph BFS evacuation, and SQLite storage for SW-4 (TechStars)",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoomModel(BaseModel):
    id: str
    type: str
    name: str
    x: int
    y: int
    w: int
    h: int

class LayoutModel(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    crewSize: int = 4
    missionProfile: Optional[str] = "lunar_surface"
    rooms: List[RoomModel] = []

class ValidationRequest(BaseModel):
    layout: LayoutModel
    crewSize: Optional[int] = 4

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Habitat Layout Creator Validation Engine (SW-4)",
        "team": "TechStars",
        "leader": "Melvin S",
        "standard": "NASA-STD-3001"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "FastAPI + SQLite"}

@app.post("/api/validate")
def validate(req: ValidationRequest):
    result = validate_habitat_layout(req.layout.dict(), req.crewSize or 4)
    return result

@app.post("/api/layouts")
def save_layout(layout: LayoutModel):
    layout_dict = layout.dict()
    # Compute score before saving
    val = validate_habitat_layout(layout_dict, layout.crewSize)
    layout_dict["score"] = val["score"]
    saved_id = save_layout_db(layout_dict)
    return {"success": True, "id": saved_id, "score": val["score"]}

@app.get("/api/layouts")
def list_layouts():
    return list_layouts_db()

@app.get("/api/layouts/{layout_id}")
def get_layout(layout_id: str):
    data = get_layout_db(layout_id)
    if not data:
        raise HTTPException(status_code=404, detail="Layout not found")
    return data

@app.post("/api/optimize")
def optimize_layout(req: ValidationRequest):
    layout_dict = req.layout.dict()
    crew_size = req.crewSize or 4
    current_val = validate_habitat_layout(layout_dict, crew_size)
    current_score = current_val["score"]

    rooms = layout_dict.get("rooms", [])
    best_swap = None
    highest_score = current_score

    for i in range(len(rooms)):
        for j in range(i + 1, len(rooms)):
            rA, rB = rooms[i], rooms[j]
            # Swap positions
            swapped_rooms = []
            for r in rooms:
                if r["id"] == rA["id"]:
                    swapped_rooms.append({**r, "x": rB["x"], "y": rB["y"]})
                elif r["id"] == rB["id"]:
                    swapped_rooms.append({**r, "x": rA["x"], "y": rA["y"]})
                else:
                    swapped_rooms.append(dict(r))

            candidate_layout = {**layout_dict, "rooms": swapped_rooms}
            c_val = validate_habitat_layout(candidate_layout, crew_size)
            if c_val["score"] > highest_score:
                highest_score = c_val["score"]
                best_swap = {
                    "roomA": rA,
                    "roomB": rB,
                    "oldScore": current_score,
                    "newScore": highest_score,
                    "gain": highest_score - current_score,
                    "optimizedLayout": candidate_layout
                }

    return {"hasOptimization": best_swap is not None, "recommendation": best_swap}

@app.post("/api/explain")
def explain_findings(req: ValidationRequest):
    val = validate_habitat_layout(req.layout.dict(), req.crewSize or 4)
    issues = val["issues"]
    
    explanation_lines = [
        f"Mission Habitation Evaluation for {req.crewSize} crew members.",
        f"Overall Score: {val['score']}/100 ({val['rating']}).",
        f"Total Active Rule Penalties: {len(issues)}."
    ]

    for idx, iss in enumerate(issues, 1):
        explanation_lines.append(f"{idx}. [{iss['category']}] {iss['title']} (Penalty: -{iss['penalty']} pts)")
        explanation_lines.append(f"   Reason: {iss['reason']}")
        explanation_lines.append(f"   Suggested Fix: {iss['fixSuggestion']}")

    return {
        "score": val["score"],
        "rating": val["rating"],
        "summary": "\n".join(explanation_lines),
        "issues": issues
    }
