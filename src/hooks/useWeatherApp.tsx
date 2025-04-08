import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchUserLocationWeather,
  fetchWeatherByCity,
} from "../features/weather/weatherSlice";

const WATCHLIST_KEY = "watchedCities";

export const useWeatherApp = () => {
  const dispatch = useAppDispatch();
  const { userLocation, status, error } = useAppSelector(
    (state) => state.weather
  );

  const [geoCoords, setGeoCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [watchedCities, setWatchedCities] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY);
    if (saved) {
      setWatchedCities(JSON.parse(saved));
    }
  }, []);

  const addCity = (city: any) => {
    const exists = watchedCities.some((c) => c.name === city.name);
    if (!exists) {
      const updated = [...watchedCities, city];
      setWatchedCities(updated);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    }
  };

  const removeCity = (name: string) => {
    const updated = watchedCities.filter((c) => c.name !== name);
    setWatchedCities(updated);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const fetchAndUpdate = (lat: number, lon: number) => {
    dispatch(fetchUserLocationWeather({ lat, lon }));
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude: lat, longitude: lon } = coords;
          setGeoCoords({ lat, lon });
          fetchAndUpdate(lat, lon);

          const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
              fetchAndUpdate(lat, lon);
            }
          }, 15 * 60 * 1000);

          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              fetchAndUpdate(lat, lon);
            }
          });

          return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", () => {});
          };
        },
        (error) => console.error("Geolocation failed:", error)
      );
    }
  }, []);

  const handleManualRefresh = () => {
    if (geoCoords) {
      fetchAndUpdate(geoCoords.lat, geoCoords.lon);
    }
  };

  const handleSearch = (city: string) => {
    dispatch(fetchWeatherByCity(city));
  };

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      const timeout = setTimeout(() => setIsAppLoading(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  return {
    userLocation,
    watchedCities,
    addCity,
    removeCity,
    status,
    error,
    handleManualRefresh,
    lastUpdated,
    handleSearch,
    isAppLoading,
  };
};
