// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Grid,
//   Box,
//   useMediaQuery,
//   Theme,
//   CircularProgress,
//   Fade,
// } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "./app/hooks";
// import {
//   fetchUserLocationWeather,
//   fetchWeatherByCity,
// } from "./features/weather/weatherSlice";
// import WeatherCard from "./components/WeatherCard";
// import SearchBar from "./components/SearchBar";
// import TodaysForecast from "./components/TodaysForecast";
// import WeeklyForecast from "./components/WeeklyForecast";
// import WatchedCities from "./components/WatchedCities";

// const WATCHLIST_KEY = "watchedCities";

// const App: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [watchedCities, setWatchedCities] = useState<any[]>([]);
//   const { userLocation, status, error } = useAppSelector(
//     (state) => state.weather
//   );
//   const [lastUpdated, setLastUpdated] = useState<string | null>(null);
//   console.log("🚀 ~ lastUpdated:", lastUpdated);
//   const [isAppLoading, setIsAppLoading] = useState(true);

//   const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

//   useEffect(() => {
//     const saved = localStorage.getItem(WATCHLIST_KEY);
//     if (saved) {
//       setWatchedCities(JSON.parse(saved));
//     }
//   }, []);

//   const addCity = (city: any) => {
//     const exists = watchedCities.some((c) => c.name === city.name);
//     if (!exists) {
//       const updated = [...watchedCities, city];
//       setWatchedCities(updated);
//       localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
//     }
//   };

//   const removeCity = (name: string) => {
//     const updated = watchedCities.filter((c) => c.name !== name);
//     setWatchedCities(updated);
//     localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
//   };

//   // useEffect(() => {
//   //   if (navigator.geolocation) {
//   //     navigator.geolocation.getCurrentPosition(
//   //       ({ coords }) => {
//   //         dispatch(
//   //           fetchUserLocationWeather({
//   //             lat: coords.latitude,
//   //             lon: coords.longitude,
//   //           })
//   //         );
//   //       },
//   //       (error) => {
//   //         console.error("[ERROR] Geolocation failed:", error.message);
//   //       }
//   //     );
//   //   }
//   // }, [dispatch]);

//   useEffect(() => {
//     let lat: number | null = null;
//     let lon: number | null = null;

