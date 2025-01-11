import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { toast } from "sonner";
import { API_URL } from "app";

interface WeatherHistoryEntry {
  date: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  condition: string;
  description: string;
  wind_speed: number;
  is_extreme: boolean;
}

interface WeatherHistoryData {
  history: WeatherHistoryEntry[];
  temperature_trend: number[];
  extreme_days: number;
}

export default function WeatherHistory() {
  const [period, setPeriod] = React.useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<WeatherHistoryData | null>(null);

  const fetchWeatherHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/weather-history/${period}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error('Weather history fetch error:', err);
      setError("Failed to fetch weather history");
      toast.error("Failed to fetch weather history");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeatherHistory();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const chartData = data?.history.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    temperature: entry.temperature,
    feelsLike: entry.feels_like
  })).reverse();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weather History</h1>
          <div className="space-x-4">
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "monthly" ? "default" : "outline"}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Temperature Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Temperature Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit="°C" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#2563eb"
                    name="Temperature"
                  />
                  <Line
                    type="monotone"
                    dataKey="feelsLike"
                    stroke="#7c3aed"
                    name="Feels Like"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weather Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Weather Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Extreme Weather Days</p>
                  <p className="text-2xl font-bold">{data?.extreme_days} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Temperature</p>
                  <p className="text-2xl font-bold">
                    {data?.temperature_trend.reduce((a, b) => a + b, 0) / data?.temperature_trend.length}°C
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.history.slice(0, 3).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </p>
                      <p className="font-medium">{entry.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{entry.temperature}°C</p>
                      <p className="text-sm text-muted-foreground">
                        Humidity: {entry.humidity}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
