// // src/App.tsx
// import React, { useEffect } from "react";
// import { Container, Typography } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "./app/hooks";
// import {
//   fetchUserLocationWeather,
//   fetchWeatherByCity,
// } from "./features/weather/weatherSlice";
// import WeatherCard from "./components/WeatherCard";
// import ForecastCard from "./components/ForecastCard";
// import SearchBar from "./components/SearchBar";

// const App: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { userLocation, status, error } = useAppSelector(
//     (state) => state.weather
//   );

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         ({ coords }) => {
//           dispatch(
//             fetchUserLocationWeather({
//               lat: coords.latitude,
//               lon: coords.longitude,
//             })
//           );
//         },
//         (error) => {
//           console.error("[ERROR] Geolocation failed:", error.message);
//         }
//       );
//     }
//   }, [dispatch]);

//   const handleSearch = (city: string) => {
//     dispatch(fetchWeatherByCity(city));
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <SearchBar onSearch={handleSearch} />
//       <Typography variant="h4" align="center" sx={{ my: 3 }}>
//         Weather App 🌦️
//       </Typography>

//       {status === "loading" && <Typography>Loading weather data...</Typography>}
//       {status === "failed" && (
//         <Typography color="error">Error: {error}</Typography>
//       )}
//       {userLocation && <WeatherCard data={userLocation.current} />}
//       {userLocation && userLocation.forecast && (
//         <ForecastCard
//           forecast={userLocation.forecast.list}
//           city={userLocation.city}
//         />
//       )}
//     </Container>
//   );
// };

// export default App;

// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Avatar,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  fetchUserLocationWeather,
  fetchWeatherByCity,
} from "./features/weather/weatherSlice";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import SearchBar from "./components/SearchBar";
import TodaysForecast from "./components/TodaysForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import WatchedCities from "./components/WatchedCities";

const WATCHLIST_KEY = "watchedCities";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [watchedCities, setWatchedCities] = useState<any[]>([]);
  const { userLocation, status, error } = useAppSelector(
    (state) => state.weather
  );
  console.log("🚀 ~ userLocation:", userLocation)
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  console.log("isSm", isSm);

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
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          dispatch(
            fetchUserLocationWeather({
              lat: coords.latitude,
              lon: coords.longitude,
            })
          );
        },
        (error) => {
          console.error("[ERROR] Geolocation failed:", error.message);
        }
      );
    }
  }, [dispatch]);

  const handleSearch = (city: string) => {
    dispatch(fetchWeatherByCity(city));
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={5} p={2}>
        <Typography
          variant={isSm ? "h6" : "h4"}
          align="center"
          sx={{ flex: 0.18 }}
        >
          Weather 🌦️
        </Typography>
        <Box flex={!isSm ? 0.615 : 1} maxWidth="lg">
          <SearchBar
            onSearch={handleSearch} onAddCity={addCity}/>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {status === "loading" && (
          <Typography>Loading weather data...</Typography>
        )}
        {status === "failed" && (
          <Typography color="error">Error: {error}</Typography>
        )}

        {userLocation && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <WatchedCities cities={watchedCities} onRemoveCity={removeCity}/>
              <WeatherCard data={userLocation.current} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TodaysForecast forecast={userLocation.forecast?.list || []} />
              <WeeklyForecast forecast={userLocation.forecast?.list || []} />
            </Grid>

            {/* {userLocation.forecast && (
              <Grid size={12}>
                <ForecastCard
                  forecast={userLocation.forecast.list}
                  city={userLocation.city}
                />
              </Grid>
            )} */}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default App;
