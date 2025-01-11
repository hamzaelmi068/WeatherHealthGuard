from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List
import databutton as db

router = APIRouter(prefix="/weather-history", tags=["public"])

class WeatherHistoryEntry(BaseModel):
    date: datetime
    temperature: float
    feels_like: float
    humidity: float
    condition: str
    description: str
    wind_speed: float
    is_extreme: bool

class WeatherHistoryResponse(BaseModel):
    history: List[WeatherHistoryEntry]
    temperature_trend: List[float]
    extreme_days: int

def generate_ontario_weather_history(days: int = 7) -> List[WeatherHistoryEntry]:
    # Simulated weather data for Ontario
    base_temp = -2.0  # Current temperature
    entries = []
    
    for i in range(days):
        date = datetime.now() - timedelta(days=i)
        # Add some variation to temperature
        temp_variation = (i % 3 - 1) * 2  # Varies between -2 and 2
        temperature = base_temp + temp_variation
        
        entry = WeatherHistoryEntry(
            date=date,
            temperature=temperature,
            feels_like=temperature - 2,  # Wind chill effect
            humidity=78,  # Current humidity
            condition="Mostly sunny" if temperature > -5 else "Cloudy",
            description="Clear winter day" if temperature > -5 else "Cold winter day",
            wind_speed=10.0,  # Current wind speed
            is_extreme=temperature < -10 or temperature > 30
        )
        entries.append(entry)
    
    return entries

@router.get("/weekly", response_model=WeatherHistoryResponse)
def get_weekly_history() -> WeatherHistoryResponse:
    """Get weather history for the past week.
    
    Returns:
        WeatherHistoryResponse: Weekly weather history including temperature trends
    """
    history = generate_ontario_weather_history(7)
    
    # Extract temperature trend
    temperature_trend = [entry.temperature for entry in history]
    
    # Count extreme weather days
    extreme_days = sum(1 for entry in history if entry.is_extreme)
    
    return WeatherHistoryResponse(
        history=history,
        temperature_trend=temperature_trend,
        extreme_days=extreme_days
    )

@router.get("/monthly", response_model=WeatherHistoryResponse)
def get_monthly_history() -> WeatherHistoryResponse:
    """Get weather history for the past month.
    
    Returns:
        WeatherHistoryResponse: Monthly weather history including temperature trends
    """
    history = generate_ontario_weather_history(30)
    
    # Extract temperature trend
    temperature_trend = [entry.temperature for entry in history]
    
    # Count extreme weather days
    extreme_days = sum(1 for entry in history if entry.is_extreme)
    
    return WeatherHistoryResponse(
        history=history,
        temperature_trend=temperature_trend,
        extreme_days=extreme_days
    )
