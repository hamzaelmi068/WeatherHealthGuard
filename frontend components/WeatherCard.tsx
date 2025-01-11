import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  isExtreme: boolean;
}

export function WeatherCard({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  condition,
  description,
  icon,
  isExtreme,
}: WeatherCardProps) {
  return (
    <Card className={`w-full max-w-md ${isExtreme ? 'border-red-500 border-2' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={condition}
              className="w-16 h-16"
            />
            <div>
              <h2 className="text-2xl font-bold">{Math.round(temperature)}°C</h2>
              <p className="text-muted-foreground capitalize">{description}</p>
            </div>
          </div>
          {isExtreme && (
            <Badge variant="destructive" className="h-6">
              Extreme Weather
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Feels like {Math.round(feelsLike)}°C
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{windSpeed} m/s wind</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm capitalize">{condition}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
