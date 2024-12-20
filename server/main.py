from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import sqlite3
import uuid
import base64
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure images directory exists
os.makedirs("images", exist_ok=True)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect("inpainting.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS image_pairs (
            id TEXT PRIMARY KEY,
            original_image TEXT NOT NULL,
            mask_image TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

class ImagePair(BaseModel):
    originalImage: str
    maskImage: str

def save_base64_image(base64_str: str, filename: str):
    # Remove data URL prefix if present
    if "base64," in base64_str:
        base64_str = base64_str.split("base64,")[1]
    
    image_data = base64.b64decode(base64_str)
    with open(f"images/{filename}", "wb") as f:
        f.write(image_data)
    return f"/images/{filename}"

@app.post("/images")
async def create_image_pair(image_pair: ImagePair):
    try:
        pair_id = str(uuid.uuid4())
        
        # Save images
        original_filename = f"{pair_id}_original.png"
        mask_filename = f"{pair_id}_mask.png"
        
        original_path = save_base64_image(image_pair.originalImage, original_filename)
        mask_path = save_base64_image(image_pair.maskImage, mask_filename)
        
        # Save to database
        conn = sqlite3.connect("inpainting.db")
        c = conn.cursor()
        c.execute(
            "INSERT INTO image_pairs (id, original_image, mask_image) VALUES (?, ?, ?)",
            (pair_id, original_path, mask_path)
        )
        conn.commit()
        conn.close()
        
        return {
            "id": pair_id,
            "originalImage": original_path,
            "maskImage": mask_path,
            "createdAt": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/images")
async def get_image_pairs():
    conn = sqlite3.connect("inpainting.db")
    c = conn.cursor()
    c.execute("SELECT * FROM image_pairs ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    
    return [{
        "id": row[0],
        "originalImage": row[1],
        "maskImage": row[2],
        "createdAt": row[3]
    } for row in rows]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)