//     const fetchAndUpdate = () => {
//       if (lat && lon && document.visibilityState === "visible") {
//         dispatch(fetchUserLocationWeather({ lat, lon }));
//         setLastUpdated(new Date().toLocaleTimeString());
//       }
//     };

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         ({ coords }) => {
//           lat = coords.latitude;
//           lon = coords.longitude;
//           fetchAndUpdate(); // Initial fetch

//           const interval = setInterval(fetchAndUpdate, 15 * 60 * 1000); // every 15 mins
//           document.addEventListener("visibilitychange", fetchAndUpdate);

//           return () => {
//             clearInterval(interval);
//             document.removeEventListener("visibilitychange", fetchAndUpdate);
//           };
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

//   useEffect(() => {
//     if (status === "succeeded" || status === "failed") {
//       const timeout = setTimeout(() => setIsAppLoading(false), 600); // add slight delay
//       return () => clearTimeout(timeout);
//     }
//   }, [status]);

//   return (
//     <>
//       <Fade in={isAppLoading}>
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             bgcolor: "rgba(0, 0, 0, 0.6)",
//             zIndex: 9999,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             transition: "opacity 0.3s ease",
//           }}
//         >
//           <CircularProgress size={70} thickness={4} color="inherit" />
//         </Box>
//       </Fade>
//       <Box display={"flex"} alignItems={"center"} gap={5} p={2}>
//         {!isSm && (
//           <Typography
//             variant={isSm ? "h6" : "h4"}
//             align="center"
//             sx={{ flex: 0.18 }}
//           >
//             Weather 🌦️
//           </Typography>
//         )}
//         <Box flex={!isSm ? 0.615 : 1} maxWidth="lg">
//           <SearchBar onSearch={handleSearch} onAddCity={addCity} />
//         </Box>
//       </Box>
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         {status === "failed" && (
//           <Typography color="error">Error: {error}</Typography>
//         )}

//         {userLocation && (
//           <Grid container spacing={3}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <WeatherCard data={userLocation.current} />
//               <WatchedCities cities={watchedCities} onRemoveCity={removeCity} />
//             </Grid>

//             <Grid size={{ xs: 12, md: 6 }}>
//               <TodaysForecast forecast={userLocation.forecast?.list || []} />
//               <WeeklyForecast forecast={userLocation.forecast?.list || []} />
//             </Grid>

//             {/* {userLocation.forecast && (
//               <Grid size={12}>
//                 <ForecastCard
//                   forecast={userLocation.forecast.list}
//                   city={userLocation.city}
//                 />
//               </Grid>
//             )} */}
//           </Grid>
//         )}
//       </Container>
//     </>
//   );
// };

// export default App;

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Theme,
  IconButton,
  Tooltip,
  Fade,
  Button,
  Grow,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  fetchUserLocationWeather,
  fetchWeatherByCity,
} from "./features/weather/weatherSlice";

import WeatherCard from "./components/WeatherCard";
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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [geoCoords, setGeoCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  // 📦 Load saved cities
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

  // 🌐 Auto + periodic refresh
  useEffect(() => {
    const fetchAndUpdate = (lat: number, lon: number) => {
      dispatch(fetchUserLocationWeather({ lat, lon }));
      setLastUpdated(new Date().toLocaleTimeString());
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const lat = coords.latitude;
          const lon = coords.longitude;
          setGeoCoords({ lat, lon });
          fetchAndUpdate(lat, lon); // initial fetch

          const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
              fetchAndUpdate(lat, lon);
            }
          }, 15 * 60 * 1000); // every 15 min

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
        (error) => {
          console.error("[ERROR] Geolocation failed:", error.message);
        }
      );
    }
  }, [dispatch]);

  // Manual Refresh
  const handleManualRefresh = () => {
    if (geoCoords) {
      dispatch(fetchUserLocationWeather(geoCoords));
      setLastUpdated(new Date().toLocaleTimeString());
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

  return (
    <>
      {/* 🌫️ Fullscreen loading on startup */}
      <Fade in={isAppLoading}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "opacity 0.3s ease",
          }}
        >
          <CircularProgress size={70} thickness={4} color="inherit" />
        </Box>
      </Fade>

      {/* 🔍 Header with search + refresh */}
      <Box
        display="flex"
        alignItems="center"
        gap={isSm ? 1 : 2}
        p={isSm ? 1 : 2}
        flexWrap="wrap"
      >
        {!isSm && (
          <Typography variant="h4" sx={{ flex: 1 }}>
            Weather 🌦️
          </Typography>
        )}
        <Box flex={1}>
          <SearchBar onSearch={handleSearch} onAddCity={addCity} />
        </Box>
        {/* 🕒 Last Updated */}
        {userLocation && (
          <Box
            textAlign="center"
            pr={isSm ? 2 : 4}
            display={isSm ? "flex" : "block"}
            flexDirection={isSm ? "column" : "row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated || "just now"}
            </Typography>
            {userLocation && (
              <IconButton onClick={handleManualRefresh} color="primary">
                <Tooltip title="Refresh now">
                  <RefreshIcon />
                </Tooltip>
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* 📦 Main weather content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {status === "failed" && (
          <Grow in>
            <Box
              sx={{
                bgcolor: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 2,
                px: 3,
                py: 2,
                my: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ color: "#b91c1c", fontWeight: 500 }}>
                ⚠️ Error loading weather data. Please try reloading the page.
              </Box>
              <Button
                onClick={() => window.location.reload()}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#b91c1c",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#991b1b",
                  },
                }}
              >
                Reload
              </Button>
            </Box>
          </Grow>
        )}

        {userLocation && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <WeatherCard data={userLocation.current} />
              <WatchedCities cities={watchedCities} onRemoveCity={removeCity} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TodaysForecast forecast={userLocation.forecast?.list || []} />
              <WeeklyForecast forecast={userLocation.forecast?.list || []} />
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default App;
