from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import databutton as db

router = APIRouter(prefix="/weather", tags=["public"])

class HealthProfile(BaseModel):
    user_id: str
    age_group: str
    conditions: list[str]
    weather_sensitivities: list[str]
    temperature_threshold_high: float
    temperature_threshold_low: float
    humidity_sensitivity: bool

@router.post("/create-profile")
def create_profile(profile: HealthProfile):
    try:
        # Store profile in a JSON file
        key = f"profiles/{profile.user_id}"
        db.storage.json.put(key, profile.dict())
        return {"message": "Profile created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-profile/{user_id}")
def get_profile(user_id: str):
    try:
        key = f"profiles/{user_id}"
        profile = db.storage.json.get(key)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update-profile/{user_id}")
def update_profile(user_id: str, profile: HealthProfile):
    try:
        key = f"profiles/{user_id}"
        if not db.storage.json.get(key):
            raise HTTPException(status_code=404, detail="Profile not found")
        db.storage.json.put(key, profile.dict())
        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
