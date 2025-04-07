import axios from "axios";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const reverseGeocode = async (lat: number, lon: number) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  return res.data[0]; // returns { name, country }
};

export const getCurrentWeather = async (lat: number, lon: number) => {
  if (!API_KEY) throw new Error("API key is missing");

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid: API_KEY,
      },
    }
  );

  return response.data; // includes temp, weather, etc.
};

export const getForecastWeather = async (lat: number, lon: number) => {
  if (!API_KEY) throw new Error("API key is missing");

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid: API_KEY,
      },
    }
  );

  return response.data; // 3-hour interval forecast for 5 days
};

export const fetchWeatherData = async (lat: number, lon: number) => {
  const [currentRes, forecastRes] = await Promise.all([
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { lat, lon, units: "metric", appid: API_KEY },
    }),
    axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: { lat, lon, units: "metric", appid: API_KEY },
    }),
  ]);

  return {
    current: currentRes.data,
    forecast: forecastRes.data,
  };
};

export const getWeatherByCity = async (city: string) => {
  if (!API_KEY) throw new Error("API key is missing");

  const [currentRes, forecastRes] = await Promise.all([
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { q: city, units: "metric", appid: API_KEY },
    }),
    axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: { q: city, units: "metric", appid: API_KEY },
    }),
  ]);
  return {
    city: currentRes.data.name,
    country: currentRes.data.sys.country,
    lat: currentRes.data.coord.lat,
    lon: currentRes.data.coord.lon,
    current: currentRes.data,
    forecast: forecastRes.data,
  };
};

export const searchCities = async (query: string) => {
  const res = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  );
  return res.data; // returns array of matching cities
};
