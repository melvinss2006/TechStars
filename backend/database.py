import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "habitat.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mission_type TEXT NOT NULL,
        crew_size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Layouts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS layouts (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        crew_size INTEGER NOT NULL,
        mission_type TEXT NOT NULL,
        score INTEGER,
        data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Version history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS layout_versions (
        id TEXT PRIMARY KEY,
        layout_id TEXT NOT NULL,
        version_num INTEGER NOT NULL,
        score INTEGER,
        data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

def save_layout_db(layout_data: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()

    layout_id = layout_data.get("id") or f"layout_{int(os.times().system * 1000)}"
    name = layout_data.get("name", "Untitled Layout")
    description = layout_data.get("description", "")
    crew_size = layout_data.get("crewSize", 4)
    mission_type = layout_data.get("missionProfile", "lunar_surface")
    score = layout_data.get("score", 0)
    data_json = json.dumps(layout_data)

    cursor.execute("""
    INSERT INTO layouts (id, name, description, crew_size, mission_type, score, data_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        description=excluded.description,
        crew_size=excluded.crew_size,
        mission_type=excluded.mission_type,
        score=excluded.score,
        data_json=excluded.data_json,
        updated_at=CURRENT_TIMESTAMP;
    """, (layout_id, name, description, crew_size, mission_type, score, data_json))

    # Record snapshot in layout_versions
    cursor.execute("SELECT COUNT(*) FROM layout_versions WHERE layout_id = ?", (layout_id,))
    v_count = cursor.fetchone()[0] + 1
    v_id = f"{layout_id}_v{v_count}"
    cursor.execute("""
    INSERT INTO layout_versions (id, layout_id, version_num, score, data_json)
    VALUES (?, ?, ?, ?, ?);
    """, (v_id, layout_id, v_count, score, data_json))

    conn.commit()
    conn.close()
    return layout_id

def list_layouts_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, crew_size, mission_type, score, updated_at FROM layouts ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def get_layout_db(layout_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM layouts WHERE id = ?", (layout_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["data_json"])
    return None
