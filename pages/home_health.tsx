import React from "react";
import { WeatherCard } from "../components/WeatherCard";
import { HealthAdvice } from "../components/HealthAdvice";
import { API_URL } from "app";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(`${API_URL}/weather/current-weather`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWeatherData(data);
        if (data.is_extreme) {
          toast.warning("Extreme weather conditions detected!");
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError("Failed to fetch weather data");
        toast.error("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fixed weather data for Toronto, Ontario
  const torontoWeather = {
    temperature: -2,
    feelsLike: -2,
    humidity: 77,
    windSpeed: 10,
    condition: "Mostly sunny",
    description: "Mostly sunny",
    icon: "🌤️",
    isExtreme: false,
    health_advice: "It's a bit chilly, dress warmly!"
  };

  return (
    <div className="min-h-screen bg-background bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background.jpg)' }}>
      {/* Navigation */}
      <nav className="border-b bg-white bg-opacity-75">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Weather Health Monitor</h1>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
              <Button variant="ghost" onClick={() => navigate("/history")}>History</Button>
              <Button variant="ghost" onClick={() => navigate("/settings")}>Settings</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Personal Weather & Health Assistant</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Stay informed about weather conditions and receive personalized health advice to keep you safe and healthy.
          </p>
        </section>

        {/* Weather and Health Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Toronto, Ontario</h3>
                  <WeatherCard
                    temperature={torontoWeather.temperature}
                    feelsLike={torontoWeather.feelsLike}
                    humidity={torontoWeather.humidity}
                    windSpeed={torontoWeather.windSpeed}
                    condition={torontoWeather.condition}
                    description={torontoWeather.description}
                    icon={torontoWeather.icon}
                    isExtreme={torontoWeather.isExtreme}
                  />
                  <HealthAdvice
                    advice={torontoWeather.health_advice}
                    isExtreme={torontoWeather.isExtreme}
                  />
                </div>
              ) : weatherData && (
                <>
                  <WeatherCard
                    temperature={weatherData.temperature}
                    feelsLike={weatherData.feels_like}
                    humidity={weatherData.humidity}
                    windSpeed={weatherData.wind_speed}
                    condition={weatherData.condition}
                    description={weatherData.description}
                    icon={weatherData.icon}
                    isExtreme={weatherData.is_extreme}
                  />
                  <HealthAdvice
                    advice={weatherData.health_advice}
                    isExtreme={weatherData.is_extreme}
                  />
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors" 
                    onClick={() => navigate("/history")}>
                <CardHeader>
                  <CardTitle>Weather History</CardTitle>
                  <CardDescription>View past weather conditions and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center text-muted-foreground">📊</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => navigate("/alerts")}>
                <CardHeader>
                  <CardTitle>Weather Alerts</CardTitle>
                  <CardDescription>Configure your weather alert preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center text-muted-foreground">🔔</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => navigate("/health-profile")}>
                <CardHeader>
                  <CardTitle>Health Profile</CardTitle>
                  <CardDescription>Update your health conditions and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center text-muted-foreground">👤</div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => navigate("/reports")}>
                <CardHeader>
                  <CardTitle>Health Reports</CardTitle>
                  <CardDescription>View your personalized health insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center text-muted-foreground">📋</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}